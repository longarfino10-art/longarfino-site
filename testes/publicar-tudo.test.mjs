// "Publicar tudo": várias alterações viram um commit só.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarTudo } from '../worker/montar.js';
import { ler, lerJson, slugsDasObras, obraComoOPainelManda, erros } from './apoio.mjs';

const [primeira, segunda] = slugsDasObras();

const pacote = {
  alteracoes: [
    { tipo: 'obra', dados: obraComoOPainelManda(primeira) },
    { tipo: 'obra', dados: obraComoOPainelManda(segunda) },
    { tipo: 'vitrine', dados: lerJson('src/data/vitrine.json') },
    { tipo: 'numeros', dados: lerJson('src/data/numeros.json') },
    { tipo: 'depoimentos', dados: lerJson('src/data/depoimentos.json') },
  ],
};

test('cada alteração vira um arquivo, com resumo para o commit', () => {
  const r = montarTudo(pacote);
  assert.equal(r.arquivos.length, 5);
  assert.equal(r.resumo.length, 5);
});

test('obra sem mexer continua byte por byte dentro do pacote', () => {
  const r = montarTudo(pacote);
  const md = r.arquivos.find((a) => a.caminho.endsWith('/' + primeira + '.md'));
  assert.equal(md.conteudo, ler('src/content/obras/' + primeira + '.md'));
});

test('mesma obra duas vezes é recusada', () => {
  const e = erros(() => montarTudo({ alteracoes: [pacote.alteracoes[0], pacote.alteracoes[0]] }));
  assert.ok(e?.[0]?.includes('mesmo arquivo'));
});

test('erro em uma alteração barra o pacote e diz qual é', () => {
  const e = erros(() =>
    montarTudo({
      alteracoes: [
        pacote.alteracoes[2],
        { tipo: 'depoimentos', dados: { itens: [{ texto: 'x', autor: 'semarroba' }] } },
      ],
    }),
  );
  assert.ok(e?.[0]?.startsWith('Depoimentos:'));
});

test('pacote vazio ou tipo desconhecido é recusado', () => {
  assert.notEqual(erros(() => montarTudo({ alteracoes: [] })), null);
  assert.notEqual(erros(() => montarTudo({ alteracoes: [{ tipo: 'outro', dados: {} }] })), null);
});
