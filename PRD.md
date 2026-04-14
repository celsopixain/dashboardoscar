# PRD — Awards Analytics Dashboard
**Versão:** 2.0 | **Data:** Abril 2026 | **Status:** Em revisão

---

## 1. Visão Geral

Dashboard web interativo que consolida ~100 anos de dados do **Academy Awards (Oscars)** e ~12 anos do **The Game Awards**, permitindo exploração visual, busca avançada e análises comparativas entre as duas premiações.

**Proposta de Valor:** A única ferramenta que permite comparar a história completa do Oscar com a era moderna dos prêmios de games em um único painel interativo e bonito.

---

## 2. Objetivos

| Objetivo | Métrica de Sucesso |
|----------|-------------------|
| Visualizações interativas rápidas | < 300ms de resposta nas queries |
| Busca e filtragem avançada | Resultados em < 100ms com debounce |
| Responsividade total | Funcional em 320px até 4K |
| Deploy público | URL acessível via Vercel |
| Dados precisos | 100% dos ~12.800 registros importados |

---

## 3. Público-Alvo

- **Primário:** Cinéfilos e fãs de entretenimento (casual, curiosidade)
- **Secundário:** Gamers e entusiastas de The Game Awards
- **Terciário:** Pesquisadores/jornalistas buscando dados históricos

---

## 4. Funcionalidades

### 4.1 Home / Dashboard Overview
- [ ] Hero com estatísticas macro (total de indicações, cerimônias, pessoas únicas)
- [ ] Cards de destaque: "Maior vencedor da história", "Filme mais indicado", "Studio mais premiado (TGA)"
- [ ] Timeline horizontal interativa de cerimônias (1928–2025)
- [ ] Switch entre Oscar / Game Awards / Ambos

### 4.2 Visualizações — Oscar
- [ ] **Top 10 Atores/Atrizes** com mais vitórias (bar chart)
- [ ] **Top 10 Filmes** com mais indicações (bar horizontal)
- [ ] **Indicações por Década** — tendência histórica (line chart)
- [ ] **Distribuição por Classe** (Acting / Directing / Production) — donut chart
- [ ] **Heatmap** vencedores por Categoria × Ano
- [ ] **Corrida de indicações** (animated bar chart race por década)

### 4.3 Visualizações — The Game Awards
- [ ] **Game of the Year** — todos os vencedores por ano (timeline)
- [ ] **Top Studios** com mais vitórias (bar chart)
- [ ] **Distribuição por Categoria** (donut/treemap)
- [ ] **Jury vs Fan Vote** — breakdown por categoria

### 4.4 Visualização Comparativa (Oscar vs TGA)
- [ ] Quantidade de categorias ao longo do tempo
- [ ] Diversidade de vencedores por premiação
- [ ] Concentração de prêmios (poucos studios/atores dominam?)

### 4.5 Busca & Filtros
- [ ] Busca global (filme, ator, categoria, studio, ano) com autocomplete
- [ ] Filtros combinados: Ano range, Categoria, Status (vencedor/indicado), Premiação
- [ ] URL com state preservado (shareable links)
- [ ] Histórico de buscas recentes (localStorage)

### 4.6 Páginas de Detalhe
- [ ] **Filme/Jogo**: indicações, vencedores, ano, categoria, elenco
- [ ] **Pessoa** (Oscar): histórico completo de indicações e vitórias
- [ ] **Studio** (TGA): todos os jogos, vitórias por categoria
- [ ] **Categoria**: todos os vencedores ao longo do tempo
- [ ] **Cerimônia/Ano**: resultados completos da edição

### 4.7 UX / Extras
- [ ] Dark mode / Light mode (padrão: dark — combina com o tema)
- [ ] Exportar resultados filtrados como CSV
- [ ] Favoritos salvos em localStorage
- [ ] Animações suaves nas transições de chart
- [ ] Loading skeletons (sem flash de conteúdo)

---

## 5. Stack Técnica Recomendada

### Decisão Arquitetural: **Next.js 15 Full-Stack**

Justificativa: Menor overhead de setup, deploy nativo no Vercel, Server Components para queries pesadas sem expor o DB, e Route Handlers para a API. Tudo em um repositório.

```
┌──────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 15 App Router)         │
│                                                        │
│  React 19 + TypeScript + Tailwind CSS 4               │
│  shadcn/ui  →  componentes base (Button, Card, etc.)  │
│  Recharts   →  todos os gráficos interativos          │
│  TanStack Table  →  tabelas com sort/filter/paginate  │
│  TanStack Query  →  cache + sync de dados client-side │
│  Zustand    →  estado global de filtros               │
│  nuqs       →  URL search params como estado React    │
└──────────────────┬───────────────────────────────────┘
                   │  Server Actions / Route Handlers
┌──────────────────▼───────────────────────────────────┐
│              BACKEND (Next.js Route Handlers)         │
│                                                        │
│  Prisma ORM  →  type-safe queries                     │
│  Zod         →  validação de inputs                   │
│  Endpoints:                                            │
│    GET /api/stats          →  métricas gerais         │
│    GET /api/oscars         →  listagem + filtros      │
│    GET /api/oscars/[id]    →  detalhe                 │
│    GET /api/tga            →  listagem + filtros      │
│    GET /api/search         →  busca global full-text  │
│    GET /api/charts/[type]  →  dados agregados         │
└──────────────────┬───────────────────────────────────┘
                   │  Prisma Client
┌──────────────────▼───────────────────────────────────┐
│              DATABASE (PostgreSQL via Neon)           │
│                                                        │
│  Tabelas: academy_awards, game_awards                 │
│  Índices: year, category, winner, name, film          │
│  Full-text search: pg_trgm extension                  │
└──────────────────────────────────────────────────────┘
```

### Dependências Principais

| Camada | Pacote | Versão | Motivo |
|--------|--------|--------|--------|
| Framework | `next` | 15.x | Full-stack, App Router |
| Linguagem | TypeScript | 5.x | Segurança de tipos |
| Styling | `tailwindcss` | 4.x | Utility-first, rápido |
| UI Components | `shadcn/ui` | latest | Componentes acessíveis |
| Gráficos | `recharts` | 2.x | Composable, React-native |
| Tabelas | `@tanstack/react-table` | 8.x | Headless, flexível |
| Data Fetching | `@tanstack/react-query` | 5.x | Cache inteligente |
| URL State | `nuqs` | 2.x | Filtros na URL |
| Global State | `zustand` | 5.x | Leve, simples |
| ORM | `prisma` | 5.x | Type-safe, migrations |
| Validação | `zod` | 3.x | Schema validation |
| CSV Import | `csv-parser` | 3.x | Stream CSV |
| Deploy | Vercel | — | Native Next.js |
| DB Hosting | Neon | — | PostgreSQL serverless grátis |

---

## 6. Schema de Dados

### Tabela: `academy_awards`
```sql
id                  SERIAL PRIMARY KEY
ceremony            INT
year                INT           -- extraído de "1927/28" → 1927
year_raw            VARCHAR(10)   -- original "1927/28"
class               VARCHAR(50)   -- Acting, Directing, Production
canonical_category  VARCHAR(100)
category            VARCHAR(200)
nom_id              VARCHAR(20)
film                VARCHAR(300)
film_id             VARCHAR(20)   -- IMDb ID
nominee_name        VARCHAR(300)
nominee_ids         TEXT
winner              BOOLEAN
detail              TEXT
note                TEXT
citation            TEXT
multi_film          BOOLEAN
created_at          TIMESTAMP DEFAULT NOW()
```

### Tabela: `game_awards`
```sql
id        SERIAL PRIMARY KEY
year      INT
category  VARCHAR(100)
nominee   VARCHAR(200)
company   VARCHAR(200)
winner    BOOLEAN
voted     VARCHAR(50)   -- jury, fan, etc.
```

### Índices
```sql
-- Academy Awards
CREATE INDEX idx_aa_year ON academy_awards(year);
CREATE INDEX idx_aa_winner ON academy_awards(winner);
CREATE INDEX idx_aa_category ON academy_awards(canonical_category);
CREATE INDEX idx_aa_film ON academy_awards(film);
CREATE INDEX idx_aa_nominee ON academy_awards(nominee_name);
-- Full-text search
CREATE INDEX idx_aa_fts ON academy_awards 
  USING GIN(to_tsvector('english', coalesce(film,'') || ' ' || coalesce(nominee_name,'')));

-- Game Awards
CREATE INDEX idx_ga_year ON game_awards(year);
CREATE INDEX idx_ga_winner ON game_awards(winner);
CREATE INDEX idx_ga_category ON game_awards(category);
CREATE INDEX idx_ga_company ON game_awards(company);
```

---

## 7. Estrutura de Pastas

```
dashboardoscar/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx              # Home — Overview
│   │   ├── oscars/
│   │   │   ├── page.tsx          # Lista + filtros Oscar
│   │   │   └── [id]/page.tsx     # Detalhe indicação
│   │   ├── tga/
│   │   │   ├── page.tsx          # Lista + filtros TGA
│   │   │   └── [id]/page.tsx     # Detalhe indicação
│   │   ├── person/[name]/page.tsx
│   │   ├── film/[id]/page.tsx
│   │   ├── category/[slug]/page.tsx
│   │   └── ceremony/[year]/page.tsx
│   ├── api/
│   │   ├── stats/route.ts
│   │   ├── oscars/route.ts
│   │   ├── oscars/[id]/route.ts
│   │   ├── tga/route.ts
│   │   ├── search/route.ts
│   │   └── charts/[type]/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui (auto-gerado)
│   ├── charts/                   # Wrappers de Recharts
│   │   ├── BarChartTopWinners.tsx
│   │   ├── LineChartTrend.tsx
│   │   ├── DonutDistribution.tsx
│   │   └── HeatmapChart.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── CeremonyTimeline.tsx
│   │   └── QuickSearch.tsx
│   ├── filters/
│   │   ├── FilterPanel.tsx
│   │   └── SearchInput.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── ThemeToggle.tsx
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── queries/                  # Queries reutilizáveis
│   │   ├── oscars.ts
│   │   ├── tga.ts
│   │   └── stats.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                   # Import CSV → DB
├── data/
│   ├── full_data.csv             # Oscar raw data
│   └── the_game_awards.csv       # TGA raw data
└── scripts/
    └── import-data.ts            # Script de importação
```

---

## 8. Plano de Implementação

### Fase 1 — Fundação (Dia 1-2)
- [ ] `npx create-next-app@latest` com TypeScript + Tailwind + App Router
- [ ] Instalar Prisma + configurar Neon PostgreSQL
- [ ] Criar schema Prisma + migrations
- [ ] Script de importação CSV → PostgreSQL (com normalização de Year e Winner)
- [ ] Validar importação: contar registros, checar nulos
- [ ] Setup shadcn/ui + tema dark

### Fase 2 — Backend API (Dia 2-3)
- [ ] `/api/stats` — números gerais do dashboard
- [ ] `/api/oscars` — listagem com filtros + paginação
- [ ] `/api/tga` — listagem com filtros + paginação
- [ ] `/api/search` — full-text search global
- [ ] `/api/charts/top-winners` — dados agregados
- [ ] `/api/charts/by-decade` — tendência histórica
- [ ] Validação Zod em todos os endpoints

### Fase 3 — Frontend Base (Dia 3-4)
- [ ] Layout: Sidebar + Header + ThemeToggle
- [ ] Home page com StatsCards
- [ ] Componente CeremonyTimeline
- [ ] Integrar TanStack Query
- [ ] Filtros com nuqs (URL state)

### Fase 4 — Visualizações (Dia 4-5)
- [ ] BarChart Top 10 Atores/Atrizes
- [ ] LineChart Indicações por Década
- [ ] DonutChart Distribuição por Classe
- [ ] Timeline de GOTY (TGA)
- [ ] BarChart Top Studios (TGA)
- [ ] Painel comparativo Oscar vs TGA

### Fase 5 — Busca & Páginas de Detalhe (Dia 5-6)
- [ ] SearchInput com autocomplete + debounce
- [ ] Página de resultado de busca
- [ ] Página Film/Jogo
- [ ] Página Pessoa
- [ ] Página Categoria
- [ ] Página Cerimônia/Ano

### Fase 6 — Polish & Deploy (Dia 6-7)
- [ ] Loading skeletons
- [ ] Responsividade mobile (320px+)
- [ ] Animações de chart (Recharts defaults)
- [ ] Meta tags + Open Graph
- [ ] Deploy no Vercel
- [ ] Testes manuais no golden path
- [ ] Exportar CSV funcional

---

## 9. Requisitos Não-Funcionais

| Requisito | Meta |
|-----------|------|
| Tempo de carregamento (FCP) | < 1.5s no Vercel Edge |
| Resposta de query API | < 300ms p95 |
| Acessibilidade | WCAG 2.1 AA nos componentes base (shadcn) |
| Responsividade | 320px — 2560px |
| Uptime | 99.9% (Vercel SLA) |
| Custo mensal | $0 (Vercel hobby + Neon free tier) |

---

## 10. Recursos & Ferramentas

| Ferramenta | Uso | Custo |
|------------|-----|-------|
| Vercel | Hosting + CI/CD | Grátis |
| Neon | PostgreSQL serverless | Grátis (0.5GB) |
| GitHub | Repositório | Grátis |
| Node.js 20+ | Runtime | — |
| VS Code | Editor | Grátis |

---

## 11. Próximos Passos Imediatos

1. **Aprovar este PRD**
2. Executar `npx create-next-app@latest dashboardoscar --typescript --tailwind --app`
3. Criar projeto no Neon e obter `DATABASE_URL`
4. Configurar Prisma + criar schema
5. Rodar script de importação dos CSVs
6. Começar pela Home page com StatsCards
