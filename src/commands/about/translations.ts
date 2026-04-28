import { validateTranslations } from '../runtime/validateTranslations';

export const aboutTranslations = validateTranslations('about', {
  en: {
    meta: {
      description: 'Read the career and engineering profile summary.',
      usage: 'about',
    },
  },
  pt: {
    meta: {
      description: 'Leia o resumo da trajetória e do perfil de engenharia.',
      usage: 'about',
    },
  },
});
