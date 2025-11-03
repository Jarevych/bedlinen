import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  size: { type: String, required: true },
  fabric: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric",
    required: true
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
