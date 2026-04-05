'use client';

import { useTopRatedMovies } from '@/hooks/useTmdb';
import { getImageUrl } from '@/lib/tmdb';
import { formatRating } from '@/lib/utilities';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MovieGrid from '../MovieGrid';
import Pagination from '../Pagination';
import Loading from '@/app/movies/top-rated/loading';
import { MovieListResponse } from '@/types/movie';
import { usePathname } from 'next/navigation';

interface Props {
  page: number;
  initialData?: MovieListResponse;
}

export default function TopRatedClient({ page, initialData }: Props) {
  const pathname = usePathname();
  const cleanPath = pathname.replace(/^\/movies/, '') || '/';

  const { data, isLoading } = useTopRatedMovies(page, initialData);

  if (isLoading) return <Loading />;
  if (!data) return null;

  const topMovie = data.results[0];
  const rest = data.results.slice(1);

  const startRank = (page - 1) * 20 + 1;

  return (
    <div className='min-h-screen'>
      {/* Page header */}
      <div className='border-b border-neutral-800 bg-neutral-950'>
        <div className='max-w-screen-xl mx-auto px-6 py-10'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <p className='text-xs font-bold uppercase tracking-widest text-yellow-500 mb-2'>
                All Time
              </p>
              <h1 className='text-4xl font-extrabold text-neutral-100 tracking-tight leading-none'>
                Top Rated
              </h1>
              <p className='mt-2 text-sm text-neutral-400 max-w-md'>
                The greatest films ever made, ranked by audience ratings.
              </p>
            </div>
            <p className='text-sm text-neutral-500 shrink-0'>
              {data.total_results.toLocaleString()} titles
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl mx-auto px-6 py-10'>
        {/* #1 hero spotlight — only on page 1 */}
        {page === 1 && topMovie && (
          <div className='mb-12'>
            <h2 className='text-xs font-bold uppercase tracking-widest text-neutral-500 mb-5'>
              #1 of all time
            </h2>
            <Link
              href={`/movies/${topMovie.id}?from=${cleanPath}`}
              className='group relative flex flex-col sm:flex-row gap-6 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-colors'
            >
              {/* Backdrop strip */}
              <div className='relative w-full sm:w-72 aspect-video sm:aspect-auto sm:h-auto shrink-0 bg-neutral-800'>
                {topMovie.backdrop_path && (
                  <Image
                    src={getImageUrl(topMovie.backdrop_path, 'w780')!}
                    alt={topMovie.title}
                    fill
                    priority
                    sizes='(max-width: 640px) 100vw, 288px'
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                )}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900 hidden sm:block' />
              </div>

              {/* Info */}
              <div className='flex flex-col justify-center p-6 sm:pl-0'>
                <div className='flex items-center gap-3 mb-3'>
                  <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-neutral-950 text-lg font-black'>
                    1
                  </span>
                  <span className='text-xs font-bold uppercase tracking-widest text-yellow-500'>
                    Highest Rated
                  </span>
                </div>
                <h3 className='text-2xl font-extrabold text-neutral-100 tracking-tight mb-2'>
                  {topMovie.title}
                </h3>
                <div className='flex items-center gap-3 mb-3 text-sm text-neutral-400'>
                  {topMovie.release_date && (
                    <span>{new Date(topMovie.release_date).getFullYear()}</span>
                  )}
                  <span className='text-yellow-400 font-bold text-base'>
                    ★ {formatRating(topMovie.vote_average)}
                  </span>
                  <span className='text-neutral-600'>
                    {topMovie.vote_count.toLocaleString()} votes
                  </span>
                </div>
                <p className='text-sm text-neutral-400 leading-relaxed line-clamp-3 max-w-lg'>
                  {topMovie.overview}
                </p>
                <span className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-500 group-hover:gap-2.5 transition-all'>
                  View Details
                  <svg
                    width='14'
                    height='14'
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
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Ranked list */}
        <div className='mb-10'>
          <h2 className='text-xs font-bold uppercase tracking-widest text-neutral-500 mb-5'>
            {page === 1
              ? 'The Full Rankings'
              : `Ranks ${startRank}–${startRank + data.results.length - 1}`}
          </h2>

          {/* Ranked rows for top visible items */}
          <div className='flex flex-col gap-2 mb-8'>
            {(page === 1 ? rest.slice(0, 9) : data.results).map((movie, i) => {
              const rank = startRank + (page === 1 ? i + 1 : i);
              const posterUrl = getImageUrl(movie.poster_path, 'w185');
              return (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}?from=${cleanPath}`}
                  className='group flex items-center gap-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl px-4 py-3 transition-colors'
                >
                  {/* Rank */}
                  <span
                    className={`w-8 text-center font-black text-lg shrink-0 ${rank <= 3 ? 'text-yellow-500' : 'text-neutral-600'}`}
                  >
                    {rank}
                  </span>
                  {/* Poster */}
                  <div className='relative w-10 h-14 shrink-0 rounded-md overflow-hidden bg-neutral-800'>
                    {posterUrl && (
                      <Image
                        src={posterUrl}
                        alt={movie.title}
                        fill
                        sizes='40px'
                        className='object-cover'
                      />
                    )}
                  </div>
                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-neutral-100 truncate group-hover:text-white'>
                      {movie.title}
                    </p>
                    <p className='text-xs text-neutral-500 mt-0.5'>
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : ''}
                    </p>
                  </div>
                  {/* Rating */}
                  <div className='flex items-center gap-1 shrink-0'>
                    <span className='text-yellow-400 text-sm'>★</span>
                    <span className='text-sm font-bold text-neutral-200'>
                      {formatRating(movie.vote_average)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Card grid for remaining */}
          {page === 1 && rest.length > 9 && (
            <MovieGrid movies={rest.slice(9)} />
          )}
        </div>

        <Pagination
          currentPage={page}
          totalPages={data.total_pages}
          basePath='/movies/top-rated'
        />
      </div>
    </div>
  );
}
