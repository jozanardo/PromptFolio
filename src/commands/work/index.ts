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

    const catalog = createCatalog(context);
    const projectFilters = createProjectFilters(args, context.lang, {
      featuredOnly: true,
    });

    if (args.showLangs) {
      const projects = filterProjectCatalog(catalog, projectFilters);

      return {
        blocks: [
          ...createEnrichmentBlocks(context, t),
          {
            type: 'recordList',
            title: t.availableLanguagesTitle,
            records: createLanguageRecords(projects, t),
          },
        ],
      };
    }

    const projects = filterProjectCatalog(catalog, projectFilters);

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
