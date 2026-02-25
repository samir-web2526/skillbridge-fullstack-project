type IOptions = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
};
declare const paginationSortHelpers: (options: IOptions) => {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};
export default paginationSortHelpers;
//# sourceMappingURL=paginationSortHelpers.d.ts.map