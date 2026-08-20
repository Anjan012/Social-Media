import crypto from "crypto";
import { PasswordResetRateLimit } from "../models/passwordResetRateLimit.model";

function getWindow(now, windowMs) {
    const startAtMs = Math.floor(now.getTime() / windowMs) * windowMs;

    return {
        startAt: new Date(startAtMs),
        expiresAt: new Date(startAtMs + windowMs),
    };
};

export function createSafeidentifier(value) {
    return crypto
        .createHash("sha256", process.env.RATE_LIMIT_SECRET)
        .update(value)
        .digest("hex");
};

