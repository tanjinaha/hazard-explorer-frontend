// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  server: {
    proxy: {
      // Varsom – avalanche forecast
      "/nve": {
        target: "https://api01.nve.no",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/nve/, ""),
      },

      // MET Norway – weather data
      "/met": {
        target: "https://api.met.no",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/met/, ""),
      },

      // ❌ No Regobs proxy here (we skip it for now)
    },
  },
});
