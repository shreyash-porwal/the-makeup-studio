import ErrorHandler from "../utils/customError.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, RequestHandler, Response } from "express";
import { CustomRequest } from "../types/reqResTypes/responseTypes.js";
import { TryCatch } from "./errorMiddleware.js";
import { errorResponse } from "../utils/genericResponse.js";
import { UserType } from "../types/masters/userType.js";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new ErrorHandler("JWT_SECRET not defined", 400);

export const auth = TryCatch(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Extracting JWT from request cookies, body or header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json(errorResponse("Unauthorized"));
    }

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json(errorResponse(`Token Missing`));
    }
    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decode = await jwt.verify(token, JWT_SECRET);
      console.log(decode);
      const { iat, exp, ...user } = decode as any;
      req.user = user as UserType;
      next();
    } catch (err) {
      return res.status(401).json(errorResponse("Invalid or expired token"));
    }
  }
);

export const roleAuthorization = (allowedRoles: string[]): RequestHandler => {
  return TryCatch(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user || !allowedRoles.includes(user.role)) {
        console.log(user);
        return res
          .status(403)
          .json(errorResponse("Access forbidden: invalid role"));
      }

      console.log("role authorization successful");
      next();
    }
  );
};
