import { validateTranslations } from '../runtime/validateTranslations';

export const searchTranslations = validateTranslations('search', {
  en: {
    meta: {
      description:
        'Search across commands, projects, timeline, and authored notes.',
      usage: 'search <query> [--type=<kind>] [--limit=<count>]',
    },
    helpUsage:
      'Usage: search <query> [--type=command|project|timeline|journey|profile|narrative|contact] [--limit=1-10]',
    missingQuery: 'Search needs a query. Try: search backend',
    invalidType:
      'Unknown search type "{type}". Use command, project, timeline, journey, profile, narrative, or contact.',
    invalidLimit: 'Search limit must be a number from 1 to 10.',
    title: 'Search results:',
    intro: 'Archive results for "{query}":',
    empty:
      'No archive results found for "{query}". Try search backend, search promptfolio, or help.',
    kindLabels: {
      command: 'command',
      project: 'project',
      timeline: 'timeline',
      journey: 'journey',
      profile: 'profile',
      narrative: 'narrative',
      contact: 'contact',
    },
  },
  pt: {
    meta: {
      description: 'Pesquisa comandos, projetos, trajetória e notas autorais.',
      usage: 'search <consulta> [--type=<tipo>] [--limit=<quantidade>]',
    },
    helpUsage:
      'Uso: search <consulta> [--type=command|project|timeline|journey|profile|narrative|contact] [--limit=1-10]',
    missingQuery: 'A busca precisa de uma consulta. Tente: search backend',
    invalidType:
      'Tipo de busca desconhecido "{type}". Use command, project, timeline, journey, profile, narrative ou contact.',
    invalidLimit: 'O limite da busca deve ser um número de 1 a 10.',
    title: 'Resultados da busca:',
    intro: 'Resultados do arquivo para "{query}":',
    empty:
      'Nenhum resultado encontrado no arquivo para "{query}". Tente search backend, search promptfolio ou help.',
    kindLabels: {
      command: 'comando',
      project: 'projeto',
      timeline: 'linha do tempo',
      journey: 'jornada',
      profile: 'perfil',
      narrative: 'narrativa',
      contact: 'contato',
    },
  },
});
