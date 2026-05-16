import { z } from "zod";

const cartLineSchema = z
  .object({
    _id: z
      .string({
        required_error: "Product id is required.",
        invalid_type_error: "Product id must be a string.",
      })
      .trim()
      .min(1, "Product id is required."),
    quantity: z
      .number({
        required_error: "Quantity is required.",
        invalid_type_error: "Quantity must be a number.",
      })
      .int("Quantity must be a whole number.")
      .positive("Quantity must be greater than zero."),
    selectedSize: z
      .string({ invalid_type_error: "Selected size must be a string." })
      .trim()
      .min(1, "Selected size cannot be empty.")
      .optional(),
  })
  .strict();

export const createCheckoutSessionSchema = z
  .object({
    cart: z
      .array(cartLineSchema, {
        required_error: "Cart is required.",
        invalid_type_error: "Cart must be an array.",
      })
      .min(1, "Cart must contain at least one product."),
  })
  .strict();
