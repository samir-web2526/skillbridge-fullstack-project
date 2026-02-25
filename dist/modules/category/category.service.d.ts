export declare const categoryService: {
    createCategory: (payload: any) => Promise<{
        id: string;
        name: string;
    }>;
    getCategory: () => Promise<{
        id: string;
        name: string;
    }[]>;
    getCategoryById: (categoryId: string) => Promise<{
        id: string;
        name: string;
    } | null>;
    updateCategory: (payload: any, categoryId: string) => Promise<{
        id: string;
        name: string;
    }>;
    deleteCategory: (categoryId: string) => Promise<{
        id: string;
        name: string;
    }>;
};
//# sourceMappingURL=category.service.d.ts.map