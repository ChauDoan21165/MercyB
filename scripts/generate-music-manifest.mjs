// Lists the `music` Supabase Storage bucket and writes a snapshot manifest.
// Decoupled from the room-audio manifest (which scans local public/audio).
// Output: public/audio/music-manifest.json
//
// Run:
//   node scripts/generate-music-manifest.mjs
//
// Required env (read from .env):
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? "").trim();
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("[music-manifest] missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const BUCKET = "music";
const OUT = "public/audio/music-manifest.json";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.storage.from(BUCKET).list("", {
  limit: 1000,
  sortBy: { column: "name", order: "asc" },
});

if (error) {
  console.error(`[music-manifest] list failed: ${error.message}`);
  process.exit(1);
}

const files = (data ?? [])
  .filter((f) => f.name && f.name.toLowerCase().endsWith(".mp3"))
  .map((f) => ({
    name: f.name,
    size: f.metadata?.size ?? null,
    publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f.name}`,
  }));

const manifest = {
  bucket: BUCKET,
  generatedAt: new Date().toISOString(),
  total: files.length,
  files,
};

writeFileSync(OUT, JSON.stringify(manifest, null, 2));
console.log(`[music-manifest] wrote ${OUT} — ${files.length} file(s)`);
