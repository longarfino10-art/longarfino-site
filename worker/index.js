// Worker na frente do site estático.
//
// Só existe por causa de uma rota: POST /api/publicar, que o painel usa
// para gravar obra e fotos no repositório. Todo o resto cai nos arquivos
// gerados pelo Astro, sem passar por nada.
//
// O token do GitHub vive aqui como segredo do Worker. O Lucas nunca vê
// nem digita token nenhum — era esse o ponto de ter um backend.
//
// Variáveis (wrangler.jsonc) e segredos (painel da Cloudflare):
//   ACCESS_TEAM    nome do time no Zero Trust, sem .cloudflareaccess.com
//   ACCESS_AUD     tag AUD da aplicação do Access
//   GITHUB_REPO    longarfino10-art/longarfino-site
//   GITHUB_BRANCH  main
//   GITHUB_TOKEN   segredo, token fine-grained com Contents: read & write
//   PAINEL_SENHA   segredo, senha do painel enquanto o Zero Trust não sobe
//
// Proteção, em ordem de preferência:
//   1. Access configurado (ACCESS_TEAM + ACCESS_AUD) → só vale o Access
//   2. Senão, PAINEL_SENHA definida → vale a senha
//   3. Nenhum dos dois → recusa tudo
// Quando o Zero Trust for ligado, basta preencher as duas variáveis: a
// senha deixa de ser aceita sem mudar uma linha de código.

import { montarArquivos, montarVitrine, montarNumeros, montarDepoimentos, montarTudo } from './montar.js';

// O plano gratuito do Workers permite 50 chamadas de rede por requisição.
// O commit gasta 5 fixas e 1 por foto (texto vai junto na árvore, sem
// chamada própria). 40 fotos por publicação deixa folga.
const MAX_FOTOS_POR_PUBLICACAO = 40;

// Dados do site que o painel grava além das obras. Cada um tem o seu
// montador (testável no node) e a mensagem do commit.
const DADOS = {
  '/api/vitrine': { montar: montarVitrine, mensagem: 'vitrine: atualiza as fotos da capa' },
  '/api/numeros': { montar: montarNumeros, mensagem: 'numeros: atualiza o histórico fora do site' },
  '/api/depoimentos': { montar: montarDepoimentos, mensagem: 'depoimentos: atualiza a lista' },
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/publicar') {
      return comErro(() => publicar(request, env));
    }

    if (url.pathname === '/api/entrar') {
      return comErro(() => entrar(request, env));
    }

    if (DADOS[url.pathname]) {
      return comErro(() => gravarDados(request, env, DADOS[url.pathname]));
    }

    if (url.pathname === '/api/publicar-tudo') {
      return comErro(() => publicarTudo(request, env));
    }

    // Qualquer outra coisa é o site estático
    return env.ASSETS.fetch(request);
  },
};

// ── resposta ────────────────────────────────────────────────────────

const json = (dados, status = 200) =>
  new Response(JSON.stringify(dados), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Resposta do painel nunca fica em cache nem é interpretada como outra coisa
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });

async function comErro(fn) {
  try {
    return await fn();
  } catch (e) {
    // erros = lista de problemas do formulário, tratados como 400
    if (e && e.erros) return json({ ok: false, erros: e.erros }, 400);
    return json({ ok: false, erros: [e?.message || 'erro inesperado'] }, 500);
  }
}

// ── rota ────────────────────────────────────────────────────────────

// O painel chama ao abrir. Com Access, passa direto e a tela de senha nem
// aparece; com senha, confere antes de deixar a pessoa preencher tudo.
async function entrar(request, env) {
  if (request.method !== 'POST') return json({ ok: false, erros: ['método'] }, 405);
  const negado = await autorizar(request, env);
  if (negado) return json({ ok: false, erros: [negado] }, 403);
  return json({ ok: true, modo: temAccess(env) ? 'access' : 'senha' });
}

async function publicar(request, env) {
  if (request.method !== 'POST') return json({ ok: false, erros: ['método'] }, 405);

  const negado = await autorizar(request, env);
  if (negado) return json({ ok: false, erros: [negado] }, 403);

  const dados = await request.json();
  const { slug, arquivos } = montarArquivos(dados);

  // Ensaio: só existe no .dev.vars local. Devolve o que seria gravado em
  // vez de gravar — é como se testa o painel sem mexer no repositório.
  if (env.PAINEL_ENSAIO === '1') {
    return json({
      ok: true,
      ensaio: true,
      slug,
      arquivos: arquivos.map((a) =>
        a.base64 ? { caminho: a.caminho, bytes: a.base64.length } : a,
      ),
    });
  }

  const quemEnviou = request.headers.get('Cf-Access-Authenticated-User-Email') || 'painel';
  const mensagem =
    (dados.slug ? 'obra: atualiza ' : 'obra: publica ') + slug + '\n\nPelo painel, por ' + quemEnviou;

  const commit = await commitar(env, arquivos, mensagem);

  return json({
    ok: true,
    slug,
    commit: commit.sha.slice(0, 7),
    arquivos: arquivos.length,
  });
}

// Todas as alterações salvas no rascunho do painel, num commit só
async function publicarTudo(request, env) {
  if (request.method !== 'POST') return json({ ok: false, erros: ['método'] }, 405);

  const negado = await autorizar(request, env);
  if (negado) return json({ ok: false, erros: [negado] }, 403);

  const { arquivos, resumo } = montarTudo(await request.json());

  const fotos = arquivos.filter((a) => a.base64).length;
  if (fotos > MAX_FOTOS_POR_PUBLICACAO) {
    return json({
      ok: false,
      erros: [
        'São ' + fotos + ' fotos novas nesta publicação; o limite é ' + MAX_FOTOS_POR_PUBLICACAO +
          '. Publique uma parte, espere 2 minutos e publique o resto.',
      ],
    }, 400);
  }

  if (env.PAINEL_ENSAIO === '1') {
    return json({
      ok: true,
      ensaio: true,
      resumo,
      arquivos: arquivos.map((a) => (a.base64 ? { caminho: a.caminho, bytes: a.base64.length } : a)),
    });
  }

  const quemEnviou = request.headers.get('Cf-Access-Authenticated-User-Email') || 'painel';
  const titulo = resumo.length === 1 ? resumo[0] : 'painel: ' + resumo.length + ' alterações';
  const corpo = resumo.length === 1 ? '' : resumo.map((r) => '- ' + r).join('\n') + '\n\n';
  const commit = await commitar(env, arquivos, titulo + '\n\n' + corpo + 'Pelo painel, por ' + quemEnviou);

  return json({ ok: true, commit: commit.sha.slice(0, 7), arquivos: arquivos.length, resumo });
}

// Vitrine, números e depoimentos: mesma porta, montador diferente
async function gravarDados(request, env, { montar, mensagem }) {
  if (request.method !== 'POST') return json({ ok: false, erros: ['método'] }, 405);

  const negado = await autorizar(request, env);
  if (negado) return json({ ok: false, erros: [negado] }, 403);

  const { arquivos } = montar(await request.json());

  if (env.PAINEL_ENSAIO === '1') {
    return json({
      ok: true,
      ensaio: true,
      arquivos: arquivos.map((a) => (a.base64 ? { caminho: a.caminho, bytes: a.base64.length } : a)),
    });
  }

  const quemEnviou = request.headers.get('Cf-Access-Authenticated-User-Email') || 'painel';
  const commit = await commitar(env, arquivos, mensagem + '\n\nPelo painel, por ' + quemEnviou);
  return json({ ok: true, commit: commit.sha.slice(0, 7), arquivos: arquivos.length });
}

// ── autorização ─────────────────────────────────────────────────────

const temAccess = (env) => Boolean(env.ACCESS_TEAM && env.ACCESS_AUD);

async function autorizar(request, env) {
  if (temAccess(env)) return verificarAccess(request, env);
  if (env.PAINEL_SENHA) return verificarSenha(request, env);
  return 'Painel sem proteção configurada — publicação recusada';
}

async function resumo(texto) {
  const dados = new TextEncoder().encode(texto);
  return new Uint8Array(await crypto.subtle.digest('SHA-256', dados));
}

// Compara os resumos SHA-256, não as senhas: assim os dois lados têm
// sempre o mesmo tamanho e a comparação em tempo constante funciona —
// o tempo de resposta não entrega quantas letras estavam certas.
async function verificarSenha(request, env) {
  const enviada = request.headers.get('X-Painel-Senha') || '';

  // Sem senha nenhuma não é tentativa: é o painel perguntando se precisa
  // mostrar a tela de entrada. Responde na hora, sem o atraso.
  if (!enviada) return 'Digite a senha do painel';

  const a = await resumo(enviada);
  const b = await resumo(env.PAINEL_SENHA);

  if (crypto.subtle.timingSafeEqual(a, b)) return null;

  // Atraso em toda tentativa errada: torna inviável testar senhas em série
  await new Promise((r) => setTimeout(r, 1500));
  return 'Senha incorreta';
}

// ── Cloudflare Access ───────────────────────────────────────────────
//
// Sem isto, qualquer pessoa na internet poderia postar obra no site: o
// Access protege a PÁGINA, mas a API precisa conferir por conta própria.

function base64url(s) {
  const b = s.replace(/-/g, '+').replace(/_/g, '/');
  return atob(b + '='.repeat((4 - (b.length % 4)) % 4));
}

function bytes(s) {
  const bin = base64url(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function verificarAccess(request, env) {
  if (!env.ACCESS_TEAM || !env.ACCESS_AUD) {
    return 'Access não configurado no Worker';
  }

  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return 'Entre pelo painel: credencial do Access ausente';

  const partes = jwt.split('.');
  if (partes.length !== 3) return 'Credencial malformada';

  let cabecalho;
  let corpo;
  try {
    cabecalho = JSON.parse(base64url(partes[0]));
    corpo = JSON.parse(base64url(partes[1]));
  } catch {
    return 'Credencial ilegível';
  }

  if (!corpo.exp || corpo.exp * 1000 < Date.now()) return 'Credencial expirada, entre de novo';
  if (![].concat(corpo.aud ?? []).includes(env.ACCESS_AUD)) return 'Credencial de outra aplicação';

  const certs = await fetch(
    'https://' + env.ACCESS_TEAM + '.cloudflareaccess.com/cdn-cgi/access/certs',
  ).then((r) => r.json());

  const jwk = (certs.keys ?? []).find((k) => k.kid === cabecalho.kid);
  if (!jwk) return 'Chave da credencial não reconhecida';

  const chave = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const valida = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    chave,
    bytes(partes[2]),
    new TextEncoder().encode(partes[0] + '.' + partes[1]),
  );

  return valida ? null : 'Assinatura da credencial inválida';
}

// ── GitHub ──────────────────────────────────────────────────────────
//
// Um commit só, com todos os arquivos juntos, pela Git Data API. Gravar
// arquivo por arquivo pela Contents API geraria um commit por foto e um
// build por commit.

async function gh(url, opcoes) {
  const r = await fetch(url, opcoes);
  if (!r.ok) {
    // O token expira em 17/11/2027. Quando vencer, o erro precisa dizer
    // o que fazer — "GitHub 401" sozinho não ajuda ninguém.
    if (r.status === 401) {
      throw new Error(
        'O token do GitHub venceu ou foi apagado. Gere outro (Contents: leitura e escrita, só o repositório longarfino-site) e troque o segredo GITHUB_TOKEN no Cloudflare.',
      );
    }
    if (r.status === 403 || r.status === 404) {
      throw new Error(
        'O token do GitHub não tem permissão no repositório. Confira: Contents com leitura e escrita, repositório longarfino-site selecionado.',
      );
    }
    const texto = await r.text();
    throw new Error('GitHub ' + r.status + ': ' + texto.slice(0, 300));
  }
  return r.json();
}

async function commitar(env, arquivos, mensagem) {
  if (!env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN não configurado no Worker');

  const api = 'https://api.github.com/repos/' + env.GITHUB_REPO;
  const ramo = env.GITHUB_BRANCH || 'main';
  const cab = {
    Authorization: 'Bearer ' + env.GITHUB_TOKEN,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'longarfino-painel',
    'Content-Type': 'application/json',
  };

  const ref = await gh(api + '/git/ref/heads/' + ramo, { headers: cab });
  const shaBase = ref.object.sha;
  const commitBase = await gh(api + '/git/commits/' + shaBase, { headers: cab });

  // Texto vai direto na árvore (sem chamada própria); só foto precisa de
  // blob — é o que mantém a publicação dentro do limite de chamadas.
  const arvore = [];
  for (const a of arquivos) {
    if (!a.base64) {
      arvore.push({ path: a.caminho, mode: '100644', type: 'blob', content: a.conteudo });
      continue;
    }
    const blob = await gh(api + '/git/blobs', {
      method: 'POST',
      headers: cab,
      body: JSON.stringify({ content: a.base64, encoding: 'base64' }),
    });
    arvore.push({ path: a.caminho, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const nova = await gh(api + '/git/trees', {
    method: 'POST',
    headers: cab,
    body: JSON.stringify({ base_tree: commitBase.tree.sha, tree: arvore }),
  });

  const commit = await gh(api + '/git/commits', {
    method: 'POST',
    headers: cab,
    body: JSON.stringify({ message: mensagem, tree: nova.sha, parents: [shaBase] }),
  });

  await gh(api + '/git/refs/heads/' + ramo, {
    method: 'PATCH',
    headers: cab,
    body: JSON.stringify({ sha: commit.sha }),
  });

  return commit;
}
