import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));
const trainingStub = path.join(root, "test/stubs/training.ts");
const trainingTarget = path.join(root, "lib/training.ts");

/** Replace `lib/training.ts` so Vitest never parses MDX imports from that module. */
function stubTrainingPlugin(): Plugin {
  return {
    name: "vitest-stub-lib-training",
    enforce: "pre",
    resolveId(id, importer) {
      if (path.normalize(id) === trainingTarget) return trainingStub;
      const imp = importer?.replace(/\\/g, "/") ?? "";
      if (imp.endsWith("/lib/workshops.ts") && (id === "./training" || id === "training")) {
        return trainingStub;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [stubTrainingPlugin()],
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
    exclude: ["node_modules", ".next", ".claude/**"],
    setupFiles: [path.join(root, "test/vitest-setup.ts")],
  },
  resolve: {
    alias: {
      "@": root,
    },
  },
});
