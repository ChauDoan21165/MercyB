#!/usr/bin/env node
/**
 * Scan MercyB for "double source of truth" rooms:
 * - room id exists in src/lib/roomDataImports.ts (compiled snapshot)
 * - and also exists in public/data/*.json (runtime/static JSONs)
 *
 * Output:
 * - count of snapshot rooms
 * - count of JSON rooms
 * - how many overlap (double sourced)
 * - JSON duplicate IDs (same id in multiple JSON files)
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function listJsonFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    if (!fs.existsSync(cur)) continue;
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.toLowerCase().endsWith(".json")) out.push(full);
    }
  }
  return out;
}

function safeParseJson(p) {
  try {
    const raw = readText(p);
    return JSON.parse(raw);
  } catch (e) {
    return { __parse_error: String(e?.message || e), __file: p };
  }
}

/**
 * Extract room IDs from roomDataImports.ts reliably:
 * We look for the pattern:
 *   "room_id_key": {
 *      "id": "room_id_key",
 * which is exactly what your rg screenshot shows.
 */
function extractRoomIdsFromRoomDataImports(tsText) {
  const ids = new Set();

  // This pattern is intentionally conservative to reduce false positives.
  // It matches:  "some_id": { ... "id": "some_id"
  const re = /"([^"]+)"\s*:\s*{\s*[^]{0,300}?"id"\s*:\s*"\1"/g;

  let m;
  while ((m = re.exec(tsText))) {
    ids.add(m[1]);
  }

  return ids;
}

function main() {
  const roomDataImportsPath = path.join(ROOT, "src/lib/roomDataImports.ts");
  const publicDataDir = path.join(ROOT, "public/data");

  if (!fs.existsSync(roomDataImportsPath)) {
    console.error(`❌ Missing: ${roomDataImportsPath}`);
    process.exit(1);
  }

  // 1) Snapshot IDs from TS
  const ts = readText(roomDataImportsPath);
  const snapshotIds = extractRoomIdsFromRoomDataImports(ts);

  // 2) JSON IDs from public/data
  const jsonFiles = listJsonFiles(publicDataDir);
  const jsonIdToFiles = new Map(); // id -> [files]
  const jsonParseErrors = [];

  for (const f of jsonFiles) {
    const j = safeParseJson(f);
    if (j && j.__parse_error) {
      jsonParseErrors.push(j);
      continue;
    }
    const id = j?.id;
    if (!id || typeof id !== "string") continue;
    const rel = path.relative(ROOT, f);
    const arr = jsonIdToFiles.get(id) || [];
    arr.push(rel);
    jsonIdToFiles.set(id, arr);
  }

  const jsonIds = new Set(jsonIdToFiles.keys());

  // 3) Overlap = double source
  const overlap = [];
  for (const id of snapshotIds) {
    if (jsonIds.has(id)) overlap.push(id);
  }
  overlap.sort();

  // 4) JSON duplicates: same id appears in multiple JSON files
  const jsonDuplicates = [];
  for (const [id, files] of jsonIdToFiles.entries()) {
    if (files.length > 1) {
      jsonDuplicates.push({ id, files });
    }
  }
  jsonDuplicates.sort((a, b) => a.id.localeCompare(b.id));

  // Output summary
  console.log(`\n=== Double Source of Truth Scan ===\n`);
  console.log(`Snapshot rooms (roomDataImports.ts): ${snapshotIds.size}`);
  console.log(`JSON rooms (public/data):           ${jsonIds.size}`);
  console.log(`OVERLAP (double-sourced rooms):     ${overlap.length}`);

  if (jsonParseErrors.length) {
    console.log(`\n⚠️ JSON parse errors (${jsonParseErrors.length}):`);
    for (const e of jsonParseErrors.slice(0, 20)) {
      console.log(`- ${path.relative(ROOT, e.__file)} :: ${e.__parse_error}`);
    }
    if (jsonParseErrors.length > 20) console.log(`  ... +${jsonParseErrors.length - 20} more`);
  }

  if (jsonDuplicates.length) {
    console.log(`\n⚠️ JSON duplicate IDs (${jsonDuplicates.length}):`);
    for (const d of jsonDuplicates) {
      console.log(`- ${d.id}`);
      for (const f of d.files) console.log(`    - ${f}`);
    }
  } else {
    console.log(`\n✅ No duplicate IDs found in public/data JSONs.`);
  }

  if (overlap.length) {
    console.log(`\n🔁 Double-sourced room IDs (present in BOTH snapshot + JSON):`);
    for (const id of overlap) {
      const files = jsonIdToFiles.get(id) || [];
      console.log(`- ${id}${files.length ? `  ->  ${files.join(", ")}` : ""}`);
    }
  } else {
    console.log(`\n✅ No overlap found (no double source of truth detected by this heuristic).`);
  }

  console.log(`\nDone.\n`);
}

main();
