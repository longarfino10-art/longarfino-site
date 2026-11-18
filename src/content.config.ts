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

      // ── Acompanhamento de obra ────────────────────────────────────────
      // Só é usado quando status = em_execucao. A barra de progresso soma
      // o peso das etapas marcadas — ver src/lib/progresso.ts.
      // Quando a obra termina, as etapas viram a seção "Como foi feita".
      etapas: z
        .array(
          z.object({
            nome: z.string(),
            // Quanto a etapa representa da obra. Não precisa somar 100:
            // o cálculo é proporcional ao total.
            peso: z.number().default(10),
            situacao: z.enum(['a_fazer', 'fazendo', 'feita']).default('a_fazer'),
            data: z.coerce.date().optional(),
            fotos: z.array(image()).default([]),
          }),
        )
        .default([]),

      // Data da última atualização do andamento. Aparece junto da barra, e
      // é o que faz a faixa da home sumir quando a obra fica parada.
      atualizado_em: z.coerce.date().optional(),
    }),
});

export const collections = { obras };
