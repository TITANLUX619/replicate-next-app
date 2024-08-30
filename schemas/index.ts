import { z } from "zod";
import { UserRole } from "@prisma/client";

export const authFormSchema = (type: 'sign-in' | 'sign-up' | '2fa') =>
  z.object({
    // sign up
    firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    address1: type === 'sign-in' ? z.string().optional() : z.string().max(50),
    city: type === 'sign-in' ? z.string().optional() : z.string().max(50),
    postalCode: type === 'sign-in' ? z.string().optional() : z.string().min(3).max(6),
    dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    // both
    email: z.string().email(),
    password: type === 'sign-in' ? z.string() : z.string().min(8),
    // 2FA
    twoFactorCode: type === '2fa' ? z.string() : z.string().optional(),
  });

export const resetPasswordFormSchema =
  z.object({
    email: z.string().email(),
  });

export const newPasswordFormSchema =
  z.object({
    newPassword: z.string().min(8),
  });

export const settingsSchema = z
  .object({
    name: z.string().optional(),
    twoFactorEnabled: z.boolean().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]).optional(),
    email: z.string().optional().refine((value) => {
      return !value || z.string().email().safeParse(value).success;
    }, {
      message: "Please provide a valid email address",
    }),
    password: z.string().optional().refine((value) => {
      return !value || value.length >= 6;
    }, {
      message: "Password must be at least 6 characters long",
    }),
    newPassword: z.string().optional().refine((value) => {
      return !value || value.length >= 6;
    }, {
      message: "New password must be at least 6 characters long",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password && !data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password is required when changing password",
        path: ["newPassword"],
      });
    }

    if (data.newPassword && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current password is required to set a new password",
        path: ["password"],
      });
    }
  });

export const promptFormSchema = z.object({
  prompt: z.string().optional(),
});


