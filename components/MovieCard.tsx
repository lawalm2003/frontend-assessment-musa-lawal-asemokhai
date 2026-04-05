import Image from 'next/image';
import Link from 'next/link';
import type { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/tmdb';
import { formatRating } from '@/lib/utilities';
import { usePathname } from 'next/navigation';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const pathname = usePathname();

  const posterUrl = getImageUrl(movie.poster_path, 'w342');
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  // remove "/movies" prefix
  const cleanPath = pathname.replace(/^\/movies/, '') || '/';
  return (
    <Link
      href={`/movies/${movie.id}?from=${cleanPath}`}
      className='group block rounded-xl overflow-hidden bg-neutral-900 hover:-translate-y-1 transition-transform duration-200'
    >
      <div className='relative aspect-[2/3] bg-neutral-800 overflow-hidden'>
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <span className='text-5xl font-bold text-neutral-600 uppercase'>
              {movie.title.charAt(0)}
            </span>
          </div>
        )}
        <div className='absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm border border-white/10 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full'>
          <span className='text-[10px]'>★</span>
          <span>{formatRating(movie.vote_average)}</span>
        </div>
      </div>

      <div className='p-3'>
        <h3 className='text-sm font-semibold text-neutral-100 leading-snug line-clamp-2 mb-1'>
          {movie.title}
        </h3>
        {releaseYear && (
          <span className='text-xs text-neutral-500'>{releaseYear}</span>
        )}
      </div>
    </Link>
  );
}
