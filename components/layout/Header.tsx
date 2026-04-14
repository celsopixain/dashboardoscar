import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 pl-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
