"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AddressFormDialog } from "@/components/account/address-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses, useDeleteAddressMutation, useUpdateAddressMutation } from "@/hooks/use-account";
import { ApiRequestError } from "@/lib/api-client";
import type { Address } from "@/types/address.types";

export default function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const updateAddressMutation = useUpdateAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

  function openCreateDialog() {
    setEditingAddress(null);
    setFormOpen(true);
  }

  function openEditDialog(address: Address) {
    setEditingAddress(address);
    setFormOpen(true);
  }

  async function handleSetDefault(address: Address) {
    try {
      await updateAddressMutation.mutateAsync({ id: address.id, input: { isDefault: true } });
      toast.success("Default address updated.");
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingAddress) return;
    try {
      await deleteAddressMutation.mutateAsync(deletingAddress.id);
      toast.success("Address removed.");
      setDeletingAddress(null);
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Addresses</h1>
        <Button size="sm" onClick={openCreateDialog}>
          <Plus /> Add address
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Add an address to speed up checkout."
          action={
            <Button onClick={openCreateDialog}>
              <Plus /> Add address
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm">
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-muted-foreground">{address.phone}</p>
                  </div>
                  {address.isDefault && <Badge>Default</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(address)}>
                    <Pencil /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeletingAddress(address)}>
                    <Trash2 /> Delete
                  </Button>
                  {!address.isDefault && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetDefault(address)}
                      disabled={updateAddressMutation.isPending}
                    >
                      <Star /> Set as default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddressFormDialog open={isFormOpen} onOpenChange={setFormOpen} address={editingAddress} />

      <Dialog open={!!deletingAddress} onOpenChange={(open) => !open && setDeletingAddress(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete address?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove this address from your account.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingAddress(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteAddressMutation.isPending}
            >
              {deleteAddressMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
