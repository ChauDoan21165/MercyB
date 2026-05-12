/**
 * Generate TOEFL Listening passage audio via Google Cloud TTS and upload
 * to Supabase Storage `room-audio` bucket.
 *
 * One MP3 per listening item, keyed by item.audioKey
 * (toefl-listening/{item.id}.mp3). Voice mapping per CC brief:
 *
 *   item.type === "lecture"      → en-US-Wavenet-D (male, academic)
 *   item.type === "conversation" → en-US-Wavenet-F (female; single voice
 *                                  covers both speakers for v1)
 *
 * Conversation scripts in listening-items.ts use `SPEAKER:` line prefixes
 * for the on-screen transcript. Those prefixes are stripped before TTS so
 * the audio reads as natural prose. Multi-voice rendering is a v2 concern.
 *
 * Free tier: Google WaveNet covers 4M chars/month. The full TOEFL pack
 * is ~25K chars across 9 items — well under quota.
 *
 * Required env (`.env.local` then `.env`):
 *   GOOGLE_APPLICATION_CREDENTIALS   — path to GCP service-account JSON
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npx tsx scripts/generate-toefl-listening-audio.ts            — live run
 *   npx tsx scripts/generate-toefl-listening-audio.ts --dry-run  — preview
 *   npx tsx scripts/generate-toefl-listening-audio.ts --force    — re-render
 *                                                                  even if
 *                                                                  the key
 *                                                                  is in
 *                                                                  the
 *                                                                  bucket
 */

import { existsSync, readFileSync } from "node:fs";
import { config as loadDotenv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { TOEFL_LISTENING_ITEMS } from "../src/data/exam-prep/toefl/listening-items";

// ─── Env loading ─────────────────────────────────────────────────────────
// Mirror generate-vstep-speaking-audio.ts: try both relative paths (when
// run from repo root or a worktree that has a copied .env) and the
// canonical home path so a worktree without its own .env still picks up
// the values from /Users/admin/MercyB/.env.

const ENV_SEARCH_PATHS = [
  ".env.local",
  ".env",
  "/Users/admin/MercyB/.env.local",
  "/Users/admin/MercyB/.env",
];
for (const p of ENV_SEARCH_PATHS) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const GOOGLE_KEY_PATH = (process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "").trim();
const SUPA_URL = (process.env.VITE_SUPABASE_URL ?? "").trim();
const SUPA_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");

const BUCKET = "room-audio";

function validateEnv(): void {
  const missing: string[] = [];
  if (!GOOGLE_KEY_PATH) missing.push("GOOGLE_APPLICATION_CREDENTIALS");
  if (!SUPA_URL) missing.push("VITE_SUPABASE_URL");
  if (!SUPA_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length > 0) {
    console.error(`[toefl-listening-audio] missing env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

const supabase = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Script cleanup ──────────────────────────────────────────────────────
// Conversation passages are written as multi-speaker dialogue
// (`ADVISOR: …`, `STUDENT: …`). For TTS we strip the all-caps speaker
// label so Google reads natural prose rather than "ADVISOR — Hi — come
// on in" with the colon spoken. Lectures rarely have prefixes; the
// regex is a no-op on those.
function cleanAudioScript(raw: string): string {
  return raw
    .split("\n")
    .map((line) => line.replace(/^[A-Z][A-Z\s]{1,30}:\s+/, "").trim())
    .filter((line) => line.length > 0)
    .join(" ");
}

// ─── Job building ────────────────────────────────────────────────────────

type Job = {
  itemId: string;
  storageKey: string;
  voice: "en-US-Wavenet-D" | "en-US-Wavenet-F";
  itemType: "lecture" | "conversation";
  text: string;
  chars: number;
};

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  for (const item of TOEFL_LISTENING_ITEMS) {
    if (!item.audioKey) continue;
    const text = cleanAudioScript(item.audio_script ?? "");
    if (!text) continue;
    jobs.push({
      itemId: item.id,
      storageKey: item.audioKey,
      voice: item.type === "lecture" ? "en-US-Wavenet-D" : "en-US-Wavenet-F",
      itemType: item.type,
      text,
      chars: text.length,
    });
  }
  return jobs;
}

// ─── Google TTS ──────────────────────────────────────────────────────────

let _googleAuth: import("google-auth-library").GoogleAuth | null = null;
async function getGoogleAuth(): Promise<import("google-auth-library").GoogleAuth> {
  if (_googleAuth) return _googleAuth;
  const { GoogleAuth } = await import("google-auth-library");
  const credentials = JSON.parse(readFileSync(GOOGLE_KEY_PATH, "utf-8"));
  _googleAuth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  return _googleAuth;
}

async function googleGenerate(voice: string, text: string): Promise<Buffer | null> {
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
          voice: { languageCode: "en-US", name: voice },
          audioConfig: { audioEncoding: "MP3", speakingRate: 0.95 },
        }),
      },
    );
    if (!res.ok) {
      console.error(`  Google TTS ${res.status}: ${await res.text()}`);
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

// ─── Supabase ────────────────────────────────────────────────────────────

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

// ─── Main ────────────────────────────────────────────────────────────────

(async () => {
  const jobs = buildJobs();
  const totalChars = jobs.reduce((s, j) => s + j.chars, 0);
  console.log(
    `[toefl-listening-audio] jobs=${jobs.length} total_chars=${totalChars} dry_run=${DRY_RUN} force=${FORCE}`,
  );

  if (DRY_RUN) {
    console.log("\n=== DRY-RUN ===");
    for (const j of jobs) {
      console.log(
        `  ${j.itemType.padEnd(12)} ${j.voice.padEnd(18)} ${j.storageKey.padEnd(64)} chars=${j.chars}`,
      );
    }
    return;
  }

  validateEnv();

  let done = 0;
  let skipped = 0;
  let failed = 0;
  let chars = 0;
  const failures: Array<{ key: string; reason: string }> = [];

  for (const j of jobs) {
    const present = !FORCE && (await existsInBucket(j.storageKey));
    if (present) {
      console.log(`  SKIP  ${j.storageKey}`);
      skipped++;
      continue;
    }

    const buf = await googleGenerate(j.voice, j.text);
    if (!buf) {
      failures.push({ key: j.storageKey, reason: "tts_failed" });
      failed++;
      continue;
    }
    const ok = await uploadToSupabase(j.storageKey, buf);
    if (!ok) {
      failures.push({ key: j.storageKey, reason: "upload_failed" });
      failed++;
      continue;
    }
    console.log(`  OK    ${j.storageKey}  (${j.chars} chars · ${j.voice})`);
    done++;
    chars += j.chars;
  }

  console.log("\n=== Summary ===");
  console.log(`  Processed:        ${jobs.length}`);
  console.log(`  Newly generated:  ${done}`);
  console.log(`  Skipped (exists): ${skipped}`);
  console.log(`  Failed:           ${failed}`);
  console.log(`  Chars billed:     ${chars}`);
  if (failures.length > 0) {
    console.log("\n  Failures:");
    for (const f of failures) console.log(`    ${f.key}: ${f.reason}`);
  }

  console.log(
    "\n[toefl-listening-audio] JSON_SUMMARY=" +
      JSON.stringify({
        jobs: jobs.length,
        generated: done,
        skipped,
        failed,
        chars_billed: chars,
        failures,
      }),
  );
})();
