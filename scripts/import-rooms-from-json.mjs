#!/usr/bin/env node
/**
 * Import one or more room JSON files into Supabase "rooms" table.
 * Usage:
 *   node scripts/import-rooms-from-json.mjs file1.json file2.json ...
 */

import { readFileSync } from "node:fs";
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

const files = process.argv.slice(2);

if (!files.length) {
  console.error("Usage: node scripts/import-rooms-from-json.mjs <file1.json> ...");
  process.exit(1);
}

async function main() {
  const payloads = [];

  for (const file of files) {
    try {
      const raw = readFileSync(file, "utf8");
      const room = JSON.parse(raw);

      if (!room.id) {
        console.error(`❌ ${file} has no "id"; skipping.`);
        continue;
      }

      // 🔧 Map JSON → DB columns (adjust to your schema)
      payloads.push({
        id: room.id,
        slug: room.slug ?? room.id,
        tier: room.tier ?? null,
        domain: room.domain ?? null,
        title_en: room.title?.en ?? null,
        title_vi: room.title?.vi ?? null,
        content_en: room.content?.en ?? null,
        content_vi: room.content?.vi ?? null,
        data: room, // JSONB column holding full room JSON
      });
    } catch (err) {
      console.error(`❌ Failed to read/parse ${file}: ${err.message}`);
    }
  }

  if (!payloads.length) {
    console.error("Nothing to import.");
    return;
  }

  const { data, error } = await supabase
    .from("rooms")
    .upsert(payloads, { onConflict: "id" });

  if (error) {
    console.error("❌ Upsert failed:", error);
    process.exit(1);
  }

  console.log(`✅ Imported/updated ${data?.length ?? payloads.length} rooms.`);
}

main().catch((err) => {
  console.error("❌ Fatal error in import-rooms-from-json:", err);
  process.exit(1);
});
