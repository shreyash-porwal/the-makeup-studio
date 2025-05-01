import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/genericResponse.js";

export const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // customizing cast error occuring due to inavallid id of mongodb document
  if (err.name === "CastError") err.message = "Invalid Id";

  res.status(err.statusCode).json(errorResponse(err.message, err));
  return;
};
