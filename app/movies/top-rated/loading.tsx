export default function Loading() {
  return (
    <div className='min-h-screen animate-pulse'>
      {/* Header */}
      <div className='border-b border-neutral-800 bg-neutral-950'>
        <div className='max-w-screen-xl mx-auto px-6 py-10'>
          <div className='h-3 w-16 bg-neutral-800 rounded mb-3' />
          <div className='h-10 w-48 bg-neutral-800 rounded mb-2' />
          <div className='h-3 w-72 bg-neutral-800 rounded mb-8' />
          <div className='flex gap-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-8 w-24 bg-neutral-800 rounded-full' />
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl mx-auto px-6 py-10'>
        {/* #1 hero */}
        <div className='h-3 w-24 bg-neutral-800 rounded mb-5' />
        <div className='h-48 bg-neutral-800 rounded-2xl mb-12' />

        {/* Ranked rows */}
        <div className='h-3 w-32 bg-neutral-800 rounded mb-5' />
        <div className='flex flex-col gap-2 mb-8'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='h-16 bg-neutral-800 rounded-xl' />
          ))}
        </div>
      </div>
    </div>
  );
}
