import type { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
}

export default function MovieGrid({ movies, title }: MovieGridProps) {
  return (
    <section className='mb-12'>
      {title && (
        <div className='mb-5'>
          <h2 className='text-xl font-bold text-neutral-100 tracking-tight'>
            {title}
          </h2>
          <div className='mt-1.5 w-8 h-[3px] bg-red-600 rounded-full' />
        </div>
      )}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
