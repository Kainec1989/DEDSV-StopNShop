import express from "express";
import { getUsers, createUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get("/", asyncHandler(getUsers));
router.post("/", asyncHandler(createUser));
router.delete("/:id", asyncHandler(deleteUser));

export default router;