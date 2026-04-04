'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchBar({
  defaultValue = '',
  placeholder = 'Search movies...',
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('q', value);
        params.delete('page');
      } else {
        params.delete('q');
        params.delete('page');
      }

      startTransition(() => {
        router.push(`/search?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  return (
    <div className='relative flex items-center w-full max-w-sm'>
      <span className='absolute left-3.5 text-neutral-500 pointer-events-none'>
        <svg
          width='15'
          height='15'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='11' cy='11' r='8' />
          <line x1='21' y1='21' x2='16.65' y2='16.65' />
        </svg>
      </span>
      <input
        type='search'
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label='Search movies'
        className='w-full h-10 pl-9 pr-10 bg-neutral-800 border border-neutral-700 rounded-full text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-red-600 focus:bg-neutral-700 transition-colors'
      />
      {isPending && (
        <span className='absolute right-3.5 w-4 h-4 border-2 border-neutral-600 border-t-red-600 rounded-full animate-spin' />
      )}
    </div>
  );
}
