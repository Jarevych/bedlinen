import Fabric from "../models/Fabric.js";

export const getFabrics = async (req, res) => {
  try {
    const fabrics = await Fabric.find();
    res.json(fabrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFabric = async (req, res) => {
  try {
    const fabric = new Fabric(req.body);
    await fabric.save();
    res.status(201).json(fabric);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fabric);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFabric = async (req, res) => {
  try {
    await Fabric.findByIdAndDelete(req.params.id);
    res.json({ message: "Fabric deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
