"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { LoginInput, SignupInput, VerifyOtpInput } from "@/lib/validation/auth.schema";
import type { AuthenticatedUser } from "@/types/auth.types";

export const SESSION_QUERY_KEY = ["session"] as const;

export function useSession() {
  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async (): Promise<AuthenticatedUser | null> => {
      try {
        const result = await apiClient.get<{ user: AuthenticatedUser }>("/auth/me");
        return result.user;
      } catch {
        return null;
      }
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => apiClient.post<{ user: AuthenticatedUser }>("/auth/login", input),
    onSuccess: (data) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, data.user);
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (input: SignupInput) =>
      apiClient.post<{ message: string; email: string }>("/auth/signup", input),
  });
}

export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerifyOtpInput) =>
      apiClient.post<{ user: AuthenticatedUser }>("/auth/verify-otp", input),
    onSuccess: (data) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, data.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => apiClient.post<{ message: string }>("/auth/forgot-password", { email }),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (input: { email: string; otp: string; newPassword: string }) =>
      apiClient.post<{ message: string }>("/auth/reset-password", input),
  });
}
