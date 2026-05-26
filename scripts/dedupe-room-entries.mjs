// scripts/dedupe-room-entries.mjs
// MB-BLUE-102.4 — 2026-01-15 (+0700)
//
// Scan public/data/**.json rooms and detect/remove "duplicate entries disguised as different ones".
// Dedupe rule (in-room only):
//   - fingerprint = normalized(en_text) + "||" + normalized(vi_text) + "||" + normalized(audio_file)
//
// Usage:
//   node scripts/dedupe-room-entries.mjs
//   node scripts/dedupe-room-entries.mjs --apply
//
// Safety:
//   - With --apply: writes a .bak copy next to each modified JSON before writing changes.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import crypto from "node:crypto";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");
const APPLY = process.argv.includes("--apply");

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

function isRoomJson(json) {
  return !!(json && typeof json === "object" && typeof json.id === "string");
}

function arr(v) {
  return Array.isArray(v) ? v : [];
}

function normText(s) {
  return String(s || "")
    .replace(/\r\n/g, "\n")
    .trim()
    .toLowerCase()
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

function pickEnText(entry) {
  // prefer content{}, fallback copy{}
  const c = entry?.content || entry?.copy || {};
  return typeof c?.en === "string" ? c.en : "";
}

function pickViText(entry) {
  const c = entry?.content || entry?.copy || {};
  return typeof c?.vi === "string" ? c.vi : "";
}

function pickAudio(entry) {
  // handle legacy audio and coerced audio_en
  const a =
    (typeof entry?.audio_en === "string" && entry.audio_en) ||
    (typeof entry?.audio === "string" && entry.audio) ||
    "";
  return String(a || "").trim();
}

function label(entry) {
  return String(entry?.slug || entry?.id || entry?.title || "(entry)").trim();
}

function sha1(s) {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
}

function fingerprint(entry) {
  const en = normText(pickEnText(entry));
  const vi = normText(pickViText(entry));
  const au = normText(pickAudio(entry));
  const raw = `${en}||${vi}||${au}`;
  return sha1(raw);
}

function prettySize(entry) {
  const en = normText(pickEnText(entry));
  const vi = normText(pickViText(entry));
  const au = pickAudio(entry);
  return `en:${en.length} vi:${vi.length} audio:${au ? au : "-"}`;
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[dedupe] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = walkJsonFiles(DATA_DIR);
  console.log(`[dedupe] Scanning ${files.length} JSON files under public/data ...`);

  let roomCount = 0;
  let roomsWithDupes = 0;
  let entriesRemovedTotal = 0;

  const reports = [];

  for (const filePath of files) {
    let room;
    try {
      room = safeReadJson(filePath);
    } catch {
      continue;
    }
    if (!isRoomJson(room)) continue;

    roomCount++;

    const entries = arr(room.entries);
    if (!entries.length) continue;

    const seen = new Map(); // fp -> index kept
    const dupes = []; // { removeIndex, keepIndex, fp, removeLabel, keepLabel }

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!e || typeof e !== "object") continue;

      const fp = fingerprint(e);

      if (!seen.has(fp)) {
        seen.set(fp, i);
        continue;
      }

      const keepIndex = seen.get(fp);
      dupes.push({
        fp,
        keepIndex,
        removeIndex: i,
        keepLabel: label(entries[keepIndex]),
        removeLabel: label(e),
        keepInfo: prettySize(entries[keepIndex]),
        removeInfo: prettySize(e),
        audio: pickAudio(e) || pickAudio(entries[keepIndex]) || "",
      });
    }

    if (!dupes.length) continue;

    roomsWithDupes++;

    const rel = path.relative(ROOT, filePath);
    const roomId = String(room.id);

    reports.push({ rel, roomId, dupes });

    if (APPLY) {
      // remove from end to start so indexes don't shift
      const removeSet = new Set(dupes.map((d) => d.removeIndex));
      const nextEntries = entries.filter((_, idx) => !removeSet.has(idx));

      if (nextEntries.length !== entries.length) {
        const bak = `${filePath}.bak`;
        if (!fs.existsSync(bak)) fs.writeFileSync(bak, fs.readFileSync(filePath));
        room.entries = nextEntries;
        fs.writeFileSync(filePath, JSON.stringify(room, null, 2) + "\n", "utf8");
        entriesRemovedTotal += entries.length - nextEntries.length;
      }
    }
  }

  console.log("");
  console.log("[dedupe] Summary");
  console.log("---------------");
  console.log(`Rooms scanned:          ${roomCount}`);
  console.log(`Rooms with dup entries: ${roomsWithDupes}`);
  console.log(`Mode:                  ${APPLY ? "APPLY (writes files + .bak)" : "REPORT ONLY"}`);
  if (APPLY) console.log(`Entries removed:       ${entriesRemovedTotal}`);
  console.log("");

  const MAX_ROOMS = 80;
  for (const r of reports.slice(0, MAX_ROOMS)) {
    console.log(`• ${r.roomId}  (${r.rel})`);
    for (const d of r.dupes.slice(0, 20)) {
      console.log(
        `  - DUP fp=${d.fp} audio="${d.audio}"  KEEP[${d.keepIndex}]="${d.keepLabel}"  REMOVE[${d.removeIndex}]="${d.removeLabel}"`
      );
    }
    if (r.dupes.length > 20) console.log(`  ... +${r.dupes.length - 20} more`);
    console.log("");
  }
  if (reports.length > MAX_ROOMS) {
    console.log(`... +${reports.length - MAX_ROOMS} more rooms with dupes`);
    console.log("");
  }

  // exit non-zero if dupes found (so CI can catch)
  if (reports.length) process.exit(1);
  process.exit(0);
})();
