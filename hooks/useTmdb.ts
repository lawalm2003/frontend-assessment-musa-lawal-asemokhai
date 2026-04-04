//hooks/useTmdb.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getTrendingMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getMovieDetail,
  getMovieCredits,
  searchMovies,
  getSimilarMovies,
} from '@/services/tmdb.services';

export const tmdbKeys = {
  all: ['tmdb'] as const,

  trending: (timeWindow: 'day' | 'week') =>
    [...tmdbKeys.all, 'trending', timeWindow] as const,

  popular: (page: number) => [...tmdbKeys.all, 'popular', page] as const,

  nowPlaying: (page: number) => [...tmdbKeys.all, 'now-playing', page] as const,

  topRated: (page: number) => [...tmdbKeys.all, 'top-rated', page] as const,

  detail: (id: number) => [...tmdbKeys.all, 'detail', id] as const,

  credits: (id: number) => [...tmdbKeys.all, 'credits', id] as const,

  similar: (id: number) => [...tmdbKeys.all, 'similar', id] as const,

  search: (query: string, page: number) =>
    [...tmdbKeys.all, 'search', query, page] as const,
};

export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: tmdbKeys.trending(timeWindow),
    queryFn: () => getTrendingMovies(timeWindow),
  });
}

export function usePopularMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.popular(page),
    queryFn: () => getPopularMovies(page),
  });
}

export function useNowPlayingMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.nowPlaying(page),
    queryFn: () => getNowPlayingMovies(page),
  });
}

export function useTopRatedMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.topRated(page),
    queryFn: () => getTopRatedMovies(page),
  });
}

export function useMovieDetail(id: number) {
  return useQuery({
    queryKey: tmdbKeys.detail(id),
    queryFn: () => getMovieDetail(id),
    enabled: !!id, // prevents invalid calls
  });
}

export function useMovieCredits(id: number) {
  return useQuery({
    queryKey: tmdbKeys.credits(id),
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
  });
}

export function useSimilarMovies(id: number) {
  return useQuery({
    queryKey: tmdbKeys.similar(id),
    queryFn: () => getSimilarMovies(id),
    enabled: !!id,
  });
}

export function useSearchMovies(query: string, page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.search(query, page),
    queryFn: () => searchMovies(query, page),
    enabled: !!query.trim(),
  });
}
