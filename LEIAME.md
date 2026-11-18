# Longarfino Skateparks — site

    npm run dev       # localhost:4321
    npm run build     # gera ./dist
    npm run preview   # confere o build

## Usar o painel (jeito normal)

1. Abrir **longarfinoskateparks.com.br/admin** — pelo celular funciona
2. Entrar com a senha do painel — o aparelho lembra, é uma vez só
3. Fazer as alterações e apertar **Salvar** em cada tela
4. Quando terminar tudo, **Publicar tudo** na barra de baixo. Um envio só;
   o site atualiza sozinho em 1 a 2 minutos

O que foi salvo fica guardado no aparelho até publicar — pode fechar o
navegador e voltar depois. "Desfazer" na barra tira uma alteração.

**Obra em andamento:** "Atualizar andamento" — a porcentagem sai das etapas
marcadas, não se digita.

**Quando a obra terminar:** marque **Obra entregue** e confira a **metragem
final**. Ao publicar, a metragem entra no total de m² do site e a obra conta
como entregue. O cartão sai da home e as etapas viram "Como foi feita".

**Para corrigir qualquer obra:** **Editar obra**. O que você não mexer continua
exatamente igual.

**Fotos da abertura do site:** **Capa do site** — liga/desliga a troca, tempo,
ordem, qual foto de cada obra, e **trocar a capa principal** por uma foto do
computador ou do celular. Em cada obra, **Marcador** escolhe onde o marcador de mapa aparece na foto.

**Depoimentos:** copie o comentário **exatamente como foi escrito**, com o @ de
quem escreveu. Com o link do post, quem lê pode conferir. Eles aparecem na seção "A Longarfino" e também surgem, discretos, no canto da tela enquanto a pessoa navega.

**Números do site:** só para obras que **não estão** publicadas no site. As do
site somam sozinhas quando concluídas.

Depois de publicar, espere 2 minutos e recarregue a página antes de mexer de
novo.

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
