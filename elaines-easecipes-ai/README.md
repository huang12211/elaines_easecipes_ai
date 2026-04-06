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
npm run db:generate #only run when db changes are made (craetes a list of the things that need to change when migration happens)
npm run db:migrate
npm run db:seed
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Inspecting Database Already Deployed in Production via Railway

1. open up local terminal
2. type: `railway login`, then log into railway
3. type: `railway link` 
4. type: `railway ssh`
    - To exit SSH, CTRL+D
4. Find the database file: `find / -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" 2>/dev/null`
5. type: `sqlite3 /path/to/your/database.db`
    > sqlite3 /app/data/recipes.db
    - If sqlite3 is not yet installed on your PC, then install it by running: 
        >apt-get update && apt-get install -y sqlite3
6. run your SQL queries: 
    - List all tables
        >.tables
    - See table schema
        >.schema users
    - Query data
        >SELECT * FROM users LIMIT 10;
    - Pretty print output
        >.mode column
        >
        >.headers on
        >
        >SELECT * FROM users LIMIT 10;
    - Exit
        >.quit



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
