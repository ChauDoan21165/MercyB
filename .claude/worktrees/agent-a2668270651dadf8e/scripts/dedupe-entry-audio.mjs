// scripts/dedupe-entry-audio.mjs
// MB-BLUE-102.4 — 2026-01-15 (+0700)
//
// Scan ALL room JSONs under public/data and detect duplicate audio reused by different entries.
// Optional AUTO-FIX: delete duplicate entries that share the same audio (per-room).
//
// Default: report only (NO changes).
//
// Usage:
//   node scripts/dedupe-entry-audio.mjs
//
// Write mode (actually edits JSON files):
//   MB_DEDUPE_AUDIO_WRITE=1 node scripts/dedupe-entry-audio.mjs
//
// Allow duplicates (report only, never delete):
//   MB_DEDUPE_AUDIO_WRITE=0 node scripts/dedupe-entry-audio.mjs
//
// Optional: also detect duplicates ACROSS rooms (report only):
//   MB_DEDUPE_AUDIO_GLOBAL=1 node scripts/dedupe-entry-audio.mjs
//
// Notes:
// - We dedupe by entry audio key: audio_en first, else audio.
// - We only delete when we can confidently keep the “best” entry:
//   keep = entry with longest text (en+vi length), tie-break by more keywords, then first.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");

const WRITE = String(process.env.MB_DEDUPE_AUDIO_WRITE || "").trim() === "1";
const GLOBAL = String(process.env.MB_DEDUPE_AUDIO_GLOBAL || "").trim() === "1";

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

function safeWriteJson(filePath, obj) {
  // pretty + stable
  const next = JSON.stringify(obj, null, 2) + "\n";
  fs.writeFileSync(filePath, next, "utf8");
}

function isRoomJson(json) {
  return !!(json && typeof json === "object" && typeof json.id === "string");
}

function arr(v) {
  return Array.isArray(v) ? v : [];
}

function normAudio(s) {
  return String(s || "").trim();
}

function entryLabel(e) {
  return String(e?.slug || e?.id || e?.title || "").trim() || "(entry)";
}

function entryAudioKey(e) {
  const a = normAudio(e?.audio_en) || normAudio(e?.audio);
  return a;
}

function entryTextLen(e) {
  const c = e?.content || e?.copy || {};
  const en = typeof c?.en === "string" ? c.en : "";
  const vi = typeof c?.vi === "string" ? c.vi : "";
  return (en + "\n" + vi).trim().length;
}

function entryKwCount(e) {
  const k1 = arr(e?.keywords_en).length;
  const k2 = arr(e?.keywords_vi).length;
  const k3 = arr(e?.keywords).length;
  const k4 = arr(e?.tags).length;
  return k1 + k2 + k3 + k4;
}

function pickWinner(entries) {
  // winner = longest text; tie => more keywords; tie => stable by label
  const sorted = [...entries].sort((a, b) => {
    const dl = entryTextLen(b) - entryTextLen(a);
    if (dl !== 0) return dl;
    const dk = entryKwCount(b) - entryKwCount(a);
    if (dk !== 0) return dk;
    return entryLabel(a).localeCompare(entryLabel(b));
  });
  return sorted[0];
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[dedupe-audio] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = walkJsonFiles(DATA_DIR);
  console.log(`[dedupe-audio] Scanning ${files.length} JSON files under public/data ...`);
  console.log(`[dedupe-audio] Mode: ${WRITE ? "WRITE (will edit files)" : "REPORT ONLY"}`);
  console.log(`[dedupe-audio] Global scan: ${GLOBAL ? "ON (report)" : "OFF"}`);
  console.log("");

  let roomCount = 0;
  let dupRooms = 0;
  let deletedEntries = 0;

  // global map: audio -> [{roomId, file, entryLabel}]
  const globalAudioMap = new Map();

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath);

    let room;
    try {
      room = safeReadJson(filePath);
    } catch {
      continue;
    }
    if (!isRoomJson(room)) continue;

    roomCount++;
    const roomId = String(room.id || "").trim() || path.basename(filePath).replace(/\.json$/i, "");
    const entries = arr(room.entries);

    if (entries.length === 0) continue;

    // per-room grouping: audio -> entries[]
    const byAudio = new Map();
    for (const e of entries) {
      const key = entryAudioKey(e);
      if (!key) continue; // no audio => ignore here (you said you will create missing)
      if (!byAudio.has(key)) byAudio.set(key, []);
      byAudio.get(key).push(e);

      if (GLOBAL) {
        if (!globalAudioMap.has(key)) globalAudioMap.set(key, []);
        globalAudioMap.get(key).push({
          roomId,
          file: rel,
          entry: entryLabel(e),
        });
      }
    }

    const dups = Array.from(byAudio.entries()).filter(([, list]) => list.length > 1);
    if (dups.length === 0) continue;

    dupRooms++;

    console.log(`• Room: ${roomId}  (${rel})`);
    for (const [audio, list] of dups) {
      const labels = list.map(entryLabel);
      console.log(`  - DUP audio: "${audio}" used by ${list.length} entries: ${labels.join(" | ")}`);

      const winner = pickWinner(list);
      const winnerLabel = entryLabel(winner);

      if (WRITE) {
        // delete all except winner (by object identity, safest)
        const keepSet = new Set([winner]);
        const before = entries.length;
        const nextEntries = entries.filter((e) => {
          const key = entryAudioKey(e);
          if (key !== audio) return true;
          return keepSet.has(e);
        });
        const removed = before - nextEntries.length;
        if (removed > 0) {
          room.entries = nextEntries;
          deletedEntries += removed;
          console.log(`    -> keep "${winnerLabel}", delete ${removed} duplicates`);
        }
      } else {
        console.log(`    -> would keep: "${winnerLabel}" (WRITE mode would delete the rest)`);
      }
    }

    if (WRITE) {
      safeWriteJson(filePath, room);
    }

    console.log("");
  }

  // global report (never deletes)
  if (GLOBAL) {
    const globalDups = Array.from(globalAudioMap.entries()).filter(([, uses]) => uses.length > 1);
    if (globalDups.length) {
      console.log("[dedupe-audio] GLOBAL duplicates (audio reused across rooms):");
      for (const [audio, uses] of globalDups.slice(0, 120)) {
        const where = uses.map((u) => `${u.roomId}:${u.entry}`).join(" | ");
        console.log(`  - "${audio}" -> ${where}`);
      }
      if (globalDups.length > 120) {
        console.log(`  ... +${globalDups.length - 120} more`);
      }
      console.log("");
    }
  }

  console.log("[dedupe-audio] Summary");
  console.log("----------------------");
  console.log(`Rooms scanned:        ${roomCount}`);
  console.log(`Rooms with dup audio: ${dupRooms}`);
  console.log(`Deleted entries:      ${deletedEntries}`);
  console.log("");

  if (WRITE) {
    console.log("[dedupe-audio] DONE (files updated). Run your registry/validate scripts next.");
  } else {
    console.log("[dedupe-audio] DONE (report only). Re-run with MB_DEDUPE_AUDIO_WRITE=1 to delete duplicates.");
  }
})();
