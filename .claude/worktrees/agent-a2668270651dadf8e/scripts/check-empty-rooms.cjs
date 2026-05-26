// MB-BLUE-103.0 — 2026-01-01 (+0700)
//
// EMPTY ROOM AUDIT (CORRECT DEFINITION)
//
// A room is EMPTY only if it has NO CONTENT:
// - entries is empty or missing
// - AND no room_essay / content / sections / blocks / audio / text
//
// Essay-only rooms are VALID.
// Tier 7 / 8 empty rooms are ALLOWED.
//
// Usage:
//   node scripts/check-empty-rooms.js
//   npm run check:empty-rooms
//
// Optional env:
//   MB_EMPTY_ROOMS_STRICT=1   -> fail on any empty room
//
// Exit:
//   0 = OK
//   1 = FAIL (only in STRICT mode)

import fs from "fs";
import path from "path";
import process from "process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");
const STRICT = String(process.env.MB_EMPTY_ROOMS_STRICT || "") === "1";

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function hasContent(json) {
  if (!json || typeof json !== "object") return false;

  // Entries with usable content
  if (Array.isArray(json.entries) && json.entries.length > 0) return true;

  // Essay-style rooms (VALID)
  if (json.room_essay && (json.room_essay.en || json.room_essay.vi)) return true;

  // Other possible content structures
  if (Array.isArray(json.content) && json.content.length > 0) return true;
  if (Array.isArray(json.sections) && json.sections.length > 0) return true;
  if (Array.isArray(json.blocks) && json.blocks.length > 0) return true;

  // Audio / text based rooms
  if (json.audio || json.text) return true;

  return false;
}

function inferTierFromName(name) {
  const m = name.toLowerCase().match(/vip([0-9])/);
  if (!m) return null;
  return Number(m[1]);
}

(function main() {
  const files = walk(DATA_DIR);

  let total = 0;
  let emptyRooms = [];
  let parseErrors = 0;

  for (const file of files) {
    total++;
    const rel = path.relative(ROOT, file);
    const base = path.basename(file, ".json");

    let json;
    try {
      json = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      parseErrors++;
      continue;
    }

    // Only room-like JSON
    if (!json.id && !json.title && !json.entries && !json.room_essay) continue;

    if (hasContent(json)) continue;

    const tier = inferTierFromName(base);

    // Tier 7 & 8 are intentionally empty → ignore
    if (tier === 7 || tier === 8) continue;

    emptyRooms.push({
      file: rel,
      id: json.id || base,
      tier: tier ?? "unknown",
    });
  }

  console.log("");
  console.log("[empty-rooms] Summary");
  console.log("---------------------");
  console.log(`Total JSON files: ${total}`);
  console.log(`Parse errors:     ${parseErrors}`);
  console.log(`Empty rooms:     ${emptyRooms.length}`);
  console.log("");

  if (emptyRooms.length) {
    console.log("[empty-rooms] Findings:");
    emptyRooms.forEach((r, i) => {
      console.log(
        `  ${String(i + 1).padStart(3)}. EMPTY_ROOM :: ${r.file} :: id="${r.id}" tier=${r.tier}`
      );
    });
    console.log("");
  }

  if (STRICT && emptyRooms.length > 0) {
    console.error("[empty-rooms] FAIL (empty rooms found)");
    process.exit(1);
  }

  console.log("[empty-rooms] OK");
  process.exit(0);
})();
