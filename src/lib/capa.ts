// Capa principal do site e foto de compartilhamento.
//
// A capa que o Lucas sobe pelo painel fica em src/assets/capa/ e o nome vai
// em vitrine.capa. Sem nome (ou arquivo que sumiu), o Hero usa a original
// src/assets/hero.webp.

import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';
import vitrine from '../data/vitrine.json';

const capasEnviadas = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/capa/*.{jpeg,jpg,png,webp}',
  { eager: true },
);

/** A capa subida pelo painel, ou null se não houver. */
export function capaEnviada(): ImageMetadata | null {
  const nome = (vitrine as { capa?: string }).capa;
  return nome ? capasEnviadas['../assets/capa/' + nome]?.default ?? null : null;
}

/**
 * Foto que aparece quando o link do site é mandado no WhatsApp, Instagram
 * etc. Ordem: capa subida pelo painel → capa da primeira obra da vitrine →
 * capa da primeira obra. Não usa a hero.webp: ela está marcada como
 * provisória (gerada por IA) e só foto original vai para fora do site.
 */
export async function fotoDeCompartilhar(): Promise<ImageMetadata> {
  const enviada = capaEnviada();
  if (enviada) return enviada;

  const obras = await getCollection('obras');
  const slugs = vitrine.slides.flatMap((s) => ('obra' in s && s.obra ? [s.obra] : []));
  const daVitrine = slugs.map((slug) => obras.find((o) => o.id === slug)).find(Boolean);
  return (daVitrine ?? obras[0]).data.capa;
}
