import express from "express";
import Stripe from "stripe";
import { resolveCartFromDatabase } from "../services/cartPricingService.js";
import { AppError } from "../utils/AppError.js";
import { validateBody } from "../middleware/validateRequest.js";
import { createCheckoutSessionSchema } from "../validators/checkoutValidator.js";

const router = express.Router();

/**
 * Lazily creates the Stripe client so a missing local secret key does not
 * prevent the whole API server from starting.
 *
 * @returns {Stripe}
 */
function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new AppError("Stripe is not configured. Set STRIPE_SECRET_KEY in server/.env.", 503);
  }
  return new Stripe(secretKey);
}

router.post(
  "/create-checkout-session",
  validateBody(createCheckoutSessionSchema),
  async (req, res) => {
    try {
      const { cart } = req.body;
      const { lineItemsStripe } = await resolveCartFromDatabase(cart);
      const stripe = getStripeClient();
      const clientBase = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

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
        success_url: `${clientBase}/success`,
        cancel_url: `${clientBase}/cancel`,
      });

      res.json({ id: session.id });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      console.error("Error creating checkout session:", err.message);
      res.status(500).json({ error: "Unable to create checkout session." });
    }
  },
);

export default router;
