import {
  profileContent,
  localizeRecords,
  type ProfileContent,
} from '../../content/profile';
import type { CommandDefinition } from '../../types';
import { aboutTranslations } from './translations';

type AboutArgs = Record<string, never>;

function resolveProfile(profile: ProfileContent | null): ProfileContent {
  return profile ?? profileContent;
}

export const aboutCommand: CommandDefinition<
  AboutArgs,
  typeof aboutTranslations
> = {
  meta: {
    name: 'about',
    category: 'identity',
    description: {
      en: aboutTranslations.en.meta.description,
      pt: aboutTranslations.pt.meta.description,
    },
    usage: {
      en: aboutTranslations.en.meta.usage,
      pt: aboutTranslations.pt.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: aboutTranslations,
  parse: () => ({
    ok: true,
    args: {},
  }),
  execute: (_, context) => {
    const profile = resolveProfile(context.content.profile);

    return {
      blocks: [
        {
          type: 'text',
          text: profile.about.intro[context.lang],
        },
        {
          type: 'recordList',
          title: profile.about.title[context.lang],
          records: localizeRecords(profile.about.records, context.lang),
        },
      ],
    };
  },
};
