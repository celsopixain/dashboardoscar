"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FilmItem {
  film: string;
  nominations: number;
  wins: number;
}

export function BarChartTopFilms() {
  const { data, isPending } = useQuery<{ type: string; data: FilmItem[] }>({
    queryKey: ["charts", "top-films"],
    queryFn: () => fetch("/api/charts/top-films?limit=10").then((r) => r.json()),
    staleTime: Infinity,
  });

  if (isPending) return <Skeleton className="h-[320px] w-full rounded-lg" />;
  if (!data) return null;

  const shortened = data.data.map((d) => ({
    ...d,
    label: d.film && d.film.length > 28 ? d.film.slice(0, 26) + "…" : d.film,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Top 10 Filmes Mais Indicados</CardTitle>
        <p className="text-xs text-muted-foreground">Indicações e vitórias por filme</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={shortened}
            layout="vertical"
            margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
              width={150}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v, name) => [v, name === "nominations" ? "Indicações" : "Vitórias"]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.film ?? ""}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            />
            <Legend
              formatter={(v) => (v === "nominations" ? "Indicações" : "Vitórias")}
              wrapperStyle={{ fontSize: "11px" }}
            />
            <Bar dataKey="nominations" fill="var(--chart-2)" radius={[0, 2, 2, 0]} maxBarSize={12} />
            <Bar dataKey="wins" fill="var(--chart-1)" radius={[0, 2, 2, 0]} maxBarSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
