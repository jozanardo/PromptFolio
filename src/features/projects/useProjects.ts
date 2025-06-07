import { useState, useEffect } from 'react';
import { fetchUserRepos } from '../../services/githubApi';
import { filterProjects, ProjectRepo, ProjectFilters } from './projectsService';

export function useProjects(initialFilters: ProjectFilters = {}) {
  const [repos, setRepos] = useState<ProjectRepo[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUserRepos('jozanardo')
      .then(rs => setRepos(rs))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = filterProjects(repos, filters);
  return { filteredProjects, filters, setFilters, loading, error };
}
