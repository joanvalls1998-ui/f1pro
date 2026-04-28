import { chromium } from "playwright";

const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HOME + "/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); // iPhone 14 Pro
const page = await context.newPage();

const errors = [];
const consoleErrors = [];
const networkFails = [];

// Capture console errors
page.on("console", (msg) => {
  if (msg.type() === "error") {
    consoleErrors.push(msg.text());
  }
});

// Capture failed requests
page.on("requestfailed", (req) => {
  networkFails.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
});

// Capture page errors
page.on("pageerror", (err) => {
  errors.push(`PAGEERROR: ${err.message}`);
});

console.log("=== Visiting https://f1pro.netlify.app ===\n");

await page.goto("https://f1pro.netlify.app", { waitUntil: "networkidle", timeout: 30000 });

// Wait a bit for any delayed JS
await page.waitForTimeout(3000);

// Check title
const title = await page.title();
console.log(`Title: ${title}`);

// Check key elements exist
const checks = [
  { selector: "text=F1Pro", name: "App title" },
  { selector: "text=Miami GP", name: "GP name" },
  { selector: "text=DIES", name: "Countdown days label" },
  { selector: "text=HORES", name: "Countdown hours label" },
  { selector: "text=MINS", name: "Countdown minutes label" },
  { selector: "text=SEGS", name: "Countdown seconds label" },
  { selector: "text=Drivers Championship", name: "Standings section" },
  { selector: "text=Kimi Antonelli", name: "P1 driver" },
  { selector: "text=George Russell", name: "P2 driver" },
  { selector: "text=Charles Leclerc", name: "P3 driver" },
  { selector: "text=Lando Norris", name: "P4 driver" },
  { selector: "text=Oscar Piastri", name: "P5 driver" },
  { selector: "text=Practice 1", name: "FP1 session" },
  { selector: "text=Sprint Qualifying", name: "SQ session" },
  { selector: "text=Qualifying", name: "QUAL session" },
  { selector: "text=Race", name: "Race session" },
  { selector: "text=Latest News", name: "News section" },
  { selector: "text=Antonelli claims", name: "News item 1" },
  { selector: "text=Calendar →", name: "Calendar link" },
  { selector: "text=Standings →", name: "Standings link" },
  { selector: "text=All News →", name: "News link" },
  { selector: "nav >> text=Live", name: "Live nav tab" },
  { selector: "nav >> text=Weather", name: "Weather nav tab" },
  { selector: "nav >> text=Circuits", name: "Circuits nav tab" },
  { selector: "nav >> text=Classificació", name: "Classificació tab" },
  { selector: "text=72", name: "P1 points" },
  { selector: "text=Loading…", name: "Loading indicator present" },
];

console.log("\n=== Element Checks ===");
for (const check of checks) {
  try {
    const found = await page.locator(check.selector).first().isVisible({ timeout: 3000 });
    if (check.name === "Loading indicator present") {
      if (found) {
        console.log(`⚠️  MEDIUM: "${check.name}" still visible after 3s (stuck loading)`);
      } else {
        console.log(`✅  "${check.name}" not visible (good)`);
      }
    } else {
      console.log(found ? `✅  "${check.name}" found` : `❌  "${check.name}" NOT FOUND`);
    }
  } catch (e) {
    if (check.name === "Loading indicator present") {
      console.log(`✅  "${check.name}" not found (no stuck loading)`);
    } else {
      console.log(`❌  "${check.name}" — ERROR: ${e.message.split("\n")[0]}`);
    }
  }
}

// Check countdown numbers are non-zero (or zero if past)
const countdownNumbers = await page.locator("text=/^\\d{2}$/").all();
console.log(`\nCountdown numbers found: ${countdownNumbers.length}`);

// Check navigation links
console.log("\n=== Navigation Links ===");
const navLinks = await page.locator("nav a").all();
for (const link of navLinks) {
  const href = await link.getAttribute("href");
  const text = await link.textContent();
  console.log(`  ${text?.trim()}: ${href}`);
}

// Check news links
console.log("\n=== News Cards ===");
const newsCards = await page.locator("a[href='#']").all();
console.log(`News cards with href='#': ${newsCards.length} (all are dead links)`);

// Check if weather component loaded
const weatherText = await page.locator("text=/Miami|Weather|Loading/i").first().textContent().catch(() => null);
console.log(`\nWeather section text: "${weatherText}"`);

// Check for any visible error banners
const errorBanners = await page.locator("text=/error|Error|failed|Failed/i").all();
console.log(`\nError text elements found: ${errorBanners.length}`);

// Check for any API failures in network
console.log("\n=== Network Failures ===");
if (networkFails.length === 0) {
  console.log("None");
} else {
  networkFails.forEach((f) => console.log(`  ❌ ${f}`));
}

console.log("\n=== Console Errors ===");
if (consoleErrors.length === 0) {
  console.log("None");
} else {
  consoleErrors.forEach((e) => console.log(`  ❌ ${e}`));
}

console.log("\n=== Page Errors ===");
if (errors.length === 0) {
  console.log("None");
} else {
  errors.forEach((e) => console.log(`  ❌ ${e}`));
}

// Try clicking some key links
console.log("\n=== Clickable Links Test ===");
const clickableSelectors = [
  { selector: "text=Calendar →", name: "Calendar link" },
  { selector: "text=Standings →", name: "Standings link" },
  { selector: "nav >> text=Weather", name: "Weather nav tab" },
  { selector: "nav >> text=Circuits", name: "Circuits nav tab" },
  { selector: "nav >> text=Classificació", name: "Classificació tab" },
];

for (const click of clickableSelectors) {
  try {
    await page.locator(click.selector).first().click({ timeout: 3000 });
    await page.waitForTimeout(500);
    const url = page.url();
    console.log(`✅  "${click.name}" → navigated to ${url}`);
    await page.goBack({ timeout: 5000 });
  } catch (e) {
    console.log(`❌  "${click.name}" — ERROR: ${e.message.split("\n")[0]}`);
  }
}

console.log("\n=== Loading State Check ===");
const loadingEl = await page.locator("text=Loading…").first().isVisible().catch(() => false);
console.log(loadingEl ? "⚠️  STUCK: 'Loading…' still visible" : "✅  No stuck loading indicator");

await browser.close();