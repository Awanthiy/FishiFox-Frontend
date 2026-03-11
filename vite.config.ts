import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",   // ← IMPORTANT: Must be "/" for Netlify
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});