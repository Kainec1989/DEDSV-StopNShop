import express from "express";
import jwt from "jsonwebtoken";
import CheckoutSession from "../models/CheckoutSession.js";
import { resolveCartFromDatabase } from "../services/cartPricingService.js";
import { AppError } from "../utils/AppError.js";
import { validateBody } from "../middleware/validateRequest.js";
import { createCheckoutSessionSchema } from "../validators/checkoutValidator.js";
import { getStripeClient } from "../services/stripeClient.js";

const router = express.Router();

/**
 * Reads a user id from the optional bearer token. Invalid tokens are ignored so
 * guest checkout can still create a Stripe session.
 *
 * @param {import("express").Request} req - Express request.
 * @returns {string | undefined} Authenticated user id when present.
 */
function getOptionalUserId(req) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token || !process.env.JWT_SECRET) {
    return undefined;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return undefined;
  }
}

router.post(
  "/create-checkout-session",
  validateBody(createCheckoutSessionSchema),
  async (req, res) => {
    let checkoutSnapshot;

    try {
      const { cart, customerName, email, shippingInfo } = req.body;
      const { subtotal, lineItemsStripe, orderItems } = await resolveCartFromDatabase(cart);
      const stripe = getStripeClient();
      const clientBase = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
      const userId = getOptionalUserId(req);

      checkoutSnapshot = await CheckoutSession.create({
        ...(userId ? { userId } : {}),
        customerName,
        email,
        items: orderItems,
        subtotal,
        shippingAddress: shippingInfo,
        status: "pending",
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 500, currency: "eur" },
              display_name: "Standard Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 1500, currency: "eur" },
              display_name: "Express Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 1 },
                maximum: { unit: "business_day", value: 3 },
              },
            },
          },
        ],
        line_items: lineItemsStripe,
        mode: "payment",
        customer_email: email,
        client_reference_id: checkoutSnapshot._id.toString(),
        metadata: {
          checkoutId: checkoutSnapshot._id.toString(),
        },
        success_url: `${clientBase}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientBase}/cancel`,
      });

      checkoutSnapshot.stripeSessionId = session.id;
      await checkoutSnapshot.save();

      res.json({ id: session.id });
    } catch (err) {
      if (checkoutSnapshot && !checkoutSnapshot.stripeSessionId) {
        await CheckoutSession.findByIdAndUpdate(checkoutSnapshot._id, { status: "failed" }).catch((updateError) => {
          console.error("Error marking checkout snapshot as failed:", updateError.message);
        });
      }

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      console.error("Error creating checkout session:", err.message);
      res.status(500).json({ error: "Unable to create checkout session." });
    }
  },
);

router.get("/checkout-session/:sessionId", async (req, res) => {
  try {
    const checkoutSession = await CheckoutSession.findOne({
      stripeSessionId: req.params.sessionId,
    }).populate("orderId", "_id orderId paymentStatus isPaid");

    if (!checkoutSession) {
      throw new AppError("Checkout session not found.", 404);
    }

    res.json({
      sessionId: checkoutSession.stripeSessionId,
      status: checkoutSession.status,
      order: checkoutSession.orderId
        ? {
            id: checkoutSession.orderId._id,
            orderId: checkoutSession.orderId.orderId,
            paymentStatus: checkoutSession.orderId.paymentStatus,
            isPaid: checkoutSession.orderId.isPaid,
          }
        : null,
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    console.error("Error fetching checkout session status:", err.message);
    res.status(500).json({ error: "Unable to fetch checkout session status." });
  }
});

export default router;
