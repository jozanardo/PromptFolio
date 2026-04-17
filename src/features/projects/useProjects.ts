import { useState, useEffect } from 'react';
import { fetchUserRepos } from '../../services/githubApi';
import { ProjectRepo } from './projectsService';

export interface UseProjectsResult {
  repos: ProjectRepo[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
}

export function useProjects(): UseProjectsResult {
  const [repos, setRepos] = useState<ProjectRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const nextRepos = await fetchUserRepos('jozanardo');
      setRepos(nextRepos);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshProjects();
  }, []);

  return { repos, loading, error, refreshProjects };
}
