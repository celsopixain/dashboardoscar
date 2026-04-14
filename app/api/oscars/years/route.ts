import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rows = await prisma.academyAward.findMany({
    where: { year: { not: null } },
    select: { year: true, ceremony: true },
    distinct: ["year"],
    orderBy: { year: "asc" },
  });

  return NextResponse.json(
    rows.map((r) => ({ year: r.year!, ceremony: r.ceremony }))
  );
}
