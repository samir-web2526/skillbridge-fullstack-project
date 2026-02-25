import { Request, Response } from "express";
export declare const tutorController: {
    createTutor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTutor: (req: Request, res: Response) => Promise<void>;
    getTutorById: (req: Request, res: Response) => Promise<void>;
    updateTutor: (req: Request, res: Response) => Promise<void>;
    deleteTutor: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=tutor.controller.d.ts.map