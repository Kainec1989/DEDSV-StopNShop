import Product from "../models/Product.js";
import { AppError } from "../utils/AppError.js";

/**
 * Builds a cart payload for pricing from legacy order `items` if each row has `productId`.
 *
 * @param {unknown} items
 * @returns {{ _id: string, quantity: number, selectedSize?: string }[] | null}
 */
function itemsToCartPayload(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const hasIds = items.every((i) => i && i.productId);
  if (!hasIds) return null;
  return items.map((i) => ({
    _id: String(i.productId),
    quantity: Number(i.quantity),
    selectedSize: i.selectedSize,
  }));
}

/**
 * Resolves each cart line against the database: authoritative price, stock, and Stripe line items.
 * Client-supplied prices are ignored.
 *
 * @param {unknown} cart - Array of `{ _id, quantity, selectedSize? }`.
 * @returns {Promise<{
 *   subtotal: number,
 *   lineItemsStripe: object[],
 *   orderItems: { name: string, quantity: number, price: number }[],
 * }>}
 */
export async function resolveCartFromDatabase(cart) {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new AppError("Cart must be a non-empty array.", 400);
  }

  const ids = [...new Set(cart.map((c) => (c && c._id != null ? String(c._id) : "")).filter(Boolean))];
  if (ids.length === 0) {
    throw new AppError("Each cart line must include a valid product _id.", 400);
  }

  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  let subtotal = 0;
  const lineItemsStripe = [];
  const orderItems = [];

  for (const line of cart) {
    if (!line || line._id == null || String(line._id).trim() === "") {
      throw new AppError("Each cart line must include a valid product _id.", 400);
    }
    const id = String(line._id);
    const qty = Number(line.quantity);

    if (!Number.isFinite(qty) || qty < 1 || !Number.isInteger(qty)) {
      throw new AppError("Each line must have a positive integer quantity.", 400);
    }

    const product = byId.get(id);
    if (!product) {
      throw new AppError(`Product not found: ${id}`, 400);
    }

    const sizes = product.sizes && Array.isArray(product.sizes) ? product.sizes : [];
    if (sizes.length > 0) {
      const sel = line.selectedSize;
      if (!sel) {
        throw new AppError(`Size is required for product: ${product.product}`, 400);
      }
      const row = sizes.find((s) => s.size === sel);
      if (!row) {
        throw new AppError(`Invalid size for product: ${product.product}`, 400);
      }
      if (row.countInStock < qty) {
        throw new AppError(`Insufficient stock for ${product.product} (${sel}).`, 400);
      }
    }

    const unitPrice = Number(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new AppError(`Invalid catalog price for product: ${product.product}`, 500);
    }

    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;

    lineItemsStripe.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: product.product,
          ...(product.image ? { images: [product.image] } : {}),
          description: (product.description || "").slice(0, 500),
        },
        unit_amount: Math.round(unitPrice * 100),
      },
      quantity: qty,
    });

    orderItems.push({
      name: product.product,
      quantity: qty,
      price: unitPrice,
    });
  }

  return { subtotal, lineItemsStripe, orderItems };
}

/**
 * Resolves cart from `cart` body or legacy `items` with `productId`.
 *
 * @param {{ cart?: unknown, items?: unknown }} body
 */
export async function resolveCartFromOrderBody(body) {
  const { cart, items } = body;
  const cartPayload =
    Array.isArray(cart) && cart.length > 0 ? cart : itemsToCartPayload(items);
  if (!cartPayload) {
    throw new AppError("Provide a non-empty cart or items with productId, quantity, and optional selectedSize.", 400);
  }
  return resolveCartFromDatabase(cartPayload);
}
