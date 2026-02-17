import express from "express";
import { signIn, signUp, logout, updateProfile, getUserProfile, getMe, searchUser, followUser } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/me').get(isAuthenticated, getMe);
router.route('/profile/:id').get(isAuthenticated, getUserProfile);
router.route('/profile/update').patch(isAuthenticated, updateProfile);
router.route('/search').get((req,res,next)=>{
//   console.log("SEARCH ROUTE HIT");
  next();
}, isAuthenticated, searchUser);
router.route('/follow/:id').post(isAuthenticated, followUser);

router.route('/logout').get(logout);


export default router;