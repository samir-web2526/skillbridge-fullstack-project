import { Router } from "express";
import { categoryController } from "./category.controller";
import { checkAuth } from "../../middlewares/auth";

const router = Router();
router.post("/", checkAuth("ADMIN"), categoryController.createCategory);
router.get("/", categoryController.getCategory);
router.get("/:categoryId", categoryController.getCategoryById);
router.patch(
  "/:categoryId",
  checkAuth("ADMIN"),
  categoryController.updateCategory,
);
router.delete(
  "/:categoryId",
  checkAuth("ADMIN"),
  categoryController.deleteCategory,
);
export const categoryRouter = router;
