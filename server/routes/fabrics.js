import express from "express";
import multer from "multer";
// import path from "path";
// const parser = require("../middleware/upload");
import { getFabrics, getFabric, addFabric, updateFabric, deleteFabric } from "../controllers/fabricController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const router = express.Router();
// Налаштування multer для збереження фото
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bedlinen", // папка у Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
// ГЕТ всі тканини
const upload = multer({ storage });
router.get("/", getFabrics);

// ГЕТ конкретна тканина
router.get("/:id", getFabric);

// POST додати тканину (только адмін)
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  addFabric
);
// PUT редагувати тканину
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  updateFabric
);
// DELETE видалити тканину
router.delete("/:id", authMiddleware, isAdmin, deleteFabric);

export default router;
