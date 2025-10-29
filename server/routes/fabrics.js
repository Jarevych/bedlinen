import express from "express";
import { getFabrics, addFabric, updateFabric, deleteFabric } from "../controllers/fabricController.js";
import { protect } from "../middleware/authMiddleware.js";
import express from "express";
import Fabric from "../models/Fabric.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const fabrics = await Fabric.find().sort({ createdAt: -1 });
    res.json(fabrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", /* protect, */ async (req, res) => {
  try {
    const { name, pricePerMeter, image } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const fabric = new Fabric({ name, pricePerMeter, image });
    await fabric.save();
    res.status(201).json(fabric);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", /* protect, */ async (req, res) => {
  try {
    const updated = await Fabric.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", /* protect, */ async (req, res) => {
  try {
    await Fabric.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", getFabrics);
router.post("/", protect, addFabric);
router.put("/:id", protect, updateFabric);
router.delete("/:id", protect, deleteFabric);

export default router;
