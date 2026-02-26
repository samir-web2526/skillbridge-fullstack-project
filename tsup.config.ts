import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],   // তোমার entry file
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "api",
  external: ["pg-native"],
  outExtension() {
    return {
      js: ".mjs",
    };
  },
});