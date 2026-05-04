import { Router } from "express";
import { reviewController } from "./review.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(userRole.STUDENT), reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/my-reviews", auth(userRole.TUTOR, userRole.STUDENT), reviewController.getMyReview);
router.get("/:id", reviewController.getReviewById);
router.patch("/:id", auth(userRole.STUDENT), reviewController.updateReview);
router.delete("/:id", auth(userRole.STUDENT, userRole.ADMIN), reviewController.deleteReview);

export const reviewRouter = router;
