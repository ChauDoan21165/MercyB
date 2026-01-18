// scripts/check-rooms-empty-entries.js
// MB-BLUE-102.2 — 2026-01-15 (+0700)
//
// ROOM ENTRIES AUDIT (RUNNABLE):
// Rule: A "room" is a JSON that has an "id" (string).
// For THIS APP, rooms must use "entries".
// - Missing entries / empty entries => FAIL by default
//
// Usage:
//   node scripts/check-rooms-empty-entries.js
//   npm run check:empty-entries
//
// Optional env:
//   MB_EMPTY_ENTRIES_STRICT=1  -> same as default (kept for symmetry)
//
// Exit codes:
//   0 = OK
//   1 = FAIL (parse errors OR empty/missing entries)

import fs from "fs";
import path from "path";
import process from "process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");

function walkJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJsonFiles(p));
    else if (e.isFile() && e.name.toLowerCase().endsWith(".json")) out.push(p);
  }
  return out;
}

function safeReadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getRoomId(json, fallback) {
  const id =
    json?.id ??
    json?.room_id ??
    json?.meta?.id ??
    json?.meta?.room_id ??
    fallback ??
    "";
  return String(id).trim();
}

function isRoomJson(json) {
  // Keep narrow: only treat objects with string id as rooms.
  return !!(json && typeof json === "object" && typeof json.id === "string");
}

// -----------------------------
// Entry usability (wide but safe)
// -----------------------------
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function hasBilingualPair(obj) {
  if (!obj || typeof obj !== "object") return false;
  return isNonEmptyString(obj.en) && isNonEmptyString(obj.vi);
}

function pickBilingualFromEntry(entry) {
  if (!entry || typeof entry !== "object") return false;

  // Modern nested containers used in Mercy Blade room JSONs
  const nestedKeys = ["content", "copy", "text", "body", "prompt", "script"];
  for (const k of nestedKeys) {
    if (hasBilingualPair(entry[k])) return true;
  }

  // Legacy flat keys some scripts/rooms may still use
  const flatPairs = [
    ["content_en", "content_vi"],
    ["text_en", "text_vi"],
    ["copy_en", "copy_vi"],
    ["prompt_en", "prompt_vi"],
    ["body_en", "body_vi"],
  ];
  for (const [a, b] of flatPairs) {
    if (isNonEmptyString(entry[a]) && isNonEmptyString(entry[b])) return true;
  }

  return false;
}

function hasAnyAudio(entry) {
  if (!entry || typeof entry !== "object") return false;

  // Common audio key names in this repo
  const keys = [
    "audio",
    "audio_en",
    "audio_vi",
    "mp3",
    "mp3_en",
    "mp3_vi",
    "audioUrl",
    "audio_url",
  ];

  for (const k of keys) {
    if (isNonEmptyString(entry[k])) return true;
  }

  // Tolerate nested audio objects (rare)
  if (entry.audio && typeof entry.audio === "object") {
    if (isNonEmptyString(entry.audio.en) || isNonEmptyString(entry.audio.vi)) return true;
    if (isNonEmptyString(entry.audio.url)) return true;
  }

  return false;
}

function isUsableEntry(e) {
  if (!e || typeof e !== "object") return false;

  // ✅ Usable if bilingual text exists OR any audio reference exists.
  if (pickBilingualFromEntry(e) || hasAnyAudio(e)) return true;

  // Fallback: title-only entries are NOT enough.
  // But allow a minimal single-language string content in rare legacy rooms.
  // (keeps backward compatibility without letting empty shells pass)
  if (isNonEmptyString(e.text) || isNonEmptyString(e.prompt) || isNonEmptyString(e.content)) {
    return true;
  }

  return false;
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[empty-entries] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = walkJsonFiles(DATA_DIR);
  console.log(
    `[empty-entries] Scanning ${files.length} JSON files under public/data ...`
  );

  const stats = {
    totalFiles: files.length,
    parseErrors: 0,
    roomLike: 0,
    nonRoomIgnored: 0,
    roomsWithoutEntries: 0,
    roomsWithUnusableEntries: 0,
  };

  const findings = [];

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath);
    const base = path.basename(filePath).replace(/\.json$/i, "");

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

    if (!isRoomJson(json)) {
      stats.nonRoomIgnored++;
      continue;
    }

    stats.roomLike++;
    const id = getRoomId(json, base);

    const entries = json.entries;

    if (!Array.isArray(entries) || entries.length === 0) {
      stats.roomsWithoutEntries++;
      findings.push({
        type: "ROOM_WITHOUT_ENTRIES",
        file: rel,
        details: `id="${id}" entries=${Array.isArray(entries) ? "[]" : "missing"}`,
      });
      continue;
    }

    const usable = entries.filter(isUsableEntry).length;
    if (usable === 0) {
      stats.roomsWithUnusableEntries++;
      findings.push({
        type: "ROOM_ENTRIES_NOT_USABLE",
        file: rel,
        details: `id="${id}" entries=${entries.length}, usable=0`,
      });
    }
  }

  console.log("");
  console.log("[empty-entries] Summary");
  console.log("----------------------");
  console.log(`Total JSON files:            ${stats.totalFiles}`);
  console.log(`Parse errors (HARD FAIL):    ${stats.parseErrors}`);
  console.log(`Room-like JSON detected:     ${stats.roomLike}`);
  console.log(`Non-room JSON ignored:       ${stats.nonRoomIgnored}`);
  console.log(`Rooms without entries:       ${stats.roomsWithoutEntries}`);
  console.log(`Rooms with unusable entries: ${stats.roomsWithUnusableEntries}`);
  console.log("");

  const MAX = 160;
  if (findings.length) {
    console.log(`[empty-entries] Findings (showing up to ${MAX}):`);
    findings.slice(0, MAX).forEach((f, i) => {
      console.log(
        `  ${String(i + 1).padStart(3)}. ${f.type} :: ${f.file} :: ${f.details}`
      );
    });
    if (findings.length > MAX) console.log(`  ... +${findings.length - MAX} more`);
    console.log("");
  }

  const fail =
    stats.parseErrors > 0 ||
    stats.roomsWithoutEntries > 0 ||
    stats.roomsWithUnusableEntries > 0;

  if (fail) {
    console.error("[empty-entries] FAIL (room structural issues found)");
    process.exit(1);
  }

  console.log("[empty-entries] OK (all rooms have usable entries)");
  process.exit(0);
})();
