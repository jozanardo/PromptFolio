// src/i18n/index.ts
export const translations = {
  en: {
    // general
    helpTitle: 'Available commands:',
    usageLabel: 'Usage',
    notFoundMessage: "Command not found. Type 'help' to view a list of available commands.",
    welcome: "Welcome to my terminal portfolio!",
    promptPre:  "Type ",
    promptCmd:  "help",
    promptPost: " to view a list of commands.",

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
    helpTitle: 'Comandos disponíveis:',
    usageLabel: 'Uso',
    notFoundMessage: "Comando não encontrado. Digite 'help' para ver a lista de comandos.",
    welcome: "Bem-vindo ao meu portfólio terminal!",
    promptPre:  "Digite ",
    promptCmd:  "help",
    promptPost: " para ver a lista de comandos.",

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
