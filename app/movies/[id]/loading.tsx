export default function MovieDetailLoading() {
  return (
    <div className='min-h-screen animate-pulse'>
      <div className='w-full h-72 md:h-96 bg-neutral-800' />
      <div className='max-w-screen-xl mx-auto px-6 py-8'>
        <div className='flex flex-col md:flex-row gap-8 -mt-24 relative z-10'>
          <div className='shrink-0 w-40 md:w-56 aspect-2/3 bg-neutral-800 rounded-xl' />
          <div className='flex-1 space-y-4 pt-24 md:pt-0'>
            <div className='h-4 bg-neutral-800 rounded w-1/4' />
            <div className='h-8 bg-neutral-800 rounded w-3/4' />
            <div className='h-4 bg-neutral-800 rounded w-1/3' />
            <div className='flex gap-2'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='h-7 w-20 bg-neutral-800 rounded-full' />
              ))}
            </div>
            <div className='space-y-2'>
              <div className='h-4 bg-neutral-800 rounded w-full' />
              <div className='h-4 bg-neutral-800 rounded w-5/6' />
              <div className='h-4 bg-neutral-800 rounded w-4/6' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
