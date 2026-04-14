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
  winner: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  nominee: z.string().optional(),
  company: z.string().optional(),
  voted: z.string().optional(),
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

  const { page, pageSize, year, yearFrom, yearTo, category, winner, nominee, company, voted } =
    parsed.data;

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
      category: { contains: category, mode: "insensitive" as const },
    }),
    ...(winner !== undefined && { winner }),
    ...(nominee && {
      nominee: { contains: nominee, mode: "insensitive" as const },
    }),
    ...(company && {
      company: { contains: company, mode: "insensitive" as const },
    }),
    ...(voted && { voted: { contains: voted, mode: "insensitive" as const } }),
  };

  const [total, data] = await Promise.all([
    prisma.gameAward.count({ where }),
    prisma.gameAward.findMany({
      where,
      orderBy: [{ year: "desc" }],
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
