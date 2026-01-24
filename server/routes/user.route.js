import express from "express";
import { signIn, signUp, logout, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/logout').get(logout);
router.route('/profile/update').get(updateProfile);


export default router;