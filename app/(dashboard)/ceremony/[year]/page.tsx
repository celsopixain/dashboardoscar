import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const numYear = parseInt(year, 10);
  if (isNaN(numYear)) return {};
  const count = await prisma.academyAward.count({ where: { year: numYear } });
  if (count === 0) return {};
  const title = `Oscar ${numYear}`;
  const description = `Resultados completos da cerimônia do Oscar ${numYear} — ${count} indicações`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function CeremonyPage({ params }: Props) {
  const { year } = await params;
  const numYear = parseInt(year, 10);
  if (isNaN(numYear)) notFound();

  const awards = await prisma.academyAward.findMany({
    where: { year: numYear },
    orderBy: [{ canonicalCategory: "asc" }, { winner: "desc" }],
  });

  if (awards.length === 0) notFound();

  const ceremony = awards[0]?.ceremony;
  const winners = awards.filter((a) => a.winner);

  // Group by canonical category
  const byCategory = new Map<string, typeof awards>();
  for (const a of awards) {
    const cat = a.canonicalCategory ?? a.category ?? "Outros";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(a);
  }

  return (
    <div className="flex flex-col">
      <Header
        title={`Oscar ${numYear}`}
        description={`${ceremony ? `${ceremony}ª Cerimônia · ` : ""}${awards.length} indicações · ${winners.length} vencedores`}
      />

      <div className="flex-1 p-6 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar
        </Link>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{awards.length} indicações</Badge>
          <Badge className="gap-1"><Trophy className="h-2.5 w-2.5" />{winners.length} vencedores</Badge>
          <Badge variant="outline">{byCategory.size} categorias</Badge>
        </div>

        <Separator />

        {/* By category */}
        <div className="space-y-6">
          {Array.from(byCategory.entries()).map(([category, items]) => {
            const winner = items.find((i) => i.winner);
            return (
              <section key={category}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{category}</h3>
                  {winner && (
                    <span className="flex items-center gap-1 text-xs text-chart-1">
                      <Trophy className="h-3 w-3" /> {winner.film ?? winner.nomineeName}
                    </span>
                  )}
                </div>
                <div className="divide-y divide-border rounded-lg border border-border">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/oscars/${item.id}`}
                      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors ${item.winner ? "bg-chart-1/5" : ""}`}
                    >
                      {item.winner
                        ? <Trophy className="h-3.5 w-3.5 shrink-0 text-chart-1" />
                        : <span className="h-3.5 w-3.5 shrink-0" />
                      }
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium line-clamp-1">{item.film ?? "—"}</p>
                        {item.nomineeName && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.nomineeName}</p>
                        )}
                      </div>
                      {item.winner && <Badge className="shrink-0 text-[10px]">Vencedor</Badge>}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
