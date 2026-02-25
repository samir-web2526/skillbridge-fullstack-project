export declare const tutorService: {
    createTutor: (payload: any, userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
        hourlyRate: number;
        experience: number;
        availablity: boolean;
        categoryId: string;
    }>;
    getTutor: (payload: {
        search?: string;
        page: number;
        limit: number;
        skip: number;
        sortBy?: string;
        sortOrder?: string;
    }) => Promise<{
        data: {
            id: any;
            bio: any;
            category: any;
            user: any;
            totalBookings: any;
            totalReview: any;
            averageRating: number;
        }[];
        paginations: {
            total: number;
            page: number;
            limit: number;
            totalPage: number;
        };
    }>;
    getTutorById: (tutorId: string) => Promise<{
        id: string;
        bio: string | null;
        category: {
            id: string;
            name: string;
        };
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
        totalBookings: number;
        totalReview: number;
        averageRating: number;
    }>;
    updateTutor: (payload: any, userId: string, tutorId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
        hourlyRate: number;
        experience: number;
        availablity: boolean;
        categoryId: string;
    }>;
    deleteTutor: (tutorId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
        hourlyRate: number;
        experience: number;
        availablity: boolean;
        categoryId: string;
    }>;
};
//# sourceMappingURL=tutor.service.d.ts.map