import { prisma } from "../../lib/prisma";

const createBooking = async (payload: any, userId: string) => {

   const existTutorProfile = await prisma.tutorProfile.findUnique({
    where:{
        id:payload.tutorId
    }
   });

   const activeBookingCount = await prisma.booking.count({
  where: {
    userId: userId,
    tutorId: payload.tutorId,
    status: {
      in: ["PENDING", "CONFIRMED"],
    },
  },
});

if (activeBookingCount > 0) {
  throw new Error("You already have an active booking");
}

   if(!existTutorProfile){
    throw new Error("Tutor profile not exist!!")
   }
   if(existTutorProfile && !existTutorProfile.availablity){
    throw new Error("Tutor not available right now");
   }
  const result = await prisma.booking.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
};

const getBooking = async (userId:string,role:"STUDENT" | "TUTOR" | "ADMIN") => {
  if(role === "STUDENT"){
    return await prisma.booking.findMany({
      where:{
        userId:userId
      },
      include:{tutor:true}
    })
  }
  if(role==="TUTOR"){
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where:{
        userId:userId
      }
    });

    if(!tutorProfile){
      throw new Error("Tutor profile not found so no booking here")
    }
    return await prisma.booking.findMany({
      where:{
        tutorId:tutorProfile.id
      },
      include:{user:true}
    })
  }
   throw new Error("Invalid role provided");
};

const getBookingById = async (bookingId: string) => {
  const result = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  return result;
};

const updateBooking = async (
  payload: any,
  tutorId: string,
  bookingId: string,
) => {
  const existTutorProfile = await prisma.tutorProfile.findFirst({
    where: {
      userId: tutorId,
    },
  });
  if (!existTutorProfile) {
    throw new Error("Tutor profile not found");
  }

  const bookingData = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!bookingData) {
    throw new Error("Booking not found");
  }
  if (bookingData.tutorId !== existTutorProfile.id) {
    throw new Error("You cann't access this part");
  }
   return await prisma.booking.update({
      where: {
        id: bookingData.id,
      },
      data: {
        ...payload,
      },
    });
};

export const bookingService = {
  createBooking,
  getBooking,
  getBookingById,
  updateBooking,
};
