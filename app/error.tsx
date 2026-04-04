'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-6'>
      <p className='text-5xl mb-4'>⚠️</p>
      <h2 className='text-xl font-bold text-neutral-200 mb-2'>
        Something went wrong
      </h2>
      <p className='text-neutral-500 mb-8 max-w-sm text-sm'>
        Failed to load data. This could be a network issue or an invalid API
        key.
      </p>
      <button
        onClick={reset}
        className='px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-sm font-semibold rounded-md transition-colors'
      >
        Try again
      </button>
    </div>
  );
}
