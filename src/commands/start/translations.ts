import { validateTranslations } from '../runtime/validateTranslations';

export const startTranslations = validateTranslations('start', {
  en: {
    intro: 'PromptFolio is a personal archive guided by commands.',
    title: 'Start exploring:',
    outro:
      'Type a command or use one of the shortcuts above to fill the prompt.',
    entries: {
      projects: 'Browse selected work and useful filters.',
      whoami: 'Read the short identity entry.',
      ls: 'See the compact directory of archive areas.',
      help: 'List every available command.',
    },
    meta: {
      description: 'Show the opening map of the archive.',
      usage: 'start',
    },
  },
  pt: {
    intro: 'PromptFolio é um arquivo pessoal guiado por comandos.',
    title: 'Comece explorando:',
    outro:
      'Digite um comando ou use um dos atalhos acima para preencher o prompt.',
    entries: {
      projects: 'Conheça trabalhos selecionados e filtros úteis.',
      whoami: 'Leia a entrada curta de identidade.',
      ls: 'Veja o diretório compacto das áreas do arquivo.',
      help: 'Liste todos os comandos disponíveis.',
    },
    meta: {
      description: 'Mostra o mapa inicial do arquivo.',
      usage: 'start',
    },
  },
});
