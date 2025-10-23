import { z } from "zod";

export const createUserBodySchema = z.object({
    login: z.string().min(3).max(30),
    role: z.string().min(1).max(30)
});

export type createUserBody = z.infer<typeof createUserBodySchema>;

export const loginBodySchema = z.object({
    login: z.string().min(3).max(30),
    password: z.string().min(1).max(50)
});

export type loginBody = z.infer<typeof loginBodySchema>;

export const changePasswordBodySchema = z.object({
    oldPassword: z.string().max(50),
    newPassword: z.string().min(3).max(50),
    confirmPassword: z.string().min(3).max(50)
});

export type changePasswordBody = z.infer<typeof changePasswordBodySchema>;