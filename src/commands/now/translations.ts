import { validateTranslations } from '../runtime/validateTranslations';

export const nowTranslations = validateTranslations('now', {
  en: {
    helpUsage: 'Usage: now [--help]',
    meta: {
      description: 'Read what is currently in focus.',
      usage: 'now',
    },
  },
  pt: {
    helpUsage: 'Uso: now [--help]',
    meta: {
      description: 'Leia o que está em foco agora.',
      usage: 'now',
    },
  },
});
