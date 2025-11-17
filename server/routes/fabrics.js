// import express from "express";
// import { getFabrics, addFabric, updateFabric, deleteFabric } from "../controllers/fabricController.js";
// import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
// // import express from "express";
// import Fabric from "../models/Fabric.js";

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const fabrics = await Fabric.find().sort({ createdAt: -1 });
//     res.json(fabrics);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const fabric = await Fabric.findById(id);
//     if (!fabric) return res.status(404).json({ message: "Fabric not found" });
//     res.json(fabric);
//   } catch (err) {
//     console.error("GET /api/fabrics/:id error:", err);
//     res.status(400).json({ message: "Invalid id or server error" });
//   }
// });

// router.post("/", authMiddleware, isAdmin, async (req, res) => {
//   try {
//     const fabric = new Fabric(req.body);
//     await fabric.save();
//     res.status(201).json(fabric);
//   } catch (err) {
//     res.status(500).json({ message: "Помилка при додаванні тканини" });
//   }
// });

// router.put("/:id", /* protect, */ async (req, res) => {
//   try {
//     const updated = await Fabric.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// router.delete("/:id", /* protect, */ async (req, res) => {
//   try {
//     await Fabric.findByIdAndDelete(req.params.id);
//     res.json({ ok: true });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// router.get("/", getFabrics);
// router.get('/:id');
// router.post("/", addFabric);
// router.put("/:id", updateFabric);
// router.delete("/:id", deleteFabric);

// export default router;
import express from "express";
import multer from "multer";
import path from "path";
import { getFabrics, getFabric, addFabric, updateFabric, deleteFabric } from "../controllers/fabricController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

// Налаштування multer для збереження фото
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ГЕТ всі тканини
router.get("/", getFabrics);

// ГЕТ конкретна тканина
router.get("/:id", getFabric);

// POST додати тканину (только адмін)
router.post("/", authMiddleware, isAdmin, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "additionalImages", maxCount: 10 },
]), addFabric);

// PUT редагувати тканину
router.put("/:id", authMiddleware, isAdmin, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "additionalImages", maxCount: 10 },
]), updateFabric);

// DELETE видалити тканину
router.delete("/:id", authMiddleware, isAdmin, deleteFabric);

export default router;
