# Longarfino Skateparks — site

Site institucional de uma construtora de pistas de skate em concreto.
Astro estático, conteúdo em Markdown, hospedado no Cloudflare Workers.
No ar em https://longarfinoskateparks.com.br

`PLANEJAMENTO.md` é a memória do projeto: estado atual, decisões já fechadas,
armadilhas e registro de sessões. Ler antes de mudança grande, atualizar depois.

## Comandos

    npm run dev       # localhost:4321
    npm run build     # gera ./dist
    npm run preview   # confere o build
    npm test          # testes do painel e do Worker

Node >= 22.12. Para deixar o servidor rodando em segundo plano:
`npx astro dev --background`, e depois `astro dev stop`, `status` ou `logs`.

`npm test` roda os testes do painel e do Worker (`testes/`, com o `node:test`,
sem dependência nova). Rode antes de publicar qualquer mudança em `worker/`
ou no schema. O resto se verifica com o `npm run build` passando e olhando a
página. Não há lint.

## Deploy

`git push` na `main` publica sozinho — o Cloudflare Workers Builds observa o
repositório. Não existe workflow em `.github/`. Nunca commitar `dist/`.

Cabeçalhos de cache e segurança em `public/_headers` (`/_astro/*` guardado
por um ano — o nome tem hash; `/admin/*` sem cache). A API põe os seus no
`json()` do `worker/index.js`.

**Imagem de compartilhamento** (WhatsApp, Instagram): gerada no build pelo
`Base.astro`, 1200×630 JPEG. Página de obra usa a capa da obra (`imagemOg`);
as outras usam `fotoDeCompartilhar()` de `src/lib/capa.ts` — capa subida no
painel, senão a capa da primeira obra da vitrine. Nunca a `hero.webp`, que
está marcada como provisória. A home leva a ficha da empresa para o Google
(`dadosEstruturados`, schema.org), só com dado conferido no CNPJ.

## Como o conteúdo funciona

Cada obra é um `.md` em `src/content/obras/`, validado pelo schema em
`src/content.config.ts`. As fotos ficam em `src/assets/obras/<slug>/` e são
referenciadas no frontmatter por caminho relativo:

    capa: "./../../assets/obras/<slug>/arquivo.jpeg"

Esse formato de caminho é obrigatório — é o que faz o `image()` do schema
otimizar a foto (WebP + srcset) no build. Foto em `public/` não é otimizada.

`_MODELO.md` é ignorado pelo loader (padrão `[^_]*.md`).

`status: em_execucao` muda cinco lugares sozinho: a obra vai para o slot grande
da home, ganha a etiqueta "Em execução" no card e na ficha técnica, aparece no
cartão dentro do Hero e exibe a barra de andamento.

## Vitrine da capa

O fundo do Hero alterna fotos. A configuração fica em `src/data/vitrine.json`
(ligada ou não, segundos por foto, lista de fotos) e o painel grava esse
arquivo. Cada item é `{ "tipo": "principal" }` ou `{ "obra": "<slug>" }`, com
`"foto"` opcional para usar outra foto da obra que não a capa.

**Capa principal:** `vitrine.capa` com o nome de um arquivo em
`src/assets/capa/` (subido pelo painel). Sem esse campo, ou com arquivo que
não existe, vale a original `src/assets/hero.webp`.

- A legenda **não fica no JSON**: sai da obra no build (nome, cidade, período
  ou porcentagem). Nunca desatualiza nem é digitada duas vezes.
- Obra apagada ou foto que saiu da obra: o item é pulado. A home nunca quebra
  por causa da vitrine — testado com uma obra inexistente na lista.
- `src/lib/fotos.ts` liga o caminho escrito no `.md` à foto resolvida pelo
  `image()`. A coleção perde o caminho original; o `.md` cru tem os dois.
- Legenda num **marcador de mapa** sobre a foto: o quadrado laranja do ponto
  final do título pulsando, um raio de 1px em diagonal e o texto na ponta.
  Entra depois que a foto termina de chegar. Posição por foto em
  `slides[].marcador` (`{x, y}` em % da tela), ajustável no painel; sem ajuste,
  55% × 34%. Com x > 62 o rótulo vira para a esquerda.
- **No celular não há marcador sobre a foto** — o título ocupa quase a tela e
  ele caía em cima. Lá entra uma etiqueta compacta acima dos fios (quadrado
  laranja + nome + cidade numa linha), `.vt-etiqueta`; o CSS mostra um ou outro.
  Histórico: a legenda já foi painel no canto (competia com o cartão de obra)
  e depois linha na base (ficava colada nos números) — o Lucas pediu o mapa.
- Os fios de tempo ficam centrados acima do fio dos números, por último dentro
  de `.hero-numeros`: os números usam `:first-child`/`nth-child`.
- A troca espera a próxima foto estar decodificada (`img.decode()`, até 2,5s);
  sem isso a passagem mostrava fundo preto.
- `.hero` usa `overflow: clip`, não só `hidden`: com `hidden`, foco por teclado
  rolava o Hero de lado e a página escorregava.

## Números e depoimentos

**Nada de número escrito à mão.** `src/lib/numeros.ts` calcula m² construídos,
obras entregues e estados atendidos: histórico das obras **fora** do site
(`src/data/numeros.json`, editável no painel) + obras do site com
`status: concluida`. Obra em execução não conta. Usado na capa, na seção
"Em números", na descrição do Google (`index.astro`), no atestado e no mapa.
Os valores de 18/11 reproduzem o site de antes: 12.360 m², 15 obras, 5
estados — com as 6 obras publicadas como concluídas.

Depoimentos em `src/data/depoimentos.json` (`texto`, `autor` com @,
`complemento` e `link` opcionais). Lista vazia → a faixa some do site.

Os mesmos depoimentos surgem num cartão discreto no canto inferior esquerdo
durante a navegação (`ComentarioFlutuante.astro`, ligado por `comentarios` no
`<Base>` só na home, obras e A Longarfino). Regras para não atrapalhar: só
depois da primeira tela, nunca com a seção de depoimentos ou o rodapé à vista,
para com o mouse em cima, ✕ desliga na sessão. 6s na tela, 40s de intervalo,
no máximo 3 por página, duas linhas de texto. No celular só aparece com a
rolagem parada e some assim que a pessoa volta a rolar — a primeira versão
ficava por cima do conteúdo.

## Andamento de obra

A porcentagem **nunca é digitada**. Ela sai do peso das etapas marcadas no
frontmatter — ver `src/lib/progresso.ts`. Etapa em andamento conta metade do
peso. É a mesma regra de sempre: nenhum número sem origem conferível.

- `ProgressoObra.astro` — a barra (fio de 2px + número em mono)
- `CardExecucao.astro` — o cartão no Hero, some sozinho sem obra na rua
- `Andamento.astro` — linha do tempo; vira "Como foi feita" quando conclui

O cartão do Hero desaparece após 45 dias sem atualização, por um script
`is:inline`. Barra parada passa impressão de empresa parada, e o site é
estático: essa conta tem de rodar no navegador, não no build.

## Painel /admin

Tela própria, com a identidade do site. Três peças:

| Arquivo | Papel |
|---|---|
| `src/pages/admin/index.astro` | A tela. Lê os `.md` crus no build (com `js-yaml`) porque o `image()` troca o caminho da foto por objeto |
| `worker/index.js` | Duas rotas: `POST /api/entrar` (confere a senha) e `POST /api/publicar-tudo`: confere a senha/Access e faz **um** commit com todas as alterações pela Git Data API |
| `worker/montar.js` | Transforma cada alteração nos arquivos (`montarArquivos`, `montarVitrine`, `montarNumeros`, `montarDepoimentos`, e `montarTudo` que junta). Sem dependência de runtime — é a parte testável |

As fotos são reduzidas no celular (2000px, JPEG 0.82) antes de subir.

Seis telas: **andamento** (só obras em execução; "Obra entregue" conclui e
pede a metragem final), **obra nova**, **editar** (qualquer obra; galeria com
miniaturas do build), **capa do site**, **depoimentos**, **números do site**.

**Rascunho:** nenhuma tela publica sozinha. "Salvar" guarda no IndexedDB do
aparelho (sobrevive a recarregar; localStorage não aguentaria as fotos), e a
barra fixa embaixo publica tudo de uma vez: um commit, um build. Erro em uma
alteração barra o pacote inteiro e diz qual é. Texto vai direto na árvore do
commit; só foto gasta chamada de rede — o plano gratuito do Workers permite
50 por requisição, então o limite é 40 fotos por publicação.

**Mexeu no schema, mexa no `worker/montar.js`.** É ele que escreve o
frontmatter; se sair de sincronia, o painel grava algo que o build recusa.

**Regra inegociável: editar sem mexer em nada regrava o arquivo byte por byte
igual.** Testado nas 6 obras contra o que está no GitHub. Por isso o
`montar.js` não põe quebra de linha no fim e o painel não inventa etapas numa
obra que não tinha. O `npm test` confere isso em todas as obras publicadas
(`testes/obras.test.mjs`) e nos três JSON de `src/data/` — obra nova entra
no teste sozinha. Um espaço a mais no `montar.js` já derruba 7 testes.

**Proteção, em ordem:** Access configurado (`ACCESS_TEAM` + `ACCESS_AUD` no
`wrangler.jsonc`) → só vale o Access. Senão, segredo `PAINEL_SENHA` → vale a
senha. Nenhum dos dois → a API recusa tudo. Hoje está na senha, porque a
ativação do Zero Trust travou com erro 500 da Cloudflare; quando voltar, é só
preencher as duas variáveis e a senha deixa de valer sozinha.

A senha é comparada por resumo SHA-256 em tempo constante, e cada tentativa
errada espera 1,5s. Sem senha nenhuma a resposta é imediata — é o painel
perguntando se precisa mostrar a tela de entrada.

Segredos do Worker (`GITHUB_TOKEN`, `PAINEL_SENHA`) ficam no painel da
Cloudflare, nunca no repositório.

**Testar o Worker local:** `npx wrangler@4 dev` depois do build, com a senha
de teste em `.dev.vars` (está no `.gitignore`). Com `PAINEL_ENSAIO="1"` no
`.dev.vars`, a API devolve os arquivos que gravaria em vez de commitar — é
como se testa o painel sem tocar no repositório. Essa variável
nunca vai para produção. No Windows, parar o wrangler deixa processos
`workerd` órfãos segurando a porta — se a porta estiver ocupada, use outra
(`--port 8788`) em vez de sair matando processo.

Depois de publicar, o painel trava até recarregar: a tela ainda tem os dados
de antes, e salvar de novo partiria de uma versão velha.

## Regras de conteúdo — as mais importantes do projeto

- **Nenhum dado entra sem conferência.** O protótipo tinha obras, contatos e
  métricas inventados pela IA que chegaram a ir ao ar no site antigo. Metragem,
  data, cliente e cidade saem de documento, não de estimativa.
- **Depoimento só entra copiado literalmente do post, com o @ do autor.**
- **Só foto original.** Uma imagem "restaurada" por IA apagou uma pessoa da
  foto de 2011.
- A empresa assina contrato público. Texto jurídico e dado de licitação são
  conferidos antes de publicar.

## Visual

Tokens em `src/styles/tokens.css`, classes globais em `src/styles/base.css`.

- Preto/concreto + laranja `#E85A24` em no máximo 15% da tela
- Bebas Neue (títulos), Inter (texto), IBM Plex Mono (dados técnicos)
- **Canto reto, sem sombra, sem card arredondado.** Grid assimétrico, fios de
  1px (`--line`)
- Toda seção usa `.sec` e as classes globais `.eyebrow`, `.h-sec`, `.btn`,
  `.arw`, `.mono-sm`. Não criar container próprio
- Ordem do menu = ordem das seções. Mudar uma obriga a mudar a outra, senão
  clicar em um item desce e no seguinte sobe

## Armadilhas que já custaram tempo

**Astro**
- Template literal no atributo `style` faz a tag não abrir e o HTML vazar como
  texto na página
- `.rv` deixa o elemento com `opacity: 0` esperando o `reveal.js`. Sem o
  script, ele fica invisível para sempre
- Variável CSS inexistente derruba o bloco inteiro (`--concrete-2` não existe)

**CSS**
- Regra genérica pega o que não devia: `.menu a` alcançava também o botão do
  CTA e zerava o padding dele. Usar `.menu nav a`
- Em flex column os filhos esticam na horizontal
- `max-width` em `ch` muda conforme a fonte. Onde a medida importa, usar px

**SVG**
- `<symbol>` mora no `Desenhos.astro` (plural). O `Desenho.astro` (singular) só
  exibe. Colar símbolo no singular duplica tudo
- `font-family="var(--ff-mono)"` não funciona como atributo de apresentação.
  Precisa ser `style="font-family:var(--ff-mono)"`
- Não desenhar tipografia à mão em `<path>`

**Redirects**
- Regra do `public/_redirects` sequestra página criada depois: `/contato/`
  apontava para a âncora da home e continuou valendo quando a página passou a
  existir
- Mapear uma URL para ela mesma gera loop

**Nome de arquivo**
- Minúsculo, hífen, sem espaço e sem acento. O build roda em Linux, onde
  `.JPEG` e `.jpeg` são arquivos diferentes

## Onde mexer

| O quê | Onde |
|---|---|
| Cor, fonte, espaçamento | `src/styles/tokens.css` |
| Seções da home | `src/components/home/` |
| Página da obra | `src/pages/obras/[...slug].astro` |
| Schema das obras | `src/content.config.ts` |
| Redirects de SEO | `public/_redirects` |
| Deploy | `wrangler.jsonc` |

`Mapa.astro` e `Processo.astro` existem sem serem importados em lugar nenhum.
Estão guardados de propósito — não são código morto para apagar.
