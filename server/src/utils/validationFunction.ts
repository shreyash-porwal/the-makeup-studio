import { Schema } from "joi";
import ErrorHandler from "./customError.js";

export const validateWithSchema = <T>(schema: Schema, data: any): T => {
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    throw new ErrorHandler(`Validation Error: ${error.message}`, 400);
  }

  return value as T;
};
