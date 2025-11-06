// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   size: { type: String, required: true },
//   fabric: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Fabric",
//     required: true
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Order", orderSchema);
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  size: String,
  fabric: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric",
  },
  status: { type: String, default: "pending" },
  customSize: {
    pillowcase: {
      length: Number,
      width: Number,
    },
    duvet: {
      length: Number,
      width: Number,
    },
    sheet: {
      length: Number,
      width: Number,
      withElastic: { type: Boolean, default: false },
      mattressHeight: { type: Number, default: null },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
