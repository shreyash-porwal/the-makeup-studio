import { Schema } from "joi";
import ErrorHandler from "./customError.js";

export const validateWithSchema = <T>(schema: Schema, data: any): T => {
  if (typeof data !== "object" || data === null) {
    throw new ErrorHandler(
      `Validation Error: Request body must be a valid object`,
      400
    );
  }
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    throw new ErrorHandler(`Validation Error: ${error.message}`, 400);
  }
  console.log("value", data);
  return value as T;
};
