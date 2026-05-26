/**
 * scripts/track-bundle-size.ts
 *
 * Measures the production bundle, compares to the most recent baseline
 * in `bundle-size-history.json`, and either WARNS (default) or FAILS
 * (when run with `--strict`) if any chunk grew more than the budget.
 *
 * Run AFTER `vite build` so dist/ is populated.
 *
 *   npx tsx scripts/track-bundle-size.ts          # warn-only
 *   npx tsx scripts/track-bundle-size.ts --strict # fail on growth
 *   npx tsx scripts/track-bundle-size.ts --record # append to history
 *
 * Companion: src/config/perfBudget.ts (BUNDLE_BUDGET).
 */

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename } from "node:path";

interface ChunkSize {
  name: string;
  bytes: number;
}

interface HistoryRecord {
  date: string;
  total_bytes: number;
  chunks: ChunkSize[];
}

const DIST_DIR = join(process.cwd(), "dist");
const ASSETS_DIR = join(DIST_DIR, "assets");
const HISTORY_FILE = join(process.cwd(), "bundle-size-history.json");

// Inlined from src/config/perfBudget.ts so this script doesn't need to
// load the React/Vite tooling chain.
const BUDGET = {
  totalBytes: 500 * 1024,
  perChunkBytes: 200 * 1024,
  warnGrowthPercent: 5,
};

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const strict = args.has("--strict");
  const record = args.has("--record");

  if (!existsSync(ASSETS_DIR)) {
    console.error(`[bundle-size] ${ASSETS_DIR} not found. Run 'vite build' first.`);
    process.exit(strict ? 1 : 0);
  }

  const chunks = await collectChunks(ASSETS_DIR);
  const totalBytes = chunks.reduce((s, c) => s + c.bytes, 0);

  console.log(`\n[bundle-size] ${chunks.length} chunks · total ${formatBytes(totalBytes)}\n`);

  // Top 10 largest, for quick eyeball.
  const top = [...chunks].sort((a, b) => b.bytes - a.bytes).slice(0, 10);
  for (const c of top) {
    const flag = c.bytes > BUDGET.perChunkBytes ? "⚠ " : "  ";
    console.log(`${flag}${formatBytes(c.bytes).padStart(10)}  ${c.name}`);
  }

  const overTotalBudget = totalBytes > BUDGET.totalBytes;
  const overPerChunk = chunks.filter((c) => c.bytes > BUDGET.perChunkBytes);
  const baseline = await loadBaseline();
  const growthIssues = baseline ? compareToBaseline(chunks, baseline) : [];

  console.log("");
  if (overTotalBudget) {
    console.warn(
      `[bundle-size] WARN: total ${formatBytes(totalBytes)} exceeds budget ${formatBytes(BUDGET.totalBytes)}`,
    );
  }
  for (const c of overPerChunk) {
    console.warn(
      `[bundle-size] WARN: chunk ${c.name} (${formatBytes(c.bytes)}) exceeds per-chunk budget ${formatBytes(BUDGET.perChunkBytes)}`,
    );
  }
  for (const issue of growthIssues) {
    console.warn(`[bundle-size] WARN: ${issue}`);
  }

  if (record) {
    await appendHistory({
      date: new Date().toISOString(),
      total_bytes: totalBytes,
      chunks: chunks.map((c) => ({ name: stripHash(c.name), bytes: c.bytes })),
    });
    console.log(`[bundle-size] recorded baseline → ${HISTORY_FILE}`);
  }

  const failures = strict
    ? overTotalBudget || overPerChunk.length > 0 || growthIssues.length > 0
    : false;

  if (failures) {
    console.error("\n[bundle-size] FAIL (strict mode): budget exceeded.");
    process.exit(1);
  }
  console.log("\n[bundle-size] OK.");
}

async function collectChunks(dir: string): Promise<ChunkSize[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: ChunkSize[] = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!/\.(js|css)$/.test(e.name)) continue;
    if (/\.map$/.test(e.name)) continue;
    const full = join(dir, e.name);
    const s = await stat(full);
    out.push({ name: e.name, bytes: s.size });
  }
  return out;
}

interface Baseline {
  total_bytes: number;
  chunks: Map<string, number>;
}

async function loadBaseline(): Promise<Baseline | null> {
  if (!existsSync(HISTORY_FILE)) return null;
  try {
    const raw = await readFile(HISTORY_FILE, "utf-8");
    const data = JSON.parse(raw) as HistoryRecord[];
    if (!Array.isArray(data) || data.length === 0) return null;
    const latest = data[data.length - 1];
    const map = new Map<string, number>();
    for (const c of latest.chunks) map.set(c.name, c.bytes);
    return { total_bytes: latest.total_bytes, chunks: map };
  } catch (err) {
    console.warn("[bundle-size] could not read baseline:", err);
    return null;
  }
}

async function appendHistory(record: HistoryRecord): Promise<void> {
  let history: HistoryRecord[] = [];
  if (existsSync(HISTORY_FILE)) {
    try {
      const raw = await readFile(HISTORY_FILE, "utf-8");
      history = JSON.parse(raw) as HistoryRecord[];
      if (!Array.isArray(history)) history = [];
    } catch {
      history = [];
    }
  }
  history.push(record);
  // Cap to last 90 entries — that's ~3 months of daily builds.
  if (history.length > 90) history = history.slice(-90);
  await writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function compareToBaseline(chunks: ChunkSize[], baseline: Baseline): string[] {
  const issues: string[] = [];
  const totalGrowth = ((chunks.reduce((s, c) => s + c.bytes, 0) - baseline.total_bytes) / baseline.total_bytes) * 100;
  if (totalGrowth > BUDGET.warnGrowthPercent) {
    issues.push(
      `total bundle grew ${totalGrowth.toFixed(1)}% vs last baseline (${formatBytes(baseline.total_bytes)} → ${formatBytes(chunks.reduce((s, c) => s + c.bytes, 0))})`,
    );
  }
  for (const c of chunks) {
    const stripped = stripHash(c.name);
    const prev = baseline.chunks.get(stripped);
    if (!prev) continue;
    const growth = ((c.bytes - prev) / prev) * 100;
    if (growth > BUDGET.warnGrowthPercent) {
      issues.push(
        `chunk ${stripped} grew ${growth.toFixed(1)}% (${formatBytes(prev)} → ${formatBytes(c.bytes)})`,
      );
    }
  }
  return issues;
}

function stripHash(name: string): string {
  // Vite emits files like `index.A1b2C3.js`. Drop the hash so we can
  // compare across builds.
  return basename(name).replace(/\.[A-Za-z0-9_-]{6,12}\.(js|css)$/, ".$1");
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

void main();
