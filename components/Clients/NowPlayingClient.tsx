'use client';

import Image from 'next/image';
import Link from 'next/link';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import { getImageUrl } from '@/lib/tmdb';
import { useNowPlayingMovies } from '@/hooks/useTmdb';
import { formatRating } from '@/lib/utilities';
import Loading from '@/app/movies/now-playing/loading';

export default function NowPlayingClient({ page }: { page: number }) {
  const { data, isLoading } = useNowPlayingMovies(page);

  if (isLoading) return <Loading />;
  if (!data) return null;

  const featured = data?.results[0];
  const rest = data?.results.slice(1);

  return (
    <div className='min-h-screen'>
      {page === 1 &&
        featured &&
        (() => {
          const backdropUrl = getImageUrl(featured.backdrop_path, 'original');
          const posterUrl = getImageUrl(featured.poster_path, 'w342');
          const releaseYear = featured.release_date
            ? new Date(featured.release_date).getFullYear()
            : null;

          return (
            <div className='relative w-full h-80 md:h-[420px] overflow-hidden'>
              {backdropUrl && (
                <Image
                  src={backdropUrl}
                  alt={featured.title}
                  fill
                  priority
                  sizes='100vw'
                  className='object-cover object-center'
                />
              )}

              <div className='absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent' />
              <div className='absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent' />

              <div className='relative z-10 h-full max-w-screen-xl mx-auto px-6 flex items-center gap-6'>
                {posterUrl && (
                  <div className='hidden sm:block relative w-32 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shrink-0'>
                    <Image
                      src={posterUrl}
                      alt={featured.title}
                      fill
                      sizes='128px'
                      className='object-cover'
                    />
                  </div>
                )}

                <div>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400'>
                      <span className='inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                      In Cinemas Now
                    </span>
                  </div>

                  <h1 className='text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-xl mb-2'>
                    {featured.title}
                  </h1>

                  <div className='flex items-center gap-3 text-sm text-neutral-300 mb-3'>
                    {releaseYear && <span>{releaseYear}</span>}
                    <span className='text-yellow-400 font-semibold'>
                      ★ {formatRating(featured.vote_average)}
                    </span>
                  </div>

                  <p className='text-sm text-neutral-400 leading-relaxed line-clamp-2 max-w-md mb-5'>
                    {featured.overview}
                  </p>

                  <Link
                    href={`/movies/${featured.id}`}
                    className='inline-flex items-center gap-2 px-5 py-2 bg-white text-neutral-950 text-sm font-bold rounded-lg hover:bg-neutral-100 transition-colors'
                  >
                    View Details
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <line x1='5' y1='12' x2='19' y2='12' />
                      <polyline points='12 5 19 12 12 19' />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}

      <div className='border-b border-neutral-800 bg-neutral-950'>
        <div className='max-w-screen-xl mx-auto px-6 py-8'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <p className='text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1'>
                In Cinemas
              </p>
              <h2 className='text-2xl font-extrabold text-neutral-100 tracking-tight'>
                Now Playing
              </h2>
            </div>

            <p className='text-sm text-neutral-500 shrink-0'>
              {data.total_results.toLocaleString()} titles in theatres
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl mx-auto px-6 py-10'>
        {page === 1 && rest.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-xs font-bold uppercase tracking-widest text-neutral-500 mb-5'>
              Also showing
            </h2>

            <div className='flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-6 px-6'>
              {rest.slice(0, 8).map((movie) => {
                const posterUrl = getImageUrl(movie.poster_path, 'w185');

                return (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    className='group shrink-0 w-28'
                  >
                    <div className='relative w-28 aspect-[2/3] rounded-xl overflow-hidden bg-neutral-800 mb-2'>
                      {posterUrl && (
                        <Image
                          src={posterUrl}
                          alt={movie.title}
                          fill
                          sizes='112px'
                          className='object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                      )}

                      <div className='absolute top-1.5 right-1.5 bg-black/70 text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
                        ★ {formatRating(movie.vote_average)}
                      </div>
                    </div>

                    <p className='text-xs font-medium text-neutral-300 line-clamp-2 leading-snug'>
                      {movie.title}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <MovieGrid
          movies={page === 1 ? rest.slice(8) : data.results}
          title={page === 1 ? 'All In Theatres' : `Page ${page}`}
        />

        <Pagination
          currentPage={page}
          totalPages={data.total_pages}
          basePath='/movies/now-playing'
        />
      </div>
    </div>
  );
}
