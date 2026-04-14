"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useUIStore } from "@/lib/stores/ui";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const openSidebar = useUIStore((s) => s.openSidebar);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={openSidebar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 pl-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
