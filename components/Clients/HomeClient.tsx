'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroBanner from '@/components/HeroBanner';
import MovieGrid from '@/components/MovieGrid';
import GenreFilter from '@/components/GenreFilter';
import {
  useTrendingMovies,
  usePopularMovies,
  useTopRatedMovies,
  useDiscoverMovies,
} from '@/hooks/useTmdb';
import { MovieListResponse } from '@/types/movie';

interface HomeProps {
  initialTrending?: MovieListResponse;
  initialPopular?: MovieListResponse;
  initialTopRated?: MovieListResponse;
}

function HomeContent({
  initialTrending,
  initialPopular,
  initialTopRated,
}: HomeProps) {
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get('genre') ?? '';

  const { data: trending } = useTrendingMovies('week', initialTrending);
  const { data: popular } = usePopularMovies(1, initialPopular);
  const { data: topRated } = useTopRatedMovies(1, initialTopRated);
  const { data: genreMovies, isLoading: genreLoading } =
    useDiscoverMovies(activeGenre);

  const featured = trending?.results?.[0];

  return (
    <>
      {/* Hero — hide when filtering by genre */}
      {!activeGenre && featured && <HeroBanner movie={featured} />}

      <div className='max-w-screen-xl mx-auto px-6 py-8'>
        {/* Genre filter strip */}
        <div className='mb-10'>
          <Suspense>
            <GenreFilter />
          </Suspense>
        </div>

        {activeGenre ? (
          // Genre filtered view
          genreLoading ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-pulse'>
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className='aspect-[2/3] bg-neutral-800 rounded-xl'
                />
              ))}
            </div>
          ) : genreMovies && genreMovies.results.length > 0 ? (
            <MovieGrid movies={genreMovies.results} title='Browse by Genre' />
          ) : (
            // Empty state
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <p className='text-5xl mb-4'>🎬</p>
              <h3 className='text-lg font-semibold text-neutral-200 mb-2'>
                No movies found
              </h3>
              <p className='text-sm text-neutral-500 max-w-xs'>
                No movies matched this genre. Try selecting a different one.
              </p>
            </div>
          )
        ) : (
          // Default home view
          <>
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
          </>
        )}
      </div>
    </>
  );
}

export default function HomeClient(props: HomeProps) {
  return (
    <Suspense>
      <HomeContent {...props} />
    </Suspense>
  );
}
