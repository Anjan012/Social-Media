import { User } from "../models/user.model.js";
import { PasswordReset } from "../models/passwordReset.model.js";
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
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
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

  const pendingPasswordReset = await PasswordReset.create({
    userId: user._id,
    tokenHash: resetTokenHash,
    expiresAt: resetTokenExpires,
    usedAt: null,
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: normalizedEmail,
    subject: "Reset your password",

    text: [
      "Reset Your Password",
      "",
      "You requested a password reset for your account.",
      "",
      `Reset your password: ${resetUrl}`,
      "",
      "This link expires in 10 minutes.",
      "",
      "If you did not request this password reset, you can safely ignore this email.",
      "",
      "If you have any questions, please contact our support team.",
    ].join("\n"),

    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f9fafb;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #111827;
      ">

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #f9fafb; padding: 40px 20px;"
        >
          <tr>
            <td align="center">

              <!-- Main Container -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 560px;
                  background-color: #ffffff;
                  border: 1px solid #e5e7eb;
                  border-radius: 16px;
                  overflow: hidden;
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    style="
                      padding: 32px 40px 24px;
                      border-bottom: 1px solid #f3f4f6;
                    "
                  >
                    <div
                      style="
                        font-size: 22px;
                        font-weight: 700;
                        color: #111827;
                        letter-spacing: -0.3px;
                      "
                    >
                      Reset Your Password
                    </div>

                    <div
                      style="
                        margin-top: 8px;
                        font-size: 14px;
                        color: #6b7280;
                      "
                    >
                      Secure access to your account
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 36px 40px 40px;">

                    <p
                      style="
                        margin: 0 0 20px;
                        font-size: 16px;
                        line-height: 1.6;
                        color: #374151;
                      "
                    >
                      You requested a password reset for your account.
                      Click the button below to create a new password.
                    </p>

                    <!-- Button -->
                    <table
                      role="presentation"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin: 28px 0;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            border-radius: 10px;
                            background-color: #ef4444;
                          "
                        >
                          <a
                            href="${resetUrl}"
                            style="
                              display: inline-block;
                              padding: 13px 24px;
                              font-size: 15px;
                              font-weight: 600;
                              color: #ffffff;
                              text-decoration: none;
                              border-radius: 10px;
                            "
                          >
                            Reset Your Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Expiration Notice -->
                    <div
                      style="
                        margin: 24px 0;
                        padding: 16px;
                        background-color: #fef2f2;
                        border: 1px solid #fee2e2;
                        border-radius: 10px;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          font-size: 14px;
                          line-height: 1.5;
                          color: #991b1b;
                        "
                      >
                        <strong>This link expires in 10 minutes.</strong>
                        For your security, please reset your password before the link expires.
                      </p>
                    </div>

                    <p
                      style="
                        margin: 28px 0 0;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #6b7280;
                      "
                    >
                      If you did not request this password reset, you can safely
                      ignore this email. Your account will remain secure.
                    </p>

                    <!-- Fallback URL -->
                    <p
                      style="
                        margin: 28px 0 0;
                        padding-top: 20px;
                        border-top: 1px solid #f3f4f6;
                        font-size: 12px;
                        line-height: 1.5;
                        color: #9ca3af;
                        word-break: break-all;
                      "
                    >
                      If the button above doesn't work, copy and paste this link
                      into your browser:
                      <br />
                      <a
                        href="${resetUrl}"
                        style="
                          color: #ef4444;
                          text-decoration: none;
                        "
                      >
                        ${resetUrl}
                      </a>
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding: 24px 40px;
                      background-color: #f9fafb;
                      border-top: 1px solid #f3f4f6;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        font-size: 12px;
                        line-height: 1.5;
                        color: #9ca3af;
                      "
                    >
                      This is an automated security email. Please do not reply to this message.
                    </p>
                  </td>
                </tr>

              </table>

              <!-- Bottom Text -->
              <p
                style="
                  margin: 20px 0 0;
                  font-size: 12px;
                  color: #9ca3af;
                "
              >
                © ${new Date().getFullYear()} Your App. All rights reserved.
              </p>

            </td>
          </tr>
        </table>

      </body>
      </html>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    await PasswordReset.deleteOne({ _id: pendingPasswordReset._id });

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

  const passwordResetRecord = await PasswordReset.findOne({
    tokenHash: resetTokenHash,
    expiresAt: { $gt: new Date() },
    usedAt: null,
  });

  if (!passwordResetRecord) {
    unauthorized("Invalid or expired reset token");
  }

  const user = await User.findById(passwordResetRecord.userId);

  if (!user) {
    unauthorized("Invalid or expired reset token");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: {
        password: hashedPassword,
      },
    },
    { new: true },
  );

  if (!updatedUser) {
    unauthorized("Invalid or expired reset token");
  }

  await PasswordReset.updateOne(
    { _id: passwordResetRecord._id },
    { $set: { usedAt: new Date() } },
  );
};
