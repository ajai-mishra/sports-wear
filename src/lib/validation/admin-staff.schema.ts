import { z } from "zod";

import { UserRole } from "@/types/auth.types";

export const updateStaffRoleSchema = z.object({
  role: z.enum(UserRole),
});

export type UpdateStaffRoleInput = z.infer<typeof updateStaffRoleSchema>;
