// Build a 16:9 PPTX where each slide is a captured screenshot at full size.
// Bulletproof: works on any version of PowerPoint, any OS, no fonts needed.

import pptxgen from "pptxgenjs";
import { resolve } from "path";
import { existsSync, readdirSync } from "fs";

const FRAMES_DIR = resolve("./slide-frames");
const OUTPUT = resolve("./Boardirector-NimbusSummIT2026.pptx");

if (!existsSync(FRAMES_DIR)) {
  console.error(`Missing ${FRAMES_DIR}. Run capture-slides.mjs first.`);
  process.exit(1);
}

const files = readdirSync(FRAMES_DIR)
  .filter((f) => /^slide-\d+\.png$/.test(f))
  .sort();

if (files.length === 0) {
  console.error(`No slide-*.png files found in ${FRAMES_DIR}.`);
  process.exit(1);
}

console.log(`Building PPTX with ${files.length} slides...`);

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33" x 7.5" (16:9 widescreen)
pres.author = "Neil Dahan";
pres.title = "Boardirector — Nimbus SummIT 2026";
pres.subject = "ניהול חכם של ועדות וישיבות בעולם החדש";

const W = 13.333; // inches
const H = 7.5;

for (const file of files) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addImage({
    path: resolve(FRAMES_DIR, file),
    x: 0,
    y: 0,
    w: W,
    h: H,
  });
}

await pres.writeFile({ fileName: OUTPUT });
console.log(`✓ Wrote ${OUTPUT}`);
