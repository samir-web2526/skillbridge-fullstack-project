import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { jwtUtils } from "../utils/jwt";

export enum userRole {
    STUDENT = "STUDENT",
    TUTOR = "TUTOR",
    ADMIN = "ADMIN"
}


const auth = (...roles: userRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new Error('You are not authorized');
      }

      // verify token
      let verifiedUser = null;

      verifiedUser = jwtUtils.verifyToken(token, envVars.ACCESS_TOKEN_SECRET as Secret);

      req.user = verifiedUser as any; // Attach user to request

      // role based access control
      if (roles.length && !roles.includes(verifiedUser.role as userRole)) {
        throw new Error("You don't have permission to access this part");
      }
      next();
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || "Unauthorized",
        });
    }
  };
};

export default auth;
