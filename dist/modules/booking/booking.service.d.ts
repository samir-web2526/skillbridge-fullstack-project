import { userRole } from "../../middlewares/auth";
export declare const bookingService: {
    createBooking: (payload: any, userId: string) => Promise<{
        date: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
    }>;
    getBooking: (payload: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string | undefined;
        sortOrder: string | undefined;
    }, userId: string, role: "STUDENT" | "TUTOR" | "ADMIN") => Promise<{
        data: {
            id: any;
            status: any;
            user: any;
            tutor: any;
            createdAt: any;
            updatedAt: any;
        }[];
        paginations: {
            totalBooking: number;
            page: number;
            limit: number;
            totalPage: number;
        };
    }>;
    getBookingById: (userId: string, bookingId: string, role: userRole) => Promise<({
        tutor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            bio: string | null;
            hourlyRate: number;
            experience: number;
            availablity: boolean;
            categoryId: string;
        };
    } & {
        date: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
    }) | ({
        user: {
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.UserStatus;
            phone: string | null;
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string | null;
            emailVerified: boolean;
        };
    } & {
        date: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
    }) | null>;
    updateBooking: (payload: any, tutorId: string, bookingId: string) => Promise<{
        date: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
    }>;
    cancelBooking: (payload: any, userId: string, bookingId: string) => Promise<{
        date: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
    }>;
};
//# sourceMappingURL=booking.service.d.ts.map