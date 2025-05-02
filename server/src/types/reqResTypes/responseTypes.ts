import { Request } from "express";
import { UserType } from "../authType.js";
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}
export interface CustomRequest extends Request {
  user?: UserType | null;
  role?: string;
}
