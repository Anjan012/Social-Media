import crypto from "crypto";
import { PasswordResetRateLimit } from "../models/passwordResetRateLimit.model.js";

export function getWindow(now, windowMs) {
  const startAtMs = Math.floor(now.getTime() / windowMs) * windowMs;

  return {
    startAt: new Date(startAtMs),
    expiresAt: new Date(startAtMs + windowMs),
  };
}

export function hashRateLimitIdentifier(value) {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError("Rate-limit identifier must be a non-empty string");
  }

  if (!process.env.RATE_LIMIT_SECRET) {
    throw new Error("RATE_LIMIT_SECRET is not configured");
  }

  return crypto
    .createHmac("sha256", process.env.RATE_LIMIT_SECRET)
    .update(value)
    .digest("hex");
}

export async function consumeRateLimit({ scope, identifier, limit, windowMs }) {
  if (typeof scope !== "string" || scope.length === 0) {
    throw new TypeError("Rate-limit scope must be a non-empty string");
  }

  if (typeof identifier !== "string" || identifier.length === 0) {
    throw new TypeError("Rate-limit identifier must be a non-empty string");
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new TypeError("Rate-limit limit must be a positive integer");
  }

  if (!Number.isInteger(windowMs) || windowMs < 1) {
    throw new TypeError("Rate-limit window must be a positive integer");
  }

  const now = new Date();
  const { startAt, expiresAt } = getWindow(now, windowMs);

  const key = `${scope}:${identifier}:${startAt.toISOString()}`;

  let record;

  try {
    record = await PasswordResetRateLimit.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt },
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (err) {
    if (err.code !== 11000) throw err;

    record = await PasswordResetRateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { new: true }
    );
  }

  if (!record) {
    throw new Error("Rate-limit record could not be updated");
  }

  return {
    allowed: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    retryAfterSeconds: Math.ceil((expiresAt.getTime() - now.getTime()) / 1000),
  };
}
