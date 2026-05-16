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
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

const limit = authRateLimit({ windowMs: 15 * 60 * 1000, max: 40 });

router.get("/check-auth", verifyToken, asyncHandler(checkAuth));

router.post("/signup", limit, asyncHandler(signup));
router.post("/login", limit, asyncHandler(login));
router.post("/logout", logout);
router.post("/verify-email", limit, asyncHandler(verifyEmail));
router.post("/forgot-password", limit, asyncHandler(forgotPassword));
router.post("/reset-password/:token", limit, asyncHandler(resetPassword));

export default router;
