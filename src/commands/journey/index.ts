import type { CommandDefinition, ParsedCommandInput } from '../../types';
import { resolveTimelineContent } from '../../content/timeline';
import { journeyTranslations } from './translations';

interface JourneyArgs {
  showHelp: boolean;
}

const journeyParsing = {
  booleanFlags: ['help'],
} as const;

function parseJourneyArgs(input: ParsedCommandInput): JourneyArgs {
  return {
    showHelp: input.flags.help === true,
  };
}

export const journeyCommand: CommandDefinition<
  JourneyArgs,
  typeof journeyTranslations
> = {
  meta: {
    name: 'journey',
    category: 'journey',
    description: {
      en: journeyTranslations.en.meta.description,
      pt: journeyTranslations.pt.meta.description,
    },
    usage: {
      en: journeyTranslations.en.meta.usage,
      pt: journeyTranslations.pt.meta.usage,
    },
    parsing: journeyParsing,
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: journeyTranslations,
  parse: input => ({
    ok: true,
    args: parseJourneyArgs(input),
  }),
  execute: (args, context) => {
    const t = journeyTranslations[context.lang];

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

    const content = resolveTimelineContent(context.content.timeline);
    const sections = [...content.journey].sort(
      (left, right) => left.order - right.order
    );

    return {
      blocks: [
        {
          type: 'text',
          text: t.intro,
        },
        {
          type: 'recordList',
          title: t.title,
          records: sections.map(section => ({
            title: section.title[context.lang],
            subtitle: section.summary[context.lang],
            lines: section.references,
          })),
        },
      ],
    };
  },
};
