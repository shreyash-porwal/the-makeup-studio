import { ApiResponse } from "../types/reqResTypes/responseTypes.js";

export function successResponse<T>(
  data: T,
  message: string = "Operation successful"
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse<T>(message: string, error?: T): ApiResponse<T> {
  return {
    success: false,
    message,
    error,
  };
}
