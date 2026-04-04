import NowPlayingClient from '@/components/Clients/NowPlayingClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Now Playing',
  description: 'Movies currently showing in cinemas worldwide.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { page } = await searchParams;
  const pageNumber = Number(page ?? 1);

  return <NowPlayingClient page={pageNumber} />;
}
