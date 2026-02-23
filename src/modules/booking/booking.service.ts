import { prisma } from "../../lib/prisma";
import { userRole } from "../../middlewares/auth";

const createBooking = async (payload: any, userId: string) => {
  const existTutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      id: payload.tutorId,
    },
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

  if (!existTutorProfile) {
    throw new Error("Tutor profile not exist!!");
  }
  if (existTutorProfile && !existTutorProfile.availablity) {
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

const getBooking = async (
  userId: string,
  role: "STUDENT" | "TUTOR" | "ADMIN",
) => {
  if (role === "STUDENT") {
    return await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: { tutor: true },
    });
  }
  if (role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!tutorProfile) {
      throw new Error("Tutor profile not found so no booking here");
    }
    return await prisma.booking.findMany({
      where: {
        tutorId: tutorProfile.id,
        status:{
          in: ["PENDING", "CONFIRMED", "COMPLETED"]
        }
      },
      include: { user: true },
    });
  }
  throw new Error("Invalid role provided");
};

const getBookingById = async (userId: string, bookingId: string,role:userRole) => {
  if(role === "STUDENT"){
    return await prisma.booking.findFirst({
      where:{
        id:bookingId,
        userId:userId
      }
    })
  }
  if(role === "TUTOR"){
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where:{
        userId:userId
      }
    })
    if(!tutorProfile){
      throw new Error("Tutor profile not found")
    }
    return await prisma.booking.findFirst({
      where:{
        id:bookingId,
        tutorId:tutorProfile.id
      }
    })
  }
};

const cancelBooking = async(payload:any,userId:string,bookingId:string)=>{
  const bookingData = await prisma.booking.findFirst({
    where:{
      id:bookingId,
      userId:userId
    }
  })

  if(!bookingData){
    throw new Error("Booking not found")
  }

  if(bookingData.status !== "PENDING"){
    throw new Error("You can only cancel pending booking")
  }

  return await prisma.booking.update({
    where:{
      id:bookingData.id,
    },
  data:{
    ...payload
  }
  })
}

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
  cancelBooking
};
