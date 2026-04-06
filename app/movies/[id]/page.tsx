import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  getMovieDetail,
  getMovieCredits,
  getSimilarMovies,
} from '@/services/tmdb.server';
import { getImageUrl } from '@/lib/tmdb';
import MovieDetailLoading from './loading';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetail(Number(id)).catch(() => null);
  if (!movie) return { title: 'Movie Not Found' };

  const ogImage = getImageUrl(movie.backdrop_path, 'w780');

  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      ...(ogImage && {
        images: [{ url: ogImage, width: 780, alt: movie.title }],
      }),
    },
  };
}

const MovieDetailClient = dynamic(
  () => import('@/components/Clients/MovieDetailClient'),
  { loading: () => <MovieDetailLoading /> },
);

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) notFound();

  const [initialMovie, initialCredits, initialSimilar] = await Promise.all([
    getMovieDetail(numId).catch(() => null),
    getMovieCredits(numId).catch(() => null),
    getSimilarMovies(numId).catch(() => null),
  ]);

  if (!initialMovie) notFound();

  return (
    <MovieDetailClient
      id={numId}
      initialMovie={initialMovie}
      initialCredits={initialCredits ?? undefined}
      initialSimilar={initialSimilar ?? undefined}
    />
  );
}
