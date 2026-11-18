// Apoio dos testes: ler arquivos do projeto do jeito que o painel lê.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

export const RAIZ = fileURLToPath(new URL('..', import.meta.url));

// O disco no Windows tem CRLF; o repositório (e o painel) tem LF.
export const ler = (caminho) => readFileSync(RAIZ + caminho, 'utf8').replace(/\r/g, '');

export const lerJson = (caminho) => JSON.parse(ler(caminho));

/** As obras publicadas (o loader ignora as que começam com _) */
export const slugsDasObras = () =>
  readdirSync(RAIZ + 'src/content/obras')
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => f.replace(/\.md$/, ''));

/** A obra como o painel manda para o Worker: frontmatter cru + slug + corpo */
export function obraComoOPainelManda(slug) {
  const bruto = ler('src/content/obras/' + slug + '.md');
  const corte = bruto.indexOf('---', 3);
  return { ...load(bruto.slice(3, corte)), slug, corpo: bruto.slice(corte + 3).trim() };
}

/** Roda a função e devolve a lista de erros, ou null se ela aceitou */
export function erros(fn) {
  try {
    fn();
    return null;
  } catch (e) {
    return e.erros ?? [e.message];
  }
}
