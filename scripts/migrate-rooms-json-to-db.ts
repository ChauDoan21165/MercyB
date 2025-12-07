#!/usr/bin/env ts-node
/**
 * Migrate JSON rooms → Supabase (rooms + room_entries)
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/migrate-rooms-json-to-db.ts
 *
 * Assumes:
 *   - JSON files live in ./public/data/*.json
 *   - Tables: rooms, room_entries
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, join, extname, basename } from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type JsonRoom = {
  id?: string;
  tier?: string;
  slug?: string;
  title?: { en?: string; vi?: string };
  title_en?: string;
  title_vi?: string;
  content?: { en?: string; vi?: string; audio?: string };
  content_en?: string;
  content_vi?: string;
  content_audio?: string;
  tags?: string[] | null;
  is_active?: boolean;
  entries?: any[];
  [key: string]: any;
};

type JsonEntry = {
  slug?: string;
  copy?: { en?: string; vi?: string };
  copy_en?: string;
  copy_vi?: string;
  audio?: string | null;
  tags?: string[] | null;
  severity?: number;
  metadata?: any;
  [key: string]: any;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Default JSON directory
const DATA_DIR = resolve(process.cwd(), "public", "data");

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "[migrate] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env"
  );
  process.exit(1);
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// --- helpers ------------------------------------------------------------

function loadJsonFile(path: string): any {
  const raw = readFileSync(path, "utf8");
  return JSON.parse(raw);
}

async function upsertRoom(room: JsonRoom, fileName: string) {
  const baseId = room.id || basename(fileName, extname(fileName));
  const tier = room.tier || "Free / Miễn phí";

  const title_en = room.title?.en ?? room.title_en ?? baseId;
  const title_vi = room.title?.vi ?? room.title_vi ?? baseId;

  const content_en = room.content?.en ?? room.content_en ?? "";
  const content_vi = room.content?.vi ?? room.content_vi ?? "";
  const content_audio = room.content?.audio ?? room.content_audio ?? null;

  const slug =
    room.slug ??
    baseId
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const tags = (room as any).tags ?? null;
  const is_active =
    typeof room.is_active === "boolean" ? room.is_active : true;

  const row = {
    id: baseId,
    tier,
    slug,
    title_en,
    title_vi,
    content_en,
    content_vi,
    content_audio,
    tags,
    is_active,
  };

  const { error } = await supabase.from("rooms").upsert(row, {
    onConflict: "id",
  });

  if (error) {
    throw new Error(
      `[migrate] rooms upsert failed for ${baseId}: ${error.message}`
    );
  }

  return baseId;
}

async function replaceRoomEntries(roomId: string, entries: JsonEntry[] = []) {
  // Clear old entries for this room
  const { error: delError } = await supabase
    .from("room_entries")
    .delete()
    .eq("room_id", roomId);

  if (delError) {
    throw new Error(
      `[migrate] room_entries delete failed for ${roomId}: ${delError.message}`
    );
  }

  if (!entries.length) return;

  const rows = entries.map((entry, index) => {
    const slugBase = entry.slug || `entry-${index + 1}`;
    const slug = slugBase
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const copy_en =
      entry.copy?.en ??
      entry.copy_en ??
      (typeof entry === "string" ? (entry as any) : "");
    const copy_vi =
      entry.copy?.vi ??
      entry.copy_vi ??
      (typeof entry === "string" ? (entry as any) : "");

    return {
      room_id: roomId,
      index: index + 1,
      slug,
      copy_en,
      copy_vi,
      audio: entry.audio ?? null,
      tags: entry.tags ?? null,
      severity: entry.severity ?? null,
      metadata: entry.metadata ?? null,
    };
  });

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error: insError } = await supabase
      .from("room_entries")
      .insert(batch);

    if (insError) {
      throw new Error(
        `[migrate] room_entries insert failed for ${roomId} batch ${i}: ${insError.message}`
      );
    }
  }
}

// --- main ---------------------------------------------------------------

async function main() {
  console.log("[migrate] Starting JSON → Supabase migration...");
  console.log("[migrate] Reading from:", DATA_DIR);

  const files = readdirSync(DATA_DIR).filter(
    (f) => extname(f).toLowerCase() === ".json"
  );

  console.log(`[migrate] Found ${files.length} JSON files`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const file of files) {
    const filePath = join(DATA_DIR, file);

    try {
      const json = loadJsonFile(filePath);

      // Skip non-room files (registries, manifests, etc.)
      if (!json || typeof json !== "object") {
        console.log(`[migrate] Skipping non-object: ${file}`);
        continue;
      }

      // Skip files that don't look like rooms
      if (!json.id && !json.title && !json.entries) {
        console.log(`[migrate] Skipping non-room file: ${file}`);
        continue;
      }

      const roomId = await upsertRoom(json, file);
      await replaceRoomEntries(roomId, json.entries || []);

      successCount++;
      console.log(
        `[migrate] ✓ ${file} → ${roomId} (${(json.entries || []).length} entries)`
      );
    } catch (err: any) {
      errorCount++;
      const msg = `${file}: ${err.message}`;
      errors.push(msg);
      console.error(`[migrate] ✗ ${msg}`);
    }
  }

  console.log("\n[migrate] === Summary ===");
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors:  ${errorCount}`);

  if (errors.length > 0) {
    console.log("\n[migrate] Errors:");
    errors.forEach((e) => console.log(`  - ${e}`));
  }

  console.log("\n[migrate] Done.");
}

main().catch((err) => {
  console.error("[migrate] Fatal error:", err);
  process.exit(1);
});
