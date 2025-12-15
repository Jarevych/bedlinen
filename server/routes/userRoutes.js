import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const verifyTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("No token");
    err.status = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (e) {
    const err = new Error("Invalid token");
    err.status = 401;
    throw err;
  }
};


const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Немає токена" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Доступ заборонено" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Невірний токен" });
  }
};



router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Немає токена" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Користувача не знайдено" });

    res.json(user);
    console.log(user);
  } catch (err) {
    res.status(401).json({ message: "Невірний або прострочений токен" });
  }
});

router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Немає токена" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Доступ заборонено" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Помилка при отриманні користувачів:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
router.put("/:id/role", authAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Невірна роль" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Помилка при оновленні ролі:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.put("/me", async (req, res) => {
  try {
    // верифікація токена (викине помилку з status=401 якщо проблеми)
    const decoded = verifyTokenFromHeader(req);
console.log(decoded);
    // мінімальна валідація вхідних полів
    const { name, email, phone } = req.body;
    if (!name && !email && !phone) {
      return res.status(400).json({ message: "Немає даних для оновлення" });
    }

    // оновлюємо користувача
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error("❌ Помилка PUT /users/me:", err.message || err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Помилка сервера" });
  }
});

router.delete("/:id", authAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Користувача видалено" });
  } catch (err) {
    console.error("❌ Помилка при видаленні користувача:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

export default router;
