#!/usr/bin/env node
/**
 * Find rooms that have keywords but cannot produce an audio stage:
 * - leafCount === 0   (no real entries after flatten)
 * OR
 * - leafCount > 0 but audioCount === 0 (entries exist but none has audio fields)
 *
 * Scans: public/data, dist/data, supabase/functions/room-chat/data
 */

import fs from "node:fs/promises";
import path from "node:path";

const ROOT_DIRS = [
  "public/data",
  "dist/data",
  "supabase/functions/room-chat/data",
];

const AUDIO_KEYS = [
  "audio",
  "audio_en",
  "audio_vi",
  "audioRef",
  "audio_ref",
  "audioUrl",
  "audio_url",
  "mp3",
  "mp3_en",
  "mp3_vi",
];

function asArray(x) {
  return Array.isArray(x) ? x : [];
}
function firstNonEmptyArray(...candidates) {
  for (const c of candidates) {
    const arr = asArray(c);
    if (arr.length > 0) return arr;
  }
  return [];
}

function resolveTopContainers(room) {
  return firstNonEmptyArray(
    room?.sections,
    room?.content?.sections,
    room?.content?.blocks,
    room?.blocks,
    room?.content?.items,
    room?.items,
    room?.content?.cards,
    room?.cards,
    room?.entries,
    room?.content?.entries,
    room?.data?.entries,
    room?.payload?.entries,
  );
}

function hasAnyChildArrays(node) {
  if (!node || typeof node !== "object") return false;

  const buckets = [
    node?.entries,
    node?.items,
    node?.cards,
    node?.blocks,
    node?.steps,
    node?.children,
    node?.nodes,
    node?.rows,
    node?.cols,
    node?.sections,

    node?.content?.entries,
    node?.content?.items,
    node?.content?.cards,
    node?.content?.blocks,
    node?.content?.steps,
    node?.content?.children,
    node?.content?.nodes,
    node?.content?.rows,
    node?.content?.cols,
    node?.content?.sections,

    node?.payload?.entries,
    node?.payload?.items,
    node?.payload?.cards,
    node?.payload?.blocks,
    node?.payload?.steps,
    node?.payload?.sections,

    node?.data?.entries,
    node?.data?.items,
    node?.data?.cards,
    node?.data?.blocks,
    node?.data?.steps,
    node?.data?.sections,
  ];

  return buckets.some((b) => Array.isArray(b) && b.length > 0);
}

function looksLikeLeafEntry(x) {
  if (!x || typeof x !== "object") return false;
  if (hasAnyChildArrays(x)) return false;

  // Any audio field => leaf
  for (const k of AUDIO_KEYS) {
    if (x?.[k]) return true;
  }

  const hasText =
    typeof x.text === "string" ||
    typeof x.content === "string" ||
    typeof x.copy?.en === "string" ||
    typeof x.text?.en === "string" ||
    typeof x.body?.en === "string" ||
    typeof x.content?.en === "string" ||
    typeof x.description?.en === "string" ||
    typeof x.summary?.en === "string" ||
    typeof x.copy_en === "string" ||
    typeof x.text_en === "string" ||
    typeof x.body_en === "string" ||
    typeof x.content_en === "string" ||
    typeof x.description_en === "string" ||
    typeof x.summary_en === "string" ||
    typeof x.copy?.vi === "string" ||
    typeof x.text?.vi === "string" ||
    typeof x.body?.vi === "string" ||
    typeof x.content?.vi === "string" ||
    typeof x.description?.vi === "string" ||
    typeof x.summary?.vi === "string" ||
    typeof x.copy_vi === "string" ||
    typeof x.text_vi === "string" ||
    typeof x.body_vi === "string" ||
    typeof x.content_vi === "string" ||
    typeof x.description_vi === "string" ||
    typeof x.summary_vi === "string";

  if (hasText) return true;

  const hasTitle =
    !!(x.title?.en || x.title_en || x.heading?.en || x.heading_en || x.name?.en || x.name_en);
  const hasMeta = !!(x.id || x.slug);

  return hasTitle || hasMeta;
}

function collectChildEntryArrays(node) {
  if (!node || typeof node !== "object") return [];

  const buckets = [
    asArray(node?.entries),
    asArray(node?.items),
    asArray(node?.cards),
    asArray(node?.blocks),
    asArray(node?.steps),
    asArray(node?.children),
    asArray(node?.nodes),
    asArray(node?.rows),
    asArray(node?.cols),
    asArray(node?.sections),

    asArray(node?.content?.entries),
    asArray(node?.content?.items),
    asArray(node?.content?.cards),
    asArray(node?.content?.blocks),
    asArray(node?.content?.steps),
    asArray(node?.content?.children),
    asArray(node?.content?.nodes),
    asArray(node?.content?.rows),
    asArray(node?.content?.cols),
    asArray(node?.content?.sections),

    asArray(node?.payload?.entries),
    asArray(node?.payload?.items),
    asArray(node?.payload?.cards),
    asArray(node?.payload?.blocks),
    asArray(node?.payload?.steps),
    asArray(node?.payload?.sections),

    asArray(node?.data?.entries),
    asArray(node?.data?.items),
    asArray(node?.data?.cards),
    asArray(node?.data?.blocks),
    asArray(node?.data?.steps),
    asArray(node?.data?.sections),
  ];

  return buckets.filter((a) => Array.isArray(a) && a.length > 0);
}

function flattenToLeafEntries(input, maxDepth = 6) {
  const out = [];
  const visit = (arr, depth) => {
    for (const x of asArray(arr)) {
      if (!x || typeof x !== "object") continue;

      const children = collectChildEntryArrays(x);
      if (children.length && depth < maxDepth) {
        for (const c of children) visit(c, depth + 1);
        continue;
      }

      if (looksLikeLeafEntry(x)) out.push(x);
    }
  };
  visit(input, 0);
  return out;
}

function hasKeywords(room) {
  const en = asArray(room?.keywords_en).length || asArray(room?.keywords?.en).length;
  const vi = asArray(room?.keywords_vi).length || asArray(room?.keywords?.vi).length;
  return !!(en || vi);
}

function countAudio(leafEntries) {
  let n = 0;
  for (const e of asArray(leafEntries)) {
    for (const k of AUDIO_KEYS) {
      const v = e?.[k];
      if (!v) continue;
      // string or object is ok
      if (typeof v === "string" && v.trim()) {
        n++;
        break;
      }
      if (typeof v === "object") {
        const s = String(v?.en || v?.vi || v?.src || v?.url || "").trim();
        if (s) {
          n++;
          break;
        }
      }
    }
  }
  return n;
}

async function listJsonFiles(rootDir) {
  const out = [];
  async function walk(dir) {
    let items = [];
    try {
      items = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const it of items) {
      const p = path.join(dir, it.name);
      if (it.isDirectory()) await walk(p);
      else if (it.isFile() && it.name.toLowerCase().endsWith(".json")) out.push(p);
    }
  }
  await walk(rootDir);
  return out;
}

async function readJson(file) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function preferPublic(a, b) {
  const ap = a.includes("public/data");
  const bp = b.includes("public/data");
  if (ap && !bp) return -1;
  if (!ap && bp) return 1;
  return a.localeCompare(b);
}

async function main() {
  const existingRoots = [];
  for (const d of ROOT_DIRS) {
    try {
      const st = await fs.stat(d);
      if (st.isDirectory()) existingRoots.push(d);
    } catch {}
  }

  if (existingRoots.length === 0) {
    console.error("No root dirs found. Edit ROOT_DIRS to match your repo.");
    process.exit(1);
  }

  let scanned = 0;
  let roomsWithKeywords = 0;

  // de-dup by room id, prefer public/data
  const bestById = new Map(); // id -> { file, room }

  for (const root of existingRoots) {
    const files = await listJsonFiles(root);
    for (const file of files) {
      const room = await readJson(file);
      scanned++;
      if (!room || typeof room !== "object") continue;
      const id = String(room?.id || "").trim();
      if (!id) continue;

      // keep best file per id
      const prev = bestById.get(id);
      if (!prev) bestById.set(id, { file, room });
      else {
        const cand = [prev.file, file].sort(preferPublic)[0];
        if (cand === file) bestById.set(id, { file, room });
      }
    }
  }

  const badRooms = [];

  for (const [id, { file, room }] of bestById.entries()) {
    if (!hasKeywords(room)) continue;
    roomsWithKeywords++;

    const tops = resolveTopContainers(room);
    const leaf = flattenToLeafEntries(tops, 6);
    const leafCount = leaf.length;
    const audioCount = countAudio(leaf);

    // “No audio stage” problem:
    // - no leaf entries at all
    // - OR leaf exists but none has audio
    if (leafCount === 0 || audioCount === 0) {
      badRooms.push({ id, file, leafCount, audioCount });
    }
  }

  badRooms.sort((a, b) => {
    // most severe first: leaf=0 first, then audio=0
    const aScore = (a.leafCount === 0 ? 0 : 1) + (a.audioCount === 0 ? 0 : 1);
    const bScore = (b.leafCount === 0 ? 0 : 1) + (b.audioCount === 0 ? 0 : 1);
    if (aScore !== bScore) return aScore - bScore;
    return a.id.localeCompare(b.id);
  });

  console.log("");
  console.log(`Scanned JSON files: ${scanned}`);
  console.log(`Rooms with keywords: ${roomsWithKeywords}`);
  console.log(`Rooms with NO audio stage (leaf=0 OR audio=0): ${badRooms.length}`);
  console.log("");

  for (const r of badRooms) {
    console.log(
      `ROOM: ${r.id}  (leaf=${r.leafCount}, audioEntries=${r.audioCount})`,
    );
    console.log(`FILE: ${r.file}`);
    console.log("");
  }

  console.log("Done.");
}

main();
