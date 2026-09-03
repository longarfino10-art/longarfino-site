# Longarfino Skateparks — Planejamento

## ONDE ESTAMOS

**Data:** 02/09/2026 (segunda sessão do dia)
**Estado:** site pronto para o ar, salvo três pendências de terceiros.
Home completa, sete obras publicadas, `/atestado`, `/a-longarfino`, `/404` e
política de privacidade. Desempenho mobile em 94.
**Falta:** GA4, `/contato` e a virada de domínio.

Site em https://longarfino-site.longarfino10.workers.dev
Deploy automático: `git push` publica sozinho.

⚠ **Este arquivo passou a viver no repositório em 02/09.** Antes existia só no
Projeto do Claude, fora do controle de versão. O repositório é privado — por
isso pode conter CNPJ, endereço e telefones.

---

## ⚠ O QUE AINDA NÃO PODE IR AO AR

| O quê | Onde | Situação |
|---|---|---|
| Google Analytics | não instalado | A política de privacidade **declara** que o site usa GA. Ou instala, ou tira da política |
| Revisão jurídica da política | `politica-de-privacidade.astro` | Texto escrito pela IA, não por advogado. A empresa assina contrato público |
| Estudo de caso da Palhoça | `pista-palhoca.md` | Publicada só com ficha técnica e fotos |

**Saiu da lista em 02/09:** o texto da Nossa diferença. O Lucas decidiu manter
o que está e ajustar com o tempo se precisar.

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

**Atenção:** o site dizia Garopaba, corrigido para Imbituba em 02/09. O e-mail
no cartão CNPJ ainda é o hotmail antigo — vale atualizar na Receita.

**Sobre 2007:** a empresa abriu em 2019, mas o site diz "19+ anos de
experiência" desde 2007, que é quando o Paulo começou a construir. Está
correto: a seção fala de experiência, não de idade da empresa.

---

## ATESTADO DE CAPACIDADE TÉCNICA — CBSk

Documento novo, incorporado em 02/09. É a credencial mais forte que a empresa
tem para licitação.

| Item | Valor |
|---|---|
| Número | 004/2026 |
| Emissor | Confederação Brasileira de Skate (CBSk) |
| Emissão | 05/08/2026 |
| **Validade** | **05/08/2027 — renovar antes** |
| Assinatura | Digital, Carlos Eduardo Dias, presidente |
| PDF no site | `public/documentos/atestado-cbsk-004-2026.pdf` |
| Página | `/atestado` (indexável, entra no sitemap) |

**Metragem do atestado é do TRECHO VISTORIADO, não da obra inteira.** Isso
resolve a divergência aparente com as obras publicadas: Abraão aparece com
780,11 m² no atestado e 1.600 m² no site, e os dois estão certos.

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
1. Tarja desenhada por cima — o texto continuava embaixo, legível por
   `Ctrl+F` e por copiar e colar. **Descartada.**
2. Redação de verdade, mas dois contatos passaram sem tarja.
3. Versão final, todos removidos do texto.

**Regra:** nunca substituir pelo arquivo original. Ele expõe celular de
servidora pública e de pessoa física. Conferir toda nova versão com `Ctrl+F`
procurando um dos números antes de publicar.

**Nota:** a Prefeitura de Balneário Camboriú é o único cliente público
nomeado no atestado. Vale mais em licitação do que os 64 m² sugerem.

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

As três referências mundiais e o que rodam:

| Empresa | País | Stack do site |
|---|---|---|
| California Skateparks | EUA, 500+ pistas | **Wix** |
| Convic | Austrália, 700+ obras | WordPress, WP Rocket, GTM |
| Grindline | EUA, 400+ pistas | WordPress + Elementor |

**Conclusão:** nenhuma tem tecnologia melhor que a nossa. Astro estático em
Cloudflare, com 94 de desempenho, está à frente das três.

**O que elas têm e nós não:**
1. Depoimento de gestor público com nome, cargo e município
2. Processo detalhado em páginas próprias (planejamento, projeto, construção)
3. Página de prêmios
4. Mapa de obras (a Grindline tem `/map`)
5. Material para captar contato — relatório grátis em troca do e-mail
6. Certificação técnica explícita (a Grindline usa o ACI; o equivalente aqui
   é a CBSk, já feito, e o CREA do Leandro, pendente)

**Padrão que elas seguem:** cada frase carrega um número ou procedimento
verificável. Foi o que motivou a reescrita da Nossa diferença.

---

## STACK

- Astro 7.2.9 — exige Node >= 22.12.0
- Markdown para as obras, sem banco
- Cloudflare Workers com Static Assets
- Custo mensal R$0

Repositório: https://github.com/longarfino10-art/longarfino-site (privado)
Pasta local: C:\Users\longa\Documents\Projetos PROGRAMAÇÃO\longarfino-site
Terminal: PowerShell. Para .sh: `& "C:\Program Files\Git\bin\bash.exe" arquivo.sh`

**Fontes locais** desde 02/09, via `@fontsource`. Nada vem do Google.
Bebas Neue 400, IBM Plex Mono 400/500, Inter 400/500/600/700 — cada uma com
`latin` E `latin-ext`. Bebas e Inter 400 entram com `preload` no `Base.astro`,
importadas com `?url` para o Astro resolver o hash a cada build.

**Arquivo novo:** criar vazio com `New-Item` antes de colar. Pela interface do
VS Code, o nome ganha `.txt` ou `.html` no fim.

**Nome de arquivo:** minúsculo, hífen, sem espaço e sem acento. O build roda em
Linux, onde `.JPEG` e `.jpeg` são arquivos diferentes.

**Caminho com colchete no PowerShell:** usar `-LiteralPath`, senão o shell
trata `[...slug].astro` como filtro e diz que o arquivo não existe.

---

## O SITE HOJE

| Rota | Estado |
|---|---|
| `/` | Hero · Obras · Serviços · Nossa diferença · A Longarfino · Galeria · Chamada |
| `/obras` | portfólio com blocos e filtros |
| `/obras/[slug]` | seis obras publicadas |
| `/a-longarfino` | história desde 1997, dois registros de época, equipe |
| `/atestado` | **nova em 02/09** — atestado da CBSk, sete trechos, link do PDF |
| `/404` | atalhos + crédito do dev |
| `/politica-de-privacidade` | pronta, falta revisão jurídica |
| `/contato` | **não existe** — travada na chave do Web3Forms |

### Componentes

| Arquivo | O que é |
|---|---|
| `layout/Trilha.astro` | **Novo em 02/09.** Breadcrumb das internas. A home não usa |
| `home/Hero.astro` | Foto real, parallax, inclinação com o mouse |
| `home/Obras.astro` | 4 destaques. Obra em execução ganha o card grande |
| `home/Servicos.astro` | 6 serviços com desenho cotado |
| `home/Diferenca.astro` | **Refeita em 02/09.** Foto ao topo, especificação técnica, selo do atestado |
| `home/Numeros.astro` | Números, história resumida, equipe, feedback em rodízio |
| `home/Galeria.astro` | Tira de 5 fotos, gap de 8px |
| `home/Chamada.astro` | CTA com WhatsApp, e-mail e dados |
| `home/Processo.astro` | **Sem uso.** Removido da home, guardado |
| `home/Mapa.astro` | **Sem uso na home.** Guardado para `/obras` |
| `home/Diferenca-etiquetas.astro.bak` | Versão anterior da Diferença, com as 5 etiquetas ancoradas na foto |

---

## OBRAS PUBLICADAS

Seis obras com dados conferidos e slugs alinhados ao `_redirects`.
Somam 5.412 m² dos 12.360 totais.

| Slug | Obra | Cidade | m² | Tipo | Período |
|---|---|---|---|---|---|
| pista-trindade | Pista Trindade | Florianópolis/SC | 2.068 | Street | out/2022 a mai/2023 |
| park-abraao | Park Abraão | Florianópolis/SC | 1.600 | Bowl, Street | fev/2023 a fev/2024 |
| ct-curitiba | Centro de Treinamento de Curitiba | Curitiba/PR | 1.200 | Park, Street, Bowl | jan a mai/2025 |
| pista-morrinhos | Pista Morrinhos | Garopaba/SC | 600 | Bowl, Street | jan a abr/2025 |
| skate-street-indaial | Skate Street Indaial | Indaial/SC | 500 | Street | mai/2023 a mar/2025 |
| pista-palhoca | Pista Palhoça | Palhoça/SC | 312 | Street | dez/2022 a jan/2023 |

Destaques na home: Trindade, Curitiba, Abraão, Morrinhos.

**Papel da Longarfino: execução.** Na Trindade o projeto foi de outras empresas
(Ruaria e Spot) — os textos dizem "execução", não "projeto e execução".

**Fora do site, no Drive (16 pastas):** Reforma Estaleirinho, Ampliação Munari,
Pista Tormam, Pista Rodrigo Itapiruba, Pista Yerba, Piso Industrial, Mini Ramp
João Paulo, Concretagem de Obstáculos, Pista Paulo Lopes, Pista Madeira
Campeche, Mini Rampa Tuco.

**Laguna:** 360 m², em execução, sem fotos. Obra pública de R$ 318,2 mil,
licitação homologada em Diário Oficial, contrato com a Udesc assinado em
05/03/2026, prazo de 120 dias. Recurso de emenda parlamentar com intermediação
da Cufa Laguna. Entra quando houver foto.

---

## FEEDBACKS PUBLICADOS

Comentários reais copiados do Instagram, em rodízio de 7,5s na home:

- @munariskatepark — "Munariskatepark padrão Longarfino de qualidade."
- @kelvin_simoess — "Galera vai ter uma pista de primeira!!"
- @viniciusbilly — "Obrigado pela excelência no trabalho realizado"

Não usados: @beppigirardi, @philipegh, @graziribaskiprado (esta é da equipe, e
depoimento de sócia não serve como prova social).

**Regra:** depoimento só entra copiado literalmente do post, com o @ do autor.
Duas tentativas anteriores usaram texto reconstruído por IA e foram descartadas.

---

## DECISÕES FECHADAS

| Assunto | Decisão |
|---|---|
| Hospedagem | Cloudflare Workers Static Assets |
| Banco de dados | Nenhum. Markdown |
| Fotos | `src/assets/obras/<slug>/` no original. O Astro gera WebP com srcset |
| Fontes | **Locais, via `@fontsource`. Nada do Google.** Preload em Bebas e Inter 400 |
| **Domínio** | **Sem `www.` — decidido em 02/09. O `www.` recebe 301** |
| Formulário | WhatsApp como CTA principal + Web3Forms em `/contato` |
| Visual | Preto/concreto + laranja `#E85A24` em no máximo 15% da tela |
| **Botões** | **`.btn` de contorno é o padrão. `.btn--fill` laranja só em CTA principal: header, hero e Chamada** |
| **Navegação** | **Breadcrumb nas internas, sem item "Início" no menu. Logo com hover** |
| Menu | Obras · O que fazemos · Nossa diferença · A Longarfino · Contato |
| CTA | "Solicitar orçamento" no header. "Conte onde vai ser a pista" no fim |
| Contato | Dados só na Chamada. O rodapé não repete |
| Mapa de atuação | Fora da home. Guardado para `/obras` |
| Seção Processo | Removida da home. Arquivo guardado |
| **Serviços** | **Só concreto. Miniramp, madeira, piso polido e simulador ficam de fora — decidido em 02/09** |
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

**Contraste (corrigido em 02/09):**
- `.ft nav a` usava `--gray-500` (~4,1:1, abaixo do mínimo de 4,5:1). Passou a
  `--gray-200`.
- `.btn--fill` tinha texto branco sobre laranja (~3,3:1). Passou a texto preto,
  o que preserva a cor da marca e resolve o contraste.

**Fonte: `.d` é obrigatória nos títulos.** A Bebas vem da classe `.d`, não do
elemento `h1`/`h2`. Título sem `.d` cai no fallback e não parece Bebas.

**Fallback do `--ff-display`:** era `Impact`, trocado por `Arial Narrow` e
condensadas. Impact mascarava falha de fonte porque é bonito no contexto — o
título parecia certo mesmo quando a Bebas não carregava.

**Exceções registradas:** `linear-gradient` como véu sobre foto na Nossa
diferença e nos registros da `/a-longarfino` — é véu, não decoração. E o
círculo do marcador do Paulo na foto de 1997.

**Toda seção usa `.sec`** do `base.css` e as classes globais `.eyebrow`,
`.h-sec`, `.btn`, `.arw`, `.mono-sm`. Não criar container próprio.

**Âncoras:** `[id]{scroll-margin-top:clamp(63px,6.6vw,83px)}` no `base.css`,
calibrado por tentativa. O `Trilha.astro` usa o mesmo valor no `padding-top`,
senão entra por baixo do header fixo.

**Ordem do menu = ordem das seções.**

---

## DESEMPENHO

Medido no PageSpeed, aba Celular, em 02/09.

| | Site antigo | Novo, manhã | Novo, noite |
|---|---|---|---|
| Desempenho | 88 | 87 | **94** |
| Acessibilidade | 83 | 94 | 94 |
| Práticas recomendadas | 92 | 100 | 100 |
| SEO | 92 | 100 | 100 |
| FCP | 2,0 s | 2,7 s | **1,4 s** |
| LCP | 3,3 s | 3,2 s | 2,8 s |
| TBT | 0 ms | 0 ms | 0 ms |
| CLS | 0.001 | 0 | 0 |

**O que ganhou:** fontes locais tiraram os 750 ms do Google Fonts; o preload
derrubou o caminho crítico de 851 ms para 390 ms.

**Sobre o site antigo:** 26 arquivos CSS bloqueando renderização, caminho
crítico de 2.187 ms, e quatro `.woff2` servidos por `newproject.luawebsites.com`
— servidor da agência — **retornando ERR_CONNECTION_FAILED**. A home também
não tem meta description e tem sete links sem texto acessível.

**Ainda em aberto:** 269 KiB de imagem "economizável" nas capas de obra. Não
comprimir mais — a foto é o produto. E acessibilidade em 94, com contraste e
ordem de títulos ainda apontados.

---

## PRÓXIMA SESSÃO — o que fazer

### Depende do Lucas trazer

1. **ID do Google Analytics** — analytics.google.com
2. **Chave do Web3Forms** — web3forms.com, grátis
3. **Prints do mobile** — abrir o site publicado no celular e rolar tudo

### Depende de terceiro

4. Revisão jurídica da política de privacidade
5. Aval do Fábio Pereira para publicar a obra dele

### Não depende de ninguém

6. Instalar o GA4 quando o ID chegar
7. Criar a `/contato` quando a chave chegar
8. Virada de domínio — apontar para o Cloudflare, sem `www.`

---

## DEPOIS DO AR

- Publicar as outras 10 obras
- Estudo de caso da Palhoça
- CREA do Leandro (conta em licitação pública)
- Laguna quando tiver foto
- Seção de obra pública com os dados de licitação
- Conteúdo técnico sobre concreto, para SEO
- Os seis achados da pesquisa de mercado (ver seção acima)
- Trocar os `alt` genéricos da galeria por descrição com cidade
- Painel de cadastro de obras (Decap ou Sveltia CMS), se o volume justificar
- Mover `src/Cronograma e outros/` para fora do `src`
- Limpar a regra órfã `.df-hd span:last-child` no `Diferenca.astro`
- Apagar `Diferenca-etiquetas.astro.bak` quando não houver mais dúvida
- Resolver os 5 avisos de tipo do TypeScript (não quebram o build)
- Avaliar se sete arquivos de fonte por página compensam

---

## ARMADILHAS JÁ ENCONTRADAS

**Fontes**
- `@fontsource` precisa de `latin` E `latin-ext`. Só `latin-ext` cobre apenas
  os acentos — as letras A-Z caem no fallback e a fonte parece não funcionar.
- `font-display: swap` faz o texto piscar. Resolve com `preload`, não trocando
  o fallback.
- Caminho de fonte tem hash que muda a cada build. Importar com `?url` e deixar
  o Astro resolver. Caminho fixo quebra em silêncio.

**Astro**
- Template literal no atributo `style` de tag Astro faz a tag não abrir e o
  HTML vazar como texto. Usar concatenação com `+` numa const antes.
- `.rv` deixa o elemento com opacity 0 esperando o `reveal.js`.
- Caminho de imagem nos `.md`: `./../../assets/obras/<slug>/arquivo.jpeg`
- Variável CSS inexistente derruba o bloco inteiro na prática. `--concrete-2`
  não existe (é `--concrete`) e a seção ficou sem estilo nenhum.

**CSS**
- `grid-template-columns` repetido por linha desalinha as colunas entre linhas.
  Definir no contêiner e usar `subgrid` nas linhas.
- `max-width` em `ch` muda conforme a fonte — trocar a fonte muda a largura da
  coluna e a quebra do texto. Onde a medida importa, usar px.

**SVG**
- `<symbol>` mora no `Desenhos.astro` (plural). O `Desenho.astro` (singular) só
  exibe.
- `font-family="var(--ff-mono)"` não funciona em atributo de apresentação.
- Desenho com cota escrita precisa de opacidade ~0.4.

**Scripts**
- O parallax do hero depende de `data-parallax` no `.hero-palco`.

**Edição de arquivo**
- Substituir bloco que termina em `</style>` já duplicou a tag várias vezes.
- **Find/replace com blocos grandes embaralha o arquivo.** Aconteceu no
  `[...slug].astro` em 02/09: três substituições caíram em lugares errados e o
  CSS foi parar dentro do HTML. Quando a estrutura quebrar, substituir o
  arquivo inteiro.

**PDF**
- Tarja preta desenhada por cima **não apaga o texto.** Conferir sempre com
  `Ctrl+F` procurando o dado que deveria ter sumido.
- Editar PDF assinado digitalmente invalida a assinatura.

**Dados**
- O protótipo continha obras, contatos e métricas inventados que chegaram a ir
  ao ar no site antigo. Todo dado vindo dele é suspeito até confirmação.
- A descrição da Palhoça estava trocada com a de Indaial.
- A metragem de Curitiba aparecia como 1500 e 1200 no mesmo arquivo.
- Imagem "restaurada" por IA apagou uma pessoa da foto de 2011. Só originais.

---

## REGISTRO DE SESSÕES

**30/08 — Semana 1.** Projeto Astro, deploy contínuo, GitHub, Worker.

**30/08 — Itens 1 a 6.** Layout base, biblioteca de desenhos SVG, coleção de
obras, página da obra, portfólio com blocos e filtros.

**31/08 — Hero e Números.** Foto em duas camadas, parallax, inclinação. Mapa do
Natural Earth com d3-geo.

**01/09 — Home completa.** Obras em destaque, Serviços com seis desenhos
cotados, Nossa diferença com foto aérea, Números reestruturado, Galeria,
`/404`, Header e Footer corrigidos, container unificado, âncoras calibradas,
redirects 301.

Descoberta: a coleção de obras estava com dados inventados pelo protótipo e o
telefone e e-mail do rodapé estavam errados — em produção havia meses.

**02/09, manhã — Conteúdo real.** Página `/a-longarfino` com a história desde
1997, incluindo a Onlybyskate (equipe criada em 2011 por Paulo com Rodrigo
Rosa, organizada com o jornalista Nilo Dias Cabral; 1ª etapa no Banx da
Restinga em set/2011 com 30 competidores e ~300 pessoas; aniversário em 2012 no
Cecores com 51 competidores, ~400 pessoas e 40 kg de alimentos doados). Equipe
com os quatro. Menu mobile refeito. Seis obras reais publicadas. Feedbacks
reais. Sede corrigida para Imbituba. Política de privacidade.

Não publicados dos documentos da Onlybyskate: nomes de creches e escolas, lista
de apoiadores, telefones pessoais.

**02/09, tarde e noite — Performance, atestado e navegação.**

Fontes migradas do Google para `@fontsource`, com preload. Desempenho de 87
para 94, FCP de 2,7 s para 1,4 s.

Pesquisa das três referências mundiais do setor — todas em Wix ou WordPress.
Motivou a reescrita da Nossa diferença: em vez de vocabulário (ledge, coping,
transição), especificação técnica com número verificável.

Atestado da CBSk incorporado: página `/atestado`, selo na home, PDF com
contatos removidos. Resolvida a divergência de metragem — o atestado mede
trechos vistoriados, não obras inteiras.

Breadcrumb criado e aplicado nas cinco internas, depois de pesquisa no NN/g:
logo clicável não basta, o site precisa de link direto para o início em toda
página interna. O "Todas as obras" do topo da página de obra foi removido e o
"Ver outras obras" subiu para logo depois da galeria, antes do CTA comercial.

Botões padronizados: contorno como padrão, laranja preenchido só em CTA
principal. Contraste corrigido no rodapé e nos botões preenchidos.

Decidido: domínio sem `www.` (o `astro.config.mjs` estava com `www.` e foi
corrigido); Serviços continuam falando só de concreto; o texto da Nossa
diferença fica como está.

Descoberto: o `PLANEJAMENTO.md` nunca esteve no repositório — vivia só no
Projeto do Claude. Passou a ser versionado nesta data.