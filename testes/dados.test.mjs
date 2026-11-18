// Vitrine, números e depoimentos: o que o painel grava em src/data/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarVitrine, montarNumeros, montarDepoimentos } from '../worker/montar.js';
import { ler, lerJson, erros } from './apoio.mjs';

for (const [nome, montar, caminho] of [
  ['vitrine', montarVitrine, 'src/data/vitrine.json'],
  ['números', montarNumeros, 'src/data/numeros.json'],
  ['depoimentos', montarDepoimentos, 'src/data/depoimentos.json'],
]) {
  test('publicar sem mexer regrava igual: ' + nome, () => {
    const { arquivos } = montar(lerJson(caminho));
    assert.equal(arquivos.length, 1);
    assert.equal(arquivos[0].conteudo, ler(caminho));
  });
}

test('números: recusa estado inventado e metragem negativa', () => {
  assert.notEqual(erros(() => montarNumeros({ fora_do_site: { m2: 1, obras: 1, estados: ['XX'] } })), null);
  assert.notEqual(erros(() => montarNumeros({ fora_do_site: { m2: -5, obras: 1, estados: [] } })), null);
});

test('números: estados sem repetição e em ordem', () => {
  const { arquivos } = montarNumeros({ fora_do_site: { m2: 10, obras: 2, estados: ['SP', 'BA', 'SP'] } });
  assert.deepEqual(JSON.parse(arquivos[0].conteudo).fora_do_site.estados, ['BA', 'SP']);
});

test('depoimentos: recusa autor sem @, link sem https e texto vazio', () => {
  assert.ok(erros(() => montarDepoimentos({ itens: [{ texto: 'x', autor: 'fulano' }] }))?.[0]?.includes('@'));
  assert.notEqual(erros(() => montarDepoimentos({ itens: [{ texto: 'x', autor: '@a', link: 'http://x' }] })), null);
  assert.notEqual(erros(() => montarDepoimentos({ itens: [{ texto: '   ', autor: '@a' }] })), null);
});

test('depoimentos: texto literal, só tira espaço das pontas', () => {
  const { arquivos } = montarDepoimentos({ itens: [{ texto: '  Pista  top!!  ', autor: '@a.b_c' }] });
  assert.equal(JSON.parse(arquivos[0].conteudo).itens[0].texto, 'Pista  top!!');
});

test('depoimentos: lista vazia é aceita (a faixa some do site)', () => {
  assert.equal(erros(() => montarDepoimentos({ itens: [] })), null);
});

test('capa principal: foto nova vai para src/assets/capa e a vitrine aponta para ela', () => {
  const base = lerJson('src/data/vitrine.json');
  const { arquivos } = montarVitrine({ ...base, capaNova: { arquivo: 'DJI Aérea Laguna.JPG', base64: 'AAAA' } });
  const foto = arquivos.find((a) => a.base64);
  const json = arquivos.find((a) => a.caminho.endsWith('.json'));
  assert.equal(foto.caminho, 'src/assets/capa/capa-dji-aerea-laguna.jpeg');
  assert.equal(JSON.parse(json.conteudo).capa, 'capa-dji-aerea-laguna.jpeg');
});

test('capa principal: recusa caminho e "Original" tira o campo', () => {
  const base = lerJson('src/data/vitrine.json');
  assert.notEqual(erros(() => montarVitrine({ ...base, capa: '../../hero.webp' })), null);
  const { arquivos } = montarVitrine({ ...base, capa: null });
  assert.ok(!('capa' in JSON.parse(arquivos[0].conteudo)));
});

test('marcador: fora de 0–100 é recusado', () => {
  const base = lerJson('src/data/vitrine.json');
  const slides = base.slides.map((s, i) => (i === 1 ? { ...s, marcador: { x: 140, y: 30 } } : s));
  assert.notEqual(erros(() => montarVitrine({ ...base, slides })), null);
});
