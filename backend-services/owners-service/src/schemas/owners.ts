import { z } from "zod";

export const GetOwnerByIdParamsSchema = z.object({
    id: z.string()
});

export type GetOwnerByIdParams = z.infer<typeof GetOwnerByIdParamsSchema>;

export const GetOwnersCarsParamsSchema = z.object({
    id: z.string()
});

export type GetOwnersCarsParams = z.infer<typeof GetOwnersCarsParamsSchema>;

export const CreateOwnerBodySchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/).or(z.string().length(0)).optional(),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    address: z.string().min(5).max(100).optional()
});

export type CreateOwnerBody = z.infer<typeof CreateOwnerBodySchema>;

export const UpdateOwnerParamsSchema = z.object({
    id: z.string()
});

export type UpdateOwnerParams = z.infer<typeof UpdateOwnerParamsSchema>;

export const UpdateOwnerBodySchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/).or(z.string().length(0)).optional(),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    address: z.string().min(5).max(100).optional()
});

export type UpdateOwnerBody = z.infer<typeof UpdateOwnerBodySchema>;