import { Document } from "mongoose";

export type SignUpType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // contactNumber: string;
  gender: "Male" | "Female" | "Other";
  role: "User" | "Admin";
  dob: Date;
  otp?: string;
  otpExpiry?: Date;
};

export type LogInType = {
  email: string;
  password: string;
};
