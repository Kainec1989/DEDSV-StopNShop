import { Link, useParams } from 'react-router-dom';
import { useProductData } from '../../hooks/useProductData';

/**
 * Product detail page — layout and markup only; data and actions come from {@link useProductData}.
 */
function ProductDetail() {
  const { id } = useParams();
  const {
    product,
    loading,
    error,
    notFound,
    selectedSize,
    handleSizeChange,
    handleAddToCart,
  } = useProductData(id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-600">
        Loading…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-2">
          Error 404
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Product not found
        </h1>
        <p className="text-gray-600 mb-8">
          This product does not exist or is no longer available. Check the link or browse the store
          to find what you need.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="md:w-3/5">
          <img
            src={product.image}
            alt={product.product}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Product Info Section */}
        <div className="md:w-2/5">
          <h1 className="text-2xl font-semibold mb-2">{product.product}</h1>
          <div className="text-gray-700 mb-4">${product.price}</div>

          <div className="mb-4">
            <div className="text-gray-700 uppercase text-sm mb-1">Size</div>
            <div className="relative">
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:border-gray-500"
              >
                <option value="">Select Size</option>
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((sizeInfo) => (
                    <option
                      key={sizeInfo.size}
                      value={sizeInfo.size}
                      disabled={sizeInfo.countInStock === 0}
                    >
                      {sizeInfo.size} ({sizeInfo.countInStock} available)
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No sizes available</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-gray-700 text-sm mb-4">{product.description}</div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-2 px-4 rounded ${!selectedSize
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            {!selectedSize ? 'SELECT SIZE' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
