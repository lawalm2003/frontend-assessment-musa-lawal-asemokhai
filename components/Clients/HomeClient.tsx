'use client';

import Loading from '@/app/loading';
import HeroBanner from '@/components/HeroBanner';
import MovieGrid from '@/components/MovieGrid';
import {
  usePopularMovies,
  useTopRatedMovies,
  useTrendingMovies,
} from '@/hooks/useTmdb';

export default function HomeClient() {
  const { data: trending, isLoading: isTrendingLoading } =
    useTrendingMovies('week');
  const { data: popular, isLoading: isPopularLoading } = usePopularMovies(1);
  const { data: topRated, isLoading: isTopRatedLoading } = useTopRatedMovies(1);

  const featured = trending?.results?.[0];

  if (isTrendingLoading || isPopularLoading || isTopRatedLoading)
    return <Loading />;

  return (
    <>
      {featured && <HeroBanner movie={featured} />}

      <div className='max-w-screen-xl mx-auto  px-6 py-10'>
        <MovieGrid
          movies={trending?.results?.slice(1, 13) ?? []}
          title='Trending This Week'
        />

        <MovieGrid
          movies={popular?.results?.slice(0, 12) ?? []}
          title='Popular Now'
        />

        <MovieGrid
          movies={topRated?.results?.slice(0, 12) ?? []}
          title='Top Rated'
        />
      </div>
    </>
  );
}
