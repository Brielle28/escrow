import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tailwind v4 is wired via postcss.config.mjs (@tailwindcss/postcss).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
