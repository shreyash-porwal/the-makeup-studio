import { Document } from "mongoose";

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "Male" | "Female" | "Other";
  dob: Date;
  role: "User" | "Admin";
} & Document;
