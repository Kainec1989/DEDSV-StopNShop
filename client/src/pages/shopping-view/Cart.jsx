import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { selectCart, selectCartTotal, useCartStore } from "../../store/cartStore.js";
import axios from "axios";

function Cart() {
  const cart = useCartStore(selectCart);
  const totalBeforeDiscount = useCartStore(selectCartTotal);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const total = totalBeforeDiscount * (1 - discount / 100);

  const fetchRecommendations = useCallback(async () => {
    try {
      const { data } = await axios.post(
        "/api/recommendations",
        { cart }
      );
      setRecommendedProducts(data);
    } catch (error) {
      console.error("Error fetching recommendations", error);
    }
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      fetchRecommendations();
    } else {
      setRecommendedProducts([]);
    }
  }, [cart.length, fetchRecommendations]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div>
          <p>Your cart is currently empty.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          {/* Cart Items */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {cart.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="border p-4 rounded shadow flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.product || item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.product || item.name}</h2>
                    <p className="text-gray-600">€{item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.selectedSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.selectedSize,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.selectedSize,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id, item.selectedSize)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="flex flex-col space-y-2 border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total (VAT included):</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors mt-4"
          >
            Proceed to Checkout
          </button>

          
          {recommendedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">You may also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map((product) => (
                  <div key={product._id} className="border p-4 rounded shadow">
                    <img
                      src={product.image}
                      alt={product.product}
                      className="w-full h-70 object-cover rounded"
                    />
                    <h3 className="text-md font-semibold mt-2">
                      {product.product}
                    </h3>
                    <p className="text-gray-600">€{product.price.toFixed(2)}</p>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="mt-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      View Product
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
