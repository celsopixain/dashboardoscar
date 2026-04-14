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

interface WinnerItem {
  name: string;
  wins: number;
}

export function BarChartTopWinners() {
  const { data, isPending } = useQuery<{ type: string; data: WinnerItem[] }>({
    queryKey: ["charts", "top-winners"],
    queryFn: () => fetch("/api/charts/top-winners?limit=10").then((r) => r.json()),
    staleTime: Infinity,
  });

  if (isPending) return <Skeleton className="h-[320px] w-full rounded-lg" />;
  if (!data) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Top 10 Vencedores — Oscar</CardTitle>
        <p className="text-xs text-muted-foreground">Atuação, Direção e Roteiro</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.data}
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
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
              width={130}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => [v, "Vitórias"]}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            />
            <Bar dataKey="wins" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
