import express from "express";
import { createPost, getAllPost, getPostById, deletePost, getUserPost, toggleLike } from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadPostImage } from "../utils/multerConfig.js";

const router = express.Router();

router.route('/posts').post(isAuthenticated, uploadPostImage.single("media"), createPost);
router.route('/posts').get(isAuthenticated, getAllPost);
router.route('/posts/:id').get(isAuthenticated, getPostById);
router.route('/userposts/').get(isAuthenticated, getUserPost);
router.route('/posts/:id').delete(isAuthenticated, deletePost);
router.route('/posts/:id/like').post(isAuthenticated, toggleLike);


export default router;