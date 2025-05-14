import Joi from "joi";
import { SignUpType } from "../../../types/auth/authType.js";

export const SignUpSchema = Joi.object<SignUpType>({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  // contactNumber:Joi.string().min(10).max(10).required(),
  confirmPassword: Joi.string().min(6).required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  role: Joi.string().valid("User", "Admin").required(),
  dob: Joi.date().iso().required(),
  otp: Joi.string().optional(),
  otpExpiry: Joi.date().optional(),
});
