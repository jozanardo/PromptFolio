import { validateTranslations } from '../runtime/validateTranslations';

export const contactTranslations = validateTranslations('contact', {
  en: {
    meta: {
      description: 'Find verified ways to reach me.',
      usage: 'contact',
    },
  },
  pt: {
    meta: {
      description: 'Encontre formas verificadas de contato.',
      usage: 'contact',
    },
  },
});
