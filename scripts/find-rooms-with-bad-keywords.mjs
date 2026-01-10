#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const ROOT_DIRS = [
  "dist/data",
  "public/data",
  "supabase/functions/room-chat/data",
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

function resolveKeywords(room) {
  const en = firstNonEmptyArray(room?.keywords_en, room?.keywords?.en, room?.meta?.keywords_en);
  const vi = firstNonEmptyArray(room?.keywords_vi, room?.keywords?.vi, room?.meta?.keywords_vi);
  return { en, vi };
}

function hasAnyChildArrays(node) {
  if (!node || typeof node !== "object") return false;

  const buckets = [
    node?.entries, node?.items, node?.cards, node?.blocks, node?.steps,
    node?.children, node?.nodes, node?.rows, node?.cols, node?.sections,

    node?.content?.entries, node?.content?.items, node?.content?.cards, node?.content?.blocks,
    node?.content?.steps, node?.content?.children, node?.content?.nodes, node?.content?.rows,
    node?.content?.cols, node?.content?.sections,

    node?.payload?.entries, node?.payload?.items, node?.payload?.cards, node?.payload?.blocks,
    node?.payload?.steps, node?.payload?.sections,

    node?.data?.entries, node?.data?.items, node?.data?.cards, node?.data?.blocks,
    node?.data?.steps, node?.data?.sections,
  ];

  return buckets.some((b) => Array.isArray(b) && b.length > 0);
}

function looksLikeLeafEntry(x) {
  if (!x || typeof x !== "object") return false;
  if (hasAnyChildArrays(x)) return false;

  if (x.audio || x.audio_en || x.audio_vi || x.mp3 || x.mp3_en || x.mp3_vi) return true;

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

  const hasTitle = !!(x.title?.en || x.title_en || x.heading?.en || x.heading_en || x.name?.en || x.name_en);
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

function normalizeTextForKwMatch(s) {
  const base = String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[\s\-_]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!base) return "";

  const words = base.split(" ").map((w) => {
    if (w.length < 4) return w;
    if (w.endsWith("ies") && w.length >= 5) return w.slice(0, -3) + "y";
    if (w.endsWith("es") && w.length >= 5) {
      const root = w.slice(0, -2);
      if (/(s|x|z|ch|sh)$/.test(root)) return root;
    }
    if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
    return w;
  });

  return words.join(" ");
}

function entryTextBlob(entry) {
  const parts = [];
  const push = (x) => {
    if (typeof x === "string" && x.trim()) parts.push(x);
  };

  push(entry?.id);
  push(entry?.slug);
  push(entry?.title?.en);
  push(entry?.title_en);
  push(entry?.heading?.en);
  push(entry?.heading_en);
  push(entry?.name?.en);
  push(entry?.name_en);

  push(entry?.copy?.en);
  push(entry?.text?.en);
  push(entry?.body?.en);
  push(entry?.content?.en);
  push(entry?.description?.en);
  push(entry?.summary?.en);

  push(entry?.copy_en);
  push(entry?.text_en);
  push(entry?.body_en);
  push(entry?.content_en);
  push(entry?.description_en);
  push(entry?.summary_en);

  push(entry?.copy?.vi);
  push(entry?.text?.vi);
  push(entry?.body?.vi);
  push(entry?.content?.vi);
  push(entry?.description?.vi);
  push(entry?.summary?.vi);

  push(entry?.copy_vi);
  push(entry?.text_vi);
  push(entry?.body_vi);
  push(entry?.content_vi);
  push(entry?.description_vi);
  push(entry?.summary_vi);

  return normalizeTextForKwMatch(parts.join(" \n "));
}

function keywordHitsAnyEntry(kw, leafEntries) {
  const k = normalizeTextForKwMatch(kw);
  if (!k) return true; // ignore empty keywords

  for (const e of leafEntries) {
    const blob = entryTextBlob(e);
    if (blob.includes(k)) return true;
  }
  return false;
}

async function walkJsonFiles(dir) {
  const out = [];
  async function walk(p) {
    let st;
    try {
      st = await fs.stat(p);
    } catch {
      return;
    }
    if (st.isDirectory()) {
      const items = await fs.readdir(p);
      for (const it of items) await walk(path.join(p, it));
      return;
    }
    if (st.isFile() && p.toLowerCase().endsWith(".json")) out.push(p);
  }
  await walk(dir);
  return out;
}

function looksLikeRoom(obj) {
  if (!obj || typeof obj !== "object") return false;
  const hasAnyContent =
    asArray(obj?.entries).length ||
    asArray(obj?.sections).length ||
    asArray(obj?.content?.entries).length ||
    asArray(obj?.content?.sections).length ||
    asArray(obj?.content?.blocks).length ||
    asArray(obj?.blocks).length;
  const hasTitle = !!(obj?.title?.en || obj?.title_en || obj?.name?.en || obj?.name_en);
  const hasKeywords = asArray(obj?.keywords_en).length || asArray(obj?.keywords_vi).length || asArray(obj?.keywords?.en).length || asArray(obj?.keywords?.vi).length;
  return !!(hasAnyContent || hasTitle || hasKeywords);
}

async function main() {
  const repoRoot = process.cwd();

  // collect JSON files
  const files = [];
  for (const d of ROOT_DIRS) {
    const abs = path.join(repoRoot, d);
    try {
      const st = await fs.stat(abs);
      if (!st.isDirectory()) continue;
    } catch {
      continue;
    }
    const got = await walkJsonFiles(abs);
    files.push(...got);
  }

  if (!files.length) {
    console.log("No JSON files found under ROOT_DIRS. Check ROOT_DIRS in this script.");
    process.exit(0);
  }

  let scanned = 0;
  let roomsWithKeywords = 0;
  const badRooms = [];

  for (const f of files) {
    let raw;
    try {
      raw = await fs.readFile(f, "utf8");
    } catch {
      continue;
    }

    let obj;
    try {
      obj = JSON.parse(raw);
    } catch {
      continue;
    }

    // Some JSON files may be arrays (lists of rooms)
    const candidates = Array.isArray(obj) ? obj : [obj];

    for (const room of candidates) {
      if (!looksLikeRoom(room)) continue;

      const kw = resolveKeywords(room);
      const allKw = [...asArray(kw.en), ...asArray(kw.vi)].map((x) => String(x || "").trim()).filter(Boolean);
      if (!allKw.length) continue;

      roomsWithKeywords++;
      scanned++;

      const tops = resolveTopContainers(room);
      const leaf = flattenToLeafEntries(tops, 6);

      // If we have keywords but zero leaf entries, it's definitely suspicious
      const bad = [];
      if (leaf.length === 0) {
        bad.push(...allKw);
      } else {
        for (const k of allKw) {
          if (!keywordHitsAnyEntry(k, leaf)) bad.push(k);
        }
      }

      // If MANY keywords don't hit, likely broken matching / bad data shape
      if (bad.length > 0) {
        const roomId = String(room?.id || room?.slug || room?.name_en || room?.title_en || "").trim();
        badRooms.push({
          file: path.relative(repoRoot, f),
          roomId: roomId || "(unknown room id)",
          leafCount: leaf.length,
          totalKw: allKw.length,
          bad,
        });
      }
    }
  }

  // Sort: worst first
  badRooms.sort((a, b) => (b.bad.length / Math.max(1, b.totalKw)) - (a.bad.length / Math.max(1, a.totalKw)));

  console.log("");
  console.log(`Scanned JSON files: ${files.length}`);
  console.log(`Rooms with keywords: ${roomsWithKeywords}`);
  console.log(`Rooms with >=1 keyword miss: ${badRooms.length}`);
  console.log("");

  for (const r of badRooms.slice(0, 40)) {
    const ratio = `${r.bad.length}/${r.totalKw}`;
    console.log(`ROOM: ${r.roomId}  (bad=${ratio}, leaf=${r.leafCount})`);
    console.log(`FILE: ${r.file}`);
    for (const k of r.bad.slice(0, 30)) console.log(`  - ${k}`);
    if (r.bad.length > 30) console.log(`  ... +${r.bad.length - 30} more`);
    console.log("");
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
