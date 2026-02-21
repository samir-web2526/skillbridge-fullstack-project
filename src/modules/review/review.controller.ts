import { Request, Response } from "express";
import { reviewService } from "./review.service";

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
export const reviewController = {
  createReview,
  getReview,
};
