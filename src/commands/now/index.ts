import {
  localizeNarrativeRecords,
  resolveNarrativeContent,
} from '../../content/narrative';
import type { CommandDefinition, ParsedCommandInput } from '../../types';
import { nowTranslations } from './translations';

interface NowArgs {
  showHelp: boolean;
}

const nowParsing = {
  booleanFlags: ['help'],
} as const;

function parseNowArgs(input: ParsedCommandInput): NowArgs {
  return {
    showHelp: input.flags.help === true,
  };
}

export const nowCommand: CommandDefinition<NowArgs, typeof nowTranslations> = {
  meta: {
    name: 'now',
    category: 'editorial',
    description: {
      en: nowTranslations.en.meta.description,
      pt: nowTranslations.pt.meta.description,
    },
    usage: {
      en: nowTranslations.en.meta.usage,
      pt: nowTranslations.pt.meta.usage,
    },
    parsing: nowParsing,
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: nowTranslations,
  parse: input => ({
    ok: true,
    args: parseNowArgs(input),
  }),
  execute: (args, context) => {
    const t = nowTranslations[context.lang];

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

    const content = resolveNarrativeContent(context.content.narrative).now;

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
