/**
 * Product HTTP routes — delegates to controllers; errors flow to global middleware.
 */
import express from "express";
import {
  getProductsByCategory,
  getProductById,
  getAllProducts,
  getProductDetailsForCart,
  createProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get(
  "/category/:cat",
  asyncHandler(getProductsByCategory),
);
router.get(
  "/",
  asyncHandler(getAllProducts),
);
router.get(
  "/:id",
  asyncHandler(getProductById),
);

router.post(
  "/get-product-details",
  asyncHandler(getProductDetailsForCart),
);
router.post(
  "/",
  asyncHandler(createProduct),
);

router.delete(
  "/:id",
  asyncHandler(deleteProduct),
);

export default router;
