import mongoose, { Schema, model } from "mongoose";
import { UserType } from "../types/userType.js";
const UserSchema = new Schema<UserType>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: { type: String, required: [true, "password is required"] },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Female",
      required: true,
    },
    dob: { type: Date, required: [true, "date of birth is required"] },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<UserType>("User", UserSchema);
