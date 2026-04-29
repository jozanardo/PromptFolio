import {
  localizeRecords,
  resolveProfileContent,
} from '../../content/profile';
import type { CommandDefinition } from '../../types';
import { contactTranslations } from './translations';

type ContactArgs = Record<string, never>;

export const contactCommand: CommandDefinition<
  ContactArgs,
  typeof contactTranslations
> = {
  meta: {
    name: 'contact',
    category: 'identity',
    description: {
      en: contactTranslations.en.meta.description,
      pt: contactTranslations.pt.meta.description,
    },
    usage: {
      en: contactTranslations.en.meta.usage,
      pt: contactTranslations.pt.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: contactTranslations,
  parse: () => ({
    ok: true,
    args: {},
  }),
  execute: (_, context) => {
    const profile = resolveProfileContent(context.content.profile);

    return {
      blocks: [
        {
          type: 'recordList',
          title: profile.contact.title[context.lang],
          records: localizeRecords(profile.contact.channels, context.lang),
        },
        {
          type: 'text',
          text: profile.contact.note[context.lang],
        },
      ],
    };
  },
};
