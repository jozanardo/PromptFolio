import { validateTranslations } from '../runtime/validateTranslations';

export const lsTranslations = validateTranslations('ls', {
  en: {
    title: 'Archive directory:',
    categories: {
      discovery: 'discovery',
      identity: 'identity',
      work: 'work',
    },
    meta: {
      description: 'Show a compact directory of archive areas.',
      usage: 'ls',
    },
  },
  pt: {
    title: 'Diretório do arquivo:',
    categories: {
      discovery: 'descoberta',
      identity: 'identidade',
      work: 'trabalho',
    },
    meta: {
      description: 'Mostra um diretório compacto das áreas do arquivo.',
      usage: 'ls',
    },
  },
});
