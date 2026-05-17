// scripts/generate-english-b2-room-audio.ts
//
// SCOPED room-audio generator for the English B2 rooms only
// (english_b2_b201.json … english_b2_b214.json — 84 entries).
//
// Why this exists: the general scripts/generate-missing-audio.ts has NO
// scoping flags and regenerates audio for EVERY room whose mp3 is missing
// from local public/audio/. In a fresh checkout that dir is empty
// (CLAUDE.md: all bundled audio removed, Supabase-served), so running it
// unscoped would bill the entire ~474-room corpus through OpenAI. This
// script touches only the 14 B2 rooms and is idempotent against the
// Supabase room-audio bucket (skips keys that already exist).
//
// Text shape and TTS settings are byte-for-byte identical to
// generate-missing-audio.ts so B2 audio matches its sibling English rooms:
//   text  = `${room.title.en}. ${entry.copy.en.trim()}`
//   model = gpt-4o-mini-tts, voice = alloy, format = mp3
//
// Output: flat `{entry.audio}` (e.g. b201_01_en.mp3) at the root of the
// public Supabase `room-audio` bucket — exactly what roomAudioResolver.ts
// resolves via getPublicUrl('room-audio', filename).
//
// Required env (.env.local then .env; worktree cwd then main repo):
//   OPENAI_API_KEY
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   (NOT the anon key — needed for storage write)
//
// Usage:
//   npx tsx scripts/generate-english-b2-room-audio.ts --dry-run
//   npx tsx scripts/generate-english-b2-room-audio.ts --limit=2   (smoke)
//   npx tsx scripts/generate-english-b2-room-audio.ts             (full run)

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { config as loadDotenv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

for (const p of [
  ".env.local",
  ".env",
  "/Users/admin/MercyB/.env.local",
  "/Users/admin/MercyB/.env",
]) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const OPENAI_API_KEY = (process.env.OPENAI_API_KEY ?? "").trim();
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? "").trim();
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

const missing: string[] = [];
if (!OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (missing.length > 0) {
  console.error(`[b2-audio] missing env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const DATA_DIR = resolve(process.cwd(), "public", "data");
const BUCKET = "room-audio";
const ROOM_PREFIX = "english_b2_b2";

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const LIMIT = (() => {
  const a = argv.find((x) => x.startsWith("--limit="));
  return a ? parseInt(a.split("=")[1], 10) : Infinity;
})();

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

type Job = { room: string; filename: string; text: string };

function collectJobs(): Job[] {
  const files = readdirSync(DATA_DIR)
    .filter((f) => f.startsWith(ROOM_PREFIX) && f.endsWith(".json"))
    .sort();
  const jobs: Job[] = [];
  for (const f of files) {
    const room = JSON.parse(readFileSync(join(DATA_DIR, f), "utf8"));
    const baseTitle = room.title?.en ?? "Mercy Blade";
    const baseIntro = room.content?.en ?? "";
    for (const entry of room.entries ?? []) {
      if (!entry || typeof entry.audio !== "string" || !entry.audio.trim())
        continue;
      const body = entry.copy?.en?.trim();
      const text =
        body && body.length > 0
          ? `${baseTitle}. ${body}`
          : `${baseTitle}. ${baseIntro || "Guidance from Mercy Blade."}`;
      jobs.push({ room: f, filename: entry.audio.trim(), text });
    }
  }
  return jobs;
}

async function existsInBucket(filename: string): Promise<boolean> {
  // Bucket is public (CLAUDE.md) — a HEAD on the public URL is the cheapest
  // idempotency check and avoids listing the multi-thousand-file root.
  const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.status === 200;
  } catch {
    return false;
  }
}

async function main() {
  const allJobs = collectJobs();
  console.log(
    `[b2-audio] ${allJobs.length} candidate clips across ${
      new Set(allJobs.map((j) => j.room)).size
    } B2 rooms`
  );

  let generated = 0;
  let skipped = 0;
  let failed = 0;
  let processed = 0;

  for (const job of allJobs) {
    if (processed >= LIMIT) break;
    if (await existsInBucket(job.filename)) {
      skipped++;
      continue;
    }
    processed++;
    if (DRY_RUN) {
      console.log(
        `  [dry] ${job.filename}  (${job.room})  chars=${job.text.length}`
      );
      continue;
    }
    try {
      const resp = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        format: "mp3",
        input: job.text,
      });
      const bytes = Buffer.from(await resp.arrayBuffer());
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(job.filename, bytes, {
          contentType: "audio/mpeg",
          upsert: false,
        });
      if (error) throw error;
      generated++;
      console.log(`  ✅ ${job.filename}  (${job.room})  ${bytes.length} B`);
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      failed++;
      console.error(`  ❌ ${job.filename}`, err);
    }
  }

  console.log(
    `[b2-audio] done — generated=${generated} skipped=${skipped} failed=${failed}${
      DRY_RUN ? " (dry-run)" : ""
    }`
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[b2-audio] unexpected error", err);
  process.exit(1);
});
