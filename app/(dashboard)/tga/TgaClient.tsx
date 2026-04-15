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

interface GameAward {
  id: number;
  year: number;
  category: string;
  nominee: string | null;
  company: string | null;
  winner: boolean;
  voted: string | null;
}

interface TgaResponse {
  data: GameAward[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export function TgaClient() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [nominee, setNominee] = useQueryState("nominee", parseAsString.withDefault(""));
  const [company, setCompany] = useQueryState("company", parseAsString.withDefault(""));
  const [winner, setWinner] = useQueryState("winner", parseAsStringEnum(["true", "false", "all"]).withDefault("all"));

  const params = new URLSearchParams({ page: String(page), pageSize: "25" });
  if (nominee) params.set("nominee", nominee);
  if (company) params.set("company", company);
  if (winner !== "all") params.set("winner", winner);

  const { data, isPending } = useQuery<TgaResponse>({
    queryKey: ["tga", page, nominee, company, winner],
    queryFn: () => fetch(`/api/tga?${params}`).then((r) => r.json()),
    staleTime: 60_000,
  });

  function handleFilterChange() {
    setPage(1);
  }

  return (
    <div className="flex flex-col">
      <Header title="Prêmio do Jogo" description="Todas as indicações do Prêmio do Jogo" />

      <div className="flex-1 p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <SearchInput
            value={nominee}
            onChange={(v) => { setNominee(v || null); handleFilterChange(); }}
            placeholder="Buscar jogo…"
            className="w-44"
          />
          <SearchInput
            value={company}
            onChange={(v) => { setCompany(v || null); handleFilterChange(); }}
            placeholder="Buscar studio…"
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Jogo / Indicado</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Studio</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Categoria</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.data.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">{item.year}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/tga/${item.id}`} className="font-medium hover:underline line-clamp-1">
                          {item.nominee ?? "—"}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground hidden md:table-cell line-clamp-1">
                        {item.company ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground hidden lg:table-cell line-clamp-1">
                        {item.category}
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
