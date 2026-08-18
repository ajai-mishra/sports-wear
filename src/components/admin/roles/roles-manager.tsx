"use client";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  type AdminStaffRecord,
  useAdminStaffQuery,
  useUpdateStaffRoleMutation,
} from "@/hooks/use-admin-staff";
import { ApiRequestError } from "@/lib/api-client";
import { UserRole } from "@/types/auth.types";

const ASSIGNABLE_ROLES: readonly UserRole[] = [
  UserRole.INVENTORY_MANAGER,
  UserRole.MARKETING_MANAGER,
  UserRole.SUPPORT_AGENT,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

function formatRoleLabel(role: UserRole): string {
  return role.replaceAll("_", " ");
}

function StaffRoleSelect({ staffMember }: { staffMember: AdminStaffRecord }) {
  const updateMutation = useUpdateStaffRoleMutation();

  async function handleRoleChange(role: UserRole | null) {
    if (!role || role === staffMember.role) return;
    try {
      await updateMutation.mutateAsync({ id: staffMember.id, input: { role } });
      toast.success(`${staffMember.name}'s role updated to ${formatRoleLabel(role)}.`);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      toast.error(message);
    }
  }

  return (
    <Select value={staffMember.role} onValueChange={handleRoleChange} disabled={updateMutation.isPending}>
      <SelectTrigger className="w-full" aria-label={`Change role for ${staffMember.name}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ASSIGNABLE_ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {formatRoleLabel(role)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function RolesManager() {
  const { data: staffMembers, isLoading, isError } = useAdminStaffQuery();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Staff & Roles</h1>
        <p className="text-sm text-muted-foreground">Manage staff accounts and their access level.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading staff...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load staff.</p>}

      {staffMembers && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No staff accounts yet.
                  </TableCell>
                </TableRow>
              )}
              {staffMembers.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell className="font-medium">{staffMember.name}</TableCell>
                  <TableCell className="text-muted-foreground">{staffMember.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{formatRoleLabel(staffMember.role)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-56">
                    <StaffRoleSelect staffMember={staffMember} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
