#!/usr/bin/env node
// Pre-commit guard for Drizzle migrations, run from lint-staged when
// lib/db/schema.ts or drizzle/**/*.sql are staged.
import { execSync } from "node:child_process";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" });
}

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

// 1. Migration files must be internally consistent (not hand-edited/broken).
try {
  execSync("npx drizzle-kit check", { stdio: "inherit" });
} catch {
  fail("drizzle-kit check failed — migration files in drizzle/ are inconsistent.");
}

// 2. Schema drift: schema.ts must not have changes missing a committed migration.
// drizzle-kit generate is a no-op if schema.ts already matches drizzle/, and
// writes new migration file(s) into drizzle/ otherwise (may prompt for input
// on ambiguous renames — respond in the terminal if so).
const beforeStatus = run("git status --porcelain drizzle").trim();
try {
  execSync("npx drizzle-kit generate", { stdio: "inherit" });
} catch {
  fail("drizzle-kit generate failed while checking for schema drift.");
}
const afterStatus = run("git status --porcelain drizzle").trim();
if (afterStatus !== beforeStatus) {
  fail(
    "Schema drift detected: lib/db/schema.ts changed but drizzle/ was out of date.\n" +
      "  drizzle-kit generate just created/updated migration file(s) to match your schema.\n" +
      "  Review them, then `git add drizzle/` and commit again."
  );
}

// 3. Warn (don't block) on destructive DDL in newly staged migration files.
const stagedMigrations = run(
  "git diff --cached --name-only --diff-filter=ACM -- drizzle/*.sql"
)
  .split("\n")
  .filter(Boolean);

const destructivePattern = /\b(DROP\s+COLUMN|DROP\s+TABLE|RENAME\s+COLUMN|RENAME\s+TABLE)\b/i;
const destructiveFiles = stagedMigrations.filter((file) =>
  destructivePattern.test(run(`git show :${file}`))
);

if (destructiveFiles.length > 0) {
  console.warn(
    `\n⚠ Destructive schema change in: ${destructiveFiles.join(", ")}\n` +
      "  (DROP COLUMN / DROP TABLE / RENAME) — double check this is intentional.\n"
  );
}
