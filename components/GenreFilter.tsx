'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGenres } from '@/hooks/useTmdb';

export default function GenreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading } = useGenres();

  const activeGenre = searchParams.get('genre') ?? '';

  const handleGenreClick = (genreId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genreId === activeGenre) {
      // clicking active genre deselects it
      params.delete('genre');
    } else {
      params.set('genre', genreId);
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className='shrink-0 h-8 w-20 bg-neutral-800 rounded-full animate-pulse'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
      {/* All pill */}
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('genre');
          params.delete('page');
          router.push(`/?${params.toString()}`);
        }}
        className={`shrink-0 h-8 px-4 rounded-full text-sm font-medium transition-colors ${
          !activeGenre
            ? 'bg-red-600 text-white'
            : 'bg-neutral-800 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700'
        }`}
      >
        All
      </button>

      {data?.genres.map((genre) => {
        const isActive = activeGenre === String(genre.id);
        return (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(String(genre.id))}
            className={`shrink-0 h-8 px-4 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-red-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700'
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
