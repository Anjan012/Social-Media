import express from "express";
import { signIn, signUp } from "../controllers/user.controller.js";

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/signIn').post(signIn);

export default router;