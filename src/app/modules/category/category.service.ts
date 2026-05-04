import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createCategory = async (payload: any) => {
    const result = await prisma.category.create({
        data: payload,
    });
    return result;
};

const getCategory = async () => {
    const result = await prisma.category.findMany({
        include: {
            tutor: true,
        },
    });
    return result;
};

const getCategoryById = async (id: string) => {
    const result = await prisma.category.findUnique({
        where: { id },
        include: {
            tutor: true,
        },
    });
    if (!result) {
        throw new AppError(status.NOT_FOUND, "Category not found");
    }
    return result;
};

const updateCategory = async (id: string, payload: any) => {
    const result = await prisma.category.update({
        where: { id },
        data: payload,
    });
    return result;
};

const deleteCategory = async (id: string) => {
    const result = await prisma.category.delete({
        where: { id },
    });
    return result;
};

export const categoryService = {
    createCategory,
    getCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
