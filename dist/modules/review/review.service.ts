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
    throw new Error("You cann't review this tutor because he is not your user");
  }

  const result = await prisma.review.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
};

const getReview = async () => {
  const result = await prisma.review.findMany();
  return result;
};

const getReviewById = async(reviewId:string)=>{
  const result = await prisma.review.findUnique({
    where:{
      id:reviewId
    }
  });
  return result;
}

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
  return updateReview;
};

const deleteReview = async(payload:any,userId:string,reviewId:string,role:userRole)=>{

  const existReview = await prisma.review.findUnique({
    where:{
      id:reviewId
    }
  });
  if(!existReview){
    throw new Error("Review not found!!");
  }

  if(role === "STUDENT" && existReview.userId !== userId){
    throw new Error("You can delete only your own review");
  }
  
  return await prisma.review.delete({
    where:{
      id:reviewId
    }
  })
}

export const reviewService = {
  createReview,
  getReview,
  updateReview,
  getReviewById,
  deleteReview
};
