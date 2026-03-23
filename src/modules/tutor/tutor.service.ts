import { TutorProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createTutor = async (payload: any, userId: string) => {
  const existingTutor = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (existingTutor) {
    throw new Error("Tutor profile already exists!");
  }

  return await prisma.tutorProfile.create({
    data: { ...payload, userId },
  });
};

// const getTutor = async (payload: {
//   search: string | undefined;
//   category: string | undefined;
//   minPrice: number | undefined;
//   maxPrice: number | undefined;
//   minRating: number | undefined;
//   availableOnly: boolean;
//   page: number;
//   limit: number;
//   skip: number;
//   sortBy: string | undefined;
//   sortOrder: string | undefined;
// }) => {
//   const allAndConditions: TutorProfileWhereInput[] = [];

//   allAndConditions.push({ isDeleted: false });

//   if (payload.search) {
//     allAndConditions.push({
//       OR: [
//         {
//           category: {
//             is: { name: { contains: payload.search, mode: "insensitive" } },
//           },
//         },
//         {
//           user: {
//             is: { name: { contains: payload.search, mode: "insensitive" } },
//           },
//         },
//       ],
//     });
//   }

//   if (payload.category && payload.category !== "All") {
//     allAndConditions.push({
//       category: {
//         is: { name: { equals: payload.category, mode: "insensitive" } },
//       },
//     });
//   }

//   if (payload.minPrice !== undefined || payload.maxPrice !== undefined) {
//     allAndConditions.push({
//       hourlyRate: {
//         ...(payload.minPrice !== undefined && { gte: payload.minPrice }),
//         ...(payload.maxPrice !== undefined && { lte: payload.maxPrice }),
//       },
//     });
//   }

//   if (payload.minRating !== undefined) {
//     allAndConditions.push({
//       AND: [
//         { averageRating: { gte: payload.minRating } },
//         { averageRating: { gt: 0 } },
//       ],
//     });
//   }
//   const tutors = await prisma.tutorProfile.findMany({
//     take: payload.limit,
//     skip: payload.skip,
//     where: { AND: allAndConditions },
//     orderBy:
//       payload.sortBy && payload.sortOrder
//         ? { [payload.sortBy]: payload.sortOrder }
//         : { createdAt: "desc" },
//     include: {
//       category: true,
//       user: true,
//       _count: {
//         select: { booking: true, review: true },
//       },
//       review: {
//         select: { rating: true },
//       },
//     },
//   });

//   const formattedTutors = tutors.map((tutor) => {
//     const totalReview = tutor.review.length;
//     const averageRating =
//       totalReview > 0
//         ? Number(
//             tutor.review.reduce((acc, r) => acc + r.rating, 0) / totalReview,
//           )
//         : 0;
//     return {
//       id: tutor.id,
//       bio: tutor.bio,
//       hourlyRate: tutor.hourlyRate,
//       experience: tutor.experience,
//       isAvailable: tutor.isAvailable,
//       category: tutor.category,
//       user: tutor.user,
//       totalBookings: tutor._count.booking,
//       totalReview,
//       averageRating,
//     };
//   });

//   const total = await prisma.tutorProfile.count({
//     where: { AND: allAndConditions },
//   });

//   return {
//     data: formattedTutors,
//     paginations: {
//       total,
//       page: payload.page,
//       limit: payload.limit,
//       totalPage: Math.ceil(total / payload.limit),
//     },
//   };
// };

const getTutor = async (payload: {
  search: string | undefined;
  category: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minRating: number | undefined;
  availableOnly: boolean;
  page: number;
  limit: number;
  skip: number;
  sortBy: string | undefined;
  sortOrder: string | undefined;
}) => {
  const allAndConditions: TutorProfileWhereInput[] = [];

  allAndConditions.push({ isDeleted: false });

  if (payload.search) {
    allAndConditions.push({
      OR: [
        {
          category: {
            is: { name: { contains: payload.search, mode: "insensitive" } },
          },
        },
        {
          user: {
            is: { name: { contains: payload.search, mode: "insensitive" } },
          },
        },
      ],
    });
  }

  if (payload.category && payload.category !== "All") {
    allAndConditions.push({
      category: {
        is: { name: { equals: payload.category, mode: "insensitive" } },
      },
    });
  }

  if (payload.minPrice !== undefined || payload.maxPrice !== undefined) {
    allAndConditions.push({
      hourlyRate: {
        ...(payload.minPrice !== undefined && { gte: payload.minPrice }),
        ...(payload.maxPrice !== undefined && { lte: payload.maxPrice }),
      },
    });
  }

  if (payload.minRating !== undefined) {
    allAndConditions.push({
      AND: [
        { averageRating: { gte: payload.minRating } },
        { averageRating: { gt: 0 } },
      ],
    });
  }

  if (payload.availableOnly) {
    allAndConditions.push({ isAvailable: true });
  }

  const tutors = await prisma.tutorProfile.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: { AND: allAndConditions },
    orderBy:
      payload.sortBy && payload.sortOrder
        ? { [payload.sortBy]: payload.sortOrder }
        : { createdAt: "desc" },
    include: {
      category: true,
      user: true,
      _count: {
        select: { booking: true, review: true },
      },
      review: {
        include: {
          user: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const formattedTutors = tutors.map((tutor) => {
    return {
      id: tutor.id,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      experience: tutor.experience,
      isAvailable: tutor.isAvailable,
      category: tutor.category,
      user: tutor.user,
      totalBookings: tutor._count.booking,
      totalReview: tutor._count.review,
      averageRating: tutor.averageRating,
      reviews: tutor.review,
    };
  });

  const total = await prisma.tutorProfile.count({
    where: { AND: allAndConditions },
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
    where: { id: tutorId, isDeleted: false },
    include: {
      category: true,
      user: true,
      _count: {
        select: { booking: true, review: true },
      },
      review: {
        select: { rating: true },
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

  return {
    id: tutor.id,
    bio: tutor.bio,
    hourlyRate: tutor.hourlyRate,
    experience: tutor.experience,
    isAvailable: tutor.isAvailable,
    category: tutor.category,
    user: tutor.user,
    totalBookings: tutor._count.booking,
    totalReview,
    averageRating,
  };
};
const getMyProfile = async (userId: string) => {
  const profile = await prisma.tutorProfile.findFirst({
    where: { userId },
    include: {
      user: true,
      category: true,
      _count: {
        select: { booking: true },
      },
    },
  });

  if (!profile) return null;

  return {
    ...profile,
    totalBookings: profile._count.booking,
  };
};

const updateTutor = async (payload: any, userId: string, tutorId: string) => {
  const tutorProfileData = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
  });

  if (!tutorProfileData) {
    throw new Error("Tutor not found");
  }

  if (tutorProfileData.userId !== userId) {
    throw new Error("You are not allowed to access this part");
  }

  return await prisma.tutorProfile.update({
    where: { id: tutorProfileData.id },
    data: {
      ...payload,
    },
  });
};

const deleteTutor = async (tutorId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
  });

  const existBooking = await prisma.booking.findFirst({
    where: {
      tutorId: tutorId,
    },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  if (tutor.isDeleted) {
    throw new Error("Tutor already deleted");
  }

  if (existBooking) {
    throw new Error("You cann't delete tutor with existing bookings");
  }

  return await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      isAvailable: false,
    },
  });
};
const getStats = async () => {
  const totalTutors = await prisma.tutorProfile.count({
    where: { isDeleted: false },
  });

  const totalStudents = await prisma.user.count({
    where: { role: "STUDENT" },
  });

  const reviews = await prisma.review.findMany({
    select: { rating: true },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const satisfactionPercent = Math.round((avgRating / 5) * 100);

  return { totalTutors, totalStudents, satisfactionPercent };
};

export const tutorService = {
  createTutor,
  getTutor,
  getTutorById,
  getMyProfile,
  updateTutor,
  deleteTutor,
  getStats,
};
