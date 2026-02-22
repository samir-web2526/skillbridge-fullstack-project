import { Router } from "express";
import { reviewController } from "./review.controller";
import auth, { userRole } from "../../middlewares/auth";


const router = Router();
router.post("/",auth(userRole.STUDENT),reviewController.createReview);
router.get("/",reviewController.getReview);
export const reviewRouter = router;