import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.id;

    const file = req.file;

    const normalizedPath = file.path.replace(/\\/g, "/");
    if (!content && !file) {
      return res.status(400).json({
        message: "Content is required!",
        success: false,
      });
    }

    const post = await Post.create({
      content: content || "",
      image: file ? normalizedPath : null,
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

    const user = await User.findById(userId).select("following");

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    const userIds = [...user.following, userId];

    const posts = await Post.find({
      createdBy: { $in: userIds }, // $in means mongodb operator it matches document where createdBy is any one of these Ids, Give me all posts where the creator is either me or someone I follow
    })
      .populate("createdBy", "username profilePicture") // populating createdBy with username and profile picture only
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully!",
      posts,
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

    const post = await Post.find({ createdBy: userId })
      .populate("createdBy", "username fullname profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 });

    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully!",
      post,
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
        status: false,
      });
    }

    const isLiked = post.likes.includes(userId);

    if(isLiked) {
      post.likes.pull(userId);
    }
    else {
      post.likes.addToSet(userId);
    }

    await post.save();

  } catch (error) {
    console.log(error);
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

    post.comments.push({user: id, text: comment});

    await post.save();

    return res.status(200).json({
      message: "Comment added successfully!",
      success: true,
    });
  } catch (error) {
    
  }
}
