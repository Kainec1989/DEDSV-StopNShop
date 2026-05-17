import * as productService from "../services/productService.js";

/**
 * GET /category/:cat — products filtered by category.
 *
 * @type {import("express").RequestHandler}
 */
export const getProductsByCategory = async (req, res) => {
  const products = await productService.getProductsByCategory(req.params.cat);
  res.json(products);
};

/**
 * GET /:id — single product.
 *
 * @type {import("express").RequestHandler}
 */
export const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json(product);
};

/**
 * GET / — all products.
 *
 * @type {import("express").RequestHandler}
 */
export const getAllProducts = async (req, res) => {
  const products = await productService.listProducts();
  res.json(products);
};

/**
 * POST /get-product-details — merge cart items with DB product fields.
 *
 * @type {import("express").RequestHandler}
 */
export const getProductDetailsForCart = async (req, res) => {
  const details = await productService.getCartProductDetails(req.body.cart);
  res.json(details);
};

/**
 * POST / — create product.
 *
 * @type {import("express").RequestHandler}
 */
export const createProduct = async (req, res) => {
  const created = await productService.createProductRecord(req.body);
  res.status(201).json(created);
};

/**
 * GET /search?q=<term>[&limit=<n>] — full-text product search sorted by relevance.
 *
 * Uses the MongoDB `$text` operator against the `ProductTextSearch` compound
 * text index (fields: `product` weight 3, `description` weight 1).
 * Results are sorted by `$meta: "textScore"` — highest relevance first.
 *
 * Query params:
 *   q     {string}   Search term (required, min 1 char after trim).
 *   limit {integer}  Max results to return (optional, default 20, hard cap 100).
 *
 * Successful response shape:
 * ```json
 * {
 *   "success": true,
 *   "meta": { "query": "jacket", "count": 3, "limit": 20, "took_ms": 12 },
 *   "data": [ { "_id": "...", "product": "Leather Jacket", "score": 2.4, ... } ]
 * }
 * ```
 *
 * Error (missing query) shape:
 * ```json
 * { "success": false, "error": "Query parameter \"q\" is required." }
 * ```
 *
 * @type {import("express").RequestHandler}
 */
export const searchProducts = async (req, res) => {
  const { q, limit } = req.query;

  if (!q || !q.trim()) {
    return res.status(422).json({
      success: false,
      error: 'Query parameter "q" is required.',
    });
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const startedAt = Date.now();

  const hits = await productService.searchProducts(q, parsedLimit);

  return res.json({
    success: true,
    meta: {
      query: q.trim(),
      count: hits.length,
      limit: parsedLimit,
      took_ms: Date.now() - startedAt,
    },
    data: hits,
  });
};

/**
 * DELETE /:id — remove product.
 *
 * @type {import("express").RequestHandler}
 */
export const deleteProduct = async (req, res) => {
  await productService.deleteProductById(req.params.id);
  res.json({ message: "Product removed" });
};
