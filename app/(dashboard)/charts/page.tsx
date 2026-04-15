export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { BarChartTopWinners } from "@/components/charts/BarChartTopWinners";
import { BarChartTopFilms } from "@/components/charts/BarChartTopFilms";
import { LineChartTrend } from "@/components/charts/LineChartTrend";
import { DonutDistribution } from "@/components/charts/DonutDistribution";
import { GotyTimeline } from "@/components/charts/GotyTimeline";
import { BarChartTopStudios } from "@/components/charts/BarChartTopStudios";
import { Separator } from "@/components/ui/separator";

export default function ChartsPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Visualizações"
        description="Gráficos interativos do Oscar e Prêmio do Jogo"
      />

      <div className="flex-1 space-y-8 p-6">
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Oscar
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

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Prêmio do Jogo
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
