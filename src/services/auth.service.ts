import { MOCK_USERS, type MockUserRecord } from "@/mocks/data/users.data";
import { UserRole, type AuthenticatedUser } from "@/types/auth.types";

export function findUserByEmail(email: string): MockUserRecord | null {
  const normalizedEmail = email.trim().toLowerCase();
  return MOCK_USERS.find((user) => user.email.toLowerCase() === normalizedEmail) ?? null;
}

export function findUserById(userId: string): MockUserRecord | null {
  return MOCK_USERS.find((user) => user.id === userId) ?? null;
}

export function verifyCredentials(email: string, password: string): MockUserRecord | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  if (user.isBlocked) return null;
  return user;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export function createCustomer(input: CreateCustomerInput): MockUserRecord {
  const user: MockUserRecord = {
    id: `user-${Date.now()}`,
    name: input.name,
    email: input.email,
    phone: input.phone,
    password: input.password,
    role: UserRole.CUSTOMER,
    isBlocked: false,
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
  };
  MOCK_USERS.push(user);
  return user;
}

export function toAuthenticatedUser(record: MockUserRecord): AuthenticatedUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
  };
}

export function verifyEmail(userId: string): MockUserRecord | null {
  const user = findUserById(userId);
  if (!user) return null;
  user.isEmailVerified = true;
  return user;
}

export function updatePassword(userId: string, newPassword: string): MockUserRecord | null {
  const user = findUserById(userId);
  if (!user) return null;
  user.password = newPassword;
  return user;
}

export function listCustomers(): MockUserRecord[] {
  return MOCK_USERS.filter((user) => user.role === UserRole.CUSTOMER);
}

export function setUserBlockedStatus(userId: string, isBlocked: boolean): MockUserRecord | null {
  const user = findUserById(userId);
  if (!user) return null;
  user.isBlocked = isBlocked;
  return user;
}

export function updateUserProfile(
  userId: string,
  updates: Partial<Pick<MockUserRecord, "name" | "phone">>,
): MockUserRecord | null {
  const user = findUserById(userId);
  if (!user) return null;
  Object.assign(user, updates);
  return user;
}

export function listStaffUsers(): MockUserRecord[] {
  return MOCK_USERS.filter((user) => user.role !== UserRole.CUSTOMER);
}

export function updateUserRole(userId: string, role: UserRole): MockUserRecord | null {
  const user = findUserById(userId);
  if (!user) return null;
  user.role = role;
  return user;
}

export type SafeUserRecord = Omit<MockUserRecord, "password">;

export function toSafeUserRecord(record: MockUserRecord): SafeUserRecord {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    role: record.role,
    isBlocked: record.isBlocked,
    isEmailVerified: record.isEmailVerified,
    createdAt: record.createdAt,
  };
}
