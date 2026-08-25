// a controller job is to get data request call service and send repsonse

import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import {
  getMeService as _getMeService,
  updateProfileService as _updateProfileService,
  getUserProfileService as _getUserProfileService,
  searchUserService as _searchUserService,
} from "../services/user.service.js";

import {
  forgetPasswordService as _forgetPasswordService,
  resetpasswordService as _resetpasswordService,
} from "../services/forgetPassword.service.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        sucess: false,
      });
    }

    // Check if user already exists
    const existUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      return res.status(409).json({
        message: "User with this username or email already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
    };

    await User.create(newUser);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in signUp controller:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = user.toObject();
    delete userData.password;

    const cookieOptions = getAuthCookieOptions();

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        message: `Welcome back, ${user.username}`,
        success: true,
        userData,
      });
  } catch (error) {
    console.error("Error in signIn controller:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", getAuthCookieOptions())
      .json({
        message: "logged out successfully",
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error`,
      success: false,
    });
  }
};

export const getMe = asyncHandler(async (req, res) => {
  const user = await _getMeService(req.id);

  return res.status(200).json({
    success: true,
    user,
    message: "User profile fetched successfully!",
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userData = await _updateProfileService({
    userId: req.id,
    ...req.body,
    profileFile: req.files?.profilePicture?.[0],
    coverFile: req.files?.coverPicture?.[0],
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    userData,
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const userData = await _getUserProfileService({
    loggedInUserId: req.id,
    profileUserId: req.params.id,
  });

  return res.status(200).json({
    success: true,
    message: "fetched user",
    userData,
  });
});

export const searchUser = asyncHandler(async (req, res) => {
  const query = req.query;
  const users = await _searchUserService(query);

  return res.status(200).json({
    success: true,
    users,
    message: "User search results fetched successfully!",
  });
});

export const followUser = async (req, res) => {
  try {
    const userId = req.id;
    const strangerId = req.params.id;

    // Prevent self-follow
    if (userId === strangerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const stranger = await User.findById(strangerId);
    const user = await User.findById(userId);

    if (!stranger || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFollower = stranger.followers.includes(userId);

    if (isFollower) {
      // UNFOLLOW
      stranger.followers.pull(userId);
      user.following.pull(strangerId);

      await stranger.save();
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Unfollowed successfully",
      });
    } else {
      // FOLLOW
      stranger.followers.addToSet(userId);
      user.following.addToSet(strangerId);

      await stranger.save();
      await user.save();

      return res.status(200).json({
        success: true,
        message: "You are following " + stranger.username,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const forgetPassword = asyncHandler(async (req, res) => {
  const result = await _forgetPasswordService({
    email: req.body?.email,
    ip: req.ip,
  });

  if (result.rateLimited) {
    res.set("Retry-After", String(result.retryAfterSeconds));

    return res.status(429).json({
      message: result.message,
    });
  }

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body || {};

  await _resetpasswordService({ token, newPassword });

  return res.status(200).json({
    success: true,
    message: "password reset sucessfull",
  });
});
