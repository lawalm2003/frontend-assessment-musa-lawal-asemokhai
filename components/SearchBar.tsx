'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [value, setValue] = useState(defaultValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep input in sync if defaultValue changes (e.g. browser back/forward)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const pushSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set('q', query);
        params.delete('page');
      } else {
        params.delete('q');
        params.delete('page');
      }
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushSearch(query);
    }, 300);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label='Search movies'
        className='w-full h-10 pl-9 pr-4 bg-neutral-800 border border-neutral-700 rounded-full text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-red-600 focus:bg-neutral-700 transition-colors'
      />
    </div>
  );
}
