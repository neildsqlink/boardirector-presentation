// Combine the 17 slide screenshots into a single 16:9 PDF.

import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import { existsSync, readdirSync } from "fs";
import { resolve } from "path";

const FRAMES_DIR = resolve("./slide-frames");
const OUTPUT = resolve("./Boardirector-NimbusSummIT2026.pdf");

// 16:9 page (1920x1080 → 1920px / 72 dpi → 26.67in × 15in, but we'll use
// natural pixel dimensions so 1 image px = 1 PDF point at 72dpi)
const PAGE_W = 1920;
const PAGE_H = 1080;

if (!existsSync(FRAMES_DIR)) {
  console.error(`Missing ${FRAMES_DIR}. Run capture-slides.mjs first.`);
  process.exit(1);
}

const files = readdirSync(FRAMES_DIR)
  .filter((f) => /^slide-\d+\.png$/.test(f))
  .sort();

console.log(`Building PDF with ${files.length} slides...`);

const pdf = await PDFDocument.create();
pdf.setTitle("Boardirector — Nimbus SummIT 2026");
pdf.setAuthor("Neil Dahan");
pdf.setSubject("ניהול חכם של ועדות וישיבות בעולם החדש");

for (const file of files) {
  const bytes = await readFile(resolve(FRAMES_DIR, file));
  const img = await pdf.embedPng(bytes);
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawImage(img, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
}

const out = await pdf.save();
await writeFile(OUTPUT, out);
console.log(`✓ Wrote ${OUTPUT} (${(out.length / 1024 / 1024).toFixed(2)} MB)`);
