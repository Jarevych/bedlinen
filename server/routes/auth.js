import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import crypto from "crypto";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const API_BASE = process.env.API_BASE || "http://localhost:5173";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 📌 Реєстрація
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ message: "Будь ласка, заповніть усі поля" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { name }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Користувач з такими даними вже існує" });
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    const token = generateToken(user);

    res.json({
      message: "Реєстрація успішна",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("❌ Помилка реєстрації:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// 📌 Логін
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Користувача не знайдено" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Невірний пароль" });
    }

    const token = generateToken(user);

    res.json({
      message: "Успішний вхід",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("❌ Помилка логіну:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Немає токена" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Помилка отримання користувача:", err);
    res.status(401).json({ message: "Невірний або прострочений токен" });
  }
});

import crypto from "crypto";

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // 1️⃣ генеруємо raw token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2️⃣ зберігаємо ХЕШ токена
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 хв

    await user.save();

    // 3️⃣ лінк (поки просто console.log)
    const resetLink = `${API_BASE}/reset-password/${resetToken}`;

    console.log("🔑 RESET LINK:", resetLink);

    res.json({ message: "Посилання для скидання пароля відправлено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Токен недійсний або прострочений" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Пароль успішно змінено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});


export default router;
