import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// `base` controls how built asset URLs are prefixed. For GitHub Pages
// at https://USER.github.io/REPO/ we need base = "/REPO/". The deploy
// workflow injects this via VITE_BASE so we don't have to hardcode the
// repo name. Locally `npm run dev` falls back to "/".
//
// Multi-page build:
//   /          → the "ניהול ועדות והחלטות" process keynote (root)
//   /process/  → same keynote (kept so earlier links keep working)
//   /nimbus/   → the older Nimbus SummIT deck
//   /ramatgan/ → municipal pitch deck (עיריית רמת גן · Live Pitch 2026)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        process: resolve(__dirname, "process/index.html"),
        nimbus: resolve(__dirname, "nimbus/index.html"),
        ramatgan: resolve(__dirname, "ramatgan/index.html"),
      },
    },
  },
});
