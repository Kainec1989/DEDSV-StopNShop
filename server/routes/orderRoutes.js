import express from "express";
import {
  getAllOrdersAdmin,
  deleteOrderAdmin,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const router = express.Router();

/** Orders must be created by the Stripe webhook after payment confirmation. */
router.post("/orders", asyncHandler(async () => {
  throw new AppError("Direct order creation is disabled. Use Stripe Checkout.", 410);
}));

/** Admin: list all orders */
router.get("/orders", verifyToken, requireAdmin, asyncHandler(getAllOrdersAdmin));

/** Admin: delete order by id */
router.delete("/orders/:id", verifyToken, requireAdmin, asyncHandler(deleteOrderAdmin));

export default router;
