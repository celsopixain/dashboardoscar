import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [
    oscarsTotal,
    oscarsWinners,
    oscarsCeremonies,
    oscarsFilms,
    oscarsPersons,
    oscarsCategories,
    oscarsYearRange,
    tgaTotal,
    tgaWinners,
    tgaEditions,
    tgaCategories,
    tgaCompanies,
  ] = await Promise.all([
    prisma.academyAward.count(),
    prisma.academyAward.count({ where: { winner: true } }),
    prisma.academyAward.findMany({
      where: { ceremony: { not: null } },
      select: { ceremony: true },
      distinct: ["ceremony"],
    }),
    prisma.academyAward.findMany({
      where: { film: { not: null } },
      select: { film: true },
      distinct: ["film"],
    }),
    prisma.academyAward.findMany({
      where: { nomineeName: { not: null } },
      select: { nomineeName: true },
      distinct: ["nomineeName"],
    }),
    prisma.academyAward.findMany({
      where: { canonicalCategory: { not: null } },
      select: { canonicalCategory: true },
      distinct: ["canonicalCategory"],
    }),
    prisma.academyAward.aggregate({
      _min: { year: true },
      _max: { year: true },
    }),
    prisma.gameAward.count(),
    prisma.gameAward.count({ where: { winner: true } }),
    prisma.gameAward.findMany({
      where: { year: { not: null } },
      select: { year: true },
      distinct: ["year"],
    }),
    prisma.gameAward.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }),
    prisma.gameAward.findMany({
      where: { company: { not: null } },
      select: { company: true },
      distinct: ["company"],
    }),
  ]);

  return NextResponse.json({
    oscar: {
      total: oscarsTotal,
      winners: oscarsWinners,
      ceremonies: oscarsCeremonies.length,
      films: oscarsFilms.length,
      persons: oscarsPersons.length,
      categories: oscarsCategories.length,
      yearRange: {
        from: oscarsYearRange._min.year,
        to: oscarsYearRange._max.year,
      },
    },
    tga: {
      total: tgaTotal,
      winners: tgaWinners,
      editions: tgaEditions.length,
      categories: tgaCategories.length,
      companies: tgaCompanies.length,
    },
  });
}
