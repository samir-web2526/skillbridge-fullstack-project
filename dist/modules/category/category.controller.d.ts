import { Request, Response } from "express";
export declare const categoryController: {
    createCategory: (req: Request, res: Response) => Promise<void>;
    getCategory: (req: Request, res: Response) => Promise<{
        id: string;
        name: string;
    }[]>;
    getCategoryById: (req: Request, res: Response) => Promise<void>;
    updateCategory: (req: Request, res: Response) => Promise<void>;
    deleteCategory: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=category.controller.d.ts.map