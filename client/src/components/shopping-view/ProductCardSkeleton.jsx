/**
 * Animated placeholder that matches the product card footprint while data loads.
 */
function ProductCardSkeleton() {
  return (
    <div className="block overflow-hidden animate-pulse" aria-hidden="true">
      <div className="w-full h-[500px] rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
      <div className="mt-4 space-y-3">
        <div className="mx-auto h-5 w-2/3 rounded bg-gray-200" />
        <div className="mx-auto h-5 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default ProductCardSkeleton;
