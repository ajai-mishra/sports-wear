import { UserRole } from "@/types/auth.types";
import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";

/**
 * Demo accounts for the frontend-only mock stage.
 * Server-only — never import this module from a Client Component.
 * Plaintext passwords are fine here because this data never ships to
 * production; the real NestJS backend will own bcrypt-hashed credentials.
 */
export interface MockUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isBlocked: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export const MOCK_USERS: MockUserRecord[] = getOrCreateGlobalSingleton("users", () => [
  {
    id: "user-customer-1",
    name: "Aarav Sharma",
    email: "customer@example.com",
    phone: "+91 98765 43210",
    password: "Password123!",
    role: UserRole.CUSTOMER,
    isBlocked: false,
    isEmailVerified: true,
    createdAt: "2025-11-02T10:00:00.000Z",
  },
  {
    id: "user-inventory-1",
    name: "Meera Iyer",
    email: "inventory@example.com",
    phone: "+91 98765 00001",
    password: "Password123!",
    role: UserRole.INVENTORY_MANAGER,
    isBlocked: false,
    isEmailVerified: true,
    createdAt: "2025-06-15T10:00:00.000Z",
  },
  {
    id: "user-marketing-1",
    name: "Kabir Malhotra",
    email: "marketing@example.com",
    phone: "+91 98765 00002",
    password: "Password123!",
    role: UserRole.MARKETING_MANAGER,
    isBlocked: false,
    isEmailVerified: true,
    createdAt: "2025-06-15T10:00:00.000Z",
  },
  {
    id: "user-support-1",
    name: "Neha Verma",
    email: "support@example.com",
    phone: "+91 98765 00003",
    password: "Password123!",
    role: UserRole.SUPPORT_AGENT,
    isBlocked: false,
    isEmailVerified: true,
    createdAt: "2025-06-15T10:00:00.000Z",
  },
  {
    id: "user-admin-1",
    name: "Sanjay Kulkarni",
    email: "admin@example.com",
    phone: "+91 98765 00004",
    password: "Password123!",
    role: UserRole.ADMIN,
    isBlocked: false,
    isEmailVerified: true,
    createdAt: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "user-superadmin-1",
    name: "Ajai Mishra",
    email: "superadmin@example.com",
    phone: "+91 98765 00005",
    password: "Password123!",
    role: UserRole.SUPER_ADMIN,
    isBlocked: false,
    isEmailVerified: true,
    createdAt: "2025-01-01T10:00:00.000Z",
  },
]);
