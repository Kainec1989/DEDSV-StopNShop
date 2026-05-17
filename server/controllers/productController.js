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
 * GET /search?q=<term> — full-text product search sorted by relevance.
 *
 * Query params:
 *   q     {string}  Search term (required).
 *   limit {number}  Max results (optional, default 20, max 100).
 *
 * @type {import("express").RequestHandler}
 */
export const searchProducts = async (req, res) => {
  const { q, limit } = req.query;
  const parsedLimit = Math.min(parseInt(limit, 10) || 20, 100);
  const results = await productService.searchProducts(q, parsedLimit);
  res.json(results);
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
