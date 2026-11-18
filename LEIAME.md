# Longarfino Skateparks — site

    npm run dev       # localhost:4321
    npm run build     # gera ./dist
    npm run preview   # confere o build

## Publicar uma obra pelo painel (jeito normal)

1. Abrir **longarfinoskateparks.com.br/admin** — pelo celular funciona
2. Entrar com a senha do painel — o aparelho lembra, é uma vez só
3. Preencher a ficha, subir as fotos, marcar as etapas
4. **Publicar.** O site atualiza sozinho em 1 a 2 minutos

A porcentagem da barra não é digitada: ela sai das etapas marcadas.

## Publicar uma obra pela pasta (quando precisar mexer no código)

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
| Tela do painel | `src/pages/admin/index.astro` |
| Gravação do painel | `worker/montar.js` e `worker/index.js` |
| Cálculo da barra | `src/lib/progresso.ts` |
| Redirects de SEO | `public/_redirects` |
| Deploy | `wrangler.jsonc` |
