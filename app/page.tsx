import type { Metadata } from 'next';
import HomeClient from '@/components/Clients/HomeClient';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
} from '@/services/tmdb.server';

export const metadata: Metadata = {
  title: 'MovieVerse — Discover Movies',
  description: 'Browse trending, popular, and top rated movies.',
};

export default async function HomePage() {
  // Prefetch on the server so the page is never blank on first load
  const [initialTrending, initialPopular, initialTopRated] = await Promise.all([
    getTrendingMovies('week'),
    getPopularMovies(1),
    getTopRatedMovies(1),
  ]);

  return (
    <HomeClient
      initialTrending={initialTrending}
      initialPopular={initialPopular}
      initialTopRated={initialTopRated}
    />
  );
}
