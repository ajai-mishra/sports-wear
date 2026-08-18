"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { UserRole } from "@/types/auth.types";

import { AdminSidebarNav } from "./admin-sidebar-nav";

export function AdminMobileNav({ role }: { role: UserRole }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="icon"
        aria-label="Open admin navigation"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </Button>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Admin Panel</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <AdminSidebarNav role={role} onNavigate={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
