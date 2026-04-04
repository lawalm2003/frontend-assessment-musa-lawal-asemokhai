export default function Loading() {
  return (
    <div className='min-h-screen animate-pulse'>
      {/* Hero */}
      <div className='w-full h-80 md:h-[420px] bg-neutral-800' />

      {/* Header */}
      <div className='border-b border-neutral-800 bg-neutral-950'>
        <div className='max-w-screen-xl mx-auto px-6 py-8'>
          <div className='h-3 w-20 bg-neutral-800 rounded mb-2' />
          <div className='h-8 w-44 bg-neutral-800 rounded mb-6' />
          <div className='flex gap-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-8 w-24 bg-neutral-800 rounded-full' />
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl mx-auto px-6 py-10'>
        {/* Horizontal scroll row */}
        <div className='h-3 w-24 bg-neutral-800 rounded mb-5' />
        <div className='flex gap-4 overflow-hidden mb-12'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='shrink-0 w-28 aspect-[2/3] bg-neutral-800 rounded-xl'
            />
          ))}
        </div>

        {/* Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className='aspect-[2/3] bg-neutral-800 rounded-xl' />
          ))}
        </div>
      </div>
    </div>
  );
}
