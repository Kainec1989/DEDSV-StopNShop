import express from "express";
import PromoCode from "../models/promoCode.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/promo/apply", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Promo code is required" });
    }
    const promo = await PromoCode.findOne({ code: code.trim() });
    if (!promo) {
      return res.status(400).json({ message: "Invalid promo code" });
    }
    res.json({ discount: promo.discount });
  } catch (err) {
    console.error("Promo apply error:", err);
    res.status(500).json({ message: "Unable to apply promo code" });
  }
});

router.post("/recommendations", async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.json([]);
    }

    const productIds = cart.map((item) => item?._id).filter(Boolean);
    if (productIds.length === 0) {
      return res.json([]);
    }

    const category = await Product.find({ _id: { $in: productIds } }).distinct("category");

    const recommendations = await Product.find({
      category: { $in: category },
      _id: { $nin: productIds },
    }).limit(4);

    res.json(recommendations);
  } catch (err) {
    console.error("Recommendations error:", err);
    res.status(500).json({ message: "Unable to load recommendations" });
  }
});

export default router;
