/**
 * Generate Spanish lesson audio via Google Cloud TTS and upload to Supabase Storage.
 *
 * Mirrors scripts/generate-vietnamese-audio.ts — Spanish is the second
 * MercyBlade language module on Google Cloud TTS. ElevenLabs (used by
 * the other six languages) produced unrecognizable Vietnamese output;
 * the same risk applies to any non-English target until proven otherwise.
 *
 * Source of truth: public.lessons rows where language='spanish'. Each
 * row's `content` JSON is a SpanishLesson (see src/languages/spanish/
 * lessons.ts). We walk sentences[], vocabulary[], and dialogue[] and
 * synthesize each into a separate MP3 stored at the same path scheme
 * the audio resolver expects (mirrors scripts/build-audio-manifest.ts
 * extractSpanish):
 *
 *   {level}/es/l{slug}/sentence_{N}.mp3       — alternating voices by index
 *   {level}/es/l{slug}/vocab_{N}.mp3          — female voice
 *   {level}/es/l{slug}/dialogue_short_{N}_{A|B}.mp3
 *
 * Slug: strip "spanish_{level}_" or "spanish_" prefix from the lesson
 * id (matches lessonStorageSlug in src/lib/lessonAudio.ts).
 *
 * Voices (LatAm-leaning, broader learner appeal):
 *   es-US-Neural2-A = female
 *   es-US-Neural2-B = male
 *
 * If Chau later wants Peninsular (es-ES) audio, that's a one-line change.
 *
 * Required env (.env.local then .env):
 *   GOOGLE_APPLICATION_CREDENTIALS   — path to GCP service-account JSON
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npx tsx scripts/generate-spanish-audio.ts                    — full A1 run
 *   npx tsx scripts/generate-spanish-audio.ts --dry-run          — list what would run
 *   npx tsx scripts/generate-spanish-audio.ts --limit=5          — smoke test, first 5 clips
 *   npx tsx scripts/generate-spanish-audio.ts --level=a1         — explicit level
 *   npx tsx scripts/generate-spanish-audio.ts --force            — re-render even if file exists
 */

import { config as loadDotenv } from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const p of [".env.local", ".env"]) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const GOOGLE_KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const SUPA_URL = process.env.VITE_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GOOGLE_KEY_PATH || !SUPA_URL || !SUPA_KEY) {
  console.error(
    "Missing env: GOOGLE_APPLICATION_CREDENTIALS, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(SUPA_URL, SUPA_KEY);
const BUCKET = "room-audio";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const LIMIT_ARG = args.find((a) => a.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split("=")[1]!, 10) : Infinity;
const LEVEL_ARG = args.find((a) => a.startsWith("--level="));
const LEVEL_FILTER = (LEVEL_ARG ? LEVEL_ARG.split("=")[1]!.trim() : "a1").toLowerCase();

// Voice mapping. Chau will audition output at --limit=5 before any full
// batch — if the LatAm voices don't feel right, swap to es-ES-Neural2-A /
// es-ES-Neural2-B (Peninsular) without other changes.
const FEMALE_VOICE = "es-US-Neural2-A";
const MALE_VOICE = "es-US-Neural2-B";

// ── Slug derivation ─────────────────────────────────────────────────────
// Matches lessonStorageSlug("es", id, level) from src/lib/lessonAudio.ts.
function spanishSlug(lessonId: string, level: string): string {
  let s = lessonId;
  s = s.replace(new RegExp(`^spanish_${level.toLowerCase()}_`), "");
  s = s.replace(/^spanish_fluency_/, "");
  s = s.replace(/^spanish_/, "");
  return `l${s}`;
}

// ── Speaker letter for dialogue ─────────────────────────────────────────
// Mirrors extractSpanish in scripts/build-audio-manifest.ts: respect
// explicit "A"/"B" speaker labels; otherwise alternate by index for
// role-name speakers ("Camarero", "Tú", "Mesera").
function speakerLetter(speaker: string | undefined, index: number): "A" | "B" {
  const raw = (speaker ?? "").trim().toUpperCase();
  if (raw === "A") return "A";
  if (raw === "B") return "B";
  return index % 2 === 0 ? "A" : "B";
}

// ── Manifest building ───────────────────────────────────────────────────

type Entry = {
  storage_key: string;
  text: string;
  voice: string;
  unit_kind: "sentence" | "vocab" | "dialogue_short";
  lesson_id: string;
};

type SpanishLessonContent = {
  id: string;
  level: string;
  sentences?: Array<{ spanish?: string }>;
  vocabulary?: Array<{ word?: string }>;
  dialogue?: Array<{ spanish?: string; speaker?: string }>;
};

const entries: Entry[] = [];

async function buildManifest(): Promise<void> {
  const { data: lessonRows, error } = await supabase
    .from("lessons")
    .select("content")
    .eq("language", "spanish")
    .eq("level", LEVEL_FILTER)
    .order("lesson_index", { ascending: true });

  if (error || !lessonRows) {
    console.error("Failed to load Spanish lessons from Supabase:", error);
    process.exit(1);
  }

  const lessons = lessonRows.map((row) => row.content as SpanishLessonContent);
  console.log(`[manifest] loaded ${lessons.length} Spanish ${LEVEL_FILTER.toUpperCase()} lessons`);

  for (const lesson of lessons) {
    const levelPrefix = String(lesson.level ?? LEVEL_FILTER).toLowerCase();
    const slug = spanishSlug(lesson.id, levelPrefix);

    // Sentences — alternate F/M by index.
    (lesson.sentences ?? []).forEach((s, i) => {
      const text = (s.spanish ?? "").trim();
      if (!text) return;
      entries.push({
        storage_key: `${levelPrefix}/es/${slug}/sentence_${i + 1}.mp3`,
        text,
        voice: i % 2 === 0 ? FEMALE_VOICE : MALE_VOICE,
        unit_kind: "sentence",
        lesson_id: lesson.id,
      });
    });

    // Vocabulary — female voice (single voice is fine for isolated words).
    (lesson.vocabulary ?? []).forEach((v, i) => {
      const text = (v.word ?? "").trim();
      if (!text) return;
      entries.push({
        storage_key: `${levelPrefix}/es/${slug}/vocab_${i + 1}.mp3`,
        text,
        voice: FEMALE_VOICE,
        unit_kind: "vocab",
        lesson_id: lesson.id,
      });
    });

    // Dialogue — A=female, B=male by speaker letter (alternates for role names).
    (lesson.dialogue ?? []).forEach((d, i) => {
      const text = (d.spanish ?? "").trim();
      if (!text) return;
      const letter = speakerLetter(d.speaker, i);
      entries.push({
        storage_key: `${levelPrefix}/es/${slug}/dialogue_short_${i + 1}_${letter}.mp3`,
        text,
        voice: letter === "A" ? FEMALE_VOICE : MALE_VOICE,
        unit_kind: "dialogue_short",
        lesson_id: lesson.id,
      });
    });
  }
}

// ── Storage existence check (idempotency) ───────────────────────────────

async function existsInBucket(key: string): Promise<boolean> {
  const lastSlash = key.lastIndexOf("/");
  const dir = lastSlash >= 0 ? key.slice(0, lastSlash) : "";
  const file = lastSlash >= 0 ? key.slice(lastSlash + 1) : key;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(dir, { limit: 1000, search: file });
  if (error) return false;
  return !!data?.find((f) => f.name === file);
}

// ── Google Cloud TTS ────────────────────────────────────────────────────

let _googleAuth: import("google-auth-library").GoogleAuth | null = null;
async function getGoogleAuth(): Promise<import("google-auth-library").GoogleAuth> {
  if (_googleAuth) return _googleAuth;
  const { GoogleAuth } = await import("google-auth-library");
  const credentials = JSON.parse(readFileSync(GOOGLE_KEY_PATH!, "utf-8"));
  _googleAuth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  return _googleAuth;
}

async function googleGenerate(voice: string, text: string): Promise<Buffer | null> {
  // No fallback to ElevenLabs on Google failure — per brief, fail loud so
  // Chau can debug. We DO catch transient network errors and return null
  // so a single TCP reset doesn't kill a 300-clip batch; the caller logs
  // the failure and continues.
  try {
    const auth = await getGoogleAuth();
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    if (!token.token) {
      console.error("  Google TTS: no access token");
      return null;
    }
    const res = await fetch(
      "https://texttospeech.googleapis.com/v1/text:synthesize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          // es-US: LatAm-leaning, broader learner appeal. Swap to es-ES
          // for Peninsular if Chau decides later.
          voice: { languageCode: "es-US", name: voice },
          audioConfig: { audioEncoding: "MP3" },
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`  Google TTS ${res.status}: ${body.slice(0, 400)}`);
      return null;
    }
    const json: { audioContent?: string } = await res.json();
    if (!json.audioContent) {
      console.error("  Google TTS: response missing audioContent");
      return null;
    }
    return Buffer.from(json.audioContent, "base64");
  } catch (err) {
    console.error(
      `  Google TTS fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
}

// ── Supabase upload ─────────────────────────────────────────────────────

async function uploadToSupabase(key: string, buf: Buffer): Promise<boolean> {
  const { error } = await supabase.storage.from(BUCKET).upload(key, buf, {
    contentType: "audio/mpeg",
    upsert: FORCE,
  });
  if (error && !/already exists/i.test(error.message)) {
    console.error(`  upload error: ${error.message}`);
    return false;
  }
  return true;
}

// ── Main ────────────────────────────────────────────────────────────────

(async () => {
  await buildManifest();

  const work = entries.slice(0, LIMIT);
  const totalChars = work.reduce((s, e) => s + e.text.length, 0);

  console.log(`[manifest] level=${LEVEL_FILTER} total_entries=${entries.length}`);
  console.log(`[manifest] processing ${work.length} (limit=${LIMIT === Infinity ? "none" : LIMIT})`);
  console.log(`[manifest] total chars to synthesize: ${totalChars}`);
  console.log(`[manifest] voices: F=${FEMALE_VOICE}, M=${MALE_VOICE}`);

  if (DRY_RUN) {
    console.log("\n[DRY-RUN] first 10 entries:");
    for (const e of work.slice(0, 10)) {
      console.log(
        `  ${e.unit_kind.padEnd(15)} ${e.storage_key.padEnd(60)} voice=${e.voice}  chars=${e.text.length}  text="${e.text.slice(0, 60)}"`,
      );
    }
    process.exit(0);
  }

  let done = 0, skipped = 0, failed = 0, chars = 0;
  const failures: Array<{ key: string; reason: string }> = [];

  for (let i = 0; i < work.length; i++) {
    const e = work[i]!;
    if (!FORCE && (await existsInBucket(e.storage_key))) {
      skipped++;
    } else {
      const buf = await googleGenerate(e.voice, e.text);
      if (!buf) {
        failed++;
        failures.push({ key: e.storage_key, reason: "tts_failed" });
      } else if (await uploadToSupabase(e.storage_key, buf)) {
        done++;
        chars += e.text.length;
      } else {
        failed++;
        failures.push({ key: e.storage_key, reason: "upload_failed" });
      }
    }
    if ((i + 1) % 25 === 0 || i === work.length - 1) {
      console.log(
        `[generate] ${i + 1}/${work.length}  done=${done} skipped=${skipped} failed=${failed} chars=${chars}`,
      );
    }
  }

  console.log("\n=== Summary ===");
  console.log(`  Processed:        ${work.length}`);
  console.log(`  Newly generated:  ${done}`);
  console.log(`  Skipped (exists): ${skipped}`);
  console.log(`  Failed:           ${failed}`);
  console.log(`  Chars billed:     ${chars}`);
  if (failures.length > 0) {
    console.log("\n  Failures:");
    for (const f of failures.slice(0, 20)) console.log(`    ${f.key}: ${f.reason}`);
  }
  console.log(
    "\n[generate-spanish-audio] JSON_SUMMARY=" +
      JSON.stringify({
        level: LEVEL_FILTER,
        manifest_total: entries.length,
        processed: work.length,
        generated: done,
        skipped,
        failed,
        chars_billed: chars,
      }),
  );
})();
