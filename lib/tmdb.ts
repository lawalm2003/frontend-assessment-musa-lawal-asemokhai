// lib/tmdb.ts
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500',
): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const tmdbFetch = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB_API_KEY is not defined');

  const url = `${BASE_URL}${endpoint}${
    endpoint.includes('?') ? '&' : '?'
  }api_key=${apiKey}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
};
