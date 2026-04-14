import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CeremonyTimeline } from "@/components/dashboard/CeremonyTimeline";
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
            <CeremonyTimeline />
          </div>
        </section>

        {/* Placeholder para gráficos — Fase 4 */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Visualizações
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Top 10 Vencedores — em breve
            </div>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Indicações por Década — em breve
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
