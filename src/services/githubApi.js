const BASE_URL = 'https://api.github.com';

/**
 * Busca o README.md já renderizado em HTML de um repositório no GitHub.
 * @param {string} owner — dono da repo (ex: 'jozanardo')
 * @param {string} repo  — nome da repo (ex: 'jozanardo')
 * @returns {Promise<string>} HTML do README.md
 */
export async function fetchReadmeHtml(owner, repo) {
  const res = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/readme`,
    { headers: { Accept: 'application/vnd.github.v3.html' } }
  );
  if (!res.ok) {
    throw new Error(`GitHub API retornou ${res.status}`);
  }
  return await res.text();
}

/**
 * Busca a lista de repositórios públicos de um usuário no GitHub.
 * @param {string} username — nome de usuário no GitHub
 * @returns {Promise<Array>} array de objetos de repositório
 */
export async function fetchUserRepos(username) {
  const res = await fetch(`${BASE_URL}/users/${username}/repos`);
  if (!res.ok) {
    throw new Error(`GitHub API retornou ${res.status}`);
  }
  return await res.json();
}
