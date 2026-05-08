import { validateTranslations } from '../runtime/validateTranslations';

export const journeyTranslations = validateTranslations('journey', {
  en: {
    intro:
      'A more editorial reading of the same timeline: what changed, what carried forward, and why it matters.',
    title: 'Journey:',
    helpUsage: 'Usage: journey [--help]',
    meta: {
      description:
        'Read the authored narrative behind the chronological archive.',
      usage: 'journey',
    },
  },
  pt: {
    intro:
      'Uma leitura mais editorial da mesma timeline: o que mudou, o que permaneceu e por que isso importa.',
    title: 'Jornada:',
    helpUsage: 'Uso: journey [--help]',
    meta: {
      description:
        'Leia a narrativa autoral por trás do arquivo cronológico.',
      usage: 'journey',
    },
  },
});
