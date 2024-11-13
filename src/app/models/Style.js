import mongoose from "mongoose";

const StyleSchema = new mongoose.Schema({
  text: {
    title: String,
    shortDescription: String,
    buttonText: String,
  },
  info: {
    name: String,
    fontname: String,
    colorScheme: String,
    style: String,
    features: String,
  },
  tags: [String],
  css: String,
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Style || mongoose.model("Style", StyleSchema);
