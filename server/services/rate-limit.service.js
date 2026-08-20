import crypto from "crypto";
import { PasswordResetRateLimit } from "../models/passwordResetRateLimit.model.js";

function getWindow(now, windowMs) {
  const startAtMs = Math.floor(now.getTime() / windowMs) * windowMs;

  return {
    startAt: new Date(startAtMs),
    expiresAt: new Date(startAtMs + windowMs),
  };
}

export function createSafeidentifier(value) {
  return crypto
    .createHmac("sha256", process.env.RATE_LIMIT_SECRET)
    .update(value)
    .digest("hex");
}

export async function consumeRateLimit({ scope, identifier, limit, windowMs }) {
  const now = new Date();
  const { startAt, expiresAt } = getWindow(now, windowMs);

  const key = `${scope}:${identifier}:${startAt.toISOString()}`;

  let record;

  try {
    record = await PasswordResetRateLimit.findOneAndUpdate(
        { key },
        {
            $inc: {count: 1},
            $setOnInsert: {expiresAt}, // Set expiration only when creating a new record; don't change it on later attempts.
        },
        {
            upsert: true, // If no matching record exists, create a new one; otherwise update the existing one.
            new: true, // return the updated record
        }
    );
  } catch (err) {
    // we are trying to handle the race condition here
    if(err.code !== 11000) throw err;

    record = await PasswordResetRateLimit.findOneAndUpdate(
        {key},
        {$inc: {count: 1}},
        {new: true}
    );
  }

  return {
    allowed: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    retryAfterSeconds: Math.ceil((expiresAt.getTime() - now.getTime()) / 1000),
  };
}
