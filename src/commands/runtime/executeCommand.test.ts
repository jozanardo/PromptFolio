import { describe, expect, it, vi } from 'vitest';
import { commandRegistry } from '../../commands';
import { createCommandRegistry } from './commandRegistry';
import { executeCommand } from './executeCommand';
import type {
  AnyCommandDefinition,
  CommandContext,
} from '../../types';

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
    services: overrides.services ?? ({} as CommandContext['services']),
  };
}

describe('executeCommand', () => {
  it.each([
    {
      lang: 'en',
      blocks: [
        {
          type: 'text',
          text: 'PromptFolio is a personal archive guided by commands.',
        },
        {
          type: 'recordList',
          title: 'Start exploring:',
          records: [
            {
              title: 'work',
              subtitle: 'Browse selected work and useful filters.',
            },
            {
              title: 'timeline',
              subtitle: 'Follow the chronological path through the archive.',
            },
            {
              title: 'journey',
              subtitle: 'Read the more authored version of that path.',
            },
            {
              title: 'whoami',
              subtitle: 'Read the personal identity entry.',
            },
            {
              title: 'ls',
              subtitle: 'See the compact directory of archive areas.',
            },
            {
              title: 'help',
              subtitle: 'List every available command.',
            },
          ],
        },
        {
          type: 'text',
          text: 'Type a command or use one of the shortcuts above to fill the prompt.',
        },
      ],
    },
    {
      lang: 'pt',
      blocks: [
        {
          type: 'text',
          text: 'PromptFolio é um arquivo pessoal guiado por comandos.',
        },
        {
          type: 'recordList',
          title: 'Comece explorando:',
          records: [
            {
              title: 'work',
              subtitle: 'Conheça trabalhos selecionados e filtros úteis.',
            },
            {
              title: 'timeline',
              subtitle: 'Acompanhe o percurso cronológico pelo arquivo.',
            },
            {
              title: 'journey',
              subtitle: 'Leia a versão mais autoral desse percurso.',
            },
            {
              title: 'whoami',
              subtitle: 'Leia o retrato pessoal.',
            },
            {
              title: 'ls',
              subtitle: 'Veja o diretório compacto das áreas do arquivo.',
            },
            {
              title: 'help',
              subtitle: 'Liste todos os comandos disponíveis.',
            },
          ],
        },
        {
          type: 'text',
          text: 'Digite um comando ou use um dos atalhos acima para preencher o prompt.',
        },
      ],
    },
  ] as const)(
    'executes start as the localized discovery entrypoint in $lang',
    async ({ lang, blocks }) => {
      const result = await executeCommand('start', createContext(lang));

      expect(result.result.blocks).toEqual(blocks);
      const recordList = result.result.blocks.find(
        block => block.type === 'recordList'
      );

      expect(
        recordList?.records.every(record => commandRegistry.get(record.title))
      ).toBe(true);
    }
  );

  it.each([
    {
      lang: 'en',
      title: 'Available commands:',
      items: [
        {
          command: 'start',
          description: 'Show the opening map of the archive.',
          usage: 'start',
        },
        {
          command: 'help',
          description: 'List all available commands.',
          usage: 'help',
        },
        {
          command: 'ls',
          description: 'Show a compact directory of archive areas.',
          usage: 'ls',
        },
        {
          command: 'whoami',
          description: 'Show a personal snapshot of João.',
          usage: 'whoami',
        },
        {
          command: 'about',
          description: 'Read the career and engineering profile summary.',
          usage: 'about',
        },
        {
          command: 'skills',
          description:
            'Browse backend, scale, resilience, performance, and observability skills.',
          usage: 'skills',
        },
        {
          command: 'work',
          description:
            'Browse the curated work catalog with optional filters.',
          usage:
            'work [--lang=<language>] [--text=<query>] [--name=<name>] [--tag=<tag>]',
        },
        {
          command: 'archive',
          description: 'Browse the broader historical project catalog.',
          usage:
            'archive [--lang=<language>] [--text=<query>] [--name=<name>] [--tag=<tag>]',
        },
        {
          command: 'timeline',
          description:
            'Browse the chronological archive of work, study, and career markers.',
          usage: 'timeline [--group=year|cycle|kind]',
        },
        {
          command: 'journey',
          description:
            'Read the authored narrative behind the chronological archive.',
          usage: 'journey',
        },
        {
          command: 'contact',
          description: 'Find verified ways to reach me.',
          usage: 'contact',
        },
        {
          command: 'clear',
          description: 'Clears the history (header stays).',
          usage: 'clear',
        },
      ],
    },
    {
      lang: 'pt',
      title: 'Comandos disponíveis:',
      items: [
        {
          command: 'start',
          description: 'Mostra o mapa inicial do arquivo.',
          usage: 'start',
        },
        {
          command: 'help',
          description: 'Lista todos os comandos disponíveis.',
          usage: 'help',
        },
        {
          command: 'ls',
          description: 'Mostra um diretório compacto das áreas do arquivo.',
          usage: 'ls',
        },
        {
          command: 'whoami',
          description: 'Mostra um retrato pessoal do João.',
          usage: 'whoami',
        },
        {
          command: 'about',
          description: 'Leia o resumo da trajetória e do perfil de engenharia.',
          usage: 'about',
        },
        {
          command: 'skills',
          description:
            'Navegue por habilidades de backend, escala, resiliência, desempenho e observabilidade.',
          usage: 'skills',
        },
        {
          command: 'work',
          description:
            'Navegue pelo catálogo curado de trabalho com filtros opcionais.',
          usage:
            'work [--lang=<linguagem>] [--text=<busca>] [--name=<nome>] [--tag=<tag>]',
        },
        {
          command: 'archive',
          description: 'Navegue pelo catálogo histórico mais amplo de projetos.',
          usage:
            'archive [--lang=<linguagem>] [--text=<busca>] [--name=<nome>] [--tag=<tag>]',
        },
        {
          command: 'timeline',
          description:
            'Navegue pelo arquivo cronológico de trabalho, estudo e marcos de carreira.',
          usage: 'timeline [--group=year|cycle|kind]',
        },
        {
          command: 'journey',
          description:
            'Leia a narrativa autoral por trás do arquivo cronológico.',
          usage: 'journey',
        },
        {
          command: 'contact',
          description: 'Encontre formas verificadas de contato.',
          usage: 'contact',
        },
        {
          command: 'clear',
          description: 'Limpa o histórico (header fixo).',
          usage: 'clear',
        },
      ],
    },
  ] as const)(
    'executes help from the registry in $lang and returns a help list block',
    async ({ lang, title, items }) => {
      const result = await executeCommand('help', createContext(lang));

      expect(result.parsedInput.commandName).toBe('help');
      expect(result.result.echoInput).toBe(true);
      expect(result.result.blocks).toEqual([
        {
          type: 'helpList',
          title,
          items,
        },
      ]);
    }
  );

  it.each([
    {
      lang: 'en',
      title: 'Archive directory:',
      records: [
        {
          title: 'discovery',
          lines: ['start', 'help', 'ls'],
        },
        {
          title: 'identity',
          lines: ['whoami', 'about', 'skills', 'contact'],
        },
        {
          title: 'work',
          lines: ['work', 'archive'],
        },
        {
          title: 'journey',
          lines: ['timeline', 'journey'],
        },
      ],
    },
    {
      lang: 'pt',
      title: 'Diretório do arquivo:',
      records: [
        {
          title: 'descoberta',
          lines: ['start', 'help', 'ls'],
        },
        {
          title: 'identidade',
          lines: ['whoami', 'about', 'skills', 'contact'],
        },
        {
          title: 'trabalho',
          lines: ['work', 'archive'],
        },
        {
          title: 'trajetória',
          lines: ['timeline', 'journey'],
        },
      ],
    },
  ] as const)(
    'executes ls as a localized compact archive directory in $lang',
    async ({ lang, title, records }) => {
      const result = await executeCommand('ls', createContext(lang));

      expect(result.result.blocks).toEqual([
        {
          type: 'recordList',
          title,
          records,
        },
      ]);
    }
  );

  it('keeps ls compact instead of duplicating the full help response', async () => {
    const help = await executeCommand('help', createContext('en'));
    const ls = await executeCommand('ls', createContext('en'));

    expect(ls.result.blocks).not.toEqual(help.result.blocks);
    expect(ls.result.blocks).toEqual([
      {
        type: 'recordList',
        title: 'Archive directory:',
        records: [
          {
            title: 'discovery',
            lines: ['start', 'help', 'ls'],
          },
          {
            title: 'identity',
            lines: ['whoami', 'about', 'skills', 'contact'],
          },
          {
            title: 'work',
            lines: ['work', 'archive'],
          },
          {
            title: 'journey',
            lines: ['timeline', 'journey'],
          },
        ],
      },
    ]);
  });

  it('appends future ls categories after the preferred archive order', async () => {
    const labCommand: AnyCommandDefinition = {
      meta: {
        name: 'lab',
        category: 'experiments',
        description: { en: 'Experimental notes', pt: 'Notas experimentais' },
        usage: { en: 'lab', pt: 'lab' },
        surfaces: {
          help: true,
          ls: true,
          search: true,
        },
      },
      translations: { en: {}, pt: {} },
      parse: () => ({
        ok: true,
        args: {},
      }),
      execute: () => ({ blocks: [] }),
    };
    const registry = createCommandRegistry([
      ...commandRegistry.list(),
      labCommand,
    ]);

    const result = await executeCommand(
      'ls',
      createContext('en', {
        registry,
      })
    );

    expect(result.result.blocks).toEqual([
      {
        type: 'recordList',
        title: 'Archive directory:',
        records: [
          {
            title: 'discovery',
            lines: ['start', 'help', 'ls'],
          },
          {
            title: 'identity',
            lines: ['whoami', 'about', 'skills', 'contact'],
          },
          {
            title: 'work',
            lines: ['work', 'archive'],
          },
          {
            title: 'journey',
            lines: ['timeline', 'journey'],
          },
          {
            title: 'experiments',
            lines: ['lab'],
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

  it('treats work boolean flags as boolean even when followed by positionals', async () => {
    const result = await executeCommand('work --help extra', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Usage: work [--lang=<language>] [--text=<query>] [--name=<name>] [--tag=<tag>] [--list-langs] [--help]',
      },
    ]);
  });

  it('executes whoami from local profile content without external services', async () => {
    const result = await executeCommand('whoami', createContext('en'));

    expect(Object.keys(createContext('en').services)).toEqual([]);
    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'João Zanardo is a Software Engineer shaped by critical systems and guided by curiosity, clarity, and the habit of turning complex problems into reliable products.',
      },
      {
        type: 'recordList',
        title: 'Personal snapshot:',
        records: [
          {
            title: 'profile',
            subtitle: 'Works with calm execution, technical depth, and attention to impact, connecting engineering decisions with product, business, and people.',
          },
          {
            title: 'interests',
            subtitle: 'Economics, technology, and entrepreneurship; subjects that help connect systems, markets, and better decisions.',
          },
          {
            title: 'hobbies',
            subtitle: 'Running, weight training, Muay Thai, games, park walks with family, and barbecue.',
          },
        ],
      },
    ]);
  });

  it('executes about as a localized career summary', async () => {
    const result = await executeCommand('about', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'Sou Engenheiro de Software com experiência em sistemas distribuídos de alta escala, formado em Ciência e Tecnologia com ênfase em Computação pela UFABC e pós-graduando em Engenharia de Software com foco em Inteligência Artificial aplicada.',
      },
      {
        type: 'recordList',
        title: 'Trajetória:',
        records: [
          {
            title: 'Santander',
            meta: 'abril de 2021 - março de 2022',
            subtitle: 'Segurança cibernética e auditoria, com base em segurança, governança e análise de sistemas críticos.',
          },
          {
            title: 'BTG Pactual',
            meta: 'março de 2022 - agosto de 2025',
            subtitle: 'Desenvolvimento de sistemas escaláveis em C#, automações, evolução de legados e migrações em ambiente financeiro crítico.',
          },
          {
            title: 'Mercado Livre',
            meta: 'setembro de 2025 - atualmente',
            subtitle: 'Construindo serviços de back-end resilientes para garantir o cumprimento das promessas de envio e entrega internacionais no Mercado Livre.',
          },
        ],
      },
    ]);
  });

  it('executes skills as localized structured categories', async () => {
    const result = await executeCommand('skills', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'recordList',
        title: 'Habilidades por categoria:',
        records: [
          {
            title: 'linguagens',
            subtitle: 'Java, Go, C#, JavaScript, TypeScript, Python',
          },
          {
            title: 'backend',
            subtitle: 'Microsserviços, APIs, sistemas distribuídos, arquitetura orientada a eventos e serviços de alto desempenho',
          },
          {
            title: 'resiliência',
            subtitle: 'Isolamento de falhas, retentativas, estratégias de contingência, cache em múltiplas camadas e eficiência operacional',
          },
          {
            title: 'desempenho',
            subtitle: 'Threads virtuais, concorrência, paralelismo, latência e vazão',
          },
          {
            title: 'observabilidade',
            subtitle: 'Logs no Grafana, métricas no Datadog, rastreamento distribuído e análise de comportamento em produção',
          },
        ],
      },
    ]);
  });

  it('executes whoami as a PT-BR identity entry', async () => {
    const result = await executeCommand('whoami', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'text',
        text: 'João Zanardo é um engenheiro de software formado por sistemas críticos e guiado por curiosidade, clareza e pelo hábito de transformar problemas complexos em produtos confiáveis.',
      },
      {
        type: 'recordList',
        title: 'Retrato pessoal:',
        records: [
          {
            title: 'perfil',
            subtitle: 'Trabalha com execução calma, profundidade técnica e atenção a impacto, conectando decisões de engenharia a produto, negócio e pessoas.',
          },
          {
            title: 'interesses',
            subtitle: 'Economia, tecnologia e empreendedorismo; temas que ajudam a conectar sistemas, mercado e decisões melhores.',
          },
          {
            title: 'hobbies',
            subtitle: 'Corrida, musculação, Muay Thai, games, passeios no parque com a família e churrasco.',
          },
        ],
      },
    ]);
  });

  it('executes contact without unresolved placeholders', async () => {
    const result = await executeCommand('contact', createContext('en'));

    expect(result.result.blocks).toEqual([
      {
        type: 'recordList',
        title: 'Verified channels:',
        records: [
          {
            title: 'GitHub',
            subtitle: 'https://github.com/jozanardo',
            href: 'https://github.com/jozanardo',
          },
          {
            title: 'LinkedIn',
            subtitle: 'https://www.linkedin.com/in/joão-zanardo/',
            href: 'https://www.linkedin.com/in/joão-zanardo/',
          },
          {
            title: 'Email',
            subtitle: 'jozanardo@gmail.com',
            href: 'mailto:jozanardo@gmail.com',
          },
        ],
      },
      {
        type: 'text',
        text: 'GitHub, LinkedIn, and email are the verified public channels for this archive.',
      },
    ]);
    expect(JSON.stringify(result.result.blocks)).not.toContain('[Your');
    expect(JSON.stringify(result.result.blocks)).not.toContain('[Seu');
  });

  it('executes contact as a PT-BR channel list', async () => {
    const result = await executeCommand('contact', createContext('pt'));

    expect(result.result.blocks).toEqual([
      {
        type: 'recordList',
        title: 'Canais verificados:',
        records: [
          {
            title: 'GitHub',
            subtitle: 'https://github.com/jozanardo',
            href: 'https://github.com/jozanardo',
          },
          {
            title: 'LinkedIn',
            subtitle: 'https://www.linkedin.com/in/joão-zanardo/',
            href: 'https://www.linkedin.com/in/joão-zanardo/',
          },
          {
            title: 'E-mail',
            subtitle: 'jozanardo@gmail.com',
            href: 'mailto:jozanardo@gmail.com',
          },
        ],
      },
      {
        type: 'text',
        text: 'GitHub, LinkedIn e e-mail são os canais públicos verificados deste arquivo.',
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
