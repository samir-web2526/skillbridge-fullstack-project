import { TutorProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";


const createTutor = async (payload: any, userId: string) => {
  const existingTutor = await prisma.tutorProfile.findUnique({
    where: {
      userId: userId,
    },
  });
  if (existingTutor) {
    throw new Error("Tutor profile already exits!!!");
  }
  const result = await prisma.tutorProfile.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
};

const getTutor = async (payload: {
  search: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string | undefined;
  sortOrder: string | undefined;
}) => {
  const allAndConditions: TutorProfileWhereInput | TutorProfileWhereInput[] = [];
  if (payload.search) {
    allAndConditions.push({
      category: {
        is: {
          name: {
            contains: payload.search,
            mode: "insensitive",
          },
        },
      },
    });
  }

  const tutors = await prisma.tutorProfile.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      AND: allAndConditions,
    },
    orderBy:
      payload.sortBy && payload.sortOrder
        ? {
            [payload.sortBy]: payload.sortOrder,
          }
        : { createdAt: "desc" },
    include: {
      category: true,
      user: true,
      _count: {
        select: {
          booking: true,
          review: true,
        },
      },
      review: {
        select: {
          rating: true,
        },
      },
    },
  });

  const formattedTutors = tutors.map((tutor) => {
    const totalReview = tutor.review.length;
    const averageRating =
      totalReview > 0
        ? Number(
            tutor.review.reduce((acc, r) => acc + r.rating, 0) / totalReview,
          )
        : 0;
    return {
      id: tutor.id,
      bio: tutor.bio,
      category: tutor.category,
      user: tutor.user,
      totalBookings: tutor._count.booking,
      totalReview,
      averageRating,
    };
  });

  const total = await prisma.tutorProfile.count({
    where: {
      AND: allAndConditions,
    },
  });
  return {
    data: formattedTutors,
    paginations: {
      total,
      page: payload.page,
      limit: payload.limit,
      totalPage: Math.ceil(total / payload.limit),
    },
  };
};

const getTutorById = async (tutorId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
    include: {
      category: true,
      user: true,
      _count: {
        select: {
          booking: true,
          review: true,
        },
      },
      review: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  const totalReview = tutor.review.length;
  const averageRating =
    totalReview > 0
      ? Number(tutor.review.reduce((acc, r) => acc + r.rating, 0) / totalReview)
      : 0;
  const formattedTutor = {
    id: tutor.id,
    bio: tutor.bio,
    category: tutor.category,
    user: tutor.user,
    totalBookings: tutor._count.booking,
    totalReview,
    averageRating: averageRating,
  };

  return formattedTutor;
};

const updateTutor = async (payload: any, userId: string, tutorId: string) => {
  const tutorProfileData = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
  });
  console.log(tutorProfileData);

  if (!tutorProfileData) {
    throw new Error("Tutor not found");
  }

  if (tutorProfileData.userId !== userId) {
    throw new Error("You are not allowed to access this part");
  }

  return await prisma.tutorProfile.update({
    where: {
      id: tutorProfileData.id,
    },
    data: {
      ...payload,
    },
  });
};

const deleteTutor = async (tutorId: string) => {
  const existBooking = await prisma.booking.findFirst({
    where: {
      tutorId: tutorId,
    },
  });
  if (existBooking) {
    throw new Error("You cann't delete tutor with existing bookings");
  }

  return await prisma.tutorProfile.delete({
    where: {
      id: tutorId,
    },
  });
};
export const tutorService = {
  createTutor,
  getTutor,
  getTutorById,
  updateTutor,
  deleteTutor,
};
