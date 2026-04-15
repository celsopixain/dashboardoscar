"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsString, parseAsStringEnum } from "nuqs";
import { Film, Gamepad2, Trophy } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { SearchInput } from "@/components/filters/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SearchType = "all" | "oscar" | "tga";

interface OscarResult {
  id: number;
  year: number | null;
  ceremony: number | null;
  film: string | null;
  nomineeName: string | null;
  canonicalCategory: string | null;
  winner: boolean;
  class: string | null;
}

interface TgaResult {
  id: number;
  year: number;
  category: string;
  nominee: string | null;
  company: string | null;
  winner: boolean;
}

interface SearchResponse {
  query: string;
  type: string;
  page: number;
  pageSize: number;
  results: {
    oscar?: { data: OscarResult[]; total: number };
    tga?: { data: TgaResult[]; total: number };
  };
}

const TYPE_OPTIONS: { label: string; value: SearchType }[] = [
  { label: "Todos", value: "all" },
  { label: "Oscar", value: "oscar" },
  { label: "TGA", value: "tga" },
];

export function SearchClient() {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [type, setType] = useQueryState(
    "type",
    parseAsStringEnum<SearchType>(["all", "oscar", "tga"]).withDefault("all")
  );

  const { data, isPending } = useQuery<SearchResponse>({
    queryKey: ["search", q, type],
    queryFn: () =>
      fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}&pageSize=30`).then((r) =>
        r.json()
      ),
    enabled: q.trim().length >= 2,
    staleTime: 30_000,
  });

  const oscarResults = data?.results?.oscar;
  const tgaResults = data?.results?.tga;
  const totalResults = (oscarResults?.total ?? 0) + (tgaResults?.total ?? 0);

  return (
    <div className="flex flex-col">
      <Header title="Busca Global" description="Pesquise filmes, pessoas, jogos e categorias" />

      <div className="flex-1 p-6 space-y-6">
        {/* Search bar + type filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder="Buscar filme, ator, jogo, categoria…"
            className="flex-1 max-w-lg"
          />
          <div className="flex gap-1">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  type === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {q.trim().length < 2 && (
          <p className="text-sm text-muted-foreground">
            Digite pelo menos 2 caracteres para buscar.
          </p>
        )}

        {/* Loading */}
        {isPending && q.trim().length >= 2 && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* Results */}
        {data && q.trim().length >= 2 && (
          <>
            <p className="text-xs text-muted-foreground">
              {totalResults.toLocaleString("pt-BR")} resultados para &ldquo;{q}&rdquo;
            </p>

            {/* Oscar results */}
            {oscarResults && oscarResults.data.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Film className="h-4 w-4" /> Oscar
                  <Badge variant="secondary" className="text-[10px]">
                    {oscarResults.total.toLocaleString("pt-BR")}
                  </Badge>
                </h2>
                <div className="divide-y divide-border rounded-lg border border-border">
                  {oscarResults.data.map((item) => (
                    <Link
                      key={item.id}
                      href={`/oscars/${item.id}`}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                    >
                      {item.winner && (
                        <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chart-1" />
                      )}
                      {!item.winner && <span className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.film ?? item.nomineeName ?? "—"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.canonicalCategory}
                          {item.nomineeName && ` · ${item.nomineeName}`}
                          {item.year && ` · ${item.year}`}
                        </p>
                      </div>
                      {item.winner && (
                        <Badge className="shrink-0 text-[10px]">Vencedor</Badge>
                      )}
                    </Link>
                  ))}
                </div>
                {oscarResults.total > oscarResults.data.length && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Mostrando {oscarResults.data.length} de {oscarResults.total}. Use{" "}
                    <Link href={`/oscars?name=${encodeURIComponent(q)}`} className="underline">
                      filtros avançados
                    </Link>{" "}
                    para ver mais.
                  </p>
                )}
              </section>
            )}

            {/* TGA results */}
            {tgaResults && tgaResults.data.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Gamepad2 className="h-4 w-4" /> Prêmio do Jogo
                  <Badge variant="secondary" className="text-[10px]">
                    {tgaResults.total.toLocaleString("pt-BR")}
                  </Badge>
                </h2>
                <div className="divide-y divide-border rounded-lg border border-border">
                  {tgaResults.data.map((item) => (
                    <Link
                      key={item.id}
                      href={`/tga/${item.id}`}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                    >
                      {item.winner && (
                        <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chart-3" />
                      )}
                      {!item.winner && <span className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.nominee ?? "—"}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.category}
                          {item.company && ` · ${item.company}`}
                          {` · ${item.year}`}
                        </p>
                      </div>
                      {item.winner && (
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          Vencedor
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum resultado encontrado para &ldquo;{q}&rdquo;.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
