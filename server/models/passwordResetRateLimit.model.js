import mongoose from "mongoose";

const passwordResetRateLimitSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },

  count: {
    type: Number,
    default: 0,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

passwordResetRateLimitSchema.index(
  {expiresAt: 1},
  {expireAfterSeconds: 0}
);

export const PasswordResetRateLimit = mongoose.model(
  "PasswordResetRateLimit",
  passwordResetRateLimitSchema
);
