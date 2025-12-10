#!/usr/bin/env node
/**
 * suggest-json-cleanup.mjs
 * Scan public/data/*.json and suggest:
 * - TRASH: clearly bad ids (mp3 in name, weird chars…)
 * - DUPLICATE: ids like *_vip1_vip1 (double suffix glitch)
 * - KEEP: everything else (do not touch for now)
 */

import { readdirSync } from "fs";
import { join, basename } from "path";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "public", "data");

const buckets = {
  TRASH: /** @type {{id:string,file:string}[]} */ ([]),
  DUPLICATE: /** @type {{id:string,file:string}[]} */ ([]),
  KEEP: /** @type {{id:string,file:string}[]} */ ([]),
};

function classifyId(id) {
  // TRASH rules
  if (id.includes(".mp3")) return "TRASH";              // e.g. vip6_fi_5.mp3.json
  if (id.startsWith("._")) return "TRASH";             // macOS junk
  if (id.includes(" ")) return "TRASH";                // spaces in ids
  if (!id.match(/^[a-z0-9_]+$/)) return "TRASH";       // weird characters

  // DUPLICATE rule: meaning_of_life_vip1_vip1, vip3_room_2_vip3, etc.
  // Look for ..._vipN_vipN at the end
  const dupMatch = id.match(/^(.*)(_vip[0-9]+)_\2$/);
  if (dupMatch) return "DUPLICATE";

  return "KEEP";
}

function main() {
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const id = basename(file, ".json");
    const bucket = classifyId(id);
    buckets[bucket].push({ id, file });
  }

  console.log(`# Scanned ${files.length} files in public/data`);
  console.log(`# TRASH: ${buckets.TRASH.length}`);
  console.log(`# DUPLICATE: ${buckets.DUPLICATE.length}`);
  console.log(`# KEEP: ${buckets.KEEP.length}`);

  console.log("\n# === Definitely delete (TRASH) ===");
  for (const { file } of buckets.TRASH) {
    console.log(`rm public/data/${file}`);
  }

  console.log("\n# === Likely duplicates (DUPLICATE) ===");
  console.log("# For each of these, first run:");
  console.log("#   ls public/data/<BASENAME>*.json");
  console.log("# If you see BOTH a clean id and this glitch version, you can safely rm the glitch.\n");
  for (const { id } of buckets.DUPLICATE) {
    console.log(`# check then maybe rm public/data/${id}.json`);
  }

  console.log("\n# KEEP entries should not be touched yet.");
}

main();
