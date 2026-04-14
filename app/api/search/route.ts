import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const querySchema = z.object({
  q: z.string().min(1, "Query obrigatória"),
  type: z.enum(["oscar", "tga", "all"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { q, type, page, pageSize } = parsed.data;
  const skip = (page - 1) * pageSize;
  const contains = q;
  const mode = "insensitive" as const;

  const oscarWhere = {
    OR: [
      { film: { contains, mode } },
      { nomineeName: { contains, mode } },
      { category: { contains, mode } },
      { canonicalCategory: { contains, mode } },
      { detail: { contains, mode } },
    ],
  };

  const tgaWhere = {
    OR: [
      { nominee: { contains, mode } },
      { company: { contains, mode } },
      { category: { contains, mode } },
    ],
  };

  const results: {
    oscar?: { data: unknown[]; total: number };
    tga?: { data: unknown[]; total: number };
  } = {};

  if (type === "oscar" || type === "all") {
    const [total, data] = await Promise.all([
      prisma.academyAward.count({ where: oscarWhere }),
      prisma.academyAward.findMany({
        where: oscarWhere,
        orderBy: { year: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          year: true,
          ceremony: true,
          film: true,
          nomineeName: true,
          canonicalCategory: true,
          category: true,
          winner: true,
          class: true,
        },
      }),
    ]);
    results.oscar = { data, total };
  }

  if (type === "tga" || type === "all") {
    const [total, data] = await Promise.all([
      prisma.gameAward.count({ where: tgaWhere }),
      prisma.gameAward.findMany({
        where: tgaWhere,
        orderBy: { year: "desc" },
        skip,
        take: pageSize,
      }),
    ]);
    results.tga = { data, total };
  }

  return NextResponse.json({
    query: q,
    type,
    page,
    pageSize,
    results,
  });
}
