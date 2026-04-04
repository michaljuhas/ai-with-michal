import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Ignores must apply before other configs so worktrees / vendored trees are excluded.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".claude/**",
    "stripe-cli/**",
    "scripts/posthog-cli/**",
  ]),
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
