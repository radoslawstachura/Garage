import { z } from "zod";

export const GetCarQuerySchema = z.object({
    owner_id: z.string().regex(/\b[0-9]+\b/).optional(),
    vin: z.string().length(17).optional(),
    r_number: z.string().optional()
});

export type GetCarQuery = z.infer<typeof GetCarQuerySchema>;

export const GetCarByIdParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type GetCarByIdParams = z.infer<typeof GetCarByIdParamsSchema>;

export const GetCarsRepairsParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type GetCarsRepairsParams = z.infer<typeof GetCarsRepairsParamsSchema>;

export const CreateCarBodySchema = z.object({
    registration_number: z.string().min(5).max(15),
    brand: z.string().min(1).max(30),
    model: z.string().min(1).max(30),
    production_year: z.number().int().min(1900),
    mileage: z.number().int(),
    owner_id: z.number(),
    vin: z.string().length(17).or(z.string().length(0)).optional()
});

export type CreateCarBody = z.infer<typeof CreateCarBodySchema>;

export const UpdateCarParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type UpdateCarParams = z.infer<typeof UpdateCarParamsSchema>;

export const UpdateCarBodySchema = z.object({
    registration_number: z.string().min(5).max(15),
    brand: z.string().min(1).max(30),
    model: z.string().min(1).max(30),
    production_year: z.number().int().min(1900),
    mileage: z.number().int(),
    owner_id: z.number(),
    vin: z.string().length(17).or(z.string().length(0)).optional()
});

export type UpdateCarBody = z.infer<typeof UpdateCarBodySchema>;

export const DeleteCarParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type DeleteCarParams = z.infer<typeof DeleteCarParamsSchema>;