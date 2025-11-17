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
      description,
    });

    if (req.files?.image) {
      newFabric.image = API_UPLOADS + req.files.image[0].filename;
    }

    if (req.files?.additionalImages) {
      newFabric.additionalImages = req.files.additionalImages.map(f => API_UPLOADS + f.filename);
    }

    await newFabric.save();
    res.status(201).json(newFabric);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при додаванні тканини" });
  }
};

export const updateFabric = async (req, res) => {
  try {
    const { name, pricePerMeter, fabric, description, inStock, existingAdditionalImages } = req.body;
    const fabricToUpdate = await Fabric.findById(req.params.id);
    if (!fabricToUpdate) return res.status(404).json({ message: "Fabric not found" });

    // Оновлюємо текстові поля
    fabricToUpdate.name = name;
    fabricToUpdate.pricePerMeter = pricePerMeter;
    fabricToUpdate.fabric = fabric;
    fabricToUpdate.description = description;
    fabricToUpdate.inStock = inStock === 'true' || inStock === true; // приводимо до boolean

    // Обробка основного фото
    if (req.files?.image) {
      fabricToUpdate.image = "/uploads/" + req.files.image[0].filename;
    }

    // Обробка додаткових фото
    let additionalImages = existingAdditionalImages ? JSON.parse(existingAdditionalImages) : [];
    if (req.files?.additionalImages) {
      additionalImages.push(...req.files.additionalImages.map(file => "/uploads/" + file.filename));
    }
    fabricToUpdate.additionalImages = additionalImages;

    await fabricToUpdate.save();
    res.json(fabricToUpdate);
  } catch (error) {
    console.error(error);
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
