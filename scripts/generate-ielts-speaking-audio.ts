/**
 * Generate ElevenLabs audio for IELTS Speaking sample answers.
 *
 * For each of the 30 topics in src/data/exam-prep/ielts/speaking-topics.ts,
 * generates 2 mp3 clips uploaded to Supabase Storage room-audio bucket:
 *   ielts-speaking/{topic.id}/band7.mp3   ← topic.sample_strong_answer_band_7
 *   ielts-speaking/{topic.id}/band5.mp3   ← topic.sample_weak_answer_band_5
 *                                            (with [bracket annotations] stripped)
 *
 * Conventions match scripts/generate-b2-audio.ts:
 *   - eleven_multilingual_v2, voice_settings { stability: 0.5, similarity_boost: 0.75 }
 *   - Skip when storage_key already exists in bucket (idempotent)
 *   - Continue-on-error; log failures
 *   - Bucket: room-audio
 *
 * Voices:
 *   - Band 7: hpp4J3VqNfWAUOO0d1Us (primary — first entry of VOICE_IDS in build-audio-manifest.ts)
 *   - Band 5: CwhRBWXzGAHq8TQ4Fs17 (secondary — second entry)
 *
 * Usage:
 *   npx tsx scripts/generate-ielts-speaking-audio.ts --dry-run
 *   npx tsx scripts/generate-ielts-speaking-audio.ts            (live run)
 */

import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import { IELTS_SPEAKING_TOPICS } from "../src/data/exam-prep/ielts/speaking-topics";

// ─── Env loading ─────────────────────────────────────────────────────────

const ENV_SEARCH_PATHS = [
  ".env.local",
  ".env",
  "/Users/admin/MercyB/.env.local",
  "/Users/admin/MercyB/.env",
];
for (const p of ENV_SEARCH_PATHS) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const ELEVENLABS_API_KEY = (process.env.ELEVENLABS_API_KEY ?? "").trim();
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? "").trim();
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

// ─── CLI args ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

// ─── Constants ────────────────────────────────────────────────────────────

const BUCKET = "room-audio";
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const MODEL_ID = "eleven_multilingual_v2";
const VOICE_BAND_7 = "hpp4J3VqNfWAUOO0d1Us";
const VOICE_BAND_5 = "CwhRBWXzGAHq8TQ4Fs17";
const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75 };
const MAX_RETRIES = 3;
const CONCURRENCY = 4;

// ─── Env validation (skip in dry-run) ────────────────────────────────────

function validateEnv(): void {
  const missing: string[] = [];
  if (!ELEVENLABS_API_KEY) missing.push("ELEVENLABS_API_KEY");
  if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
  if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length > 0) {
    console.error(`[ielts-audio] missing env vars: ${missing.join(", ")}`);
    console.error(`[ielts-audio] searched: ${ENV_SEARCH_PATHS.join(", ")}`);
    process.exit(1);
  }
}

// ─── Text prep ───────────────────────────────────────────────────────────

function stripBracketAnnotations(s: string): string {
  return s.replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
}

type Job = {
  topic_id: string;
  band: 5 | 7;
  storage_key: string;
  voice_id: string;
  text: string;
  char_count: number;
};

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  for (const t of IELTS_SPEAKING_TOPICS) {
    const band7Text = (t.sample_strong_answer_band_7 ?? "").trim();
    const band5Text = stripBracketAnnotations(t.sample_weak_answer_band_5 ?? "");
    if (band7Text) {
      jobs.push({
        topic_id: t.id,
        band: 7,
        storage_key: `ielts-speaking/${t.id}/band7.mp3`,
        voice_id: VOICE_BAND_7,
        text: band7Text,
        char_count: band7Text.length,
      });
    }
    if (band5Text) {
      jobs.push({
        topic_id: t.id,
        band: 5,
        storage_key: `ielts-speaking/${t.id}/band5.mp3`,
        voice_id: VOICE_BAND_5,
        text: band5Text,
        char_count: band5Text.length,
      });
    }
  }
  return jobs;
}

// ─── ElevenLabs ──────────────────────────────────────────────────────────

type RenderResult =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; status: number; reason: string; quotaHit?: boolean };

async function renderWithElevenLabs(text: string, voiceId: string): Promise<RenderResult> {
  let lastErr: { status: number; reason: string } | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await fetch(`${ELEVENLABS_BASE}/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS }),
      });
      if (resp.ok) {
        const buf = new Uint8Array(await resp.arrayBuffer());
        return { ok: true, bytes: buf };
      }
      const detail = await resp.text().catch(() => "");
      const truncated = detail.slice(0, 200);
      if (resp.status === 401) {
        return { ok: false, status: 401, reason: `auth: ${truncated}` };
      }
      if (resp.status === 429 || /quota|credit|exceed/i.test(truncated)) {
        return { ok: false, status: resp.status, reason: `quota: ${truncated}`, quotaHit: true };
      }
      if (resp.status >= 500) {
        lastErr = { status: resp.status, reason: `5xx: ${truncated}` };
        await sleep(1000 * 2 ** (attempt - 1));
        continue;
      }
      return { ok: false, status: resp.status, reason: truncated };
    } catch (err) {
      lastErr = { status: 0, reason: `network: ${String(err)}` };
      await sleep(1000 * 2 ** (attempt - 1));
    }
  }
  return { ok: false, status: lastErr?.status ?? 0, reason: lastErr?.reason ?? "max retries" };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Supabase ────────────────────────────────────────────────────────────

let _supabase: ReturnType<typeof createClient> | null = null;
function supa() {
  if (!_supabase) {
    _supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _supabase;
}

async function existsInBucket(storageKey: string): Promise<boolean> {
  const lastSlash = storageKey.lastIndexOf("/");
  const dir = lastSlash >= 0 ? storageKey.slice(0, lastSlash) : "";
  const filename = lastSlash >= 0 ? storageKey.slice(lastSlash + 1) : storageKey;
  const { data, error } = await supa().storage.from(BUCKET).list(dir, {
    search: filename,
    limit: 1,
  });
  if (error) return false;
  return (data ?? []).some((f) => f.name === filename);
}

async function uploadMp3(storageKey: string, bytes: Uint8Array): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supa().storage.from(BUCKET).upload(storageKey, bytes, {
    contentType: "audio/mpeg",
    upsert: false,
  });
  if (error && !/already exists|the resource already exists/i.test(error.message)) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

// ─── Worker pool ─────────────────────────────────────────────────────────

type Outcome = "generated" | "skipped" | "failed";

async function processJob(
  job: Job,
  state: { generated: number; skipped: number; failed: number; chars: number; failures: Array<{ key: string; reason: string }>; quotaHit: boolean },
): Promise<Outcome> {
  if (state.quotaHit) return "failed";
  const present = await existsInBucket(job.storage_key);
  if (present) {
    state.skipped++;
    return "skipped";
  }
  const render = await renderWithElevenLabs(job.text, job.voice_id);
  if (!render.ok) {
    if (render.quotaHit) {
      state.quotaHit = true;
      state.failures.push({ key: job.storage_key, reason: `QUOTA: ${render.reason}` });
      console.error(`[ielts-audio] QUOTA HIT on ${job.storage_key} (${job.char_count} chars)`);
      return "failed";
    }
    state.failures.push({ key: job.storage_key, reason: render.reason });
    state.failed++;
    console.error(`[ielts-audio] FAIL ${job.storage_key} status=${render.status} ${render.reason}`);
    return "failed";
  }
  const upload = await uploadMp3(job.storage_key, render.bytes);
  if (!upload.ok) {
    state.failures.push({ key: job.storage_key, reason: `upload: ${upload.error}` });
    state.failed++;
    return "failed";
  }
  state.generated++;
  state.chars += job.char_count;
  return "generated";
}

async function runPool<T>(
  items: T[],
  worker: (item: T) => Promise<unknown>,
  concurrency: number,
): Promise<void> {
  let next = 0;
  const total = items.length;
  const workers = Array.from({ length: Math.min(concurrency, total) }, async () => {
    for (;;) {
      const i = next++;
      if (i >= total) return;
      await worker(items[i]);
    }
  });
  await Promise.all(workers);
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const jobs = buildJobs();
  const totalChars = jobs.reduce((a, j) => a + j.char_count, 0);

  console.log(`[ielts-audio] topics=${IELTS_SPEAKING_TOPICS.length} jobs=${jobs.length} dry_run=${dryRun}`);
  console.log(`[ielts-audio] estimated chars to bill (full): ${totalChars}`);
  console.log(`[ielts-audio] band7 voice=${VOICE_BAND_7}  band5 voice=${VOICE_BAND_5}`);

  if (dryRun) {
    console.log("\n=== DRY-RUN: 60 storage keys ===");
    for (const j of jobs) {
      console.log(`  ${j.storage_key}  band${j.band}  chars=${j.char_count}  voice=${j.voice_id}`);
    }
    console.log(`\nTotal: ${jobs.length} keys, ${totalChars} chars (assuming 0 already exist)`);
    console.log("Note: live run will skip keys already in bucket; actual chars billed may be lower.");
    return;
  }

  validateEnv();

  const state = {
    generated: 0,
    skipped: 0,
    failed: 0,
    chars: 0,
    failures: [] as Array<{ key: string; reason: string }>,
    quotaHit: false,
  };

  console.log("\n[ielts-audio] LIVE RUN starting…");
  await runPool(jobs, async (j) => {
    await processJob(j, state);
  }, CONCURRENCY);

  console.log("\n=== Summary ===");
  console.log(`  Topics:           ${IELTS_SPEAKING_TOPICS.length}`);
  console.log(`  Jobs:             ${jobs.length}`);
  console.log(`  Generated:        ${state.generated}`);
  console.log(`  Skipped (exists): ${state.skipped}`);
  console.log(`  Failed:           ${state.failed}`);
  console.log(`  Chars billed:     ${state.chars}`);
  if (state.quotaHit) {
    console.log("  QUOTA HIT — top up ElevenLabs and re-run.");
  }
  if (state.failures.length > 0) {
    console.log("\n  Failures:");
    for (const f of state.failures) {
      console.log(`    ${f.key}: ${f.reason}`);
    }
  }

  // Emit machine-readable summary at end for the report writer
  console.log("\n[ielts-audio] JSON_SUMMARY=" + JSON.stringify({
    topics: IELTS_SPEAKING_TOPICS.length,
    jobs: jobs.length,
    generated: state.generated,
    skipped: state.skipped,
    failed: state.failed,
    chars_billed: state.chars,
    quota_hit: state.quotaHit,
    failures: state.failures,
  }));
}

main().catch((err) => {
  console.error("[ielts-audio] fatal:", err);
  process.exit(1);
});
