import { describe, expect, it } from 'vitest';
import { projectContent } from '../content/projects';
import {
  buildProjectCatalog,
  filterProjectCatalog,
  listProjectLanguages,
} from './projectCatalog';
import type { ProjectRepo } from '../features/projects/projectsService';

const githubRepos: ProjectRepo[] = [
  {
    name: 'PromptFolio',
    description: 'My professional portfolio based on a CMD.',
    language: 'TypeScript',
    html_url: 'https://github.com/jozanardo/PromptFolio',
    updated_at: '2026-04-30T00:06:54Z',
  },
  {
    name: 'MyOrders',
    description: null,
    language: 'C#',
    html_url: 'https://github.com/jozanardo/MyOrders',
    updated_at: '2025-08-14T23:41:52Z',
  },
];

describe('projectCatalog', () => {
  it('merges curated project content with optional GitHub metadata', () => {
    const catalog = buildProjectCatalog(projectContent, githubRepos);
    const promptfolio = catalog.find(project => project.slug === 'promptfolio');

    expect(promptfolio).toMatchObject({
      slug: 'promptfolio',
      repoName: 'PromptFolio',
      language: 'TypeScript',
      url: 'https://github.com/jozanardo/PromptFolio',
      updatedAt: '2026-04-30T00:06:54Z',
      remoteDescription: 'My professional portfolio based on a CMD.',
      summary: {
        en: 'Command-guided portfolio shaped as a calm personal archive.',
        pt: 'Portfólio guiado por comandos, moldado como um arquivo pessoal calmo.',
      },
    });
  });

  it('keeps local project records usable when GitHub has no matching repo', () => {
    const catalog = buildProjectCatalog(projectContent, []);
    const graphics3d = catalog.find(
      project => project.slug === 'grafica-3d-animacoes'
    );

    expect(graphics3d).toMatchObject({
      slug: 'grafica-3d-animacoes',
      language: 'C++',
      url: 'https://github.com/jozanardo/Aplicao-grafica-3D-com-animacoes',
      updatedAt: null,
    });
  });

  it('reflects the requested curation list and featured flags', () => {
    const catalog = buildProjectCatalog(projectContent, []);
    const bySlug = new Map(catalog.map(project => [project.slug, project]));

    expect([...bySlug.keys()]).not.toEqual(
      expect.arrayContaining([
        'logic-and-algorithms',
        'reda-mind',
        'lfa-q1-2024',
      ])
    );
    expect(bySlug.get('grafica-3d-animacoes')).toMatchObject({
      featured: false,
    });
    expect(bySlug.get('napster')).toMatchObject({
      featured: true,
    });
    expect(bySlug.get('zookepeer')).toMatchObject({
      featured: true,
    });
  });

  it('filters by language, localized text, name, and tag using one shared matcher', () => {
    const catalog = buildProjectCatalog(projectContent, githubRepos);

    expect(
      filterProjectCatalog(catalog, {
        locale: 'en',
        lang: 'typescript',
        text: 'command archive',
        name: 'prompt',
        tag: 'portfolio',
      }).map(project => project.slug)
    ).toEqual(['promptfolio']);
  });

  it('summarizes languages from the merged catalog', () => {
    const catalog = buildProjectCatalog(projectContent, githubRepos);

    expect(listProjectLanguages(catalog)).toContainEqual({
      language: 'TypeScript',
      count: 2,
    });
    expect(listProjectLanguages(catalog)).toContainEqual({
      language: 'Java',
      count: 2,
    });
  });
});
