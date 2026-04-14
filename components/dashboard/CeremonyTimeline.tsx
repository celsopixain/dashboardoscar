"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger } from "nuqs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OscarItem {
  year: number;
  ceremony: number;
}

const DECADE_COLORS: Record<number, string> = {
  1920: "bg-chart-5",
  1930: "bg-chart-5",
  1940: "bg-chart-4",
  1950: "bg-chart-4",
  1960: "bg-chart-3",
  1970: "bg-chart-3",
  1980: "bg-chart-2",
  1990: "bg-chart-2",
  2000: "bg-chart-1",
  2010: "bg-chart-1",
  2020: "bg-primary",
};

function getDecadeColor(year: number) {
  const decade = Math.floor(year / 10) * 10;
  return DECADE_COLORS[decade] ?? "bg-muted";
}

export function CeremonyTimeline() {
  const [selectedYear, setSelectedYear] = useQueryState("year", parseAsInteger);

  const { data: items, isPending } = useQuery<OscarItem[]>({
    queryKey: ["oscar-years"],
    queryFn: () => fetch("/api/oscars/years").then((r) => r.json()),
    staleTime: Infinity,
  });

  if (isPending) {
    return (
      <div className="flex gap-1 overflow-x-auto pb-2">
        {Array.from({ length: 40 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-10 shrink-0" />
        ))}
      </div>
    );
  }

  if (!items) return null;

  // Group by decade for labels
  const decadeStarts = new Set<number>();
  items.forEach(({ year }) => {
    const decade = Math.floor(year / 10) * 10;
    if (!decadeStarts.has(decade)) decadeStarts.add(decade);
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Cerimônias Oscar</p>
        {selectedYear && (
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setSelectedYear(null)}
          >
            Limpar filtro ({selectedYear})
          </button>
        )}
      </div>

      <div className="flex gap-0.5 overflow-x-auto pb-2 scrollbar-thin">
        {items.map(({ year, ceremony }) => (
          <button
            key={year}
            title={`${year} — Cerimônia ${ceremony}`}
            onClick={() => setSelectedYear(selectedYear === year ? null : year)}
            className={cn(
              "relative flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded text-[10px] font-medium transition-all hover:scale-110 hover:z-10",
              getDecadeColor(year),
              selectedYear === year
                ? "ring-2 ring-ring ring-offset-1 ring-offset-background scale-110 z-10"
                : "opacity-70 hover:opacity-100"
            )}
          >
            <span className="leading-none">{String(year).slice(2)}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 flex-wrap">
        {Array.from(decadeStarts)
          .sort()
          .map((decade) => (
            <span key={decade} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn("h-2 w-2 rounded-sm", getDecadeColor(decade))}
              />
              {decade}s
            </span>
          ))}
      </div>
    </div>
  );
}
