import type { CommandDefinition } from '../../types';
import { clearTranslations } from './translations';

type ClearArgs = Record<string, never>;

export const clearCommand: CommandDefinition<ClearArgs, typeof clearTranslations> = {
  meta: {
    name: 'clear',
    category: 'system',
    description: {
      en: clearTranslations.en.meta.description,
      pt: clearTranslations.pt.meta.description,
    },
    usage: {
      en: clearTranslations.en.meta.usage,
      pt: clearTranslations.pt.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: clearTranslations,
  parse: () => ({
    ok: true,
    args: {},
  }),
  execute: () => ({
    blocks: [],
    effects: [{ type: 'clearHistory' }],
    echoInput: false,
  }),
};
