import { validateTranslations } from '../runtime/validateTranslations';

export const clearTranslations = validateTranslations('clear', {
  en: {
    meta: {
      description: 'Clears the history (header stays).',
      usage: 'clear',
    },
  },
  pt: {
    meta: {
      description: 'Limpa o histórico (header fixo).',
      usage: 'clear',
    },
  },
});
