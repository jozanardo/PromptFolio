import { validateTranslations } from '../runtime/validateTranslations';

export const startTranslations = validateTranslations('start', {
  en: {
    intro: 'PromptFolio is a personal archive guided by commands.',
    title: 'Start exploring:',
    outro:
      'Type a command or use one of the shortcuts above to fill the prompt.',
    entries: {
      search: 'Search across the archive by project, skill, tag, or topic.',
      work: 'Browse selected work and useful filters.',
      timeline: 'Follow the chronological path through the archive.',
      journey: 'Read the more authored version of that path.',
      now: 'See what is currently in focus.',
      whoami: 'Read the personal identity entry.',
      ls: 'See the compact directory of archive areas.',
      help: 'List every available command.',
    },
    meta: {
      description: 'Show the opening map of the archive.',
      usage: 'start',
    },
  },
  pt: {
    intro: 'PromptFolio é um arquivo pessoal guiado por comandos.',
    title: 'Comece explorando:',
    outro:
      'Digite um comando ou use um dos atalhos acima para preencher o prompt.',
    entries: {
      search: 'Pesquise o arquivo por projeto, habilidade, tag ou assunto.',
      work: 'Conheça trabalhos selecionados e filtros úteis.',
      timeline: 'Acompanhe o percurso cronológico pelo arquivo.',
      journey: 'Leia a versão mais autoral desse percurso.',
      now: 'Veja o que está em foco agora.',
      whoami: 'Leia o retrato pessoal.',
      ls: 'Veja o diretório compacto das áreas do arquivo.',
      help: 'Liste todos os comandos disponíveis.',
    },
    meta: {
      description: 'Mostra o mapa inicial do arquivo.',
      usage: 'start',
    },
  },
});
