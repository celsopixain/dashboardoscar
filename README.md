# Awards Analytics Dashboard

Dashboard web interativo com histórico completo do **Academy Awards (Oscars)** — quase 100 anos de dados — e do **The Game Awards**, permitindo exploração visual, busca avançada e análises comparativas entre as duas premiações.

---

## Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Gráficos:** Recharts
- **Tabelas:** TanStack Table
- **Data Fetching:** TanStack Query
- **URL State:** nuqs
- **Estado Global:** Zustand
- **ORM:** Prisma 7 + adapter pg
- **Banco de Dados:** PostgreSQL (Neon)
- **Validação:** Zod
- **Deploy:** Vercel

---

## Pré-requisitos

- Node.js 20+
- Conta no [Neon](https://neon.tech) (PostgreSQL gratuito)

---

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Editar .env com sua DATABASE_URL do Neon
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Criar tabelas no banco
npm run db:push

# Importar dados dos CSVs
npm run db:import

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run db:generate` | Gerar Prisma Client |
| `npm run db:push` | Sincronizar schema com o banco |
| `npm run db:migrate` | Criar migration |
| `npm run db:import` | Importar CSVs para o banco |
| `npm run db:studio` | Abrir Prisma Studio |

---

## Dados

| Dataset | Arquivo | Registros | Período |
|---------|---------|-----------|---------|
| Academy Awards | `data/full_data.csv` | ~12.014 | 1927–presente |
| The Game Awards | `data/the_game_awards.csv` | ~805 | 2014–presente |

---

## Demo

**[https://dashboardoscar.vercel.app/](https://dashboardoscar.vercel.app/)**

---

## Deploy

O projeto está configurado para deploy no Vercel. Basta conectar o repositório e adicionar a variável `DATABASE_URL` nas configurações de ambiente.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
