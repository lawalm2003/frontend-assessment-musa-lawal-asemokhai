'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchQuery?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchQuery,
}: PaginationProps) {
  const maxPages = Math.min(totalPages, 500);
  const delta = 2; //pagination window (currentPage = 10 → show: 8, 9, 10, 11, 12)

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (searchQuery) params.set('q', searchQuery);
    return `${basePath}?${params.toString()}`;
  };

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(maxPages, currentPage + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push('...');
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < maxPages) {
      if (right < maxPages - 1) pages.push('...');
      pages.push(maxPages);
    }

    return pages;
  };

  if (maxPages <= 1) return null;

  const pageBtn =
    'flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-md text-sm font-medium transition-colors';

  return (
    <nav
      className='flex items-center justify-center gap-2 py-8 flex-wrap'
      aria-label='Pagination'
    >
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className={`${pageBtn} bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white`}
        >
          ← Prev
        </Link>
      )}

      <div className='flex gap-1'>
        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className='flex items-center justify-center w-9 h-9 text-sm text-neutral-500 cursor-default'
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`${pageBtn} ${
                page === currentPage
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
              }`}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {currentPage < maxPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className={`${pageBtn} bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white`}
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
