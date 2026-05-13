import express from "express";
import {
  createOrder,
  getAllOrdersAdmin,
  deleteOrderAdmin,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

/** Guest or logged-in checkout */
router.post("/orders", createOrder);

/** Admin: list all orders */
router.get("/orders", verifyToken, requireAdmin, getAllOrdersAdmin);

/** Admin: delete order by id */
router.delete("/orders/:id", verifyToken, requireAdmin, deleteOrderAdmin);

export default router;
