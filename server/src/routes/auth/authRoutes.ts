// Import the required modules
import express from "express";
const router = express.Router();

// Import the required controllers and middleware functions
import {
  logIn,
  signUp,
  sendOtp,
  me,
  logout,
} from "../../controllers/auth/authController.js";
import { auth } from "../../middlewares/authMiddleware.js";
// import auth from "../../middlewares/authMiddleware.js";
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", logIn);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOtp);

router.get("/me", me);

router.post("/logout", auth, logout);
export default router;
