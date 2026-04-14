"use client";

import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ClassItem {
  class: string | null;
  nominations: number;
  wins: number;
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function DonutDistribution() {
  const { data, isPending } = useQuery<{ type: string; data: ClassItem[] }>({
    queryKey: ["charts", "by-class"],
    queryFn: () => fetch("/api/charts/by-class").then((r) => r.json()),
    staleTime: Infinity,
  });

  if (isPending) return <Skeleton className="h-[280px] w-full rounded-lg" />;
  if (!data) return null;

  const chartData = data.data
    .filter((d) => d.class)
    .map((d) => ({ name: d.class!, value: d.nominations, wins: d.wins }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Distribuição por Classe — Oscar</CardTitle>
        <p className="text-xs text-muted-foreground">Acting · Directing · Production e mais</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, _name, props) => [
                `${Number(v).toLocaleString("pt-BR")} indicações · ${props.payload.wins} vitórias`,
                props.payload.name,
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
              wrapperStyle={{ fontSize: "11px" }}
              formatter={(v) => v}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
