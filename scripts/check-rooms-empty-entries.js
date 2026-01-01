// scripts/check-rooms-empty-entries.js
// MB-BLUE-102.1 — 2026-01-01 (+0700)
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
  // Your rule: all JSON here are "room", but we still gate by id so we don't
  // accidentally treat config/manifests as rooms.
  return !!(json && typeof json === "object" && typeof json.id === "string");
}

function isUsableEntry(e) {
  if (!e || typeof e !== "object") return false;
  // minimal: any content field present
  return (
    typeof e.text === "string" ||
    typeof e.prompt === "string" ||
    typeof e.content === "string" ||
    typeof e.audio === "string" ||
    (e.audio && typeof e.audio === "object") ||
    typeof e.title === "string"
  );
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[empty-entries] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = walkJsonFiles(DATA_DIR);
  console.log(`[empty-entries] Scanning ${files.length} JSON files under public/data ...`);

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
