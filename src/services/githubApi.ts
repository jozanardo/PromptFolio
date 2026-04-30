import type { ProjectRepo } from '../features/projects/projectsService';

const BASE_URL = 'https://api.github.com';

export async function fetchUserRepos(username: string): Promise<ProjectRepo[]> {
  const res = await fetch(`${BASE_URL}/users/${username}/repos`);
  if (!res.ok) {
    throw new Error(`GitHub API retornou ${res.status}`);
  }
  const data = await res.json();
  return data as ProjectRepo[];
}
