export default {
  "*": ["secretlint"],
  "*.{js,jsx,ts,tsx}": ["eslint --fix"],
  "*.{ts,tsx}": () => "npm run typecheck",
  "{lib/db/schema.ts,drizzle/**/*.sql}": () => "node scripts/check-migrations.mjs",
};
