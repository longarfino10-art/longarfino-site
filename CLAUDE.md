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

Node >= 22.12. Para deixar o servidor rodando em segundo plano:
`npx astro dev --background`, e depois `astro dev stop`, `status` ou `logs`.

Não há teste nem lint no projeto. A verificação é o `npm run build` passar e
olhar a página.

## Deploy

`git push` na `main` publica sozinho — o Cloudflare Workers Builds observa o
repositório. Não existe workflow em `.github/`. Nunca commitar `dist/`.

## Como o conteúdo funciona

Cada obra é um `.md` em `src/content/obras/`, validado pelo schema em
`src/content.config.ts`. As fotos ficam em `src/assets/obras/<slug>/` e são
referenciadas no frontmatter por caminho relativo:

    capa: "./../../assets/obras/<slug>/arquivo.jpeg"

Esse formato de caminho é obrigatório — é o que faz o `image()` do schema
otimizar a foto (WebP + srcset) no build. Foto em `public/` não é otimizada.

`_MODELO.md` é ignorado pelo loader (padrão `[^_]*.md`).

`status: em_execucao` muda cinco lugares sozinho: a obra vai para o slot grande
da home, ganha a etiqueta "Em execução" no card e na ficha técnica, aparece na
cartão dentro do Hero e exibe a barra de andamento.

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
| `worker/index.js` | `POST /api/publicar`: confere o Cloudflare Access e faz **um** commit com tudo pela Git Data API |
| `worker/montar.js` | Transforma o formulário no `.md` + fotos. Sem dependência de runtime — é a parte testável |

As fotos são reduzidas no celular (2000px, JPEG 0.82) antes de subir.

Três modos: **andamento** (só obras em execução; tem o "Obra entregue", que
vira `status: concluida`), **obra nova** e **editar** (qualquer obra; a
galeria mostra miniaturas geradas no build com `getImage`).

**Mexeu no schema, mexa no `worker/montar.js`.** É ele que escreve o
frontmatter; se sair de sincronia, o painel grava algo que o build recusa.

**Regra inegociável: editar sem mexer em nada regrava o arquivo byte por byte
igual.** Testado nas 6 obras contra o que está no GitHub. Por isso o
`montar.js` não põe quebra de linha no fim e o painel não inventa etapas numa
obra que não tinha. Qualquer mudança no `montar.js` repete esse teste: ler
cada `.md` com `js-yaml`, passar pelo `montarArquivos()` com o `slug`, e
comparar com `git show HEAD:<arquivo>` (o disco no Windows tem CRLF; o
repositório, LF).

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
`.dev.vars`, o `/api/publicar` devolve os arquivos que gravaria em vez de
commitar — é como se testa o painel sem tocar no repositório. Essa variável
nunca vai para produção. No Windows, parar o wrangler deixa processos
`workerd` órfãos segurando a porta — se a porta estiver ocupada, use outra
(`--port 8788`) em vez de sair matando processo.

Depois de publicar, o painel trava o botão até recarregar: a tela ainda tem
os dados de antes, e enviar de novo desfaria o que acabou de subir.

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
