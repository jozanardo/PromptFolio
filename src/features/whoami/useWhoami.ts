import { useState } from 'react';
import { fetchReadmeHtml } from '../../services/githubApi';

export interface UseWhoamiResult {
  loading: boolean;
  html: string;
  error: Error | null;
  loadReadme: () => Promise<void>;
}

export function useWhoami(
  owner: string = 'jozanardo',
  repo: string = 'jozanardo'
): UseWhoamiResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [html, setHtml]       = useState<string>('');
  const [error, setError]     = useState<Error | null>(null);

  const loadReadme = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const markdownHtml = await fetchReadmeHtml(owner, repo);
      setHtml(markdownHtml);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, html, error, loadReadme };
}
