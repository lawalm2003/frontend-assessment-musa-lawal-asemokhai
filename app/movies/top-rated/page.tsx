import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getTopRatedMovies } from '@/services/tmdb.server';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Top Rated Movies',
  description:
    'The highest rated movies of all time, as voted by millions of fans.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

const TopRatedClient = dynamic(
  () => import('@/components/Clients/TopRatedClient'),
  {
    loading: () => <Loading />,
  },
);

export default async function TopRatedPage({ searchParams }: Props) {
  const page = Number((await searchParams).page ?? 1);
  const initialData = await getTopRatedMovies(page);

  return (
    <Suspense fallback={<Loading />}>
      <TopRatedClient page={page} initialData={initialData} />
    </Suspense>
  );
}
