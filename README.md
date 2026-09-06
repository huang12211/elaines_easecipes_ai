# Elaine's Easecipes

A full-stack recipe discovery app with AI-powered search: browse, search, and bookmark recipes, and ask a Gemini-backed assistant ("Pitaya Pal") for recommendations using retrieval-augmented generation over the recipe database.

**Live site:** [elaineseasecipes.com](https://elaineseasecipes.com)

## Highlights

- **AI / RAG chat assistant** — user queries are embedded (`gemini-embedding-001`), matched against precomputed recipe embeddings via cosine similarity, and the top matches are injected as context into a streamed `gemini-2.5-flash-lite` chat response ([app/api/chat/route.ts](app/api/chat/route.ts)).
- **Authentication** — email/password auth with `bcryptjs` password hashing, stateless JWT sessions (`jose`), and HttpOnly session cookies ([lib/auth/session.ts](lib/auth/session.ts), [app/api/auth/](app/api/auth/)).
- **Relational schema design** — recipes, ingredients, and measurement units are normalized into a many-to-many join table (`recipe_ingredient_measUnit`), plus per-user bookmarks and a vector-embedding table, modeled with Drizzle ORM ([lib/db/schema.ts](lib/db/schema.ts)).
- **Search & filtering API** — composable SQL query building (keyword, category, ingredient, and combined filters) with optional per-user personalization ([app/api/recipes/search/route.ts](app/api/recipes/search/route.ts)).
- **Type-safe end to end** — TypeScript across API routes, database schema, and UI, with inferred types from the Drizzle schema.
- **Production deployment** — deployed on Railway with a persistent volume for SQLite, environment-based configuration, and a documented migration/seed pipeline (see [Deployment](#deployment)).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend | Next.js API routes (Node runtime) |
| Database | SQLite via `better-sqlite3` + Drizzle ORM |
| Auth | JWT (`jose`) + `bcryptjs` password hashing |
| AI / ML | Google Gemini via Vercel AI SDK (`ai`, `@ai-sdk/google`) — chat streaming + text embeddings |
| Language | TypeScript |
| Tooling | ESLint, Drizzle Kit (migrations/studio) |
| Deployment | Railway (persistent volume for SQLite) |

## Project Structure

```
elaines-easecipes-ai/
├── app/
│   ├── api/
│   │   ├── auth/            # register, login, logout, session check
│   │   ├── chat/            # RAG chat endpoint (embeddings + Gemini streaming)
│   │   └── recipes/         # search, featured, newest, popular, ingredients
│   ├── recipes/[slug]/      # recipe detail page
│   ├── categories/[category]/
│   ├── search/, login/, register/
│   └── layout.tsx, page.tsx
├── components/              # RecipeCard, Header, Footer, ServingSizeAdjuster, DragonFruitRating
├── lib/
│   ├── auth/session.ts      # JWT sign/verify, cookie parsing
│   └── db/                  # Drizzle connection, schema, seed script
├── drizzle/                 # generated SQL migrations
└── data/                    # SQLite database file (gitignored)
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local`:

```
JWT_SECRET=<generate a random secret>
GOOGLE_GENERATIVE_AI_API_KEY=<your Gemini API key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up and run

```bash
npm run db:generate   # only after schema changes — generates migration files
npm run db:migrate:root
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Commands

| Command | Description |
|---|---|
| `npm run db:generate` | Generate migration files from schema changes |
| `npm run db:migrate:root` | Apply migrations |
| `npm run db:push` | Push schema changes directly (no migration files) |
| `npm run db:seed` | Seed/update recipe data |
| `npm run db:studio` | Open Drizzle Studio to browse/edit data |

## Deployment

Deployed on Railway with a mounted volume for SQLite persistence.

**Service variables:**
- `DATABASE_PATH=/app/data/recipes.db`
- `JWT_SECRET=<random secret>`
- `GOOGLE_GENERATIVE_AI_API_KEY=<your API key>`
- `PORT=8080`

**Build/start commands** — choose based on whether you want to preserve existing production data:

- Preserve data: Build = `npm run build`, Start = `npm run db:migrate:root && npm run db:seed && npm run start`
- Reset/overwrite on each deploy: Build = `npm run db:push && npm run db:seed && npm run build`, Start = default

Volume mount path: `/app/data`.

### Inspecting the production database

```bash
railway login
railway link
railway ssh
sqlite3 /app/data/recipes.db
```

Common queries once connected: `.tables`, `.schema users`, `SELECT * FROM users LIMIT 10;`, `.quit`.