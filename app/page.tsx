import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
} from '@/services/tmdb.server';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'MovieVerse — Discover Movies',
  description: 'Browse trending, popular, and top rated movies.',
};

// Route-level code splitting — HomeClient bundles React Query, GenreFilter, HeroBanner
//  Lazy-loading keeps the initial JS payload small.
// The skeleton shows instantly while the bundle downloads.
const HomeClient = dynamic(() => import('@/components/Clients/HomeClient'), {
  loading: () => <Loading />,
});

export default async function HomePage() {
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
