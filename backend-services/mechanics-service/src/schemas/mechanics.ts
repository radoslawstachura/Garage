import { z } from "zod";

export const GetMechanicByIdParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type GetMechanicByIdParams = z.infer<typeof GetMechanicByIdParamsSchema>;

export const CreateMechanicBodySchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    specialization: z.string().min(1).max(50),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/)
});

export type CreateMechanicBody = z.infer<typeof CreateMechanicBodySchema>;

export const GetMechanicsRepairsParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type GetMechanicsRepairsParams = z.infer<typeof GetMechanicsRepairsParamsSchema>;

export const UpdateMechanicParamsSchema = z.object({
    id: z.string().regex(/\b[0-9]+\b/)
});

export type UpdateMechanicParams = z.infer<typeof UpdateMechanicParamsSchema>;

export const UpdateMechanicBodySchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    specialization: z.string().min(1).max(50),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/)
});

export type UpdateMechanicBody = z.infer<typeof UpdateMechanicBodySchema>;