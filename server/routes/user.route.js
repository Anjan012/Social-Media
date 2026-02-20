import express from "express";
import { signIn, signUp, logout, updateProfile, getUserProfile, getMe, searchUser, followUser } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// router.route('/signup').post(signUp);
// router.route('/signin').post(signIn);
// router.route('/me').get(isAuthenticated, getMe);
// router.route('/profile/:id').get(isAuthenticated, getUserProfile);
// router.route('/profile/update').patch(isAuthenticated, updateProfile);
// router.route('/search').get((req,res,next)=>{
// //   console.log("SEARCH ROUTE HIT");
//   next();
// }, isAuthenticated, searchUser);
// router.route('/follow/:id').post(isAuthenticated, followUser);

// router.route('/logout').delete(logout);


// Auththentication routes
router.route('/users').post(signUp);
router.route('/sessions').post(signIn);
router.route('/sessions').delete(isAuthenticated, logout);

// Current user routes
router.route('/users/me').get(isAuthenticated, getMe);
router.route('/users/me').patch(isAuthenticated, updateProfile);

// specific user by id
router.route('/users/:id').get(isAuthenticated, getUserProfile);

router.route('/users/:id/follow').post(isAuthenticated, followUser);
router.route('/users/search').get(isAuthenticated, searchUser);


export default router;