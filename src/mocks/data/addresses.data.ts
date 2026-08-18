import type { Address } from "@/types/address.types";
import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";

export const ADDRESSES: Address[] = getOrCreateGlobalSingleton("addresses", () => [
  {
    id: "addr-1",
    userId: "user-customer-1",
    fullName: "Aarav Sharma",
    phone: "+91 98765 43210",
    line1: "402, Sunrise Apartments",
    line2: "MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
    isDefault: true,
  },
  {
    id: "addr-2",
    userId: "user-customer-1",
    fullName: "Aarav Sharma",
    phone: "+91 98765 43210",
    line1: "14 Green Park Extension",
    line2: null,
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110016",
    country: "India",
    isDefault: false,
  },
]);
