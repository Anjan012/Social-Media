import dotenv from "dotenv";
import mongoose from "mongoose";
import { pathToFileURL } from "node:url";
import connectDB from "../utils/db.js";
import { User } from "../models/user.model.js";
import { PasswordReset } from "../models/passwordReset.model.js";

dotenv.config();

const normalizeTokenHash = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length === 64 ? trimmed : null;
};

export const backfillActiveResetTokens = async ({
  UserModel = User,
  PasswordResetModel = PasswordReset,
  logger = console,
} = {}) => {
  const summary = {
    usersScanned: 0,
    recordsCreated: 0,
    recordsSkipped: 0,
    malformed: [],
  };

  logger.info("Starting active reset-token backfill from User to PasswordReset...");

  const users = await UserModel.find({
    passwordResetExpires: { $gt: new Date() },
    passwordResetTokenHash: { $exists: true, $ne: null },
  });

  for (const user of users || []) {
    summary.usersScanned += 1;

    const tokenHash = normalizeTokenHash(user.passwordResetTokenHash);
    const expiresAt = user.passwordResetExpires;

    if (!tokenHash || !(expiresAt instanceof Date) || Number.isNaN(expiresAt.getTime())) {
      summary.malformed.push({
        userId: String(user._id),
        reason: "missing or malformed reset token hash/expiry",
      });
      summary.recordsSkipped += 1;
      continue;
    }

    try {
      const existing = await PasswordResetModel.findOne({ tokenHash });
      if (existing) {
        summary.recordsSkipped += 1;
        continue;
      }

      await PasswordResetModel.create({
        userId: user._id,
        tokenHash,
        expiresAt,
        usedAt: null,
      });

      summary.recordsCreated += 1;
    } catch (error) {
      logger.error("Password reset backfill failed for user", {
        userId: user._id,
        tokenHash,
        error,
      });
      summary.malformed.push({
        userId: String(user._id),
        reason: error?.message || "Unknown error",
      });
      summary.recordsSkipped += 1;
    }
  }

  logger.info("Active reset-token backfill complete", summary);
  return summary;
};

export const runBackfillActiveResetTokens = async () => {
  await connectDB();

  try {
    return await backfillActiveResetTokens();
  } finally {
    await mongoose.disconnect();
  }
};

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  runBackfillActiveResetTokens().catch((error) => {
    console.error("Active reset-token backfill failed", error);
    process.exitCode = 1;
  });
}
