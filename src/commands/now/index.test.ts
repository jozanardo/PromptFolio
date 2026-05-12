import { describe, expect, it, vi } from 'vitest';
import { commandRegistry } from '..';
import { executeCommand } from '../runtime/executeCommand';
import type { CommandContext } from '../../types';

function createContext(lang: 'en' | 'pt' = 'en'): CommandContext {
  return {
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
}

describe('now command', () => {
  it('renders the current editorial focus in English', async () => {
    const result = await executeCommand('now', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Right now, my attention is on backend reliability, applied AI, and keeping PromptFolio as a clear authored archive instead of a decorative portfolio.',
      },
      {
        type: 'recordList',
        title: 'Current focus:',
        records: [
          {
            title: 'backend',
            subtitle:
              'Resilient services for international shipping promises, operational clarity, and predictable production behavior.',
          },
          {
            title: 'AI',
            subtitle:
              'Applied AI in engineering without hiding tradeoffs, context, or responsibility.',
          },
          {
            title: 'PromptFolio',
            subtitle:
              'Evolving the archive as a localized, theme-aware, commandable, and contained product.',
          },
          {
            title: 'range',
            subtitle:
              'Keeping Go, Java, C#, TypeScript, Python, and functional programming in dialogue through concrete projects.',
          },
        ],
      },
    ]);
  });

  it('renders the current editorial focus in Portuguese', async () => {
    const result = await executeCommand('now', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Neste momento, minha atenção está em confiabilidade de backend, IA aplicada e em manter o PromptFolio como um arquivo autoral claro em vez de um portfólio decorativo.',
      },
      {
        type: 'recordList',
        title: 'Foco atual:',
        records: [
          {
            title: 'backend',
            subtitle:
              'Serviços resilientes para promessas de envio internacional, clareza operacional e comportamento previsível em produção.',
          },
          {
            title: 'IA',
            subtitle:
              'Uso de IA aplicada em engenharia sem esconder tradeoffs, contexto ou responsabilidade.',
          },
          {
            title: 'PromptFolio',
            subtitle:
              'Evolução do arquivo como produto localizado, theme-aware, comandável e contido.',
          },
          {
            title: 'amplitude',
            subtitle:
              'Manter Go, Java, C#, TypeScript, Python e programação funcional em diálogo por projetos concretos.',
          },
        ],
      },
    ]);
  });

  it('returns localized help without reading narrative content', async () => {
    const context = createContext('pt');

    Object.defineProperty(context.content, 'narrative', {
      get: () => {
        throw new Error('narrative content should not be read for help');
      },
    });

    const result = await executeCommand('now --help', context);

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Uso: now [--help]',
      },
    ]);
  });

  it('does not depend on project catalog or services', async () => {
    const context = createContext('en');

    Object.defineProperty(context, 'projectCatalog', {
      get: () => {
        throw new Error('project catalog should not be read');
      },
    });
    Object.defineProperty(context, 'services', {
      get: () => {
        throw new Error('services should not be read');
      },
    });

    const result = await executeCommand('now', context);

    expect(result.result.blocks[0]).toEqual({
      type: 'text',
      text: 'Right now, my attention is on backend reliability, applied AI, and keeping PromptFolio as a clear authored archive instead of a decorative portfolio.',
    });
  });
});
