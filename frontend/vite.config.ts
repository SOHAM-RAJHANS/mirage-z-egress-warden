import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * MIRAGE-Z SOC console build.
 *
 * Dev server: 0.0.0.0:8080 (Docker/CI friendly, matches the container preview)
 * Production: node-server bundle in `.output/` (`pnpm start`, PORT configurable)
 */
export default defineConfig(({ command, isPreview }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview ? [nitro({ preset: "node-server" })] : []),
    viteReact(),
  ],
  build: {
    target: "es2022",
  },
}));
