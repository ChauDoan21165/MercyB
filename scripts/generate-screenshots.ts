/**
 * App Store / Play Store screenshot generator.
 *
 * Usage:
 *   npx tsx scripts/generate-screenshots.ts                    # all device classes, both locales
 *   npx tsx scripts/generate-screenshots.ts --device=iphone67  # one class
 *   npx tsx scripts/generate-screenshots.ts --locale=vi        # one locale
 *
 * Output: ./screenshots/<device>/<locale>/<n>-<slug>.png
 *
 * What this script does:
 *   1. Spins up a Playwright Chromium browser at the right device viewport.
 *   2. Navigates to a hand-picked list of routes that match A6 §3 shot list.
 *   3. Sets the locale via the language picker (or `?lang=vi` query param).
 *   4. Waits for stable layout, then `page.screenshot({ fullPage: false })`.
 *   5. Writes PNGs at the exact pixel sizes Apple / Google require.
 *
 * What this script does NOT do:
 *   - Apply caption overlays. Use Figma / Canva with copy from
 *     `docs/app-store-submission/aso-strategy.md` §3 + A6 §6.
 *   - Decide which screenshot is the "lead". See aso-strategy.md §3 for the
 *     conversion-priority order.
 *   - Replace human curation. Some routes need a logged-in seeded user;
 *     run against a staging URL with the demo reviewer account.
 *
 * Configuration via env:
 *   BASE_URL        — defaults to http://localhost:3107
 *   DEMO_EMAIL      — if set, the script signs in before navigating
 *   DEMO_PASSWORD   — paired with DEMO_EMAIL
 */

import { chromium, devices, type Page, type Browser } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3107";
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "";

interface DeviceSpec {
  /** key used in CLI args + output folder */
  id: string;
  /** human label */
  label: string;
  /** Apple/Google required pixel size */
  width: number;
  height: number;
  /** logical viewport scale factor */
  deviceScaleFactor: number;
  /** UA string */
  userAgent: string;
  /** Apple/Google submission requirement note */
  requiredFor: "ios" | "android" | "both";
}

const DEVICES: DeviceSpec[] = [
  {
    id: "iphone67",
    label: 'iPhone 6.7" (15 Pro Max)',
    width: 1290,
    height: 2796,
    deviceScaleFactor: 3,
    userAgent: devices["iPhone 15 Pro Max"]?.userAgent ?? "",
    requiredFor: "ios",
  },
  {
    id: "iphone61",
    label: 'iPhone 6.1" (15)',
    width: 1179,
    height: 2556,
    deviceScaleFactor: 3,
    userAgent: devices["iPhone 15"]?.userAgent ?? "",
    requiredFor: "ios",
  },
  {
    id: "ipad13",
    label: 'iPad 12.9"',
    width: 2048,
    height: 2732,
    deviceScaleFactor: 2,
    userAgent: devices["iPad Pro 11"]?.userAgent ?? "",
    requiredFor: "ios",
  },
  {
    id: "android-phone",
    label: "Android phone (1080p)",
    width: 1080,
    height: 1920,
    deviceScaleFactor: 3,
    userAgent: devices["Pixel 7"]?.userAgent ?? "",
    requiredFor: "android",
  },
];

interface Shot {
  /** ASO order — drives filename prefix */
  n: number;
  slug: string;
  route: string;
  /** What to wait for before screenshotting */
  waitFor?: string;
  /** Optional pre-screenshot setup (set localStorage, scroll, etc.) */
  setup?: (page: Page) => Promise<void>;
}

const SHOTS: Shot[] = [
  {
    n: 1,
    slug: "pronunciation-phoneme",
    route: "/room/kids_l1_food_lesson_1",
    waitFor: "[data-testid=phoneme-score], .phoneme-bar, h1",
  },
  { n: 2, slug: "mercy-character", route: "/" },
  { n: 3, slug: "vietnamese-cultural-example", route: "/rooms" },
  { n: 4, slug: "exam-prep-tracks", route: "/exam-prep" },
  { n: 5, slug: "rooms-grid", route: "/rooms" },
  { n: 6, slug: "account-control", route: "/account" },
  { n: 7, slug: "pricing-vnd", route: "/pricing" },
];

const LOCALES = ["vi", "en"] as const;
type Locale = (typeof LOCALES)[number];

interface Args {
  device?: string;
  locale?: Locale;
}

function parseArgs(): Args {
  const out: Args = {};
  for (const a of process.argv.slice(2)) {
    const [k, v] = a.replace(/^--/, "").split("=");
    if (k === "device" && v) out.device = v;
    if (k === "locale" && (v === "vi" || v === "en")) out.locale = v as Locale;
  }
  return out;
}

async function login(page: Page): Promise<void> {
  if (!DEMO_EMAIL || !DEMO_PASSWORD) return;
  await page.goto(`${BASE_URL}/signin`);
  await page.locator("input[type=email]").fill(DEMO_EMAIL);
  await page.locator("input[type=password]").fill(DEMO_PASSWORD);
  await page.locator("button[type=submit]").click();
  await page.waitForURL(/\/(rooms|home|account)?$/, { timeout: 15_000 }).catch(() => {
    // Login may resolve to a custom landing; ignore timeout.
  });
}

async function captureShot(
  browser: Browser,
  device: DeviceSpec,
  locale: Locale,
  shot: Shot,
): Promise<{ ok: boolean; outPath: string; error?: string }> {
  const ctx = await browser.newContext({
    viewport: { width: device.width / device.deviceScaleFactor, height: device.height / device.deviceScaleFactor },
    deviceScaleFactor: device.deviceScaleFactor,
    userAgent: device.userAgent,
    locale: locale === "vi" ? "vi-VN" : "en-US",
    extraHTTPHeaders: { "Accept-Language": locale === "vi" ? "vi-VN,vi;q=0.9" : "en-US,en;q=0.9" },
  });

  const page = await ctx.newPage();
  const outDir = path.join(process.cwd(), "screenshots", device.id, locale);
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${String(shot.n).padStart(2, "0")}-${shot.slug}.png`);

  try {
    if (DEMO_EMAIL && DEMO_PASSWORD) await login(page);
    await page.goto(`${BASE_URL}${shot.route}?lang=${locale}`, { waitUntil: "networkidle", timeout: 30_000 });
    if (shot.waitFor) {
      await page.locator(shot.waitFor).first().waitFor({ state: "visible", timeout: 10_000 }).catch(() => {
        // Soft-wait — continue even if selector doesn't appear.
      });
    }
    await page.waitForTimeout(800); // Give animations a beat to settle.
    if (shot.setup) await shot.setup(page);
    const buffer = await page.screenshot({ fullPage: false });
    await writeFile(outPath, buffer);
    return { ok: true, outPath };
  } catch (e) {
    return {
      ok: false,
      outPath,
      error: e instanceof Error ? e.message : String(e),
    };
  } finally {
    await ctx.close();
  }
}

async function main(): Promise<void> {
  const args = parseArgs();
  const targetDevices = args.device ? DEVICES.filter((d) => d.id === args.device) : DEVICES;
  const targetLocales = args.locale ? [args.locale] : LOCALES;
  if (targetDevices.length === 0) {
    console.error(`Unknown device: ${args.device}. Known: ${DEVICES.map((d) => d.id).join(", ")}`);
    process.exit(1);
  }

  console.log(
    `[screenshots] BASE_URL=${BASE_URL}  devices=${targetDevices.map((d) => d.id).join(",")}  locales=${targetLocales.join(",")}`,
  );

  const browser = await chromium.launch({ headless: true });
  let ok = 0;
  let failed = 0;

  for (const device of targetDevices) {
    for (const locale of targetLocales) {
      for (const shot of SHOTS) {
        const r = await captureShot(browser, device, locale, shot);
        if (r.ok) {
          ok++;
          console.log(`  ✓ ${device.id}/${locale}/${String(shot.n).padStart(2, "0")}-${shot.slug}.png`);
        } else {
          failed++;
          console.warn(`  ✗ ${device.id}/${locale}/${shot.slug} — ${r.error}`);
        }
      }
    }
  }

  await browser.close();
  console.log(`\n[screenshots] done · ${ok} captured · ${failed} failed`);
  process.exit(failed === 0 ? 0 : 2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
