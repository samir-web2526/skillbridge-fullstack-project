import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createReview = async (payload: any, userId: string) => {
    const { bookingId, rating, comment, tutorId } = payload;

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        throw new AppError(status.NOT_FOUND, "Booking not found");
    }

    if (booking.userId !== userId) {
        throw new AppError(status.FORBIDDEN, "Only the student who booked can review");
    }

    const result = await prisma.review.create({
        data: {
            rating,
            comment,
            tutorId,
            userId,
            bookingId,
        },
    });

    // Update tutor's average rating
    const tutorReviews = await prisma.review.findMany({
        where: { tutorId },
    });

    const averageRating = tutorReviews.reduce((sum, r) => sum + r.rating, 0) / tutorReviews.length;

    await prisma.tutorProfile.update({
        where: { id: tutorId },
        data: { averageRating },
    });

    return result;
};

const getReviews = async () => {
    const result = await prisma.review.findMany({
        include: {
            user: true,
            tutor: true,
        },
    });
    return result;
};

const getReviewByTutorId = async (tutorId: string) => {
    const result = await prisma.review.findMany({
        where: { tutorId },
        include: {
            user: true,
        },
    });
    return result;
};

const getMyReview = async (userId: string) => {
    const result = await prisma.review.findMany({
        where: { userId },
        include: {
            tutor: true,
        },
    });
    return result;
};

const getReviewById = async (id: string) => {
    const result = await prisma.review.findUnique({
        where: { id },
        include: {
            user: true,
            tutor: true,
        },
    });
    if (!result) {
        throw new AppError(status.NOT_FOUND, "Review not found");
    }
    return result;
};

const updateReview = async (id: string, payload: any, userId: string) => {
    const review = await prisma.review.findUnique({
        where: { id },
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, "Review not found");
    }

    if (review.userId !== userId) {
        throw new AppError(status.FORBIDDEN, "Unauthorized");
    }

    const result = await prisma.review.update({
        where: { id },
        data: payload,
    });
    return result;
};

const deleteReview = async (id: string, userId: string, role: string) => {
    const review = await prisma.review.findUnique({
        where: { id },
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, "Review not found");
    }

    if (role !== "ADMIN" && review.userId !== userId) {
        throw new AppError(status.FORBIDDEN, "Unauthorized");
    }

    const result = await prisma.review.delete({
        where: { id },
    });
    return result;
};

export const reviewService = {
    createReview,
    getReviews,
    getReviewByTutorId,
    getMyReview,
    getReviewById,
    updateReview,
    deleteReview,
};
