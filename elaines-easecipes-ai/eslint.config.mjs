import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ...tailwind.configs.recommended,
    plugins: {
      ...tailwind.configs.recommended.plugins,
      "unused-imports": unusedImports,
    },
    rules: {
      ...tailwind.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": "error",
      "tailwindcss/no-unnecessary-arbitrary-value": "error",
    },
    settings: {
      ...tailwind.configs.recommended.settings,
      tailwindcss: { cssConfigPath: "./app/globals.css" },
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
