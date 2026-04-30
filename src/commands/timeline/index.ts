import type {
  CommandDefinition,
  ParsedCommandInput,
  RecordListEntry,
  SupportedLocale,
} from '../../types';
import {
  resolveTimelineContent,
  type TimelineEntry,
} from '../../content/timeline';
import { timelineTranslations } from './translations';

type TimelineGroup = 'year' | 'cycle' | 'kind';
const KIND_ORDER = ['career', 'project', 'study'] as const;

interface TimelineArgs {
  group: TimelineGroup | null;
  showHelp: boolean;
}

const timelineParsing = {
  booleanFlags: ['help'],
  valueFlags: ['group'],
} as const;

function parseTimelineArgs(input: ParsedCommandInput): TimelineArgs {
  const group = input.flags.group;

  return {
    group:
      group === 'year' || group === 'cycle' || group === 'kind' ? group : null,
    showHelp: input.flags.help === true,
  };
}

function sortTimelineEntries(entries: readonly TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort(
    (left, right) =>
      (right.endYear ?? right.startYear) - (left.endYear ?? left.startYear) ||
      right.startYear - left.startYear ||
      (right.endYear ?? 0) - (left.endYear ?? 0) ||
      left.order - right.order
  );
}

function createTimelineRecord(
  entry: TimelineEntry,
  locale: SupportedLocale
): RecordListEntry {
  return {
    title: entry.period[locale],
    meta: entry.title[locale],
    subtitle: entry.summary[locale],
    lines: [
      ...entry.relatedProjects,
      ...entry.tags.map(tag => `#${tag}`),
    ],
  };
}

function createGroupedRecords(
  entries: readonly TimelineEntry[],
  group: TimelineGroup,
  locale: SupportedLocale,
  kindLabels: Record<string, string>
): RecordListEntry[] {
  const grouped = new Map<string, { lines: string[]; order: number }>();

  for (const entry of entries) {
    const key =
      group === 'year'
        ? String(entry.groupYear ?? entry.startYear)
        : group === 'cycle'
          ? entry.cycleLabel[locale]
          : kindLabels[entry.kind];
    const value = group === 'year' ? entry.title[locale] : entry.period[locale];
    const order =
      group === 'year'
        ? -(entry.groupYear ?? entry.startYear)
        : group === 'kind'
          ? KIND_ORDER.indexOf(entry.kind)
          : entry.order;
    const existing = grouped.get(key);

    grouped.set(key, {
      order: existing ? Math.min(existing.order, order) : order,
      lines: [...(existing?.lines ?? []), value],
    });
  }

  return [...grouped]
    .sort(([, left], [, right]) => left.order - right.order)
    .map(([title, groupRecord]) => ({
      title,
      lines: groupRecord.lines,
    }));
}

export const timelineCommand: CommandDefinition<
  TimelineArgs,
  typeof timelineTranslations
> = {
  meta: {
    name: 'timeline',
    category: 'journey',
    description: {
      en: timelineTranslations.en.meta.description,
      pt: timelineTranslations.pt.meta.description,
    },
    usage: {
      en: timelineTranslations.en.meta.usage,
      pt: timelineTranslations.pt.meta.usage,
    },
    parsing: timelineParsing,
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: timelineTranslations,
  parse: input => ({
    ok: true,
    args: parseTimelineArgs(input),
  }),
  execute: (args, context) => {
    const t = timelineTranslations[context.lang];

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

    const entries = sortTimelineEntries(
      resolveTimelineContent(context.content.timeline).entries
    );

    return {
      blocks: [
        {
          type: 'text',
          text: t.intro,
        },
        args.group
          ? {
              type: 'recordList',
              title: t.groupTitles[args.group],
              records: createGroupedRecords(
                entries,
                args.group,
                context.lang,
                t.kindLabels
              ),
            }
          : {
              type: 'recordList',
              title: t.title,
              records: entries.map(entry =>
                createTimelineRecord(entry, context.lang)
              ),
            },
      ],
    };
  },
};
