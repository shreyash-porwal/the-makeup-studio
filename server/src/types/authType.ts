import { Document } from "mongoose";

export type UserType = {
  name: string;
  email: string;
  password: string;
  gender: "Male" | "Female" | "Other";
  role: "User" | "Admin";
  dob: Date;
  otp?: string;
  otpExpiry?: Date;
  isVerified?: boolean;
} & Document;


export type LogInType = {
  email: string;
  password: string;
}