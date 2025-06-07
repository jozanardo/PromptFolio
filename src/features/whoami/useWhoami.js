import { useState } from 'react';
import { fetchReadmeHtml } from './whoamiService';

/**
 * Hook para carregar o README do GitHub via fetchReadmeHtml().
 */
export function useWhoami() {
  const [loading, setLoading] = useState(false);
  const [html,    setHtml]    = useState('');
  const [error,   setError]   = useState(null);

  async function loadReadme() {
    setLoading(true);
    setError(null);
    try {
      const markdownHtml = await fetchReadmeHtml();
      setHtml(markdownHtml);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return { loading, html, error, loadReadme };
}
