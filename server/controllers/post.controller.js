import { Post } from "../models/post.model.js";

export const createPost = async (req, res) => {
    try {
        const {content} = req.body;
        const userId = req.id;

        const file = req.file;
        // cloudinary logic goes here for file

        if(!content) {
            return res.status(400).json({
                message: "Content is required!",
                success: false
            });
        };
        
        const post = await Post.create({
            content,
            createdBy: userId
        });

        return res.status(201).json({
            message: "Post created successfully.",
            post,
            success: true
        });
        
    } catch (error) {
        console.log(`Error while creating post: ${error}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};