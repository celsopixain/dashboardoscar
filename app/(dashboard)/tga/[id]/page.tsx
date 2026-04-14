import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trophy, Gamepad2, Building2, CalendarDays, Tag, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return {};
  const award = await prisma.gameAward.findUnique({
    where: { id: numId },
    select: { nominee: true, category: true, year: true, winner: true },
  });
  if (!award) return {};
  const title = award.nominee ?? `Indicação TGA #${id}`;
  const description = `${award.category} · ${award.year}${award.winner ? " · Vencedor" : ""}`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function TgaDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const award = await prisma.gameAward.findUnique({ where: { id: numId } });
  if (!award) notFound();

  // Related: other nominations for this game in same year
  const related = award.nominee
    ? await prisma.gameAward.findMany({
        where: { nominee: award.nominee, id: { not: award.id } },
        orderBy: { year: "desc" },
        take: 10,
      })
    : [];

  return (
    <div className="flex flex-col">
      <Header
        title={award.nominee ?? `Indicação #${award.id}`}
        description={award.category ?? "The Game Awards"}
      />

      <div className="flex-1 p-6 max-w-2xl space-y-6">
        <Link
          href="/tga"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para TGA
        </Link>

        {/* Status banner */}
        <div className={`flex items-center gap-3 rounded-lg border p-4 ${award.winner ? "border-chart-3/30 bg-chart-3/5" : "border-border bg-muted/30"}`}>
          <Trophy className={`h-5 w-5 ${award.winner ? "text-chart-3" : "text-muted-foreground"}`} />
          <div>
            <p className="text-sm font-semibold">{award.winner ? "Vencedor" : "Indicado"}</p>
            <p className="text-xs text-muted-foreground">
              {award.category} · {award.year}
            </p>
          </div>
          {award.voted && <Badge variant="outline" className="ml-auto text-xs">{award.voted}</Badge>}
        </div>

        <Separator />

        <dl className="space-y-3">
          {[
            { label: "Jogo / Indicado", value: award.nominee, icon: <Gamepad2 className="h-3.5 w-3.5" /> },
            { label: "Studio", value: award.company, icon: <Building2 className="h-3.5 w-3.5" /> },
            { label: "Categoria", value: award.category, icon: <Tag className="h-3.5 w-3.5" /> },
            { label: "Ano", value: String(award.year), icon: <CalendarDays className="h-3.5 w-3.5" /> },
            { label: "Votação", value: award.voted },
          ].map(({ label, value, icon }) => {
            if (!value) return null;
            return (
              <div key={label} className="flex gap-3">
                <dt className="flex w-36 shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  {icon} {label}
                </dt>
                <dd className="text-sm">{value}</dd>
              </div>
            );
          })}
        </dl>

        {/* Other nominations for same game */}
        {related.length > 0 && (
          <>
            <Separator />
            <section>
              <h3 className="mb-3 text-sm font-semibold">Outras indicações de &ldquo;{award.nominee}&rdquo;</h3>
              <div className="divide-y divide-border rounded-lg border border-border">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/tga/${r.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors"
                  >
                    {r.winner && <Trophy className="h-3.5 w-3.5 shrink-0 text-chart-3" />}
                    {!r.winner && <span className="h-3.5 w-3.5 shrink-0" />}
                    <span className="text-xs text-muted-foreground tabular-nums w-10 shrink-0">{r.year}</span>
                    <span className="flex-1 text-sm">{r.category}</span>
                    {r.winner && <Badge className="text-[10px]">Vencedor</Badge>}
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
