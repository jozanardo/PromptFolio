# Plano V2 Detalhado dos Comandos do PromptFolio

## Resumo

- O objetivo da V2 é substituir a lógica concentrada em `src/hooks/useCommandProcessor.ts` por uma arquitetura orientada a comandos, onde cada comando é uma unidade independente, traduzível, testável e extensível.
- A entrega será organizada em uma `Fase 0` de fundação técnica e, depois, em fases principais centradas em famílias de comandos.
- O terminal continuará com nomes de comandos canônicos em inglês, mas toda a experiência textual será localizada em `pt` e `en`, incluindo ajuda, erros, estados vazios, onboarding e respostas.
- O plano já assume que o projeto continuará visualmente fiel ao PromptFolio atual: top bar fixa, shell editorial, prompt como centro da interação, scroll na página e onboarding persistente.

## Decisões de Arquitetura

- O runtime de comandos passará a ser a espinha dorsal do terminal. Ele será responsável por registrar comandos, interpretar a entrada do usuário, montar um contexto de execução e devolver uma resposta estruturada para a UI.
- Cada comando passará a viver em sua própria pasta dentro de `src/commands/<nome-do-comando>/`, com contrato previsível e repetível entre todos os módulos.
- O conteúdo autoral não ficará espalhado em `useCommandProcessor` nem em um objeto global monolítico de tradução. O comando orquestra; os dados e textos ricos vivem em módulos de conteúdo próprios.
- A UI deixará de depender de strings montadas ad hoc. O terminal renderizará blocos tipados, o que permitirá enriquecer `projects`, `timeline`, `search` e `highlights` sem acoplar regra de negócio em `History.tsx`.
- O comando `whoami` deixará de depender de README remoto como fonte principal e passará a responder a partir de conteúdo autoral local totalmente traduzido.
- A integração com GitHub continuará existindo, mas ficará concentrada no catálogo de projetos, como enriquecimento opcional de dados curados locais.
- O parser comum deixará de depender apenas de `split(/\s+/)` e passará a suportar texto com espaços, flags booleanas e flags nomeadas de forma consistente, para evitar limitações em `projects`, `search` e comandos futuros.

## Estrutura-Alvo

- `src/commands/` passará a conter o runtime compartilhado, o registro dos comandos e as pastas individuais de cada comando.
- `src/content/` concentrará os dados autorais e estruturados do acervo, como perfil, narrativa, timeline, projetos curados, destaques e filosofia.
- `src/search/` concentrará a construção e consulta do índice de busca local.
- `src/components/History.tsx` passará a renderizar blocos estruturados em vez de depender de `HistoryItem` excessivamente genérico.
- `src/components/Header.tsx` continuará sendo responsável pelo onboarding e pelos quick-start chips, mas passará a apontar para os novos comandos centrais.
- `src/i18n/` ficará restrito ao shell global e a utilitários de locale. As traduções específicas de comandos ficarão co-localizadas com cada comando.
- `src/context/TerminalContext.tsx` continuará existindo como ponto de integração da UI com o terminal, mas passará a consumir um dispatcher bem menor e mais previsível.

## Contratos de Implementação

- Todo comando deverá expor `meta`, `parse`, `execute` e `translations`.
- `meta` deverá definir nome canônico, descrição localizada, uso, exemplos, categoria e se o comando participa de `start`, `help`, `ls` e `search`.
- `parse` deverá transformar a string do usuário em uma estrutura tipada com argumentos normalizados, erros de uso e defaults.
- `execute` deverá receber um contexto com `lang`, conteúdo local, catálogo de projetos, índice de busca e APIs compartilhadas, e devolver um resultado estruturado.
- O resultado do comando deverá ser composto por blocos tipados. O conjunto mínimo da V2 será `text`, `helpList`, `recordList`, `markdown`, `error` e `system`.
- Todo bloco que liste comandos, aliases, seções navegáveis ou famílias do acervo deverá preservar o mesmo tratamento visual de referência do `help`: rótulo estrutural discreto, linha lateral fina e o token principal em acento funcional. Isso vale para `helpList` e também para `recordList` quando ele for usado para comandos, categorias ou seções, como em `start`, `ls`, `projects`, `timeline`, `search` e comandos futuros.
- A cor de acento em listas deverá identificar tokens navegáveis ou estruturais, não decorar descrições longas. Descrições, subtítulos e linhas explicativas permanecem em texto primário, muted ou soft conforme a hierarquia já usada pelo `History`.
- O `help` deverá ser tratado como a referência visual base para saídas estruturadas de comandos. Sempre que um comando local/autorial sem dependência de fonte externa listar seções, categorias, tópicos, comandos relacionados, links de contato, princípios ou áreas do acervo, ele deverá usar a mesma gramática visual compartilhada: seção discreta, linha lateral fina, token principal em acento, cópia explicativa neutra e subtokens pequenos quando houver lista secundária.
- Essa regra se aplica explicitamente aos comandos locais previstos na V2, incluindo `start`, `ls`, `about`, `skills`, `contact`, `timeline`, `journey`, `now` e `philosophy`. Comandos com enriquecimento externo, como `projects`, `archive`, `highlights` e `search`, também deverão preservar essa base para tokens e agrupamentos internos, adaptando apenas o necessário para dados remotos, estados de carregamento ou fallback.
- Nenhum comando deverá criar cards, badges, chips, ícones decorativos ou um sistema visual paralelo para listar informações internas, salvo pedido explícito do usuário. A identidade visual dos comandos deve parecer uma mesma linguagem de arquivo, não uma coleção de layouts isolados.
- `translations` deverá conter as strings locais do comando em `pt` e `en`, com cobertura total para rótulos, erros, ajuda, estados vazios e descrições.
- Cada comando deverá ter testes próprios para parser, execução, saída localizada e casos de erro.

## Fase 0 — Fundação da Nova CLI - Done

- Objetivo: criar a infraestrutura que permitirá migrar os comandos atuais e construir os novos sem continuar aumentando o acoplamento do terminal.
- Escopo: criar o runtime de comandos, o novo contrato de resposta, o parser compartilhado, a camada de contexto, a base de i18n por comando e a stack de testes.
- Arquivos principais previstos: `src/commands/runtime/*`, `src/types/terminal.ts` ou equivalente, atualização de `src/context/TerminalContext.tsx`, refatoração de `src/hooks/useCommandProcessor.ts`, ajuste de `src/components/History.tsx` e adição da configuração de testes no projeto.
- Implementação: extrair a enum/metadata atual de `src/commands/index.ts` para um registro orientado a módulos; criar um `CommandRegistry`; criar um `parseCommandInput`; criar um `executeCommand`; migrar `clear` para side effect estruturado em vez de tratamento especial espalhado no hook.
- Implementação: definir um contexto estável com `lang`, `setHistory`, conteúdo carregado, catálogo de projetos, índice de busca e serviços externos, para que todo comando execute sob o mesmo contrato.
- Implementação: separar o i18n do shell do i18n dos comandos; o shell continuará traduzindo header, prompt e controles globais, enquanto cada comando responderá por suas próprias mensagens.
- Implementação: introduzir `Vitest`, `jsdom` e `@testing-library/react` para cobrir lógica e integração leve; adicionar scripts de `test` e `test:watch` ao `package.json`.
- Checklist: dispatcher novo criado, parser comum definido, bloco tipado definido, `History` adaptado para blocos, `clear` migrado, base de testes instalada, helper de locale implementado, helper para validar cobertura `pt/en` criado.
- Aceite: o terminal consegue processar pelo menos um comando pelo novo runtime, `clear` funciona sem tratamento legado no fluxo principal e a suíte inicial de testes roda localmente.
- Dependência para as próximas fases: nenhuma fase de comando poderá começar antes de essa fundação estar concluída, porque todas dependerão do registro comum, do parser compartilhado e da renderização por blocos.

## Fase 1 — Descoberta Inicial com `start`, `help` e `ls`

- Objetivo: transformar a entrada do terminal em uma porta editorial clara para o acervo e eliminar a duplicação pobre entre `help` e `ls`.
- Escopo: criar `start` como ponto de partida principal; reimplementar `help` sob o novo contrato; redefinir `ls` como um resumo curto das áreas navegáveis do PromptFolio.
- Arquivos principais previstos: `src/commands/start/*`, `src/commands/help/*`, `src/commands/ls/*`, ajuste em `src/components/Header.tsx` e revisão do shell i18n que alimenta quick-start e prompt hint.
- Implementação: `start` deverá apresentar o mapa inicial do acervo, explicar rapidamente o produto e apontar para comandos de descoberta como `projects`, `timeline`, `now` e `help`.
- Implementação: `help` deverá listar todos os comandos registrados a partir do `CommandRegistry`, e não mais de um `Map` hardcoded; a resposta deverá ser inteiramente derivada do metadado do próprio comando.
- Implementação: `ls` deverá funcionar como visão compacta do diretório do acervo, agrupando comandos por família em vez de repetir linha por linha a resposta completa do `help`.
- Implementação: `start` e `ls` deverão reutilizar o mesmo padrão visual do `help` para tokens principais. Em `start`, os nomes dos comandos sugeridos devem aparecer com o acento funcional. Em `ls`, os nomes das famílias ou seções navegáveis, como `discovery`, `identity` e `work`, devem receber o mesmo destaque de token estrutural.
- Implementação: os quick-start chips do header deverão ser revistos para refletir a nova entrada, provavelmente priorizando `start`, `projects`, `timeline` e `now`.
- Checklist: `start` criado, `help` migrado, `ls` redefinido, `Header` atualizado, metadados localizados por comando implementados, listagem derivada do registro funcionando em ambos os idiomas.
- Testes obrigatórios: `help` lista apenas comandos registrados; `ls` não duplica exatamente a resposta do `help`; `start` responde em `pt` e `en`; quick-start preenche o prompt corretamente; exemplos/uso refletem o idioma ativo; `recordList` aplica o mesmo destaque de acento usado pelos tokens de comando do `help`.
- Aceite: um visitante novo entende o que o PromptFolio é, como começar e quais áreas explorar sem precisar adivinhar o vocabulário da CLI.

## Fase 2 — Identidade Base com `about`, `whoami`, `skills` e `contact` - Done

- Objetivo: consolidar a camada de identidade profissional e pessoal do PromptFolio em conteúdo local, curado e plenamente traduzível.
- Escopo: migrar os comandos atuais de identidade para o novo runtime e transformar `whoami` em um resumo autoral em vez de uma leitura remota de README.
- Arquivos principais previstos: `src/commands/about/*`, `src/commands/whoami/*`, `src/commands/skills/*`, `src/commands/contact/*`, `src/content/profile/*`.
- Implementação: `about` deverá responder com um resumo editorial curto sobre quem é João, qual o recorte do portfólio e qual o contexto profissional/acadêmico relevante.
- Implementação: `whoami` deverá responder a um retrato pessoal e “terminal-native” de João, com seções de perfil, interesses e hobbies em `pt` e `en`, removendo a dependência principal de `fetchReadmeHtml`.
- Implementação: `skills` deverá passar a responder a partir de uma estrutura de dados organizada por categorias, como linguagens, frameworks, fundamentos, tooling e interesses, e não apenas uma lista solta de strings.
- Implementação: quando `skills` renderizar categorias, os nomes das categorias deverão usar o mesmo tratamento de token estrutural das seções de `ls`, mantendo descrições e itens técnicos em hierarquia textual neutra.
- Implementação: `about`, `skills` e `contact` deverão seguir a mesma gramática visual derivada do `help` sempre que renderizarem blocos estruturados. `about` pode usar tokens para recortes de identidade ou áreas de atuação; `skills` deve usar tokens para categorias; `contact` deve usar tokens para canais como GitHub, LinkedIn e Email, com URLs e descrições em texto neutro.
- Implementação: `contact` deverá ser migrado para o novo contrato e deixar placeholders pendentes; o conteúdo deverá ser localizável, clicável e consistente com o idioma ativo.
- Implementação: o conteúdo de perfil deverá ser separado em arquivos de dados, com campos por locale, para evitar concatenação manual e para permitir reuso em `start`, `now` e comandos futuros.
- Checklist: perfil autoral estruturado criado, `whoami` local implementado, `skills` estruturado por categorias, `contact` sem placeholders, comandos migrados para pastas próprias, traduções `pt/en` completas.
- Testes obrigatórios: `whoami` não depende do serviço remoto; `skills` retorna categorias corretas; `contact` localiza rótulos e conteúdo; `about` e `whoami` não divergem conceitualmente entre os idiomas.
- Aceite: os comandos de identidade funcionam totalmente offline do GitHub, têm linguagem coerente entre si e já entregam a sensação de acervo autoral em vez de portfólio genérico.

## Fase 3 — Catálogo de Trabalho com `projects`, `highlights` e `archive`

- Objetivo: transformar a listagem atual de repositórios num catálogo editorial híbrido entre curadoria local e enriquecimento remoto.
- Escopo: reconstruir `projects`, criar `highlights` e criar `archive` sobre uma mesma fonte de verdade de projetos.
- Arquivos principais previstos: `src/commands/projects/*`, `src/commands/highlights/*`, `src/commands/archive/*`, `src/content/projects/*`, adaptação do serviço hoje em `src/features/projects/projectsService.ts`, eventual extração de um `src/services/projectCatalog.ts`.
- Implementação: criar um modelo de projeto curado com campos como `slug`, `repoName`, `featured`, `summary.pt`, `summary.en`, `impact.pt`, `impact.en`, `tags`, `status`, `year`, `order` e links.
- Implementação: criar um adaptador de GitHub que complemente os projetos curados com metadados externos como `language`, `updated_at` e `html_url`, sem substituir o conteúdo humano.
- Implementação: `projects` deverá deixar de ser “todos os repositórios” e passar a ser a visão principal de descoberta do trabalho, com subset editorial e filtros reaproveitáveis.
- Implementação: `highlights` deverá mostrar a seleção mais representativa dos projetos, cada item com uma justificativa curta do porquê aquele projeto importa na narrativa profissional.
- Implementação: `archive` deverá mostrar o catálogo histórico completo, agrupado de forma navegável e menos promocional, servindo como memória do acervo.
- Implementação: comandos de catálogo que listem slugs, nomes navegáveis, filtros ativos ou agrupamentos deverão seguir o padrão visual de tokens do `help`, usando acento nos identificadores principais e evitando transformar descrições de projeto em elementos decorativos.
- Implementação: a infraestrutura de filtros deverá deixar de morar apenas no hook de feature atual e passar a compor o runtime, para ser reaproveitável em `projects`, `archive` e `search`.
- Checklist: catálogo curado criado, adaptador GitHub isolado, `projects` migrado, `highlights` criado, `archive` criado, filtros comuns implementados, fallback para falha remota definido.
- Testes obrigatórios: merge entre dados locais e GitHub; filtros por linguagem, texto e nome; fallback quando a API remota falha; diferenciação real entre `projects`, `highlights` e `archive`; cobertura `pt/en` de labels, descrições e estados vazios.
- Aceite: o usuário consegue explorar o trabalho em três profundidades distintas sem sentir que todos os comandos retornam apenas a mesma lista com outro título.

## Fase 4 — Narrativa Cronológica com `timeline` e `journey`

- Objetivo: adicionar profundidade temporal ao acervo, distinguindo histórico factual de narrativa autoral.
- Escopo: criar uma camada cronológica reutilizável e dois comandos complementares sobre ela.
- Arquivos principais previstos: `src/commands/timeline/*`, `src/commands/journey/*`, `src/content/timeline/*`.
- Implementação: criar um modelo de entrada cronológica com campos como `id`, `period`, `title.pt`, `title.en`, `summary.pt`, `summary.en`, `kind`, `relatedProjects` e `tags`.
- Implementação: `timeline` deverá privilegiar leitura factual e rápida, com entradas ordenadas e agrupáveis por ano, ciclo ou marco.
- Implementação: `journey` deverá usar a mesma base, mas com recorte mais narrativo, explicando transições, aprendizados, mudanças de foco e evolução técnica.
- Implementação: `timeline` e `journey` não devem duplicar conteúdo arbitrariamente; eles devem compartilhar fonte de verdade e diferir principalmente na forma de apresentação e no grau de editorialização.
- Implementação: agrupamentos cronológicos, anos, períodos ou marcos navegáveis deverão usar o mesmo padrão de token estrutural aplicado em `help` e `ls`, enquanto o corpo narrativo permanece em texto de leitura.
- Implementação: integrar referências cruzadas entre timeline e projetos, para que marcos cronológicos possam apontar para projetos ou fases importantes.
- Checklist: modelo cronológico criado, `timeline` implementado, `journey` implementado, integração com catálogo de projetos validada, traduções completas criadas.
- Testes obrigatórios: ordenação cronológica; agrupamento consistente; paridade entre locales; entradas sem projeto relacionado; renderização adequada dos blocos de narrativa.
- Aceite: a trajetória profissional deixa de estar implícita e passa a ser navegável de forma clara, sem virar uma parede de texto nem duplicar a seção de projetos.

## Fase 5 — Voz Editorial com `now` e `philosophy`

- Objetivo: representar o presente e a visão de trabalho do autor, dando personalidade ao acervo sem transformar o terminal em manifesto.
- Escopo: criar dois comandos curtos, autorais e altamente localizados, focados em contexto atual e pensamento técnico.
- Arquivos principais previstos: `src/commands/now/*`, `src/commands/philosophy/*`, `src/content/narrative/*`.
- Implementação: `now` deverá responder o que está em foco no momento, em que temas João está trabalhando, estudando ou explorando e por que isso importa agora.
- Implementação: `philosophy` deverá condensar a visão sobre software, engenharia, IA, produto, estudo ou craft técnico, mantendo tom preciso, calmo e coerente com o PromptFolio.
- Implementação: ambos os comandos deverão ser locais, curados e independentes de API externa.
- Implementação: `now` e `philosophy` deverão usar a gramática visual derivada do `help` quando apresentarem focos, princípios, temas ou áreas de pensamento. O token principal identifica o tópico; o texto explicativo permanece em hierarquia de leitura, sem cards, badges ou destaques decorativos.
- Implementação: `start` deverá apontar para `now`, e `help` deverá tratar `philosophy` como parte da camada editorial, não apenas como “mais uma página”.
- Checklist: `now` criado, `philosophy` criado, conteúdo revisado em `pt/en`, integração com `start` e `help` concluída.
- Testes obrigatórios: locale ativo altera a resposta; conteúdo não fica vazio; ajuda e uso aparecem corretamente; o resultado segue o contrato de blocos e não depende de strings hardcoded na UI.
- Aceite: o PromptFolio passa a comunicar não só histórico e stack, mas também direção atual e pensamento autoral.

## Fase 6 — Descoberta Transversal com `search` e Polimento Final

- Objetivo: permitir descoberta real sobre todo o acervo e fechar a V2 com consistência de UX, i18n e integração.
- Escopo: implementar a busca transversal, revisar a ergonomia dos comandos e concluir os refinamentos finais do terminal.
- Arquivos principais previstos: `src/commands/search/*`, `src/search/*`, ajustes finais em `Header.tsx`, `History.tsx` e shell i18n.
- Implementação: criar um índice local sobre conteúdo autoral, comandos e catálogo de projetos, sem depender de serviço externo.
- Implementação: `search` deverá pesquisar pelo menos em títulos, descrições, tags, textos curtos, aliases internos e comandos relacionados, retornando resultados no idioma ativo.
- Implementação: a indexação deverá considerar texto localizado por idioma, para que o visitante receba resultados coerentes com o locale atual.
- Implementação: resultados de `search` que mostrem comandos, tags, seções ou slugs deverão destacar esses tokens com o mesmo acento funcional do `help`, preservando snippets e descrições como texto secundário.
- Implementação: `search` deverá reaproveitar a infraestrutura de filtros sempre que fizer sentido, sem criar uma segunda lógica paralela de matching.
- Implementação: revisar onboarding, quick-start, mensagens de erro, empty states e dicas de uso para refletir a CLI final.
- Implementação: revisar `help`, `ls`, `start` e todos os blocos de listagem para garantir que exponham corretamente os comandos entregues nas fases anteriores e mantenham o padrão visual compartilhado para tokens navegáveis ou estruturais.
- Checklist: índice criado, `search` implementado, integração com catálogo e conteúdo concluída, revisão final de quick-start concluída, revisão final de i18n concluída, regressões de renderização corrigidas.
- Testes obrigatórios: busca com resultado em `pt`; busca com resultado em `en`; busca sem resultado; busca por tag; busca por texto presente em projeto curado; busca por entrada narrativa; fluxo completo do terminal com idioma trocado; regressão visual garantindo que listas de comandos, seções e resultados preservem o destaque de token compartilhado com `help`.
- Aceite: a V2 fecha com uma CLI coerente, navegável e pesquisável, onde o acervo realmente pode ser explorado como produto principal.

## Estratégia de Testes

- Todo comando deverá ter `parse.test.ts`, `execute.test.ts` e `translations.test.ts`.
- Todo conjunto de conteúdo compartilhado deverá ter testes de integridade estrutural, para impedir objetos sem `pt/en`, campos ausentes ou referências inválidas.
- O runtime deverá ter testes próprios para registro, roteamento, parser comum, side effects e renderização dos blocos principais.
- A UI deverá ter testes leves cobrindo fluxo real: digitar um comando, pressionar Enter, receber blocos corretos, trocar idioma e verificar resposta localizada.
- O catálogo de projetos deverá ter testes específicos para merge entre curadoria local e GitHub, ordem final, fallback e filtros.
- A busca deverá ter testes específicos para indexação, locale ativo, relevância mínima e estados vazios.
- A suite final deverá impedir regressão de acessibilidade já existente, como `aria-label` localizado, `autoCapitalize="none"` e ausência de comportamento inesperado nos toggles.

## Dependências Entre Fases

- Fase 1 depende da conclusão integral da Fase 0.
- Fase 2 depende de Fase 0 e deve acontecer antes de Fase 5, porque `now` e `philosophy` herdarão padrões de conteúdo autoral local.
- Fase 3 depende de Fase 0 e deve ocorrer antes da Fase 6, porque `search` precisará indexar o catálogo de projetos final.
- Fase 4 depende de Fase 0 e deve preferencialmente ocorrer depois da Fase 3, para que a timeline já consiga referenciar projetos curados.
- Fase 5 depende da Fase 2 para manter coerência editorial.
- Fase 6 depende da conclusão funcional das Fases 1 a 5.

## Assumptions e Defaults

- O comando principal de entrada será `start`.
- `ls` será mantido por compatibilidade, mas com papel diferente de `help`.
- Os nomes dos comandos continuarão em inglês.
- Toda resposta textual dos comandos será localizada em `pt` e `en`.
- O shell global continuará tendo seu próprio i18n, separado do i18n de cada comando.
- `whoami` não usará mais README remoto como fonte principal.
- O catálogo de projetos será híbrido: conteúdo humano local como fonte principal e GitHub como enriquecimento.
- O plano considera `contact` e `clear` como comandos preservados, mas não como eixos principais de fase.
