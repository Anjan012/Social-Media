// a controller job is to get data request call service and send repsonse 

import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { 
  getMeService as _getMeService
} from "../services/user.service.js";

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

    const userData = user.toObject(); // Convert Mongoose document to plain object
    delete userData.password; // Remove password field
    console.log(token);

    return res
      .status(200)
      .cookie("token", token, {
        // maxAge: 24 * 60 * 60 * 1000,
        // httpOnly: true, // accessible only by web server
        // // sameSite: "strict", // CSRF protection
        // // secure: true,
        // sameSite: "lax",
        // secure: false,

        httpOnly: true,
        secure: true, // Important for HTTPS (Render uses HTTPS)
        sameSite: "none", // Required for cross-domain
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      })
      .json({
        message: `Welcome back, ${user.username}`,
        success: true,
        token,
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
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        // sameSite: "strict",
        // secure: true, // enable this in production (HTTPS)
      })
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

export const getMe = async (req, res) => {
  const user = await _getMeService(req.id);

  return res.status(200).json({
    success: true,
    user,
    message: "User profile fetched successfully!",
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { username, fullname, bio, location, website, dob } = req.body;
    const file = req.file;

    // cloudinary will come here....

    const profileFile = req.files?.profilePicture?.[0];  
    const coverFile   = req.files?.coverPicture?.[0];

    const userId = req.id; 

    let profilePictureURL = null;
    let coverPictureURL   = null;

    if (profileFile) {
      const localFilePath = profileFile.path;

      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: `users/${userId}/profile`,
      });

      profilePictureURL = result.secure_url; 

      fs.unlinkSync(localFilePath);

    }

    if (coverFile) {
      const localFilePath = coverFile.path;

      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: `users/${userId}/cover`,
      });

      coverPictureURL = result.secure_url; 

      fs.unlinkSync(localFilePath);

    }


    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (username) user.username = username;
    if (fullname) user.fullname = fullname;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (website) user.website = website;
    if (dob) user.dob = dob;
    if(profilePictureURL) user.profilePicture = profilePictureURL;
    if(coverPictureURL) user.coverPicture = coverPictureURL;

    await user.save();

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      message: "Profile updated Successfully",
      success: true,
      userData,
    });
  } catch (error) {
    console.log(`Error while updating the profile: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const profileUserId = req.params.id;

    const user = await User.findById(profileUserId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    const posts = await Post.find({ createdBy: profileUserId })
      .sort({
        createdAt: -1,
      })
      .populate("createdBy", "username fullname profilePicture");

    const isOwnProfile = loggedInUserId === profileUserId;

    const isFollowing = user.followers?.includes(loggedInUserId);

    return res.status(200).json({
      success: true,
      user,
      posts,
      isOwnProfile,
      isFollowing,
      message: "User profile fetched successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        user: [],
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullname: { $regex: query, $options: "i" } },
      ],
    })
      .select("_id username fullname profilePicture bio")
      .limit(10);

    return res.status(200).json({
      success: true,
      users,
      message: "User search results fetched successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

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
