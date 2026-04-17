import { useState } from 'react';
import { fetchReadmeHtml } from '../../services/githubApi';

export interface UseWhoamiResult {
  loading: boolean;
  error: Error | null;
  fetchReadme: () => Promise<string>;
}

export function useWhoami(
  owner: string = 'jozanardo',
  repo: string = 'jozanardo'
): UseWhoamiResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReadme = async (): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      return await fetchReadmeHtml(owner, repo);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchReadme };
}
