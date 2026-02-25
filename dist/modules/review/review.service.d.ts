import { userRole } from "../../middlewares/auth";
export declare const reviewService: {
    createReview: (payload: any, userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
    getReview: () => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }[]>;
    updateReview: (payload: any, userId: string, reviewId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
    getReviewById: (reviewId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    } | null>;
    deleteReview: (payload: any, userId: string, reviewId: string, role: userRole) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        tutorId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
};
//# sourceMappingURL=review.service.d.ts.map