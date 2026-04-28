import {
  profileContent,
  localizeRecords,
  type ProfileContent,
} from '../../content/profile';
import type { CommandDefinition } from '../../types';
import { whoamiTranslations } from './translations';

type WhoamiArgs = Record<string, never>;

function resolveProfile(profile: ProfileContent | null): ProfileContent {
  return profile ?? profileContent;
}

export const whoamiCommand: CommandDefinition<
  WhoamiArgs,
  typeof whoamiTranslations
> = {
  meta: {
    name: 'whoami',
    category: 'identity',
    description: {
      en: whoamiTranslations.en.meta.description,
      pt: whoamiTranslations.pt.meta.description,
    },
    usage: {
      en: whoamiTranslations.en.meta.usage,
      pt: whoamiTranslations.pt.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: whoamiTranslations,
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
          text: profile.whoami.intro[context.lang],
        },
        {
          type: 'recordList',
          title: profile.whoami.title[context.lang],
          records: localizeRecords(profile.whoami.records, context.lang),
        },
      ],
    };
  },
};
