import { describe, expect, it, vi } from 'vitest';
import { commandRegistry } from '..';
import { projectContent } from '../../content/projects';
import { executeCommand } from '../runtime/executeCommand';
import type { CommandContext } from '../../types';
import type { ProjectRepo } from '../../features/projects/projectsService';

const promptfolioRepo: ProjectRepo = {
  name: 'PromptFolio',
  description: 'My professional portfolio based on a CMD.',
  language: 'TypeScript',
  html_url: 'https://github.com/jozanardo/PromptFolio',
  updated_at: '2026-04-30T00:06:54Z',
};

function createContext(
  lang: 'en' | 'pt' = 'en',
  projectCatalog: Partial<CommandContext['projectCatalog']> = {}
): CommandContext {
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
      ...projectCatalog,
    },
    searchIndex: {
      ready: false,
      records: [],
    },
    services: {},
  };
}

describe('work command', () => {
  it('returns help without reading project catalog content', async () => {
    const context = createContext('en');

    Object.defineProperty(context.content, 'projects', {
      get: () => {
        throw new Error('project content should not be read for help');
      },
    });

    const result = await executeCommand('work --help', context);

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Usage: work [--lang=<language>] [--text=<query>] [--name=<name>] [--tag=<tag>] [--list-langs] [--help]',
      },
    ]);
  });

  it('executes work as a filtered editorial catalog with GitHub enrichment', async () => {
    const result = await executeCommand(
      'work --lang=TypeScript --name prompt',
      createContext('en', {
        repos: [promptfolioRepo],
      })
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Selected work from the local archive. GitHub only enriches language, URL, and update metadata when available.',
      },
      {
        type: 'recordList',
        title: 'Selected work:',
        records: [
          {
            title: 'promptfolio',
            meta: 'TypeScript · 2026 · active',
            subtitle: 'Command-guided portfolio shaped as a calm personal archive.',
            href: 'https://github.com/jozanardo/PromptFolio',
            lines: [
              'PromptFolio',
              '#portfolio',
              '#typescript',
              '#terminal',
              '#i18n',
            ],
          },
        ],
      },
    ]);
  });

  it('keeps work usable from local content when GitHub enrichment fails', async () => {
    const result = await executeCommand(
      'work --name prompt',
      createContext('en', {
        error: 'GitHub API retornou 403',
      })
    );

    expect(result.result.blocks[0]).toEqual({
      type: 'system',
      text: 'GitHub enrichment unavailable: GitHub API retornou 403. Showing the local catalog.',
    });
    expect(result.result.blocks[1]).toEqual({
      type: 'text',
      text: 'Selected work from the local archive. GitHub only enriches language, URL, and update metadata when available.',
    });
    expect(result.result.blocks[2]).toMatchObject({
      type: 'recordList',
      records: [
        {
          title: 'promptfolio',
          href: 'https://github.com/jozanardo/PromptFolio',
        },
      ],
    });
  });

  it('lists available project languages from the merged catalog', async () => {
    const result = await executeCommand(
      'work --list-langs',
      createContext('en', {
        repos: [promptfolioRepo],
      })
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'recordList',
        title: 'Available languages:',
        records: expect.arrayContaining([
          {
            title: 'TypeScript',
            subtitle: '1 project',
          },
          {
            title: 'C#',
            subtitle: '1 project',
          },
          {
            title: 'Java',
            subtitle: '2 projects',
          },
          {
            title: 'Haskell',
            subtitle: '1 project',
          },
        ]),
      },
    ]);
    expect(result.result.blocks[0]).toMatchObject({
      records: expect.not.arrayContaining([
        {
          title: 'C++',
          subtitle: '1 project',
        },
      ]),
    });
  });

  it('shows GitHub fallback messaging when listing work languages', async () => {
    const result = await executeCommand(
      'work --list-langs',
      createContext('en', {
        error: 'GitHub API retornou 403',
      })
    );

    expect(result.result.blocks[0]).toEqual({
      type: 'system',
      text: 'GitHub enrichment unavailable: GitHub API retornou 403. Showing the local catalog.',
    });
    expect(result.result.blocks[1]).toMatchObject({
      type: 'recordList',
      title: 'Available languages:',
    });
  });

  it('filters work with the documented text flag and keeps desc as an alias', async () => {
    const textResult = await executeCommand(
      'work --text "command archive"',
      createContext('en')
    );
    const descResult = await executeCommand(
      'work --desc "command archive"',
      createContext('en')
    );

    expect(textResult.result.blocks).toEqual(descResult.result.blocks);
    expect(textResult.result.blocks[1]).toMatchObject({
      type: 'recordList',
      records: [
        {
          title: 'promptfolio',
        },
      ],
    });
  });

  it('removes the previous public commands', async () => {
    const highlightsResult = await executeCommand('highlights', createContext('en'));
    const projectsResult = await executeCommand('projects', createContext('en'));

    expect(commandRegistry.get('highlights')).toBeUndefined();
    expect(commandRegistry.get('projects')).toBeUndefined();
    expect(highlightsResult.result.blocks).toEqual([
      {
        type: 'error',
        command: 'highlights',
        message: "Command not found. Type 'help' to view a list of available commands.",
      },
    ]);
    expect(projectsResult.result.blocks).toEqual([
      {
        type: 'error',
        command: 'projects',
        message: "Command not found. Type 'help' to view a list of available commands.",
      },
    ]);
  });

  it('executes work with the featured Java systems', async () => {
    const result = await executeCommand(
      'work --tag distributed-systems',
      createContext('en')
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Selected work from the local archive. GitHub only enriches language, URL, and update metadata when available.',
      },
      {
        type: 'recordList',
        title: 'Selected work:',
        records: [
          {
            title: 'napster',
            meta: 'Java · 2023 · study',
            subtitle:
              'Peer-to-peer file sharing study project in Java, focused on distributed communication and networked coordination.',
            href: 'https://github.com/jozanardo/Napster',
            lines: ['Napster', '#java', '#distributed-systems', '#networking'],
          },
          {
            title: 'zookepeer',
            meta: 'Java · 2023 · study',
            subtitle:
              'Coordination-oriented Java study around distributed systems concepts and service organization.',
            href: 'https://github.com/jozanardo/zookepeer',
            lines: [
              'zookepeer',
              '#java',
              '#distributed-systems',
              '#coordination',
            ],
          },
        ],
      },
    ]);
  });

  it('executes archive as the broader catalog including the non-featured 3D graphics project', async () => {
    const result = await executeCommand(
      'archive --name grafica',
      createContext('pt')
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Uma memória mais ampla de projetos, incluindo estudos, laboratórios e repositórios antigos que ainda explicam a trajetória.',
      },
      {
        type: 'recordList',
        title: 'Arquivo histórico:',
        records: [
          {
            title: 'grafica-3d-animacoes',
            meta: 'C++ · 2023 · estudo',
            subtitle:
              'Projeto de computação gráfica em C++ com animações 3D, iluminação e texturização.',
            href: 'https://github.com/jozanardo/Aplicao-grafica-3D-com-animacoes',
            lines: [
              'Aplicao-grafica-3D-com-animacoes',
              '#cpp',
              '#computer-graphics',
              '#3d',
            ],
          },
        ],
      },
    ]);
  });

  it('lists archive languages from the full historical catalog', async () => {
    const result = await executeCommand('archive --list-langs', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'recordList',
        title: 'Available archive languages:',
        records: expect.arrayContaining([
          {
            title: 'C++',
            subtitle: '1 project',
          },
          {
            title: 'TypeScript',
            subtitle: '2 projects',
          },
        ]),
      },
    ]);
  });

  it('shows GitHub fallback messaging when listing archive languages', async () => {
    const result = await executeCommand(
      'archive --list-langs',
      createContext('en', {
        loading: true,
      })
    );

    expect(result.result.blocks[0]).toEqual({
      type: 'system',
      text: 'GitHub enrichment is still loading. Showing the local catalog.',
    });
    expect(result.result.blocks[1]).toMatchObject({
      type: 'recordList',
      title: 'Available archive languages:',
    });
  });
});
