'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/movies/popular', label: 'Popular' },
  { href: '/movies/top-rated', label: 'Top Rated' },
  { href: '/movies/now-playing', label: 'Now Playing' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className='sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800'>
      <nav className='max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8'>
        {/* Hamburger — mobile only */}
        <button
          className='flex md:hidden items-center justify-center w-8 h-8 text-neutral-400 hover:text-neutral-100 transition-colors'
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          ) : (
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='3' y1='6' x2='21' y2='6' />
              <line x1='3' y1='12' x2='21' y2='12' />
              <line x1='3' y1='18' x2='21' y2='18' />
            </svg>
          )}
        </button>

        {/* Logo */}
        <Link
          href='/'
          className='text-xl font-extrabold text-neutral-100 tracking-tight shrink-0'
          onClick={() => setMenuOpen(false)}
        >
          <span className='text-red-600'>Movie</span>Verse
        </Link>

        {/* Desktop links */}
        <div className='hidden md:flex items-center gap-1 shrink-0'>
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'text-neutral-100 bg-neutral-800'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <div className='ml-auto'>
          <Suspense
            fallback={
              <div className='w-64 h-10 bg-neutral-800 rounded-full animate-pulse' />
            }
          >
            <SearchBar />
          </Suspense>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className='md:hidden border-t border-neutral-800 bg-neutral-950'>
          <div className='max-w-screen-xl mx-auto px-6 py-3 flex flex-col'>
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`py-3 text-sm font-medium border-b border-neutral-800 last:border-0 transition-colors ${
                    active
                      ? 'text-neutral-100'
                      : 'text-neutral-400 hover:text-neutral-100'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
