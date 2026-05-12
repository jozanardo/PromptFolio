import {
  localizeNarrativeRecords,
  resolveNarrativeContent,
} from '../../content/narrative';
import type { CommandDefinition, ParsedCommandInput } from '../../types';
import { philosophyTranslations } from './translations';

interface PhilosophyArgs {
  showHelp: boolean;
}

const philosophyParsing = {
  booleanFlags: ['help'],
} as const;

function parsePhilosophyArgs(input: ParsedCommandInput): PhilosophyArgs {
  return {
    showHelp: input.flags.help === true,
  };
}

export const philosophyCommand: CommandDefinition<
  PhilosophyArgs,
  typeof philosophyTranslations
> = {
  meta: {
    name: 'philosophy',
    category: 'editorial',
    description: {
      en: philosophyTranslations.en.meta.description,
      pt: philosophyTranslations.pt.meta.description,
    },
    usage: {
      en: philosophyTranslations.en.meta.usage,
      pt: philosophyTranslations.pt.meta.usage,
    },
    parsing: philosophyParsing,
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: philosophyTranslations,
  parse: input => ({
    ok: true,
    args: parsePhilosophyArgs(input),
  }),
  execute: (args, context) => {
    const t = philosophyTranslations[context.lang];

    if (args.showHelp) {
      return {
        blocks: [
          {
            type: 'text',
            text: t.helpUsage,
          },
        ],
      };
    }

    const content = resolveNarrativeContent(
      context.content.narrative
    ).philosophy;

    return {
      blocks: [
        {
          type: 'text',
          text: content.intro[context.lang],
        },
        {
          type: 'recordList',
          title: content.title[context.lang],
          records: localizeNarrativeRecords(content.records, context.lang),
        },
      ],
    };
  },
};
