import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="group block overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.product}
          className="w-full h-[500px] object-cover transition-transform duration-300 transform group-hover:scale-110"
        />
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-lg font-medium text-gray-900">{product.product}</h2>
        <h2 className="text-lg font-medium text-gray-900">€{product.price}</h2>
      </div>
    </Link>
  );
}

export default ProductCard;

