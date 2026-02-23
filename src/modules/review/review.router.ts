import { Router } from "express";
import { reviewController } from "./review.controller";
import auth, { userRole } from "../../middlewares/auth";


const router = Router();
router.post("/",auth(userRole.STUDENT),reviewController.createReview);
router.get("/",reviewController.getReview);
router.patch("/:reviewId",auth(userRole.STUDENT),reviewController.updateReview);
export const reviewRouter = router;