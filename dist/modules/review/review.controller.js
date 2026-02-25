import { reviewService } from "./review.service";
const createReview = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(403).json({
                message: "You ar unauthorized!!",
            });
        }
        const result = await reviewService.createReview(req.body, user?.id);
        res.status(201).json({
            message: "Review Created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const getReview = async (req, res) => {
    const result = await reviewService.getReview();
    res.status(201).json({
        message: "Review fetched successfully",
        data: result,
    });
};
const getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const result = await reviewService.getReviewById(reviewId);
        res.status(201).json({
            message: "Review fetched successfully by id",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const updateReview = async (req, res) => {
    try {
        const user = req.user;
        const reviewId = req.params.reviewId;
        const result = await reviewService.updateReview(req.body, user?.id, reviewId);
        res.status(201).json({
            message: "Review updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const deleteReview = async (req, res) => {
    try {
        const user = req.user;
        const reviewId = req.params.reviewId;
        const result = await reviewService.deleteReview(req.body, user?.id, reviewId, user?.role);
        res.status(201).json({
            message: "Review updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
export const reviewController = {
    createReview,
    getReview,
    updateReview,
    getReviewById,
    deleteReview
};
//# sourceMappingURL=review.controller.js.map