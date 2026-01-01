// scripts/check-room-tiers.js
// MB-BLUE-102.1 — 2026-01-01 (+0700)
//
// ROOM TIER AUDIT (RUNNABLE):
// - Scans /public/data/**/*.json
// - Detects JSON parse errors (HARD FAIL)
// - Detects id↔filename drift (HARD FAIL by default)
// - Tier mismatches are INFO only (your design: tier truth lives elsewhere)
//
// Usage:
//   node scripts/check-room-tiers.js
//   npm run check:tiers
//
// Optional env:
//   MB_TIERS_STRICT=1         -> treat tier mismatches as FAIL
//   MB_TIERS_ALLOW_ID_DRIFT=1 -> do NOT fail on id↔filename drift
//
// Exit codes:
//   0 = OK (no structural errors)
//   1 = FAIL (parse errors OR (id drift unless allowed) OR (strict mismatches))

import fs from "fs";
import path from "path";
import process from "process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");

// If this folder ever reappears, we still ignore it (design truth: it should not exist)
const BAD_SUBDIR = `${path.sep}public${path.sep}data${path.sep}paths${path.sep}`;

const STRICT = String(process.env.MB_TIERS_STRICT || "") === "1";
const ALLOW_ID_DRIFT = String(process.env.MB_TIERS_ALLOW_ID_DRIFT || "") === "1";

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

function normalizeTier(v) {
  if (v == null) return null;

  // numeric: 0..9
  if (typeof v === "number" && Number.isFinite(v)) {
    if (v === 0) return "free";
    if (v >= 1 && v <= 9) return `vip${v}`;
    return null;
  }

  const s = String(v).trim();
  if (!s) return null;

  const low = s.toLowerCase();

  if (low === "free" || low === "f" || low === "tier_free") return "free";

  // vip3 / VIP3 / vip-3 / vip 3
  if (low.includes("vip")) {
    const m = low.match(/vip\s*[-_ ]*([1-9])/);
    if (m) return `vip${Number(m[1])}`;
    const n = Number(low.replace(/[^0-9]/g, ""));
    if (n >= 1 && n <= 9) return `vip${n}`;
  }

  // tier 0..9
  const mTier = low.match(/tier\s*[-_ ]*([0-9]+)/);
  if (mTier) {
    const n = Number(mTier[1]);
    if (n === 0) return "free";
    if (n >= 1 && n <= 9) return `vip${n}`;
  }

  return null;
}

function inferTierFromIdOrFilename(value) {
  const s = String(value || "").trim().toLowerCase();
  const t = s.replace(/[-\s]+/g, "_");

  const mVip = t.match(/(^|_)vip([1-9])(_|$)/);
  if (mVip) return `vip${Number(mVip[2])}`;

  const mFree = t.match(/(^|_)free(_|$)/);
  if (mFree) return "free";

  return null;
}

function getRoomId(json, fallbackId) {
  const id =
    json?.id ??
    json?.room_id ??
    json?.meta?.id ??
    json?.meta?.room_id ??
    fallbackId ??
    "";
  return String(id).trim();
}

function getTierFromJson(json) {
  const candidates = [
    json?.tier,
    json?.access_tier,
    json?.meta?.tier,
    json?.meta?.access_tier,
    json?.meta?.tier_id,
    json?.access?.tier,
    json?.access?.tier_id,
  ];

  for (const c of candidates) {
    const t = normalizeTier(c);
    if (t) return { tier: t, raw: c };
  }
  return { tier: null, raw: null };
}

function normId(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[tiers] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  // collect files + exclude the wrong folder if present
  const files = walkJsonFiles(DATA_DIR).filter((p) => !p.includes(BAD_SUBDIR));

  console.log(`[tiers] Scanning ${files.length} JSON files under public/data ...`);

  const stats = {
    total: 0,
    parseErrors: 0,
    idFilenameDrift: 0,
    tierMismatchesInfo: 0,
    tierMismatchesStrict: 0,
  };

  const findings = [];

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
      findings.push({
        type: "PARSE_ERROR",
        file: rel,
        details: e?.message || String(e),
      });
      continue;
    }

    const roomId = getRoomId(json, baseName);

    // drift check
    if (normId(roomId) !== normId(baseName)) {
      stats.idFilenameDrift++;
      findings.push({
        type: "ID_FILENAME_DRIFT",
        file: rel,
        details: `json.id="${roomId}" vs filename="${baseName}"`,
      });
    }

    // Tier mismatch is INFO by default (STRICT optional)
    const expected =
      inferTierFromIdOrFilename(roomId) || inferTierFromIdOrFilename(baseName);

    const { tier: actualNorm, raw: actualRaw } = getTierFromJson(json);

    // report mismatch only if both known AND differ
    if (expected && actualNorm && expected !== actualNorm) {
      if (STRICT) stats.tierMismatchesStrict++;
      else stats.tierMismatchesInfo++;

      findings.push({
        type: STRICT ? "TIER_MISMATCH_STRICT" : "TIER_MISMATCH_INFO",
        file: rel,
        details: `expected=${expected}, json=${actualNorm} (raw=${JSON.stringify(
          actualRaw
        )})`,
      });
    }
  }

  console.log("");
  console.log("[tiers] Summary");
  console.log("--------");
  console.log(`Total files:         ${stats.total}`);
  console.log(`Parse errors:        ${stats.parseErrors}`);
  console.log(
    `ID↔filename drift:   ${stats.idFilenameDrift}${
      ALLOW_ID_DRIFT ? " (allowed)" : ""
    }`
  );
  console.log(
    `Tier mismatches:     ${
      STRICT
        ? `${stats.tierMismatchesStrict} (STRICT)`
        : `${stats.tierMismatchesInfo} (INFO)`
    }`
  );
  console.log("");

  const MAX = 120;
  if (findings.length) {
    console.log(`[tiers] Findings (showing up to ${MAX}):`);
    findings.slice(0, MAX).forEach((p, i) => {
      console.log(
        `  ${String(i + 1).padStart(3)}. ${p.type} :: ${p.file} :: ${p.details}`
      );
    });
    if (findings.length > MAX)
      console.log(`  ... +${findings.length - MAX} more`);
    console.log("");
  }

  // HARD FAIL conditions
  const failParse = stats.parseErrors > 0;
  const failDrift = !ALLOW_ID_DRIFT && stats.idFilenameDrift > 0;
  const failStrict = STRICT && stats.tierMismatchesStrict > 0;

  if (failParse || failDrift || failStrict) {
    console.error("[tiers] FAIL (structural integrity errors)");
    process.exit(1);
  }

  console.log("[tiers] OK (structural integrity clean)");
  process.exit(0);
})();
