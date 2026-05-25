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

### 2. Run locally:

```bash
npm run db:generate #only run when db changes are made (craetes a list of the things that need to change when migration happens)
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Railway Deployment Configuration:

- Mounted Volume / Database: "Mount Path" = "/app/data"

- elaines_easecipes_ai Service:
    - Variables: 
        - DATABASE_PATH = /app/data/recipes.db
        - JWT_SECRET = generate one for your system
        - PORT = 8080
    - Settings 
        - When want to keep the database as it lives today:
            - Custom Build Command: npm run build 
            - Custom Start Command: npm run db:seed && npm run start
            NOTE: if seed.ts has an issue, data will be wiped from the database and it reseeds from empty. 
        - When you don't want to keep the database in its most updated state:
            - Custom Build Command: npm run db:push && npm run db:seed && npm run build
            - Custom Start Command: None

### 3. Prepare for Deployment on Railway:
1. review the content of npm run db:seed to ensure that it updates your database the way that you want to. If you get stuck, wipe all tables and restart. 


```bash
npm run db:generate #only run when changes to the schema are made (creates a list of the things that need to change when migration happens)

# Push to Git Remote Main Branch #

# The following lines will run in the Railway Deployment
npm run db:migrate:root
npm run db:seed 
npm start 
![alt text](image-1.png)
```

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



## Database Commands in Dev

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema changes to the database |
| `npm run db:seed` | Seed the database with recipe data / changes to recipe data |
| `npm run db:studio` | Open Drizzle Studio to browse/edit data |

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
