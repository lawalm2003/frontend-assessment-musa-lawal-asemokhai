export default function Loading() {
  return (
    <div className='max-w-screen-xl mx-auto px-6 py-10 animate-pulse'>
      <div className='mb-8'>
        <div className='h-8 w-56 bg-neutral-800 rounded-lg mb-2' />
        <div className='h-[3px] w-10 bg-neutral-700 rounded-full' />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className='aspect-[2/3] bg-neutral-800 rounded-xl' />
        ))}
      </div>
    </div>
  );
}
