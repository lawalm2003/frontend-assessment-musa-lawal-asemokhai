import type { Metadata } from 'next';
import { Suspense } from 'react';
import NowPlayingClient from '@/components/Clients/NowPlayingClient';
import { getNowPlayingMovies } from '@/services/tmdb.server';

export const metadata: Metadata = {
  title: 'Now Playing',
  description: 'Movies currently showing in cinemas worldwide.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function NowPlayingPage({ searchParams }: Props) {
  const page = Number((await searchParams).page ?? 1);
  const initialData = await getNowPlayingMovies(page);

  return (
    <Suspense>
      <NowPlayingClient page={page} initialData={initialData} />
    </Suspense>
  );
}
