// Números do site: m² construídos, obras entregues e estados atendidos.
//
// Antes eram escritos à mão em cinco lugares. Agora: histórico das obras
// que não estão publicadas (src/data/numeros.json, editável no painel) +
// as obras CONCLUÍDAS do site, somadas no build. Obra em execução não
// entra — só conta o que foi entregue. Concluir uma obra no painel sobe os
// três números sozinho, em todas as páginas.

import { getCollection } from 'astro:content';
import numeros from '../data/numeros.json';

export interface NumerosDoSite {
  m2: number;
  obras: number;
  estados: number;
  /** "12.360" — pronto para mostrar */
  m2Texto: string;
}

export async function numerosDoSite(): Promise<NumerosDoSite> {
  const concluidas = (await getCollection('obras')).filter((o) => o.data.status === 'concluida');
  const fora = numeros.fora_do_site;

  const m2 = Math.round(fora.m2 + concluidas.reduce((s, o) => s + o.data.area_m2, 0));
  const obras = fora.obras + concluidas.length;
  const estados = new Set([...fora.estados, ...concluidas.map((o) => o.data.uf)]).size;

  return { m2, obras, estados, m2Texto: m2.toLocaleString('pt-BR') };
}
