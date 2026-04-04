import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchClient from '@/components/Clients/SearchClient';

export const metadata: Metadata = {
  title: 'Search Movies',
};

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page } = await searchParams;
  const query = q ?? '';
  const currentPage = Number(page ?? 1);

  return (
    <Suspense>
      <SearchClient query={query} page={currentPage} />
    </Suspense>
  );
}
