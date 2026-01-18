// scripts/dedupe-entries-by-audio.mjs
// MB-BLUE-102.5 — 2026-01-15 (+0700)
//
// DEDUPE disguised duplicates by AUDIO across each room JSON.
// - Deep-scans for entry-like objects (legacy + nested shapes).
// - If multiple entries share the SAME audio file (audio/audio_en), KEEP FIRST, DELETE REST.
// - Only deletes when the entry is inside an ARRAY (typical room schemas).
// - Dry-run by default. Write only when MB_DEDUPE_WRITE=1.
//
// Usage:
//   node scripts/dedupe-entries-by-audio.mjs
//   MB_DEDUPE_WRITE=1 node scripts/dedupe-entries-by-audio.mjs

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

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

function writeJson(filePath, json) {
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n", "utf8");
}

function isRoomJson(json) {
  return !!(json && typeof json === "object" && typeof json.id === "string");
}

function isPlainObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

// Heuristic: entry-like object (same idea as kw-coverage)
function looksLikeEntry(obj) {
  if (!isPlainObject(obj)) return false;

  const hasText =
    (isPlainObject(obj.content) && (typeof obj.content.en === "string" || typeof obj.content.vi === "string")) ||
    (isPlainObject(obj.copy) && (typeof obj.copy.en === "string" || typeof obj.copy.vi === "string"));

  const hasAudio = typeof obj.audio === "string" || typeof obj.audio_en === "string";

  const hasKw =
    Array.isArray(obj.keywords_en) ||
    Array.isArray(obj.keywords_vi) ||
    Array.isArray(obj.keywords) ||
    Array.isArray(obj.tags);

  const hasId = typeof obj.slug === "string" || typeof obj.id === "string" || typeof obj.title === "string";

  // Require at least 2 signals to reduce noise
  const score = [hasText, hasAudio, hasKw, hasId].filter(Boolean).length;
  return score >= 2;
}

function entryLabel(e) {
  return String(e?.slug || e?.id || e?.title || "").trim() || "(entry)";
}

function normalizeAudioKey(v) {
  const raw = String(v || "").trim();
  if (!raw) return "";

  // strip query/hash
  const noQ = raw.split("?")[0].split("#")[0];

  // normalize slashes
  const norm = noQ.replace(/\\/g, "/");

  // basename only (users perceive same file)
  const base = norm.split("/").filter(Boolean).pop() || norm;

  return base.toLowerCase();
}

function entryAudioKey(e) {
  // prefer audio_en if present
  const a = normalizeAudioKey(e?.audio_en);
  const b = normalizeAudioKey(e?.audio);
  return a || b;
}

// Deep scan that ALSO tracks parent container so we can delete.
function collectEntryRefs(rootObj) {
  const refs = [];
  const MAX_DEPTH = 12;

  function visit(node, parent, parentKey, depth) {
    if (depth > MAX_DEPTH) return;

    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) visit(node[i], node, i, depth + 1);
      return;
    }

    if (!isPlainObject(node)) return;

    if (looksLikeEntry(node)) {
      refs.push({ entry: node, parent, parentKey });
      // continue scanning inside; nested groups exist
    }

    for (const k of Object.keys(node)) {
      if (k === "_meta") continue;
      visit(node[k], node, k, depth + 1);
    }
  }

  visit(rootObj, null, null, 0);

  // If the room object itself matched heuristics, remove it
  return refs.filter((r) => r.entry !== rootObj);
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[dedupe-audio] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const WRITE = String(process.env.MB_DEDUPE_WRITE || "").trim() === "1";
  const files = walkJsonFiles(DATA_DIR);

  console.log(`[dedupe-audio] Scanning ${files.length} JSON files under public/data ...`);
  console.log(`[dedupe-audio] Mode: ${WRITE ? "WRITE" : "DRY-RUN"}`);
  console.log("");

  let rooms = 0;
  let roomsChanged = 0;
  let removedTotal = 0;

  for (const filePath of files) {
    let room;
    try {
      room = safeReadJson(filePath);
    } catch {
      continue;
    }
    if (!isRoomJson(room)) continue;

    rooms++;
    const rel = path.relative(ROOT, filePath);
    const roomId = String(room.id || "");

    const refs = collectEntryRefs(room);
    if (refs.length < 2) continue;

    // Keep-first map within THIS room
    const keptByAudio = new Map(); // audioKey -> keptLabel
    const toRemove = []; // {ref, audioKey, keptLabel}

    for (const r of refs) {
      const audioKey = entryAudioKey(r.entry);
      if (!audioKey) continue; // never dedupe silent entries

      const label = entryLabel(r.entry);

      if (!keptByAudio.has(audioKey)) {
        keptByAudio.set(audioKey, label);
      } else {
        toRemove.push({ ref: r, audioKey, keptLabel: keptByAudio.get(audioKey), label });
      }
    }

    if (toRemove.length === 0) continue;

    // We can only safely delete entries that are elements of an ARRAY.
    const deletable = toRemove.filter((x) => Array.isArray(x.ref.parent) && typeof x.ref.parentKey === "number");
    if (deletable.length === 0) continue;

    roomsChanged++;
    removedTotal += deletable.length;

    console.log(`• ${roomId} (${rel})`);
    for (const d of deletable.slice(0, 80)) {
      console.log(
        `  - REMOVE entry="${d.label}" audio="${d.audioKey}" (kept="${d.keptLabel}")`
      );
    }
    if (deletable.length > 80) console.log(`  ... +${deletable.length - 80} more`);
    console.log("");

    if (WRITE) {
      const bak = filePath + ".bak";
      if (!fs.existsSync(bak)) fs.copyFileSync(filePath, bak);

      // Delete from arrays, highest index first to avoid shifting
      const grouped = new Map(); // parentArray -> indices[]
      for (const d of deletable) {
        const arr = d.ref.parent;
        const idx = d.ref.parentKey;
        if (!grouped.has(arr)) grouped.set(arr, []);
        grouped.get(arr).push(idx);
      }

      for (const [arr, idxs] of grouped.entries()) {
        idxs.sort((a, b) => b - a);
        for (const idx of idxs) {
          arr.splice(idx, 1);
        }
      }

      writeJson(filePath, room);
    }
  }

  console.log("[dedupe-audio] Summary");
  console.log("----------------------");
  console.log(`Rooms scanned:     ${rooms}`);
  console.log(`Rooms affected:    ${roomsChanged}`);
  console.log(`Entries removed:   ${removedTotal}`);
  console.log(`Mode:             ${WRITE ? "WRITE (files updated + .bak created)" : "DRY-RUN (no files changed)"}`);

  // Exit 1 if we found duplicates (so CI can catch it)
  process.exit(roomsChanged > 0 ? 1 : 0);
})();
