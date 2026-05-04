import { z } from 'zod';

const createTutor = z.object({
    body: z.object({
        bio: z.string().optional(),
        hourlyRate: z.number({
            message: 'Hourly rate is required',
        }),
        experience: z.number({
            message: 'Experience is required',
        }),
        categoryId: z.string({
            message: 'Category id is required',
        }),
        userId: z.string({
            message: 'User id is required',
        }),
    }),
});

const updateTutor = z.object({
    body: z.object({
        bio: z.string().optional(),
        hourlyRate: z.number().optional(),
        experience: z.number().optional(),
        isAvailable: z.boolean().optional(),
    }),
});

export const TutorValidation = {
    createTutor,
    updateTutor,
};
