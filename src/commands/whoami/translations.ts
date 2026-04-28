import { validateTranslations } from '../runtime/validateTranslations';

export const whoamiTranslations = validateTranslations('whoami', {
  en: {
    meta: {
      description: 'Show a personal snapshot of João.',
      usage: 'whoami',
    },
  },
  pt: {
    meta: {
      description: 'Mostra um retrato pessoal do João.',
      usage: 'whoami',
    },
  },
});
