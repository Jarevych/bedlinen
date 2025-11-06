import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Створити нове замовлення
router.post("/", async (req, res) => {
  try {
    const { name, phone, size, fabricId, customSize } = req.body;

    if (!name || !phone || !size || !fabricId) {
      return res.status(400).json({ message: "Всі поля обов'язкові" });
    }

    const newOrder = new Order({
      name,
      phone,
      size,
      customSize: customSize || null,
      fabric: fabricId, 
      status: "pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Замовлення успішно створено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// (опціонально) Отримати всі замовлення
router.get("/", async (req, res) => { 
  const orders = await Order.find()
    // .populate("user", "name email phone") // додає дані користувача
    .populate("fabric", "name pricePerMeter image") // додає дані про постіль
    .sort({ createdAt: -1 });
  res.json(orders);

});


export default router;
