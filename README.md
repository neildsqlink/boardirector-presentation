# Boardirector — Nimbus SummIT 2026

Live deck: **https://neildsqlink.github.io/nimbus2026/**

15-minute keynote on smart committee + meeting management, presented at Nimbus SummIT 2026 by Neil Dahan, VP Product, Boardirector (SQLink Group).

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173/
```

Navigate with `←` / `→` arrows or click. Press `P` for autoplay.

## Build

```bash
npm run build        # dist/ ready for static hosting
npm run preview      # preview the production build
```

## Regenerate exports (PPTX + PDF)

The repo doesn't ship the generated PPTX/PDF binaries — they're produced on demand:

```bash
npm run dev &                  # capture script needs the dev server running
node capture-slides.mjs        # captures 17 PNGs at 1600x900 from the live deck
node build-pptx.mjs            # image-based PPTX (bulletproof)
node build-pptx-native.mjs     # native shapes PPTX (editable)
node build-pdf.mjs             # PDF fallback
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml` which builds and publishes to GitHub Pages.

## Stack

React 19 + Vite 7. Single-file presentation in `presentation-nimbus.jsx`. RTL Hebrew, 17 slides, custom AI animations (rotating conic-gradient border, typewriter chat).
