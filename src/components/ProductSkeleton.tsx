const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] rounded overflow-hidden mb-4" style={{ background: 'var(--c-bg10)' }} />
    <div className="h-4 rounded w-2/3 mb-2" style={{ background: 'var(--c-bg10)' }} />
    <div className="h-3 rounded w-1/2" style={{ background: 'var(--c-bg8)' }} />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6">
    {Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}
  </div>
);

export default ProductSkeleton;
