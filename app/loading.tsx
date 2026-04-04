export default function Loading() {
  return (
    <div className='max-w-screen-xl mx-auto px-6 py-10 animate-pulse'>
      <div className='w-full h-72 md:h-96 bg-neutral-800 rounded-xl mb-10' />
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className='aspect-[2/3] bg-neutral-800 rounded-xl' />
        ))}
      </div>
    </div>
  );
}
