import {
  localizeRecords,
  resolveProfileContent,
} from '../../content/profile';
import type { CommandDefinition } from '../../types';
import { skillsTranslations } from './translations';

type SkillsArgs = Record<string, never>;

export const skillsCommand: CommandDefinition<
  SkillsArgs,
  typeof skillsTranslations
> = {
  meta: {
    name: 'skills',
    category: 'identity',
    description: {
      en: skillsTranslations.en.meta.description,
      pt: skillsTranslations.pt.meta.description,
    },
    usage: {
      en: skillsTranslations.en.meta.usage,
      pt: skillsTranslations.pt.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: skillsTranslations,
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
          title: profile.skills.title[context.lang],
          records: localizeRecords(profile.skills.categories, context.lang),
        },
      ],
    };
  },
};
