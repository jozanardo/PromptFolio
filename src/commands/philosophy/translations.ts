import { validateTranslations } from '../runtime/validateTranslations';

export const philosophyTranslations = validateTranslations('philosophy', {
  en: {
    helpUsage: 'Usage: philosophy [--help]',
    meta: {
      description: 'Read the working principles behind the archive.',
      usage: 'philosophy',
    },
  },
  pt: {
    helpUsage: 'Uso: philosophy [--help]',
    meta: {
      description: 'Leia os princípios de trabalho por trás do arquivo.',
      usage: 'philosophy',
    },
  },
});
