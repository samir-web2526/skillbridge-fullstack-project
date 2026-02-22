import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";


export enum userRole {
    STUDENT = "STUDENT",
    TUTOR = "TUTOR",
    ADMIN = "ADMIN"
}


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerify: boolean;
      };
    }
  }
}

const auth = (...roles: userRole[]) => {
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
        role: session?.user.role as string,
        emailVerify: session?.user.emailVerified as boolean,
      };

     
      if(roles.length && !roles.includes(req.user.role as userRole)){
            return res.status(403).json({
                success:false,
                message:"you don't have permission to acces this part"
            })
        }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
