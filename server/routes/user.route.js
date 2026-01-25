import express from "express";
import { signIn, signUp, logout, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/profile/update').post(isAuthenticated, updateProfile);
router.route('/logout').get(logout);


export default router;