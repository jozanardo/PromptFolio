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
      'PromptFolio organizes my portfolio as a calm personal archive. You can click a suggestion below or type a short command to browse selected work, background, skills, and ways to reach me.',
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
    quickStartCommands: ['start', 'work', 'whoami', 'help'] as const,
  },
  pt: {
    // general
    eyebrowLabel: 'Arquivo pessoal guiado por comandos',
    helpTitle: 'Comandos disponíveis:',
    usageLabel: 'Uso',
    notFoundMessage: "Comando não encontrado. Digite 'help' para ver a lista de comandos.",
    welcome: 'Explore meu trabalho, trajetória e formas de contato.',
    intro:
      'O PromptFolio organiza meu portfólio como um arquivo pessoal calmo. Você pode clicar em uma sugestão abaixo ou digitar um comando curto para navegar por trabalhos selecionados, trajetória, habilidades e formas de contato.',
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
    quickStartCommands: ['start', 'work', 'whoami', 'help'] as const,
  },
} as const;

export type ShellTranslations = typeof translations;
