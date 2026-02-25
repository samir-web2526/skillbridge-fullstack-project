import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  console.log("body", req.body);
  const result = await categoryService.createCategory(req.body);
  res.status(201).json({
    message: "Category Created successfully",
    data: result,
  });
};

const getCategory = async (req: Request, res: Response) => {
  const result = await categoryService.getCategory();
  res.status(201).json({
    message: "Category fetched successfully",
    data: result,
  });
  return result;
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await categoryService.getCategoryById(categoryId as string);
    res.status(201).json({
      message: "Category fetched successfully by Id",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await categoryService.updateCategory(
      req.body,
      categoryId as string,
    );
    res.status(201).json({
      message: "Category updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await categoryService.deleteCategory(categoryId as string);
    res.status(201).json({
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const categoryController = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
