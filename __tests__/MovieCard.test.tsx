import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types/movie';

// next/navigation hooks return null in jsdom — mock them explicitly
vi.mock('next/navigation', () => ({
  usePathname: () => '/movies/popular',
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const baseMovie: Movie = {
  id: 1,
  title: 'Inception',
  overview: 'A thief who steals corporate secrets.',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2010-07-16',
  vote_average: 8.8,
  vote_count: 34000,
  genre_ids: [28, 878],
  popularity: 95.4,
  adult: false,
  original_language: 'en',
  original_title: 'Inception',
  video: false,
};

describe('MovieCard', () => {
  it('renders the movie title', () => {
    render(<MovieCard movie={baseMovie} />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders the release year extracted from release_date', () => {
    render(<MovieCard movie={baseMovie} />);
    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('renders the formatted rating', () => {
    render(<MovieCard movie={baseMovie} />);
    expect(screen.getByText('8.8')).toBeInTheDocument();
  });

  it('links to the correct movie detail page', () => {
    render(<MovieCard movie={baseMovie} />);
    const link = screen.getByRole('link');
    // MovieCard appends ?from=<currentPath> so the detail page knows where to go back to.
    // We assert the href starts with /movies/1 rather than an exact match.
    expect(link).toHaveAttribute('href', expect.stringContaining('/movies/1'));
  });

  it('renders the poster image with correct alt text', () => {
    render(<MovieCard movie={baseMovie} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Inception');
  });

  it('renders a fallback initial letter when poster_path is null', () => {
    render(<MovieCard movie={{ ...baseMovie, poster_path: null }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('I')).toBeInTheDocument();
  });

  it('does not render a year when release_date is an empty string', () => {
    render(<MovieCard movie={{ ...baseMovie, release_date: '' }} />);
    expect(screen.queryByText('2010')).not.toBeInTheDocument();
  });
});
