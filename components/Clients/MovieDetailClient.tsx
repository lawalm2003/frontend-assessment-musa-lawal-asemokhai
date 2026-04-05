'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import {
  useMovieDetail,
  useMovieCredits,
  useSimilarMovies,
} from '@/hooks/useTmdb';
import { getImageUrl } from '@/lib/tmdb';
import { formatCurrency, formatRating, formatRuntime } from '@/lib/utilities';
import MovieGrid from '@/components/MovieGrid';
import MovieDetailLoading from '@/app/movies/[id]/loading';
import { MovieDetail, MovieCredits, MovieListResponse } from '@/types/movie';

interface Props {
  id: number;
  initialMovie?: MovieDetail;
  initialCredits?: MovieCredits;
  initialSimilar?: MovieListResponse;
}

export default function MovieDetailClient({
  id,
  initialMovie,
  initialCredits,
  initialSimilar,
}: Props) {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const router = useRouter();
  const { data: movie, isLoading } = useMovieDetail(id, initialMovie);
  const { data: credits } = useMovieCredits(id, initialCredits);
  const { data: similar } = useSimilarMovies(id, initialSimilar);

  if (isLoading) return <MovieDetailLoading />;
  if (!movie) return notFound();

  const backdropUrl = getImageUrl(movie.backdrop_path, 'w780');
  const posterUrl = getImageUrl(movie.poster_path, 'w342');
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const topCast = credits?.cast.slice(0, 10) ?? [];

  const routeMap: Record<string, string> = {
    '/': 'Home',
    '/popular': 'Popular',
    '/top-rated': 'Top Rated',
    '/now-playing': 'Now Playing',
  };

  const label = routeMap[from || '/'] || 'Home';

  return (
    <div className='min-h-screen mt-1'>
      {/* Backdrop */}
      {backdropUrl && (
        <div className='relative w-full h-72 md:h-96 overflow-hidden'>
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            sizes='100vw'
            className='object-cover object-top'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/60 to-neutral-950' />

          {/* Breadcrumb — sits over backdrop */}
          <nav
            aria-label='Breadcrumb'
            className='absolute top-4 left-4 z-10 flex items-center gap-1.5 text-sm text-white/70'
          >
            <button
              onClick={() => router.back()}
              className='hover:text-white transition-colors'
            >
              {label}
            </button>
            <span className='text-white/40'>/</span>
            <span className='text-white font-medium line-clamp-1 max-w-[200px]'>
              {movie.title}
            </span>
          </nav>
        </div>
      )}

      <div className='max-w-screen-xl mx-auto px-6 py-8'>
        {/* Breadcrumb fallback — when no backdrop */}
        {!backdropUrl && (
          <nav
            aria-label='Breadcrumb'
            className='flex items-center gap-1.5 text-sm text-neutral-500 mb-6'
          >
            <button
              onClick={() => router.back()}
              className='hover:text-white transition-colors'
            >
              {label}
            </button>
            <span className='text-white/40'>/</span>
            <span className='text-white font-medium line-clamp-1 max-w-[200px]'>
              {movie.title}
            </span>
          </nav>
        )}

        <div className='flex flex-col md:flex-row gap-8 -mt-24 relative z-10'>
          {/* Poster */}
          <div className='shrink-0 self-start'>
            <div className='w-40 md:w-56 rounded-xl overflow-hidden shadow-2xl bg-neutral-800 aspect-[2/3] relative'>
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  sizes='(max-width: 768px) 160px, 224px'
                  className='object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <span className='text-5xl font-bold text-neutral-600'>
                    {movie.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className='flex-1 min-w-0'>
            {movie.tagline && (
              <p className='text-sm text-red-500 font-medium italic mb-2'>
                {movie.tagline}
              </p>
            )}
            <h1 className='text-3xl md:text-4xl font-extrabold text-neutral-100 tracking-tight leading-tight mb-2'>
              {movie.title}
            </h1>

            <div className='flex flex-wrap items-center gap-3 mb-4 text-sm text-neutral-400'>
              {releaseYear && <span>{releaseYear}</span>}
              {movie.runtime ? (
                <span className='flex items-center gap-1'>
                  <span className='text-neutral-600'>·</span>
                  {formatRuntime(movie.runtime)}
                </span>
              ) : null}
              <span className='flex items-center gap-1'>
                <span className='text-neutral-600'>·</span>
                <span className='flex items-center gap-1 text-yellow-400 font-semibold'>
                  ★ {formatRating(movie.vote_average)}
                </span>
                <span className='text-neutral-500'>
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </span>
            </div>

            <div className='flex flex-wrap gap-2 mb-5'>
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className='text-xs font-medium px-3 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full'
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className='text-neutral-300 text-sm md:text-base leading-relaxed mb-6 max-w-prose'>
              {movie.overview}
            </p>

            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
              {[
                { label: 'Status', value: movie.status },
                {
                  label: 'Language',
                  value: movie.original_language.toUpperCase(),
                },
                { label: 'Budget', value: formatCurrency(movie.budget) },
                { label: 'Revenue', value: formatCurrency(movie.revenue) },
              ].map(({ label, value }) => (
                <div key={label} className='bg-neutral-900 rounded-lg p-3'>
                  <p className='text-xs text-neutral-500 mb-1 uppercase tracking-wider'>
                    {label}
                  </p>
                  <p className='text-sm font-semibold text-neutral-200'>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cast */}
        {topCast.length > 0 && (
          <section className='mt-12'>
            <div className='mb-5'>
              <h2 className='text-xl font-bold text-neutral-100 tracking-tight'>
                Cast
              </h2>
              <div className='mt-1.5 w-8 h-[3px] bg-red-600 rounded-full' />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {topCast.map((member) => {
                const profileUrl = getImageUrl(member.profile_path, 'w185');
                return (
                  <div
                    key={member.id}
                    className='bg-neutral-900 rounded-xl overflow-hidden'
                  >
                    <div className='relative aspect-[2/3] bg-neutral-800'>
                      {profileUrl ? (
                        <Image
                          src={profileUrl}
                          alt={member.name}
                          fill
                          sizes='185px'
                          className='object-cover object-top'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                          <span className='text-3xl font-bold text-neutral-600'>
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='p-2.5'>
                      <p className='text-xs font-semibold text-neutral-200 leading-snug line-clamp-1'>
                        {member.name}
                      </p>
                      <p className='text-xs text-neutral-500 line-clamp-1 mt-0.5'>
                        {member.character}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {similar && similar.results.length > 0 && (
          <div className='mt-12'>
            <MovieGrid
              movies={similar.results.slice(0, 12)}
              title='Similar Movies'
            />
          </div>
        )}
      </div>
    </div>
  );
}
