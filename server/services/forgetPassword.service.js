import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { internalServerError, notFound } from "../utils/error/error-helper.js";

export const forgetPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    notFound("User not Found!");
  }

  // generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10m",
  });

  //sendmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD_APP_EMAIL,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password",
    html: `<h1>Reset Your Password</h1>
                <p>Click on the following link to reset your password:</p>
                <a href="http://localhost:5173/reset-password/${token}">http://localhost:5173/reset-password/${token}</a>
                <p>The link will expire in 10 minutes.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Nodemailer error:", err);
    internalServerError(err.message);
  }

  return {
    message: "Email Sent",
  };
};

export const resetpassword = async () => {
    
};
