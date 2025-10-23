import { z } from "zod";

export const GetRepairQuerySchema = z.object({
    car_id: z.string().regex(/\b[0-9]+\b/).optional(),
    mechanic_id: z.string().regex(/\b[0-9]+\b/).optional()
});

export type GetRepairQuery = z.infer<typeof GetRepairQuerySchema>;

export const GetRepairByIdParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type GetRepairByIdParams = z.infer<typeof GetRepairByIdParamsSchema>;

export const CreateRepairBodySchema = z.object({
    car_id: z.string().regex(/\b[0-9]+\b/),
    mechanic_id: z.string().regex(/\b[0-9]+\b/),
    date: z.string().regex(/\b[0-9]{4}.[0-9]{2}.[0-9]{2}\b/),
    time: z.string().regex(/\b[0-9]{1,2}:[0-9]{2}\b/),
    description: z.string().min(1),
    estimated_work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    cost: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    status: z
        .string()
        .transform((val) => (val.trim() === "" ? undefined : val))
        .default("pending"),
});

export type CreateRepairBody = z.infer<typeof CreateRepairBodySchema>;

export const UpdateRepairParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type UpdateRepairParams = z.infer<typeof UpdateRepairParamsSchema>;

export const UpdateRepairBodySchema = z.object({
    car_id: z.string().regex(/\b[0-9]+\b/),
    mechanic_id: z.string().regex(/\b[0-9]+\b/),
    date: z.string().regex(/\b[0-9]{4}.[0-9]{2}.[0-9]{2}\b/),
    time: z.string().regex(/\b[0-9]{1,2}:[0-9]{2}\b/),
    description: z.string().min(1),
    estimated_work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    cost: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    status: z.string().default("pending")
});

export type UpdateRepairBody = z.infer<typeof UpdateRepairBodySchema>;