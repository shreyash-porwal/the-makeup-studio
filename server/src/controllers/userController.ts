import { Request, Response } from "express";
import { User } from "../models/userSchema.js";
import { errorResponse, successResponse } from "../utils/genericResponse.js";
import { LogInType, UserType } from "../types/authType.js";
import { validateWithSchema } from "../utils/validationFunction.js";
import { userSchema } from "../utils/joiValidationSchema/userSchema.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../config/nodemailer.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { logInSchema } from "../utils/joiValidationSchema/loginSchema.js";
import jwt, { Secret } from "jsonwebtoken";
import ErrorHandler from "../utils/customError.js";
import { CustomRequest } from "../types/reqResTypes/responseTypes.js";
export const initiateRegistration = TryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void> => {
    const reqObj: UserType = req.body;
    const validatedData = validateWithSchema<UserType>(userSchema, reqObj);
    if (validatedData) {
      const existing = await User.findOne({ email: reqObj.email });
      if (existing)
        return res.status(400).json(errorResponse("User already exists"));

      const hashedPassword = await bcrypt.hash(reqObj.password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);

      const user = new User({
        name: reqObj.name,
        email: reqObj.email,
        gender: reqObj.gender,
        role: reqObj.role,
        dob: reqObj.dob,
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

      return res.status(201).json(successResponse(user, "OTP sent to email"));
    }
  }
);

export const verifyOtp = TryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void> => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json(errorResponse("Invalid request"));
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json(errorResponse("OTP expired"));
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json(errorResponse("Invalid OTP"));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return res
      .status(200)
      .json(successResponse(user, "User verified successfully"));
  }
);

export const loginUser = TryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void> => {
    const reqObj: LogInType = req.body;
    try {
      const validObj = validateWithSchema<LogInType>(logInSchema, reqObj);
      const user = await User.findOne({ email: validObj.email });
      if (!user) {
        return res.status(404).json(errorResponse("User not found"));
      }

      if (!user.isVerified) {
        return res.status(403).json(errorResponse("User not verified"));
      }

      const isMatch = await bcrypt.compare(validObj.password, user.password);
      if (!isMatch) {
        return res.status(401).json(errorResponse("Incorrect password"));
      }

      const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new ErrorHandler(
          `JWT_SECRET is not defined in environment variables`,
          400
        );
      }

      user.password = "";
      let expiresIn: number =
        Number(process.env.JWT_EXPIRES_IN) * 3600 * 24 || 3600 * 24 * 5;

      const payload = user.toObject();
      console.log("PayLoad === ", payload);
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: Number(expiresIn),
      });

      if (!token) {
        throw new ErrorHandler("Token creation failed!!", 500);
      }

      const cookieExpiresDays: number =
        Number(process.env.COOKIE_EXPIRES_DAYS) || 5;
      const options = {
        expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
      };
      return res
        .status(200)
        .cookie("token", token, options)
        .json(successResponse(user, "Login successful"));
    } catch (err: any) {
      return res
        .status(500)
        .json(errorResponse(`Login failed ${err.message}`, err));
    }
  }
);

export const logout = TryCatch(
  async (
    req: CustomRequest,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void> => {
    res.clearCookie("token");
    console.log("req ====== ",req.user);
    req.user = null;
    console.log(req.user);
    return res.status(200).json(successResponse("Logged out successfully"));
  }
);
