import { Router } from "express";
import { reviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/auth";

const router = Router();

router.post("/", checkAuth("STUDENT"), reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/my-reviews", checkAuth("TUTOR", "STUDENT"), reviewController.getMyReview);
router.get("/:id", reviewController.getReviewById);
router.patch("/:id", checkAuth("STUDENT"), reviewController.updateReview);
router.delete("/:id", checkAuth("STUDENT", "ADMIN"), reviewController.deleteReview);

export const reviewRouter = router;
