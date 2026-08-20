import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "../config/mail.js";
import {
  internalServerError,
  unauthorized,
} from "../utils/error/error-helper.js";
import {
  consumeRateLimit,
  createSafeidentifier,
} from "./rate-limit.service.js";

const PASSWORD_RESET_TTL_MS = 10 * 60 * 1000;

const GENERIC_MESSAGE =
  "If an account exists with this email, a reset link has been sent.";

// Password reset policy

const EMAIL_LIMIT = 1;
const EMAIL_WINDOW_MS = 10 * 60 * 1000;

const IP_LIMIT = 10;
const IP_WINDOW_MS = 15 * 60 * 1000;

export const forgetPasswordService = async ({ email, ip }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const emailIdentifier = createSafeidentifier(normalizedEmail);
  const ipIdentifier = createSafeidentifier(ip);

  const ipLimit = await consumeRateLimit({
    scope: "password-reset:ip",
    identifier: ipIdentifier,
    limit: IP_LIMIT,
    windowMs: IP_WINDOW_MS,
  });

  if (!ipLimit.allowed) {
    return {
      message: "Too many requests. Please try again later.",
      rateLimited: true,
      retryAfterSeconds: ipLimit.retryAfterSeconds,
    };
  }

  const emailLimit = await consumeRateLimit({
    scope: "password-reset:email",
    identifier: emailIdentifier,
    limit: EMAIL_LIMIT,
    windowMs: EMAIL_WINDOW_MS,
  });

  if (!emailLimit.allowed) {
    return { message: GENERIC_MESSAGE };
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return {
      message: GENERIC_MESSAGE,
    };
  }

  // generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Never store the raw token
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetTokenExpires = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

  user.passwordResetTokenHash = resetTokenHash;
  user.passwordResetExpires = resetTokenExpires;

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: normalizedEmail,
    subject: "Reset your password",

    text: [
      "You requested a password reset.",
      "",
      `Reset your password: ${resetUrl}`,
      "",
      "This link expires in 10 minutes.",
      "",
      "If you did not request this, you can safely ignore this email.",
    ].join("\n"),

    html: `
      <h1>Reset Your Password</h1>

      <p>
        You requested a password reset for your account.
      </p>

      <p>
        <a href="${resetUrl}">
          Reset your password
        </a>
      </p>

      <p>
        This link expires in 10 minutes.
      </p>

      <p>
        If you did not request this password reset,
        you can safely ignore this email.
      </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    // we should not leave an unusable reset token behind
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;

    await user.save();

    throw internalServerError(err.message);
  }

  return {
    message: GENERIC_MESSAGE,
  };
};

export const resetpasswordService = async ({ token, newPassword }) => {
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetTokenHash: resetTokenHash,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    unauthorized("Invalid or expired reset token");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;

  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;

  await user.save();
};
