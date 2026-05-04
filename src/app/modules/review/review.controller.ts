import { Request, Response } from "express";
import catchAsync from "../../sharedfile/catchAsync";
import sendResponse from "../../sharedfile/sendResponse";
import status from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await reviewService.createReview(req.body, user?.id as string);
    sendResponse(res, {
        statusCode: Number(status.CREATED),
        success: true,
        message: "Review Created Successfully",
        data: result,
    });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await reviewService.getReviews();
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "Reviews fetched successfully",
        data: result,
    });
});

const getMyReview = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await reviewService.getMyReview(user?.id as string);
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "My reviews fetched successfully",
        data: result,
    });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await reviewService.getReviewById(id as string);
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "Review fetched successfully by id",
        data: result,
    });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await reviewService.updateReview(id as string, req.body, user?.id as string);
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await reviewService.deleteReview(id as string, user?.id as string, user?.role as string);
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "Review deleted successfully",
        data: result,
    });
});

export const reviewController = {
    createReview,
    getAllReviews,
    getMyReview,
    getReviewById,
    updateReview,
    deleteReview,
};
