import type { CommandDefinition } from '../../types';
import { startTranslations } from './translations';

type StartArgs = Record<string, never>;

export const startCommand: CommandDefinition<
  StartArgs,
  typeof startTranslations
> = {
  meta: {
    name: 'start',
    category: 'discovery',
    description: {
      en: startTranslations.en.meta.description,
      pt: startTranslations.pt.meta.description,
    },
    usage: {
      en: startTranslations.en.meta.usage,
      pt: startTranslations.pt.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: startTranslations,
  parse: () => ({
    ok: true,
    args: {},
  }),
  execute: (_, context) => {
    const t = startTranslations[context.lang];

    return {
      blocks: [
        {
          type: 'text',
          text: t.intro,
        },
        {
          type: 'recordList',
          title: t.title,
          records: [
            {
              title: 'projects',
              subtitle: t.entries.projects,
            },
            {
              title: 'whoami',
              subtitle: t.entries.whoami,
            },
            {
              title: 'ls',
              subtitle: t.entries.ls,
            },
            {
              title: 'help',
              subtitle: t.entries.help,
            },
          ],
        },
        {
          type: 'text',
          text: t.outro,
        },
      ],
    };
  },
};
