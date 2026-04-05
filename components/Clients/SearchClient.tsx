'use client';

import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import { useSearchMovies } from '@/hooks/useTmdb';

function SearchResults({ query, page }: { query: string; page: number }) {
  const { data, isLoading } = useSearchMovies(query, page);

  if (!query.trim()) {
    return (
      <p className='text-neutral-500 text-center py-20'>
        Start typing to search for movies.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-pulse'>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className='aspect-[2/3] bg-neutral-800 rounded-xl' />
        ))}
      </div>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <p className='text-neutral-400 text-center py-20'>
        No results found for{' '}
        <span className='text-neutral-200 font-semibold'>{query}</span>.
      </p>
    );
  }

  return (
    <>
      <p className='text-sm text-neutral-500 mb-6'>
        {data.total_results.toLocaleString()} results for{' '}
        <span className='text-neutral-300 font-medium'>{query}</span>
      </p>
      <MovieGrid movies={data.results} />
      <Pagination
        currentPage={page}
        totalPages={data.total_pages}
        basePath='/search'
        searchQuery={query}
      />
    </>
  );
}

interface Props {
  query: string;
  page: number;
  genre: string;
  rating: string;
}

export default function SearchClient({ query, page }: Props) {
  return (
    <div className='max-w-screen-xl mx-auto px-6 py-10'>
      <h1 className='text-2xl font-bold text-neutral-100 mb-6 tracking-tight'>
        Search Movies
      </h1>
      <div className='mb-8 max-w-lg'>
        <Suspense>
          <SearchBar defaultValue={query} placeholder='Search by title...' />
        </Suspense>
      </div>
      <SearchResults query={query} page={page} />
    </div>
  );
}
