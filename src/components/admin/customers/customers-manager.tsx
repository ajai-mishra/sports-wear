"use client";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  type AdminCustomerRecord,
  useAdminCustomersQuery,
  useUpdateCustomerBlockedStatusMutation,
} from "@/hooks/use-admin-customers";
import { ApiRequestError } from "@/lib/api-client";

function CustomerBlockSwitch({ customer }: { customer: AdminCustomerRecord }) {
  const updateMutation = useUpdateCustomerBlockedStatusMutation();

  async function handleToggle(checked: boolean) {
    const isBlocked = !checked;
    try {
      await updateMutation.mutateAsync({ id: customer.id, input: { isBlocked } });
      toast.success(isBlocked ? `${customer.name} has been blocked.` : `${customer.name} has been unblocked.`);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      toast.error(message);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={!customer.isBlocked}
        onCheckedChange={handleToggle}
        disabled={updateMutation.isPending}
        aria-label={customer.isBlocked ? `Unblock ${customer.name}` : `Block ${customer.name}`}
      />
      {customer.isBlocked ? (
        <Badge variant="destructive">Blocked</Badge>
      ) : (
        <Badge className="bg-success/10 text-success border-transparent">Active</Badge>
      )}
    </div>
  );
}

export function CustomersManager() {
  const { data: customers, isLoading, isError } = useAdminCustomersQuery();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">View customer accounts and manage their access.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading customers...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load customers.</p>}

      {customers && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No customers yet.
                  </TableCell>
                </TableRow>
              )}
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <CustomerBlockSwitch customer={customer} />
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
