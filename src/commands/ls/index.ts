import type { CommandDefinition, RecordListEntry } from '../../types';
import { lsTranslations } from './translations';

type LsArgs = Record<string, never>;

const CATEGORY_ORDER = ['discovery', 'identity', 'work'] as const;

export const lsCommand: CommandDefinition<LsArgs, typeof lsTranslations> = {
  meta: {
    name: 'ls',
    category: 'discovery',
    description: {
      en: lsTranslations.en.meta.description,
      pt: lsTranslations.pt.meta.description,
    },
    usage: {
      en: lsTranslations.en.meta.usage,
      pt: lsTranslations.pt.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: lsTranslations,
  parse: () => ({
    ok: true,
    args: {},
  }),
  execute: (_, context) => {
    const t = lsTranslations[context.lang];
    const commands = context.registry.list('ls');

    const records = CATEGORY_ORDER.reduce<RecordListEntry[]>(
      (entries, category) => {
        const commandNames = commands
          .filter(command => command.meta.category === category)
          .map(command => command.meta.name);

        if (commandNames.length > 0) {
          entries.push({
            title: t.categories[category],
            lines: commandNames,
          });
        }

        return entries;
      },
      []
    );

    return {
      blocks: [
        {
          type: 'recordList',
          title: t.title,
          records,
        },
      ],
    };
  },
};
