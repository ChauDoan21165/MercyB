#!/usr/bin/env node
/**
 * MIGRATE JSON ROOMS → SUPABASE DATABASE
 *
 * Usage:
 *   export SUPABASE_URL="https://xxxx.supabase.co"
 *   export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
 *   node scripts/migrate-rooms-json-to-db.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// ------------------------------------------------------------
// Resolve paths
// ------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../public/data");

// ------------------------------------------------------------
// ENV + Supabase initialization
// ------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("[debug] SUPABASE_URL =", SUPABASE_URL);
console.log(
  "[debug] SERVICE_ROLE_KEY length =",
  SERVICE_KEY ? SERVICE_KEY.length : "MISSING"
);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ------------------------------------------------------------
// Connectivity Test
// ------------------------------------------------------------
async function debugPing() {
  console.log("🔍 Testing Supabase connectivity...");

  try {
    const { data, error } = await supabase.from("rooms").select("id").limit(1);

    console.log("[debug] test select data =", data);
    console.log("[debug] test select error =", error);

    if (error) {
      console.error("❌ Cannot reach Supabase:", error);
      process.exit(1);
    }

    console.log("✅ Supabase connectivity OK\n");
  } catch (err) {
    console.error("❌ Fatal network error:", err);
    process.exit(1);
  }
}

await debugPing();

// ------------------------------------------------------------
// Load JSON rooms
// ------------------------------------------------------------
function loadRoomFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error("❌ Folder not found:", DATA_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  console.log(`📦 Found ${files.length} JSON files`);

  return files.map((f) => ({
    id: f.replace(".json", ""),
    filePath: path.join(DATA_DIR, f),
  }));
}

// ------------------------------------------------------------
// Normalize entries
// ------------------------------------------------------------
function normalizeEntries(entries) {
  if (!Array.isArray(entries)) return [];

  return entries.map((e, index) => ({
    index,
    slug: e.slug || `entry-${index}`,
    copy_en: e.copy?.en || "",
    copy_vi: e.copy?.vi || "",
    audio: e.audio || null,
    tags: Array.isArray(e.tags) ? e.tags : [],
    severity: typeof e.severity === "number" ? e.severity : null,
    metadata: e || {},
  }));
}

// ------------------------------------------------------------
// Save a single room + entries into DB
// ------------------------------------------------------------
async function saveRoom(roomId, json) {
  console.log(`\n➡️  Migrating room: ${roomId}`);

  const roomPayload = {
    id: json.id || roomId,
    tier: json.tier || "free",
    title_en: json.title?.en || "",
    title_vi: json.title?.vi || "",
    content_en: json.content?.en || "",
    content_vi: json.content?.vi || "",
    content_audio: json.content?.audio || null,
    domain: json.domain || null,
    keywords: json.keywords_en || [],
    is_active: true,
  };

  // Insert/update room
  const { error: roomErr } = await supabase
    .from("rooms")
    .upsert(roomPayload, { onConflict: "id" });

  if (roomErr) {
    console.error("❌ Room insert failed:", roomErr);
    return { ok: false, err: roomErr };
  }

  // Delete old entries
  await supabase.from("room_entries").delete().eq("room_id", roomId);

  // Insert new entries
  const entries = normalizeEntries(json.entries);
  if (entries.length) {
    const payload = entries.map((e) => ({
      room_id: roomId,
      index: e.index,
      slug: e.slug,
      copy_en: e.copy_en,
      copy_vi: e.copy_vi,
      audio: e.audio,
      tags: e.tags,
      severity: e.severity,
      metadata: e.metadata,
    }));

    const { error: entryErr } = await supabase
      .from("room_entries")
      .insert(payload);

    if (entryErr) {
      console.error("❌ Entry insert failed:", entryErr);
      return { ok: false, err: entryErr };
    }
  }

  console.log(`✅ Room saved: ${roomId}  (entries: ${entries.length})`);
  return { ok: true };
}

// ------------------------------------------------------------
// MAIN MIGRATION LOGIC
// ------------------------------------------------------------
async function main() {
  const roomFiles = loadRoomFiles();

  let migrated = 0;
  let failed = 0;

  for (const f of roomFiles) {
    try {
      const raw = fs.readFileSync(f.filePath, "utf8");
      const json = JSON.parse(raw);

      const res = await saveRoom(f.id, json);
      if (res.ok) migrated++;
      else failed++;
    } catch (err) {
      console.error(`❌ Failed to process file: ${f.id}`, err);
      failed++;
    }
  }

  console.log("\n===============================");
  console.log(`🏁 Migration complete`);
  console.log(`   ✓ Migrated: ${migrated}`);
  console.log(`   ✗ Failed:   ${failed}`);
  console.log("===============================\n");

  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error("❌ Fatal migration error:", err);
  process.exit(1);
});
