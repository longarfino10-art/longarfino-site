# Longarfino Skateparks — Planejamento

## ONDE ESTAMOS

**Data:** 04/09/2026
**Estado:** **site no ar no domínio próprio.** Home, oito rotas, formulário
funcionando, GA4 coletando, desempenho mobile em 94.
**Falta:** acompanhamento e o que está listado em "Depois do ar".

Site em https://longarfinoskateparks.com.br
Deploy automático: `git push` publica sozinho.

⚠ **Este arquivo vive no repositório desde 02/09.** Antes existia só no Projeto
do Claude, fora do controle de versão. O repositório é privado — por isso pode
conter CNPJ, endereço e telefones.

---

## VIRADA DE DOMÍNIO — 04/09

| Item | Valor |
|---|---|
| Registrador | Registro.br |
| Nameservers | `michael.ns.cloudflare.com` · `nicole.ns.cloudflare.com` |
| Anteriores | `ns1.dns-parking.com` · `ns2.dns-parking.com` (Hostinger) |
| Worker conectado a | `longarfinoskateparks.com.br` e `www.` |
| Redirect `www` → raiz | Regra de redirecionamento, 301, padrão curinga |
| Plano Cloudflare | Free — 100 mil requisições/dia, folgado para o volume |

**Registros DNS apagados** ao conectar o Worker: dois `A` e dois `AAAA` do
domínio raiz, mais o `CNAME` do `www` que apontava para o CDN da Hostinger.
O Worker recusa o domínio enquanto houver registro externo no raiz.

**Registros mantidos:** dois `MX` da Hostinger, o `TXT` do SPF, `ftp`,
`autoconfig` e `autodiscover`. Preservam e-mail no domínio, que aparentemente
ninguém usa — o contato oficial é o Gmail.

**O site antigo em WordPress saiu do ar** pelo domínio. A hospedagem na
Hostinger continua existindo até alguém cancelar.

---

## GOOGLE ANALYTICS 4

| Item | Valor |
|---|---|
| Propriedade | Longarfino Skateparks |
| Fluxo | Site institucional |
| Código do fluxo | 15670436851 |
| **ID de métricas** | **G-CRTNZQVV6C** |
| Componente | `src/components/layout/Analytics.astro` |

Só carrega em produção — `import.meta.env.PROD`. Em `npm run dev` o script nem
entra na página, para não sujar os relatórios.

**A `/obrigado` serve de conversão.** Criar evento a partir de `page_view` com
`page_location` contendo `/obrigado` para medir quantos orçamentos o site gera.

---

## FORMULÁRIO DE CONTATO

| Item | Valor |
|---|---|
| Serviço | Web3Forms (gratuito) |
| Chave | `c4324df9-9686-4d5e-8d39-f5c79077278a` — pública por natureza |
| Destino | longarfinoparks@gmail.com |
| Assunto | "Pedido de orçamento pelo site" |
| Campos | Nome · E-mail · Telefone · Cidade/estado · Tipo de obra · Metragem (opcional) · Mensagem |
| Antispam | Campo `botcheck` escondido no CSS |

**O `redirect` é montado pelo ambiente:** em produção usa o `Astro.site` do
`astro.config.mjs`; em desenvolvimento usa `Astro.url.origin`. Com endereço
fixo, o teste local caía na página padrão do Web3Forms, em inglês.

---

## ATESTADO DE CAPACIDADE TÉCNICA — CBSk

| Item | Valor |
|---|---|
| Número | 004/2026 |
| Emissor | Confederação Brasileira de Skate (CBSk) |
| Emissão | 05/08/2026 |
| **Validade** | **05/08/2027 — renovar antes** |
| Assinatura | Digital, Carlos Eduardo Dias, presidente |
| PDF | `public/documentos/atestado-cbsk-004-2026.pdf` |
| Página | `/atestado` |

**Metragem do atestado é do TRECHO VISTORIADO, não da obra inteira.** Resolve a
divergência com as obras publicadas: Abraão aparece com 780,11 m² no atestado e
1.600 m² no site, e os dois estão certos.

| Obra | Local | Tipo | Papel | Cliente | Trecho |
|---|---|---|---|---|---|
| Pista de Trindade | Florianópolis/SC | Street | Execução e assessoria | Satélite Construções | +1.200 m² |
| Pista do Abraão | Florianópolis/SC | Street, Park | Execução e acompanhamento | Hefer Construções | 780,11 m² |
| Tarumã | Curitiba/PR | Street, Park | Execução e assessoria | RAC Engenharia | 763,55 m² |
| Munari Skatepark | Imbituba/SC | Street, Bowl, Simulador, Miniramp | Execução | Munari Skatepark | 600 m² |
| Pista Palhoça | Palhoça/SC | Bowl | Execução e assessoria | Crestani Comércio | 450 m² |
| Miniramp e street raia | Imbituba/SC | Madeira e concreto | Projeto e execução | Cinco Continentes — AEB5CON | 86 m² |
| Estaleirinho | Bal. Camboriú/SC | Street | Execução | Prefeitura de Bal. Camboriú | 64 m² |

Soma publicada: **4.343,66 m²** dos 12.360 construídos.

**Fora da lista:** Pista Fábio Pereira (Imbituba/SC, street e bowl, 400 m²).
Cliente pessoa física — só entra com aval do proprietário.

**O PDF publicado teve os oito contatos removidos.** Três tentativas foram
necessárias:
1. Tarja desenhada por cima — o texto continuava embaixo, legível por `Ctrl+F`
   e por copiar e colar. **Descartada.**
2. Redação de verdade, mas dois contatos passaram sem tarja.
3. Versão final, todos removidos do texto.

**Regra:** nunca substituir pelo arquivo original. Ele expõe celular de
servidora pública e de pessoa física. Conferir toda nova versão com `Ctrl+F`.

**Nota:** a Prefeitura de Balneário Camboriú é o único cliente público nomeado
no atestado. Vale mais em licitação do que os 64 m² sugerem.

---

## DADOS OFICIAIS (conferidos no CNPJ)

| Item | Valor |
|---|---|
| Razão social | LONGARFINO SKATE PARKS LTDA |
| CNPJ | 33.589.280/0001-74 |
| Nome fantasia | LONGARFINOSKATEPARK |
| Abertura | 10/05/2019 |
| **Sede** | **Rod. SC 434, 169, Aracatuba, Imbituba — SC, CEP 88.780-000** |
| CNAE principal | 43.99-1-03 — Obras de alvenaria |
| Porte | ME |
| m² construídos | 12.360 |
| Obras entregues | 15 (16 pastas no Drive, uma é piso industrial) |
| Estados | 5 — SC, PR, RS, SP, BA |
| WhatsApp | (51) 98624-5321 |
| E-mail | longarfinoparks@gmail.com |
| Instagram | @longarfinoskateparks |
| WhatsApp do dev | (51) 98615-8345 |

**Atenção:** o e-mail no cartão CNPJ ainda é o hotmail antigo — vale atualizar
na Receita.

**Sobre 2007:** a empresa abriu em 2019, mas o site diz "19+ anos de
experiência" desde 2007, que é quando o Paulo começou a construir. Está
correto: a seção fala de experiência, não de idade da empresa.

---

## ESPECIFICAÇÃO TÉCNICA (na Nossa diferença)

Dados reais fornecidos pelo Lucas em 02/09. É o que separa o site dos
concorrentes — nenhum publica traço de concreto.

| # | Item | Valor |
|---|---|---|
| 01 | Traço | 30 a 40 MPa, A/C 0,40–0,42. 40 MPa nas áreas de impacto. Fibras de polipropileno. Acabamento polido manual |
| 02 | Piso plano | 12 a 15 cm, malha Q-192 sobre lona plástica |
| 03 | Transição | 15 a 20 cm, malha dupla |
| 04 | Fôrmas curvas | Compensado naval, costelas em CNC/laser. Solo selado com 5 cm de concreto magro. Shotcrete moldado com régua flexível. Coping soldado na malha antes da concretagem |

Nota publicada: dimensões podem variar conforme projeto, modalidade e
topografia.

---

## PESQUISA DE MERCADO (02/09)

| Empresa | País | Stack do site |
|---|---|---|
| California Skateparks | EUA, 500+ pistas | **Wix** |
| Convic | Austrália, 700+ obras | WordPress, WP Rocket, GTM |
| Grindline | EUA, 400+ pistas | WordPress + Elementor |

**Conclusão:** nenhuma tem tecnologia melhor que a nossa.

**O que elas têm e nós não:**
1. Depoimento de gestor público com nome, cargo e município
2. Processo detalhado em páginas próprias
3. Página de prêmios
4. Mapa de obras
5. Material para captar contato — relatório grátis em troca do e-mail
6. Certificação técnica explícita (a CBSk já está feita; falta o CREA do Leandro)

**Padrão que elas seguem:** cada frase carrega um número ou procedimento
verificável.

---

## STACK

- Astro 7.2.9 — exige Node >= 22.12.0
- Markdown para as obras, sem banco
- Cloudflare Workers com Static Assets
- Custo mensal R$0. Único custo: o domínio no Registro.br

Repositório: https://github.com/longarfino10-art/longarfino-site (privado)
Pasta local: C:\Users\longa\Documents\Projetos PROGRAMAÇÃO\longarfino-site
Terminal: PowerShell. Para .sh: `& "C:\Program Files\Git\bin\bash.exe" arquivo.sh`

**Fontes locais** via `@fontsource`. Nada vem do Google. Bebas Neue 400,
IBM Plex Mono 400/500, Inter 400/500/600/700 — cada uma com `latin` E
`latin-ext`. Bebas e Inter 400 entram com `preload`, importadas com `?url` para
o Astro resolver o hash a cada build.

**Arquivo novo:** criar vazio com `New-Item` antes de colar.

**Nome de arquivo:** minúsculo, hífen, sem espaço e sem acento.

**Caminho com colchete no PowerShell:** usar `-LiteralPath`.

---

## O SITE HOJE

| Rota | Estado |
|---|---|
| `/` | Hero · Obras · Serviços · Nossa diferença · A Longarfino · Galeria · Chamada |
| `/obras` | portfólio com blocos e filtros gerados dos tipos reais |
| `/obras/[slug]` | seis obras publicadas |
| `/a-longarfino` | história desde 1997, dois registros de época, equipe |
| `/atestado` | atestado da CBSk, sete trechos, link do PDF |
| `/contato` | **nova em 04/09** — formulário Web3Forms, sete campos |
| `/obrigado` | **nova em 04/09** — confirmação com check traçado em SVG |
| `/404` | atalhos + crédito do dev |
| `/politica-de-privacidade` | revisada por advogado em 04/09 |

### Componentes

| Arquivo | O que é |
|---|---|
| `layout/Analytics.astro` | **Novo em 04/09.** GA4, só em produção |
| `layout/Trilha.astro` | Breadcrumb das internas. A home não usa |
| `home/Hero.astro` | Foto real, parallax, inclinação com o mouse |
| `home/Obras.astro` | 4 destaques. Obra em execução ganha o card grande |
| `home/Servicos.astro` | 6 serviços com desenho cotado |
| `home/Diferenca.astro` | Foto ao topo, especificação técnica, selo do atestado |
| `home/Numeros.astro` | Números, história resumida, equipe, feedback em rodízio |
| `home/Galeria.astro` | Tira de 5 fotos, gap de 8px |
| `home/Chamada.astro` | CTA com WhatsApp e link para `/contato` |
| `home/Processo.astro` | **Sem uso.** Guardado |
| `home/Mapa.astro` | **Sem uso na home.** Guardado para `/obras` |
| `home/Diferenca-etiquetas.astro.bak` | Versão anterior da Diferença |

**Favicon:** `public/favicon.png` (512×512) e `public/apple-touch-icon.png`
(180×180), exportados do Corel pelo Lucas em 04/09. Substituíram o SVG padrão
do template Astro, que estava no ar desde a criação do projeto. Fundo preto
sólido — favicon transparente some em navegador com tema claro.

---

## OBRAS PUBLICADAS

| Slug | Obra | Cidade | m² | Tipo | Período |
|---|---|---|---|---|---|
| pista-trindade | Pista Trindade | Florianópolis/SC | 2.068 | Street | out/2022 a mai/2023 |
| park-abraao | Park Abraão | Florianópolis/SC | 1.600 | Bowl, Street | fev/2023 a fev/2024 |
| ct-curitiba | Centro de Treinamento de Curitiba | Curitiba/PR | 1.200 | Park, Street, Bowl | jan a mai/2025 |
| pista-morrinhos | Pista Morrinhos | Garopaba/SC | 600 | Bowl, Street | jan a abr/2025 |
| skate-street-indaial | Skate Street Indaial | Indaial/SC | 500 | Street | mai/2023 a mar/2025 |
| pista-palhoca | Pista Palhoça | Palhoça/SC | 312 | Street | dez/2022 a jan/2023 |

Somam 5.412 m² dos 12.360 totais. Destaques na home: Trindade, Curitiba,
Abraão, Morrinhos.

**Papel da Longarfino: execução.** Na Trindade o projeto foi de outras empresas
(Ruaria e Spot).

**Nota sobre os filtros:** quase todas as obras têm vários tipos ao mesmo
tempo, então filtrar muda pouco a grade. Passa a fazer sentido quando as outras
dez entrarem.

**Fora do site, no Drive (16 pastas):** Reforma Estaleirinho, Ampliação Munari,
Pista Tormam, Pista Rodrigo Itapiruba, Pista Yerba, Piso Industrial, Mini Ramp
João Paulo, Concretagem de Obstáculos, Pista Paulo Lopes, Pista Madeira
Campeche, Mini Rampa Tuco.

**Laguna:** 360 m², em execução, sem fotos. Obra pública de R$ 318,2 mil,
contrato com a Udesc assinado em 05/03/2026, prazo de 120 dias. Recurso de
emenda parlamentar com intermediação da Cufa Laguna.

---

## FEEDBACKS PUBLICADOS

- @munariskatepark — "Munariskatepark padrão Longarfino de qualidade."
- @kelvin_simoess — "Galera vai ter uma pista de primeira!!"
- @viniciusbilly — "Obrigado pela excelência no trabalho realizado"

Não usados: @beppigirardi, @philipegh, @graziribaskiprado (da equipe).

**Regra:** depoimento só entra copiado literalmente do post, com o @ do autor.

---

## DECISÕES FECHADAS

| Assunto | Decisão |
|---|---|
| Hospedagem | Cloudflare Workers Static Assets |
| Banco de dados | Nenhum. Markdown |
| Fotos | `src/assets/obras/<slug>/` no original |
| Fontes | Locais, via `@fontsource`. Preload em Bebas e Inter 400 |
| **Domínio** | **Sem `www.`. O `www.` recebe 301** |
| Formulário | WhatsApp como CTA rápido + Web3Forms em `/contato` |
| Visual | Preto/concreto + laranja `#E85A24` em no máximo 15% da tela |
| Botões | `.btn` de contorno é o padrão. `.btn--fill` laranja só em CTA principal |
| Navegação | Breadcrumb nas internas. Menu aponta para `/contato`, não para a âncora |
| Menu | Obras · O que fazemos · Nossa diferença · A Longarfino · Contato |
| Menu mobile | Cinco itens em Bebas, sem numeração, com WhatsApp e e-mail no pé |
| Serviços | Só concreto. Miniramp, madeira, piso polido e simulador ficam de fora |
| Rastreadores | Google Analytics sim, Pixel do Facebook não |
| Branch | `main` |

---

## DESIGN SYSTEM

| | |
|---|---|
| Preto / concreto | `#0A0A0A` `#111111` `#202020` |
| Cinzas | `#777777` `#D8D8D8` |
| Off-white / branco | `#F2F1EC` `#FFFFFF` |
| Laranja | `#E85A24` |
| Títulos e números | Bebas Neue 400 |
| Texto e navegação | Inter |
| Dados técnicos | IBM Plex Mono |
| Linhas | 1px, `rgba(255,255,255,.12)` e `.25` |

Canto reto, sem sombra, sem card arredondado, grid assimétrico.

**Contraste:** `.ft nav a` usa `--gray-200`, não `--gray-500`. `.btn--fill` tem
texto preto sobre o laranja — branco dava ~3,3:1, abaixo do mínimo.

**Fonte: `.d` é obrigatória nos títulos.** A Bebas vem da classe `.d`, não do
elemento `h1`/`h2`.

**Fallback do `--ff-display`:** `Arial Narrow` e condensadas. Era `Impact`, que
mascarava falha de fonte por ser bonito no contexto.

**Header:** quatro filhos — logo, nav, CTA e burger. O nav é `position:
absolute` centrado, porque dentro do flex o CTA mais largo o empurrava. Nada de
`:first-child` ou `:last-child` aqui.

**Âncoras:** `[id]{scroll-margin-top:clamp(63px,6.6vw,83px)}` no `base.css`.
O `Trilha.astro` usa o mesmo valor no `padding-top`.

**Ordem do menu = ordem das seções.**

---

## DESEMPENHO

PageSpeed, aba Celular.

| | Site antigo | 02/09 manhã | 02/09 noite |
|---|---|---|---|
| Desempenho | 88 | 87 | **94** |
| Acessibilidade | 83 | 94 | 94 |
| Práticas recomendadas | 92 | 100 | 100 |
| SEO | 92 | 100 | 100 |
| FCP | 2,0 s | 2,7 s | **1,4 s** |
| LCP | 3,3 s | 3,2 s | 2,8 s |
| TBT / CLS | 0 ms / 0.001 | 0 / 0 | 0 / 0 |

Fontes locais tiraram os 750 ms do Google Fonts; o preload derrubou o caminho
crítico de 851 ms para 390 ms.

**Ainda em aberto:** 269 KiB de imagem "economizável" nas capas — não comprimir,
a foto é o produto. Acessibilidade em 94, com contraste e ordem de títulos
ainda apontados.

---

## TESTAR NO SITE NO AR

1. `/contato` abre o formulário — havia um redirect antigo mandando para a
   âncora da home, removido em 04/09
2. Enviar o formulário e cair na `/obrigado`
3. GA4 registrando no tempo real
4. `www.` redirecionando para a versão sem
5. Os 301: `/portfolio/`, `/gallery/pista-trindade/`, `/gallery/skate-park-abraao/`

---

## DEPOIS DO AR

- **Cadastrar no Google Search Console e enviar o sitemap**
- Publicar as outras 10 obras
- Estudo de caso da Palhoça
- CREA do Leandro (conta em licitação pública)
- Laguna quando tiver foto
- Seção de obra pública com os dados de licitação
- Conteúdo técnico sobre concreto, para SEO
- Os seis achados da pesquisa de mercado
- Trocar os `alt` genéricos da galeria por descrição com cidade
- Aval do Fábio Pereira para publicar a obra dele
- Confirmar se alguém usa e-mail no domínio; se não, limpar os MX da Hostinger
- Cancelar a hospedagem da Hostinger, se não houver mais nada lá
- Painel de cadastro de obras (Decap ou Sveltia CMS), se o volume justificar
- Limpar a regra órfã `.df-hd span:last-child` no `Diferenca.astro`
- Apagar `Diferenca-etiquetas.astro.bak`
- Resolver os 5 avisos de tipo do TypeScript (não quebram o build)
- **Escrever o `CLAUDE.md`** — à mão, menos de 150 linhas, só o específico

---

## ARMADILHAS JÁ ENCONTRADAS

**Fontes**
- `@fontsource` precisa de `latin` E `latin-ext`.
- `font-display: swap` faz o texto piscar. Resolve com `preload`.
- Caminho de fonte tem hash que muda a cada build. Importar com `?url`.

**Astro**
- Template literal no atributo `style` faz a tag não abrir e o HTML vazar.
- `.rv` deixa o elemento com opacity 0 esperando o `reveal.js`.
- Caminho de imagem nos `.md`: `./../../assets/obras/<slug>/arquivo.jpeg`
- Variável CSS inexistente derruba o bloco. `--concrete-2` não existe.

**CSS**
- `grid-template-columns` repetido por linha desalinha as colunas. Definir no
  contêiner e usar `subgrid`.
- `max-width` em `ch` muda conforme a fonte. Onde a medida importa, usar px.
- **Regra genérica pega o que não devia.** `.menu a` alcançava também o botão
  do CTA e zerava o padding dele. Usar `.menu nav a`.
- **Em flex column os filhos esticam na horizontal.** O botão ficava com 100%
  de largura e a seta era empurrada para fora.

**SVG**
- `<symbol>` mora no `Desenhos.astro` (plural). O singular só exibe.
- `font-family="var(--ff-mono)"` não funciona em atributo de apresentação.
- **Regra de `<style>` com escopo às vezes não alcança o SVG.** Quando falhar,
  usar atributo direto na tag: `fill`, `stroke`, `stroke-width`.
- **Não desenhar tipografia à mão em `<path>`.** O "LS" do favicon saiu
  deformado. Exportar de editor gráfico, com o texto convertido em curvas.

**Redirects**
- **Regra do `_redirects` pode sequestrar página criada depois.** `/contato/`
  apontava para `/#contato` desde o WordPress e continuou valendo quando a
  página passou a existir.
- Mapear uma URL para ela mesma pode gerar loop. A `/politica-de-privacidade/`
  foi removida por isso.

**Edição de arquivo**
- Substituir bloco que termina em `</style>` já duplicou a tag.
- **Find/replace com blocos grandes embaralha o arquivo.**
- **Acento quebra o find/replace.** O arquivo no disco está em codificação
  diferente da que o chat produz. Usar trecho sem acento como âncora.
- **Conferir o valor colado.** Um `font-size: 12.5px` virou `5px` numa
  substituição e o botão sumiu.

**PDF**
- Tarja preta desenhada por cima **não apaga o texto.**
- Editar PDF assinado digitalmente invalida a assinatura.

**Dados**
- O protótipo continha obras, contatos e métricas inventados.
- A descrição da Palhoça estava trocada com a de Indaial.
- Imagem "restaurada" por IA apagou uma pessoa da foto de 2011.

---

## REGISTRO DE SESSÕES

**30/08 — Semana 1.** Projeto Astro, deploy contínuo, GitHub, Worker.

**30/08 — Itens 1 a 6.** Layout base, desenhos SVG, coleção de obras, página da
obra, portfólio.

**31/08 — Hero e Números.** Parallax, inclinação, mapa do Natural Earth.

**01/09 — Home completa.** Todas as seções, `/404`, container unificado,
âncoras calibradas, redirects 301.

Descoberta: a coleção estava com dados inventados pelo protótipo e o telefone e
e-mail do rodapé estavam errados em produção.

**02/09, manhã — Conteúdo real.** `/a-longarfino` com a história desde 1997,
incluindo a Onlybyskate (criada em 2011 por Paulo com Rodrigo Rosa, organizada
com o jornalista Nilo Dias Cabral; 1ª etapa no Banx da Restinga em set/2011 com
30 competidores e ~300 pessoas; aniversário em 2012 no Cecores com 51
competidores, ~400 pessoas e 40 kg de alimentos doados). Seis obras publicadas.
Feedbacks reais. Sede corrigida. Política de privacidade.

Não publicados: nomes de creches e escolas, apoiadores, telefones pessoais.

**02/09, tarde — Performance, atestado e navegação.** Fontes migradas para
`@fontsource` com preload: 87 para 94, FCP de 2,7 s para 1,4 s. Pesquisa das
três referências mundiais. Nossa diferença reescrita com especificação técnica.
Atestado da CBSk incorporado. Breadcrumb nas internas, após pesquisa no NN/g.
Botões padronizados. Contraste corrigido. Decidido o domínio sem `www.`.

Descoberto: o `PLANEJAMENTO.md` nunca esteve no repositório.

**04/09 — Lançamento.**

GA4 instalado e coletando. `/contato` e `/obrigado` criadas, formulário testado
de ponta a ponta com e-mail chegando. Menu e CTA do header passaram a apontar
para a página, não para a âncora. Header com o nav centralizado de verdade.
Menu mobile refeito: sem numeração, botão menor, fio laranja traçado na
abertura. Filtros do portfólio gerados dos tipos reais — "Reforma" e "Execução"
apareciam sem nenhuma obra. Favicon trocado pela marca da empresa.

Política de privacidade revisada por advogado.

**Virada de domínio concluída.** Nameservers no Registro.br apontados para o
Cloudflare, Worker conectado ao domínio e ao `www`, redirect 301 configurado.
Propagação em menos de uma hora.

Descoberto após a virada: o `_redirects` mandava `/contato/` para a âncora da
home e sequestrava a página nova. Corrigido junto com a regra faltante do
Abraão e a remoção do mapeamento circular da política de privacidade.