import { Router } from "express";
import { categoryController } from "./category.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router();
router.post("/", auth(userRole.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getCategory);
router.get("/:categoryId", categoryController.getCategoryById);
router.patch(
  "/:categoryId",
  auth(userRole.ADMIN),
  categoryController.updateCategory,
);
router.delete(
  "/:categoryId",
  auth(userRole.ADMIN),
  categoryController.deleteCategory,
);
export const categoryRouter = router;
