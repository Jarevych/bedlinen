import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "./config/cloudinary.js";

// Load env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    "https://bedlinen-five.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
}));

app.use(express.json());

// ========== MULTER (memory) ==========
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Only images are allowed (jpg, jpeg, png)"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// ========== CLOUDINARY UPLOAD ENDPOINT ==========
app.post("/api/fabrics/upload", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    // Convert buffer → base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "lavanda_fabrics",
    });

    return res.json({
      ok: true,
      imageUrl: uploadResult.secure_url,
    });

  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ ok: false, message: "Upload failed" });
  }
});

// ===== ROUTES =====
import fabricRoutes from "./routes/fabrics.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";

app.use("/api/fabrics", fabricRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API працює ✅"));

// ===== MONGODB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Mongo error:", err));

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
