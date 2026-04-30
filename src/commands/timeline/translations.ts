import { validateTranslations } from '../runtime/validateTranslations';

export const timelineTranslations = validateTranslations('timeline', {
  en: {
    intro:
      'A factual path through the archive, ordered from current work back to the foundations.',
    title: 'Timeline:',
    groupTitles: {
      year: 'Timeline by year:',
      cycle: 'Timeline by cycle:',
      kind: 'Timeline by kind:',
    },
    kindLabels: {
      career: 'career',
      project: 'project',
      study: 'study',
    },
    helpUsage: 'Usage: timeline [--group=year|cycle|kind] [--help]',
    meta: {
      description:
        'Browse the chronological archive of work, study, and career markers.',
      usage: 'timeline [--group=year|cycle|kind]',
    },
  },
  pt: {
    intro:
      'Um percurso factual pelo arquivo, ordenado do trabalho atual às fundações.',
    title: 'Timeline:',
    groupTitles: {
      year: 'Timeline por ano:',
      cycle: 'Timeline por ciclo:',
      kind: 'Timeline por tipo:',
    },
    kindLabels: {
      career: 'carreira',
      project: 'projeto',
      study: 'estudo',
    },
    helpUsage: 'Uso: timeline [--group=year|cycle|kind] [--help]',
    meta: {
      description:
        'Navegue pelo arquivo cronológico de trabalho, estudo e marcos de carreira.',
      usage: 'timeline [--group=year|cycle|kind]',
    },
  },
});
