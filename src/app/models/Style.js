import mongoose from "mongoose";

const StyleSchema = new mongoose.Schema({
  text: {
    title: String,
    shortDescription: String,
    buttonText: String,
  },
  info: {
    name: String,
    fontnames: String,
    colorScheme: String,
    style: String,
    features: String,
    prompt: String,
  },
  css: String,
  tags: [String],
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedBy: [String],
});

StyleSchema.virtual("likeCount").get(function () {
  return this.likedBy.length;
});

export default mongoose.models.Style || mongoose.model("Style", StyleSchema);
