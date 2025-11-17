import mongoose from "mongoose";

const fabricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  additionalImages: [{ type: String }], // масив для додаткових фото
  pricePerMeter: { type: Number },
  inStock: { type: Boolean, default: true },
  fabric: { type: String, enum: ["Бязь", "Сатин", "Байка"], default: "Бязь" },
  availability: { type: String, enum: ["В наявності", "Немає в наявності"], default: "В наявності" },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Fabric", fabricSchema);
