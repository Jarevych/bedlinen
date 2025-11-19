import express from "express";
import Order from "../models/Order.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
import { optionalAuth } from "../middleware/optionalMiddleware.js";
/**
 * 🛍️ Створення нового замовлення
 */
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { name, phone, size, fabricId, customSize, comment } = req.body;

    // 🧩 Перевірка обов’язкових полів
    if (!name || !phone || !size || !fabricId) {
      return res.status(400).json({ message: "Всі обов’язкові поля мають бути заповнені" });
    }

    // 🧾 Формування замовлення
    const newOrder = new Order({
      user: req.user?.id || null, 
      name,
      phone,
      size,
      fabric: fabricId,
      customSize: customSize || {},
      comment: comment || "", // ✅ коментар користувача
      status: "pending",
    });

    console.log("📦 Отримано замовлення:", req.body);

    await newOrder.save();

    res.status(201).json({
      message: "✅ Замовлення успішно створено",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Помилка при створенні замовлення:", err);
    res.status(500).json({ message: "Помилка сервера при створенні замовлення" });
  }
});

/**
 * 📋 Отримати всі замовлення (для адмінки)
 */
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("fabric", "name pricePerMeter image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Помилка при отриманні замовлень:", err);
    res.status(500).json({ message: "Помилка при отриманні замовлень" });
  }
});
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const myOrders = await Order.find({ user: req.user.id })
      .populate("fabric", "name pricePerMeter image")
      .sort({ createdAt: -1 });

    res.json(myOrders);
  } catch (err) {
    console.error("❌ Помилка при отриманні замовлень користувача:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
export default router;
