import { Request, Response } from "express";
import { User } from "../../models/masters/userSchema.js";
import { errorResponse, successResponse } from "../../utils/genericResponse.js";
import { LogInType, SignUpType } from "../../types/auth/authType.js";
import { validateWithSchema } from "../../utils/validationFunction.js";
import { SignUpSchema } from "../../utils/joiValidationSchema/auth/authSchema.js";
import bcrypt from "bcryptjs";
import { TryCatch } from "../../middlewares/errorMiddleware.js";
import { logInSchema } from "../../utils/joiValidationSchema/loginSchema.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../../utils/customError.js";
import { CustomRequest } from "../../types/reqResTypes/responseTypes.js";
import otpGenerator from "otp-generator";
import OTP from "../../models/auth/OTP.js";

export const sendOtp = TryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void> => {
    const { email } = req.body;

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json(errorResponse(`User is Already Registered`));
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);
    return res.status(200).json(successResponse(otp, `OTP Sent Successfully`));
  }
);

export const signUp = TryCatch(
  async (
    req: CustomRequest,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void> => {
    const reqObj: SignUpType = req.body;
    const validatedData = validateWithSchema<SignUpType>(SignUpSchema, reqObj);

    // Check if password and confirm password match
    if (validatedData.password !== validatedData.confirmPassword) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Password and Confirm Password do not match. Please try again."
          )
        );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res
        .status(400)
        .json(
          errorResponse("User already exists. Please sign in to continue.")
        );
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email: validatedData.email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(response);
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json(errorResponse("The OTP is not valid"));
    } else if (validatedData.otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json(errorResponse("OTP not matched"));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await User.create({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: hashedPassword,
      gender: validatedData.gender,
      dob: validatedData.dob,
      role: validatedData.role,
      image: "",
    });

    return res
      .status(200)
      .json(successResponse(user, "User registered successfully"));
  }
);

export const logIn = TryCatch(
  async (
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void> => {
    const reqObj: LogInType = req.body;
    console.log("INside login function");
    try {
      const validObj = validateWithSchema<LogInType>(logInSchema, reqObj);
      const userObj = await User.findOne({ email: validObj.email });
      if (!userObj) {
        return res.status(404).json(errorResponse("User not found"));
      }

      const isMatch = await bcrypt.compare(validObj.password, userObj.password);
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

      const user = await User.findOne({ email: validObj.email }).select(
        "-password"
      );

      let expiresIn: number =
        Number(process.env.JWT_EXPIRES_IN) * 3600 * 24 || 3600 * 24 * 5;
      const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: Number(expiresIn),
      });

      if (!token) {
        throw new ErrorHandler("Token creation failed!!", 500);
      }

      const cookieExpiresDays: number =
        Number(process.env.COOKIE_EXPIRES_DAYS) || 5;

      const options = {
        expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
        maxAge: cookieExpiresDays * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // use true in prod
        sameSite: "strict" as const,
      };

      return res
        .status(200)
        .cookie("token", token, options)
        .json(successResponse({ token, user }, "Login successful"));
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    localStorage.setItem("token", "");
    req.user = null;
    return res.status(200).json(successResponse("Logged out successfully"));
  }
);
