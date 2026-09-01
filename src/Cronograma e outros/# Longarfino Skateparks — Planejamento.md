# Longarfino Skateparks — Planejamento

## ONDE ESTAMOS

**Data:** 01/09/2026
**Etapa concluída:** Home completa estruturalmente. Todas as seções existem,
todos os links funcionam, âncoras param no lugar certo.
**Próxima etapa:** conteúdo real — a lista de obras é o que mais destrava.
**Bloqueio atual:** não é mais técnico, é de conteúdo. O código está pronto e
rodando com dados de exemplo marcados como provisórios.

Site no ar em https://longarfino-site.longarfino10.workers.dev
Deploy automático funcionando: `git push` publica sozinho.

---

## ⚠ O QUE NÃO PODE IR AO AR

Lista curta e crítica. Tudo abaixo está **no código agora** e é falso ou
provisório. Conferir item por item antes da virada de domínio.

| O quê | Onde | Por quê |
|---|---|---|
| Obras inventadas | `src/content/obras/` | Bowl do Gringo não existe. Park Campeche, Estaleirinho e Imbituba vieram do protótipo |
| Feedbacks `@exemplo` | `Numeros.astro` | São texto de exemplo, não depoimento real |
| Textos dos 6 serviços | `Servicos.astro` | Rascunho escrito pela IA, nunca revisado pelo Lucas |
| Texto da Nossa diferença | `Diferenca.astro` | Idem |
| Imagem do hero | `src/assets/hero.webp` | Gerada por IA |
| `alt` da galeria | `Galeria.astro` | Descrições genéricas, ruins para SEO |
| Espessura 120mm | `dwg-laje-cota` em `Desenhos.astro` | Valor escolhido dentro da faixa usual, não confirmado |
| "15+ obras entregues" | `Numeros.astro` | Se o portfólio mostrar 6, o número vira contradição visível |

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

**Nome de arquivo:** minúsculo, com hífen, sem espaço e sem acento. O build do
Cloudflare roda em Linux, onde `.JPEG` e `.jpeg` são arquivos diferentes —
import com caixa errada passa no Windows e quebra no deploy.

---

## DADOS OFICIAIS DA EMPRESA

Confirmados com o Lucas em 01/09. **O site antigo tem telefone e e-mail
errados** — estavam no protótipo e foram parar em produção.

| Item | Valor |
|---|---|
| m² construídos | **12.360** (não 2.800) |
| Ano de início | **2007** — os anos se calculam sozinhos no código |
| Estados atendidos | 5 — SC, PR, RS, SP, BA |
| WhatsApp | **(51) 98624-5321** |
| E-mail | **longarfinoparks@gmail.com** |
| Instagram | @longarfinoskateparks |
| Cidade | Garopaba — SC |
| WhatsApp do dev | (51) 98615-8345 — rodapé e /404 |

---

## SITE ANTIGO — o que foi extraído

Extraído de https://longarfinoskateparks.com.br em 01/09.

**Obras no portfólio antigo:** Centro de Treinamento de Curitiba, Piso Polido,
Pista Trindade, Pista Palhoça, Pista Morrinhos, Skate Street Indaial,
Skate Park Abraão.

**Serviços que o site antigo vende:** Consultoria, Execução, Reforma e
Manutenção. São três — o novo site tem seis, que é uma escolha deliberada
de destrinchar o que já existe.

**URLs para os 301:** `/servicos/`, `/portfolio/`, `/contato/`,
`/gallery/<slug>/` (7 delas), `/services/<slug>/` (3) e
`/politica-de-privacidade/`.

---

## OBRAS — TRÊS LISTAS QUE NÃO BATEM

Este é o principal bloqueio. Existem três fontes e elas divergem:

| Fonte | Obras |
|---|---|
| Site antigo | Curitiba, Piso Polido, Trindade, Palhoça, Morrinhos, Indaial, Abraão |
| Pastas do Drive (com foto) | Indaial, Morrinhos, Piso Polido, Trindade, Palhoça, Abraão, Curitiba |
| Descrito pelo Lucas em 01/09 | Laguna, Curitiba, Campo Bom/RS, Garopaba (Ferraz/Morrinhos), Imbituba |

Só **Curitiba** e **Morrinhos** aparecem nas três.

**A coleção atual está errada.** Precisa sair: Bowl do Gringo (nome errado,
não existe), Park Campeche, Estaleirinho, Reforma Imbituba. Precisa entrar:
CT Curitiba, Morrinhos, Indaial, Palhoça.

**Dados confirmados até agora:**
- Pista Laguna — 360 m², em execução, sem foto ainda
- Piso Polido — o Lucas não quer publicar

**Slugs sugeridos** (os três últimos iguais aos do site antigo, para não
precisar de 301): `ct-curitiba`, `pista-morrinhos`, `pista-trindade`,
`pista-palhoca`, `skate-street-indaial`, `park-abraao`.

**Falta de cada obra:** cidade/UF, m², tipo, ano, cliente, status.

---

## MATERIAL BRUTO PARA OS TEXTOS DAS OBRAS

Fatos verificáveis levantados em 01/09. São fortes e não precisam de aspas.

- **Laguna** — Pista da Praça da Udesc. Obra pública de R$ 318,2 mil, com
  intermediação social da Cufa Laguna.
- **Curitiba** — Centro de Treinamento, sob diretrizes da CBSk e World Skate,
  para receber seletivas.
- **Campo Bom/RS** — Pista do Projeto Criança Cidadã, desenvolvimento
  esportivo para crianças em vulnerabilidade social.
- **Garopaba** — Pista do Bairro Ferraz, obra municipal de R$ 549,8 mil.
- **Imbituba** — Pista da Bea Aloha School, projeto privado.

⚠ **Sobre os elogios:** o material recebido traz elogios parafraseados de
redes sociais, sem autor identificado e sem transcrição literal. **Não usar
como depoimento com aspas.** Para virar feedback no site, é preciso abrir o
post, copiar o comentário como está escrito e registrar o @ de quem escreveu.

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
| **Menu** | **Obras · O que fazemos · Nossa diferença · A Longarfino · Contato** |
| CTA | "Solicitar orçamento" no header. "Conte onde vai ser a pista" no fim |
| Home | Página única com rolagem. `/obras` aprofunda |
| Contato | Dados só na seção Chamada. O rodapé não repete |
| Mapa de atuação | **Fora da home.** O componente segue no projeto, para `/obras` |
| Seção Processo | **Removida da home.** `Processo.astro` segue no projeto, sem uso |
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

**Exceção registrada:** a seção Nossa diferença usa `linear-gradient` como véu
sobre a foto, para o texto ler por cima. É véu, não decoração de superfície.

**Toda seção usa `.sec`** do `base.css` para container e ritmo vertical, e as
classes globais `.eyebrow`, `.h-sec`, `.btn`, `.arw`, `.mono-sm`. Não criar
container próprio por seção — foi corrigido em 01/09 justamente por causa
disso.

---

## PÁGINAS

| Rota | Estado |
|---|---|
| `/` | **pronta** — Hero · Obras · Serviços · Diferença · A Longarfino · Galeria · Chamada |
| `/obras` | pronta — blocos de 4 + filtros |
| `/obras/[slug]` | pronta — ficha técnica, capa, estudo de caso, CTA |
| `/404` | **pronta** — atalhos + crédito do dev |
| `/contato` | não iniciada — **travada na chave do Web3Forms**, que o Lucas precisa gerar |

---

## COMPONENTES DA HOME

| Arquivo | O que é |
|---|---|
| `home/Hero.astro` | Foto em duas camadas, parallax, inclinação |
| `home/Obras.astro` | 4 destaques via `BlocoObras`. Obra em execução ganha o card grande |
| `home/Servicos.astro` | 6 serviços com desenho cotado no rodapé de cada bloco |
| `home/Diferenca.astro` | Foto aérea de Morrinhos com 5 etiquetas ancoradas |
| `home/Numeros.astro` | 4 números em fileira + 1 depoimento grande ao lado |
| `home/Galeria.astro` | Tira de 5 fotos, gap de 8px |
| `home/Chamada.astro` | CTA final com WhatsApp, e-mail e dados |
| `home/Processo.astro` | **Sem uso.** Removido da home, guardado |
| `home/Mapa.astro` | **Sem uso na home.** Guardado para `/obras` |

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
- [x] Item 7 — Home completa (estrutura)
- [ ] **Conteúdo real** — obras, fotos, textos, feedbacks
- [ ] `/contato` com Web3Forms
- [ ] SEO — metadata, sitemap, 301
- [ ] Performance e testes
- [ ] Virada de domínio
- [ ] Acompanhamento no Search Console

---

## PENDÊNCIAS EM ABERTO

**Conteúdo (bloqueiam o lançamento)**
- Fechar a lista definitiva de obras com cidade, m², tipo, ano e cliente
- Baixar as fotos do Drive para `src/assets/obras/<slug>/`
- Escrever os `.md` das obras com dados reais
- Copiar os feedbacks reais dos posts, com o @ de quem escreveu
- Revisar os 6 textos de Serviços e o da Nossa diferença
- Substituir a imagem do hero por foto real
- Descrever os `alt` das 5 fotos da galeria
- Confirmar a espessura de concreto da cota do desenho da laje
- Confirmar se "15+ obras entregues" é o número real

**Técnicas**
- Mapear as URLs do WordPress para os 301 (lista já levantada acima)
- Definir: site com `www.` ou sem? A outra recebe 301
- Gerar a chave do Web3Forms para a `/contato`
- Limpar desenhos sem uso: `dwg-quarter`, `dwg-stairs`, `dwg-slab`, `dwg-repair`
- Dívida no `Hero.astro`: comentário órfão citando planta removida, regra
  `.hero-planta` sem uso, e `parallax.js` selecionando `[data-parallax]`,
  atributo que não existe mais
- `galeria-03.jpeg` está na pasta sem uso

---

## REGISTRO DE SESSÕES

**30/08/2026 — Semana 1 concluída**
Projeto Astro criado, estrutura de pastas gerada por script, sitemap instalado,
repositório no GitHub, Worker conectado ao repo com build automático.
Descoberto: `bash` fora do PATH do PowerShell; caminho do projeto tem espaço e
acento (`Projetos PROGRAMAÇÃO`) — suspeito número um se aparecer erro estranho
de caminho no build.

**30/08/2026 — Item 1: layout base**
Criados `Base.astro`, `base.css`. Limpeza do template padrão.
Armadilha: ao criar arquivo `.astro` pelo VS Code, ele salva como `.astro.html`.
Conferir com `dir` depois de criar arquivo novo.
Decidido sobre fotos: NÃO converter antes de subir. O `image()` do Astro gera
WebP com srcset no build (medido: 185 kB → 19 kB).

**30/08/2026 — Itens 2, 3, 4 e 6**
Biblioteca de 10 desenhos técnicos como `<symbol>` SVG. Coleção de obras
validando pelo schema. Página da obra e portfólio prontos.
Decisão de layout do portfólio: grade em BLOCOS de até 4 obras, com arranjo
próprio para 4, 3, 2 ou 1 — o bloco vazio some sozinho via `:has()`.
Armadilha: template literal no atributo `style` de uma tag Astro faz a tag não
abrir e o HTML vazar como texto. Usar concatenação com `+`.
Armadilha: a classe `.rv` deixa o elemento com opacity 0 esperando o
`reveal.js`. Sem o script, o elemento fica invisível para sempre.

**31/08/2026 — Home: Hero e Números**
Hero com foto em duas camadas, parallax e inclinação.
Detalhe: parallax e inclinação escrevem em variáveis CSS separadas e o
`.hero-palco` combina as duas num `transform` só. Inclinar cada camada
separadamente descola a máscara.
Mapa gerado do Natural Earth com d3-geo, projeção Mercator.

**01/09/2026 — Home completa**

Sessão longa. Feito: Obras em destaque, Serviços, Nossa diferença, A Longarfino
reestruturada, Galeria, Chamada reescrita, `/404`, Header e Footer corrigidos.

**Descoberta mais importante:** ao extrair o site antigo, apareceu que a
coleção de obras estava com dados inventados pelo protótipo e que o telefone
e o e-mail do rodapé estavam errados — em produção, provavelmente há meses.
Lição: dado que veio do protótipo precisa ser tratado como suspeito até o
Lucas confirmar.

**Desenhos cotados.** Seis símbolos novos com sufixo `-cota`, feitos a partir
de medidas reais pesquisadas: quarter h 1200 / R 2100 com coping Ø60, ledge
400, escada 1200 (faixa da World Skate: 1,2 a 1,6m), laje com junta serrada a
1/3 da espessura e malha a meia altura. Diferente dos desenhos antigos, estes
têm cota escrita e por isso pedem opacidade 0.4 — a 0.16 o número some.

Armadilha: `font-family="var(--ff-mono)"` não funciona em atributo de
apresentação do SVG. Precisa ser `style="font-family:var(--ff-mono)"`.

Armadilha grave: colar `<symbol>` no `Desenho.astro` (singular, o exibidor) em
vez do `Desenhos.astro` (plural, a biblioteca) duplica os símbolos uma vez por
uso e faz o `<text>` vazar como texto solto na página. A diferença entre os
dois arquivos é só o "s" final.

**Ordem do menu.** Os itens do menu precisam seguir a mesma ordem das seções
na página, senão clicar em um desce e no seguinte sobe. Corrigido.

**Âncora com header fixo.** Precisa de `[id]{scroll-margin-top:...}` no
`base.css`, senão o header cobre o topo da seção. Calibrado em
`clamp(63px,6.6vw,83px)` por tentativa.

**Container.** As seções novas nasceram com `.faixa` própria, inventada sem
consultar o `base.css`, o que desalinhou a margem lateral. Todas foram
convertidas para `.sec`. Regra: consultar o `base.css` antes de criar
qualquer utilitário de layout.

**Decisões de conteúdo tomadas:** o Processo saiu da home (o Lucas preferiu
Nossa diferença no lugar); o mapa saiu da seção de Números, porque custava
metade da seção para dizer o que "5 estados" já diz em três palavras, e
mostrava capitais em vez das cidades das obras; os dados de contato ficaram
só na Chamada, porque apareciam duas vezes a 200px de distância.

**Texto do CTA.** "Vamos tirar o projeto do papel?" virou "Conte onde vai ser
a pista." O anterior terminava em "projeto", contradizendo o posicionamento de
quem executa.