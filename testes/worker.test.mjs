// O Worker de verdade, chamado como a Cloudflare chama, com um ambiente de
// mentira: nada sai para o GitHub (PAINEL_ENSAIO devolve os arquivos em vez
// de commitar).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import { lerJson, slugsDasObras, obraComoOPainelManda } from './apoio.mjs';

// timingSafeEqual só existe no runtime da Cloudflare
if (!crypto.subtle.timingSafeEqual) {
  crypto.subtle.timingSafeEqual = (a, b) => {
    const x = new Uint8Array(a);
    const y = new Uint8Array(b);
    return x.length === y.length && x.every((v, i) => v === y[i]);
  };
}

const SENHA = 'senha-so-de-teste';
const ASSETS = { fetch: () => new Response('site estático', { status: 200 }) };
const ambiente = (extra = {}) => ({ ASSETS, PAINEL_SENHA: SENHA, PAINEL_ENSAIO: '1', ...extra });

const chamar = (caminho, { senha, corpo, metodo = 'POST' } = {}, env = ambiente()) =>
  worker.fetch(
    new Request('https://exemplo.test' + caminho, {
      method: metodo,
      headers: senha ? { 'X-Painel-Senha': senha } : {},
      body: corpo ? JSON.stringify(corpo) : undefined,
    }),
    env,
  );

const pacote = (alteracoes) => ({ alteracoes });
const umaObra = () => ({ tipo: 'obra', dados: obraComoOPainelManda(slugsDasObras()[0]) });

test('o resto do site passa direto para os arquivos estáticos', async () => {
  const r = await chamar('/obras/', { metodo: 'GET' });
  assert.equal(await r.text(), 'site estático');
});

test('as rotas antigas de uma alteração por vez não existem mais', async () => {
  for (const rota of ['/api/publicar', '/api/vitrine', '/api/numeros', '/api/depoimentos']) {
    const r = await chamar(rota, { senha: SENHA, corpo: {} });
    assert.equal(await r.text(), 'site estático', rota);
  }
});

test('sem senha: recusa na hora, sem cache', async () => {
  const r = await chamar('/api/entrar');
  assert.equal(r.status, 403);
  assert.equal(r.headers.get('cache-control'), 'no-store');
});

test('sem senha nem Access configurados: a API recusa tudo', async () => {
  const r = await chamar('/api/entrar', { senha: 'qualquer' }, { ASSETS });
  assert.equal(r.status, 403);
});

test('senha errada é recusada', async () => {
  const r = await chamar('/api/entrar', { senha: 'errada' });
  assert.equal(r.status, 403);
});

test('senha certa entra no modo senha', async () => {
  const r = await chamar('/api/entrar', { senha: SENHA });
  assert.deepEqual(await r.json(), { ok: true, modo: 'senha' });
});

test('GET na API é recusado', async () => {
  const r = await chamar('/api/publicar-tudo', { metodo: 'GET', senha: SENHA });
  assert.equal(r.status, 405);
});

test('publicar tudo (ensaio) devolve os arquivos que gravaria', async () => {
  const r = await chamar('/api/publicar-tudo', {
    senha: SENHA,
    corpo: pacote([umaObra(), { tipo: 'numeros', dados: lerJson('src/data/numeros.json') }]),
  });
  const j = await r.json();
  assert.equal(j.ok, true);
  assert.equal(j.ensaio, true);
  assert.equal(j.arquivos.length, 2);
});

test('mais de 40 fotos numa publicação é recusado com explicação', async () => {
  const obra = umaObra();
  obra.dados.fotos = Array.from({ length: 41 }, (_, i) => ({ arquivo: 'f' + i + '.jpeg', base64: 'AAAA' }));
  const r = await chamar('/api/publicar-tudo', { senha: SENHA, corpo: pacote([obra]) });
  assert.equal(r.status, 400);
  assert.match((await r.json()).erros[0], /limite é 40/);
});

test('dado inválido volta como 400 com a lista de problemas', async () => {
  const r = await chamar('/api/publicar-tudo', {
    senha: SENHA,
    corpo: pacote([{ tipo: 'depoimentos', dados: { itens: [{ texto: 'x', autor: 'semarroba' }] } }]),
  });
  assert.equal(r.status, 400);
  assert.ok((await r.json()).erros[0].startsWith('Depoimentos:'));
});
