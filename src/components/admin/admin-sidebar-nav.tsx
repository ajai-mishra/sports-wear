"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth.types";

import { ADMIN_NAV_ITEMS } from "./admin-nav-items";

interface AdminSidebarNavProps {
  role: UserRole;
  onNavigate?: () => void;
  className?: string;
}

/** Highlights the current section: exact match for "/admin", prefix match otherwise. */
function isActiveHref(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({ role, onNavigate, className }: AdminSidebarNavProps) {
  const pathname = usePathname();
  const visibleItems = ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Admin sections">
      {visibleItems.map((item) => {
        const isActive = isActiveHref(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
