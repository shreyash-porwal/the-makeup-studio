import { NextFunction, Request, Response } from "express";
import { User } from "../models/userSchema.js";
import { successResponse } from "../utils/genericResponse.js";
import { UserType } from "../types/userType.js";
import { validateWithSchema } from "../utils/validationFunction.js";
import { userSchema } from "../utils/joiValidationSchema/userSchema.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../config/nodemailer.js";

export const initiateRegistration = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, email, password, gender, dob } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = new User({
      name,
      email,
      gender,
      dob,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    });

    await user.save();

    await sendMail({
      from: "The MakeUp Studio",
      to: user.email,
      subject: "OTP Verification",
      html: `<h1>Otp is ${otp}</h1>`,
    });

    res.status(201).json(successResponse(user, "OTP sent to email"));
  } catch (error) {
    res.status(500).json({ message: "Error during registration", error });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error });
  }
};
