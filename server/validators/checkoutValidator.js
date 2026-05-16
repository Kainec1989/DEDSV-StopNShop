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

const shippingInfoSchema = z
  .object({
    address: z.string().trim().min(1, "Address is required."),
    city: z.string().trim().min(1, "City is required."),
    state: z.string().trim().min(1, "State is required."),
    postalCode: z.string().trim().min(1, "Postal code is required."),
    country: z.string().trim().min(1, "Country is required."),
  })
  .strict();

export const createCheckoutSessionSchema = z
  .object({
    customerName: z.string().trim().min(1, "Customer name is required."),
    email: z.string().trim().email("A valid email is required."),
    shippingInfo: shippingInfoSchema,
    cart: z
      .array(cartLineSchema, {
        required_error: "Cart is required.",
        invalid_type_error: "Cart must be an array.",
      })
      .min(1, "Cart must contain at least one product."),
  })
  .strict();
