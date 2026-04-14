import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const VALID_TYPES = ["top-winners", "by-decade", "by-class", "top-studios", "goty"] as const;
type ChartType = (typeof VALID_TYPES)[number];

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// ── helpers ──────────────────────────────────────────────────────────────────

async function topWinners(limit: number) {
  // Top nomineeNames com mais vitórias no Oscar (exclui filmes, foca em pessoas)
  const rows = await prisma.academyAward.groupBy({
    by: ["nomineeName"],
    where: {
      winner: true,
      nomineeName: { not: null },
      // Filtra classes de performance (Acting / Directing)
      class: { in: ["Acting", "Directing", "Writing"] },
    },
    _count: { winner: true },
    orderBy: { _count: { winner: "desc" } },
    take: limit,
  });

  return rows.map((r) => ({
    name: r.nomineeName,
    wins: r._count.winner,
  }));
}

async function byDecade() {
  // Indicações Oscar agrupadas por década
  const rows = await prisma.academyAward.findMany({
    where: { year: { not: null } },
    select: { year: true, winner: true },
  });

  const decadeMap = new Map<number, { nominations: number; wins: number }>();

  for (const row of rows) {
    if (!row.year) continue;
    const decade = Math.floor(row.year / 10) * 10;
    const current = decadeMap.get(decade) ?? { nominations: 0, wins: 0 };
    current.nominations += 1;
    if (row.winner) current.wins += 1;
    decadeMap.set(decade, current);
  }

  return Array.from(decadeMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([decade, stats]) => ({
      decade: `${decade}s`,
      decadeYear: decade,
      ...stats,
    }));
}

async function byClass() {
  // Distribuição por classe (Acting / Directing / Production / etc.)
  const rows = await prisma.academyAward.groupBy({
    by: ["class"],
    where: { class: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const winners = await prisma.academyAward.groupBy({
    by: ["class"],
    where: { winner: true, class: { not: null } },
    _count: { id: true },
  });

  const winsMap = new Map(winners.map((w) => [w.class, w._count.id]));

  return rows.map((r) => ({
    class: r.class,
    nominations: r._count.id,
    wins: winsMap.get(r.class ?? "") ?? 0,
  }));
}

async function topStudios(limit: number) {
  // Studios TGA com mais vitórias
  const rows = await prisma.gameAward.groupBy({
    by: ["company"],
    where: { winner: true, company: { not: null } },
    _count: { winner: true },
    orderBy: { _count: { winner: "desc" } },
    take: limit,
  });

  return rows.map((r) => ({
    company: r.company,
    wins: r._count.winner,
  }));
}

async function goty() {
  // Game of the Year vencedores por ano
  const rows = await prisma.gameAward.findMany({
    where: {
      winner: true,
      category: { contains: "Game of the Year", mode: "insensitive" },
    },
    orderBy: { year: "asc" },
    select: { id: true, year: true, nominee: true, company: true, voted: true },
  });

  return rows;
}

// ── handler ───────────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type as ChartType)) {
    return NextResponse.json(
      {
        error: `Tipo inválido. Use: ${VALID_TYPES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const { searchParams } = request.nextUrl;
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { limit } = parsed.data;

  switch (type as ChartType) {
    case "top-winners":
      return NextResponse.json({ type, data: await topWinners(limit) });
    case "by-decade":
      return NextResponse.json({ type, data: await byDecade() });
    case "by-class":
      return NextResponse.json({ type, data: await byClass() });
    case "top-studios":
      return NextResponse.json({ type, data: await topStudios(limit) });
    case "goty":
      return NextResponse.json({ type, data: await goty() });
  }
}
