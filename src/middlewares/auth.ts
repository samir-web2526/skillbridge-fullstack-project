import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { Role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
        emailVerify: boolean;
      };
    }
  }
}

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      console.log(session?.user);

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are unauthorized!!!",
        });
      }

      if (!session?.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Plz verify your email",
        });
      }

      req.user = {
        id: session?.user.id as string,
        name: session?.user.name as string,
        email: session?.user.email as string,
        role: session?.user.role as Role,
        emailVerify: session?.user.emailVerified as boolean,
      };

      const allowedRoles = roles.map((role) => role.toString());
      const userRole = req.user?.role;

      console.log("ROLES FROM ROUTE:", roles);
      console.log("ALLOWED ROLES (string):", allowedRoles);
      console.log("USER ROLE (from session):", userRole);
      console.log("USER ROLE type:", typeof userRole);
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to access this resources",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
