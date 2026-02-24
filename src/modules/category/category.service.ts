import { prisma } from "../../lib/prisma";

const createCategory = async (payload: any) => {
  console.log("payload", payload);
  const result = await prisma.category.create({
    data: {
      ...payload,
    },
  });
  return result;
};

const getCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const getCategoryById = async (categoryId: string) => {
  const existCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!existCategory) {
    throw new Error("Category not found");
  }

  return await prisma.category.findFirst({
    where: {
      id: existCategory.id,
    },
  });
};

const updateCategory = async (payload: any, categoryId: string) => {
  const existCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const existTutor = await prisma.tutorProfile.findFirst({
    where: {
      categoryId: categoryId,
    },
  });

  if (!existCategory) {
    throw new Error("Category not found");
  }

  if (existTutor) {
    throw new Error("You Cannot update category with assigned tutors");
  }

  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      ...payload,
    },
  });
};
const deleteCategory = async (categoryId: string) => {
  const existCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const existTutor = await prisma.tutorProfile.findFirst({
    where: {
      categoryId: categoryId,
    },
  });

  if (!existCategory) {
    throw new Error("Category not found");
  }

  if (existTutor) {
    throw new Error("You Cannot delete category with assigned tutors");
  }

  return await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export const categoryService = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
