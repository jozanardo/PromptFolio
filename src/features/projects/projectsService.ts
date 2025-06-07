export interface ProjectRepo {
  name: string;
  description: string | null;
  language:  string | null;
  html_url:  string;
  updated_at: string;
}

export interface ProjectFilters {
  lang?: string | null;
  desc?: string | null;
  name?: string | null;
}

export function filterProjects(
  repos: ProjectRepo[],
  filters: ProjectFilters = {}
): ProjectRepo[] {
  const { lang, desc, name } = filters;

  return repos.filter(repo => {
    if (lang && repo.language?.toLowerCase() !== lang.toLowerCase()) {
      return false;
    }
    if (desc && !repo.description?.toLowerCase().includes(desc.toLowerCase())) {
      return false;
    }
    if (name && !repo.name.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return true;
  });
}
