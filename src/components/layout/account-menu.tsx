"use client";

import Link from "next/link";
import { LogOut, MapPin, Package, ShieldCheck, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation, useSession } from "@/hooks/use-auth";
import { STAFF_ROLES } from "@/types/auth.types";

export function AccountMenu() {
  const { data: user, isLoading } = useSession();
  const logoutMutation = useLogoutMutation();

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label="Account menu loading">
        <UserIcon className="size-5" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button variant="ghost" size="sm" render={<Link href="/login" />} nativeButton={false}>
        Sign in
      </Button>
    );
  }

  const isStaff = STAFF_ROLES.includes(user.role);

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    toast.success("Signed out.");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Account menu" />}>
        <UserIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Hi, {user.name.split(" ")[0]}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account" />}>
          <UserIcon /> My Account
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/orders" />}>
          <Package /> Orders
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/addresses" />}>
          <MapPin /> Addresses
        </DropdownMenuItem>
        {isStaff && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <ShieldCheck /> Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
