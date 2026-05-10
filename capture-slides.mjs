// Capture all 17 slides from the live React deck as PNG screenshots.
// AI animation slides are captured at their peak visual frame.
//
// Usage:
//   1. Make sure `npm run dev` is running (defaults to localhost:5175)
//   2. node capture-slides.mjs

import puppeteer from "puppeteer";
import { mkdirSync, existsSync, rmSync } from "fs";
import { resolve } from "path";

const URL = process.env.DECK_URL || "http://localhost:5175/";
const FRAMES_DIR = resolve("./slide-frames");
// 16:9 capture. Smaller than the browser-design viewport (1920) so content
// fills more of the frame — PowerPoint upscales to the slide size.
const WIDTH = 1600;
const HEIGHT = 900;
const ENTER_WAIT = 1700; // ms — let entrance animations finish

// Slides 11 (meeting-page-ai) and 12 (meeting-book-chat) are 0-indexed 10 and 11
// after the intro is dismissed. Hold extra time so the AI animation reaches a
// visually-rich frame.
const AI_HOLD = {
  10: 5800, // meeting-page-ai: 4 of 5 agenda items checked, cursor on next
  11: 8200, // meeting-book-chat: full conversation visible (during pause phase)
};

const TOTAL_SLIDES = 17;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true });
  mkdirSync(FRAMES_DIR, { recursive: true });

  console.log(`Launching headless browser at ${URL}`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=${WIDTH},${HEIGHT}`, "--font-render-hinting=none"],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });

  // Hide presentation chrome and tighten slide padding so content fills more
  // of the frame. Live deck stays untouched — these styles are only injected
  // for capture.
  await page.addStyleTag({
    content: `
      [data-export-hide="true"] { display: none !important; }
      [data-slide-wrap="true"] {
        padding: 22px 40px 64px 40px !important;
      }
      /* Push every slide's inner container wider so content fills the frame.
         Inline max-width values are designed for browser viewing — for export
         we want them to expand. */
      [data-slide-wrap="true"] > div {
        max-width: min(1480px, 95vw) !important;
      }
    `,
  });

  // Wait for fonts to load
  await page.evaluateHandle("document.fonts.ready");
  await sleep(1500);

  // Click to dismiss intro screen and start
  await page.click("body");
  await sleep(900);

  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const wait = AI_HOLD[i] ?? ENTER_WAIT;
    const label = String(i + 1).padStart(2, "0");
    console.log(`  slide ${label} — wait ${wait}ms`);

    await sleep(wait);

    const out = resolve(FRAMES_DIR, `slide-${label}.png`);
    await page.screenshot({ path: out, type: "png", omitBackground: false });

    // Advance to next slide (RTL: ArrowLeft moves forward)
    if (i < TOTAL_SLIDES - 1) {
      await page.keyboard.press("ArrowLeft");
      // Slide transition animation is 600ms; small extra buffer
      await sleep(700);
    }
  }

  await browser.close();
  console.log(`\nDone. ${TOTAL_SLIDES} screenshots in ${FRAMES_DIR}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
