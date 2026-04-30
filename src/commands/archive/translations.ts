import { validateTranslations } from '../runtime/validateTranslations';

export const archiveTranslations = validateTranslations('archive', {
  en: {
    meta: {
      description: 'Browse the broader historical project catalog.',
      usage:
        'archive [--lang=<language>] [--desc=<text>] [--name=<name>] [--tag=<tag>]',
    },
    helpUsage:
      'Usage: archive [--lang=<language>] [--desc=<text>] [--name=<name>] [--tag=<tag>] [--help]',
    intro:
      'A broader project memory, including study work, labs, and older repositories that still explain the path.',
    title: 'Historical archive:',
    empty: 'No archived project records matched those filters.',
    loadingFallback:
      'GitHub enrichment is still loading. Showing the local catalog.',
    errorPrefix: 'GitHub enrichment unavailable: ',
    errorSuffix: '. Showing the local catalog.',
    projectSingular: 'project',
    projectPlural: 'projects',
    statusLabels: {
      active: 'active',
      study: 'study',
      archive: 'archive',
      lab: 'lab',
    },
  },
  pt: {
    meta: {
      description: 'Navegue pelo catálogo histórico mais amplo de projetos.',
      usage:
        'archive [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>] [--tag=<tag>]',
    },
    helpUsage:
      'Uso: archive [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>] [--tag=<tag>] [--help]',
    intro:
      'Uma memória mais ampla de projetos, incluindo estudos, laboratórios e repositórios antigos que ainda explicam a trajetória.',
    title: 'Arquivo histórico:',
    empty: 'Nenhum registro de projeto correspondeu a esses filtros.',
    loadingFallback:
      'O enriquecimento do GitHub ainda está carregando. Mostrando o catálogo local.',
    errorPrefix: 'Enriquecimento do GitHub indisponível: ',
    errorSuffix: '. Mostrando o catálogo local.',
    projectSingular: 'projeto',
    projectPlural: 'projetos',
    statusLabels: {
      active: 'ativo',
      study: 'estudo',
      archive: 'arquivo',
      lab: 'laboratório',
    },
  },
});
