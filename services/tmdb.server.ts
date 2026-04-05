import { tmdbFetch } from '@/lib/tmdb';
import { MovieCredits, MovieDetail, MovieListResponse } from '@/types/movie';

export async function getPopularMovies(page = 1): Promise<MovieListResponse> {
  return tmdbFetch<MovieListResponse>(`/movie/popular?page=${page}`);
}

export async function getNowPlayingMovies(
  page = 1,
): Promise<MovieListResponse> {
  return tmdbFetch<MovieListResponse>(`/movie/now_playing?page=${page}`);
}

export async function getTopRatedMovies(page = 1): Promise<MovieListResponse> {
  return tmdbFetch<MovieListResponse>(`/movie/top_rated?page=${page}`);
}

export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
): Promise<MovieListResponse> {
  return tmdbFetch<MovieListResponse>(`/trending/movie/${timeWindow}`);
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(`/movie/${id}`);
}

export async function getMovieCredits(id: number): Promise<MovieCredits> {
  return tmdbFetch<MovieCredits>(`/movie/${id}/credits`);
}

export async function getSimilarMovies(id: number): Promise<MovieListResponse> {
  return tmdbFetch<MovieListResponse>(`/movie/${id}/similar`);
}
