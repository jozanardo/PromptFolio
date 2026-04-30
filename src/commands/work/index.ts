import type { CommandDefinition } from '../../types';
import {
  createCatalog,
  createEnrichmentBlocks,
  createLanguageRecords,
  createProjectFilters,
  createProjectRecords,
  filterProjectCatalog,
  parseWorkFilters,
  workParsing,
} from './shared';
import { workTranslations } from './translations';

export const workCommand: CommandDefinition<
  ReturnType<typeof parseWorkFilters>,
  typeof workTranslations
> = {
  meta: {
    name: 'work',
    category: 'work',
    description: {
      en: workTranslations.en.meta.description,
      pt: workTranslations.pt.meta.description,
    },
    usage: {
      en: workTranslations.en.meta.usage,
      pt: workTranslations.pt.meta.usage,
    },
    parsing: workParsing,
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: workTranslations,
  parse: input => ({
    ok: true,
    args: parseWorkFilters(input),
  }),
  execute: (args, context) => {
    const t = workTranslations[context.lang];
    const catalog = createCatalog(context);

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

    if (args.showLangs) {
      return {
        blocks: [
          {
            type: 'recordList',
            title: t.availableLanguagesTitle,
            records: createLanguageRecords(catalog, t),
          },
        ],
      };
    }

    const projects = filterProjectCatalog(
      catalog,
      createProjectFilters(args, context.lang, {
        featuredOnly: true,
      })
    );

    const records = createProjectRecords(
      projects,
      context.lang,
      t.statusLabels,
      'summary'
    );

    return {
      blocks: [
        ...createEnrichmentBlocks(context, t),
        {
          type: 'text',
          text: t.intro,
        },
        records.length > 0
          ? {
              type: 'recordList',
              title: t.title,
              records,
            }
          : {
              type: 'text',
              text: t.empty,
            },
      ],
    };
  },
};
