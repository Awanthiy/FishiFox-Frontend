import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // IMPORTANT: repo name here
  base: "/FishiFoxCRM/",
  plugins: [react()],
  server: { port: 5173, host: true }
});