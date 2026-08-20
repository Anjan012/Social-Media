import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "../config/mail.js";
import {
  internalServerError,
  unauthorized,
} from "../utils/error/error-helper.js";

const PASSWORD_RESET_TTL_MS = 10 * 60 * 1000;

const GENERIC_MESSAGE =
  "If an account exists with this email, a reset link has been sent.";

export const forgetPasswordService = async ({ email }) => {
  const normalizedEmail = email.trim().toLowerCase();
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

  const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetTokenHash: resetTokenHash,
    passwordResetExpires: {$gt: new Date()},
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
