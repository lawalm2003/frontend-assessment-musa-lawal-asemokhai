import type { Metadata } from 'next';
import TopRatedClient from '@/components/Clients/TopRatedClient';

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

  return <TopRatedClient page={page} />;
}
