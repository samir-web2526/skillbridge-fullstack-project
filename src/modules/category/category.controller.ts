import { Request, Response } from "express";
import { categoryService } from "./category.service"

const createCategory = async(req:Request,res:Response)=>{
    console.log("body",req.body)
    const result = await categoryService.createCategory(req.body);
    res.status(201).json({
        message:"Category Created successfully",
        data:result
    })
}

const getCategory = async(req:Request,res:Response)=>{
    const result = await categoryService.getCategory();
    res.status(201).json({
        message:"Category fetched successfully",
        data:result
    })
    return result
}

export const categoryController = {
    createCategory,
    getCategory
}