import { useLocation } from "react-router-dom";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { getApiUrl } from "../../config/api.js";

//  Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PayNow() {
  //const { state } = useLocation();
  //const { cart, shippingInfo, total: initialTotal } = state;
  const location = useLocation();
  const state = location.state || {}; // Ensure state is always an object
  const { cart = [], shippingInfo = {}, total: initialTotal = 0 } = state;
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(initialTotal);
  // PROMO CODE
  const applyPromoCode = async () => {
    try {
      const { data } = await axios.post(`${getApiUrl()}/promo/apply`, { code: promoCode });
      setDiscount(data.discount);
      setFinalTotal(initialTotal - data.discount);
    } catch (error) {
      alert("Invalid promo code");
    }
  };
  

  const handlePayNow = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, total: finalTotal, discount }),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Checkout session error:", errorData.error);
        return alert(`Error: ${errorData.error}`);
      }

      const session = await response.json();

      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to load");
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (error) {
        console.error("Stripe Checkout error", error);
      }
    } catch (error) {
      console.error("Error creating checkout session", error);
    }
  };

  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Pay Now</h1>

      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2 border p-4 rounded ">
        {cart.map((item, index) => (
          <div key={`${item._id}-${index}`} className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded"
            />
            <div className="flex flex-col flex-grow">
              <span className="font-semibold">
                {item.name} (x{item.quantity})
              </span>
              <span className="text-sm text-gray-600">{item.description}</span>
            </div>
            <span>€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
          <span>Subtotal:</span>
          <span>€{initialTotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Discount Applied:</span>
            <span>-€{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total (VAT included):</span>
          <span>€{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="p-2 text-[#b8790d]">ADD PROMO CODE</h2>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={applyPromoCode}
          className="bg-[#6C6A61] hover:bg-[#45423D] hover:cursor-pointer  text-white px-4 py-2 rounded"
        >
          Apply
        </button>
        {discount > 0 && (
          <p className="text-[#45423D]  mt-2">
            Discount applied: {discount}% off
          </p>
        )}
      </div>

      <button
        onClick={handlePayNow}
        className="w-85  mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Pay Now
      </button>
    </div>
  );
}

export default PayNow;
