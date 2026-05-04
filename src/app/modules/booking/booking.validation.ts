import { z } from 'zod';

const createBooking = z.object({
    body: z.object({
        tutorId: z.string({
            message: 'Tutor id is required',
        }),
        date: z.string({
            message: 'Date is required',
        }),
    }),
});

const updateBooking = z.object({
    body: z.object({
        status: z.string().optional(),
    }),
});

export const BookingValidation = {
    createBooking,
    updateBooking,
};
