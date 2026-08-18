"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Bell, LayoutDashboard, MapPin, Menu, Package, RotateCcw, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AccountNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Returns", href: "/account/returns", icon: RotateCcw },
];

function isNavItemActive(pathname: string, href: string): boolean {
  return href === "/account" ? pathname === href : pathname.startsWith(href);
}

function AccountNavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Account">
      {ACCOUNT_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = isNavItemActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AccountLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <PageContainer className="flex flex-1 flex-col gap-6 py-6 lg:flex-row lg:gap-8 lg:py-10">
      <div className="lg:hidden">
        <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger render={<Button variant="outline" size="sm" />}>
            <Menu /> Menu
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-xs">
            <SheetHeader>
              <SheetTitle>My Account</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <AccountNavLinks pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden shrink-0 lg:block lg:w-56">
        <div className="sticky top-24">
          <h2 className="px-3 pb-3 text-lg font-semibold">My Account</h2>
          <AccountNavLinks pathname={pathname} />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </PageContainer>
  );
}
