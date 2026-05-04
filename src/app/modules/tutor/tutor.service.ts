import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createTutor = async (payload: any) => {
    const result = await prisma.tutorProfile.create({
        data: payload,
    });
    return result;
};

const getTutors = async (paginationOptions: any, filters: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationOptions;
    const { searchTerm, categoryId, minPrice, maxPrice } = filters;

    const andConditions: any[] = [{ isDeleted: false }];

    if (searchTerm) {
        andConditions.push({
            OR: [
                { user: { name: { contains: searchTerm, mode: "insensitive" } } },
                { bio: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }

    if (categoryId) {
        andConditions.push({ categoryId });
    }

    if (minPrice) {
        andConditions.push({ hourlyRate: { gte: Number(minPrice) } });
    }

    if (maxPrice) {
        andConditions.push({ hourlyRate: { lte: Number(maxPrice) } });
    }

    const whereConditions = { AND: andConditions };

    const result = await prisma.tutorProfile.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            user: true,
            category: true,
        },
    });

    const total = await prisma.tutorProfile.count({
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

const getTutorById = async (id: string) => {
    const result = await prisma.tutorProfile.findUnique({
        where: { id, isDeleted: false },
        include: {
            user: true,
            category: true,
            review: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!result) {
        throw new AppError(status.NOT_FOUND, "Tutor not found");
    }
    return result;
};

const getMyProfile = async (userId: string) => {
    const result = await prisma.tutorProfile.findUnique({
        where: { userId, isDeleted: false },
        include: {
            user: true,
            category: true,
        },
    });
    if (!result) {
        throw new AppError(status.NOT_FOUND, "Tutor profile not found");
    }
    return result;
};

const getStats = async () => {
    const totalTutors = await prisma.tutorProfile.count({ where: { isDeleted: false } });
    const totalBookings = await prisma.booking.count();
    const totalCategories = await prisma.category.count();

    return {
        totalTutors,
        totalBookings,
        totalCategories,
    };
};

const updateTutor = async (id: string, payload: any) => {
    const result = await prisma.tutorProfile.update({
        where: { id },
        data: payload,
    });
    return result;
};

const deleteTutor = async (id: string) => {
    const result = await prisma.tutorProfile.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });
    return result;
};

export const tutorService = {
    createTutor,
    getTutors,
    getTutorById,
    getMyProfile,
    getStats,
    updateTutor,
    deleteTutor,
};
