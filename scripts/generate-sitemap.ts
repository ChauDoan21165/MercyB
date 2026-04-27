/**
 * Generate public/sitemap.xml at build time.
 *
 * The sitemap is built from the same TS data files the app reads at
 * runtime, so the URL list is guaranteed to match the routes that
 * actually resolve. Run via tsx (added to package.json scripts).
 *
 * Usage:
 *   npx tsx scripts/generate-sitemap.ts
 *
 * Wired into the build pipeline through the `generate:sitemap` npm
 * script, which is invoked by the `build` chain in package.json.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateSitemap, buildSitemapUrls } from "../src/lib/seo/generateSitemap";

const xml = generateSitemap();
const urls = buildSitemapUrls();
const outPath = resolve(process.cwd(), "public/sitemap.xml");
writeFileSync(outPath, xml, "utf8");

console.log(`[sitemap] wrote ${urls.length} URLs to ${outPath}`);
