import express from "express";
import { getUsers, createUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;