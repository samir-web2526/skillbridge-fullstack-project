import { prisma } from "../../lib/prisma";
import { userRole } from "../../middlewares/auth";

const createReview = async (payload: any, userId: string) => {
  const existBooking = await prisma.booking.findFirst({
    where: {
      id: payload.bookingId,
    },
  });

  const alreadyReviewed = await prisma.review.findUnique({
    where: {
      bookingId: payload.bookingId,
    },
  });

  if (alreadyReviewed) {
    throw new Error(
      "You cann't reviewed again because you already reviewed this session",
    );
  }

  if (!existBooking) {
    throw new Error("Booking not found");
  }

  if (existBooking.status !== "COMPLETED") {
    throw new Error(
      "You cann't review this tutor because session is not completed",
    );
  }

  if (
    existBooking.userId !== userId ||
    existBooking.tutorId !== payload.tutorId
  ) {
    throw new Error(
      "You cann't review this tutor because he is not your tutor",
    );
  }

  const result = await prisma.review.create({
    data: {
      ...payload,
      userId,
    },
  });
  const reviews = await prisma.review.findMany({
    where: { tutorId: payload.tutorId },
    select: { rating: true },
  });
  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await prisma.tutorProfile.update({
    where: { id: payload.tutorId },
    data: { averageRating },
  });
  return result;
};

const getReview = async (
  payload: {
    page: number;
    limit: number;
    skip: number;
  },
  userId?: string,
) => {
  let where = {};

  if (userId) {
    where = {
      OR: [{ userId: userId }, { tutor: { userId: userId } }],
    };
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: true,
        tutor: {
          include: {
            user: true,
            category: true,
          },
        },
      },
      skip: payload.skip,
      take: payload.limit,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    paginations: {
      total,
      page: payload.page,
      limit: payload.limit,
      totalPage: Math.ceil(total / payload.limit),
    },
  };
};

const getReviewById = async (reviewId: string) => {
  const result = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });
  return result;
};

const updateReview = async (payload: any, userId: string, reviewId: string) => {
  const existReview = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });
  if (!existReview) {
    throw new Error("You don't reviewed any tutor!!");
  }
  if (existReview.userId !== userId) {
    throw new Error("You are not allowed to update this review");
  }
  const updateReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      ...payload,
    },
  });
  const reviews = await prisma.review.findMany({
    where: { tutorId: existReview.tutorId },
    select: { rating: true },
  });
  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await prisma.tutorProfile.update({
    where: { id: existReview.tutorId },
    data: { averageRating },
  });
  return updateReview;
};

const deleteReview = async (
  userId: string,
  reviewId: string,
  role: userRole,
) => {
  const existReview = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });
  if (!existReview) {
    throw new Error("Review not found!!");
  }

  if (role === "STUDENT" && existReview.userId !== userId) {
    throw new Error("You can delete only your own review");
  }

  return await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};

export const reviewService = {
  createReview,
  getReview,
  updateReview,
  getReviewById,
  deleteReview,
};
