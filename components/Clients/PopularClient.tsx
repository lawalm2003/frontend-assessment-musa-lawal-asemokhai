'use client';

import { usePopularMovies } from '@/hooks/useTmdb';
import { getImageUrl } from '@/lib/tmdb';
import { formatRating } from '@/lib/utilities';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MovieGrid from '../MovieGrid';
import Pagination from '../Pagination';
import Loading from '@/app/movies/popular/loading';

export default function PopularClient({ page }: { page: number }) {
  const { data, isLoading } = usePopularMovies();

  if (isLoading) return <Loading />;
  if (!data) return null;

  const topThree = data.results.slice(0, 3);
  const rest = data.results.slice(3);

  return (
    <div className='min-h-screen'>
      {/* Page header */}
      <div className='border-b border-neutral-800 bg-neutral-950'>
        <div className='max-w-screen-xl mx-auto px-6 py-10'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <p className='text-xs font-bold uppercase tracking-widest text-red-500 mb-2'>
                Charts
              </p>
              <h1 className='text-4xl font-extrabold text-neutral-100 tracking-tight leading-none'>
                Popular Movies
              </h1>
              <p className='mt-2 text-sm text-neutral-400 max-w-md'>
                Ranked by current audience activity across the globe.
              </p>
            </div>
            <p className='text-sm text-neutral-500 shrink-0'>
              {data.total_results.toLocaleString()} titles
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl mx-auto px-6 py-10'>
        {/* Top 3 spotlight — only on page 1 */}
        {page === 1 && topThree.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-xs font-bold uppercase tracking-widest text-neutral-500 mb-5'>
              Trending now
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {topThree.map((movie, i) => {
                const backdropUrl = getImageUrl(movie.backdrop_path, 'w780');
                const releaseYear = movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : null;
                return (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    className='group relative rounded-2xl overflow-hidden aspect-video bg-neutral-800 block'
                  >
                    {backdropUrl && (
                      <Image
                        src={backdropUrl}
                        alt={movie.title}
                        fill
                        sizes='(max-width: 640px) 100vw, 33vw'
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                        priority={i === 0}
                      />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                    {/* Rank badge */}
                    <div className='absolute top-3 left-3 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-black'>
                      {i + 1}
                    </div>
                    <div className='absolute bottom-0 left-0 right-0 p-4'>
                      <p className='text-white font-bold text-sm leading-snug line-clamp-1'>
                        {movie.title}
                      </p>
                      <div className='flex items-center gap-2 mt-1'>
                        {releaseYear && (
                          <span className='text-xs text-neutral-400'>
                            {releaseYear}
                          </span>
                        )}
                        <span className='text-xs text-yellow-400 font-semibold'>
                          ★ {formatRating(movie.vote_average)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Full grid */}
        <MovieGrid
          movies={page === 1 ? rest : data.results}
          title={page === 1 ? 'All Popular Movies' : `Page ${page}`}
        />

        <Pagination
          currentPage={page}
          totalPages={data.total_pages}
          basePath='/movies/popular'
        />
      </div>
    </div>
  );
}
