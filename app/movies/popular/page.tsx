import type { Metadata } from 'next';
import PopularClient from '@/components/Clients/PopularClient';

export const metadata: Metadata = {
  title: 'Popular Movies',
  description:
    'The most popular movies right now, ranked by audience activity.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function PopularPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const pageNumber = Number(page ?? 1);

  return <PopularClient page={pageNumber} />;
}
