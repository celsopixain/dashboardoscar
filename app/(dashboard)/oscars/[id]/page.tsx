import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trophy, Film, User, CalendarDays, Tag, ArrowLeft } from "lucide-react";
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
  const award = await prisma.academyAward.findUnique({
    where: { id: numId },
    select: { film: true, nomineeName: true, canonicalCategory: true, year: true, winner: true },
  });
  if (!award) return {};
  const title = award.film ?? award.nomineeName ?? `Indicação #${id}`;
  const description = `${award.canonicalCategory ?? "Oscar"} · ${award.year}${award.winner ? " · Vencedor" : ""}`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function OscarDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const award = await prisma.academyAward.findUnique({ where: { id: numId } });
  if (!award) notFound();

  const rows: { label: string; value: string | null | undefined; icon?: ReactNode; href?: string }[] = [
    { label: "Filme", value: award.film, icon: <Film className="h-3.5 w-3.5" /> },
    { label: "Pessoa", value: award.nomineeName, icon: <User className="h-3.5 w-3.5" />, href: award.nomineeName ? `/person/${encodeURIComponent(award.nomineeName)}` : undefined },
    { label: "Ano", value: award.year ? String(award.year) : null, icon: <CalendarDays className="h-3.5 w-3.5" /> },
    { label: "Cerimônia", value: award.ceremony ? `${award.ceremony}ª Cerimônia` : null, href: award.year ? `/ceremony/${award.year}` : undefined },
    { label: "Categoria", value: award.canonicalCategory, icon: <Tag className="h-3.5 w-3.5" /> },
    { label: "Categoria Completa", value: award.category },
    { label: "Classe", value: award.class },
    { label: "Detalhe", value: award.detail },
    { label: "Nota", value: award.note },
    { label: "Citação", value: award.citation },
  ];

  return (
    <div className="flex flex-col">
      <Header
        title={award.film ?? award.nomineeName ?? `Indicação #${award.id}`}
        description={award.canonicalCategory ?? "Academy Awards"}
      />

      <div className="flex-1 p-6 max-w-2xl space-y-6">
        <Link
          href="/oscars"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para Oscar
        </Link>

        {/* Status banner */}
        <div className={`flex items-center gap-3 rounded-lg border p-4 ${award.winner ? "border-chart-1/30 bg-chart-1/5" : "border-border bg-muted/30"}`}>
          <Trophy className={`h-5 w-5 ${award.winner ? "text-chart-1" : "text-muted-foreground"}`} />
          <div>
            <p className="text-sm font-semibold">{award.winner ? "Vencedor" : "Indicado"}</p>
            <p className="text-xs text-muted-foreground">
              {award.canonicalCategory} · {award.year}
            </p>
          </div>
          {award.winner && <Badge className="ml-auto">Oscar</Badge>}
        </div>

        <Separator />

        {/* Details grid */}
        <dl className="space-y-3">
          {rows.map(({ label, value, icon, href }) => {
            if (!value) return null;
            return (
              <div key={label} className="flex gap-3">
                <dt className="flex w-36 shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  {icon} {label}
                </dt>
                <dd className="text-sm text-foreground">
                  {href ? (
                    <Link href={href} className="hover:underline text-primary">
                      {value}
                    </Link>
                  ) : value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
