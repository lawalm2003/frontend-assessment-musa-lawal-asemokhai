import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getNowPlayingMovies } from '@/services/tmdb.server';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Now Playing',
  description: 'Movies currently showing in cinemas worldwide.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

const NowPlayingClient = dynamic(
  () => import('@/components/Clients/NowPlayingClient'),
  {
    loading: () => <Loading />,
  },
);

export default async function NowPlayingPage({ searchParams }: Props) {
  const page = Number((await searchParams).page ?? 1);
  const initialData = await getNowPlayingMovies(page);

  return (
    <Suspense fallback={<Loading />}>
      <NowPlayingClient page={page} initialData={initialData} />
    </Suspense>
  );
}
