import { describe, expect, it } from 'vitest';
import { commandRegistry } from '../commands';
import { narrativeContent } from '../content/narrative';
import { profileContent } from '../content/profile';
import { projectContent } from '../content/projects';
import { timelineContent } from '../content/timeline';
import { buildSearchIndex } from './buildSearchIndex';
import { normalizeForSearch, tokenizeSearchQuery } from './normalize';
import { searchRecords } from './searchRecords';

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
