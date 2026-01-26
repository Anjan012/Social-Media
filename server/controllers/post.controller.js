import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.id;

    const file = req.file;
    // cloudinary logic goes here for file

    if (!content) {
      return res.status(400).json({
        message: "Content is required!",
        success: false,
      });
    }

    const post = await Post.create({
      content,
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
