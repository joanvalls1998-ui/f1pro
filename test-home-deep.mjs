import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.HOME + "/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
});

const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

const failed404 = [];

page.on("response", (resp) => {
  if (resp.status() >= 400) {
    failed404.push(`${resp.status()} ${resp.url()}`);
  }
});

console.log("=== Deep inspection of F1Pro home page ===\n");

await page.goto("https://f1pro.netlify.app", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(4000);

// Check weather section specifically
console.log("=== Weather section ===");
const weatherEls = await page.locator(".line-clamp-2, [class*='text-sm'], p[class*='text']").all();
for (const el of weatherEls.slice(0, 30)) {
  const text = await el.textContent();
  const visible = await el.isVisible();
  if (text && text.trim()) {
    console.log(`  [visible=${visible}] "${text.trim()}"`);
  }
}

// Check what's in the weather summary area
const allText = await page.locator("body").innerText();
const lines = allText.split("\n").filter(l => l.trim());
console.log("\n=== All visible text lines ===");
for (const line of lines.slice(0, 60)) {
  console.log(`  "${line}"`);
}

// Check all 404s
console.log("\n=== HTTP 4xx responses ===");
if (failed404.length === 0) {
  console.log("None captured");
} else {
  failed404.forEach((f) => console.log(`  ❌ ${f}`));
}

// Check the live session banner state
console.log("\n=== Session state ===");
const liveBanner = await page.locator("text=Session Live").isVisible().catch(() => false);
const liveNow = await page.locator("text=Live Now").isVisible().catch(() => false);
const completed = await page.locator("text=Completed").isVisible().catch(() => false);
const nextSession = await page.locator("text=Next Session").isVisible().catch(() => false);
console.log(`  Session Live banner: ${liveBanner}`);
console.log(`  'Live Now' badge: ${liveNow}`);
console.log(`  'Completed' badge: ${completed}`);
console.log(`  'Next Session' badge: ${nextSession}`);

// Check countdown values
console.log("\n=== Countdown ===");
const countdownEls = await page.locator(".font-mono").all();
for (const el of countdownEls) {
  const text = await el.textContent();
  const visible = await el.isVisible();
  if (visible && text) {
    console.log(`  mono: "${text.trim()}"`);
  }
}

// Check where Loading appears
const loadingMatches = allText.match(/Loading[^…]*/g);
if (loadingMatches) {
  console.log("\n=== Loading matches ===");
  loadingMatches.forEach(m => console.log(`  "${m}"`));
}

await browser.close();