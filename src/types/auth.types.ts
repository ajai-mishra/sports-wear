export enum UserRole {
  CUSTOMER = "CUSTOMER",
  INVENTORY_MANAGER = "INVENTORY_MANAGER",
  MARKETING_MANAGER = "MARKETING_MANAGER",
  SUPPORT_AGENT = "SUPPORT_AGENT",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export const STAFF_ROLES: readonly UserRole[] = [
  UserRole.INVENTORY_MANAGER,
  UserRole.MARKETING_MANAGER,
  UserRole.SUPPORT_AGENT,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  issuedAt: number;
  expiresAt: number;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
