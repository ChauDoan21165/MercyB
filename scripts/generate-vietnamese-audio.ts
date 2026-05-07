/**
 * Generate Vietnamese lesson audio via FPT.AI and upload to Supabase Storage.
 *
 * Reads src/languages/vietnamese/lessons.ts directly (different schema from other languages).
 * Generates audio ONLY for Vietnamese text — never English, never pronunciation guides.
 *
 * Voice rotation:
 *   - phrases: alternate thuminh / leminh by phrase index
 *   - dialogue: first speaker = thuminh, second = leminh, alternating per line
 *
 * Storage key pattern: {level}/vi/l{id}/phrase_{n}.mp3,
 *                       {level}/vi/l{id}/dialogue_{n}.mp3
 *
 * The level segment is derived per-lesson from lesson.level.toLowerCase()
 * so each batch lands under the right prefix without manual config.
 *
 * Required env (.env.local then .env):
 *   FPT_API_KEY
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npx tsx scripts/generate-vietnamese-audio.ts            — full run, all levels
 *   npx tsx scripts/generate-vietnamese-audio.ts --dry-run  — list what would run
 *   npx tsx scripts/generate-vietnamese-audio.ts --limit=5  — first 5 entries
 *   npx tsx scripts/generate-vietnamese-audio.ts --level=B1 — only lessons with level==="B1"
 */

import { config as loadDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { VIETNAMESE_LESSONS } from "../src/languages/vietnamese/lessons";

for (const p of [".env.local", ".env"]) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const FPT_KEY = process.env.FPT_API_KEY;
const SUPA_URL = process.env.VITE_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!FPT_KEY || !SUPA_URL || !SUPA_KEY) {
  console.error("Missing env: FPT_API_KEY, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPA_URL, SUPA_KEY);
const BUCKET = "room-audio";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT_ARG = args.find((a) => a.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split("=")[1]!, 10) : Infinity;
const LEVEL_ARG = args.find((a) => a.startsWith("--level="));
const LEVEL_FILTER = LEVEL_ARG ? LEVEL_ARG.split("=")[1]!.trim() : null;

const VOICES = ["thuminh", "leminh"] as const;

type Entry = {
  storage_key: string;
  text: string;
  voice: string;
};

// Build manifest
const entries: Entry[] = [];
const filteredLessons = LEVEL_FILTER
  ? VIETNAMESE_LESSONS.filter((l) => (l as { level?: string }).level === LEVEL_FILTER)
  : VIETNAMESE_LESSONS;
for (const lesson of filteredLessons) {
  // Storage prefix follows the lesson's own CEFR level so each batch
  // lands under the right segment (a1/vi/..., b1/vi/..., etc).
  const levelPrefix = String((lesson as { level?: string }).level ?? "a1").toLowerCase();
  // Phrases: alternate voices by index
  lesson.phrases.forEach((ph, i) => {
    if (!ph.vietnamese?.trim()) return;
    entries.push({
      storage_key: `${levelPrefix}/vi/l${lesson.id}/phrase_${i + 1}.mp3`,
      text: ph.vietnamese.trim().length < 3 ? ph.vietnamese.trim() + "." : ph.vietnamese.trim(),
      voice: VOICES[i % 2]!,
    });
  });
  // Dialogue: alternate voices by speaker order
  if (lesson.dialogue) {
    lesson.dialogue.forEach((line, i) => {
      if (!line.vietnamese?.trim()) return;
      entries.push({
        storage_key: `${levelPrefix}/vi/l${lesson.id}/dialogue_${i + 1}.mp3`,
        text: line.vietnamese.trim().length < 3 ? line.vietnamese.trim() + "." : line.vietnamese.trim(),
        voice: VOICES[i % 2]!,
      });
    });
  }
}

console.log(`[manifest] total entries: ${entries.length}`);
console.log(`[manifest] total chars: ${entries.reduce((s, e) => s + e.text.length, 0)}`);

if (DRY_RUN) {
  console.log("\n[DRY-RUN] first 5 entries:");
  for (const e of entries.slice(0, 5)) {
    console.log(`  ${e.storage_key}  voice=${e.voice}  chars=${e.text.length}  text="${e.text}"`);
  }
  process.exit(0);
}

async function existsInBucket(key: string): Promise<boolean> {
  const dir = key.substring(0, key.lastIndexOf("/"));
  const file = key.substring(key.lastIndexOf("/") + 1);
  const { data, error } = await supabase.storage.from(BUCKET).list(dir, {
    limit: 1000,
    search: file,
  });
  if (error) return false;
  return !!data?.find((f) => f.name === file);
}

async function fptGenerate(voice: string, text: string): Promise<Buffer | null> {
  const res = await fetch("https://api.fpt.ai/hmi/tts/v5", {
    method: "POST",
    headers: {
      "api-key": FPT_KEY!,
      voice,
      speed: "0",
      "Content-Type": "text/plain",
    },
    body: text,
  });
  if (!res.ok) {
    console.error(`  FPT ${res.status}: ${await res.text()}`);
    return null;
  }
  const json: { async?: string } = await res.json();
  if (!json.async) {
    console.error(`  FPT no async URL`);
    return null;
  }
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const mp3 = await fetch(json.async);
    if (mp3.ok) return Buffer.from(await mp3.arrayBuffer());
  }
  console.error(`  FPT timeout`);
  return null;
}

async function uploadToSupabase(key: string, buf: Buffer): Promise<boolean> {
  const { error } = await supabase.storage.from(BUCKET).upload(key, buf, {
    contentType: "audio/mpeg",
    upsert: false,
  });
  if (error && !/already exists/i.test(error.message)) {
    console.error(`  upload error: ${error.message}`);
    return false;
  }
  return true;
}

(async () => {
  let done = 0,
    skipped = 0,
    failed = 0,
    chars = 0;
  const work = entries.slice(0, LIMIT);

  for (let i = 0; i < work.length; i++) {
    const e = work[i]!;
    if (await existsInBucket(e.storage_key)) {
      skipped++;
    } else {
      const buf = await fptGenerate(e.voice, e.text);
      if (!buf) {
        failed++;
      } else if (await uploadToSupabase(e.storage_key, buf)) {
        done++;
        chars += e.text.length;
      } else {
        failed++;
      }
    }
    if ((i + 1) % 25 === 0 || i === work.length - 1) {
      console.log(
        `[generate] ${i + 1}/${work.length}  done=${done} skipped=${skipped} failed=${failed} chars=${chars}`,
      );
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Processed:        ${work.length}`);
  console.log(`  Newly generated:  ${done}`);
  console.log(`  Skipped (exists): ${skipped}`);
  console.log(`  Failed:           ${failed}`);
  console.log(`  Chars billed:     ${chars}`);
})();
