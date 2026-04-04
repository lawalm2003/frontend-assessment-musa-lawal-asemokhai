import Image from 'next/image';
import Link from 'next/link';
import type { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/tmdb';
import { formatRating } from '@/lib/utilities';

interface HeroBannerProps {
  movie: Movie;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <div className='relative w-full min-h-[520px] md:min-h-[600px] flex items-end overflow-hidden'>
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          sizes='100vw'
          className='object-cover object-top'
        />
      )}
      <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-neutral-950' />

      <div className='relative z-10 w-full max-w-screen-xl mx-auto px-6 pb-12 pt-20'>
        <div className='flex items-center gap-2.5 mb-3'>
          <span className='text-[11px] font-bold uppercase tracking-widest bg-red-600 text-white px-2 py-0.5 rounded'>
            Featured
          </span>
          {releaseYear && (
            <span className='text-sm text-neutral-300'>{releaseYear}</span>
          )}
          <span className='flex items-center gap-1 text-sm text-neutral-300'>
            <span className='text-yellow-400 text-xs'>★</span>
            {formatRating(movie.vote_average)}
          </span>
        </div>

        <h1 className='text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-xl mb-4'>
          {movie.title}
        </h1>

        <p className='text-sm md:text-base text-neutral-300 max-w-lg leading-relaxed line-clamp-3 mb-6'>
          {movie.overview}
        </p>

        <Link
          href={`/movies/${movie.id}`}
          className='inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-md transition-colors'
        >
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
        </Link>
      </div>
    </div>
  );
}
