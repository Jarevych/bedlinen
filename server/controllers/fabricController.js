// import Fabric from "../models/Fabric.js";

// export const getFabrics = async (req, res) => {
//   try {
//     const fabrics = await Fabric.find();
//     res.json(fabrics);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const addFabric = async (req, res) => {
//   try {
//     const fabric = new Fabric(req.body);
//     await fabric.save();
//     res.status(201).json(fabric);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateFabric = async (req, res) => {
//   try {
//     const fabric = await Fabric.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(fabric);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteFabric = async (req, res) => {
//   try {
//     await Fabric.findByIdAndDelete(req.params.id);
//     res.json({ message: "Fabric deleted" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
import Fabric from "../models/Fabric.js";
import fs from "fs";
import path from "path";

const API_UPLOADS = "/uploads/"; // шлях для збереження на сервері

export const getFabrics = async (req, res) => {
  try {
    const fabrics = await Fabric.find().sort({ createdAt: -1 });
    res.json(fabrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id);
    if (!fabric) return res.status(404).json({ message: "Fabric not found" });
    res.json(fabric);
  } catch (err) {
    res.status(400).json({ message: "Invalid id or server error" });
  }
};

export const addFabric = async (req, res) => {
  try {
    const { name, pricePerMeter, fabric, inStock, description } = req.body;

    const newFabric = new Fabric({
      name,
      pricePerMeter,
      fabric,
      inStock: inStock === "true" || inStock === true,
      description
    });

    /* ================================
       CLOUDINARY FILES
    ================================= */

    // Головне фото
    if (req.files?.image) {
      newFabric.image = req.files.image[0].path; // Cloudinary URL
    }

    // Додаткові фото
    if (req.files?.additionalImages) {
      newFabric.additionalImages = req.files.additionalImages.map(file => file.path); // URL
    }

    await newFabric.save();
    res.status(201).json(newFabric);

  } catch (err) {
    console.error("ADD FABRIC ERROR:", err);
    res.status(500).json({ message: "Помилка при додаванні тканини" });
  }
};

export const updateFabric = async (req, res) => {
  try {
    const { name, pricePerMeter, fabric, description, inStock, existingAdditionalImages } = req.body;

    const fabricToUpdate = await Fabric.findById(req.params.id);
    if (!fabricToUpdate) return res.status(404).json({ message: "Fabric not found" });

    fabricToUpdate.name = name;
    fabricToUpdate.pricePerMeter = pricePerMeter;
    fabricToUpdate.fabric = fabric;
    fabricToUpdate.description = description;
    fabricToUpdate.inStock = inStock === "true" || inStock === true;

    // Основне фото
    if (req.files?.image) {
      fabricToUpdate.image = req.files.image[0].path; // Cloudinary URL
    }

    // Додаткові фото — існуючі + нові
    let additional = existingAdditionalImages ? JSON.parse(existingAdditionalImages) : [];

    if (req.files?.additionalImages) {
      additional.push(...req.files.additionalImages.map(file => file.path));
    }

    fabricToUpdate.additionalImages = additional;

    await fabricToUpdate.save();
    res.json(fabricToUpdate);

  } catch (error) {
    console.error("UPDATE FABRIC ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findByIdAndDelete(req.params.id);
    if (!fabric) return res.status(404).json({ message: "Fabric not found" });
    res.json({ message: "Fabric deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
