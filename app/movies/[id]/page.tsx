import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MovieDetailClient from '@/components/Clients/MovieDetailClient';
import { getMovieDetail } from '@/services/tmdb.services';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) return { title: 'Movie Not Found' };

  const movie = await getMovieDetail(numericId).catch(() => null);

  if (!movie) return { title: 'Movie Not Found' };

  return {
    title: movie.title,
    description: movie.overview,
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) notFound();

  return <MovieDetailClient id={numericId} />;
}
