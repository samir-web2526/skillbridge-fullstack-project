import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();
router.post("/",categoryController.createCategory);
router.get("/",categoryController.getCategory)
export const categoryRouter = router