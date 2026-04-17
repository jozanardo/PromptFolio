import type {
  CommandContext,
  CommandDefinition,
  HelpListBlock,
} from '../../types';
import { helpTranslations } from './translations';

type HelpArgs = Record<string, never>;

export function buildHelpListBlock(context: CommandContext): HelpListBlock {
  return {
    type: 'helpList',
    title: helpTranslations[context.lang].title,
    items: context.registry.list('help').map(definition => ({
      command: definition.meta.name,
      description: definition.meta.description[context.lang],
      usage: definition.meta.usage[context.lang],
    })),
  };
}

export const helpCommand: CommandDefinition<HelpArgs, typeof helpTranslations> = {
  meta: {
    name: 'help',
    category: 'discovery',
    description: {
      en: helpTranslations.en.meta.description,
      pt: helpTranslations.pt.meta.description,
    },
    usage: {
      en: helpTranslations.en.meta.usage,
      pt: helpTranslations.pt.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: helpTranslations,
  parse: () => ({
    ok: true,
    args: {},
  }),
  execute: (_, context) => ({
    blocks: [buildHelpListBlock(context)],
  }),
};
