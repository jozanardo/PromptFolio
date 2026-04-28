import { validateTranslations } from '../runtime/validateTranslations';

export const skillsTranslations = validateTranslations('skills', {
  en: {
    meta: {
      description:
        'Browse backend, scale, resilience, performance, and observability skills.',
      usage: 'skills',
    },
  },
  pt: {
    meta: {
      description:
        'Navegue por habilidades de backend, escala, resiliência, desempenho e observabilidade.',
      usage: 'skills',
    },
  },
});
