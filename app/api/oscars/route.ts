import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  year: z.coerce.number().int().optional(),
  yearFrom: z.coerce.number().int().optional(),
  yearTo: z.coerce.number().int().optional(),
  category: z.string().optional(),
  class: z.string().optional(),
  winner: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  film: z.string().optional(),
  name: z.string().optional(),
  ceremony: z.coerce.number().int().optional(),
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

  const { page, pageSize, year, yearFrom, yearTo, category, winner, film, name, ceremony } =
    parsed.data;
  const classFilter = parsed.data.class;

  const where = {
    ...(year && { year }),
    ...(yearFrom || yearTo
      ? {
          year: {
            ...(yearFrom && { gte: yearFrom }),
            ...(yearTo && { lte: yearTo }),
          },
        }
      : {}),
    ...(category && {
      canonicalCategory: { contains: category, mode: "insensitive" as const },
    }),
    ...(classFilter && {
      class: { contains: classFilter, mode: "insensitive" as const },
    }),
    ...(winner !== undefined && { winner }),
    ...(film && { film: { contains: film, mode: "insensitive" as const } }),
    ...(name && {
      nomineeName: { contains: name, mode: "insensitive" as const },
    }),
    ...(ceremony && { ceremony }),
  };

  const [total, data] = await Promise.all([
    prisma.academyAward.count({ where }),
    prisma.academyAward.findMany({
      where,
      orderBy: [{ year: "desc" }, { ceremony: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}
