import express from "express";
import CheckoutSession from "../models/CheckoutSession.js";
import Order from "../models/Order.js";
import { sendOrderConfirmation } from "../mailtrap/emails.js";
import { getStripeClient } from "../services/stripeClient.js";

const router = express.Router();

/**
 * Converts Stripe id fields to stable strings when the SDK expands objects.
 *
 * @param {string | { id?: string } | null} value - Stripe id or expanded object.
 * @returns {string | undefined} Normalized id.
 */
function normalizeStripeId(value) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.id;
}

/**
 * Creates the paid order for a completed Stripe Checkout Session exactly once.
 *
 * @param {import("stripe").Stripe.Checkout.Session} session - Completed Stripe Checkout Session.
 */
async function handleCheckoutCompleted(session) {
  const checkoutId = session.metadata?.checkoutId;
  const stripeSessionId = session.id;
  const stripePaymentIntentId = normalizeStripeId(session.payment_intent);

  const checkoutSession = await CheckoutSession.findOne({
    $or: [
      { stripeSessionId },
      ...(checkoutId ? [{ _id: checkoutId }] : []),
    ],
  });

  if (!checkoutSession) {
    throw new Error(`Pending checkout not found for Stripe session ${stripeSessionId}`);
  }

  const existingOrder = await Order.findOne({ stripeSessionId });
  if (existingOrder) {
    checkoutSession.status = "completed";
    checkoutSession.orderId = existingOrder._id;
    checkoutSession.stripePaymentIntentId = stripePaymentIntentId;
    checkoutSession.completedAt = checkoutSession.completedAt || new Date();
    await checkoutSession.save();
    return;
  }

  const order = await Order.create({
    orderId: checkoutSession._id.toString(),
    customerName: checkoutSession.customerName,
    email: checkoutSession.email,
    items: checkoutSession.items,
    totalAmount: checkoutSession.subtotal,
    shippingAddress: checkoutSession.shippingAddress,
    ...(checkoutSession.userId ? { userId: checkoutSession.userId } : {}),
    paymentStatus: "paid",
    isPaid: true,
    paidAt: new Date(),
    stripeSessionId,
    stripePaymentIntentId,
  });

  checkoutSession.status = "completed";
  checkoutSession.orderId = order._id;
  checkoutSession.stripePaymentIntentId = stripePaymentIntentId;
  checkoutSession.completedAt = new Date();
  await checkoutSession.save();

  try {
    await sendOrderConfirmation(order.email, order.items);
  } catch (error) {
    console.error("Order confirmation email failed after Stripe payment:", error);
  }
}

router.post("/", async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe webhook secret is not configured.");
    return res.status(503).json({ error: "Stripe webhook is not configured." });
  }

  let event;
  try {
    event = getStripeClient().webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    res.status(500).json({ error: "Stripe webhook processing failed." });
  }
});

export default router;
