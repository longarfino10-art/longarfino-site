# Longarfino Skateparks — Planejamento

## ONDE ESTAMOS

**Data:** 30/08/2026
**Etapa concluída:** Itens 1, 2, 3, 4 e 6 — layout base, desenhos técnicos,
header/footer, coleção de obras, página da obra e portfólio com filtros.
**Próxima etapa:** Item 7 — Home, ou Item 9 — Contato
**Bloqueio atual:** acervo de fotos. As obras rodam com placeholder técnico
(`src/assets/placeholder-obra.svg`), então o código não está travado — mas o
site não pode ir ao ar assim.

Site no ar em https://longarfino-site.longarfino10.workers.dev
Deploy automático funcionando: `git push` publica sozinho.

---

## STACK

- Astro 7.2.9 (site estático) — exige Node >= 22.12.0
- Markdown para o conteúdo das obras (sem banco de dados)
- Cloudflare Workers com Static Assets (Pages está em modo manutenção)
- Custo mensal: R$0. Único custo: domínio .com.br já existente (~R$40/ano)

Repositório: https://github.com/longarfino10-art/longarfino-site
Pasta local: C:\Users\longa\Documents\Projetos PROGRAMAÇÃO\longarfino-site
Terminal: PowerShell. O `bash` não está no PATH — para rodar .sh use:
`& "C:\Program Files\Git\bin\bash.exe" arquivo.sh`

**Criação de arquivo novo:** sempre criar vazio pelo terminal com `New-Item`
antes de colar o conteúdo. Criar pela interface do VS Code gruda `.txt` ou
`.html` no fim do nome e quebra o import.

---

## ESTADO DOS ARQUIVOS

Criados e commitados:
- `src/layouts/Base.astro` — layout de todas as páginas, com SEO e as 3 fontes
- `src/styles/base.css` — reset, tipografia, botões, .ph (foto), .rv (animação)
- `src/content.config.ts` — schema da coleção `obras`, com `image()`
- `src/content/obras/_MODELO.md` — modelo de obra (o `_` faz o Astro ignorar)
- `src/styles/tokens.css` — paleta e tipografia
- `public/_redirects` — vazio, preencher na etapa de SEO
- `public/robots.txt`
- `wrangler.jsonc` — deploy
- `astro.config.mjs` — com `site` e `sitemap()`
- `LEIAME.md`

Pastas vazias aguardando conteúdo:
- `src/components/{layout,home,obras,ui}`
- `src/layouts`
- `src/pages/obras`
- `src/scripts`
- `src/assets/obras/<slug>` (7 pastas, uma por obra)
- `src/assets/galeria`

Componentes criados: `layout/Header.astro`, `layout/Footer.astro`,
`ui/Desenhos.astro`, `ui/Desenho.astro`, `obras/ObraCard.astro`,
`obras/BlocoObras.astro`, `obras/FichaTecnica.astro`.
Scripts: `menu.js`, `filtros.js`, `reveal.js`.
Páginas: `/obras` (portfólio), `/obras/[...slug]` (obra).
Obras com dados provisórios: praca-abraao, bowl-do-gringo, pista-laguna.

O `index.astro` ainda é uma página de teste. A home de verdade é o item 7.
Ainda não existem: `/servicos`, `/contato`, `/404`.

Removidos do template padrão do Astro: `Layout.astro`, `Welcome.astro`,
`astro.svg`, `background.svg`.

---

## DECISÕES FECHADAS

| Assunto | Decisão |
|---|---|
| Hospedagem | Cloudflare Workers Static Assets |
| Banco de dados | Nenhum. Conteúdo em Markdown |
| Fotos das obras | `src/assets/obras/<slug>/` no formato original. O Astro converte para WebP com srcset no build |
| `public/` | Só favicon, robots, `_redirects`, imagem de OG |
| Formulário | WhatsApp como CTA principal + Web3Forms em `/contato` |
| Visual | Preto/concreto + laranja `#E85A24` no máximo 15% da tela |
| Branch | `main` |

---

## DESIGN SYSTEM

| | |
|---|---|
| Preto / concreto | `#0A0A0A` `#111111` `#202020` |
| Cinzas | `#777777` `#D8D8D8` |
| Off-white / branco | `#F2F1EC` `#FFFFFF` |
| Laranja identidade | `#E85A24` |
| Títulos e números | Bebas Neue 400 |
| Texto e navegação | Inter 400/500/600/700 |
| Dados técnicos | IBM Plex Mono |
| Linhas | 1px, `rgba(255,255,255,.12)` e `.25` |

Regras que não se negociam: canto reto, sem gradiente, sem sombra, sem card
arredondado, grid assimétrico. Desenhos técnicos em SVG são estrutura da
interface, não enfeite.

Referência visual: `prototipo-longarfino-v2.html` (fora do repositório).

---

## PÁGINAS PLANEJADAS

| Rota | Estado |
|---|---|
| `/` | não iniciada |
| `/obras` | pronta — blocos de 4 + filtros |
| `/obras/[slug]` | pronta — ficha técnica, capa, estudo de caso, CTA |
| `/servicos` | não iniciada |
| `/contato` | não iniciada |
| `/404` | não iniciada |

---

## OBRAS A PUBLICAR

| Slug | Nome | Cidade | m² | Tipo | Fotos |
|---|---|---|---|---|---|
| praca-abraao | Praça do Skate — Abraão | Florianópolis/SC | 1250 | Street | pendente |
| bowl-do-gringo | Bowl do Gringo | Garopaba/SC | 650 | Bowl | pendente |
| pista-laguna | Pista Laguna | Laguna/SC | 420 | Street, em execução | pendente |
| park-campeche | Park Campeche | Florianópolis/SC | 780 | Park | pendente |
| pista-trindade | Pista Trindade | Florianópolis/SC | 450 | Bowl | pendente |
| pista-estaleirinho | Pista Estaleirinho | Balneário Camboriú/SC | 380 | Park | pendente |
| reforma-imbituba | Reforma Imbituba | Imbituba/SC | 300 | Reforma | pendente |

Os números acima vieram do protótipo e **precisam ser conferidos** com o Lucas
antes de publicar.

---

## ORDEM QUE NÃO PODE INVERTER

1. Deploy contínuo antes do design — FEITO
2. Coleção de obras antes da home (a home consome a coleção)
3. Página da obra antes do portfólio (o card precisa saber para onde aponta)
4. Conteúdo real antes do ajuste fino (texto de verdade quebra layout)
5. SEO antes da virada (301 depois de perder posição não recupera igual)

---

## ROADMAP

- [x] Semana 1 — Fundação: setup, deploy contínuo
- [x] Item 1 — Layout base
- [x] Item 2 — Desenhos técnicos em SVG
- [x] Header e Footer
- [x] Item 3 — Coleção de obras
- [x] Item 4 — Página da obra
- [x] Item 6 — Portfólio com blocos e filtros
- [ ] Semana 2 — Obras: coleção, página da obra, carrossel, portfólio com filtros
- [ ] Semana 3 — Conteúdo real: home completa, serviços, contato, migração
- [ ] Semana 4 — SEO, performance, testes, virada de domínio
- [ ] Semana 5 — Acompanhamento no Search Console

---

## PENDÊNCIAS EM ABERTO

- Separar o acervo de fotos por obra (BLOQUEIO da Semana 2)
- Mapear as URLs atuais do WordPress para os 301
- Conferir os números das obras (m², cliente, datas) com o Lucas
- Definir: site com `www.` ou sem? A outra recebe 301
- Página "A Longarfino" separada ou seção da home?

---

## REGISTRO DE SESSÕES

**30/08/2026 — Semana 1 concluída**
Projeto Astro criado, estrutura de pastas gerada por script, sitemap instalado,
repositório no GitHub, Worker conectado ao repo com build automático.
Testado: alteração no `index.astro` + push publicou sozinho.
Descoberto: `bash` fora do PATH do PowerShell; caminho do projeto tem espaço e
acento (`Projetos PROGRAMAÇÃO`) — suspeito número um se aparecer erro estranho
de caminho no build.

**30/08/2026 — Item 1: layout base**
Criados `Base.astro`, `base.css`. Limpeza do template padrão.
Armadilha encontrada: ao criar arquivo `.astro` pelo VS Code, ele salva como
`.astro.html`. Conferir com `dir` depois de criar arquivo novo, ou renomear com
`Rename-Item`.
Decidido sobre fotos: NÃO converter antes de subir. O `image()` do Astro gera
WebP com srcset no build (medido: 185 kB → 19 kB). Enviar JPG/PNG original,
lado maior 2400px+ para capa. Nada de HEIC. Limite por obra: 1 capa + 5 a 7
internas — a definir quando o acervo estiver à vista.

**30/08/2026 — Itens 2, 3, 4 e 6**
Biblioteca de 10 desenhos técnicos + planta grande, como `<symbol>` SVG.
Coleção de obras validando pelo schema. Página da obra e portfólio prontos.

Decisão de layout do portfólio: grade em BLOCOS de até 4 obras, não uma grade
única. Cada bloco tem arranjo próprio para 4, 3, 2 ou 1 obra, então o filtro
esconde cards sem deixar buraco — e o bloco vazio some sozinho via
`:not(:has(> a:not([hidden])))`. Foi a alternativa a remontar a grade por
JavaScript, que seria mais frágil.

Armadilha encontrada: usar template literal no atributo `style` de uma tag
Astro faz a tag não abrir e o HTML vazar como texto na tela. Usar concatenação
com `+` numa const antes da tag.

Armadilha encontrada: a classe `.rv` deixa o elemento com opacity 0 esperando
o `reveal.js`. Enquanto o script não estiver carregado na página, qualquer
elemento com `.rv` fica invisível. O script agora está no `Base.astro`.