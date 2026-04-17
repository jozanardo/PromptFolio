import { describe, expect, it } from 'vitest';
import { helpCommand } from '../help';
import { clearCommand } from '../clear';
import { createCommandRegistry } from './commandRegistry';
import { executeCommand } from './executeCommand';
import type { CommandContext } from '../../types';

function createContext(lang: 'en' | 'pt' = 'en'): CommandContext {
  const registry = createCommandRegistry([helpCommand, clearCommand]);

  return {
    lang,
    registry,
    history: [],
    setHistory: () => undefined,
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
    services: {
      whoami: {
        loading: false,
        error: null,
        fetchReadme: async () => '',
      },
    },
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
});
