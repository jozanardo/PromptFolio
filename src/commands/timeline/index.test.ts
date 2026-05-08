import { describe, expect, it, vi } from 'vitest';
import { commandRegistry } from '..';
import { projectContent } from '../../content/projects';
import { timelineContent } from '../../content/timeline';
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
      projects: projectContent,
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

describe('timeline command', () => {
  it('returns chronological entries sorted from newest to oldest by default', async () => {
    const result = await executeCommand('timeline', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'A factual path through the archive, ordered from current work back to the foundations.',
      },
      {
        type: 'recordList',
        title: 'Timeline:',
        records: [
          {
            title: '2026',
            meta: 'Archive system',
            subtitle:
              'PromptFolio becomes a command archive where reading, localization, themes, and project discovery share one interface.',
            lines: ['promptfolio', '#portfolio', '#typescript'],
          },
          {
            title: '2025 - present',
            meta: 'Mercado Livre',
            subtitle:
              'Backend work turns toward resilient services for international shipping promises, with reliability and operational clarity at the center.',
            lines: ['#backend', '#resilience', '#logistics'],
          },
          {
            title: '2025',
            meta: 'Backend depth',
            subtitle:
              'C#, TypeScript, and functional programming studies sharpen service boundaries, domain modeling, and alternate ways to reason about state.',
            lines: [
              'myorders',
              'lambda-chess',
              'clean-node',
              '#backend',
              '#functional-programming',
            ],
          },
          {
            title: '2022 - 2025',
            meta: 'BTG Pactual',
            subtitle:
              'Critical financial systems shape the habit of calm execution, legacy evolution, automation, and production-minded engineering.',
            lines: ['#critical-systems', '#csharp', '#automation'],
          },
          {
            title: '2023',
            meta: 'Distributed systems study',
            subtitle:
              'Java networking and coordination projects make distributed communication concrete through peer-to-peer and coordination exercises.',
            lines: [
              'napster',
              'zookepeer',
              '#java',
              '#distributed-systems',
            ],
          },
          {
            title: '2023',
            meta: 'Computer graphics',
            subtitle:
              'Graphics work adds a visual-computing branch to the archive through 3D animation, lighting, and texture practice.',
            lines: ['grafica-3d-animacoes', '#cpp', '#computer-graphics'],
          },
          {
            title: '2021 - 2022',
            meta: 'Santander',
            subtitle:
              'Cybersecurity and audit work build a foundation in governance, risk, and critical-system thinking.',
            lines: ['#security', '#audit', '#governance'],
          },
        ],
      },
    ]);
  });

  it('groups timeline entries consistently by cycle and includes entries without related projects', async () => {
    const result = await executeCommand('timeline --group=cycle', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'A factual path through the archive, ordered from current work back to the foundations.',
      },
      {
        type: 'recordList',
        title: 'Timeline by cycle:',
        records: [
          {
            title: 'active craft',
            lines: ['Archive system · 2026', 'Mercado Livre · 2025 - present'],
          },
          {
            title: 'technical range',
            lines: [
              'Backend depth · 2025',
              'Distributed systems study · 2023',
              'Computer graphics · 2023',
            ],
          },
          {
            title: 'critical systems',
            lines: ['BTG Pactual · 2022 - 2025', 'Santander · 2021 - 2022'],
          },
        ],
      },
    ]);
  });

  it('keeps timeline locale parity in Portuguese', async () => {
    const result = await executeCommand('timeline --group=year', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Um percurso factual pelo arquivo, ordenado do trabalho atual às fundações.',
      },
      {
        type: 'recordList',
        title: 'Timeline por ano:',
        records: [
          {
            title: '2026',
            lines: ['Arquivo de comandos'],
          },
          {
            title: '2025',
            lines: ['Mercado Livre', 'Profundidade backend'],
          },
          {
            title: '2023',
            lines: ['Estudo de sistemas distribuídos', 'Computação gráfica'],
          },
          {
            title: '2022',
            lines: ['BTG Pactual', 'Santander'],
          },
        ],
      },
    ]);
  });

  it('groups timeline entries by navigable milestone type', async () => {
    const result = await executeCommand(
      'timeline --group=milestone',
      createContext('en')
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'A factual path through the archive, ordered from current work back to the foundations.',
      },
      {
        type: 'recordList',
        title: 'Timeline by milestone:',
        records: [
          {
            title: 'career',
            lines: [
              'Mercado Livre · 2025 - present',
              'BTG Pactual · 2022 - 2025',
              'Santander · 2021 - 2022',
            ],
          },
          {
            title: 'project',
            lines: ['Archive system · 2026'],
          },
          {
            title: 'study',
            lines: [
              'Backend depth · 2025',
              'Distributed systems study · 2023',
              'Computer graphics · 2023',
            ],
          },
        ],
      },
    ]);
  });

  it('returns a parse error for unsupported grouping values', async () => {
    const result = await executeCommand('timeline --group=foo', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'error',
        command: 'timeline',
        message: 'Invalid value for --group. Use one of: year, cycle, milestone.',
      },
    ]);
  });

  it('accepts kind as a compatibility alias for milestone grouping', async () => {
    const milestoneResult = await executeCommand(
      'timeline --group=milestone',
      createContext('en')
    );
    const kindResult = await executeCommand(
      'timeline --group=kind',
      createContext('en')
    );

    expect(kindResult.result.blocks).toEqual(milestoneResult.result.blocks);
  });

  it('returns a parse error when group is provided without a value', async () => {
    const result = await executeCommand('timeline --group', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'error',
        command: 'timeline',
        message: 'Valor inválido para --group. Use um destes: year, cycle, milestone.',
      },
    ]);
  });

  it('exposes localized help without reading chronological content', async () => {
    const context = createContext('pt');

    Object.defineProperty(context.content, 'timeline', {
      get: () => {
        throw new Error('timeline content should not be read for help');
      },
    });

    const result = await executeCommand('timeline --help', context);

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Uso: timeline [--group=year|cycle|milestone] [--help]',
      },
    ]);
  });

  it('keeps timeline project and command references aligned with the archive', () => {
    const projectSlugs = new Set(projectContent.projects.map(project => project.slug));
    const commandNames = new Set(
      commandRegistry.list().map(definition => definition.meta.name)
    );

    for (const entry of timelineContent.entries) {
      expect(entry.relatedProjects.every(slug => projectSlugs.has(slug))).toBe(true);
    }

    for (const section of timelineContent.journey) {
      for (const reference of section.references) {
        if (reference.startsWith('#')) {
          continue;
        }

        const isCommand = commandNames.has(reference);
        const isProject = projectSlugs.has(reference);

        expect(isCommand || isProject).toBe(true);
      }
    }
  });
});

describe('journey command', () => {
  it('renders narrative blocks from the same chronological source', async () => {
    const result = await executeCommand('journey', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'A more editorial reading of the same timeline: what changed, what carried forward, and why it matters.',
      },
      {
        type: 'recordList',
        title: 'Journey:',
        records: [
          {
            title: 'active craft',
            subtitle:
              'The current layer connects product-facing backend reliability with an authored portfolio system. PromptFolio makes the archive itself part of the work: localized, theme-aware, and intentionally command-driven.',
            lines: ['timeline', 'work', 'promptfolio'],
          },
          {
            title: 'technical range',
            subtitle:
              'The study layer widens the engineering vocabulary: C# domain modeling, TypeScript service design, Haskell state reasoning, Java distributed systems, and C++ graphics all remain visible without competing for attention.',
            lines: [
              'myorders',
              'lambda-chess',
              'napster',
              'zookepeer',
              'grafica-3d-animacoes',
            ],
          },
          {
            title: 'critical systems',
            subtitle:
              'The foundation comes from security, audit, and financial systems. That background shows up as a preference for clarity, operability, and calm execution under real constraints.',
            lines: ['about', '#critical-systems', '#security'],
          },
        ],
      },
    ]);
  });

  it('keeps journey localized and structurally parallel in Portuguese', async () => {
    const result = await executeCommand('journey', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Uma leitura mais editorial da mesma timeline: o que mudou, o que permaneceu e por que isso importa.',
      },
      {
        type: 'recordList',
        title: 'Jornada:',
        records: [
          {
            title: 'ofício atual',
            subtitle:
              'A camada atual conecta confiabilidade de backend voltada a produto com um sistema autoral de portfólio. PromptFolio transforma o próprio arquivo em parte do trabalho: localizado, sensível a tema e intencionalmente guiado por comandos.',
            lines: ['timeline', 'work', 'promptfolio'],
          },
          {
            title: 'amplitude técnica',
            subtitle:
              'A camada de estudo amplia o vocabulário de engenharia: modelagem de domínio em C#, desenho de serviços em TypeScript, raciocínio de estado em Haskell, sistemas distribuídos em Java e computação gráfica em C++ seguem visíveis sem disputar atenção.',
            lines: [
              'myorders',
              'lambda-chess',
              'napster',
              'zookepeer',
              'grafica-3d-animacoes',
            ],
          },
          {
            title: 'sistemas críticos',
            subtitle:
              'A fundação vem de segurança, auditoria e sistemas financeiros. Esse histórico aparece como preferência por clareza, operabilidade e execução calma sob restrições reais.',
            lines: ['about', '#critical-systems', '#security'],
          },
        ],
      },
    ]);
  });
});
