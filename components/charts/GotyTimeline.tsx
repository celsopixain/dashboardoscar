"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

interface GotyItem {
  id: number;
  year: number;
  nominee: string;
  company: string | null;
  voted: string | null;
}

export function GotyTimeline() {
  const { data, isPending } = useQuery<{ type: string; data: GotyItem[] }>({
    queryKey: ["charts", "goty"],
    queryFn: () => fetch("/api/charts/goty").then((r) => r.json()),
    staleTime: Infinity,
  });

  if (isPending) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const sorted = [...data.data].sort((a, b) => b.year - a.year);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Game of the Year — TGA</CardTitle>
        <p className="text-xs text-muted-foreground">Vencedores por edição</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-80 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
            >
              <Trophy className="h-3.5 w-3.5 shrink-0 text-chart-3" />
              <span className="w-10 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                {item.year}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.nominee}</p>
                {item.company && (
                  <p className="truncate text-xs text-muted-foreground">{item.company}</p>
                )}
              </div>
              {item.voted && (
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {item.voted}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
