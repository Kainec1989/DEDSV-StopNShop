import express from "express";

import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authRateLimit } from "../middleware/authRateLimit.js";

const router = express.Router();

const limit = authRateLimit({ windowMs: 15 * 60 * 1000, max: 40 });

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", limit, signup);
router.post("/login", limit, login);
router.post("/logout", logout);
router.post("/verify-email", limit, verifyEmail);
router.post("/forgot-password", limit, forgotPassword);
router.post("/reset-password/:token", limit, resetPassword);

export default router;
