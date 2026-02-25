import { prisma } from "../../lib/prisma";
const createBooking = async (payload, userId) => {
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
const getBooking = async (payload, userId, role) => {
    let booking = [];
    let totalBooking = 0;
    if (role === "STUDENT") {
        booking = await prisma.booking.findMany({
            where: {
                userId: userId,
            },
            include: {
                tutor: true,
            },
            skip: payload.skip,
            take: payload.limit,
        });
        totalBooking = await prisma.booking.count({
            where: {
                userId: userId,
            },
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
        booking = await prisma.booking.findMany({
            where: {
                tutorId: tutorProfile.id,
                status: {
                    in: ["PENDING", "CONFIRMED", "COMPLETED"],
                },
            },
            include: {
                user: true,
            },
            skip: payload.skip,
            take: payload.limit,
        });
        totalBooking = await prisma.booking.count({
            where: {
                tutorId: tutorProfile.id,
            },
        });
    }
    if (role === "ADMIN") {
        booking = await prisma.booking.findMany({
            include: {
                tutor: true,
                user: true,
            },
            skip: payload.skip,
            take: payload.limit,
        });
        totalBooking = await prisma.booking.count();
    }
    const formattedBookings = booking.map((b) => {
        return {
            id: b.id,
            status: b.status,
            user: b.user,
            tutor: b.tutor,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
        };
    });
    return {
        data: formattedBookings,
        paginations: {
            totalBooking,
            page: payload.page,
            limit: payload.limit,
            totalPage: Math.ceil(totalBooking / payload.limit),
        },
    };
};
const getBookingById = async (userId, bookingId, role) => {
    const existBooking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });
    if (!existBooking) {
        throw new Error("Booking not found");
    }
    if (role === "STUDENT") {
        return await prisma.booking.findFirst({
            where: {
                id: existBooking.id,
                userId: userId,
            },
            include: {
                tutor: true,
            },
        });
    }
    if (role === "TUTOR") {
        const tutorProfile = await prisma.tutorProfile.findUnique({
            where: {
                userId: userId,
            },
        });
        if (!tutorProfile) {
            throw new Error("Tutor profile not found");
        }
        return await prisma.booking.findFirst({
            where: {
                id: existBooking.id,
                tutorId: tutorProfile.id,
            },
            include: {
                user: true,
            },
        });
    }
    if (role === "ADMIN") {
        return await prisma.booking.findUnique({
            where: {
                id: existBooking.id,
            },
            include: {
                tutor: true,
                user: true,
            },
        });
    }
    throw new Error("Invalid role provided");
};
const cancelBooking = async (payload, userId, bookingId) => {
    const bookingData = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            userId: userId,
        },
    });
    if (!bookingData) {
        throw new Error("Booking not found");
    }
    if (bookingData.status !== "PENDING") {
        throw new Error("You can only cancel pending booking");
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
const updateBooking = async (payload, tutorId, bookingId) => {
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
    cancelBooking,
};
//# sourceMappingURL=booking.service.js.map