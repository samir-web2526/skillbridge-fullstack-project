import { NextFunction, Request, Response } from "express";
export declare enum userRole {
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
declare const auth: (...roles: userRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default auth;
//# sourceMappingURL=auth.d.ts.map