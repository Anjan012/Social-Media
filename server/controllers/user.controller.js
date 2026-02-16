import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";

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

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true, // accessible only by web server
        // sameSite: "strict", // CSRF protection
        // secure: true,
        sameSite: "lax",
        secure: false
      })
      .json({
        message: `Welcome back, ${user.username}`,
        success: true,
        // token,
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
        secure: false
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
  const loggedInId = req.id;

  const user = await User.findById(loggedInId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    };

    return res.status(200).json({
      success: true,
      user
    })
  
}

export const updateProfile = async (req, res) => {
  try {
    const { username, fullname, bio, location, website, dob } = req.body;
    const file = req.file;

    // cloudinary will come here....

    const userId = req.id; // come from the middleware

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

    await user.save();

    const userData = user.toObject(); // Convert Mongoose document to plain object
    delete userData.password; // Remove password field

    return res.status(200).json({
      message: "Profile updated Successfully",
      sucess: true,
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
    };

    const posts = await Post.find({createdBy: profileUserId}).sort({createdAt: -1});

    const isOwnProfile = loggedInUserId === profileUserId;

    const isFollowing = user.followers?.includes(loggedInUserId);

    return res.status(200).json({
      success: true,
      user,
      posts,
      isOwnProfile,
      isFollowing
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
