import { ADDRESSES } from "@/mocks/data/addresses.data";
import type { Address } from "@/types/address.types";

export function listAddressesForUser(userId: string): Address[] {
  return ADDRESSES.filter((address) => address.userId === userId);
}

export function getAddressForUser(addressId: string, userId: string): Address | null {
  return ADDRESSES.find((address) => address.id === addressId && address.userId === userId) ?? null;
}

export type CreateAddressInput = Omit<Address, "id">;

export function createAddress(input: CreateAddressInput): Address {
  if (input.isDefault) {
    for (const address of ADDRESSES) {
      if (address.userId === input.userId) address.isDefault = false;
    }
  }
  const address: Address = { ...input, id: `addr-${Date.now()}` };
  ADDRESSES.push(address);
  return address;
}

export function updateAddress(
  addressId: string,
  userId: string,
  updates: Partial<Omit<Address, "id" | "userId">>,
): Address | null {
  const address = getAddressForUser(addressId, userId);
  if (!address) return null;

  if (updates.isDefault) {
    for (const candidate of ADDRESSES) {
      if (candidate.userId === userId) candidate.isDefault = false;
    }
  }

  Object.assign(address, updates);
  return address;
}

export function deleteAddress(addressId: string, userId: string): boolean {
  const index = ADDRESSES.findIndex(
    (address) => address.id === addressId && address.userId === userId,
  );
  if (index === -1) return false;
  ADDRESSES.splice(index, 1);
  return true;
}
