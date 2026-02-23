import { Request, Response } from "express";
import { reviewService } from "./review.service";
import { userRole } from "../../middlewares/auth";

const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(403).json({
        message: "You ar unauthorized!!",
      });
    }

    const result = await reviewService.createReview(
      req.body,
      user?.id as string,
    );
    res.status(201).json({
      message: "Review Created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getReview = async (req: Request, res: Response) => {
  const result = await reviewService.getReview();
  res.status(201).json({
    message: "Review fetched successfully",
    data: result,
  });
};

const getReviewById = async(req: Request, res: Response)=>{
  try {
    const reviewId = req.params.reviewId;
  const result = await reviewService.getReviewById(reviewId as string);
  res.status(201).json({
    message: "Review fetched successfully by id",
    data: result,
  });
  } catch (error:any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

const updateReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const reviewId = req.params.reviewId;

    const result = await reviewService.updateReview(
      req.body,
      user?.id as string,
      reviewId as string,
    );
    res.status(201).json({
      message: "Review updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


const deleteReview = async(req: Request, res: Response)=>{
  try {
    const user = req.user;
    const reviewId = req.params.reviewId;

    const result = await reviewService.deleteReview(req.body,user?.id as string,reviewId as string,user?.role as userRole);
    res.status(201).json({
      message: "Review updated successfully",
      data: result,
    });
  } catch (error:any) {
     res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

export const reviewController = {
  createReview,
  getReview,
  updateReview,
  getReviewById,
  deleteReview
};
