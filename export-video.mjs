import puppeteer from "puppeteer";
import { execSync } from "child_process";
import { mkdirSync, existsSync, rmSync } from "fs";
import { resolve } from "path";

const URL = "http://localhost:5173/";
const FRAMES_DIR = resolve("./video-frames");
const OUTPUT = resolve("./presentation.mp4");
const SLIDE_DURATION = 6; // seconds per slide
const TRANSITION_WAIT = 800; // ms to wait after each transition
const FPS = 1; // 1 frame per second (ffmpeg will hold each image)
const WIDTH = 1920;
const HEIGHT = 1080;

async function main() {
  // Clean up and create frames dir
  if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true });
  mkdirSync(FRAMES_DIR, { recursive: true });

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=${WIDTH},${HEIGHT}`],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  console.log("Loading presentation...");
  await page.goto(URL, { waitUntil: "networkidle0" });
  await sleep(2000);

  // Screenshot the intro screen
  console.log("Capturing intro screen...");
  await captureSlide(page, 0, FRAMES_DIR);

  // Click to start (dismiss intro)
  await page.click("body");
  await sleep(TRANSITION_WAIT + 400);

  // Get total number of slides by reading from the page
  const totalSlides = await page.evaluate(() => {
    // Find SLIDES array length from the rendered dots or similar
    const dots = document.querySelectorAll('[data-slide-dot]');
    if (dots.length > 0) return dots.length;
    // Fallback: try to count by navigating
    return 30; // safe upper bound
  });

  console.log(`Capturing slides...`);

  // Capture first slide (after clicking intro)
  let slideIndex = 1;
  await captureSlide(page, slideIndex, FRAMES_DIR);

  // Navigate forward through all slides
  while (true) {
    slideIndex++;

    // Press ArrowLeft to go forward (RTL)
    await page.keyboard.press("ArrowLeft");
    await sleep(TRANSITION_WAIT);

    // Check if we actually advanced by taking screenshot
    const prevPath = resolve(FRAMES_DIR, `slide-${String(slideIndex - 1).padStart(3, "0")}.png`);
    const currPath = resolve(FRAMES_DIR, `slide-${String(slideIndex).padStart(3, "0")}.png`);

    await page.screenshot({ path: currPath, type: "png" });

    // Simple check: if we're at the last slide, ArrowLeft won't advance
    // We detect this by checking if the current screenshot is identical
    // For simplicity, we'll just capture a known number + stop if no change
    const prevSize = existsSync(prevPath) ? (await import("fs")).statSync(prevPath).size : 0;
    const currSize = (await import("fs")).statSync(currPath).size;

    // If screenshots are exactly the same size (rough duplicate check), we've hit the end
    if (slideIndex > 3 && Math.abs(prevSize - currSize) < 100) {
      console.log(`Reached last slide at index ${slideIndex - 1}`);
      rmSync(currPath); // remove duplicate
      break;
    }

    console.log(`  Captured slide ${slideIndex}`);

    if (slideIndex > 30) {
      console.log("Safety limit reached");
      break;
    }
  }

  const totalCaptured = slideIndex - 1;
  console.log(`\nCaptured ${totalCaptured} slides total.`);

  await browser.close();

  // Generate video with ffmpeg
  console.log("\nGenerating video with ffmpeg...");

  // Each slide image is shown for SLIDE_DURATION seconds
  const ffmpegCmd = [
    "ffmpeg -y",
    `-framerate 1/${SLIDE_DURATION}`,
    `-i "${FRAMES_DIR}/slide-%03d.png"`,
    "-vf \"scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:white,format=yuv420p\"",
    "-c:v libx264",
    "-preset slow",
    "-crf 18",
    `-r 30`,
    `"${OUTPUT}"`,
  ].join(" ");

  console.log(`Running: ${ffmpegCmd}\n`);

  try {
    execSync(ffmpegCmd, { stdio: "inherit" });
    console.log(`\nVideo exported to: ${OUTPUT}`);
    console.log(`Duration: ~${totalCaptured * SLIDE_DURATION} seconds`);
  } catch (err) {
    console.error("ffmpeg failed:", err.message);
    console.log("\nFrames saved in:", FRAMES_DIR);
    console.log("You can manually run ffmpeg to create the video.");
  }
}

async function captureSlide(page, index, dir) {
  const filename = `slide-${String(index).padStart(3, "0")}.png`;
  await page.screenshot({ path: resolve(dir, filename), type: "png" });
  console.log(`  Captured slide ${index}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch(console.error);
