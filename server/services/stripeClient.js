import Stripe from "stripe";
import { AppError } from "../utils/AppError.js";

/**
 * Lazily creates the Stripe client so local development can start without a secret key.
 *
 * @returns {Stripe} Configured Stripe SDK client.
 */
export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new AppError("Stripe is not configured. Set STRIPE_SECRET_KEY in server/.env.", 503);
  }

  return new Stripe(secretKey);
}
