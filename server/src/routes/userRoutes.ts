import express from "express";
import {
  initiateRegistration,
  verifyOtp,
} from "../controllers/userController.js";
// import { createUser } from "../controllers/userController.js";

const router = express.Router();

// router.post("/user/new", createUser);
router.post("/register/initiate", initiateRegistration);
router.post("/register/verify-otp", verifyOtp);
export default router;
