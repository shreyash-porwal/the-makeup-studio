import { Schema, model } from "mongoose";
import { UserType } from "../../types/masters/userType.js";
const UserSchema = new Schema<UserType>(
  {
    firstName: { type: String, required: [true, "First Name is required"] },
    lastName: { type: String, required: [true, "Last Name is required"] },
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
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
      required: true,
    },
    dob: { type: Date, required: [true, "date of birth is required"] },
  },
  { timestamps: true }
);

export const User = model<UserType>("User", UserSchema);
