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
    const result = await executeCommand(
      'search "arquivo pessoal"',
      createContext('pt')
    );

    expect(result.result.blocks[0]).toMatchObject({
      type: 'text',
    });
    expect(result.result.blocks[1]).toMatchObject({
      type: 'recordList',
    });

    const recordList = result.result.blocks[1];

    if (recordList.type !== 'recordList') {
      throw new Error('expected recordList block');
    }

    expect(recordList.records[0]).toMatchObject({
      title: 'promptfolio',
      meta: expect.stringContaining('projeto'),
      lines: expect.arrayContaining(['> work --name promptfolio']),
    });
    expect(recordList.records[0].meta).toContain('ativo');
    expect(recordList.records[0].meta).not.toContain('active');
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

  it('finds public commands listed in help', async () => {
    const { executeCommand } = await import('../runtime/executeCommand');
    const result = await executeCommand('search clear', createContext('en'));

    expect(result.result.blocks[1]).toMatchObject({
      type: 'recordList',
      records: expect.arrayContaining([
        expect.objectContaining({
          title: 'clear',
          lines: expect.arrayContaining(['> clear']),
        }),
      ]),
    });
  });

  it('localizes timeline result metadata', async () => {
    const { executeCommand } = await import('../runtime/executeCommand');
    const result = await executeCommand(
      'search "Mercado Livre" --type=timeline --limit=1',
      createContext('pt')
    );

    expect(result.result.blocks[1]).toMatchObject({
      type: 'recordList',
      records: [
        expect.objectContaining({
          title: 'Mercado Livre',
          meta: expect.stringContaining('carreira'),
        }),
      ],
    });

    const recordList = result.result.blocks[1];

    if (recordList.type !== 'recordList') {
      throw new Error('expected recordList block');
    }

    expect(recordList.records[0].meta).not.toContain('career');
  });

  it('supports type and limit filters', async () => {
    const { executeCommand } = await import('../runtime/executeCommand');
    const result = await executeCommand(
      'search backend --type=profile --limit=1',
      createContext('en')
    );

    expect(result.result.blocks[1]).toMatchObject({
      type: 'recordList',
      records: [
        expect.objectContaining({
          meta: expect.stringContaining('profile'),
        }),
      ],
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

    await expect(
      executeCommand('search', createContext('en'))
    ).resolves.toMatchObject({
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
