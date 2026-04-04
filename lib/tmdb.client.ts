export const tmdbClientFetch = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  // Parse any query params already in the endpoint string
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString ?? '');
  params.set('endpoint', path);

  const res = await fetch(`/api/tmdb?${params.toString()}`, {
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
};
