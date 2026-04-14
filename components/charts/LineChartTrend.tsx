"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DecadeItem {
  decade: string;
  decadeYear: number;
  nominations: number;
  wins: number;
}

export function LineChartTrend() {
  const { data, isPending } = useQuery<{ type: string; data: DecadeItem[] }>({
    queryKey: ["charts", "by-decade"],
    queryFn: () => fetch("/api/charts/by-decade").then((r) => r.json()),
    staleTime: Infinity,
  });

  if (isPending) return <Skeleton className="h-[280px] w-full rounded-lg" />;
  if (!data) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Indicações por Década — Oscar</CardTitle>
        <p className="text-xs text-muted-foreground">Tendência histórica 1920s–2020s</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.data} margin={{ left: 0, right: 16, top: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="decade"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(v, name) => [
                Number(v).toLocaleString("pt-BR"),
                name === "nominations" ? "Indicações" : "Vitórias",
              ]}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
            />
            <Legend
              formatter={(v) => (v === "nominations" ? "Indicações" : "Vitórias")}
              wrapperStyle={{ fontSize: "11px" }}
            />
            <Line
              type="monotone"
              dataKey="nominations"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--chart-2)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="wins"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--chart-1)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
