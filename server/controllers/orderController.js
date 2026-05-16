import Order from "../models/Order.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { sendOrderConfirmation } from "../mailtrap/emails.js";
import { resolveCartFromOrderBody } from "../services/cartPricingService.js";
import { AppError } from "../utils/AppError.js";

export const createOrder = async (req, res) => {
  const { customerName, email, shippingInfo } = req.body;

  if (!customerName || !email || !shippingInfo) {
    throw new AppError("Missing required order fields", 400);
  }

  const { subtotal, orderItems } = await resolveCartFromOrderBody(req.body);

  let userId;
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (token && process.env.JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch {
      // Invalid or expired token — treat as guest checkout for this order
    }
  }

  const newOrder = new Order({
    orderId: uuidv4(),
    customerName,
    email,
    items: orderItems,
    totalAmount: subtotal,
    shippingAddress: shippingInfo,
    ...(userId ? { userId } : {}),
  });

  await newOrder.save();

  await sendOrderConfirmation(email, orderItems);
  console.log("Order created successfully");
  res.status(201).json({ message: "Order created successfully", order: newOrder });
};


/**
 * Returns all orders (admin dashboard only — must be behind auth + requireAdmin).
 *
 * @type {import("express").RequestHandler}
 */
export const getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

/**
 * Deletes a single order by Mongo id (admin only).
 *
 * @type {import("express").RequestHandler}
 */
export const deleteOrderAdmin = async (req, res) => {
  const deleted = await Order.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new AppError("Order not found", 404);
  }
  res.json({ message: "Order deleted successfully" });
};