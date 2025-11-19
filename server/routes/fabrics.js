import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

import {
  getFabrics,
  getFabric,
  addFabric,
  updateFabric,
  deleteFabric,
} from "../controllers/fabricController.js";

import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   CLOUDINARY STORAGE
================================ */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bedlinen",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* ================================
   ROUTES
================================ */

router.get("/", getFabrics);
router.get("/:id", getFabric);

router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 }
  ]),
  addFabric
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 }
  ]),
  updateFabric
);

router.delete("/:id", authMiddleware, isAdmin, deleteFabric);

export default router;
