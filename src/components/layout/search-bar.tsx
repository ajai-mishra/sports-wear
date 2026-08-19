"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    router.push(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={cn("w-full", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search track suits, shoes, equipment..."
          className="h-11 rounded-full border border-border bg-muted pl-11 text-sm shadow-sm focus-visible:border-ring focus-visible:bg-background"
          aria-label="Search products"
        />
      </div>
    </form>
  );
}
