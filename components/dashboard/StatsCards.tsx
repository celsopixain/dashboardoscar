"use client";

import { useQuery } from "@tanstack/react-query";
import { Film, Trophy, Gamepad2, Users, Clapperboard, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  oscar: {
    total: number;
    winners: number;
    ceremonies: number;
    films: number;
    persons: number;
    categories: number;
    yearRange: { from: number; to: number };
  };
  tga: {
    total: number;
    winners: number;
    editions: number;
    categories: number;
    companies: number;
  };
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <Card className={accent ? "border-primary/30 bg-primary/5" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">
          {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
        </div>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="mt-1 h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { data, isPending } = useQuery<StatsData>({
    queryKey: ["stats"],
    queryFn: () => fetch("/api/stats").then((r) => r.json()),
  });

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    {
      title: "Indicações Oscar",
      value: data.oscar.total,
      sub: `${data.oscar.yearRange.from}–${data.oscar.yearRange.to}`,
      icon: Film,
    },
    {
      title: "Vencedores Oscar",
      value: data.oscar.winners,
      sub: `${data.oscar.ceremonies} cerimônias`,
      icon: Trophy,
      accent: true,
    },
    {
      title: "Filmes Únicos",
      value: data.oscar.films,
      sub: `${data.oscar.categories} categorias`,
      icon: Clapperboard,
    },
    {
      title: "Pessoas",
      value: data.oscar.persons,
      sub: "atores, diretores e mais",
      icon: Users,
    },
    {
      title: "Indicações TGA",
      value: data.tga.total,
      sub: `${data.tga.editions} edições`,
      icon: Gamepad2,
    },
    {
      title: "Vencedores TGA",
      value: data.tga.winners,
      sub: `${data.tga.companies} estúdios`,
      icon: Trophy,
      accent: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
