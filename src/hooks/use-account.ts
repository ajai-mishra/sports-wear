"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { AddressInput, UpdateAddressInput } from "@/lib/validation/address.schema";
import type { UpdateProfileInput } from "@/lib/validation/profile.schema";
import type { Address } from "@/types/address.types";
import type { UserRole } from "@/types/auth.types";

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export const ACCOUNT_PROFILE_QUERY_KEY = ["account", "profile"] as const;
export const ACCOUNT_ADDRESSES_QUERY_KEY = ["account", "addresses"] as const;

export function useAccountProfile() {
  return useQuery({
    queryKey: ACCOUNT_PROFILE_QUERY_KEY,
    queryFn: async (): Promise<AccountProfile> => {
      const result = await apiClient.get<{ user: AccountProfile }>("/account/profile");
      return result.user;
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateProfileInput): Promise<AccountProfile> => {
      const result = await apiClient.put<{ user: AccountProfile }>("/account/profile", input);
      return result.user;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(ACCOUNT_PROFILE_QUERY_KEY, updatedProfile);
      queryClient.invalidateQueries({ queryKey: ACCOUNT_PROFILE_QUERY_KEY });
    },
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: ACCOUNT_ADDRESSES_QUERY_KEY,
    queryFn: () => apiClient.get<Address[]>("/account/addresses"),
  });
}

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddressInput) => apiClient.post<Address>("/account/addresses", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_ADDRESSES_QUERY_KEY });
    },
  });
}

export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAddressInput }) =>
      apiClient.put<Address>(`/account/addresses/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_ADDRESSES_QUERY_KEY });
    },
  });
}

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ success: boolean }>(`/account/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_ADDRESSES_QUERY_KEY });
    },
  });
}
