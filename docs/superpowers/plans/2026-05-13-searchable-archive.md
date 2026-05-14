# Searchable Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Phase 6 searchable archive: a local, bilingual `search` command that discovers commands, projects, timeline entries, narrative records, profile content, and final onboarding polish.

**Architecture:** Build a deterministic, locale-aware search index from existing local content and command metadata, then pass that index through `CommandContext.searchIndex`. The `search` command filters and scores records in memory, returning existing `recordList` blocks so search results use the same quiet structural language as `help`, `ls`, `work`, and `timeline`.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, existing command runtime, existing `recordList` renderer, no new runtime dependency.

---

## Chosen Approach

Use a small local weighted index implemented in `src/search`.

Alternatives considered:

- Add a fuzzy-search dependency such as Fuse.js. This would be fast to wire, but the project does not need another dependency for a small authored archive.
- Let each command search itself. This would reuse local filters, but it would fragment ranking, localization, and empty-state behavior.
- Recommended: build one deterministic local index with source-specific adapters. This keeps search predictable, testable, offline, and aligned with the command archive metaphor.

## File Structure

- Create `src/search/types.ts`: shared search record, query, kind, and result types.
- Create `src/search/normalize.ts`: locale-neutral normalization, tokenization, and query helpers.
- Create `src/search/buildSearchIndex.ts`: source adapters for command metadata, projects, profile, timeline, journey, and narrative content.
- Create `src/search/searchRecords.ts`: scoring, kind filtering, result limiting, and matched-term extraction.
- Create `src/search/index.ts`: public exports.
- Create `src/search/index.test.ts`: unit tests for indexing and scoring.
- Create `src/commands/search/translations.ts`: localized command copy, labels, help, and errors.
- Create `src/commands/search/index.ts`: parser and executor for `search`.
- Create `src/commands/search/index.test.ts`: command-level behavior tests.
- Modify `src/types/terminal.ts`: type `CommandContext.searchIndex.records` as `SearchRecord[]`.
- Modify `src/hooks/useCommandProcessor.ts`: build and memoize the search index for the active language/context.
- Modify `src/commands/index.ts`: register `searchCommand`.
- Modify `src/commands/start/index.ts` and `src/commands/start/translations.ts`: expose `search` as a first-class discovery command.
- Modify `src/i18n/index.ts`: make onboarding quick-start and prompt hint reflect the final searchable CLI.
- Modify tests that assert command lists or quick-start copy.

## Task 1: Search Contracts and Normalization

**Files:**
- Create: `src/search/types.ts`
- Create: `src/search/normalize.ts`
- Create: `src/search/index.ts`
- Test: `src/search/index.test.ts`

- [ ] **Step 1: Write failing normalization tests**

Add these tests to `src/search/index.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { normalizeForSearch, tokenizeSearchQuery } from './normalize';

describe('search normalization', () => {
  it('normalizes case, accents, and extra spacing', () => {
    expect(normalizeForSearch('  Resiliência de BACKEND  ')).toBe(
      'resiliencia de backend'
    );
  });

  it('tokenizes a query into unique normalized terms', () => {
    expect(tokenizeSearchQuery('backend backend IA')).toEqual([
      'backend',
      'ia',
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/search/index.test.ts
```

Expected: FAIL because `src/search/normalize.ts` does not exist.

- [ ] **Step 3: Add search types**

Create `src/search/types.ts`:

```ts
import type { SupportedLocale } from '../types';

export type SearchRecordKind =
  | 'command'
  | 'project'
  | 'timeline'
  | 'journey'
  | 'profile'
  | 'narrative'
  | 'contact';

export interface SearchRecord {
  id: string;
  kind: SearchRecordKind;
  locale: SupportedLocale;
  title: string;
  subtitle: string;
  command: string;
  meta?: string;
  href?: string;
  keywords: string[];
  body: string[];
  weight: number;
}

export interface SearchQuery {
  text: string;
  type: SearchRecordKind | null;
  limit: number;
}

export interface SearchResult extends SearchRecord {
  score: number;
  matchedTerms: string[];
}

export const searchRecordKinds: readonly SearchRecordKind[] = [
  'command',
  'project',
  'timeline',
  'journey',
  'profile',
  'narrative',
  'contact',
];
```

- [ ] **Step 4: Add normalization helpers**

Create `src/search/normalize.ts`:

```ts
export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function tokenizeSearchQuery(query: string): string[] {
  const seen = new Set<string>();

  return normalizeForSearch(query)
    .split(' ')
    .filter(Boolean)
    .filter(term => {
      if (seen.has(term)) {
        return false;
      }

      seen.add(term);
      return true;
    });
}
```

- [ ] **Step 5: Add public exports**

Create `src/search/index.ts`:

```ts
export * from './buildSearchIndex';
export * from './normalize';
export * from './searchRecords';
export * from './types';
```

Leave `buildSearchIndex` and `searchRecords` missing for now; Task 2 and Task 3 will add them.

- [ ] **Step 6: Run normalization tests**

Run:

```bash
npm test -- src/search/index.test.ts
```

Expected: PASS for normalization tests once missing exports are resolved by later tasks, or fail only on missing modules if the barrel export is imported by the test runner. If the barrel export causes an early module error, create empty stub files:

```ts
// src/search/buildSearchIndex.ts
export {};
```

```ts
// src/search/searchRecords.ts
export {};
```

- [ ] **Step 7: Commit**

```bash
git add src/search
git commit -m "feat: add search normalization contracts"
```

## Task 2: Local Search Index Builder

**Files:**
- Modify: `src/search/buildSearchIndex.ts`
- Modify: `src/search/index.test.ts`

- [ ] **Step 1: Write failing index tests**

Extend `src/search/index.test.ts`:

```ts
import { commandRegistry } from '../commands';
import { narrativeContent } from '../content/narrative';
import { profileContent } from '../content/profile';
import { projectContent } from '../content/projects';
import { timelineContent } from '../content/timeline';
import { buildSearchIndex } from './buildSearchIndex';

describe('buildSearchIndex', () => {
  it('indexes command metadata for the active locale', () => {
    const records = buildSearchIndex({
      lang: 'en',
      registry: commandRegistry,
      content: {
        profile: profileContent,
        projects: projectContent,
        narrative: narrativeContent,
        timeline: timelineContent,
      },
      projectCatalog: {
        repos: [],
        loading: false,
        error: null,
      },
    });

    expect(records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'command:work',
          kind: 'command',
          title: 'work',
          command: 'work',
        }),
      ])
    );
  });

  it('indexes localized project, timeline, narrative, and profile content', () => {
    const records = buildSearchIndex({
      lang: 'pt',
      registry: commandRegistry,
      content: {
        profile: profileContent,
        projects: projectContent,
        narrative: narrativeContent,
        timeline: timelineContent,
      },
      projectCatalog: {
        repos: [],
        loading: false,
        error: null,
      },
    });

    expect(records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'project:promptfolio',
          kind: 'project',
          title: 'promptfolio',
          subtitle:
            'Portfólio guiado por comandos, moldado como um arquivo pessoal calmo.',
          command: 'work --name promptfolio',
        }),
        expect.objectContaining({
          id: 'timeline:mercado-livre',
          kind: 'timeline',
          command: 'timeline',
        }),
        expect.objectContaining({
          id: 'narrative:now:backend',
          kind: 'narrative',
          command: 'now',
        }),
        expect.objectContaining({
          id: 'profile:skills:backend',
          kind: 'profile',
          command: 'skills',
        }),
      ])
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/search/index.test.ts
```

Expected: FAIL because `buildSearchIndex` is not implemented.

- [ ] **Step 3: Implement source adapters**

Replace `src/search/buildSearchIndex.ts` with:

```ts
import { resolveNarrativeContent } from '../content/narrative';
import { resolveProfileContent } from '../content/profile';
import { resolveProjectContent } from '../content/projects';
import { resolveTimelineContent } from '../content/timeline';
import { buildProjectCatalog } from '../services/projectCatalog';
import type { CommandContext, CommandRegistryLike, SupportedLocale } from '../types';
import type { SearchRecord } from './types';

type SearchContent = CommandContext['content'];
type SearchProjectCatalog = CommandContext['projectCatalog'];

export interface BuildSearchIndexInput {
  lang: SupportedLocale;
  registry: CommandRegistryLike;
  content: SearchContent;
  projectCatalog: SearchProjectCatalog;
}

function joinMeta(parts: Array<string | number | null | undefined>): string | undefined {
  const meta = parts.filter(Boolean).join(' · ');
  return meta || undefined;
}

export function buildSearchIndex({
  lang,
  registry,
  content,
  projectCatalog,
}: BuildSearchIndexInput): SearchRecord[] {
  const records: SearchRecord[] = [];
  const profile = resolveProfileContent(content.profile);
  const projects = buildProjectCatalog(
    resolveProjectContent(content.projects),
    projectCatalog.repos
  );
  const timeline = resolveTimelineContent(content.timeline);
  const narrative = resolveNarrativeContent(content.narrative);

  registry.list('search').forEach(definition => {
    records.push({
      id: `command:${definition.meta.name}`,
      kind: 'command',
      locale: lang,
      title: definition.meta.name,
      subtitle: definition.meta.description[lang],
      command: definition.meta.name,
      meta: definition.meta.category,
      keywords: [
        definition.meta.name,
        definition.meta.category,
        definition.meta.usage[lang],
      ],
      body: [definition.meta.description[lang], definition.meta.usage[lang]],
      weight: 8,
    });
  });

  projects.forEach(project => {
    records.push({
      id: `project:${project.slug}`,
      kind: 'project',
      locale: lang,
      title: project.slug,
      subtitle: project.summary[lang],
      command: project.featured
        ? `work --name ${project.slug}`
        : `archive --name ${project.slug}`,
      meta: joinMeta([project.language, project.year, project.status]),
      href: project.url,
      keywords: [
        project.slug,
        project.repoName,
        project.language ?? '',
        project.status,
        ...project.tags,
      ],
      body: [
        project.summary[lang],
        project.impact[lang],
        project.remoteDescription ?? '',
      ],
      weight: project.featured ? 7 : 5,
    });
  });

  timeline.entries.forEach(entry => {
    records.push({
      id: `timeline:${entry.id}`,
      kind: 'timeline',
      locale: lang,
      title: entry.title[lang],
      subtitle: entry.summary[lang],
      command: 'timeline',
      meta: joinMeta([entry.period[lang], entry.kind]),
      keywords: [
        entry.id,
        entry.kind,
        entry.cycle,
        entry.cycleLabel[lang],
        ...entry.relatedProjects,
        ...entry.tags,
      ],
      body: [entry.title[lang], entry.summary[lang], entry.period[lang]],
      weight: 6,
    });
  });

  timeline.journey.forEach(section => {
    records.push({
      id: `journey:${section.id}`,
      kind: 'journey',
      locale: lang,
      title: section.title[lang],
      subtitle: section.summary[lang],
      command: 'journey',
      meta: 'journey',
      keywords: [section.id, ...section.references],
      body: [section.title[lang], section.summary[lang]],
      weight: 6,
    });
  });

  profile.whoami.records.forEach(record => {
    records.push({
      id: `profile:whoami:${record.title.en}`,
      kind: 'profile',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'whoami',
      meta: 'whoami',
      keywords: [record.title.en, record.title.pt],
      body: [profile.whoami.intro[lang], record.subtitle[lang]],
      weight: 5,
    });
  });

  profile.about.records.forEach(record => {
    records.push({
      id: `profile:about:${record.title.en}`,
      kind: 'profile',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'about',
      meta: record.meta?.[lang] ?? 'about',
      keywords: [record.title.en, record.title.pt],
      body: [profile.about.intro[lang], record.subtitle[lang]],
      weight: 5,
    });
  });

  profile.skills.categories.forEach(record => {
    records.push({
      id: `profile:skills:${record.title.en}`,
      kind: 'profile',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'skills',
      meta: 'skills',
      keywords: [record.title.en, record.title.pt],
      body: [record.subtitle[lang]],
      weight: 5,
    });
  });

  profile.contact.channels.forEach(record => {
    records.push({
      id: `contact:${record.title.en}`,
      kind: 'contact',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'contact',
      meta: 'contact',
      href: record.href,
      keywords: [record.title.en, record.title.pt],
      body: [record.subtitle[lang], profile.contact.note[lang]],
      weight: 4,
    });
  });

  narrative.now.records.forEach(record => {
    records.push({
      id: `narrative:now:${record.title.en}`,
      kind: 'narrative',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'now',
      meta: 'now',
      keywords: [record.title.en, record.title.pt],
      body: [narrative.now.intro[lang], record.subtitle[lang]],
      weight: 5,
    });
  });

  narrative.philosophy.records.forEach(record => {
    records.push({
      id: `narrative:philosophy:${record.title.en}`,
      kind: 'narrative',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'philosophy',
      meta: 'philosophy',
      keywords: [record.title.en, record.title.pt],
      body: [narrative.philosophy.intro[lang], record.subtitle[lang]],
      weight: 5,
    });
  });

  return records;
}
```

- [ ] **Step 4: Run index tests**

Run:

```bash
npm test -- src/search/index.test.ts
```

Expected: PASS for normalization and index tests.

- [ ] **Step 5: Commit**

```bash
git add src/search
git commit -m "feat: build local search index"
```

## Task 3: Search Scoring

**Files:**
- Modify: `src/search/searchRecords.ts`
- Modify: `src/search/index.test.ts`

- [ ] **Step 1: Write failing scoring tests**

Extend `src/search/index.test.ts`:

```ts
import { searchRecords } from './searchRecords';

describe('searchRecords', () => {
  it('scores exact title and keyword matches above body matches', () => {
    const records = buildSearchIndex({
      lang: 'en',
      registry: commandRegistry,
      content: {
        profile: profileContent,
        projects: projectContent,
        narrative: narrativeContent,
        timeline: timelineContent,
      },
      projectCatalog: {
        repos: [],
        loading: false,
        error: null,
      },
    });

    const results = searchRecords(records, {
      text: 'promptfolio',
      type: null,
      limit: 5,
    });

    expect(results[0]).toMatchObject({
      kind: 'project',
      title: 'promptfolio',
      matchedTerms: ['promptfolio'],
    });
  });

  it('filters by result kind and limit', () => {
    const records = buildSearchIndex({
      lang: 'en',
      registry: commandRegistry,
      content: {
        profile: profileContent,
        projects: projectContent,
        narrative: narrativeContent,
        timeline: timelineContent,
      },
      projectCatalog: {
        repos: [],
        loading: false,
        error: null,
      },
    });

    const results = searchRecords(records, {
      text: 'backend',
      type: 'profile',
      limit: 1,
    });

    expect(results).toHaveLength(1);
    expect(results[0].kind).toBe('profile');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/search/index.test.ts
```

Expected: FAIL because `searchRecords` is not implemented.

- [ ] **Step 3: Implement scoring**

Replace `src/search/searchRecords.ts` with:

```ts
import { normalizeForSearch, tokenizeSearchQuery } from './normalize';
import type { SearchQuery, SearchRecord, SearchResult } from './types';

function fieldIncludes(values: readonly string[], term: string): boolean {
  return values.some(value => normalizeForSearch(value).includes(term));
}

function scoreRecord(record: SearchRecord, terms: readonly string[]): SearchResult | null {
  let score = 0;
  const matchedTerms: string[] = [];

  terms.forEach(term => {
    let termScore = 0;

    if (normalizeForSearch(record.title) === term) {
      termScore += 20;
    } else if (normalizeForSearch(record.title).includes(term)) {
      termScore += 12;
    }

    if (fieldIncludes(record.keywords, term)) {
      termScore += 10;
    }

    if (fieldIncludes([record.subtitle, record.meta ?? '', ...record.body], term)) {
      termScore += 4;
    }

    if (termScore > 0) {
      matchedTerms.push(term);
      score += termScore;
    }
  });

  if (matchedTerms.length === 0) {
    return null;
  }

  return {
    ...record,
    score: score + record.weight,
    matchedTerms,
  };
}

export function searchRecords(
  records: readonly SearchRecord[],
  query: SearchQuery
): SearchResult[] {
  const terms = tokenizeSearchQuery(query.text);

  if (terms.length === 0) {
    return [];
  }

  return records
    .filter(record => !query.type || record.kind === query.type)
    .map(record => scoreRecord(record, terms))
    .filter((result): result is SearchResult => result !== null)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.title.localeCompare(right.title);
    })
    .slice(0, query.limit);
}
```

- [ ] **Step 4: Run search tests**

Run:

```bash
npm test -- src/search/index.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/search
git commit -m "feat: score local archive search"
```

## Task 4: Search Command

**Files:**
- Create: `src/commands/search/translations.ts`
- Create: `src/commands/search/index.ts`
- Create: `src/commands/search/index.test.ts`
- Modify: `src/commands/index.ts`
- Modify: `src/types/terminal.ts`

- [ ] **Step 1: Write failing command tests**

Create `src/commands/search/index.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { commandRegistry } from '..';
import { buildSearchIndex } from '../../search';
import type { CommandContext } from '../../types';

function createContext(lang: 'en' | 'pt' = 'en'): CommandContext {
  const baseContext: CommandContext = {
    lang,
    registry: commandRegistry,
    history: [],
    setHistory: vi.fn() as unknown as CommandContext['setHistory'],
    shellMessages: {
      notFoundMessage:
        lang === 'en'
          ? "Command not found. Type 'help' to view a list of available commands."
          : "Comando não encontrado. Digite 'help' para ver a lista de comandos.",
    },
    content: {
      profile: null,
      projects: null,
      narrative: null,
      timeline: null,
    },
    projectCatalog: {
      repos: [],
      loading: false,
      error: null,
    },
    searchIndex: {
      ready: false,
      records: [],
    },
    services: {},
  };

  return {
    ...baseContext,
    searchIndex: {
      ready: true,
      records: buildSearchIndex({
        lang,
        registry: commandRegistry,
        content: baseContext.content,
        projectCatalog: baseContext.projectCatalog,
      }),
    },
  };
}

describe('search command', () => {
  it('returns localized project results', async () => {
    const { executeCommand } = await import('../runtime/executeCommand');
    const result = await executeCommand('search "arquivo pessoal"', createContext('pt'));

    expect(result.result.blocks).toMatchObject([
      {
        type: 'text',
      },
      {
        type: 'recordList',
        records: [
          {
            title: 'promptfolio',
            meta: expect.stringContaining('projeto'),
          },
        ],
      },
    ]);
    expect(result.result.blocks[1]).toMatchObject({
      records: [
        expect.objectContaining({
          lines: expect.arrayContaining(['> work --name promptfolio']),
        }),
      ],
    });
  });

  it('searches narrative content', async () => {
    const { executeCommand } = await import('../runtime/executeCommand');
    const result = await executeCommand('search ownership', createContext('en'));

    expect(result.result.blocks[1]).toMatchObject({
      type: 'recordList',
      records: expect.arrayContaining([
        expect.objectContaining({
          title: 'AI ownership',
          lines: expect.arrayContaining(['> philosophy']),
        }),
      ]),
    });
  });

  it('supports type and limit filters', async () => {
    const { executeCommand } = await import('../runtime/executeCommand');
    const result = await executeCommand(
      'search backend --type=profile --limit=1',
      createContext('en')
    );

    expect(result.result.blocks[1]).toMatchObject({
      type: 'recordList',
      records: [expect.objectContaining({ meta: expect.stringContaining('profile') })],
    });
  });

  it('returns localized empty state', async () => {
    const { executeCommand } = await import('../runtime/executeCommand');
    const result = await executeCommand('search xxyyzz', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'No archive results found for "xxyyzz". Try search backend, search promptfolio, or help.',
      },
    ]);
  });

  it('validates missing query and invalid filters', async () => {
    const { executeCommand } = await import('../runtime/executeCommand');

    await expect(executeCommand('search', createContext('en'))).resolves.toMatchObject({
      result: {
        blocks: [
          {
            type: 'error',
            command: 'search',
            message: 'Search needs a query. Try: search backend',
          },
        ],
      },
    });

    await expect(
      executeCommand('search backend --type=unknown', createContext('en'))
    ).resolves.toMatchObject({
      result: {
        blocks: [
          {
            type: 'error',
            command: 'search',
            message:
              'Unknown search type "unknown". Use command, project, timeline, journey, profile, narrative, or contact.',
          },
        ],
      },
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/commands/search/index.test.ts
```

Expected: FAIL because the command is not implemented or registered.

- [ ] **Step 3: Type the search index in `CommandContext`**

Modify `src/types/terminal.ts`:

```ts
import type { SearchRecord } from '../search/types';
```

Change:

```ts
searchIndex: {
  ready: boolean;
  records: unknown[];
};
```

to:

```ts
searchIndex: {
  ready: boolean;
  records: SearchRecord[];
};
```

- [ ] **Step 4: Add translations**

Create `src/commands/search/translations.ts`:

```ts
import { validateTranslations } from '../runtime/validateTranslations';

export const searchTranslations = validateTranslations('search', {
  en: {
    meta: {
      description: 'Search across commands, projects, timeline, and authored notes.',
      usage: 'search <query> [--type=<kind>] [--limit=<count>]',
    },
    helpUsage:
      'Usage: search <query> [--type=command|project|timeline|journey|profile|narrative|contact] [--limit=1-10]',
    missingQuery: 'Search needs a query. Try: search backend',
    invalidType:
      'Unknown search type "{type}". Use command, project, timeline, journey, profile, narrative, or contact.',
    invalidLimit: 'Search limit must be a number from 1 to 10.',
    title: 'Search results:',
    intro: 'Archive results for "{query}":',
    empty:
      'No archive results found for "{query}". Try search backend, search promptfolio, or help.',
    kindLabels: {
      command: 'command',
      project: 'project',
      timeline: 'timeline',
      journey: 'journey',
      profile: 'profile',
      narrative: 'narrative',
      contact: 'contact',
    },
  },
  pt: {
    meta: {
      description: 'Pesquisa comandos, projetos, trajetória e notas autorais.',
      usage: 'search <consulta> [--type=<tipo>] [--limit=<quantidade>]',
    },
    helpUsage:
      'Uso: search <consulta> [--type=command|project|timeline|journey|profile|narrative|contact] [--limit=1-10]',
    missingQuery: 'A busca precisa de uma consulta. Tente: search backend',
    invalidType:
      'Tipo de busca desconhecido "{type}". Use command, project, timeline, journey, profile, narrative ou contact.',
    invalidLimit: 'O limite da busca deve ser um número de 1 a 10.',
    title: 'Resultados da busca:',
    intro: 'Resultados do arquivo para "{query}":',
    empty:
      'Nenhum resultado encontrado no arquivo para "{query}". Tente search backend, search promptfolio ou help.',
    kindLabels: {
      command: 'comando',
      project: 'projeto',
      timeline: 'linha do tempo',
      journey: 'jornada',
      profile: 'perfil',
      narrative: 'narrativa',
      contact: 'contato',
    },
  },
});
```

- [ ] **Step 5: Implement `searchCommand`**

Create `src/commands/search/index.ts`:

```ts
import type { CommandDefinition, RecordListEntry } from '../../types';
import { searchRecords, searchRecordKinds } from '../../search';
import type { SearchQuery, SearchRecordKind, SearchResult } from '../../search';
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
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 10 ? parsed : null;
}

function parseType(value: string | boolean | undefined): SearchRecordKind | null | 'invalid' {
  if (value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return 'invalid';
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

export const searchCommand: CommandDefinition<SearchQuery, typeof searchTranslations> = {
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
```

- [ ] **Step 6: Register the command**

Modify `src/commands/index.ts`:

```ts
import { searchCommand } from './search';
```

Add `searchCommand` after `lsCommand` in `createCommandRegistry([...])`.

- [ ] **Step 7: Run command tests**

Run:

```bash
npm test -- src/commands/search/index.test.ts src/commands/runtime/executeCommand.test.ts
```

Expected: search tests PASS. Existing command-list assertions may fail because `search` is now registered; update them in Task 6.

- [ ] **Step 8: Commit**

```bash
git add src/types/terminal.ts src/commands/index.ts src/commands/search src/search
git commit -m "feat: add archive search command"
```

## Task 5: Build Search Index in Command Context

**Files:**
- Modify: `src/hooks/useCommandProcessor.ts`
- Modify: `src/hooks/useCommandProcessor.test.tsx`

- [ ] **Step 1: Write failing integration test**

Add a test to `src/hooks/useCommandProcessor.test.tsx` that submits `search backend` and expects localized results after a language switch. Follow the existing render/setup pattern in that file.

Core expectation:

```ts
expect(screen.getByText('Archive results for "backend":')).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /pt/i }));
expect(screen.getByText('Resultados do arquivo para "backend":')).toBeInTheDocument();
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/hooks/useCommandProcessor.test.tsx
```

Expected: FAIL because `useCommandProcessor` still passes an empty search index.

- [ ] **Step 3: Memoize search index**

Modify `src/hooks/useCommandProcessor.ts` imports:

```ts
import { useCallback, useMemo, useState, useEffect, useRef, RefObject } from 'react';
import { buildSearchIndex } from '../search';
```

After `const projects = useProjects();`, add:

```ts
const searchIndex = useMemo(
  () =>
    buildSearchIndex({
      lang,
      registry: commandRegistry,
      content: {
        profile: profileContent,
        projects: projectContent,
        narrative: narrativeContent,
        timeline: timelineContent,
      },
      projectCatalog: {
        repos: projects.repos,
        loading: projects.loading,
        error: projects.error,
      },
    }),
  [lang, projects.error, projects.loading, projects.repos]
);
```

Change `searchIndex` inside `createCommandContext` from:

```ts
searchIndex: {
  ready: false,
  records: [],
},
```

to:

```ts
searchIndex: {
  ready: true,
  records: searchIndex,
},
```

Add `searchIndex` to the dependency array of `createCommandContext`.

- [ ] **Step 4: Run integration tests**

Run:

```bash
npm test -- src/hooks/useCommandProcessor.test.tsx src/commands/search/index.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCommandProcessor.ts src/hooks/useCommandProcessor.test.tsx
git commit -m "feat: connect search index to terminal context"
```

## Task 6: Discovery Surface and Onboarding Polish

**Files:**
- Modify: `src/commands/start/index.ts`
- Modify: `src/commands/start/translations.ts`
- Modify: `src/i18n/index.ts`
- Modify: `src/commands/runtime/executeCommand.test.ts`
- Modify: `src/components/Header.test.tsx`

- [ ] **Step 1: Update failing surface expectations**

Run:

```bash
npm test -- src/commands/runtime/executeCommand.test.ts src/components/Header.test.tsx
```

Expected: FAIL where command lists and quick-start arrays still omit `search`.

- [ ] **Step 2: Add `search` to `start` copy**

Modify `src/commands/start/translations.ts`:

```ts
entries: {
  search: 'Search across the archive by project, skill, tag, or topic.',
  work: 'Browse selected work and useful filters.',
  timeline: 'Follow the chronological path through the archive.',
  journey: 'Read the more authored version of that path.',
  now: 'See what is currently in focus.',
  whoami: 'Read the personal identity entry.',
  ls: 'See the compact directory of archive areas.',
  help: 'List every available command.',
},
```

Portuguese:

```ts
entries: {
  search: 'Pesquise o arquivo por projeto, habilidade, tag ou assunto.',
  work: 'Conheça trabalhos selecionados e filtros úteis.',
  timeline: 'Acompanhe o percurso cronológico pelo arquivo.',
  journey: 'Leia a versão mais autoral desse percurso.',
  now: 'Veja o que está em foco agora.',
  whoami: 'Leia o retrato pessoal.',
  ls: 'Veja o diretório compacto das áreas do arquivo.',
  help: 'Liste todos os comandos disponíveis.',
},
```

Modify `src/commands/start/index.ts` so `search` appears after `work`:

```ts
{
  title: 'search',
  subtitle: t.entries.search,
},
```

- [ ] **Step 3: Update onboarding prompt without making it loud**

Modify `src/i18n/index.ts`:

```ts
promptCmd: 'search backend',
promptPost: ' and press Enter to search the archive.',
quickStartCommands: ['start', 'work', 'search backend', 'timeline'] as const,
```

Portuguese:

```ts
promptCmd: 'search backend',
promptPost: ' e pressione Enter para pesquisar o arquivo.',
quickStartCommands: ['start', 'work', 'search backend', 'timeline'] as const,
```

Keep quick-start behavior unchanged: chips fill the prompt and do not execute.

- [ ] **Step 4: Update list tests**

In `src/commands/runtime/executeCommand.test.ts`, add the expected `search` command to localized `help` assertions:

```ts
{
  command: 'search',
  description: 'Search across commands, projects, timeline, and authored notes.',
  usage: 'search <query> [--type=<kind>] [--limit=<count>]',
},
```

Portuguese:

```ts
{
  command: 'search',
  description: 'Pesquisa comandos, projetos, trajetória e notas autorais.',
  usage: 'search <consulta> [--type=<tipo>] [--limit=<quantidade>]',
},
```

Also update `start` block expectations to include `search`, and update `ls` expectations so the discovery line includes `search` with `start`, `help`, and `ls`.

- [ ] **Step 5: Update Header tests**

In `src/components/Header.test.tsx`, update quick-start expectations from `now` to `search backend` where the test asserts all chips or prompt fill behavior.

- [ ] **Step 6: Run targeted tests**

Run:

```bash
npm test -- src/commands/runtime/executeCommand.test.ts src/components/Header.test.tsx src/commands/search/index.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/commands/start src/i18n/index.ts src/commands/runtime/executeCommand.test.ts src/components/Header.test.tsx
git commit -m "feat: surface archive search in onboarding"
```

## Task 7: Visual Grammar Regression

**Files:**
- Modify: `src/components/History.test.tsx`
- Do not modify `src/components/History.tsx` or `src/assets/App.css` unless the test exposes a real mismatch.

- [ ] **Step 1: Write regression test for search result rendering**

Add a test to `src/components/History.test.tsx`:

```tsx
it('renders search results with the shared record list grammar', () => {
  render(
    <LanguageProvider>
      <History
        history={[
          {
            type: 'output',
            blocks: [
              {
                type: 'recordList',
                title: 'Search results:',
                records: [
                  {
                    title: 'promptfolio',
                    meta: 'project · TypeScript · 2026 · active',
                    subtitle:
                      'Command-guided portfolio shaped as a calm personal archive.',
                    href: 'https://github.com/jozanardo/PromptFolio',
                    lines: ['> work --name promptfolio', '#promptfolio'],
                  },
                ],
              },
            ],
          },
        ]}
      />
    </LanguageProvider>
  );

  expect(screen.getByText('promptfolio')).toHaveClass('history-list-token');
  expect(screen.getByText('> work --name promptfolio')).toHaveClass(
    'history-list-subtoken'
  );
});
```

- [ ] **Step 2: Run visual grammar test**

Run:

```bash
npm test -- src/components/History.test.tsx
```

Expected: PASS without adding new card, badge, icon, or search-specific class.

- [ ] **Step 3: Commit**

```bash
git add src/components/History.test.tsx
git commit -m "test: lock search result visual grammar"
```

## Task 8: Final Verification and Phase Closeout

**Files:**
- Modify: `plan_v2.md` only if implementation results need a brief delivered-summary under Fase 6.

- [ ] **Step 1: Run full test suite**

Run:

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 2: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: exit code 0.

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: exit code 0.

- [ ] **Step 4: Run production build**

Run:

```bash
npm run build
```

Expected: exit code 0 and Vite build output in `dist/`.

- [ ] **Step 5: Manual smoke commands**

Run the app locally:

```bash
npm run dev
```

Smoke through the browser:

- `search backend`
- `search promptfolio`
- `search "arquivo pessoal"` with Portuguese active
- `search distributed-systems --type=project`
- `search xxyyzz`
- `search --help`

Expected: results are readable, no inner shell scrolling appears, quick-start chips fill the prompt, and output uses the same `recordList` visual family as `help`.

- [ ] **Step 6: Add Fase 6 delivered summary**

If the implementation is complete, append concise delivered bullets under `## Fase 6 ... - Done` in `plan_v2.md`:

```md
- Implementado: `src/search` cria um índice local bilíngue sobre comandos, projetos, trajetória, narrativa e perfil.
- Implementado: `search` pesquisa o arquivo com filtros por tipo, limite de resultados, estados vazios localizados e saída em `recordList`.
- Implementado: onboarding, `start`, `help`, `ls` e quick-starts expõem a busca como parte da descoberta principal.
- Testes cobertos: busca em `pt` e `en`; busca sem resultado; busca por tag; busca por texto de projeto curado; busca por entrada narrativa; troca de idioma; gramática visual compartilhada dos resultados.
```

- [ ] **Step 7: Commit closeout**

```bash
git add plan_v2.md
git commit -m "docs: summarize searchable archive phase"
```

## Self-Review Checklist

- [ ] Search is local and works offline.
- [ ] `search` is registered in `help`, `ls`, `start`, and `search` surfaces.
- [ ] Results use `recordList`; no new cards, badges, icons, or visual system.
- [ ] Query text with spaces works through existing parser positionals and quotes.
- [ ] English and Portuguese outputs are parallel and tested.
- [ ] Search includes commands, projects, profile, contact, timeline, journey, `now`, and `philosophy`.
- [ ] Empty, help, invalid type, invalid limit, and missing query states are localized.
- [ ] Full verification commands pass before claiming the phase complete.
