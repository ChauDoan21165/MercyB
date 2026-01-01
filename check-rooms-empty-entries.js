// scripts/check-empty-rooms.js
// MB-BLUE-102.1 — 2026-01-01 (+0700)
//
// EMPTY ROOM AUDIT (RUNNABLE):
// - Scans public/data/**/*.json
// - HARD FAIL on JSON parse errors
// - Detects "room-like" JSON
// - Defines EMPTY ROOM = NO usable content anywhere:
//     - no usable entries
//     - no room_essay (en/vi) text
//     - no content (en/vi) text
//     - no days[] content/audio (for path-style rooms)
//     - no other common text payloads (intro/essay/body/sections)
//
// Usage:
//   node scripts/check-empty-rooms.js
//   npm run check:empty-rooms
//
// Optional env:
//   MB_EMPTY_ROOMS_STRICT=1  -> exit 1 if any empty rooms found (default = 1 anyway)
//   MB_EMPTY_ROOMS_MAX=200   -> max findings to print (default 160)

import fs from "fs";
import path from "path";
import process from "process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");

const STRICT = String(process.env.MB_EMPTY_ROOMS_STRICT || "1") === "1";
const MAX = Number(process.env.MB_EMPTY_ROOMS_MAX || 160);

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

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function anyNonEmptyStringDeep(obj, depth = 4) {
  if (depth <= 0) return false;
  if (isNonEmptyString(obj)) return true;
  if (!obj || typeof obj !== "object") return false;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (anyNonEmptyStringDeep(item, depth - 1)) return true;
    }
    return false;
  }

  for (const k of Object.keys(obj)) {
    if (anyNonEmptyStringDeep(obj[k], depth - 1)) return true;
  }
  return false;
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

function looksRoomLike(json) {
  if (!json || typeof json !== "object") return false;
  if (!json.id && !json.room_id && !json.meta?.id && !json.meta?.room_id) return false;

  // room-ish signals
  return Boolean(
    json.title ||
      json.description ||
      json.keywords ||
      json.entries ||
      json.room_essay ||
      json.content ||
      json.days ||
      json.sections ||
      json.intro
  );
}

function isUsableEntry(e) {
  // “usable” = at least some meaningful payload for renderer
  // (text, bilingual text, audio, or prompt-like)
  if (!e || typeof e !== "object") return false;

  // common fields
  if (isNonEmptyString(e.text)) return true;
  if (isNonEmptyString(e.prompt)) return true;
  if (isNonEmptyString(e.content)) return true;

  // bilingual patterns
  if (anyNonEmptyStringDeep(e.en)) return true;
  if (anyNonEmptyStringDeep(e.vi)) return true;
  if (anyNonEmptyStringDeep(e.text_en)) return true;
  if (anyNonEmptyStringDeep(e.text_vi)) return true;

  // audio presence counts as content
  if (isNonEmptyString(e.audio)) return true;
  if (isNonEmptyString(e.audio_en)) return true;
  if (isNonEmptyString(e.audio_vi)) return true;
  if (anyNonEmptyStringDeep(e.audio)) return true;

  return false;
}

function hasUsableEntries(json) {
  const entries = json?.entries;
  if (!Array.isArray(entries) || entries.length === 0) return false;

  for (const e of entries) {
    if (isUsableEntry(e)) return true;
  }
  return false;
}

function hasRoomEssay(json) {
  const re = json?.room_essay;
  if (!re) return false;
  if (isNonEmptyString(re)) return true;
  if (isNonEmptyString(re?.en)) return true;
  if (isNonEmptyString(re?.vi)) return true;
  return false;
}

function hasTopLevelContent(json) {
  // treat these as content-bearing even if entries are empty
  const candidates = [
    json?.content,
    json?.essay,
    json?.body,
    json?.intro,
    json?.summary,
    json?.guide,
    json?.lesson,
    json?.notes,
    json?.script,
    json?.room_text,
  ];

  for (const c of candidates) {
    if (!c) continue;
    if (isNonEmptyString(c)) return true;
    if (isNonEmptyString(c?.en)) return true;
    if (isNonEmptyString(c?.vi)) return true;
    if (anyNonEmptyStringDeep(c, 3)) return true;
  }
  return false;
}

function hasPathDaysContent(json) {
  const days = json?.days;
  if (!Array.isArray(days) || days.length === 0) return false;

  // any day with audio or content text counts
  for (const d of days) {
    if (!d || typeof d !== "object") continue;

    if (anyNonEmptyStringDeep(d?.audio, 3)) return true;
    if (anyNonEmptyStringDeep(d?.content, 3)) return true;
    if (anyNonEmptyStringDeep(d, 3)) {
      // but ignore trivial id/day_index only
      const shallowKeys = Object.keys(d);
      const onlyTrivial =
        shallowKeys.length <= 2 && shallowKeys.every((k) => k === "id" || k === "day_index");
      if (!onlyTrivial) return true;
    }
  }
  return false;
}

function hasSectionsContent(json) {
  const s = json?.sections;
  if (!Array.isArray(s) || s.length === 0) return false;
  return anyNonEmptyStringDeep(s, 4);
}

function hasAnyRealContent(json) {
  return (
    hasUsableEntries(json) ||
    hasRoomEssay(json) ||
    hasTopLevelContent(json) ||
    hasPathDaysContent(json) ||
    hasSectionsContent(json)
  );
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[empty-rooms] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = walkJsonFiles(DATA_DIR);
  console.log(`[empty-rooms] Scanning ${files.length} JSON files under public/data ...`);

  const stats = {
    totalJson: 0,
    parseErrors: 0,
    roomLike: 0,
    nonRoomIgnored: 0,
    emptyRooms: 0,
  };

  const findings = [];

  for (const filePath of files) {
    stats.totalJson++;

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

    if (!looksRoomLike(json)) {
      stats.nonRoomIgnored++;
      continue;
    }

    stats.roomLike++;
    const roomId = getRoomId(json, baseName);

    const empty = !hasAnyRealContent(json);

    if (empty) {
      stats.emptyRooms++;
      findings.push({
        type: "EMPTY_ROOM",
        file: rel,
        details: `id="${roomId}"`,
      });
    }
  }

  console.log("");
  console.log("[empty-rooms] Summary");
  console.log("--------------------");
  console.log(`Total JSON files:         ${stats.totalJson}`);
  console.log(`Parse errors (HARD FAIL): ${stats.parseErrors}`);
  console.log(`Room-like JSON detected:  ${stats.roomLike}`);
  console.log(`Non-room JSON ignored:    ${stats.nonRoomIgnored}`);
  console.log(`Empty rooms (NO content): ${stats.emptyRooms}`);
  console.log("");

  if (findings.length) {
    console.log(`[empty-rooms] Findings (showing up to ${MAX}):`);
    findings.slice(0, MAX).forEach((f, i) => {
      console.log(`  ${String(i + 1).padStart(3)}. ${f.type} :: ${f.file} :: ${f.details}`);
    });
    if (findings.length > MAX) console.log(`  ... +${findings.length - MAX} more`);
    console.log("");
  }

  const fail = stats.parseErrors > 0 || (STRICT && stats.emptyRooms > 0);

  if (fail) {
    console.error("[empty-rooms] FAIL (empty rooms and/or parse errors found)");
    process.exit(1);
  }

  console.log("[empty-rooms] OK");
  process.exit(0);
})();
