import type {
  CommandContext,
  ParsedCommandInput,
  RecordListEntry,
  SupportedLocale,
  TerminalBlock,
} from '../../types';
import { resolveProjectContent } from '../../content/projects';
import type { ProjectStatus } from '../../content/projects';
import {
  buildProjectCatalog,
  filterProjectCatalog,
  listProjectLanguages,
  type ProjectCatalogEntry,
  type ProjectCatalogFilters,
} from '../../services/projectCatalog';

export interface WorkFilterArgs {
  langFilter: string | null;
  textFilter: string | null;
  nameFilter: string | null;
  tagFilter: string | null;
  showHelp: boolean;
  showLangs: boolean;
}

export interface WorkCommandCopy {
  projectSingular: string;
  projectPlural: string;
  statusLabels: Record<ProjectStatus, string>;
  loadingFallback: string;
  errorPrefix: string;
  errorSuffix: string;
}

export const workParsing = {
  booleanFlags: ['help', 'list-langs'],
  valueFlags: ['lang', 'desc', 'name', 'tag'],
} as const;

export function parseWorkFilters(input: ParsedCommandInput): WorkFilterArgs {
  return {
    langFilter: typeof input.flags.lang === 'string' ? input.flags.lang : null,
    textFilter: typeof input.flags.desc === 'string' ? input.flags.desc : null,
    nameFilter: typeof input.flags.name === 'string' ? input.flags.name : null,
    tagFilter: typeof input.flags.tag === 'string' ? input.flags.tag : null,
    showHelp: input.flags.help === true,
    showLangs: input.flags['list-langs'] === true,
  };
}

export function createCatalog(context: CommandContext): ProjectCatalogEntry[] {
  return buildProjectCatalog(
    resolveProjectContent(context.content.projects),
    context.projectCatalog.repos
  );
}

export function createProjectFilters(
  args: WorkFilterArgs,
  locale: SupportedLocale,
  options: Pick<ProjectCatalogFilters, 'featuredOnly' | 'highlightedOnly'> = {}
): ProjectCatalogFilters {
  return {
    locale,
    lang: args.langFilter,
    text: args.textFilter,
    name: args.nameFilter,
    tag: args.tagFilter,
    ...options,
  };
}

function formatProjectMeta(
  project: ProjectCatalogEntry,
  statusLabels: Record<ProjectStatus, string>
): string | undefined {
  return [project.language, String(project.year), statusLabels[project.status]]
    .filter(Boolean)
    .join(' · ');
}

export function createProjectRecord(
  project: ProjectCatalogEntry,
  locale: SupportedLocale,
  statusLabels: Record<ProjectStatus, string>,
  subtitleKind: 'summary' | 'impact'
): RecordListEntry {
  return {
    title: project.slug,
    meta: formatProjectMeta(project, statusLabels),
    subtitle: project[subtitleKind][locale],
    href: project.url,
    lines: [project.repoName, ...project.tags.map(tag => `#${tag}`)],
  };
}

export function createProjectRecords(
  projects: readonly ProjectCatalogEntry[],
  locale: SupportedLocale,
  statusLabels: Record<ProjectStatus, string>,
  subtitleKind: 'summary' | 'impact'
): RecordListEntry[] {
  return projects.map(project =>
    createProjectRecord(project, locale, statusLabels, subtitleKind)
  );
}

export function createLanguageRecords(
  catalog: readonly ProjectCatalogEntry[],
  copy: Pick<WorkCommandCopy, 'projectSingular' | 'projectPlural'>
): RecordListEntry[] {
  return listProjectLanguages(catalog).map(({ language, count }) => ({
    title: language,
    subtitle: `${count} ${
      count === 1 ? copy.projectSingular : copy.projectPlural
    }`,
  }));
}

export function createEnrichmentBlocks(
  context: CommandContext,
  copy: WorkCommandCopy
): TerminalBlock[] {
  if (context.projectCatalog.loading) {
    return [
      {
        type: 'system',
        text: copy.loadingFallback,
      },
    ];
  }

  if (context.projectCatalog.error) {
    return [
      {
        type: 'system',
        text: `${copy.errorPrefix}${context.projectCatalog.error}${copy.errorSuffix}`,
      },
    ];
  }

  return [];
}

export { filterProjectCatalog };
