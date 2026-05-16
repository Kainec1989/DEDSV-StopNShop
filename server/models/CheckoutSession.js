import mongoose from "mongoose";

const checkoutSessionSchema = new mongoose.Schema(
  {
    stripeSessionId: { type: String, unique: true, sparse: true, index: true },
    stripePaymentIntentId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

const CheckoutSession = mongoose.model("CheckoutSession", checkoutSessionSchema);

export default CheckoutSession;
