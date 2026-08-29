import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

const getPagination = (query = {}) => {
  const requestedPage = Number(query.page);
  const requestedLimit = Number(query.limit);

  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(Math.floor(requestedLimit), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.id;

    const file = req.file;

    // const normalizedPath = file ? file.path.replace(/\\/g, "/") : null;

    let imageUrl = null; 

    if (file) {
      const localFilePath = file.path;

      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: `users/${userId}/posts`,
      });

      imageUrl = result.secure_url;

      fs.unlinkSync(localFilePath);
    }

    if (!content && !file) {
      return res.status(400).json({
        message: "Post content or media is required",
        success: false,
      });
    }

    const post = await Post.create({
      content: content || "",
      image: imageUrl,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Post created successfully.",
      post,
      success: true,
    });
  } catch (error) {
    console.log(`Error while creating post: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// get all post
export const getAllPost = async (req, res) => {
  try {
    const userId = req.id;
    const { page, limit, skip } = getPagination(req.query);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    const following = Array.isArray(user.following) ? user.following : [];
    const userIds = [...following, userId];
    const baseQuery = { createdBy: { $in: userIds } };

    const totalPosts = await Post.countDocuments(baseQuery);
    const posts = await Post.find(baseQuery)
      .populate("createdBy", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully!",
      posts,
      page,
      limit,
      totalPosts,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
        success: false,
      });
    }

    const post = await Post.findById(postId)
      .populate("createdBy", "username profilePicture fullname")
      .populate("comments.user", "username profilePicture");

    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      post,
      message: "Post fetched successfully!",
    });
  } catch (error) {
    console.log(`Error while fetching post: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
        success: false,
      });
    }

    const post = await Post.findOne({
      _id: postId,
      createdBy: userId,
    });

    if (!post) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
        success: false,
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      message: "Post deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.log(`Error while deleting the post: ${error}`);
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const userId = req.id;
    const { page, limit, skip } = getPagination(req.query);

    const totalPosts = await Post.countDocuments({ createdBy: userId });
    const posts = await Post.find({ createdBy: userId })
      .populate("createdBy", "username fullname profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!posts) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully!",
      posts,
      page,
      limit,
      totalPosts,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.log(`Error while fetching post: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "no post found",
        success: false,
      });
    }

    const likes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = likes.some((likeUserId) => likeUserId.toString() === userId.toString());

    if (isLiked) {
      post.likes = likes.filter((likeUserId) => likeUserId.toString() !== userId.toString());
    } else {
      post.likes = [...likes, userId];
    }

    await post.save();

    return res.status(200).json({
      success: true,
      postId,
      isLiked: !isLiked,
      likeCount: post.likes.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const id = req.id;
    const postId = req.params.id;
    const { comment } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    post.comments.push({ user: id, text: comment });

    await post.save();

    return res.status(200).json({
      message: "Comment added successfully!",
      success: true,
      comment: {
        user: id,
        text: comment,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
