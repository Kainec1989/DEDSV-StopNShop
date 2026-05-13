import User from "../models/User.js";

/**
 * After {@link verifyToken}, ensures the authenticated user exists and has role `admin`.
 *
 * @type {import("express").RequestHandler}
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    console.error("requireAdmin middleware error:", err);
    next(err);
  }
};
