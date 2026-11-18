// Liga o caminho de uma foto, como está escrito no .md, à foto já
// resolvida pelo image() do schema.
//
// Por que existe: a coleção entrega a foto como objeto (pronta para o
// <Image>), mas perde o caminho original. A vitrine da capa e o painel
// guardam a foto pelo caminho — então é preciso casar os dois. O .md cru e
// a coleção trazem as fotos na mesma ordem; basta andar lado a lado.

import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { load } from 'js-yaml';

const crus = import.meta.glob('../content/obras/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function frenteDe(slug: string): any {
  const entrada = Object.entries(crus).find(([c]) => c.endsWith('/' + slug + '.md'));
  if (!entrada) return null;
  const bruto = entrada[1];
  const corte = bruto.indexOf('---', 3);
  return load(bruto.slice(3, corte)) ?? {};
}

/** caminho no .md → foto resolvida, de todas as obras */
export async function mapaDeFotos(): Promise<Map<string, ImageMetadata>> {
  const mapa = new Map<string, ImageMetadata>();

  for (const obra of await getCollection('obras')) {
    const cru = frenteDe(obra.id);
    if (!cru) continue;

    const d = obra.data;
    if (cru.capa) mapa.set(cru.capa, d.capa);
    (cru.fotos ?? []).forEach((p: string, i: number) => d.fotos[i] && mapa.set(p, d.fotos[i]));
    (cru.etapas ?? []).forEach((et: any, i: number) =>
      (et.fotos ?? []).forEach((p: string, j: number) => {
        const foto = d.etapas[i]?.fotos[j];
        if (foto) mapa.set(p, foto);
      }),
    );
  }

  return mapa;
}
