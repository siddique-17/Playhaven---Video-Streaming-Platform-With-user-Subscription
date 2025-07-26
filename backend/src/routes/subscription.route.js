import express from "express";
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/subscribe", protectRoute, async (req, res) => {
  const { plan } = req.body;

  const validPlans = ["basic", "standard", "premium"];
  if (!validPlans.includes(plan)) {
    return res.status(400).json({ message: "Invalid subscription plan selected" });
  }

  try {
    const user = req.user;

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Update user's subscription
    user.subscription.plan = plan;
    user.subscription.expiresAt = expiresAt;

    await user.save();

    res.status(200).json({
      message: `Successfully subscribed to ${plan}`,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error("Subscription error:", error.message);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});

export default router;
