/**
 * Aplica filtros básicos de linguagem, descrição e nome sobre um array de repositórios.
 * @param {Array} repos — lista de objetos { name, description, language, html_url, updated_at }
 * @param {Object} filters — { lang?: string, desc?: string, name?: string }
 * @returns {Array} repositórios filtrados
 */
export function filterProjects(repos, filters = {}) {
  return repos.filter(repo => {
    if (filters.lang && repo.language?.toLowerCase() !== filters.lang.toLowerCase()) {
      return false;
    }
    if (filters.desc && !repo.description?.toLowerCase().includes(filters.desc.toLowerCase())) {
      return false;
    }
    if (filters.name && !repo.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    return true;
  });
}