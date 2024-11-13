import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  styleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Style",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate likes
LikeSchema.index({ userId: 1, styleId: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model("Like", LikeSchema);
