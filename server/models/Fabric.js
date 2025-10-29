import mongoose from "mongoose";

const fabricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // зберігаємо відносний URL, наприклад "/uploads/12345.jpg"
  pricePerMeter: { type: Number },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Fabric", fabricSchema);
