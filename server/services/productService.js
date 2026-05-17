import Product from "../models/Product.js";
import { AppError } from "../utils/AppError.js";

/**
 * Normalizes category path segments (URL decoding and invisible joiner removal).
 *
 * @param {string} rawCategory - Raw `req.params.cat` value.
 * @returns {string}
 */
function normalizeCategoryParam(rawCategory) {
  return decodeURIComponent(rawCategory).replace(/\u200D/g, "");
}

/**
 * Returns products for a storefront category.
 *
 * @param {string} rawCategory - Category segment from the URL.
 * @returns {Promise<import("mongoose").HydratedDocument<unknown>[]>}
 */
export async function getProductsByCategory(rawCategory) {
  const category = normalizeCategoryParam(rawCategory);
  return Product.find({ category });
}

/**
 * Returns a single product by MongoDB id, or throws if missing.
 *
 * @param {string} id - Product id from the URL.
 * @returns {Promise<import("mongoose").HydratedDocument<unknown>>}
 */
export async function getProductById(id) {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("There is no such product.", 404);
  }
  return product;
}

/**
 * Returns every product in the catalog.
 *
 * @returns {Promise<import("mongoose").HydratedDocument<unknown>[]>}
 */
export async function listProducts() {
  return Product.find();
}

/**
 * Enriches cart line items with live product fields from the database.
 *
 * @param {unknown} cartPayload - Request body `cart` (must be an array of items with `_id`).
 * @returns {Promise<object[]>}
 */
export async function getCartProductDetails(cartPayload) {
  if (!Array.isArray(cartPayload)) {
    throw new AppError("Cart must be an array.", 400);
  }

  if (cartPayload.length === 0) {
    return [];
  }

  const productIds = cartPayload.map((item) => item._id);
  const products = await Product.find({ _id: { $in: productIds } });

  return cartPayload.map((item) => {
    const product = products.find((p) => p._id.toString() === item._id);
    return {
      ...item,
      image: product?.image ?? null,
      description: product?.description ?? null,
      price: product?.price ?? null,
    };
  });
}

/**
 * Full-text search across `product` (name) and `description` fields using
 * the MongoDB text index defined on the Product schema.
 *
 * Results are sorted by relevance score (descending): name matches are ranked
 * higher than description matches because the text index assigns `product`
 * a weight of 3 vs. 1 for `description`.
 *
 * @param {string} query - Raw search string from the client (e.g. "sneaker").
 * @param {number} [limit=20] - Maximum number of results to return.
 * @returns {Promise<object[]>} Array of product documents enriched with `score`.
 */
export async function searchProducts(query, limit = 20) {
  if (!query || !query.trim()) {
    throw new AppError("Search query must not be empty.", 400);
  }

  return Product.find(
    { $text: { $search: query.trim() } },
    { score: { $meta: "textScore" } },
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .lean();
}

/**
 * Persists a new product document.
 *
 * @param {{
 *  product: string,
 *  price: number,
 *  description: string,
 *  image: string,
 *  category: string,
 *  sizes: object[],
 * }} data - Validated product payload.
 * @returns {Promise<import("mongoose").HydratedDocument<unknown>>}
 */
export async function createProductRecord(data) {
  const { product, price, description, image, category, sizes } = data;
  const newProduct = new Product({
    product,
    price,
    description,
    image,
    category,
    sizes,
  });
  await newProduct.save();
  return newProduct;
}

/**
 * Deletes a product by id.
 *
 * @param {string} id - Product id from the URL.
 * @returns {Promise<void>}
 */
export async function deleteProductById(id) {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  await product.deleteOne();
}
