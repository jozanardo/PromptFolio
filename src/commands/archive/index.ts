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
} from '../work/shared';
import { archiveTranslations } from './translations';

export const archiveCommand: CommandDefinition<
  ReturnType<typeof parseWorkFilters>,
  typeof archiveTranslations
> = {
  meta: {
    name: 'archive',
    category: 'work',
    description: {
      en: archiveTranslations.en.meta.description,
      pt: archiveTranslations.pt.meta.description,
    },
    usage: {
      en: archiveTranslations.en.meta.usage,
      pt: archiveTranslations.pt.meta.usage,
    },
    parsing: workParsing,
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: archiveTranslations,
  parse: input => ({
    ok: true,
    args: parseWorkFilters(input),
  }),
  execute: (args, context) => {
    const t = archiveTranslations[context.lang];

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

    if (args.showLangs) {
      return {
        blocks: [
          ...createEnrichmentBlocks(context, t),
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
      createProjectFilters(args, context.lang)
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
