import express from "express";
import { signIn, signUp, logout, updateProfile, getUserProfile, getMe, searchUser, followUser, resetPassword } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadProfileAndCover } from "../utils/profileMulterConfig.js";
import { forgetPassword } from "../controllers/user.controller.js";

const router = express.Router();

// Auththentication routes
router.route('/users').post(signUp);
router.route('/sessions').post(signIn);
router.route('/sessions').delete(isAuthenticated, logout);

// Current user routes
router.route('/users/me').get(isAuthenticated, getMe);
router.route('/users/me').patch(isAuthenticated, uploadProfileAndCover, updateProfile);

// static route > Dynamic route > wildcard route
router.route('/users/search').get(isAuthenticated, searchUser);

// specific user by id
router.route('/users/:id').get(isAuthenticated, getUserProfile);

router.route('/users/:id/follow').post(isAuthenticated, followUser);

// password 
router.route('/users/forgot-password').post(forgetPassword);
router.route('/users/reset-password/:token').post(resetPassword);




export default router;