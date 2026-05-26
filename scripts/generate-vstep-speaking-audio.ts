/**
 * Generate ElevenLabs audio for VSTEP Speaking topics.
 *
 * For each of the 30 topics in src/data/exam-prep/vstep/speaking-topics.ts,
 * generates clips uploaded to Supabase Storage room-audio bucket:
 *   vstep-speaking/{topic.id}/intro.mp3  — topic.description_en (intro narration)
 *   vstep-speaking/{topic.id}/q1.mp3 …  — topic.sample_questions[n] (per question)
 *
 * Conventions match scripts/generate-ielts-speaking-audio.ts:
 *   - eleven_multilingual_v2, voice_settings { stability: 0.5, similarity_boost: 0.75 }
 *   - Skip when storage_key already exists in bucket (idempotent)
 *   - Continue-on-error; log failures
 *   - Bucket: room-audio
 *   - Single voice (primary): hpp4J3VqNfWAUOO0d1Us
 *
 * Usage:
 *   npx tsx scripts/generate-vstep-speaking-audio.ts --dry-run
 *   npx tsx scripts/generate-vstep-speaking-audio.ts            (live run)
 */

import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import { VSTEP_SPEAKING_TOPICS } from "../src/data/exam-prep/vstep/speaking-topics";

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

// ─── Constants ───────────────────────────────────────────────────────────

const BUCKET = "room-audio";
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const MODEL_ID = "eleven_multilingual_v2";
const VOICE_PRIMARY = "hpp4J3VqNfWAUOO0d1Us";
const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75 };
const MAX_RETRIES = 3;
const CONCURRENCY = 4;

function validateEnv(): void {
  const missing: string[] = [];
  if (!ELEVENLABS_API_KEY) missing.push("ELEVENLABS_API_KEY");
  if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
  if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length > 0) {
    console.error(`[vstep-speaking-audio] missing env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// ─── Job building ────────────────────────────────────────────────────────

type Job = {
  topic_id: string;
  kind: "intro" | "question";
  index: number; // 0 = intro, 1+ = question index
  storage_key: string;
  text: string;
  char_count: number;
};

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  for (const t of VSTEP_SPEAKING_TOPICS) {
    const introText = (t.description_en ?? "").trim();
    if (introText) {
      jobs.push({
        topic_id: t.id,
        kind: "intro",
        index: 0,
        storage_key: t.audioIntroKey,
        text: introText,
        char_count: introText.length,
      });
    }
    for (let qi = 0; qi < t.sample_questions.length; qi++) {
      const qText = (t.sample_questions[qi] ?? "").trim();
      if (qText) {
        jobs.push({
          topic_id: t.id,
          kind: "question",
          index: qi + 1,
          storage_key: t.audioQuestionKeys[qi] ?? `vstep-speaking/${t.id}/q${qi + 1}.mp3`,
          text: qText,
          char_count: qText.length,
        });
      }
    }
  }
  return jobs;
}

// ─── ElevenLabs ──────────────────────────────────────────────────────────

type RenderResult =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; status: number; reason: string; quotaHit?: boolean };

async function renderWithElevenLabs(text: string): Promise<RenderResult> {
  let lastErr: { status: number; reason: string } | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await fetch(`${ELEVENLABS_BASE}/${VOICE_PRIMARY}`, {
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
      const detail = (await resp.text().catch(() => "")).slice(0, 200);
      if (resp.status === 401) return { ok: false, status: 401, reason: `auth: ${detail}` };
      if (resp.status === 429 || /quota|credit|exceed/i.test(detail)) {
        return { ok: false, status: resp.status, reason: `quota: ${detail}`, quotaHit: true };
      }
      if (resp.status >= 500) {
        lastErr = { status: resp.status, reason: `5xx: ${detail}` };
        await sleep(1000 * 2 ** (attempt - 1));
        continue;
      }
      return { ok: false, status: resp.status, reason: detail };
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

// ─── Per-job processing ─────────────────────────────────────────────────

type Outcome = "generated" | "skipped" | "failed";

type RunState = {
  generated: number;
  skipped: number;
  failed: number;
  chars: number;
  failures: Array<{ key: string; reason: string }>;
  quotaHit: boolean;
};

async function processJob(job: Job, state: RunState): Promise<Outcome> {
  if (state.quotaHit) return "failed";

  const present = await existsInBucket(job.storage_key);
  if (present) {
    state.skipped++;
    return "skipped";
  }

  const render = await renderWithElevenLabs(job.text);
  if (!render.ok) {
    if (render.quotaHit) {
      state.quotaHit = true;
      state.failures.push({ key: job.storage_key, reason: `QUOTA: ${render.reason}` });
      console.error(`[vstep-speaking-audio] QUOTA HIT on ${job.storage_key} (${job.char_count} chars)`);
      return "failed";
    }
    state.failures.push({ key: job.storage_key, reason: render.reason });
    state.failed++;
    console.error(`[vstep-speaking-audio] FAIL ${job.storage_key}: ${render.reason}`);
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

// ─── Worker pool ─────────────────────────────────────────────────────────

async function runPool<T>(items: T[], worker: (item: T) => Promise<unknown>, concurrency: number): Promise<void> {
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
  const topicCount = VSTEP_SPEAKING_TOPICS.length;
  const introCount = jobs.filter((j) => j.kind === "intro").length;
  const questionCount = jobs.filter((j) => j.kind === "question").length;
  const totalChars = jobs.reduce((a, j) => a + j.char_count, 0);

  console.log(`[vstep-speaking-audio] topics=${topicCount} intros=${introCount} questions=${questionCount} total_jobs=${jobs.length} dry_run=${dryRun}`);
  console.log(`[vstep-speaking-audio] total chars to render: ${totalChars}`);
  console.log(`[vstep-speaking-audio] voice=${VOICE_PRIMARY}`);

  if (dryRun) {
    console.log("\n=== DRY-RUN ===");
    for (const j of jobs.slice(0, 10)) {
      console.log(`  ${j.kind.padEnd(8)} ${j.storage_key.padEnd(70)} chars=${j.char_count}`);
    }
    if (jobs.length > 10) console.log(`  … and ${jobs.length - 10} more jobs`);
    console.log(`\nTotals: ${jobs.length} jobs, ${totalChars} chars (assuming 0 already in bucket)`);
    return;
  }

  validateEnv();

  const state: RunState = {
    generated: 0,
    skipped: 0,
    failed: 0,
    chars: 0,
    failures: [],
    quotaHit: false,
  };

  console.log("\n[vstep-speaking-audio] LIVE RUN starting…");
  await runPool(jobs, async (j) => {
    await processJob(j, state);
  }, CONCURRENCY);

  console.log("\n=== Summary ===");
  console.log(`  Topics:             ${topicCount}`);
  console.log(`  Jobs:               ${jobs.length}`);
  console.log(`  Generated:          ${state.generated}`);
  console.log(`  Skipped (exists):   ${state.skipped}`);
  console.log(`  Failed:             ${state.failed}`);
  console.log(`  Chars billed:       ${state.chars}`);
  if (state.quotaHit) console.log("  QUOTA HIT — top up and re-run.");
  if (state.failures.length > 0) {
    console.log("\n  Failures:");
    for (const f of state.failures) console.log(`    ${f.key}: ${f.reason}`);
  }

  console.log("\n[vstep-speaking-audio] JSON_SUMMARY=" + JSON.stringify({
    topics: topicCount,
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
  console.error("[vstep-speaking-audio] fatal:", err);
  process.exit(1);
});
