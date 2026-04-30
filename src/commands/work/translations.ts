import { validateTranslations } from '../runtime/validateTranslations';

export const workTranslations = validateTranslations('work', {
  en: {
    meta: {
      description: 'Browse the curated work catalog with optional filters.',
      usage:
        'work [--lang=<language>] [--desc=<text>] [--name=<name>] [--tag=<tag>]',
    },
    helpUsage:
      'Usage: work [--lang=<language>] [--desc=<text>] [--name=<name>] [--tag=<tag>] [--list-langs] [--help]',
    intro:
      'Selected work from the local archive. GitHub only enriches language, URL, and update metadata when available.',
    title: 'Selected work:',
    empty: 'No curated work matched those filters.',
    availableLanguagesTitle: 'Available languages:',
    projectSingular: 'project',
    projectPlural: 'projects',
    loadingFallback:
      'GitHub enrichment is still loading. Showing the local catalog.',
    errorPrefix: 'GitHub enrichment unavailable: ',
    errorSuffix: '. Showing the local catalog.',
    statusLabels: {
      active: 'active',
      study: 'study',
      archive: 'archive',
      lab: 'lab',
    },
  },
  pt: {
    meta: {
      description:
        'Navegue pelo catálogo curado de trabalho com filtros opcionais.',
      usage:
        'work [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>] [--tag=<tag>]',
    },
    helpUsage:
      'Uso: work [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>] [--tag=<tag>] [--list-langs] [--help]',
    intro:
      'Trabalho selecionado do arquivo local. O GitHub apenas enriquece linguagem, URL e metadados de atualização quando disponível.',
    title: 'Trabalho selecionado:',
    empty: 'Nenhum trabalho curado correspondeu a esses filtros.',
    availableLanguagesTitle: 'Linguagens disponíveis:',
    projectSingular: 'projeto',
    projectPlural: 'projetos',
    loadingFallback:
      'O enriquecimento do GitHub ainda está carregando. Mostrando o catálogo local.',
    errorPrefix: 'Enriquecimento do GitHub indisponível: ',
    errorSuffix: '. Mostrando o catálogo local.',
    statusLabels: {
      active: 'ativo',
      study: 'estudo',
      archive: 'arquivo',
      lab: 'laboratório',
    },
  },
});
