import { runConfetti } from "../../utils/confetti.js";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApiUrl } from "../../config/api.js";
import { useCartStore } from "../../store/cartStore.js";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((state) => state.clearCart);
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("missing-session");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const verifyPayment = async () => {
      attempts += 1;

      try {
        const response = await fetch(`${getApiUrl()}/checkout-session/${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to verify payment status.");
        }

        if (data.status === "completed" && data.order?.isPaid) {
          if (!cancelled) {
            clearCart();
            runConfetti();
            setStatus("completed");
          }
          return;
        }

        if (attempts < 8) {
          setTimeout(verifyPayment, 1500);
          return;
        }

        if (!cancelled) {
          setStatus("pending");
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        if (!cancelled) {
          setError(err.message);
          setStatus("error");
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [clearCart, sessionId]);

  const isCompleted = status === "completed";

  return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
            <svg
              className="w-16 h-16 text-[#6C6A61] mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59L6.41 12 5 13.41l6 6 10-10L19.59 8 11 16.59z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">
              {isCompleted ? "Payment Successful!" : "Verifying Payment"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isCompleted
                ? "Thank you for your purchase at the DEDSV store. Your order has been processed successfully."
                : "We are waiting for Stripe to confirm your payment. This usually takes a few seconds."}
            </p>
            {status === "pending" && (
              <p className="text-amber-600 mt-4 text-sm">
                Payment is still pending. Refresh this page shortly or check your orders in a moment.
              </p>
            )}
            {status === "missing-session" && (
              <p className="text-red-500 mt-4 text-sm">
                Missing Stripe session id. Please check your account orders before trying again.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-500 mt-4 text-sm">
                {error || "Unable to verify payment status."}
              </p>
            )}
            <Link
              to="/account"
              className="mt-6 inline-block bg-[#45423D] text-white py-2 px-6 rounded-lg hover:bg-[#C5C7CA] transition"
            >
              View Orders
            </Link>
            <Link
              to="/"
              className="mt-3 block text-gray-500 hover:text-gray-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
 );
};


export default PaymentSuccess;
