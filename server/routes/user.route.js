import express from "express";
import { signIn, signUp, logout, updateProfile, getUserProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/profile').get(isAuthenticated, getUserProfile);
router.route('/profile/update').patch(isAuthenticated, updateProfile);
router.route('/logout').get(logout);


export default router;