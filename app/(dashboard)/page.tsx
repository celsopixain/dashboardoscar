import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CeremonyTimeline } from "@/components/dashboard/CeremonyTimeline";
import { BarChartTopWinners } from "@/components/charts/BarChartTopWinners";
import { BarChartTopFilms } from "@/components/charts/BarChartTopFilms";
import { LineChartTrend } from "@/components/charts/LineChartTrend";
import { DonutDistribution } from "@/components/charts/DonutDistribution";
import { GotyTimeline } from "@/components/charts/GotyTimeline";
import { BarChartTopStudios } from "@/components/charts/BarChartTopStudios";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Awards Analytics Dashboard"
        description="Histórico completo do Oscar e The Game Awards"
      />

      <div className="flex-1 space-y-8 p-6">
        {/* Stats macro */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Visão Geral
          </h2>
          <StatsCards />
        </section>

        <Separator />

        {/* Timeline */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Linha do Tempo — Oscar
          </h2>
          <div className="rounded-lg border border-border bg-card p-5">
            <Suspense>
              <CeremonyTimeline />
            </Suspense>
          </div>
        </section>

        <Separator />

        {/* Oscar charts */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Visualizações — Oscar
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <BarChartTopWinners />
            <BarChartTopFilms />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <LineChartTrend />
            <DonutDistribution />
          </div>
        </section>

        <Separator />

        {/* TGA charts */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Visualizações — The Game Awards
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <GotyTimeline />
            <BarChartTopStudios />
          </div>
        </section>
      </div>
    </div>
  );
}
