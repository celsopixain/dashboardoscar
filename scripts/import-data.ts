/**
 * Script de importação dos CSVs para o PostgreSQL via Prisma
 * Executar com: npx tsx scripts/import-data.ts
 *
 * Oscar  → data/full_data.csv     (TSV — tab-separated)
 * TGA    → data/the_game_awards.csv (CSV — comma-separated)
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── helpers ────────────────────────────────────────────────────────────────

function parseYear(raw: string | undefined): number | null {
  if (!raw) return null;
  const match = raw.match(/^(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

function parseBoolean(val: string | undefined): boolean {
  if (!val) return false;
  return val.toLowerCase() === "true" || val === "1";
}

function clean(val: string | undefined): string | null {
  if (!val || val.trim() === "") return null;
  return val.trim();
}

// ─── Oscar (TSV) ─────────────────────────────────────────────────────────────

async function importOscars() {
  const filePath = path.join(process.cwd(), "data", "full_data.csv");
  const records: object[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: "\t" }))
      .on("data", (row) => {
        records.push({
          ceremony: row.Ceremony ? parseInt(row.Ceremony, 10) : null,
          year: parseYear(row.Year),
          yearRaw: clean(row.Year),
          class: clean(row.Class),
          canonicalCategory: clean(row.CanonicalCategory),
          category: clean(row.Category),
          nomId: clean(row.NomId),
          film: clean(row.Film),
          filmId: clean(row.FilmId),
          nomineeName: clean(row.Name),
          nomineeIds: clean(row.NomineeIds),
          winner: parseBoolean(row.Winner),
          detail: clean(row.Detail),
          note: clean(row.Note),
          citation: clean(row.Citation),
          multiFilm: parseBoolean(row.MultifilmNomination),
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Oscar: ${records.length} registros lidos. Inserindo...`);

  // Inserir em lotes de 500 para performance
  const BATCH = 500;
  for (let i = 0; i < records.length; i += BATCH) {
    await prisma.academyAward.createMany({
      data: records.slice(i, i + BATCH) as Parameters<
        typeof prisma.academyAward.createMany
      >[0]["data"],
      skipDuplicates: true,
    });
    process.stdout.write(`\r  ${Math.min(i + BATCH, records.length)}/${records.length}`);
  }

  console.log(`\nOscar: importação concluída.`);
}

// ─── The Game Awards (CSV) ────────────────────────────────────────────────────

async function importTGA() {
  const filePath = path.join(process.cwd(), "data", "the_game_awards.csv");
  const records: object[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: "," }))
      .on("data", (row) => {
        records.push({
          year: row.year ? parseInt(row.year, 10) : null,
          category: clean(row.category),
          nominee: clean(row.nominee),
          company: clean(row.company),
          winner: parseBoolean(row.winner),
          voted: clean(row.voted),
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`TGA: ${records.length} registros lidos. Inserindo...`);

  await prisma.gameAward.createMany({
    data: records as Parameters<typeof prisma.gameAward.createMany>[0]["data"],
    skipDuplicates: true,
  });

  console.log(`TGA: importação concluída.`);
}

// ─── Validação ───────────────────────────────────────────────────────────────

async function validate() {
  const [oscarsTotal, oscarsWinners, tgaTotal, tgaWinners] = await Promise.all([
    prisma.academyAward.count(),
    prisma.academyAward.count({ where: { winner: true } }),
    prisma.gameAward.count(),
    prisma.gameAward.count({ where: { winner: true } }),
  ]);

  console.log("\n── Validação ─────────────────────────");
  console.log(`Oscar  → total: ${oscarsTotal} | vencedores: ${oscarsWinners}`);
  console.log(`TGA    → total: ${tgaTotal}    | vencedores: ${tgaWinners}`);
  console.log("──────────────────────────────────────");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Iniciando importação...\n");

  // Limpar tabelas antes de reimportar
  await prisma.academyAward.deleteMany();
  await prisma.gameAward.deleteMany();
  console.log("Tabelas limpas.\n");

  await importOscars();
  await importTGA();
  await validate();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
