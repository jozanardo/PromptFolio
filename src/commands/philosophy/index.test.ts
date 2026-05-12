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

describe('philosophy command', () => {
  it('renders the engineering philosophy in English', async () => {
    const result = await executeCommand('philosophy', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'The engineering philosophy here is practical: software should make constraints visible, reduce operational surprise, and help people decide with more clarity.',
      },
      {
        type: 'recordList',
        title: 'Working principles:',
        records: [
          {
            title: 'clarity',
            subtitle:
              'Explicit boundaries, legible flows, and names that make the next step calmer.',
          },
          {
            title: 'reliability',
            subtitle:
              'Latency, fallback, observability, and recovery as part of the product promise.',
          },
          {
            title: 'interfaces',
            subtitle:
              'Small contracts that are easy to understand, test, and evolve.',
          },
          {
            title: 'AI ownership',
            subtitle:
              'AI as leverage to explore, review, and deliver while keeping judgment and responsibility with the engineer.',
          },
          {
            title: 'constraints',
            subtitle:
              'Calm execution in real systems, with legacy code, deadlines, incomplete knowledge, and production.',
          },
        ],
      },
    ]);
  });

  it('renders the engineering philosophy in Portuguese', async () => {
    const result = await executeCommand('philosophy', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'A filosofia de engenharia aqui é prática: software deve tornar restrições visíveis, reduzir surpresa operacional e ajudar pessoas a decidir com mais clareza.',
      },
      {
        type: 'recordList',
        title: 'Princípios de trabalho:',
        records: [
          {
            title: 'clareza',
            subtitle:
              'Fronteiras explícitas, fluxos legíveis e nomes que deixam o próximo passo mais calmo.',
          },
          {
            title: 'confiabilidade',
            subtitle:
              'Latência, fallback, observabilidade e recuperação como parte da promessa do produto.',
          },
          {
            title: 'interfaces',
            subtitle:
              'Contratos pequenos, fáceis de entender, testar e evoluir.',
          },
          {
            title: 'IA com autoria',
            subtitle:
              'IA como alavanca para explorar, revisar e entregar, mantendo julgamento e responsabilidade no engenheiro.',
          },
          {
            title: 'restrições',
            subtitle:
              'Execução calma em sistemas reais, com legado, prazos, conhecimento incompleto e produção.',
          },
        ],
      },
    ]);
  });

  it('returns localized help without reading narrative content', async () => {
    const context = createContext('en');

    Object.defineProperty(context.content, 'narrative', {
      get: () => {
        throw new Error('narrative content should not be read for help');
      },
    });

    const result = await executeCommand('philosophy --help', context);

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Usage: philosophy [--help]',
      },
    ]);
  });

  it('does not depend on project catalog or services', async () => {
    const context = createContext('pt');

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

    const result = await executeCommand('philosophy', context);

    expect(result.result.blocks[0]).toEqual({
      type: 'text',
      text: 'A filosofia de engenharia aqui é prática: software deve tornar restrições visíveis, reduzir surpresa operacional e ajudar pessoas a decidir com mais clareza.',
    });
  });
});
