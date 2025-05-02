import { Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/customError.js";
import { errorResponse } from "../utils/genericResponse.js";
import { CustomRequest } from "../types/reqResTypes/responseTypes.js";
import { UserType } from "../types/authType.js";
import { TryCatch } from "./errorMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new ErrorHandler("JWT_SECRET not defined", 400);

export const authorizeUser = TryCatch(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    
    const token = authHeader?.split(" ")[1] || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (token == null) {
      return next(
        new ErrorHandler("Please login to access this resource", 403)
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded as UserType;
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
        return res
          .status(403)
          .json(errorResponse("Access forbidden: invalid role"));
      }

      console.log("role authorization successful");
      next();
    }
  );
};
