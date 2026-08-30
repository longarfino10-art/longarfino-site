#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
#  SETUP — estrutura do projeto  ·  Longarfino Skateparks
#  Astro 7 + Cloudflare Workers (Static Assets)
#
#  ANTES DE RODAR:
#    node -v            # precisa ser >= 22.12.0
#    npm create astro@latest longarfino-site
#       Template: Minimal · TypeScript: Strict · Install: Yes · Git: Yes
#
#  DEPOIS:
#    cd longarfino-site
#    bash setup-longarfino.sh
#
#  Pode rodar de novo sem quebrar nada (não sobrescreve o que já existe).
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

[ -f package.json ] || { echo "✗ rode DENTRO da pasta do projeto Astro."; exit 1; }

echo "→ pastas"

mkdir -p src/components/layout   # Header, Footer, MenuMobile, Seo
mkdir -p src/components/home     # Hero, Servicos, Processo, Diferencial, Numeros, Depoimento, Galeria, CtaFinal
mkdir -p src/components/obras    # ObraCard, ObrasGrid, Filtros, FichaTecnica, Carrossel
mkdir -p src/components/ui       # Botao, Eyebrow, Regua, Desenho (sprite dos desenhos técnicos)
mkdir -p src/layouts             # Base.astro
mkdir -p src/pages/obras         # index.astro + [...slug].astro
mkdir -p src/styles              # tokens.css, base.css
mkdir -p src/scripts             # menu.js, filtros.js, reveal.js
mkdir -p src/content/obras       # os .md — um por obra
mkdir -p src/assets/galeria      # fotos soltas da galeria
mkdir -p src/assets/desenhos     # SVGs técnicos (se separar do sprite)
mkdir -p public/og               # imagem de compartilhamento 1200x630

# uma pasta de fotos por obra — dentro de src/assets, NÃO em public/
for slug in praca-abraao bowl-do-gringo pista-laguna park-campeche \
            pista-trindade pista-estaleirinho reforma-imbituba; do
  mkdir -p "src/assets/obras/$slug"
  touch "src/assets/obras/$slug/.gitkeep"
done
touch src/assets/galeria/.gitkeep src/assets/desenhos/.gitkeep public/og/.gitkeep

echo "→ arquivos-base"

if [ ! -f src/content.config.ts ]; then
cat > src/content.config.ts <<'EOF'
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
EOF
echo "  ✓ src/content.config.ts"
fi

if [ ! -f src/content/obras/_MODELO.md ]; then
cat > src/content/obras/_MODELO.md <<'EOF'
---
nome: "Nome da Pista"
cidade: "Cidade"
uf: "SC"
tipo: ["Bowl", "Park"]          # Bowl | Street | Park | Reforma
status: "concluida"             # concluida | em_execucao
cliente: "Prefeitura de ..."
duracao: "dez/2022 a jan/2023"
ano: 2023
area_m2: 450
descricao_curta: "Uma linha que vira a meta description e o resumo do card."
capa: "../../assets/obras/SLUG/capa.jpg"
fotos:
  - "../../assets/obras/SLUG/01.jpg"
  - "../../assets/obras/SLUG/02.jpg"
destaque: true
ordem: 1
---

O estudo de caso: contexto do terreno, desafio técnico, decisões de projeto,
solução construtiva, o que a pista entregou pra cidade.
EOF
echo "  ✓ src/content/obras/_MODELO.md  (o _ na frente faz o Astro ignorar)"
fi

if [ ! -f src/styles/tokens.css ]; then
cat > src/styles/tokens.css <<'EOF'
/* Longarfino Skateparks — tokens de design (protótipo v2) */
:root{
  --black:#0A0A0A;  --concrete:#111111;  --gray-900:#202020;
  --gray-500:#777777; --gray-200:#D8D8D8; --off:#F2F1EC; --white:#FFFFFF;
  --orange:#E85A24;

  --line:rgba(255,255,255,.12);
  --line-2:rgba(255,255,255,.25);

  --ff-display:'Bebas Neue',Impact,sans-serif;        /* títulos e números */
  --ff-body:'Inter',system-ui,sans-serif;              /* texto e navegação */
  --ff-mono:'IBM Plex Mono',ui-monospace,monospace;    /* dados técnicos */

  --pad:clamp(20px,4.5vw,80px);
  --sec-y:clamp(80px,11vw,164px);
  --ease:cubic-bezier(.22,.61,.36,1);
}
EOF
echo "  ✓ src/styles/tokens.css"
fi

if [ ! -f public/_redirects ]; then
cat > public/_redirects <<'EOF'
# 301 do WordPress antigo → site novo.  Formato:  /antiga  /nova  301
# Preencher na etapa de SEO, depois de mapear as URLs atuais.
# /gallery/pista-trindade/   /obras/pista-trindade/   301
# /portfolio/                /obras/                  301
EOF
echo "  ✓ public/_redirects"
fi

if [ ! -f public/robots.txt ]; then
cat > public/robots.txt <<'EOF'
User-agent: *
Allow: /

Sitemap: https://www.longarfinoskateparks.com.br/sitemap-index.xml
EOF
echo "  ✓ public/robots.txt"
fi

if [ ! -f wrangler.jsonc ]; then
cat > wrangler.jsonc <<'EOF'
{
  // Cloudflare Workers servindo o site estático (substitui o Pages)
  "name": "longarfino-site",
  "compatibility_date": "2026-08-30",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
EOF
echo "  ✓ wrangler.jsonc"
fi

if [ ! -f LEIAME.md ]; then
cat > LEIAME.md <<'EOF'
# Longarfino Skateparks — site

    npm run dev       # localhost:4321
    npm run build     # gera ./dist
    npm run preview   # confere o build

## Publicar uma obra nova
1. Fotos grandes (JPG/PNG, sem otimizar) em `src/assets/obras/<slug>/`
2. Copiar `src/content/obras/_MODELO.md` para `<slug>.md` e preencher
3. `npm run dev` pra conferir
4. `git add . && git commit -m "obra: <nome>" && git push` → publica sozinho

## Onde mexer
| O quê | Arquivo |
|---|---|
| Cor, fonte, espaçamento | `src/styles/tokens.css` |
| Seções da home | `src/components/home/` |
| Página da obra | `src/pages/obras/[...slug].astro` |
| Redirects de SEO | `public/_redirects` |
| Deploy | `wrangler.jsonc` |
EOF
echo "  ✓ LEIAME.md"
fi

echo ""
echo "✓ estrutura pronta."
echo ""
echo "  npx astro add sitemap"
echo "  npm run dev"
