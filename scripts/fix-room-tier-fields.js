// scripts/check-room-tiers.js
// MB-BLUE-102.1 — 2026-01-01 (+0700)
//
// ROOM TIER AUDIT (RUNNABLE, CANONICAL):
// - Scans /public/data/**/*.json
// - Tier truth = inferred from room id / filename convention (free vs vip1..vip9)
// - JSON tier fields are DEPRECATED and ignored (your design)
// - Reports:
//    - parse errors (FATAL)
//    - id↔filename drift (optional warning)
//    - expected tier distribution (from names)
//    - unknown expected tier count (rooms without free/vip tokens)
//
// Usage:
//   node scripts/check-room-tiers.js
//
// Exit codes:
//   0 = clean (no parse errors)
//   1 = parse errors found (fatal integrity failure)

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");

/** -------------------------
 * Helpers
 * ------------------------ */

function walkJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJsonFiles(p));
    else if (e.isFile() && e.name.toLowerCase().endsWith(".json")) out.push(p);
  }
  return out;
}

function safeReadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function inferTierFromIdOrFilename(idOrName) {
  const s = String(idOrName || "").trim().toLowerCase();
  const t = s.replace(/[-\s]+/g, "_");

  // vipN anywhere as a token
  const mVip = t.match(/(^|_)vip([1-9])(_|$)/);
  if (mVip) return `vip${Number(mVip[2])}`;

  // free token
  const mFree = t.match(/(^|_)free(_|$)/);
  if (mFree) return "free";

  // If neither appears, unknown (some rooms truly may be tier-less)
  return null;
}

function getRoomId(json, fallbackId) {
  const id =
    json?.id ??
    json?.room_id ??
    json?.meta?.id ??
    json?.meta?.room_id ??
    null;

  return (id || fallbackId || "").toString().trim();
}

function padRight(s, n) {
  const t = String(s);
  return t.length >= n ? t : t + " ".repeat(n - t.length);
}

function normId(x) {
  return String(x || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

/** -------------------------
 * Main
 * ------------------------ */

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[tiers] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = walkJsonFiles(DATA_DIR);
  console.log(`[tiers] Scanning ${files.length} JSON files under public/data ...`);

  const stats = {
    total: 0,
    tierCountsExpected: Object.create(null),
    unknownExpected: 0,
    idFilenameDrift: 0,
    parseErrors: 0,
  };

  const problems = [];

  for (const filePath of files) {
    stats.total++;

    const fileName = path.basename(filePath);
    const baseName = fileName.replace(/\.json$/i, "");
    const rel = path.relative(ROOT, filePath);

    let json;
    try {
      json = safeReadJson(filePath);
    } catch (e) {
      stats.parseErrors++;
      problems.push({
        type: "PARSE_ERROR",
        file: rel,
        details: (e && e.message) || String(e),
      });
      continue;
    }

    const roomId = getRoomId(json, baseName);

    // Drift is not fatal (but important signal)
    const idNorm = normId(roomId);
    const baseNorm = normId(baseName);
    if (idNorm && baseNorm && idNorm !== baseNorm) {
      stats.idFilenameDrift++;
      problems.push({
        type: "ID_FILENAME_DRIFT",
        file: rel,
        details: `json.id="${roomId}" vs filename="${baseName}"`,
      });
    }

    const expectedTier =
      inferTierFromIdOrFilename(roomId) || inferTierFromIdOrFilename(baseName);

    stats.tierCountsExpected[expectedTier || "—"] =
      (stats.tierCountsExpected[expectedTier || "—"] || 0) + 1;

    if (!expectedTier) stats.unknownExpected++;
  }

  // Print summary
  console.log("");
  console.log("[tiers] Summary");
  console.log("--------");
  console.log(`Total files:            ${stats.total}`);
  console.log(`Parse errors:           ${stats.parseErrors}`);
  console.log(`ID↔filename drift:      ${stats.idFilenameDrift}`);
  console.log(`Unknown expected tier:  ${stats.unknownExpected}`);
  console.log("");

  function printCounts(title, obj) {
    const keys = Object.keys(obj).sort((a, b) => {
      const order = (k) =>
        k === "free" ? 0 : k.startsWith("vip") ? Number(k.replace("vip", "")) : 99;
      return order(a) - order(b);
    });

    console.log(title);
    for (const k of keys) {
      console.log(`  ${padRight(k, 6)}  ${obj[k]}`);
    }
    console.log("");
  }

  printCounts("[tiers] Expected tier (from id/filename):", stats.tierCountsExpected);

  // Print problems (bounded)
  const MAX = 120;
  if (problems.length) {
    console.log(`[tiers] Problems (showing up to ${MAX}):`);
    problems.slice(0, MAX).forEach((p, i) => {
      console.log(`  ${String(i + 1).padStart(3)}. ${p.type} :: ${p.file} :: ${p.details}`);
    });
    if (problems.length > MAX) console.log(`  ... +${problems.length - MAX} more`);
    console.log("");
  }

  // Exit code rules:
  // ONLY parse errors are fatal in your design
  if (stats.parseErrors > 0) {
    console.error("[tiers] FAIL (parse errors found — JSON must be valid)");
    process.exit(1);
  }

  console.log("[tiers] OK (parse clean; tier truth is filename/id)");
  process.exit(0);
})();
