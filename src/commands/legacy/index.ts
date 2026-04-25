import { filterProjects } from '../../features/projects/projectsService';
import type {
  AnyCommandDefinition,
  CommandDefinition,
  CommandExecutionResult,
} from '../../types';
import { validateTranslations } from '../runtime/validateTranslations';

const legacyTranslations = validateTranslations('legacy-commands', {
  en: {
    about: {
      meta: {
        description: 'Know about me',
        usage: 'about',
      },
      title: 'About me:',
      lines: [
        'I am passionate about technology and software development.',
        'Currently studying Computer Science at UFABC.',
      ],
    },
    skills: {
      meta: {
        description: 'What tech stacks I use',
        usage: 'skills',
      },
      title: 'My skills include:',
      lines: [
        '- TypeScript, JavaScript, Python, Java, C#, Go, Haskell',
        '- React, Node.js, NestJS, Next.js, Tailwind CSS',
        '- Git, Docker, Linux',
      ],
    },
    contact: {
      meta: {
        description: 'Want to say something?',
        usage: 'contact',
      },
      title: 'Contact me:',
      lines: [
        '- GitHub: https://github.com/jozanardo',
        '- LinkedIn: [Your LinkedIn]',
        '- Email: [Your Email]',
      ],
    },
    whoami: {
      meta: {
        description: 'What I do',
        usage: 'whoami',
      },
      loading: 'Loading GitHub README…',
    },
    projects: {
      meta: {
        description:
          'See my projects (use filters: [--lang=<language>] [--desc=<text>] [--name=<name>]).',
        usage:
          'projects [--lang=<language>] [--desc=<text>] [--name=<name>]',
      },
      helpUsage:
        'Usage: projects [--lang=<language>] [--desc=<text>] [--name=<name>] [--list-langs] [--help]',
      loadingLanguages: 'Loading languages…',
      loadingProjects: 'Searching projects…',
      availableLangsTitle: 'Available languages:',
      projectSingular: 'project',
      projectPlural: 'projects',
      allProjectsTitle: 'All projects:',
      foundMessage: 'Found',
      descriptionLabel: 'Description',
      urlLabel: 'URL',
      updatedLabel: 'Updated at',
      filterLangLabel: 'language',
      filterDescLabel: 'description',
      filterNameLabel: 'name',
      noProjectsMessage: 'No projects found with the applied filters.',
    },
  },
  pt: {
    about: {
      meta: {
        description: 'Saiba mais sobre mim.',
        usage: 'about',
      },
      title: 'Sobre mim:',
      lines: [
        'Sou apaixonado por tecnologia e desenvolvimento de software.',
        'Atualmente estudando Ciência da Computação na UFABC.',
      ],
    },
    skills: {
      meta: {
        description: 'Quais tecnologias eu uso.',
        usage: 'skills',
      },
      title: 'Minhas habilidades incluem:',
      lines: [
        '- TypeScript, JavaScript, Python, Java, C#, Go, Haskell',
        '- React, Node.js, NestJS, Next.js, Tailwind CSS',
        '- Git, Docker, Linux',
      ],
    },
    contact: {
      meta: {
        description: 'Quer dizer algo?',
        usage: 'contact',
      },
      title: 'Entre em contato:',
      lines: [
        '- GitHub: https://github.com/jozanardo',
        '- LinkedIn: [Seu LinkedIn]',
        '- Email: [Seu Email]',
      ],
    },
    whoami: {
      meta: {
        description: 'Quem sou eu.',
        usage: 'whoami',
      },
      loading: 'Carregando README do GitHub…',
    },
    projects: {
      meta: {
        description:
          'Veja meus projetos (use filtros: [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>]).',
        usage:
          'projects [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>]',
      },
      helpUsage:
        'Uso: projects [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>] [--list-langs] [--help]',
      loadingLanguages: 'Carregando linguagens…',
      loadingProjects: 'Buscando projetos…',
      availableLangsTitle: 'Linguagens disponíveis:',
      projectSingular: 'projeto',
      projectPlural: 'projetos',
      allProjectsTitle: 'Todos os projetos:',
      foundMessage: 'Encontrados',
      descriptionLabel: 'Descrição',
      urlLabel: 'URL',
      updatedLabel: 'Atualizado em',
      filterLangLabel: 'linguagem',
      filterDescLabel: 'descrição',
      filterNameLabel: 'nome',
      noProjectsMessage: 'Nenhum projeto encontrado com os filtros aplicados.',
    },
  },
});

type EmptyArgs = Record<string, never>;

interface ProjectsArgs {
  langFilter: string | null;
  descFilter: string | null;
  nameFilter: string | null;
  showHelp: boolean;
  showLangs: boolean;
}

function createTextResult(lines: string[]): CommandExecutionResult {
  return {
    blocks: lines.map(text => ({
      type: 'text',
      text,
    })),
  };
}

function createStaticCommand(
  name: 'about' | 'skills' | 'contact'
): CommandDefinition<EmptyArgs, typeof legacyTranslations> {
  return {
    meta: {
      name,
      category: 'identity',
      description: {
        en: legacyTranslations.en[name].meta.description,
        pt: legacyTranslations.pt[name].meta.description,
      },
      usage: {
        en: legacyTranslations.en[name].meta.usage,
        pt: legacyTranslations.pt[name].meta.usage,
      },
      surfaces: {
        help: true,
        ls: true,
        search: true,
      },
    },
    translations: legacyTranslations,
    parse: () => ({
      ok: true,
      args: {},
    }),
    execute: (_, context) => {
      const commandTranslations = legacyTranslations[context.lang][name];
      return createTextResult([
        commandTranslations.title,
        ...commandTranslations.lines,
      ]);
    },
  };
}

const whoamiCommand: CommandDefinition<EmptyArgs, typeof legacyTranslations> = {
  meta: {
    name: 'whoami',
    category: 'identity',
    description: {
      en: legacyTranslations.en.whoami.meta.description,
      pt: legacyTranslations.pt.whoami.meta.description,
    },
    usage: {
      en: legacyTranslations.en.whoami.meta.usage,
      pt: legacyTranslations.pt.whoami.meta.usage,
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: legacyTranslations,
  parse: () => ({
    ok: true,
    args: {},
  }),
  execute: async (_, context) => {
    const commandTranslations = legacyTranslations[context.lang].whoami;

    context.setHistory(prev => [
      ...prev,
      {
        type: 'output',
        blocks: [
          {
            type: 'system',
            text: `🔄 ${commandTranslations.loading}`,
          },
        ],
      },
    ]);

    try {
      const html = await context.services.whoami.fetchReadme();

      return {
        blocks: [
          {
            type: 'markdown',
            html,
          },
        ],
      };
    } catch (error: any) {
      return {
        blocks: [
          {
            type: 'error',
            command: 'whoami',
            message: error.message,
          },
        ],
      };
    }
  },
};

const projectsCommand: CommandDefinition<ProjectsArgs, typeof legacyTranslations> = {
  meta: {
    name: 'projects',
    category: 'work',
    description: {
      en: legacyTranslations.en.projects.meta.description,
      pt: legacyTranslations.pt.projects.meta.description,
    },
    usage: {
      en: legacyTranslations.en.projects.meta.usage,
      pt: legacyTranslations.pt.projects.meta.usage,
    },
    parsing: {
      booleanFlags: ['help', 'list-langs'],
      valueFlags: ['lang', 'desc', 'name'],
    },
    surfaces: {
      help: true,
      ls: true,
      search: true,
    },
  },
  translations: legacyTranslations,
  parse: input => ({
    ok: true,
    args: {
      langFilter:
        typeof input.flags.lang === 'string'
          ? input.flags.lang.toLowerCase()
          : null,
      descFilter:
        typeof input.flags.desc === 'string'
          ? input.flags.desc.toLowerCase()
          : null,
      nameFilter:
        typeof input.flags.name === 'string'
          ? input.flags.name.toLowerCase()
          : null,
      showHelp: input.flags.help === true,
      showLangs: input.flags['list-langs'] === true,
    },
  }),
  execute: (args, context) => {
    const commandTranslations = legacyTranslations[context.lang].projects;

    if (args.showHelp) {
      return createTextResult([commandTranslations.helpUsage]);
    }

    if (context.projectCatalog.loading) {
      return {
        blocks: [
          {
            type: 'system',
            text: `🔄 ${commandTranslations.loadingProjects}`,
          },
        ],
      };
    }

    if (context.projectCatalog.error) {
      return createTextResult([`❌ ${context.projectCatalog.error}`]);
    }

    if (args.showLangs) {
      const langs = Array.from(
        new Set(
          context.projectCatalog.repos
            .map(repo => repo.language)
            .filter(Boolean)
        )
      ) as string[];

      const lines = [commandTranslations.availableLangsTitle];

      langs.forEach(langCode => {
        const count = context.projectCatalog.repos.filter(
          repo => repo.language === langCode
        ).length;

        lines.push(
          `  ${langCode} (${count} ${
            count === 1
              ? commandTranslations.projectSingular
              : commandTranslations.projectPlural
          })`
        );
      });

      return createTextResult(lines);
    }

    const filteredProjects = filterProjects(context.projectCatalog.repos, {
      lang: args.langFilter,
      desc: args.descFilter,
      name: args.nameFilter,
    });

    const filters: string[] = [];

    if (args.langFilter) {
      filters.push(
        `${commandTranslations.filterLangLabel}: ${args.langFilter}`
      );
    }

    if (args.descFilter) {
      filters.push(
        `${commandTranslations.filterDescLabel}: "${args.descFilter}"`
      );
    }

    if (args.nameFilter) {
      filters.push(
        `${commandTranslations.filterNameLabel}: "${args.nameFilter}"`
      );
    }

    const lines = [
      filters.length > 0
        ? `${commandTranslations.allProjectsTitle} (${filters.join(', ')})`
        : commandTranslations.allProjectsTitle,
    ];

    if (filteredProjects.length === 0) {
      lines.push(commandTranslations.noProjectsMessage);
      return createTextResult(lines);
    }

    lines.push(
      `${commandTranslations.foundMessage} ${filteredProjects.length} ${
        filteredProjects.length === 1
          ? commandTranslations.projectSingular
          : commandTranslations.projectPlural
      }`
    );

    filteredProjects.forEach((repo, index) => {
      lines.push(`\n[${index + 1}] ${repo.name} (${repo.language || 'N/A'})`);

      if (repo.description) {
        lines.push(
          `    ${commandTranslations.descriptionLabel}: ${repo.description}`
        );
      }

      lines.push(`    ${commandTranslations.urlLabel}: ${repo.html_url}`);
      lines.push(
        `    ${commandTranslations.updatedLabel}: ${new Date(
          repo.updated_at
        ).toLocaleDateString()}`
      );
    });

    return createTextResult(lines);
  },
};

export const legacyCommands: AnyCommandDefinition[] = [
  whoamiCommand,
  createStaticCommand('about'),
  createStaticCommand('skills'),
  projectsCommand,
  createStaticCommand('contact'),
];
