/**
 * Generate B2 lesson audio via ElevenLabs and upload to Supabase Storage.
 *
 * Reads audio-manifest.json (built by build-b2-audio-manifest.ts), filters by
 * --slug-prefix or --lang or --limit, then for each remaining entry:
 *   1. Check existence in Supabase Storage `room-audio` bucket — skip if present.
 *   2. POST text → ElevenLabs /v1/text-to-speech/{voice_id} (model: eleven_multilingual_v2)
 *   3. Upload mp3 buffer to room-audio at the manifest's storage_key.
 *   4. Append progress to audio-progress.json (gitignored, resumable).
 *
 * Failure handling:
 *   - 401/403 (auth) — fatal, abort.
 *   - 429 (quota) — fatal but graceful: report which entry triggered it and
 *     how many clips/chars were used before quota hit, then exit 0 so the
 *     progress file is preserved for resume after top-up.
 *   - 5xx / network — exponential backoff retry, max 3 attempts.
 *   - Other 4xx — log and skip the entry; continue.
 *
 * Required env (loaded from .env.local then .env in: worktree cwd, then main repo):
 *   ELEVENLABS_API_KEY              (Supabase Edge Function secret — copy locally)
 *   VITE_SUPABASE_URL               (same as web client)
 *   SUPABASE_SERVICE_ROLE_KEY       (NOT anon key — bypasses RLS for storage writes)
 *
 * Usage:
 *   npx tsx scripts/generate-b2-audio.ts                       — full manifest
 *   npx tsx scripts/generate-b2-audio.ts --slug-prefix=lconditional,lidioms,lslang
 *   npx tsx scripts/generate-b2-audio.ts --lang=fr --limit=10
 *   npx tsx scripts/generate-b2-audio.ts --dry-run             — list what would run, no API calls
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";

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

const missing: string[] = [];
if (!ELEVENLABS_API_KEY) missing.push("ELEVENLABS_API_KEY");
if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (missing.length > 0) {
  console.error(`[generate] missing env vars: ${missing.join(", ")}`);
  console.error(`[generate] searched: ${ENV_SEARCH_PATHS.join(", ")}`);
  process.exit(1);
}

// ─── Constants ────────────────────────────────────────────────────────────

const MANIFEST_PATH = resolve("audio-manifest.json");
const PROGRESS_PATH = resolve("audio-progress.json");
const BUCKET = "room-audio";
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const MODEL_ID = "eleven_multilingual_v2";
const MAX_RETRIES = 3;
const CONCURRENCY = 4; // safe for Creator-tier rate limits
const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75 };

// ─── Manifest + progress ─────────────────────────────────────────────────

type ManifestEntry = {
  storage_key: string;
  text: string;
  voice_id: string;
  language: string;
  lesson_id: string | number;
  lesson_index: number;
  unit_kind: string;
  unit_index: number;
  speaker?: "A" | "B";
  char_count: number;
};

type Progress = {
  completed: string[]; // storage_keys
  failed: Array<{ storage_key: string; reason: string }>;
  chars_billed: number;
  started_at: string;
  last_update: string;
};

function loadManifest(): { entries: ManifestEntry[] } {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`[generate] manifest missing: ${MANIFEST_PATH}`);
    console.error("[generate] run: npx tsx scripts/build-b2-audio-manifest.ts");
    process.exit(1);
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

function loadProgress(): Progress {
  if (!existsSync(PROGRESS_PATH)) {
    return {
      completed: [],
      failed: [],
      chars_billed: 0,
      started_at: new Date().toISOString(),
      last_update: new Date().toISOString(),
    };
  }
  return JSON.parse(readFileSync(PROGRESS_PATH, "utf8"));
}

function saveProgress(p: Progress): void {
  p.last_update = new Date().toISOString();
  writeFileSync(PROGRESS_PATH, JSON.stringify(p, null, 2), "utf8");
}

// ─── CLI args ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(name: string): string | undefined {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a?.slice(name.length + 3);
}
const dryRun = args.includes("--dry-run");
const argLang = getArg("lang");
const argSlugPrefixCsv = getArg("slug-prefix");
const argLimit = getArg("limit");

const slugPrefixes = argSlugPrefixCsv?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
const limit = argLimit ? parseInt(argLimit, 10) : undefined;

// ─── Filter manifest ─────────────────────────────────────────────────────

function matchesFilters(e: ManifestEntry): boolean {
  if (argLang && e.language !== argLang) return false;
  if (slugPrefixes.length > 0) {
    // storage_key shape: b2/{lang}/l{slug}/...  → middle segment after "b2/{lang}/" is the lesson dir
    const seg = e.storage_key.split("/")[2] ?? "";
    if (!slugPrefixes.some((p) => seg === p)) return false;
  }
  return true;
}

// ─── ElevenLabs ──────────────────────────────────────────────────────────

type RenderResult =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; status: number; reason: string; quotaHit?: boolean };

async function renderWithElevenLabs(text: string, voiceId: string): Promise<RenderResult> {
  let lastErr: { status: number; reason: string; quotaHit?: boolean } | null = null;
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
      // Quota hit — fatal but graceful
      if (resp.status === 401) {
        return { ok: false, status: 401, reason: `auth: ${truncated}` };
      }
      if (resp.status === 429 || /quota|credit|exceed/i.test(truncated)) {
        return { ok: false, status: resp.status, reason: `quota: ${truncated}`, quotaHit: true };
      }
      // 5xx → retry; other 4xx → no retry
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
  return { ok: false, status: lastErr?.status ?? 0, reason: lastErr?.reason ?? "max retries exceeded" };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Supabase ────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function existsInBucket(storageKey: string): Promise<boolean> {
  const lastSlash = storageKey.lastIndexOf("/");
  const dir = lastSlash >= 0 ? storageKey.slice(0, lastSlash) : "";
  const filename = lastSlash >= 0 ? storageKey.slice(lastSlash + 1) : storageKey;
  const { data, error } = await supabase.storage.from(BUCKET).list(dir, {
    search: filename,
    limit: 1,
  });
  if (error) return false;
  return (data ?? []).some((f) => f.name === filename);
}

async function uploadMp3(storageKey: string, bytes: Uint8Array): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.storage.from(BUCKET).upload(storageKey, bytes, {
    contentType: "audio/mpeg",
    upsert: false,
  });
  if (error && !/already exists|the resource already exists/i.test(error.message)) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

function publicUrl(storageKey: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
  return data.publicUrl;
}

// ─── Worker pool ─────────────────────────────────────────────────────────

async function processOne(
  entry: ManifestEntry,
  progress: Progress,
): Promise<"done" | "skipped" | "quota" | "failed"> {
  const present = await existsInBucket(entry.storage_key);
  if (present) {
    if (!progress.completed.includes(entry.storage_key)) {
      progress.completed.push(entry.storage_key);
    }
    return "skipped";
  }

  const render = await renderWithElevenLabs(entry.text, entry.voice_id);
  if (!render.ok) {
    if (render.quotaHit) {
      console.error(
        `[generate] QUOTA HIT on ${entry.storage_key} (${entry.char_count} chars) — ${render.reason}`,
      );
      return "quota";
    }
    progress.failed.push({ storage_key: entry.storage_key, reason: render.reason });
    console.error(`[generate] FAIL ${entry.storage_key} status=${render.status} ${render.reason}`);
    return "failed";
  }

  const upload = await uploadMp3(entry.storage_key, render.bytes);
  if (!upload.ok) {
    progress.failed.push({ storage_key: entry.storage_key, reason: `upload: ${upload.error}` });
    console.error(`[generate] UPLOAD FAIL ${entry.storage_key}: ${upload.error}`);
    return "failed";
  }

  progress.completed.push(entry.storage_key);
  progress.chars_billed += entry.char_count;
  return "done";
}

async function runPool<T>(
  items: T[],
  worker: (item: T) => Promise<unknown>,
  concurrency: number,
  onProgress?: (i: number) => void,
): Promise<void> {
  let next = 0;
  const total = items.length;
  const workers = Array.from({ length: Math.min(concurrency, total) }, async () => {
    for (;;) {
      const i = next++;
      if (i >= total) return;
      await worker(items[i]);
      onProgress?.(i);
    }
  });
  await Promise.all(workers);
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { entries: allEntries } = loadManifest();
  const progress = loadProgress();
  const completed = new Set(progress.completed);

  let pending = allEntries.filter(matchesFilters).filter((e) => !completed.has(e.storage_key));
  if (limit !== undefined) pending = pending.slice(0, limit);

  console.log(
    `[generate] manifest=${allEntries.length} matching=${pending.length + completed.size} pending=${pending.length} dry_run=${dryRun}`,
  );
  if (slugPrefixes.length > 0) console.log(`[generate] slug-prefix: ${slugPrefixes.join(", ")}`);
  if (argLang) console.log(`[generate] lang: ${argLang}`);
  console.log(
    `[generate] estimated chars to bill: ${pending.reduce((a, e) => a + e.char_count, 0)}`,
  );

  if (dryRun) {
    console.log("[generate] DRY-RUN — first 5 entries that would run:");
    for (const e of pending.slice(0, 5)) {
      console.log(
        `  ${e.storage_key}  voice=${e.voice_id}  chars=${e.char_count}`,
      );
    }
    return;
  }

  let quotaHit = false;
  let processed = 0;
  let skippedExisting = 0;
  let succeeded = 0;
  let failed = 0;

  await runPool(
    pending,
    async (entry) => {
      if (quotaHit) return;
      const r = await processOne(entry, progress);
      if (r === "quota") {
        quotaHit = true;
        return;
      }
      if (r === "skipped") skippedExisting++;
      if (r === "done") succeeded++;
      if (r === "failed") failed++;
      processed++;
      // Persist every 10 to limit data loss on crash
      if (processed % 10 === 0) saveProgress(progress);
    },
    CONCURRENCY,
    (i) => {
      if ((i + 1) % 25 === 0) {
        console.log(
          `[generate] ${i + 1}/${pending.length}  done=${succeeded} skipped=${skippedExisting} failed=${failed} chars=${progress.chars_billed}`,
        );
      }
    },
  );

  saveProgress(progress);

  console.log("\n=== Summary ===");
  console.log(`  Processed:        ${processed}`);
  console.log(`  Newly generated:  ${succeeded}`);
  console.log(`  Skipped (exists): ${skippedExisting}`);
  console.log(`  Failed:           ${failed}`);
  console.log(`  Chars billed:     ${progress.chars_billed}`);
  if (quotaHit) {
    console.log("  QUOTA HIT — top up ElevenLabs credits and re-run; progress is preserved.");
    process.exit(0);
  }
  if (failed > 0 && progress.failed.length > 0) {
    console.log("  First 5 failures:");
    for (const f of progress.failed.slice(-5)) {
      console.log(`    ${f.storage_key}: ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error("[generate] fatal:", err);
  process.exit(1);
});
