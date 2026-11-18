// Monta os arquivos de uma obra a partir do que o painel enviou.
//
// Sem nada de Cloudflare aqui de propósito: este módulo roda igual no
// Worker e no node, e por isso é a parte que dá para testar de verdade.
// O resto do Worker é só rede.
//
// A saída tem de casar exatamente com src/content.config.ts. O caminho das
// fotos é o ponto sensível: tem de sair como
//   ./../../assets/obras/<slug>/arquivo.jpeg
// senão o image() do schema não resolve e o build falha.

export const TIPOS = ['Bowl', 'Street', 'Park', 'Reforma'];
export const SITUACOES = ['a_fazer', 'fazendo', 'feita'];
export const STATUS = ['concluida', 'em_execucao'];

/** "Pista Morrinhos" -> "pista-morrinhos" */
export function slugificar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Nome de arquivo seguro: minúsculo, sem acento, sem espaço.
 * O build roda em Linux, onde .JPEG e .jpeg são arquivos diferentes.
 */
export function nomeArquivo(original, usados) {
  const limpo = String(original ?? 'foto')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

  const ponto = limpo.lastIndexOf('.');
  let base = ponto > 0 ? limpo.slice(0, ponto) : limpo;
  let ext = ponto > 0 ? limpo.slice(ponto + 1) : 'jpeg';

  base = base.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'foto';
  ext = ext.replace(/[^a-z0-9]/g, '') || 'jpeg';
  if (ext === 'jpg') ext = 'jpeg';

  let nome = base + '.' + ext;
  let n = 2;
  while (usados.has(nome)) {
    nome = base + '-' + n + '.' + ext;
    n++;
  }
  usados.add(nome);
  return nome;
}

/** Aspas duplas com escape — serve para qualquer texto do formulário */
function aspas(v) {
  return '"' + String(v ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

/** 2026-11-17 */
export function dataISO(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

/** Devolve a lista de problemas. Vazia = pode publicar. */
export function validar(d) {
  const e = [];
  if (!String(d.nome ?? '').trim()) e.push('Falta o nome da obra');
  if (!String(d.cidade ?? '').trim()) e.push('Falta a cidade');
  if (!(Number(d.area_m2) > 0)) e.push('Área em m² tem de ser maior que zero');
  if (!Array.isArray(d.tipo) || d.tipo.length === 0) e.push('Escolha ao menos um tipo');
  if (Array.isArray(d.tipo) && d.tipo.some((t) => !TIPOS.includes(t))) e.push('Tipo inválido');
  if (d.status && !STATUS.includes(d.status)) e.push('Situação inválida');
  if (!d.capa) e.push('Falta a foto de capa');
  if (String(d.descricao_curta ?? '').length > 160) {
    e.push('A descrição curta passou de 160 caracteres');
  }

  const etapas = d.etapas ?? [];
  for (let i = 0; i < etapas.length; i++) {
    const et = etapas[i];
    if (!String(et.nome ?? '').trim()) e.push('Etapa ' + (i + 1) + ' sem nome');
    if (et.situacao && !SITUACOES.includes(et.situacao)) {
      e.push('Etapa ' + (i + 1) + ' com situação inválida');
    }
    if (!(Number(et.peso) > 0)) e.push('Etapa ' + (i + 1) + ' precisa de peso maior que zero');
  }
  return e;
}

// ── vitrine da capa ─────────────────────────────────────────────────
//
// src/data/vitrine.json: quais fotos passam no Hero, em que ordem e por
// quanto tempo. A legenda de cada uma (nome, cidade, data) não fica aqui:
// sai da própria obra no build, para nunca ficar desatualizada.

export const CAMINHO_VITRINE = 'src/data/vitrine.json';
export const PASTA_CAPA = 'src/assets/capa/';
const SLUG = /^[a-z0-9-]+$/;
// Só nome de arquivo dentro de src/assets/capa — nada de caminho
const NOME_CAPA = /^capa-[a-z0-9-]+\.(jpeg|jpg|png|webp)$/;

export function validarVitrine(v) {
  const e = [];
  if (v?.capa != null && !NOME_CAPA.test(String(v.capa))) e.push('Nome da foto de capa inválido');
  if (v?.capaNova != null && !v.capaNova.base64) e.push('A foto nova de capa chegou vazia');
  if (typeof v?.ativa !== 'boolean') e.push('Faltou dizer se a vitrine fica ligada');
  const s = Number(v?.segundos);
  if (!Number.isInteger(s) || s < 4 || s > 15) e.push('O tempo de cada foto vai de 4 a 15 segundos');

  const slides = v?.slides;
  if (!Array.isArray(slides) || slides.length === 0) {
    e.push('A vitrine precisa de pelo menos uma foto');
    return e;
  }
  if (slides.length > 12) e.push('No máximo 12 fotos na vitrine');
  if (slides.filter((x) => x?.tipo === 'principal').length > 1) {
    e.push('A capa principal só pode aparecer uma vez');
  }

  slides.forEach((x, i) => {
    if (x?.tipo === 'principal') return;
    if (!SLUG.test(String(x?.obra ?? ''))) {
      e.push('Foto ' + (i + 1) + ' sem obra válida');
      return;
    }
    // A foto tem de ser da própria obra: impede apontar para arquivo solto
    const pasta = './../../assets/obras/' + x.obra + '/';
    if (x.foto != null && !String(x.foto).startsWith(pasta)) {
      e.push('Foto ' + (i + 1) + ' não pertence à obra ' + x.obra);
    }
    // Marcador de mapa: posição em % da tela, de 0 a 100
    if (x.marcador != null) {
      const ok = (n) => Number.isFinite(Number(n)) && Number(n) >= 0 && Number(n) <= 100;
      if (!ok(x.marcador.x) || !ok(x.marcador.y)) e.push('Foto ' + (i + 1) + ': posição do marcador inválida');
    }
  });
  return e;
}

/**
 * Gera o vitrine.json — e, se veio foto nova para a capa principal, o
 * arquivo dela em src/assets/capa/. Sem foto nova: mesma entrada, mesmo
 * arquivo, byte por byte.
 *
 * `capa` ausente = a foto original (src/assets/hero.webp).
 */
export function montarVitrine(v) {
  const erros = validarVitrine(v);
  if (erros.length) {
    const erro = new Error('dados inválidos');
    erro.erros = erros;
    throw erro;
  }

  const arquivos = [];
  let capa = v.capa ?? null;

  if (v.capaNova) {
    // Nome derivado do arquivo original. Repetir o nome substitui a foto
    // anterior de mesmo nome — o que é o desejado, e o Astro gera outro
    // endereço para a versão nova, então nenhum navegador fica com a velha.
    const base = nomeArquivo(v.capaNova.arquivo, new Set()).replace(/\.[a-z0-9]+$/, '');
    capa = 'capa-' + base.slice(0, 40) + '.jpeg';
    arquivos.push({ caminho: PASTA_CAPA + capa, base64: v.capaNova.base64 });
  }

  const limpo = {
    ...(capa ? { capa } : {}),
    ativa: v.ativa,
    segundos: Number(v.segundos),
    slides: v.slides.map((x) => {
      if (x.tipo === 'principal') return { tipo: 'principal' };
      const item = { obra: x.obra };
      if (x.foto != null) item.foto = x.foto;
      if (x.marcador != null) {
        item.marcador = { x: Math.round(Number(x.marcador.x)), y: Math.round(Number(x.marcador.y)) };
      }
      return item;
    }),
  };

  arquivos.push({ caminho: CAMINHO_VITRINE, conteudo: JSON.stringify(limpo, null, 2) });
  return { arquivos };
}

// ── números do site ─────────────────────────────────────────────────
//
// src/data/numeros.json guarda só o que NÃO dá para calcular: o histórico
// das obras entregues que não estão publicadas no site. O total mostrado
// (m², obras, estados) é esse histórico + as obras concluídas do site,
// somadas no build. Concluir uma obra no painel já sobe os números.

export const CAMINHO_NUMEROS = 'src/data/numeros.json';
const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

export function validarNumeros(n) {
  const e = [];
  const f = n?.fora_do_site;
  if (!f) return ['Faltou o histórico de obras fora do site'];
  if (!Number.isInteger(Number(f.m2)) || Number(f.m2) < 0) e.push('Metragem fora do site tem de ser um número inteiro');
  if (!Number.isInteger(Number(f.obras)) || Number(f.obras) < 0) e.push('Número de obras fora do site tem de ser inteiro');
  if (!Array.isArray(f.estados) || f.estados.some((u) => !UFS.includes(u))) e.push('Estado inválido');
  return e;
}

export function montarNumeros(n) {
  const erros = validarNumeros(n);
  if (erros.length) {
    const erro = new Error('dados inválidos');
    erro.erros = erros;
    throw erro;
  }
  // Estados em ordem alfabética: a mesma escolha sempre gera o mesmo arquivo
  const limpo = {
    fora_do_site: {
      m2: Number(n.fora_do_site.m2),
      obras: Number(n.fora_do_site.obras),
      estados: [...new Set(n.fora_do_site.estados)].sort(),
    },
  };
  return { arquivos: [{ caminho: CAMINHO_NUMEROS, conteudo: JSON.stringify(limpo, null, 2) }] };
}

// ── depoimentos ─────────────────────────────────────────────────────
//
// Regra do projeto: depoimento só entra copiado literalmente do post, com o
// @ do autor. O painel não corrige, não encurta, não "melhora" o texto.

export const CAMINHO_DEPOIMENTOS = 'src/data/depoimentos.json';

export function validarDepoimentos(d) {
  const e = [];
  const itens = d?.itens;
  if (!Array.isArray(itens)) return ['Lista de depoimentos ausente'];
  if (itens.length > 30) e.push('No máximo 30 depoimentos');
  itens.forEach((x, i) => {
    const n = 'Depoimento ' + (i + 1);
    if (!String(x?.texto ?? '').trim()) e.push(n + ' sem texto');
    if (String(x?.texto ?? '').length > 400) e.push(n + ' passou de 400 caracteres');
    if (!/^@[A-Za-z0-9._]{1,30}$/.test(String(x?.autor ?? ''))) {
      e.push(n + ': o autor tem de ser o @ de quem escreveu (ex.: @munariskatepark)');
    }
    if (x?.link && !/^https:\/\//.test(String(x.link))) e.push(n + ': o link tem de começar com https://');
  });
  return e;
}

export function montarDepoimentos(d) {
  const erros = validarDepoimentos(d);
  if (erros.length) {
    const erro = new Error('dados inválidos');
    erro.erros = erros;
    throw erro;
  }
  // Texto vai como veio — só sem espaço sobrando nas pontas
  const limpo = {
    itens: d.itens.map((x) => {
      const item = { texto: String(x.texto).trim(), autor: String(x.autor).trim() };
      if (String(x.complemento ?? '').trim()) item.complemento = String(x.complemento).trim();
      if (String(x.link ?? '').trim()) item.link = String(x.link).trim();
      return item;
    }),
  };
  return { arquivos: [{ caminho: CAMINHO_DEPOIMENTOS, conteudo: JSON.stringify(limpo, null, 2) }] };
}

// ── publicar tudo ───────────────────────────────────────────────────
//
// O painel guarda as alterações num rascunho e manda todas juntas: um
// commit, um build, uma espera. Cada alteração passa pelo seu montador;
// erro em qualquer uma barra o pacote inteiro (meio publicado é pior que
// nada publicado), e a mensagem diz qual alteração tem o problema.

const MONTADORES = {
  obra: (d) => montarArquivos(d),
  vitrine: (d) => montarVitrine(d),
  numeros: (d) => montarNumeros(d),
  depoimentos: (d) => montarDepoimentos(d),
};

function rotulo(a) {
  if (a.tipo === 'obra') return 'Obra ' + (a.dados?.nome || a.dados?.slug || '?');
  return { vitrine: 'Capa do site', numeros: 'Números do site', depoimentos: 'Depoimentos' }[a.tipo] ?? a.tipo;
}

export function montarTudo(pacote) {
  const alteracoes = pacote?.alteracoes;
  if (!Array.isArray(alteracoes) || alteracoes.length === 0) {
    const erro = new Error('dados inválidos');
    erro.erros = ['Nenhuma alteração para publicar'];
    throw erro;
  }

  const erros = [];
  const porCaminho = new Map();
  const resumo = [];

  for (const a of alteracoes) {
    const montar = MONTADORES[a?.tipo];
    if (!montar) {
      erros.push('Tipo de alteração desconhecido: ' + a?.tipo);
      continue;
    }
    try {
      const { arquivos, slug } = montar(a.dados);
      for (const arq of arquivos) {
        // Duas alterações gravando o mesmo arquivo: uma apagaria a outra
        if (porCaminho.has(arq.caminho)) {
          erros.push(rotulo(a) + ' e ' + porCaminho.get(arq.caminho).dono + ' mexem no mesmo arquivo');
        }
        porCaminho.set(arq.caminho, { ...arq, dono: rotulo(a) });
      }
      resumo.push(a.tipo === 'obra' ? 'obra: ' + (a.dados.slug ? 'atualiza ' : 'publica ') + slug : rotulo(a));
    } catch (e) {
      for (const m of e.erros ?? [e.message]) erros.push(rotulo(a) + ': ' + m);
    }
  }

  if (erros.length) {
    const erro = new Error('dados inválidos');
    erro.erros = erros;
    throw erro;
  }

  const arquivos = [...porCaminho.values()].map(({ dono, ...arq }) => arq);
  return { arquivos, resumo };
}

/**
 * Transforma o que o painel mandou nos arquivos do commit.
 *
 * Entrada: { nome, cidade, ..., corpo, capa:{arquivo,base64}, fotos:[...],
 *            etapas:[{..., fotos:[...]}] }
 * Saída:   { slug, arquivos:[{caminho, conteudo|base64}] }
 *
 * Foto que já está publicada chega como string (o caminho atual) e é
 * reaproveitada; foto nova chega como objeto e vira arquivo no commit.
 */
export function montarArquivos(d) {
  const erros = validar(d);
  if (erros.length) {
    const erro = new Error('dados inválidos');
    erro.erros = erros;
    throw erro;
  }

  const slug = d.slug ? slugificar(d.slug) : slugificar(d.nome);
  const pastaFotos = 'src/assets/obras/' + slug + '/';
  const refFotos = './../../assets/obras/' + slug + '/';

  const usados = new Set();
  const arquivos = [];

  const registrar = (foto) => {
    if (!foto) return null;
    if (typeof foto === 'string') return foto;
    const nome = nomeArquivo(foto.arquivo, usados);
    arquivos.push({ caminho: pastaFotos + nome, base64: foto.base64 });
    return refFotos + nome;
  };

  const capa = registrar(d.capa);
  const galeria = (d.fotos ?? []).map(registrar).filter(Boolean);

  const etapas = (d.etapas ?? []).map((et) => ({
    nome: String(et.nome).trim(),
    peso: Number(et.peso),
    situacao: SITUACOES.includes(et.situacao) ? et.situacao : 'a_fazer',
    data: dataISO(et.data),
    fotos: (et.fotos ?? []).map(registrar).filter(Boolean),
  }));

  // ── frontmatter ──────────────────────────────────────────────────
  const l = [];
  l.push('---');
  l.push('nome: ' + aspas(String(d.nome).trim()));
  l.push('cidade: ' + aspas(String(d.cidade).trim()));
  l.push('uf: ' + aspas(d.uf || 'SC'));
  l.push('tipo: [' + d.tipo.map(aspas).join(', ') + ']');
  l.push('status: ' + aspas(d.status || 'em_execucao'));
  if (String(d.cliente ?? '').trim()) l.push('cliente: ' + aspas(d.cliente.trim()));
  if (String(d.duracao ?? '').trim()) l.push('duracao: ' + aspas(d.duracao.trim()));
  if (Number(d.ano) > 0) l.push('ano: ' + Number(d.ano));
  l.push('area_m2: ' + Number(d.area_m2));
  if (String(d.descricao_curta ?? '').trim()) {
    l.push('descricao_curta: ' + aspas(d.descricao_curta.trim()));
  }
  l.push('capa: ' + aspas(capa));

  if (galeria.length) {
    l.push('fotos:');
    for (const f of galeria) l.push('  - ' + aspas(f));
  }

  if (etapas.length) {
    l.push('etapas:');
    for (const et of etapas) {
      l.push('  - nome: ' + aspas(et.nome));
      l.push('    peso: ' + et.peso);
      l.push('    situacao: ' + aspas(et.situacao));
      if (et.data) l.push('    data: ' + et.data);
      if (et.fotos.length) {
        l.push('    fotos:');
        for (const f of et.fotos) l.push('      - ' + aspas(f));
      }
    }
    l.push('atualizado_em: ' + (dataISO(d.atualizado_em) ?? dataISO(new Date())));
  }

  l.push('destaque: ' + (d.destaque ? 'true' : 'false'));
  l.push('ordem: ' + (Number(d.ordem) > 0 ? Number(d.ordem) : 99));
  l.push('---');
  l.push('');
  // Sem quebra de linha no fim, como os arquivos atuais: editar uma obra
  // sem mexer em nada tem de regravar o arquivo byte por byte igual.
  l.push(String(d.corpo ?? '').trim());

  arquivos.push({
    caminho: 'src/content/obras/' + slug + '.md',
    conteudo: l.join('\n'),
  });

  return { slug, arquivos };
}
