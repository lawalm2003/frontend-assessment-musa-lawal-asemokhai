import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getPopularMovies } from '@/services/tmdb.server';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Popular Movies',
  description:
    'The most popular movies right now, ranked by audience activity.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

const PopularClient = dynamic(
  () => import('@/components/Clients/PopularClient'),
  {
    loading: () => <Loading />,
  },
);

export default async function PopularPage({ searchParams }: Props) {
  const page = Number((await searchParams).page ?? 1);
  const initialData = await getPopularMovies(page);

  return (
    <Suspense fallback={<Loading />}>
      <PopularClient page={page} initialData={initialData} />
    </Suspense>
  );
}
