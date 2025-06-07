/**
 * Busca o README.md já renderizado em HTML da sua repo no GitHub.
 * @returns {Promise<string>} HTML do README
 */
export async function fetchReadmeHtml() {
  const res = await fetch(
    'https://api.github.com/repos/jozanardo/jozanardo/readme',
    { headers: { Accept: 'application/vnd.github.v3.html' } }
  );
  if (!res.ok) {
    throw new Error(`GitHub API retornou ${res.status}`);
  }
  return await res.text();
}
