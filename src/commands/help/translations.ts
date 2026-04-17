import { validateTranslations } from '../runtime/validateTranslations';

export const helpTranslations = validateTranslations('help', {
  en: {
    title: 'Available commands:',
    meta: {
      description: 'List all available commands.',
      usage: 'help',
    },
  },
  pt: {
    title: 'Comandos disponíveis:',
    meta: {
      description: 'Lista todos os comandos disponíveis.',
      usage: 'help',
    },
  },
});
