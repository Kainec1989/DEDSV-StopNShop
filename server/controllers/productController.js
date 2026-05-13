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
 * DELETE /:id — remove product.
 *
 * @type {import("express").RequestHandler}
 */
export const deleteProduct = async (req, res) => {
  await productService.deleteProductById(req.params.id);
  res.json({ message: "Product removed" });
};
