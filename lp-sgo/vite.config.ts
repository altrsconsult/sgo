import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sgo/ui": path.resolve(__dirname, "../packages/ui/src"),
    },
  },
  server: {
    port: 3003,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
