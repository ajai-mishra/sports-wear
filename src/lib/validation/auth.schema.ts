import { z } from "zod";

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(10, "Enter a valid phone number."),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[0-9]/, "Password must include a number."),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email(),
  otp: z.string().length(6, "Enter the 6-digit code."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email(),
  otp: z.string().length(6, "Enter the 6-digit code."),
  newPassword: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[0-9]/, "Password must include a number."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
