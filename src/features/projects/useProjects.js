import { useState, useMemo } from 'react';
import repositories from '../../github_repos.json';
import { filterProjects } from './projectsService';

/**
 * Hook para fornecer a lista de projetos filtrada.
 * @param {Object} initialFilters — { lang?, desc?, name? }
 */
export function useProjects(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  const filteredProjects = useMemo(
    () => filterProjects(repositories, filters),
    [filters]
  );

  return { filteredProjects, filters, setFilters };
}
