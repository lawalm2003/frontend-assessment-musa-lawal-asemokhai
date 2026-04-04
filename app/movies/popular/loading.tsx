export default function Loading() {
  return (
    <div className='min-h-screen animate-pulse'>
      {/* Header */}
      <div className='border-b border-neutral-800 bg-neutral-950'>
        <div className='max-w-screen-xl mx-auto px-6 py-10'>
          <div className='h-3 w-16 bg-neutral-800 rounded mb-3' />
          <div className='h-10 w-56 bg-neutral-800 rounded mb-2' />
          <div className='h-3 w-72 bg-neutral-800 rounded mb-8' />
          <div className='flex gap-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-8 w-24 bg-neutral-800 rounded-full' />
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl mx-auto px-6 py-10'>
        {/* Spotlight row */}
        <div className='h-3 w-24 bg-neutral-800 rounded mb-5' />
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='aspect-video bg-neutral-800 rounded-2xl' />
          ))}
        </div>

        {/* Grid */}
        <div className='h-3 w-32 bg-neutral-800 rounded mb-5' />
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className='aspect-[2/3] bg-neutral-800 rounded-xl' />
          ))}
        </div>
      </div>
    </div>
  );
}
