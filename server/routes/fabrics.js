import express from "express";
import { getFabrics, addFabric, updateFabric, deleteFabric } from "../controllers/fabricController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFabrics);
router.post("/", protect, addFabric);
router.put("/:id", protect, updateFabric);
router.delete("/:id", protect, deleteFabric);

export default router;
