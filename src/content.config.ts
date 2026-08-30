import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const obras = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/obras' }),
  // image() faz o Astro otimizar a foto no build (WebP + srcset responsivo)
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      cidade: z.string(),
      uf: z.string().default('SC'),
      tipo: z.array(z.enum(['Bowl', 'Street', 'Park', 'Reforma'])).min(1),
      status: z.enum(['concluida', 'em_execucao']).default('concluida'),
      cliente: z.string().optional(),
      duracao: z.string().optional(),
      ano: z.number().optional(),
      area_m2: z.number(),
      descricao_curta: z.string().max(160).optional(),
      capa: image(),
      fotos: z.array(image()).default([]),
      destaque: z.boolean().default(false),
      ordem: z.number().default(99),
    }),
});

export const collections = { obras };
