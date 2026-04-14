# Plano Visual Completo do PromptFolio

## Objetivo

Redesenhar o `PromptFolio` para que ele deixe de parecer um experimento visual muito colorido e passe a transmitir uma identidade mais madura, calma e coerente com a proposta do projeto.

O objetivo não é "enfeitar o terminal". O objetivo é construir uma interface que pareça:

- minimalista
- fluida
- legível
- editorial
- tecnologica sem exagero

Em termos práticos, queremos um produto que seja agradável de usar por vários minutos, e não apenas impactante nos primeiros 10 segundos.

Nota: este documento registra a direção inicial do redesign. A implementação consolidada da interface e dos tokens atuais está documentada em `AGENTS.md`.

## Diagnostico do estado atual

No estado anterior do projeto, a interface tinha alguns problemas de direção visual:

- partia de uma base visual muito mais saturada e dramática do que a direção atual
- tem acentos chamativos demais para a importancia real dos elementos
- o destaque visual esta espalhado em muitos lugares ao mesmo tempo
- a experiência de leitura do histórico não é tão calma quanto deveria
- falta um sistema claro de temas para dark mode e light mode
- a interface parece mais um terminal tematico do que um portfolio com identidade

Arquivos que concentram esse comportamento hoje:

- [src/assets/App.css](../src/assets/App.css)
- [tailwind.config.cjs](../tailwind.config.cjs)
- [src/App.tsx](../src/App.tsx)
- [src/components/Header.tsx](../src/components/Header.tsx)
- [src/components/History.tsx](../src/components/History.tsx)
- [src/components/InputPrompt.tsx](../src/components/InputPrompt.tsx)
- [src/components/LanguageToggle.tsx](../src/components/LanguageToggle.tsx)

## Direcao estetica proposta

### Conceito

O `PromptFolio` deve seguir a ideia de:

**terminal editorial minimalista**

Isso significa:

- a interface ainda lembra um terminal
- a leitura vem antes do efeito visual
- os elementos tem peso visual contido
- a composicao valoriza ritmo, espaco e hierarquia
- existe personalidade, mas sem brilho artificial

### O que queremos evitar

- neon
- muitas cores concorrendo entre si
- sombras chamativas
- efeito "hacker movie"
- visual gamer
- contraste agressivo em todos os elementos
- badges, contornos e destaques desnecessarios

### O que queremos buscar

- poucos tons por tema
- uma unica cor de destaque
- estados discretos
- muito espaco respirando
- tipografia intencional
- equilibrio entre terminal e site editorial

## Principios do sistema visual

### 1. Cor deve orientar, nao decorar

A cor de destaque so deve aparecer quando ajudar a leitura:

- prompt
- links
- comando ativo
- foco
- pequenos detalhes de navegacao

### 2. Hierarquia por contraste, peso e espacamento

Em vez de resolver tudo com cor forte, vamos usar:

- tamanho
- peso tipografico
- espacamento
- opacidade
- bordas suaves

### 3. Dark mode e light mode precisam ser equivalentes

Os dois temas devem parecer a mesma interface em ambientes diferentes.

Nao queremos:

- dark mode super estilizado e light mode generico
- ou light mode elegante e dark mode exagerado

Queremos:

- mesma identidade
- mesma hierarquia
- mesma densidade
- mesmo comportamento visual

### 4. O historico e o centro da experiencia

O elemento principal do projeto e o fluxo de leitura do historico. Logo:

- o fundo deve desaparecer
- o texto deve guiar o olhar
- o input deve parecer parte natural da interface
- o header deve introduzir, nao competir

## Paleta proposta

## Tema Light

Sensacao: papel tecnico, leve, limpo, silencioso.

- `bg`: `#f6f4ef`
- `surface`: `#fbfaf7`
- `surface-2`: `#f0ede6`
- `text`: `#1f2328`
- `text-muted`: `#5f6773`
- `text-soft`: `#7a828e`
- `border`: `#ddd7cc`
- `border-strong`: `#c9c1b4`
- `accent`: `#058549`
- `accent-soft`: `#d8ebe4`
- `success`: `#2f6b4f`
- `error`: `#a34a3d`
- `focus`: `#058549`

## Tema Dark

Sensacao: grafite editorial, discreto, profundo, sem brilho neon.

- `bg`: `#111315`
- `surface`: `#171a1d`
- `surface-2`: `#1d2125`
- `text`: `#ece8df`
- `text-muted`: `#b0a99c`
- `text-soft`: `#8f897d`
- `border`: `#2a2f34`
- `border-strong`: `#3a4148`
- `accent`: `#7ec0a9`
- `accent-soft`: `#1f322d`
- `success`: `#7ab78f`
- `error`: `#d08b7d`
- `focus`: `#7ec0a9`

## Observacoes sobre a paleta

- o `accent` nao deve ocupar a tela inteira
- `success` e `error` so aparecem em estados especificos
- `text-muted` deve ser amplamente usado para reduzir peso visual
- bordas devem ser quase invisiveis, mas ainda estruturar blocos

## Tipografia

## Direcao tipografica

O projeto precisa continuar com alma de terminal, mas com leitura melhor.

Minha recomendacao:

- usar uma fonte mono principal elegante e calma
- evitar o visual bruto de `Courier New` como identidade final

### Sugestao principal

- fonte principal: `IBM Plex Mono` ou `JetBrains Mono`

### Sugestao alternativa

- manter tudo em mono
- nao misturar com serif ou display na primeira fase

Essa escolha ajuda a manter consistencia com a proposta terminal e simplifica o redesign.

## Escala tipografica sugerida

- titulo principal: `2rem` a `2.5rem`
- subtitulo/header auxiliar: `0.95rem` a `1rem`
- texto de historico: `0.95rem` a `1rem`
- texto auxiliar: `0.875rem`
- labels/toggles: `0.8rem` a `0.875rem`

## Peso tipografico sugerido

- titulo principal: `600`
- nomes de comandos: `500` ou `600`
- texto base: `400`
- texto auxiliar: `400`

## Espacamento e ritmo

## Densidade geral

A interface atual pode ficar mais respiravel. O novo sistema deve usar:

- mais espaco vertical entre blocos
- menos ruído decorativo
- linhas com bom respiro
- containers mais claros e menos "grudados"

## Escala de espacamento sugerida

- `4px`
- `8px`
- `12px`
- `16px`
- `24px`
- `32px`
- `48px`

## Regra pratica

- `Header` com respiro maior no topo
- `History` com espacamento consistente entre grupos
- `InputPrompt` com margem suficiente para parecer um bloco proprio
- toggles pequenos e bem alinhados, sem roubar foco

## Bordas, superfícies e efeitos

## Bordas

As bordas devem ser discretas e funcionar mais como estrutura do que como enfeite.

Sugestao:

- espessura `1px`
- raio pequeno ou medio: `8px` a `12px`
- nada muito arredondado

## Superficies

Mesmo em uma interface minimalista, pequenas diferencas de superficie ajudam:

- fundo geral
- header em superficie levemente distinta
- area do input com superficie propria
- historico quase sem caixas pesadas

## Sombras

Quase nenhuma.

Se usar sombra:

- muito suave
- curta
- mais perceptivel no light mode
- no dark mode, preferir contraste de superficie em vez de sombra

## Motion e transicoes

O projeto precisa de movimento leve e util, nao decorativo.

Usar transicoes pequenas em:

- troca de tema
- hover de links e toggles
- foco no input
- aparicao de estados ativos

Sugestao:

- duracao entre `120ms` e `180ms`
- easing suave
- nada elástico

## Arquitetura de tema

## Estrategia recomendada

Criar um sistema de tema por variaveis CSS semanticas.

Em vez de depender de nomes como:

- `dracula-bg`
- `dracula-fg`
- `dracula-pink`
- `accent`

Passar para nomes como:

- `--bg`
- `--surface`
- `--surface-2`
- `--text`
- `--text-muted`
- `--border`
- `--accent`
- `--success`
- `--error`
- `--focus`

## Beneficios

- dark mode e light mode ficam faceis de manter
- componentes deixam de conhecer cores especificas
- o sistema cresce sem ficar acoplado a um tema antigo
- novas secoes futuras reutilizam a mesma base

## Estrategia tecnica

### 1. CSS variables como fonte da verdade

Definir os tokens no CSS global.

Exemplo conceitual:

```css
:root {
  --bg: #f6f4ef;
  --surface: #fbfaf7;
  --text: #1f2328;
}

[data-theme="dark"] {
  --bg: #111315;
  --surface: #171a1d;
  --text: #ece8df;
}
```

### 2. Tailwind consumindo variaveis

Se quiser manter Tailwind forte no projeto, mapear tokens para classes utilitarias a partir das variaveis CSS.

### 3. ThemeContext

Criar um contexto novo parecido com o `LanguageContext` para:

- armazenar `light` ou `dark`
- persistir em `localStorage`
- respeitar `prefers-color-scheme` no primeiro carregamento

## Componentes a redesenhar

## 1. App shell

Arquivo principal:

- [src/App.tsx](../src/App.tsx)

O que mudar:

- limitar melhor a largura do conteudo
- centralizar a experiencia sem parecer apertada
- dar mais respiro vertical
- separar visualmente header e area principal com mais delicadeza

## 2. Header

Arquivo:

- [src/components/Header.tsx](../src/components/Header.tsx)

O que mudar:

- reduzir impacto cromatico e decorativo do nome
- usar tipografia mais elegante
- reescrever a hierarquia do texto introdutorio
- trocar "hero" chamativo por apresentacao mais contida

Direcao:

- nome forte, mas sem glow
- frase curta de contexto
- dica do `help` mais sutil

## 3. History

Arquivo:

- [src/components/History.tsx](../src/components/History.tsx)

O que mudar:

- melhorar diferenciação entre input, output, help e erro
- reduzir dependencia de cor forte para separar estados
- criar ritmo melhor entre blocos
- destacar comandos com sobriedade

Direcao:

- input do usuario com contraste medio
- output normal com texto principal
- help com agrupamento claro e leve
- erros com cor contida e sem dramatizacao visual excessiva

## 4. InputPrompt

Arquivo:

- [src/components/InputPrompt.tsx](../src/components/InputPrompt.tsx)

O que mudar:

- transformar o input em uma area mais refinada
- fazer o prompt parecer permanente e natural
- melhorar foco visual sem borda gritante

Direcao:

- uma linha ou caixa muito leve
- cursor e foco guiados por `accent`
- excelente legibilidade no dark e light mode

## 5. LanguageToggle

Arquivo:

- [src/components/LanguageToggle.tsx](../src/components/LanguageToggle.tsx)

O que mudar:

- diminuir protagonismo visual
- parar de depender de bandeiras como unico sinal
- tornar o controle mais consistente com o resto do sistema

Minha recomendacao:

- trocar bandeiras por um toggle textual curto, como `PT | EN`
- ou combinar texto com indicador discreto

## 6. ThemeToggle

Novo componente.

O que precisa fazer:

- alternar entre `light` e `dark`
- persistir preferencia
- ficar visualmente alinhado ao controle de idioma
- ocupar pouco espaco e pouca atencao

Minha recomendacao:

- usar toggle textual simples ou icones muito discretos
- evitar switch grande estilo app mobile

## Wireframe textual sugerido

```text
+------------------------------------------------------+
|                                  PT | EN   Light/Dark|
|
|  JOAO ZANARDO
|  Portfolio em formato terminal, com foco em projetos,
|  exploracoes e narrativa tecnica.
|
|  Digite `help` para navegar.
|
|  > help
|    comandos disponiveis...
|
|  > projects
|    lista de projetos...
|
|  >
+------------------------------------------------------+
```

## Regras de hierarquia visual

### Nivel 1

Elementos mais importantes:

- nome
- conteudo do historico
- input atual

### Nivel 2

Elementos secundarios:

- texto introdutorio
- blocos de help
- links
- filtros e metadados

### Nivel 3

Elementos de apoio:

- toggles
- labels auxiliares
- estados de loading
- textos de uso

## Acessibilidade e usabilidade

O redesign precisa melhorar nao so estetica, mas conforto.

## Regras importantes

- contraste suficiente entre texto e fundo
- foco visivel no input e nos controles
- tamanho clicavel aceitavel para toggles
- leitura confortavel em telas menores
- scroll suave e legivel

## Mobile

Mesmo sendo um projeto com cara de terminal, precisa funcionar bem em mobile.

Cuidados:

- reduzir largura de header
- evitar linhas muito longas
- manter toggles acessiveis
- garantir input bom de usar com teclado virtual

## Sequencia de implementacao recomendada

## Etapa 1 - Fundacao visual

- remover o tema anterior baseado em dracula/neon
- definir tokens semanticos no CSS global
- configurar dark mode e light mode
- escolher tipografia final

## Etapa 2 - Infraestrutura de tema

- criar `ThemeContext`
- persistir preferencia em `localStorage`
- aplicar `data-theme` no root
- integrar toggle de tema na interface

## Etapa 3 - Refactor da shell principal

- refazer `App`
- refazer `Header`
- refazer `InputPrompt`
- refazer `LanguageToggle`
- criar `ThemeToggle`

## Etapa 4 - Refinamento do historico

- revisar estilos de `input`, `output`, `help`, `error` e `markdown`
- ajustar espacamento
- ajustar pesos tipograficos
- revisar estados de links e comandos

## Etapa 5 - Polimento

- revisar mobile
- revisar scrollbars
- revisar hover e foco
- revisar transicoes
- revisar consistencia entre idiomas

## Criterios de pronto

Vamos considerar essa etapa visual bem resolvida quando:

- o projeto ficar bonito sem depender de cores chamativas
- dark mode e light mode parecerem duas versoes da mesma interface
- a leitura do historico ficar mais confortavel
- o input parecer integrado ao sistema
- os toggles parecerem ferramentas, não enfeites
- o projeto transmitir mais clareza e menos ruido

## Decisoes objetivas recomendadas

Estas sao as decisoes que eu seguiria sem hesitar:

- remover glow e `text-shadow` neon
- parar de usar `Courier New` como identidade final
- usar uma paleta neutra com um unico acento verde-acinzentado
- trocar bandeiras por controle de idioma textual
- limitar a largura do conteudo principal
- dar mais espaco vertical entre blocos
- tratar o historico como area nobre do produto

## Recomendacao final

Antes de implementar novas fases de conteudo, o melhor caminho e:

**construir um sistema visual minimalista com dark mode e light mode bem resolvidos, e so depois expandir o projeto editorialmente.**

Essa ordem evita retrabalho, melhora a percepcao imediata do portfolio e cria uma base forte para tudo que vier depois.
