import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trophy, ArrowLeft, Film } from "lucide-react";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const count = await prisma.academyAward.count({
    where: { nomineeName: { equals: decoded, mode: "insensitive" } },
  });
  if (count === 0) return {};
  const wins = await prisma.academyAward.count({
    where: { nomineeName: { equals: decoded, mode: "insensitive" }, winner: true },
  });
  const title = decoded;
  const description = `${wins} vitória${wins !== 1 ? "s" : ""} · ${count} indicação${count !== 1 ? "ões" : ""} no Oscar`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function PersonPage({ params }: Props) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);

  const awards = await prisma.academyAward.findMany({
    where: { nomineeName: { equals: decoded, mode: "insensitive" } },
    orderBy: [{ year: "desc" }, { winner: "desc" }],
  });

  if (awards.length === 0) notFound();

  const wins = awards.filter((a) => a.winner);
  const nominations = awards.length;
  const films = [...new Set(awards.map((a) => a.film).filter(Boolean))];
  const categories = [...new Set(awards.map((a) => a.canonicalCategory).filter(Boolean))];

  // Group by year
  const byYear = new Map<number, typeof awards>();
  for (const a of awards) {
    const y = a.year ?? 0;
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(a);
  }

  return (
    <div className="flex flex-col">
      <Header
        title={decoded}
        description={`${wins.length} vitória${wins.length !== 1 ? "s" : ""} · ${nominations} indicação${nominations !== 1 ? "ões" : ""}`}
      />

      <div className="flex-1 p-6 space-y-6">
        <Link
          href="/oscars"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar
        </Link>

        {/* Stats cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground font-medium">Vitórias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums text-chart-1">{wins.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground font-medium">Indicações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{nominations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground font-medium">Filmes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{films.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
            ))}
          </div>
        )}

        <Separator />

        {/* History by year */}
        <section>
          <h2 className="mb-4 text-sm font-semibold">Histórico</h2>
          <div className="space-y-1">
            {Array.from(byYear.entries())
              .sort(([a], [b]) => b - a)
              .map(([year, items]) => (
                <div key={year}>
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">{year}</p>
                  <div className="divide-y divide-border rounded-lg border border-border mb-3">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/oscars/${item.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors"
                      >
                        {item.winner
                          ? <Trophy className="h-3.5 w-3.5 shrink-0 text-chart-1" />
                          : <Film className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        }
                        <span className="flex-1 text-sm line-clamp-1">{item.film ?? "—"}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                          {item.canonicalCategory}
                        </span>
                        {item.winner && <Badge className="shrink-0 text-[10px]">Vencedor</Badge>}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
