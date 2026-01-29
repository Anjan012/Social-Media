import express from "express";
import { createPost, getAllPost, getPostById, deletePost, getUserPost } from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/posts').post(isAuthenticated, createPost);
router.route('/posts').get(isAuthenticated, getAllPost);
router.route('/posts/:id').get(isAuthenticated, getPostById);
router.route('/userposts/').get(isAuthenticated, getUserPost);
router.route('/posts/:id').delete(isAuthenticated, deletePost);


export default router;