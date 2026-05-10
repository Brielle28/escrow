import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tailwind v4 is wired via postcss.config.mjs (@tailwindcss/postcss).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Auth API runs on 8787 by default — proxy avoids CORS and "Failed to fetch" when the UI uses same-origin `/api/*`.
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
});
