# Elaine's Easecipes

A recipe discovery application built with Next.js 16, featuring a SQLite database backend.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Initialize the database

Push the database schema and seed with initial data:

```bash
npm run db:push
npm run db:seed
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for Production

npm run build 

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema changes to the database |
| `npm run db:seed` | Seed the database with initial recipe data |
| `npm run db:studio` | Open Drizzle Studio to browse/edit data |

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/recipes` | Get all recipes (supports `?tag=` and `?limit=` params) |
| `GET /api/recipes/newest` | Get newest recipes sorted by creation date |
| `GET /api/recipes/popular` | Get most popular recipes sorted by views |
| `GET /api/recipes/featured` | Get the featured recipe for the hero section |

## Project Structure

```
elaines-easecipes-ai/
├── app/
│   ├── api/recipes/       # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/db/                # Database layer
│   ├── index.ts           # Database connection
│   ├── schema.ts          # Drizzle schema
│   └── seed.ts            # Seed script
├── data/                  # SQLite database files
└── public/images/         # Static assets
```
