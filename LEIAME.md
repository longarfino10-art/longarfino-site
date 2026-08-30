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
