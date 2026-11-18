// A regra inegociável do painel: editar uma obra sem mexer em nada regrava o
// arquivo byte por byte igual. Roda em todas as obras publicadas — obra nova
// entra no teste sozinha.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarArquivos, slugificar } from '../worker/montar.js';
import { ler, slugsDasObras, obraComoOPainelManda, erros } from './apoio.mjs';

for (const slug of slugsDasObras()) {
  test('editar sem mexer regrava igual: ' + slug, () => {
    const { arquivos } = montarArquivos(obraComoOPainelManda(slug));
    const md = arquivos.find((a) => a.caminho === 'src/content/obras/' + slug + '.md');
    assert.ok(md, 'o .md da obra tem de estar entre os arquivos');
    assert.equal(md.conteudo, ler('src/content/obras/' + slug + '.md'));
    assert.equal(arquivos.length, 1, 'sem foto nova, só o .md muda');
  });
}

test('foto nova vira arquivo na pasta da obra, com nome limpo', () => {
  const d = obraComoOPainelManda(slugsDasObras()[0]);
  const { arquivos } = montarArquivos({
    ...d,
    fotos: [...(d.fotos ?? []), { arquivo: 'IMG 2024 Aérea.JPG', base64: 'AAAA' }],
  });
  const foto = arquivos.find((a) => a.base64);
  assert.match(foto.caminho, /^src\/assets\/obras\/[a-z0-9-]+\/img-2024-aerea\.jpeg$/);
});

test('obra sem nome, cidade ou capa é recusada', () => {
  const d = obraComoOPainelManda(slugsDasObras()[0]);
  assert.notEqual(erros(() => montarArquivos({ ...d, nome: '  ' })), null);
  assert.notEqual(erros(() => montarArquivos({ ...d, cidade: '' })), null);
  assert.notEqual(erros(() => montarArquivos({ ...d, capa: null })), null);
});

test('slug sem acento, espaço nem maiúscula', () => {
  assert.equal(slugificar('Pista Ação São José'), 'pista-acao-sao-jose');
});
