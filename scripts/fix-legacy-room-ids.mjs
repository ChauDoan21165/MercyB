#!/usr/bin/env node
/**
 * fix-legacy-room-ids.mjs
 *
 * Auto-fix legacy JSON rooms that are missing `id`
 * and/or still use `name` / `name_vi` / `description` fields.
 *
 * Rules:
 * - If file already has `id` => leave it.
 * - If filename is clearly weird (".mp3.json", " copy", "volS") => don't touch, mark MANUAL.
 * - Otherwise:
 *    - derive `id` from filename (slugified)
 *    - add `title` and `content` if missing, using existing name/description fields
 *    - NEVER touch entries[] or audio.
 */

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "public", "data");

const fixed = [];
const skippedHasId = [];
const manual = [];
const errors = [];

function makeIdFromFilename(file) {
  const raw = basename(file, ".json");
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")  // spaces, &, commas, etc -> "_"
    .replace(/^_+|_+$/g, "");     // trim underscores
}

function needsManual(file) {
  const raw = basename(file, ".json");
  if (raw.includes(".mp3")) return true;
  if (/ copy/i.test(file)) return true;
  if (/vols$/i.test(raw)) return true;
  return false;
}

function main() {
  const files = readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));

  for (const file of files) {
    const fullPath = join(DATA_DIR, file);

    let json;
    try {
      json = JSON.parse(readFileSync(fullPath, "utf8"));
    } catch (err) {
      errors.push({ file, message: String(err) });
      continue;
    }

    if (json.id) {
      skippedHasId.push(file);
      continue;
    }

    if (needsManual(file)) {
      manual.push(file);
      continue;
    }

    const newId = makeIdFromFilename(file);

    // attach id
    json.id = newId;

    // optional: upgrade name/description into title/content if missing
    if (!json.title && (json.name || json.name_vi)) {
      json.title = {
        en: json.name || "",
        vi: json.name_vi || ""
      };
    }

    if (!json.content && (json.description || json.description_vi)) {
      json.content = {
        en: json.description || "",
        vi: json.description_vi || ""
      };
    }

    // write back (2-space indent to keep readable)
    writeFileSync(fullPath, JSON.stringify(json, null, 2), "utf8");
    fixed.push({ file, id: newId });
  }

  console.log(`# Checked ${files.length} files`);
  console.log(`# Fixed (added id/title/content): ${fixed.length}`);
  console.log(`# Skipped (already had id): ${skippedHasId.length}`);
  console.log(`# Needs MANUAL review: ${manual.length}`);
  console.log(`# Parse errors: ${errors.length}\n`);

  if (fixed.length) {
    console.log("=== FIXED FILES ===");
    for (const { file, id } of fixed) {
      console.log(`✔ ${file}  -> id="${id}"`);
    }
    console.log("");
  }

  if (manual.length) {
    console.log("=== MANUAL (did NOT touch) ===");
    for (const file of manual) {
      console.log(`! ${file}`);
    }
    console.log("");
  }

  if (errors.length) {
    console.log("=== ERRORS ===");
    for (const e of errors) {
      console.log(`✘ ${e.file}: ${e.message}`);
    }
  }
}

main();
