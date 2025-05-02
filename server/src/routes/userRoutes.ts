import express from "express";
import {
  initiateRegistration,
  loginUser,
  logout,
  verifyOtp,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register/initiate", initiateRegistration);
router.post("/register/verify-otp", verifyOtp);
router.post("/register/log-in", loginUser);
router.post("/register/log-out", logout);
export default router;
