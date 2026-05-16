import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./ProductCardSkeleton";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get("/api/products");
        setProducts(response.data.sort((a, b) => a.price - b.price));
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Products are unavailable right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); 

  return (
    <div>
      {loading && <ProductGridSkeleton />}
      {!loading && error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-6 text-center text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
