import type { ProjectContent, CuratedProject } from '../content/projects';
import type { ProjectRepo } from '../features/projects/projectsService';
import type { SupportedLocale } from '../types';

export interface ProjectCatalogEntry extends CuratedProject {
  language: string | null;
  url: string;
  updatedAt: string | null;
  remoteDescription: string | null;
}

export interface ProjectCatalogFilters {
  locale: SupportedLocale;
  lang?: string | null;
  text?: string | null;
  name?: string | null;
  tag?: string | null;
  featuredOnly?: boolean;
}

export interface ProjectLanguageSummary {
  language: string;
  count: number;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function includesNeedle(value: string, needle: string): boolean {
  return normalize(value).includes(normalize(needle));
}

export function buildProjectCatalog(
  content: ProjectContent,
  repos: readonly ProjectRepo[] = []
): ProjectCatalogEntry[] {
  const reposByName = new Map(
    repos.map(repo => [normalize(repo.name), repo] as const)
  );

  return [...content.projects]
    .sort((left, right) => left.order - right.order)
    .map(project => {
      const repo = reposByName.get(normalize(project.repoName));

      return {
        ...project,
        language: repo?.language ?? project.primaryLanguage,
        url: repo?.html_url ?? project.links.repo,
        updatedAt: repo?.updated_at ?? null,
        remoteDescription: repo?.description ?? null,
      };
    });
}

export function filterProjectCatalog(
  catalog: readonly ProjectCatalogEntry[],
  filters: ProjectCatalogFilters
): ProjectCatalogEntry[] {
  return catalog.filter(project => {
    if (filters.featuredOnly && !project.featured) {
      return false;
    }

    if (
      filters.lang &&
      normalize(project.language ?? '') !== normalize(filters.lang)
    ) {
      return false;
    }

    if (
      filters.name &&
      !includesNeedle(project.slug, filters.name) &&
      !includesNeedle(project.repoName, filters.name)
    ) {
      return false;
    }

    if (
      filters.tag &&
      !project.tags.some(tag => normalize(tag) === normalize(filters.tag ?? ''))
    ) {
      return false;
    }

    if (filters.text) {
      const textFields = [
        project.slug,
        project.repoName,
        project.summary[filters.locale],
        project.impact[filters.locale],
        project.remoteDescription ?? '',
        ...project.tags,
      ];

      if (!textFields.some(field => includesNeedle(field, filters.text ?? ''))) {
        return false;
      }
    }

    return true;
  });
}

export function listProjectLanguages(
  catalog: readonly ProjectCatalogEntry[]
): ProjectLanguageSummary[] {
  const counts = new Map<string, number>();

  catalog.forEach(project => {
    if (!project.language) {
      return;
    }

    counts.set(project.language, (counts.get(project.language) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((left, right) => left.language.localeCompare(right.language));
}
