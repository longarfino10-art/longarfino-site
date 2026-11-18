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
