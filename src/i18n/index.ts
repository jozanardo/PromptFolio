// src/i18n/index.ts
export const translations = {
  en: {
    // general
    eyebrowLabel: 'Command-guided personal archive',
    helpTitle: 'Available commands:',
    usageLabel: 'Usage',
    notFoundMessage: "Command not found. Type 'help' to view a list of available commands.",
    welcome: 'Explore my work, journey, and contact links.',
    intro:
      'PromptFolio organizes my portfolio as a calm personal archive. You can click a suggestion below or type a short command to browse projects, background, skills, and ways to reach me.',
    guidance: 'Start here:',
    guidanceDetail:
      'Click a suggestion to fill the prompt. Then press Enter.',
    promptPre: 'Or type ',
    promptCmd: 'help',
    promptPost: ' and press Enter to see all available options.',
    inputAriaLabel: 'Command prompt',
    inputPlaceholder: 'Type a command and press Enter',
    historyAriaLabel: 'Terminal history',
    fillPromptAriaLabel: 'Fill the prompt with',
    readmeLoading: 'Loading GitHub README…',
    loadingLanguages: 'Loading languages…',
    projectsLoading: 'Searching projects…',
    filterLangLabel: 'language',
    filterDescLabel: 'description',
    filterNameLabel: 'name',
    urlLabel: 'URL',
    quickStartCommands: ['about', 'projects', 'skills', 'contact'] as const,

    // about
    aboutTitle: 'About me:',
    aboutLine1: 'I am passionate about technology and software development.',
    aboutLine2: 'Currently studying Computer Science at UFABC.',

    // skills
    skillsTitle: 'My skills include:',
    skillsList: [
      '- TypeScript, JavaScript, Python, Java, C#, Go, Haskell',
      '- React, Node.js, NestJS, Next.js, Tailwind CSS',
      '- Git, Docker, Linux',
    ] as const,

    // contact
    contactTitle: 'Contact me:',
    contactList: [
      '- GitHub: https://github.com/jozanardo',
      '- LinkedIn: [Your LinkedIn]',
      '- Email: [Your Email]',
    ] as const,

    // projects
    projectsHelpUsage:
      'Usage: projects [--lang=<language>] [--desc=<text>] [--name=<name>] [--list-langs] [--help]',
    availableLangsTitle: 'Available languages:',
    projectSingular: 'project',
    projectPlural: 'projects',
    allProjectsTitle: 'All projects:',
    foundMessage: 'Found',
    descriptionLabel: 'Description',
    updatedLabel: 'Updated at',
    noProjectsMessage: 'No projects found with the applied filters.',

    // commandDescriptions
    commandDescriptions: {
      help:    'List all available commands.',
      ls:      'List all available commands.',
      whoami:  'What I do',
      about:   'Know about me',
      skills:  'What tech stacks I use',
      projects:'See my projects (with filters!)',
      contact: 'Want to say something?',
      clear:   'Clears the history (header stays)',
    } as const,
  },
  pt: {
    // general
    eyebrowLabel: 'Arquivo pessoal guiado por comandos',
    helpTitle: 'Comandos disponíveis:',
    usageLabel: 'Uso',
    notFoundMessage: "Comando não encontrado. Digite 'help' para ver a lista de comandos.",
    welcome: 'Explore meu trabalho, trajetória e formas de contato.',
    intro:
      'O PromptFolio organiza meu portfólio como um arquivo pessoal calmo. Você pode clicar em uma sugestão abaixo ou digitar um comando curto para navegar por projetos, trajetória, habilidades e formas de contato.',
    guidance: 'Comece por aqui:',
    guidanceDetail:
      'Clique em uma sugestão para preencher o prompt. Depois, pressione Enter.',
    promptPre: 'Ou digite ',
    promptCmd: 'help',
    promptPost: ' e pressione Enter para ver todas as opções disponíveis.',
    inputAriaLabel: 'Prompt de comando',
    inputPlaceholder: 'Digite um comando e pressione Enter',
    historyAriaLabel: 'Histórico do terminal',
    fillPromptAriaLabel: 'Preencher o prompt com',
    readmeLoading: 'Carregando README do GitHub…',
    loadingLanguages: 'Carregando linguagens…',
    projectsLoading: 'Buscando projetos…',
    filterLangLabel: 'linguagem',
    filterDescLabel: 'descrição',
    filterNameLabel: 'nome',
    urlLabel: 'URL',
    quickStartCommands: ['about', 'projects', 'skills', 'contact'] as const,

    // about
    aboutTitle: 'Sobre mim:',
    aboutLine1: 'Sou apaixonado por tecnologia e desenvolvimento de software.',
    aboutLine2: 'Atualmente estudando Ciência da Computação na UFABC.',

    // skills
    skillsTitle: 'Minhas habilidades incluem:',
    skillsList: [
      '- TypeScript, JavaScript, Python, Java, C#, Go, Haskell',
      '- React, Node.js, NestJS, Next.js, Tailwind CSS',
      '- Git, Docker, Linux',
    ] as const,

    // contact
    contactTitle: 'Entre em contato:',
    contactList: [
      '- GitHub: https://github.com/jozanardo',
      '- LinkedIn: [Seu LinkedIn]',
      '- Email: [Seu Email]',
    ] as const,

    // projects
    projectsHelpUsage:
      'Uso: projects [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>] [--list-langs] [--help]',
    availableLangsTitle: 'Linguagens disponíveis:',
    projectSingular: 'projeto',
    projectPlural: 'projetos',
    allProjectsTitle: 'Todos os projetos:',
    foundMessage: 'Encontrados',
    descriptionLabel: 'Descrição',
    updatedLabel: 'Atualizado em',
    noProjectsMessage: 'Nenhum projeto encontrado com os filtros aplicados.',

    // commandDescriptions
    commandDescriptions: {
      help:    'Lista todos os comandos disponíveis.',
      ls:      'Lista todos os comandos disponíveis.',
      whoami:  'Quem sou eu.',
      about:   'Saiba mais sobre mim.',
      skills:  'Quais tecnologias eu uso.',
      projects:'Veja meus projetos (use filtros!).',
      contact: 'Quer dizer algo?',
      clear:   'Limpa o histórico (header fixo).',
    } as const,
  },
} as const;

export type ShellTranslations = typeof translations;
