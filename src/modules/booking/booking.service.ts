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

  //  const existBooking = await prisma.booking.findMany({
  //   where:{
  //       userId:userId,
  //       tutorId:payload.tutorId
  //   }
  //  });
  
  //  if(existBooking && existBooking.status !== 'COMPLETED' && existBooking.status !== "CANCELLED"){
  //    let bookingStatusMessage = "";
  //    if(existBooking.status === "PENDING"){
  //       bookingStatusMessage = "Booking is currently in PENDING stage"
  //    }
  //    else if(existBooking.status === 'CONFIRMED'){
  //       bookingStatusMessage = "Booking is already CONFIRMED"
  //    }
  //    else{
  //       bookingStatusMessage = `Booking is in ${existBooking.status} stage`
  //    }
  //    throw new Error(bookingStatusMessage)
  //  }

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

const getBooking = async () => {
  const result = await prisma.booking.findMany();
  return result;
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
