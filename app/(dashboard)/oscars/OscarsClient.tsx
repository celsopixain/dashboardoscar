"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SearchInput } from "@/components/filters/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface AcademyAward {
  id: number;
  year: number | null;
  ceremony: number | null;
  film: string | null;
  nomineeName: string | null;
  canonicalCategory: string | null;
  class: string | null;
  winner: boolean;
}

interface OscarsResponse {
  data: AcademyAward[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

const CLASSES = ["Acting", "Directing", "Writing", "Production", "Music", "Technical"];

export function OscarsClient() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [name, setName] = useQueryState("name", parseAsString.withDefault(""));
  const [film, setFilm] = useQueryState("film", parseAsString.withDefault(""));
  const [winner, setWinner] = useQueryState("winner", parseAsStringEnum(["true", "false", "all"]).withDefault("all"));
  const [classFilter, setClass] = useQueryState("class", parseAsString.withDefault(""));

  const params = new URLSearchParams({ page: String(page), pageSize: "25" });
  if (name) params.set("name", name);
  if (film) params.set("film", film);
  if (winner !== "all") params.set("winner", winner);
  if (classFilter) params.set("class", classFilter);

  const { data, isPending } = useQuery<OscarsResponse>({
    queryKey: ["oscars", page, name, film, winner, classFilter],
    queryFn: () => fetch(`/api/oscars?${params}`).then((r) => r.json()),
    staleTime: 60_000,
  });

  function handleFilterChange() {
    setPage(1);
  }

  return (
    <div className="flex flex-col">
      <Header title="Oscar" description="Todas as indicações do Academy Awards" />

      <div className="flex-1 p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <SearchInput
            value={name}
            onChange={(v) => { setName(v || null); handleFilterChange(); }}
            placeholder="Buscar pessoa…"
            className="w-44"
          />
          <SearchInput
            value={film}
            onChange={(v) => { setFilm(v || null); handleFilterChange(); }}
            placeholder="Buscar filme…"
            className="w-44"
          />
          <Select
            value={winner}
            onValueChange={(v) => { setWinner(v as "true" | "false" | "all"); handleFilterChange(); }}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Vencedores</SelectItem>
              <SelectItem value="false">Indicados</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={classFilter || "all"}
            onValueChange={(v) => { setClass(v === "all" ? null : v); handleFilterChange(); }}
          >
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as classes</SelectItem>
              {CLASSES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isPending ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : data ? (
          <>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground w-14">Ano</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Filme</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Pessoa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Categoria</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.data.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">{item.year}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/oscars/${item.id}`} className="font-medium hover:underline line-clamp-1">
                          {item.film ?? "—"}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground hidden md:table-cell">
                        {item.nomineeName ? (
                          <Link href={`/person/${encodeURIComponent(item.nomineeName)}`} className="hover:underline line-clamp-1">
                            {item.nomineeName}
                          </Link>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground hidden lg:table-cell line-clamp-1">
                        {item.canonicalCategory ?? "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        {item.winner ? (
                          <Badge className="text-[10px] gap-1">
                            <Trophy className="h-2.5 w-2.5" /> Vencedor
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">Indicado</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              pageSize={data.pagination.pageSize}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
