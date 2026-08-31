import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

followSchema.index({ followerUserId: 1, followingUserId: 1 }, { unique: true });
followSchema.index({ followingUserId: 1, createdAt: -1 });
followSchema.index({ followerUserId: 1, createdAt: -1 });

export const Follow = mongoose.model("Follow", followSchema);
