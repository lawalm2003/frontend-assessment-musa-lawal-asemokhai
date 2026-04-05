import type { Metadata } from 'next';
import { Suspense } from 'react';
import PopularClient from '@/components/Clients/PopularClient';
import { getPopularMovies } from '@/services/tmdb.server';

export const metadata: Metadata = {
  title: 'Popular Movies',
  description:
    'The most popular movies right now, ranked by audience activity.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function PopularPage({ searchParams }: Props) {
  const page = Number((await searchParams).page ?? 1);

  // SSR prefetch — data is fetched on the server, passed as initialData
  // to React Query so the page is never blank on first load
  const initialData = await getPopularMovies(page);

  return (
    <Suspense>
      <PopularClient page={page} initialData={initialData} />
    </Suspense>
  );
}
