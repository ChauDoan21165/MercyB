#!/usr/bin/env node
/**
 * List room IDs in JSON vs Supabase and show what's missing where.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function collectJsonFiles() {
  // JSON at repo root, same level as package.json
  const rootFiles = readdirSync(".", { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".json"))
    .map((d) => d.name);

  // JSON under public/data (if exists)
  let publicDataFiles = [];
  try {
    publicDataFiles = readdirSync("public/data", { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.endsWith(".json"))
      .map((d) => join("public/data", d.name));
  } catch (_) {
    // no public/data, ignore
  }

  return [...rootFiles, ...publicDataFiles];
}

function loadRoomIdsFromFiles(files) {
  const ids = new Map(); // id -> filename
  for (const file of files) {
    try {
      const raw = readFileSync(file, "utf8");
      const json = JSON.parse(raw);
      if (!json.id) {
        console.warn(`⚠️  File ${file} has no "id" field, skipping.`);
        continue;
      }
      ids.set(json.id, file);
    } catch (err) {
      console.error(`❌ Failed to parse ${file}: ${err.message}`);
    }
  }
  return ids;
}

async function loadRoomIdsFromDb() {
  const ids = new Set();
  let from = 0;
  const batchSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("rooms")
      .select("id", { head: false })
      .range(from, from + batchSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const row of data) {
      if (row.id) ids.add(row.id);
    }

    if (data.length < batchSize) break;
    from += batchSize;
  }

  return ids;
}

async function main() {
  console.log("🔍 Scanning local JSON files…");
  const files = collectJsonFiles();
  console.log(`Found ${files.length} JSON files (root + public/data).`);

  const fileIdMap = loadRoomIdsFromFiles(files);

  console.log("🔍 Fetching room IDs from Supabase…");
  const dbIds = await loadRoomIdsFromDb();
  console.log(`Supabase rooms: ${dbIds.size}`);

  const missingInDb = [];
  const missingInFiles = [];

  for (const [id, file] of fileIdMap.entries()) {
    if (!dbIds.has(id)) {
      missingInDb.push({ id, file });
    }
  }

  for (const id of dbIds) {
    if (!fileIdMap.has(id)) {
      missingInFiles.push(id);
    }
  }

  console.log("\n=== Summary ===");
  console.log(`JSON IDs: ${fileIdMap.size}`);
  console.log(`DB IDs:   ${dbIds.size}`);
  console.log(`JSON → DB missing (need import): ${missingInDb.length}`);
  console.log(`DB → JSON missing (DB-only):    ${missingInFiles.length}`);

  if (missingInDb.length) {
    console.log("\nRooms present in JSON but missing in DB (first 50):");
    missingInDb.slice(0, 50).forEach((r) =>
      console.log(`- ${r.id}  (${r.file})`)
    );

    console.log(
      "\n👉 Save this list if you want to import all of them to Supabase."
    );
  }

  if (missingInFiles.length) {
    console.log("\nRooms present in DB but not as JSON files (first 50):");
    missingInFiles.slice(0, 50).forEach((id) => console.log("- " + id));
  }
}

main().catch((err) => {
  console.error("❌ Fatal error in list-missing-rooms:", err);
  process.exit(1);
});
