import type { CommandDefinition, RecordListEntry } from '../../types';
import { searchRecords, searchRecordKinds } from '../../search';
import type {
  SearchQuery,
  SearchRecordKind,
  SearchResult,
} from '../../search';
import { searchTranslations } from './translations';

const searchParsing = {
  booleanFlags: ['help'],
  valueFlags: ['type', 'limit'],
} as const;

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

function parseLimit(value: string | boolean | undefined): number | null {
  if (value === undefined) {
    return 6;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 10
    ? parsed
    : null;
}

function parseType(
  value: string | boolean | undefined
): SearchRecordKind | null | 'invalid' | 'missing' {
  if (value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return 'missing';
  }

  return searchRecordKinds.includes(value as SearchRecordKind)
    ? (value as SearchRecordKind)
    : 'invalid';
}

function createResultRecord(
  result: SearchResult,
  kindLabel: string
): RecordListEntry {
  return {
    title: result.title,
    meta: result.meta ? `${kindLabel} · ${result.meta}` : kindLabel,
    subtitle: result.subtitle,
    href: result.href,
    lines: [
      `> ${result.command}`,
      ...result.matchedTerms.map(term => `#${term}`),
    ],
  };
}

export const searchCommand: CommandDefinition<
  SearchQuery,
  typeof searchTranslations
> = {
  meta: {
    name: 'search',
    category: 'discovery',
    description: {
      en: searchTranslations.en.meta.description,
      pt: searchTranslations.pt.meta.description,
    },
    usage: {
      en: searchTranslations.en.meta.usage,
      pt: searchTranslations.pt.meta.usage,
    },
    parsing: searchParsing,
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: searchTranslations,
  parse: (input, context) => {
    const t = searchTranslations[context.lang];

    if (input.flags.help === true) {
      return {
        ok: true,
        args: {
          text: '',
          type: null,
          limit: 6,
        },
      };
    }

    const text = input.positionals.join(' ').trim();

    if (!text) {
      return {
        ok: false,
        message: t.missingQuery,
      };
    }

    const type = parseType(input.flags.type);

    if (type === 'missing') {
      return {
        ok: false,
        message: t.missingTypeValue,
      };
    }

    if (type === 'invalid') {
      return {
        ok: false,
        message: fill(t.invalidType, { type: String(input.flags.type) }),
      };
    }

    const limit = parseLimit(input.flags.limit);

    if (limit === null) {
      return {
        ok: false,
        message: t.invalidLimit,
      };
    }

    return {
      ok: true,
      args: {
        text,
        type,
        limit,
      },
    };
  },
  execute: (args, context, input) => {
    const t = searchTranslations[context.lang];

    if (input.flags.help === true) {
      return {
        blocks: [
          {
            type: 'text',
            text: t.helpUsage,
          },
        ],
      };
    }

    const results = searchRecords(context.searchIndex.records, args);

    if (results.length === 0) {
      return {
        blocks: [
          {
            type: 'text',
            text: fill(t.empty, { query: args.text }),
          },
        ],
      };
    }

    return {
      blocks: [
        {
          type: 'text',
          text: fill(t.intro, { query: args.text }),
        },
        {
          type: 'recordList',
          title: t.title,
          records: results.map(result =>
            createResultRecord(result, t.kindLabels[result.kind])
          ),
        },
      ],
    };
  },
};
