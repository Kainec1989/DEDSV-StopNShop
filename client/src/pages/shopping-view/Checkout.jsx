import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from '../../store/authStore.js';




function Checkout() {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setCustomer({ name: user.name, email: user.email });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateInputs = () => {
    const newErrors = {};
    
    if (!customer.name) newErrors.name = "Full name is required.";
    if (!customer.email) newErrors.email = "Email is required.";
    if (!shippingInfo.address) newErrors.address = "Address is required.";
    if (!shippingInfo.city) newErrors.city = "City is required.";
    if (!shippingInfo.state) newErrors.state = "State is required.";
    if (!shippingInfo.postalCode) newErrors.postalCode = "Postal Code is required.";
    if (!shippingInfo.country) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderNow = async () => {
    if (!validateInputs()) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const totalAmount = getCartTotal();

      const orderData = {
        customerName: customer.name,
        email: customer.email,
        cart: cart.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
        })),
        shippingInfo: { ...shippingInfo },
      };
  
      const token = localStorage.getItem('token');
      await axios.post("/api/orders", orderData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      toast.success("Order placed successfully!");
  
      // ✅ Pass totalAmount to PayNow page
      navigate("/paynow", { state: { cart, shippingInfo, total: totalAmount } });
  
      console.log("Navigating to PayNow with:", { cart, shippingInfo, totalAmount });
    } catch (error) {
      console.error("Order failed:", error.response?.data || error.message);
      alert(`Failed to place order: ${error.response?.data?.message || "Unknown error"}`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-center">Checkout</h1>
      {cart.length === 0 ? (
        <div className="text-center">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                placeholder="Full Name"
                className="border p-2 w-full rounded"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                placeholder="Email Address"
                className="border p-2 w-full rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="border p-2 w-full rounded"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                placeholder="City"
                className="border p-2 w-full rounded"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

              <input
                type="text"
                name="state"
                value={shippingInfo.state}
                onChange={handleInputChange}
                placeholder="State"
                className="border p-2 w-full rounded"
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}

              <input
                type="text"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="border p-2 w-full rounded"
              />
              {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}

              <input
                type="text"
                name="country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="border p-2 w-full rounded"
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full mb-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            >
              {showSummary ? "Hide Order Summary" : "View Order Summary"}
            </button>

            {showSummary && (
              <div className="space-y-2 border p-4 rounded bg-gray-100">
                {cart.map((item, index) => (
                  <div key={`${item._id}-${index}`} className="flex justify-between">
                    <span> <img src={item.image} className="w-20 h-20 object-cover rounded" /> {item.product} (x{item.quantity})</span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                  <span>Total (VAT included):</span>
                  <span>€{getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleOrderNow}
              className="w-full mt-4 bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
