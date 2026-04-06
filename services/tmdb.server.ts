/**
 * Server-only TMDB service.
 * Uses process.env.TMDB_API_KEY directly — never import this in Client Components.
 * Used for SSR prefetching in page.tsx Server Components.
 */
import { tmdbFetch } from '@/lib/tmdb';
import { MovieCredits, MovieDetail, MovieListResponse } from '@/types/movie';

export async function getPopularMovies(page = 1): Promise<MovieListResponse> {
  // revalidate: 3600 — popular list changes hourly at most; stale data acceptable
  return tmdbFetch<MovieListResponse>(`/movie/popular?page=${page}`, {
    next: { revalidate: 3600 },
  });
}

export async function getNowPlayingMovies(
  page = 1,
): Promise<MovieListResponse> {
  // revalidate: 1800 — now playing changes more frequently (new releases daily)
  return tmdbFetch<MovieListResponse>(`/movie/now_playing?page=${page}`, {
    next: { revalidate: 1800 },
  });
}

export async function getTopRatedMovies(page = 1): Promise<MovieListResponse> {
  // revalidate: 86400 — all-time rankings change very slowly, once a day is fine
  return tmdbFetch<MovieListResponse>(`/movie/top_rated?page=${page}`, {
    next: { revalidate: 86400 },
  });
}

export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
): Promise<MovieListResponse> {
  // revalidate: 3600 — trending refreshes throughout the day
  return tmdbFetch<MovieListResponse>(`/trending/movie/${timeWindow}`, {
    next: { revalidate: 3600 },
  });
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  // revalidate: 86400 — movie metadata (title, overview, genres) almost never changes
  return tmdbFetch<MovieDetail>(`/movie/${id}`, {
    next: { revalidate: 86400 },
  });
}

export async function getMovieCredits(id: number): Promise<MovieCredits> {
  // force-cache — cast and crew are permanent facts, never need revalidation
  return tmdbFetch<MovieCredits>(`/movie/${id}/credits`, {
    cache: 'force-cache',
  });
}

export async function getSimilarMovies(id: number): Promise<MovieListResponse> {
  // revalidate: 86400 — similar movies list is stable
  return tmdbFetch<MovieListResponse>(`/movie/${id}/similar`, {
    next: { revalidate: 86400 },
  });
}
