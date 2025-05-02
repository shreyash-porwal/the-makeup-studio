import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { errorResponse } from "../utils/genericResponse.js";
import { ControllerType } from "../types/commonTypes.js";
import { CustomRequest } from "../types/reqResTypes/responseTypes.js";

export const TryCatch =
  (func: ControllerType): RequestHandler =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };

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
