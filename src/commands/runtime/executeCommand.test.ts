import { describe, expect, it, vi } from 'vitest';
import { commandRegistry } from '../../commands';
import { executeCommand } from './executeCommand';
import type {
  AnyCommandDefinition,
  CommandContext,
  HistoryItem,
} from '../../types';

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>(res => {
    resolve = res;
  });

  return { promise, resolve };
}

function createContext(
  lang: 'en' | 'pt' = 'en',
  overrides: Partial<
    Pick<CommandContext, 'setHistory' | 'services' | 'registry'>
  > = {}
): CommandContext {
  const setHistory =
    overrides.setHistory ??
    (vi.fn() as unknown as CommandContext['setHistory']);

  return {
    lang,
    registry: overrides.registry ?? commandRegistry,
    history: [],
    setHistory,
    shellMessages: {
      notFoundMessage:
        lang === 'en'
          ? "Command not found. Type 'help' to view a list of available commands."
          : "Comando não encontrado. Digite 'help' para ver a lista de comandos.",
    },
    content: {
      profile: null,
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
    services:
      overrides.services ??
      ({
        whoami: {
          loading: false,
          error: null,
          fetchReadme: async () => '',
        },
      } as CommandContext['services']),
  };
}

describe('executeCommand', () => {
  it('executes help from the registry and returns a help list block', async () => {
    const result = await executeCommand('help', createContext('pt'));

    expect(result.parsedInput.commandName).toBe('help');
    expect(result.result.echoInput).toBe(true);
    expect(result.result.blocks).toEqual([
      {
        type: 'helpList',
        title: 'Comandos disponíveis:',
        items: [
          {
            command: 'help',
            description: 'Lista todos os comandos disponíveis.',
            usage: 'help',
          },
          {
            command: 'ls',
            description: 'Lista todos os comandos disponíveis.',
            usage: 'help',
          },
          {
            command: 'whoami',
            description: 'Quem sou eu.',
            usage: 'whoami',
          },
          {
            command: 'about',
            description: 'Saiba mais sobre mim.',
            usage: 'about',
          },
          {
            command: 'skills',
            description: 'Quais tecnologias eu uso.',
            usage: 'skills',
          },
          {
            command: 'projects',
            description: 'Veja meus projetos (use filtros: [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>]).',
            usage: 'projects [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>]',
          },
          {
            command: 'contact',
            description: 'Quer dizer algo?',
            usage: 'contact',
          },
          {
            command: 'clear',
            description: 'Limpa o histórico (header fixo).',
            usage: 'clear',
          },
        ],
      },
    ]);
  });

  it('executes clear through a structured side effect', async () => {
    const result = await executeCommand('clear', createContext('en'));

    expect(result.result.echoInput).toBe(false);
    expect(result.result.blocks).toEqual([]);
    expect(result.result.effects).toEqual([{ type: 'clearHistory' }]);
  });

  it('treats projects boolean flags as boolean even when followed by positionals', async () => {
    const result = await executeCommand('projects --help extra', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Usage: projects [--lang=<language>] [--desc=<text>] [--name=<name>] [--list-langs] [--help]',
      },
    ]);
  });

  it('shows whoami loading before awaiting the README fetch', async () => {
    const deferred = createDeferred<string>();
    const setHistoryMock = vi.fn();
    const fetchReadme = vi.fn(() => deferred.promise);

    const context = createContext('en', {
      setHistory: setHistoryMock as unknown as CommandContext['setHistory'],
      services: {
        whoami: {
          loading: false,
          error: null,
          fetchReadme,
        },
      },
    });

    const execution = executeCommand('whoami', context);

    expect(setHistoryMock).toHaveBeenCalledTimes(1);
    const updater = setHistoryMock.mock.calls[0][0];
    expect(typeof updater).toBe('function');

    expect((updater as (value: HistoryItem[]) => HistoryItem[])([])).toEqual([
      {
        type: 'output',
        blocks: [
          {
            type: 'system',
            text: '🔄 Loading GitHub README…',
          },
        ],
      },
    ]);

    deferred.resolve('<h1>README</h1>');
    const result = await execution;

    expect(result.result.blocks).toEqual([
      {
        type: 'markdown',
        html: '<h1>README</h1>',
      },
    ]);
  });

  it('returns a structured error block when whoami fails', async () => {
    const result = await executeCommand(
      'whoami',
      createContext('en', {
        services: {
          whoami: {
            loading: false,
            error: null,
            fetchReadme: async () => {
              throw new Error('boom');
            },
          },
        },
      })
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'error',
        command: 'whoami',
        message: 'boom',
      },
    ]);
  });

  it('returns a localized error block for unknown commands', async () => {
    const result = await executeCommand('unknown', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'error',
        command: 'unknown',
        message: "Command not found. Type 'help' to view a list of available commands.",
      },
    ]);
  });

  it('returns a parser error even when tokenization fails before a command token exists', async () => {
    const result = await executeCommand('"', createContext('en'));

    expect(result.parsedInput.commandName).toBe('');
    expect(result.parsedInput.tokenizationError).toBe(
      'Unclosed quote in command input.'
    );
    expect(result.result.blocks).toEqual([
      {
        type: 'error',
        message: 'Unclosed quote in command input.',
      },
    ]);
  });

  it('converts thrown parse errors into structured error blocks', async () => {
    const command: AnyCommandDefinition = {
      meta: {
        name: 'boom-parse',
        category: 'test',
        description: { en: 'boom', pt: 'boom' },
        usage: { en: 'boom-parse', pt: 'boom-parse' },
      },
      translations: { en: {}, pt: {} },
      parse: () => {
        throw new Error('parse exploded');
      },
      execute: () => ({ blocks: [] }),
    };

    const result = await executeCommand(
      'boom-parse',
      createContext('en', {
        registry: {
          get: name => (name === 'boom-parse' ? command : undefined),
          list: () => [command],
        },
      })
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'error',
        command: 'boom-parse',
        message: 'parse exploded',
      },
    ]);
  });

  it('converts thrown execute errors into structured error blocks', async () => {
    const command: AnyCommandDefinition = {
      meta: {
        name: 'boom-exec',
        category: 'test',
        description: { en: 'boom', pt: 'boom' },
        usage: { en: 'boom-exec', pt: 'boom-exec' },
      },
      translations: { en: {}, pt: {} },
      parse: () => ({
        ok: true,
        args: {},
      }),
      execute: async () => {
        throw new Error('execute exploded');
      },
    };

    const result = await executeCommand(
      'boom-exec',
      createContext('en', {
        registry: {
          get: name => (name === 'boom-exec' ? command : undefined),
          list: () => [command],
        },
      })
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'error',
        command: 'boom-exec',
        message: 'execute exploded',
      },
    ]);
  });
});
