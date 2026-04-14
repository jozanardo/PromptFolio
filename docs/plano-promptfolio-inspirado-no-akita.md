# Plano de Evolucao do PromptFolio Inspirado no Blog do Akita

## Objetivo

Transformar o `PromptFolio` de um portfolio-terminal simples em uma experiencia mais memoravel, com cara de acervo pessoal vivo: menos "cartao de visitas" e mais "base de conhecimento sobre quem eu sou, no que penso e no que construo".

O blog do Akita me passa exatamente essa sensacao. Ele nao e so uma home com links: ele organiza anos de producao, facilita descoberta, separa assuntos, oferece navegacao bilingue e trata conteudo como produto principal. A melhor oportunidade para o `PromptFolio` e adaptar essa logica ao formato terminal que o projeto ja tem.

## O que vale aproveitar do repositorio do Akita

Estas foram as ideias mais fortes que aparecem no repositorio:

- O conteudo e tratado como estrutura principal do site, nao como detalhe.
- Ha organizacao por indice recente e arquivo historico, gerados automaticamente.
- Existe separacao por contexto editorial, como `archives`, `akitando` e `off-topic`.
- O blog oferece experiencia bilingue consistente.
- A navegacao prioriza descoberta: menu, busca, RSS e links secundarios.
- O projeto pensa em performance e manutencao de longo prazo, inclusive no build.

Referencias observadas no repositorio:

- `hugo.yaml`: menu, idiomas, busca, RSS, secoes e configuracao geral.
- `content/_index.md`: homepage organizada por meses e anos.
- `content/archives/_index.md`: arquivo completo do conteudo.
- `scripts/generate_index.rb`: geracao automatica de index, archives e secoes por tag.
- `netlify.toml`: preocupacao com cache e build eficiente.

## Plano proposto

### Direcao central

Minha recomendacao e evoluir o `PromptFolio` para um **terminal-editorial**.

Em vez de ele responder apenas comandos curtos como `about`, `skills` e `projects`, ele passaria a ter duas camadas:

- Camada 1: identidade rapida, para quem quer entender voce em 30 segundos.
- Camada 2: exploracao profunda, para quem quer navegar pelo seu historico, projetos, textos, experimentos e interesses.

Isso preserva a personalidade atual do projeto e adiciona profundidade, que e justamente uma das qualidades mais fortes do site do Akita.

## Ideias concretas para implementar

### 1. Criar um "indice vivo" dentro do terminal

Hoje o `PromptFolio` lista projetos e algumas informacoes fixas. A ideia aqui e criar um comando como `index` ou `start` que mostre as principais portas de entrada do seu universo:

- `about`
- `projects`
- `highlights`
- `writing`
- `timeline`
- `contact`
- `now`

Isso aproxima o portfolio da logica de homepage editorial do Akita, em que a pagina principal e um mapa do conteudo, nao apenas uma saudacao.

### 2. Separar "recentes" de "arquivo"

Uma das melhores ideias do blog do Akita e nao tentar jogar todo o historico na mesma camada. Para o seu caso:

- `projects` mostraria apenas os projetos em destaque ou mais recentes.
- `archive` mostraria todo o historico.
- `timeline` mostraria esse historico agrupado por ano ou semestre.

Isso deixaria o portfolio mais facil de consumir e criaria uma sensacao de continuidade profissional.

### 3. Criar secoes por tema, nao so por tipo

O Akita separa conteudo por contexto. No `PromptFolio`, voce pode fazer algo parecido com colecoes tematicas:

- `ai`
- `frontend`
- `backend`
- `experiments`
- `learning`
- `career`

Essas secoes podem aparecer como comandos ou filtros, por exemplo:

- `projects --topic=ai`
- `projects --topic=frontend`
- `writing --topic=career`

Isso e muito melhor do que depender apenas de linguagem (`--lang=`), porque passa a mostrar o que voce pensa e explora, nao so a stack usada.

### 4. Adicionar uma camada de narrativa pessoal

O blog do Akita funciona bem porque ele nao e so uma lista tecnica; existe voz editorial. O `PromptFolio` pode ganhar isso com comandos como:

- `now`: no que voce esta focado atualmente
- `philosophy`: como voce pensa sobre software, IA, estudo ou produto
- `journey`: marcos da sua evolucao
- `highlights`: 5 ou 6 projetos ou momentos que melhor contam sua historia

Essa parte ajuda muito recrutadores, clientes e colaboradores a entenderem contexto, maturidade e direcao.

### 5. Melhorar a experiencia bilingue

Seu projeto ja tem base para `pt` e `en`, o que conversa diretamente com o que existe no repositorio do Akita. O proximo passo e tornar isso mais consistente:

- garantir que todas as respostas do terminal existam nos dois idiomas
- traduzir textos de projetos e secoes principais
- decidir se certos conteudos serao completos em ingles ou apenas resumidos

Uma boa abordagem seria:

- comandos basicos 100% traduzidos
- projetos com resumo curto em `pt` e `en`
- textos longos com prioridade em portugues no inicio

### 6. Trocar parte do conteudo fixo por conteudo estruturado

Hoje muita coisa esta hardcoded nas traducoes e no processador de comandos. Para crescer bem, o ideal e mover os dados para arquivos estruturados, por exemplo:

- `src/content/profile.ts`
- `src/content/projects.ts`
- `src/content/timeline.ts`
- `src/content/writings.ts`
- `src/content/highlights.ts`

Melhor ainda se parte disso for gerada automaticamente a partir do GitHub, como o Akita faz com seus indices.

Exemplo de estrategia:

- GitHub continua alimentando a lista bruta de repositorios
- um arquivo local define quais repos entram em destaque
- outro arquivo adiciona contexto humano: motivo do projeto, aprendizados, impacto

Assim voce combina automacao com curadoria.

### 7. Adicionar busca real no terminal

O `PromptFolio` ja simula um terminal, entao busca combina muito bem com a experiencia.

Exemplos:

- `search ai`
- `search react`
- `search portfolio`

Essa busca pode procurar em:

- nomes de projetos
- descricoes
- tags
- textos de timeline
- highlights

Essa e uma das adaptacoes mais naturais da ideia de "buscar no acervo" que aparece na navegacao do blog do Akita.

## Ordem recomendada de implementacao

### Fase 1 - Estrutura editorial

Objetivo: melhorar o produto sem mudar muito a arquitetura.

- criar comandos `highlights`, `timeline`, `now` e `archive`
- destacar poucos projetos principais em `projects`
- mover conteudos fixos para arquivos de dados
- revisar placeholders em `contact`
- revisar consistencia de idioma em todas as respostas

### Fase 2 - Curadoria e descoberta

Objetivo: deixar o portfolio navegavel de verdade.

- adicionar tags e temas aos projetos
- implementar filtros por tema
- criar comando `search`
- criar agrupamento por ano ou categoria
- adicionar "featured work" com explicacao curta sobre impacto e aprendizados

### Fase 3 - Automacao e refinamento

Objetivo: fazer o projeto crescer sem virar manutencao pesada.

- gerar indices automaticamente a partir de dados locais e GitHub
- separar recentes de arquivo automaticamente
- criar pipeline simples de conteudo
- preparar melhor experiencia de performance e loading

## Ideia de resultado final

Se esse plano for bem executado, o `PromptFolio` deixa de ser apenas "um portfolio estilizado como terminal" e passa a ser:

- um portfolio com personalidade
- uma linha do tempo da sua evolucao
- um catalogo curado dos seus projetos
- um espaco para sua voz tecnica e pessoal

Em outras palavras, ele passa a ter no seu formato terminal a mesma forca que o blog do Akita tem como acervo editorial: profundidade, contexto e identidade.

## Recomendacao final

Se eu tivesse que escolher uma unica direcao para comecar, eu faria esta:

**Construir a versao 2 do PromptFolio como um terminal com acervo curado, dividido entre destaques, historico e temas.**

Essa ideia aproveita melhor o que ja existe no projeto, conversa com a inspiracao do Akita e cria um diferencial real. Muita gente faz portfolio bonito; pouca gente faz portfolio com memoria, narrativa e descoberta.
