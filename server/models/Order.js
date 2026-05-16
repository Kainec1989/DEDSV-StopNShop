import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, default: uuidv4 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerName: { type: String },
  email: { type: String },
  items: [
    {
      name: { type: String },
      quantity: { type: Number },
      price: { type: Number },
    },
  ],
  totalAmount: { type: Number },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
    index: true,
  },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  stripeSessionId: { type: String, unique: true, sparse: true, index: true },
  stripePaymentIntentId: { type: String },
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;