/**
 * Animated placeholder for the product detail page while product data is loading.
 */
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 mt-8 animate-pulse" aria-hidden="true">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:w-3/5">
          <div className="w-full aspect-[4/5] rounded-lg bg-gray-200" />
        </div>
        <div className="md:w-2/5 space-y-5">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-6 w-1/4 rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-11 w-full rounded bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="h-11 w-full rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;
