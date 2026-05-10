import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` controls how built asset URLs are prefixed. For GitHub Pages
// at https://USER.github.io/REPO/ we need base = "/REPO/". The deploy
// workflow injects this via VITE_BASE so we don't have to hardcode the
// repo name. Locally `npm run dev` falls back to "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
});
