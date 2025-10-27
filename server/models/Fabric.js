import mongoose from "mongoose";

const fabricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  pricePerMeter: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
});

export default mongoose.model("Fabric", fabricSchema);
