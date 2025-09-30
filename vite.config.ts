import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // import from "@/..."
    },
  },
  server: {
    proxy: {
      "/nve": {
        target: "https://api01.nve.no",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/nve/, ""),
      },
    },
  },
});
