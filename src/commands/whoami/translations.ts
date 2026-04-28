import { validateTranslations } from '../runtime/validateTranslations';

export const whoamiTranslations = validateTranslations('whoami', {
  en: {
    meta: {
      description: 'Show the concise engineering identity entry.',
      usage: 'whoami',
    },
  },
  pt: {
    meta: {
      description: 'Mostra a entrada curta de identidade como engenheiro.',
      usage: 'whoami',
    },
  },
});
