import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-6'>
      <p className='text-8xl font-black text-neutral-800 mb-4'>404</p>
      <h1 className='text-2xl font-bold text-neutral-200 mb-2'>
        Page not found
      </h1>
      <p className='text-neutral-500 mb-8 max-w-sm'>
        {` The movie or page you're looking for doesn't exist.`}
      </p>
      <Link
        href='/'
        className='px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-md transition-colors'
      >
        Back to Home
      </Link>
    </div>
  );
}
