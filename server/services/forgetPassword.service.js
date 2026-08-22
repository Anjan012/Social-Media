import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "../config/mail.js";
import {
  badRequest,
  internalServerError,
  unauthorized,
} from "../utils/error/error-helper.js";
import {
  consumeRateLimit,
  hashRateLimitIdentifier,
} from "./rate-limit.service.js";

const PASSWORD_RESET_TTL_MS = 10 * 60 * 1000;

const GENERIC_MESSAGE =
  "If an account exists with this email, a reset link has been sent.";

// Password reset policy

const EMAIL_LIMIT = 1;
const EMAIL_WINDOW_MS = 10 * 60 * 1000;

const IP_LIMIT = 10;
const IP_WINDOW_MS = 15 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email) {
  if (typeof email !== "string") {
    badRequest("A valid email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
    badRequest("A valid email is required");
  }

  return normalizedEmail;
}

export function validateResetInput(token, newPassword) {
  if (
    typeof token !== "string" ||
    !/^[a-f0-9]{64}$/i.test(token)
  ) {
    badRequest("A valid reset token is required");
  }

  if (typeof newPassword !== "string" || newPassword.length < 6) {
    badRequest("Password must be at least 6 characters long");
  }
}

export const forgetPasswordService = async ({ email, ip }) => {
  const normalizedEmail = normalizeEmail(email);

  if (typeof ip !== "string" || ip.trim().length === 0) {
    badRequest("A valid IP address is required");
  }

  const normalizedIp = ip.trim();

  const emailIdentifier = hashRateLimitIdentifier(normalizedEmail);
  const ipIdentifier = hashRateLimitIdentifier(normalizedIp);

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
    await User.updateOne(
      {
        _id: user._id,
        passwordResetTokenHash: resetTokenHash,
      },
      {
        $set: {
          passwordResetTokenHash: null,
          passwordResetExpires: null,
        },
      }
    );

    throw internalServerError("Unable to send password reset email");
  }

  return {
    message: GENERIC_MESSAGE,
  };
};

export const resetpasswordService = async ({ token, newPassword }) => {
  validateResetInput(token, newPassword);

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

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user._id,
      passwordResetTokenHash: resetTokenHash,
      passwordResetExpires: { $gt: new Date() },
    },
    {
      $set: {
        password: hashedPassword,
        passwordResetTokenHash: null,
        passwordResetExpires: null,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    unauthorized("Invalid or expired reset token");
  }
};
