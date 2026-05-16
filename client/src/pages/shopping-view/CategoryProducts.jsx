import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/shopping-view/ProductCard";
import ProductSort from "../../components/shopping-view/ProductSort";
import { ProductGridSkeleton } from "../../components/shopping-view/ProductCardSkeleton";

/**
 * Category listing page — loads `/api/products/category/:category`.
 */
function CategoryProducts() {
  const [products, setProducts] = useState([]);
  const { category } = useParams();
  const [sortOption, setSortOption] = useState("lowest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    axios(`/api/products/category/${encodeURIComponent(category)}`)
      .then((res) => {
        if (!cancelled) setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        if (!cancelled) {
          setError("We could not load this category right now. Please try again later.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  const handleSort = (value) => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      if (value === "lowest") {
        return a.price - b.price;
      }
      return b.price - a.price;
    });
    setProducts(sorted);
    setSortOption(value);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-8 relative z-0">
      <ProductSort sortOption={sortOption} onSortChange={handleSort} />
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

export default CategoryProducts;
