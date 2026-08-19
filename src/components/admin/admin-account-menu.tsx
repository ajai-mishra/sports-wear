"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccountProfile } from "@/hooks/use-account";
import { useLogoutMutation } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface AdminAccountMenuProps {
  /** SSR-rendered name from the session cookie, shown until the live profile query resolves. */
  name: string;
  className?: string;
}

export function AdminAccountMenu({ name, className }: AdminAccountMenuProps) {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  // The session cookie's `name` is fixed at login time, so it goes stale the
  // moment /admin/profile changes it. useAccountProfile() re-fetches on every
  // profile update (see useUpdateProfileMutation's cache invalidation), so it
  // takes over as soon as it resolves.
  const { data: profile } = useAccountProfile();
  const displayName = profile?.name ?? name;

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    toast.success("Signed out.");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("w-full justify-between", className)}
            aria-label="Admin account menu"
          />
        }
      >
        <span className="flex items-center gap-2 truncate">
          <UserIcon className="size-4 shrink-0" />
          <span className="truncate">{displayName}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem render={<Link href="/admin/profile" />}>
          <UserIcon /> My Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout} disabled={logoutMutation.isPending}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
