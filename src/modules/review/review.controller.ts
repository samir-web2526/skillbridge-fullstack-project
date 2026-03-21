import { Request, Response } from "express";
import { reviewService } from "./review.service";
import { userRole } from "../../middlewares/auth";
import paginationSortHelpers from "../../helpers/paginationSortHelpers";

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

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = paginationSortHelpers(req.query);
    const result = await reviewService.getReview({ page, limit, skip });
    res.status(200).json({
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getMyReview = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user!.id;
    const { page, limit, skip } = paginationSortHelpers(req.query);
    const result = await reviewService.getReview(
      { page, limit, skip },
      tutorId,
    );
    res.status(200).json({
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getReviewById = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    const result = await reviewService.getReviewById(reviewId as string);
    res.status(201).json({
      message: "Review fetched successfully by id",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

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

const deleteReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const reviewId = req.params.reviewId;

    const result = await reviewService.deleteReview(
      req.body,
      user?.id as string,
      reviewId as string,
      user?.role as userRole,
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

export const reviewController = {
  createReview,
  getAllReviews,
  getMyReview,
  updateReview,
  getReviewById,
  deleteReview,
};
