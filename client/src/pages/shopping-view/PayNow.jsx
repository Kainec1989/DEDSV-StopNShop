import { Link } from "react-router-dom";

function PayNow() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-4">Payment Moved to Checkout</h1>
      <p className="text-gray-600 mb-6">
        Stripe Checkout now starts directly from the checkout page so orders are created only after payment is confirmed.
      </p>
      <Link
        to="/checkout"
        className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        Return to Checkout
      </Link>
    </div>
  );
}

export default PayNow;
