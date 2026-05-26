// scripts/check-rooms-keyword-coverage.mjs
// MB-BLUE-102.3 — 2026-01-15 (+0700)
//
// Detect user-facing “looks broken” cases:
// 1) Room keyword buttons that match ZERO entries (EN/VI)  ✅ HARD FAIL
// 2) Room that effectively has ZERO entries (classic + nested) ✅ HARD FAIL (can disable)
// 3) Entry schema variants that UI may not render (copy vs content, audio vs audio_en) ⚠ warning
//
// Usage:
//   node scripts/check-rooms-keyword-coverage.mjs
//   npm run check:kw-coverage
//
// Env toggles:
//   MB_KW_COVERAGE_ALLOW_EMPTY_ROOMS=1   -> do NOT fail rooms with zero entries (still report)
//
// Exit codes:
//   0 = OK
//   1 = FAIL (keyword coverage issues found)

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

function norm(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isRoomJson(json) {
  return !!(json && typeof json === "object" && typeof json.id === "string");
}

function arr(v) {
  return Array.isArray(v) ? v : [];
}

function isPlainObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

// Heuristic: is this object "entry-like"?
// We accept MANY legacy shapes, but try to avoid false positives.
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

// Extract entries in a way that matches your renderer reality:
// 1) room.entries (classic)
// 2) nested "leaf entries" (heuristic deep scan)
function extractEntries(room) {
  const direct = arr(room?.entries);
  if (direct.length) return direct;

  // Deep scan
  const found = [];
  const seen = new Set();

  // Depth limit avoids insane recursion on weird JSON
  const MAX_DEPTH = 10;

  function visit(node, depth) {
    if (depth > MAX_DEPTH) return;

    if (Array.isArray(node)) {
      for (const item of node) visit(item, depth + 1);
      return;
    }

    if (!isPlainObject(node)) return;

    // If entry-like, collect
    if (looksLikeEntry(node)) {
      // De-dupe by reference-ish key
      const key = node.slug || node.id || JSON.stringify([node.title, node.audio, node.audio_en]).slice(0, 80);
      if (!seen.has(key)) {
        seen.add(key);
        found.push(node);
      }
      // Still keep scanning inside in case of nested groups
    }

    for (const k of Object.keys(node)) {
      // Skip obvious huge non-entry blobs if any
      if (k === "_meta") continue;
      visit(node[k], depth + 1);
    }
  }

  visit(room, 0);

  // If the deep scan “found” the room itself (can happen if room matches heuristics), remove it
  const filtered = found.filter((x) => x !== room);

  return filtered;
}

function entryKeywords(entry) {
  const en = arr(entry?.keywords_en).map(norm).filter(Boolean);
  const vi = arr(entry?.keywords_vi).map(norm).filter(Boolean);

  // also accept legacy combined buckets
  const combined = arr(entry?.keywords).map(norm).filter(Boolean);
  const tags = arr(entry?.tags).map(norm).filter(Boolean);

  // slug/title also count as match signals in UI behavior (practical)
  const slug = norm(entry?.slug);
  const title = norm(entry?.title);

  const outEn = new Set([...en, ...combined, ...tags]);
  const outVi = new Set([...vi, ...combined, ...tags]);

  if (slug) {
    outEn.add(slug);
    outVi.add(slug);
  }
  if (title) {
    outEn.add(title);
    outVi.add(title);
  }

  return { en: [...outEn], vi: [...outVi] };
}

function roomKeywords(room) {
  // support common variants
  const en = arr(room?.keywords_en).length ? arr(room?.keywords_en) : arr(room?.keywords?.en);
  const vi = arr(room?.keywords_vi).length ? arr(room?.keywords_vi) : arr(room?.keywords?.vi);

  return {
    en: en.map(norm).filter(Boolean),
    vi: vi.map(norm).filter(Boolean),
  };
}

function entryLabel(e) {
  return String(e?.slug || e?.id || e?.title || "").trim() || "(entry)";
}

function addFinding(byRoom, id, finding) {
  if (!byRoom.has(id)) byRoom.set(id, []);
  byRoom.get(id).push(finding);
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[kw-coverage] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = walkJsonFiles(DATA_DIR);
  console.log(`[kw-coverage] Scanning ${files.length} JSON files under public/data ...`);

  const byRoom = new Map(); // roomId -> findings[]
  let roomCount = 0;

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath);
    const base = path.basename(filePath).replace(/\.json$/i, "");

    let room;
    try {
      room = safeReadJson(filePath);
    } catch {
      continue;
    }
    if (!isRoomJson(room)) continue;

    roomCount++;
    const id = String(room.id || base);

    const kws = roomKeywords(room);
    const entries = extractEntries(room);

    // HARD FAIL: room has zero entries (looks broken)
    if (entries.length === 0) {
      addFinding(byRoom, id, {
        type: "ROOM_HAS_ZERO_ENTRIES",
        file: rel,
        details: `id="${id}" has no entries detected (classic entries[] empty + deep scan empty)`,
      });
    }

    // build a set of all entry keywords (EN/VI)
    const entryEn = new Set();
    const entryVi = new Set();

    // keep a reverse map: keyword -> entries that contain it (for suggestion)
    const kwToEntriesEn = new Map(); // kw -> Set(entryLabel)
    const kwToEntriesVi = new Map();

    const mapAdd = (map, kw, label) => {
      if (!map.has(kw)) map.set(kw, new Set());
      map.get(kw).add(label);
    };

    for (const e of entries) {
      const k = entryKeywords(e);
      const label = entryLabel(e);

      for (const x of k.en) {
        entryEn.add(x);
        mapAdd(kwToEntriesEn, x, label);
      }
      for (const x of k.vi) {
        entryVi.add(x);
        mapAdd(kwToEntriesVi, x, label);
      }

      // schema warnings (not fail): copy vs content, audio vs audio_en
      const hasCopy = !!(e && typeof e === "object" && e.copy && typeof e.copy === "object");
      const hasContent = !!(e && typeof e === "object" && e.content && typeof e.content === "object");
      const hasAudio = typeof e?.audio === "string";
      const hasAudioEn = typeof e?.audio_en === "string";

      if (hasCopy && !hasContent) {
        addFinding(byRoom, id, {
          type: "ENTRY_SCHEMA_WARNING",
          file: rel,
          details: `id="${id}" entry="${label}" has copy{} but missing content{} (UI now coerces, but please migrate)`,
        });
      }
      if (hasAudio && !hasAudioEn) {
        addFinding(byRoom, id, {
          type: "ENTRY_SCHEMA_WARNING",
          file: rel,
          details: `id="${id}" entry="${label}" has audio(string) but missing audio_en (UI now coerces, but please migrate)`,
        });
      }
    }

    // HARD FAIL: room keyword exists but no entry has it
    for (const kw of kws.en) {
      if (!entryEn.has(kw)) {
        addFinding(byRoom, id, {
          type: "ROOM_KEYWORD_NO_ENTRY_MATCH",
          file: rel,
          details: `id="${id}" keyword_en="${kw}" (suggest: remove keyword OR add it to one entry keywords_en/tags)`,
        });
      }
    }
    for (const kw of kws.vi) {
      if (!entryVi.has(kw)) {
        addFinding(byRoom, id, {
          type: "ROOM_KEYWORD_NO_ENTRY_MATCH",
          file: rel,
          details: `id="${id}" keyword_vi="${kw}" (suggest: remove keyword OR add it to one entry keywords_vi/tags)`,
        });
      }
    }

    // Helpful extra: if room has keywords but entries are empty, add an explicit “why users see nothing”
    if ((kws.en.length || kws.vi.length) && entries.length === 0) {
      addFinding(byRoom, id, {
        type: "ROOM_LOOKS_BROKEN",
        file: rel,
        details: `id="${id}" has keyword buttons but no entries => user sees "No entry matches" / empty content`,
      });
    }
  }

  // Flatten findings for summary
  const allFindings = [];
  for (const [, fsList] of byRoom.entries()) allFindings.push(...fsList);

  const countByType = new Map();
  for (const f of allFindings) countByType.set(f.type, (countByType.get(f.type) || 0) + 1);

  console.log("");
  console.log("[kw-coverage] Summary");
  console.log("---------------------");
  console.log(`Room JSON detected: ${roomCount}`);
  console.log(`Rooms w/ findings:  ${byRoom.size}`);
  console.log(`Findings total:     ${allFindings.length}`);
  console.log("");

  // Print type breakdown
  const types = Array.from(countByType.keys()).sort();
  if (types.length) {
    console.log("[kw-coverage] Findings by type:");
    for (const t of types) {
      console.log(`  - ${t}: ${countByType.get(t)}`);
    }
    console.log("");
  }

  // Grouped output (actionable)
  const MAX_ROOMS = 80; // keep readable
  const roomIds = Array.from(byRoom.keys()).sort();
  if (roomIds.length) {
    console.log(`[kw-coverage] Rooms with findings (showing up to ${MAX_ROOMS}):`);
    console.log("");

    roomIds.slice(0, MAX_ROOMS).forEach((id) => {
      const list = byRoom.get(id) || [];
      // prefer showing hard fails first
      const hard = list.filter((x) => x.type === "ROOM_KEYWORD_NO_ENTRY_MATCH" || x.type === "ROOM_HAS_ZERO_ENTRIES");
      const warn = list.filter((x) => x.type !== "ROOM_KEYWORD_NO_ENTRY_MATCH" && x.type !== "ROOM_HAS_ZERO_ENTRIES");

      const firstFile = list[0]?.file || "";
      console.log(`• ${id}  (${firstFile})`);
      console.log(`  hard: ${hard.length} | warn: ${warn.length}`);

      // Print up to N items per room
      const MAX_PER_ROOM = 10;
      const ordered = [...hard, ...warn].slice(0, MAX_PER_ROOM);
      for (const f of ordered) {
        console.log(`    - ${f.type}: ${f.details}`);
      }
      if (list.length > MAX_PER_ROOM) {
        console.log(`    ... +${list.length - MAX_PER_ROOM} more`);
      }
      console.log("");
    });

    if (roomIds.length > MAX_ROOMS) {
      console.log(`  ... +${roomIds.length - MAX_ROOMS} more rooms with findings`);
      console.log("");
    }
  }

  const hardKeywordFails = allFindings.filter((f) => f.type === "ROOM_KEYWORD_NO_ENTRY_MATCH").length;

  const allowEmptyRooms = String(process.env.MB_KW_COVERAGE_ALLOW_EMPTY_ROOMS || "").trim() === "1";
  const hardEmptyRooms = allowEmptyRooms
    ? 0
    : allFindings.filter((f) => f.type === "ROOM_HAS_ZERO_ENTRIES" || f.type === "ROOM_LOOKS_BROKEN").length;

  const hardFails = hardKeywordFails + hardEmptyRooms;

  if (hardFails > 0) {
    const parts = [];
    if (hardKeywordFails) parts.push(`${hardKeywordFails} keyword coverage issues`);
    if (hardEmptyRooms) parts.push(`${hardEmptyRooms} empty-room issues`);
    console.error(`[kw-coverage] FAIL (${parts.join(", ")})`);
    process.exit(1);
  }

  console.log("[kw-coverage] OK (no user-facing keyword coverage or empty-room issues)");
  process.exit(0);
})();
