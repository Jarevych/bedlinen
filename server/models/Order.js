import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  fabric: { type: mongoose.Schema.Types.ObjectId, ref: "Fabric", required: true },
  width: Number,
  length: Number,
  height: Number,
  customerName: String,
  contact: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
