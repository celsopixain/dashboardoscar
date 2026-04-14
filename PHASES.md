# Fases de Desenvolvimento — Awards Analytics Dashboard

---

## ✅ Fase 1 — Fundação
> Setup completo do projeto, banco de dados e importação dos dados.

- [x] `create-next-app` com TypeScript + Tailwind CSS + App Router
- [x] Dependências adicionais: Prisma 7, Recharts, TanStack Query, TanStack Table, Zustand, nuqs, Zod, csv-parser, pg adapter
- [x] shadcn/ui inicializado + componentes base (button, card, badge, input, select, skeleton, separator, table)
- [x] Schema Prisma: modelos `AcademyAward` e `GameAward` com índices
- [x] Prisma Client gerado (`app/generated/prisma/client`)
- [x] `lib/db.ts` — singleton do Prisma com adapter `pg`
- [x] Configuração Neon PostgreSQL + `.env`
- [x] `npm run db:push` — tabelas criadas no banco
- [x] `scripts/import-data.ts` — importação TSV/CSV com normalização
- [x] `npm run db:import` — 12.014 (Oscar) + 805 (TGA) registros importados
- [x] `lang="pt-BR"` no layout + metadata do projeto
- [x] README.md em português
- [x] Estrutura de pastas: `lib/`, `components/`, `scripts/`, `prisma/`

---

## ✅ Fase 2 — Backend API
> Route Handlers com filtros, paginação e full-text search.

- [x] `GET /api/stats` — totais gerais (indicações, cerimônias, pessoas, filmes únicos)
- [x] `GET /api/oscars` — listagem com filtros (year, category, winner, class) + paginação
- [x] `GET /api/oscars/[id]` — detalhe de uma indicação
- [x] `GET /api/tga` — listagem com filtros (year, category, winner) + paginação
- [x] `GET /api/tga/[id]` — detalhe de uma indicação
- [x] `GET /api/search` — full-text search global (film, name, nominee, company)
- [x] `GET /api/charts/top-winners` — top atores/atrizes com mais vitórias
- [x] `GET /api/charts/by-decade` — indicações por década
- [x] `GET /api/charts/by-class` — distribuição por classe (Oscar)
- [x] `GET /api/charts/top-studios` — studios mais premiados (TGA)
- [x] `GET /api/charts/goty` — Game of the Year por ano (TGA)
- [x] Validação Zod em todos os endpoints

---

## ✅ Fase 3 — Frontend Base
> Layout principal, home page e infraestrutura de dados client-side.

- [x] Layout: `Sidebar` + `Header` + `ThemeToggle` (dark/light)
- [x] Página Home com `StatsCards` (totais macro)
- [x] `CeremonyTimeline` — timeline horizontal interativa de cerimônias
- [x] Switch Oscar / Game Awards / Ambos
- [x] TanStack Query configurado (QueryClientProvider)
- [x] nuqs para URL state (filtros compartilháveis)
- [x] Loading skeletons nos componentes de dados

---

## ✅ Fase 4 — Visualizações
> Gráficos interativos com Recharts para Oscar e TGA.

**Oscar**
- [x] `BarChartTopWinners` — top 10 atores/atrizes com mais vitórias
- [x] `BarChartTopFilms` — top 10 filmes com mais indicações
- [x] `LineChartTrend` — indicações por década (tendência histórica)
- [x] `DonutDistribution` — distribuição por Classe (Acting / Directing / Production)
- [ ] `HeatmapChart` — vencedores por Categoria × Década

**The Game Awards**
- [x] `GotyTimeline` — vencedores do Game of the Year por ano
- [x] `BarChartTopStudios` — studios com mais vitórias
- [ ] Distribuição por categoria (donut/treemap)
- [ ] Jury vs Fan Vote — breakdown por categoria

**Comparativo**
- [ ] Painel Oscar vs TGA: categorias ao longo do tempo
- [ ] Concentração de prêmios (poucos dominam?)

---

## ✅ Fase 5 — Busca & Páginas de Detalhe
> Sistema de busca global e páginas de detalhe por entidade.

- [x] `SearchInput` com debounce (300ms)
- [x] Página de resultados de busca `/search`
- [x] `app/oscars/page.tsx` — listagem Oscar com filtros (nome, filme, classe, winner)
- [x] `app/oscars/[id]/page.tsx` — detalhe de indicação
- [x] `app/tga/page.tsx` — listagem TGA com filtros (jogo, studio, winner)
- [x] `app/tga/[id]/page.tsx` — detalhe de indicação + outras indicações do mesmo jogo
- [x] `app/person/[name]/page.tsx` — perfil de ator/diretor (histórico completo)
- [x] `app/ceremony/[year]/page.tsx` — resultados completos de uma edição
- [ ] `app/film/[id]/page.tsx` — perfil de filme
- [ ] `app/category/[slug]/page.tsx` — vencedores da categoria ao longo do tempo
- [ ] Exportar resultados filtrados como CSV
- [ ] Favoritos em localStorage

---

## ✅ Fase 6 — Polish & Deploy
> Refinamentos de UX, responsividade e deploy em produção.

- [x] Responsividade mobile — Sidebar drawer com overlay + hamburger no Header
- [x] Meta tags dinâmicas por página (`generateMetadata` em oscars/[id], tga/[id], person/[name], ceremony/[year])
- [x] Open Graph completo no root layout (og:title, og:description, twitter:card)
- [x] `metadataBase` configurado para Vercel
- [ ] Animações de chart (Recharts defaults já aplicados)
- [ ] Testes manuais no golden path (desktop + mobile)
- [ ] Deploy no Vercel (conectar repositório + variável `DATABASE_URL`)
- [ ] Validação final de performance (FCP < 1.5s, API < 300ms)

---

## Métricas de Qualidade

| Requisito | Meta |
|-----------|------|
| First Contentful Paint | < 1.5s |
| Resposta da API (p95) | < 300ms |
| Responsividade | 320px — 2560px |
| Acessibilidade | WCAG 2.1 AA |
| Custo mensal | $0 |
