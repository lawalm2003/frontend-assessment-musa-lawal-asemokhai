import type { Metadata } from 'next';
import SearchClient from '@/components/Clients/SearchClient';

export const metadata: Metadata = {
  title: 'Search Movies',
};

interface Props {
  searchParams: Promise<{
    q?: string;
    page?: string;
    genre?: string;
    rating?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page, genre, rating } = await searchParams;

  return <SearchClient query={q ?? ''} page={Number(page ?? 1)} />;
}
