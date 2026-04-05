import type { Metadata } from 'next';
import { Suspense } from 'react';
import TopRatedClient from '@/components/Clients/TopRatedClient';
import { getTopRatedMovies } from '@/services/tmdb.server';

export const metadata: Metadata = {
  title: 'Top Rated Movies',
  description:
    'The highest rated movies of all time, as voted by millions of fans.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function TopRatedPage({ searchParams }: Props) {
  const page = Number((await searchParams).page ?? 1);
  const initialData = await getTopRatedMovies(page);

  return (
    <Suspense>
      <TopRatedClient page={page} initialData={initialData} />
    </Suspense>
  );
}
