/**
 * Pagination.test.tsx
 *
 * We are testing the Pagination component.
 * Pagination receives:
 *   - currentPage  — which page we are on
 *   - totalPages   — how many pages exist
 *   - basePath     — the URL path to build links (e.g. '/movies/popular')
 *   - searchQuery  — optional, appended to links on the search page
 *
 * WHY TEST THIS COMPONENT?
 * Pagination has real logic inside it:
 *   - it hides Prev on page 1
 *   - it hides Next on the last page
 *   - it builds correct hrefs
 *   - it caps at 500 pages
 *   - it shows ellipsis (…) when pages are far apart
 * Logic like this is exactly what tests are designed to catch.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '@/components/Pagination';

// ─── Mock ─────────────────────────────────────────────────────────────────────
// Same as MovieCard — replace Next.js <Link> with a plain <a> tag

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-current': ariaCurrent,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-current'?: string;
  }) => (
    <a href={href} className={className} aria-current={ariaCurrent}>
      {children}
    </a>
  ),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    // When there is only one page, pagination makes no sense
    // The component should return null — nothing in the DOM
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} basePath='/movies/popular' />,
    );

    // container.firstChild is the root element rendered
    // If the component returns null, firstChild is null
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} basePath='/movies/popular' />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('does not show a Prev button on page 1', () => {
    // On the first page there is no previous page to go back to
    render(
      <Pagination currentPage={1} totalPages={5} basePath='/movies/popular' />,
    );

    // /prev/i is a regex — the i means case-insensitive
    // queryByText returns null if not found (safe to use with not.toBeInTheDocument)
    expect(screen.queryByText(/prev/i)).not.toBeInTheDocument();
  });

  it('does not show a Next button on the last page', () => {
    // On the last page there is no next page to go forward to
    render(
      <Pagination currentPage={5} totalPages={5} basePath='/movies/popular' />,
    );
    expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
  });

  it('shows both Prev and Next buttons on a middle page', () => {
    // On page 3 of 5, both directions are valid
    render(
      <Pagination currentPage={3} totalPages={5} basePath='/movies/popular' />,
    );

    // getByText throws if not found — use when you expect it to exist
    expect(screen.getByText(/prev/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  it('marks the current page link with aria-current="page"', () => {
    // aria-current="page" is important for screen readers
    // It tells assistive technology "this is the page you are currently on"
    render(
      <Pagination currentPage={2} totalPages={5} basePath='/movies/popular' />,
    );

    // getByRole('link', { name: '2' }) finds the <a> whose text content is '2'
    const currentLink = screen.getByRole('link', { name: '2' });
    expect(currentLink).toHaveAttribute('aria-current', 'page');
  });

  it('other page links do not have aria-current', () => {
    render(
      <Pagination currentPage={2} totalPages={5} basePath='/movies/popular' />,
    );
    const otherLink = screen.getByRole('link', { name: '1' });
    // toBeNull() or checking the attribute is not set
    expect(otherLink).not.toHaveAttribute('aria-current', 'page');
  });

  it('builds the correct href for the Next button', () => {
    render(
      <Pagination currentPage={1} totalPages={5} basePath='/movies/popular' />,
    );

    // .closest('a') walks up the DOM to find the nearest <a> ancestor
    const nextLink = screen.getByText(/next/i).closest('a');
    expect(nextLink).toHaveAttribute('href', '/movies/popular?page=2');
  });

  it('builds the correct href for the Prev button', () => {
    render(
      <Pagination currentPage={3} totalPages={5} basePath='/movies/popular' />,
    );
    const prevLink = screen.getByText(/prev/i).closest('a');
    expect(prevLink).toHaveAttribute('href', '/movies/popular?page=2');
  });

  it('includes the searchQuery in hrefs when provided', () => {
    // On the search page, every link must carry the query so it is not lost
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        basePath='/search'
        searchQuery='batman'
      />,
    );
    const nextLink = screen.getByText(/next/i).closest('a');

    // Check the href contains both params
    expect(nextLink?.getAttribute('href')).toContain('q=batman');
    expect(nextLink?.getAttribute('href')).toContain('page=2');
  });

  it('caps total pages at 500 even if totalPages is higher', () => {
    // TMDB only returns results up to page 500
    // Showing 50,000 page links would be absurd — we cap at 500
    render(
      <Pagination
        currentPage={1}
        totalPages={50000}
        basePath='/movies/popular'
      />,
    );

    // Page 500 should be visible as a link
    expect(screen.getByRole('link', { name: '500' })).toBeInTheDocument();

    // Page 50000 should NOT be visible
    expect(
      screen.queryByRole('link', { name: '50000' }),
    ).not.toBeInTheDocument();
  });

  it('shows an ellipsis when there is a gap between page numbers', () => {
    // When on page 1 of 10, the visible range is 1–3 and 10
    // There is a gap between 3 and 10, so … should appear
    render(
      <Pagination currentPage={1} totalPages={10} basePath='/movies/popular' />,
    );
    expect(screen.getByText('…')).toBeInTheDocument();
  });
});
