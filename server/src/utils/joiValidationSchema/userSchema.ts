import Joi from "joi";
import { UserType } from "../../types/authType.js";

export const userSchema = Joi.object<UserType>({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  role: Joi.string().valid("User", "Admin").required(),
  dob: Joi.date().iso().required(),
  otp: Joi.string().optional(),
  otpExpiry: Joi.date().optional(),
  isVerified: Joi.boolean().optional()
});
