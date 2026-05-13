import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Get user account details
router.get('/account', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders for the authenticated user (match by userId when set, or by account email)
router.get("/account/orders", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({
      $or: [{ userId: req.userId }, { email: user.email }],
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
