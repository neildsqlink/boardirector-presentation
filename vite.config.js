import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// `base` controls how built asset URLs are prefixed. For GitHub Pages
// at https://USER.github.io/REPO/ we need base = "/REPO/". The deploy
// workflow injects this via VITE_BASE so we don't have to hardcode the
// repo name. Locally `npm run dev` falls back to "/".
//
// Multi-page build: the root entry serves the Nimbus SummIT deck, and
// `process/` serves the "ניהול ועדות והחלטות בעידן הדיגיטלי" keynote,
// each at its own URL.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        process: resolve(__dirname, "process/index.html"),
      },
    },
  },
});
