import { tmdbClientFetch } from '@/lib/tmdb.client';
import { MovieCredits, MovieDetail, MovieListResponse } from '@/types/movie';

export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
): Promise<MovieListResponse> {
  return tmdbClientFetch<MovieListResponse>(`/trending/movie/${timeWindow}`);
}

export async function getPopularMovies(
  page: number = 1,
): Promise<MovieListResponse> {
  return tmdbClientFetch<MovieListResponse>(`/movie/popular?page=${page}`);
}

export async function getNowPlayingMovies(
  page: number = 1,
): Promise<MovieListResponse> {
  return tmdbClientFetch<MovieListResponse>(`/movie/now_playing?page=${page}`);
}

export async function getTopRatedMovies(
  page: number = 1,
): Promise<MovieListResponse> {
  return tmdbClientFetch<MovieListResponse>(`/movie/top_rated?page=${page}`);
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  return tmdbClientFetch<MovieDetail>(`/movie/${id}`);
}

export async function getMovieCredits(id: number): Promise<MovieCredits> {
  return tmdbClientFetch<MovieCredits>(`/movie/${id}/credits`);
}

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<MovieListResponse> {
  return tmdbClientFetch<MovieListResponse>(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
  );
}

export async function getSimilarMovies(id: number): Promise<MovieListResponse> {
  return tmdbClientFetch<MovieListResponse>(`/movie/${id}/similar`);
}
