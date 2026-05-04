import { BookingStatus, Role } from "../../../generated";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createBooking = async (payload: any, userId: string) => {
  const result = await prisma.booking.create({
    data: {
      ...payload,
      userId,
      date: new Date(payload.date),
      status: BookingStatus.PENDING,
    },
  });
  return result;
};

const getBooking = async (
  paginationOptions: any,
  userId: string,
  role: Role,
) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationOptions;

  const whereConditions: any = {};
  if (role !== Role.ADMIN) {
    if (role === Role.TUTOR) {
        const tutor = await prisma.tutorProfile.findUnique({
            where: { userId }
        });
        if (!tutor) {
            throw new AppError(status.NOT_FOUND, "Tutor profile not found");
        }
        whereConditions.tutorId = tutor.id;
    } else {
        whereConditions.userId = userId;
    }
  }

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: true,
      tutor: {
        include: {
          user: true,
        },
      },
    },
  });

  const total = await prisma.booking.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getBookingById = async (userId: string, bookingId: string, role: Role) => {
  const result = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      tutor: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  // Permission check
  if (role === Role.STUDENT && result.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "Unauthorized access");
  }

  return result;
};

const updateBooking = async (payload: any, userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  if (booking.tutor.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "Only the assigned tutor can update this booking");
  }

  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: payload,
  });

  return result;
};

const cancelBooking = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  if (booking.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "Only the user who booked can cancel it");
  }

  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELLED,
    },
  });

  return result;
};

export const bookingService = {
  createBooking,
  getBooking,
  getBookingById,
  updateBooking,
  cancelBooking,
};
