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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StudioItem {
  company: string | null;
  wins: number;
}

export function BarChartTopStudios() {
  const { data, isPending } = useQuery<{ type: string; data: StudioItem[] }>({
    queryKey: ["charts", "top-studios"],
    queryFn: () => fetch("/api/charts/top-studios?limit=10").then((r) => r.json()),
    staleTime: Infinity,
  });

  if (isPending) return <Skeleton className="h-[280px] w-full rounded-lg" />;
  if (!data) return null;

  const chartData = data.data
    .filter((d) => d.company)
    .map((d) => ({
      company: d.company!.length > 24 ? d.company!.slice(0, 22) + "…" : d.company!,
      fullName: d.company!,
      wins: d.wins,
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Top Studios — The Game Awards</CardTitle>
        <p className="text-xs text-muted-foreground">Studios com mais vitórias</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
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
              dataKey="company"
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
              width={140}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => [v, "Vitórias"]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            />
            <Bar dataKey="wins" fill="var(--chart-3)" radius={[0, 4, 4, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
