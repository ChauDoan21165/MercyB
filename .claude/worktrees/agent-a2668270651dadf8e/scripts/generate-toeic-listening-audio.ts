/**
 * Generate ElevenLabs audio for TOEIC Listening items.
 *
 * For each item in src/data/exam-prep/toeic/practice-items.ts where
 * section === 'listening', voice the passage_or_audio_script and upload
 * a single mp3 to Supabase Storage room-audio bucket at:
 *   toeic-listening/{item.id}.mp3
 *
 * Cleaning rules (applied per-line):
 *   1. Drop lines starting with "(A)", "(B)", "(C)", "(D)"  (multiple-choice options)
 *   2. Drop lines starting with "(Photo:"                   (Part 1 photo description)
 *   3. Strip speaker prefix "M:", "W:", "Q:" but keep the text after
 *   4. Strip [bracket annotations] anywhere in the line
 *   5. Collapse whitespace
 *
 * Result for Part 1: 0 turns left after dropping the photo line + (A-D) options →
 * the item is reported as SKIPPED. Audio for Part 1 photos requires the photo
 * itself; without it, voicing the description alone misleads learners.
 *
 * KNOWN GAP (bucket vs script): 3 Part 1 photo items — office_interaction,
 * outdoor_cafe, warehouse_loading — are present in the room-audio/toeic-listening/
 * bucket but skipped by this script. Those bucket files were placed there outside
 * this generator; reconciling bucket inventory with what the script produces is
 * a separate backlog item.
 *
 * Multi-speaker dialogues (M:/W:): each turn rendered separately via ElevenLabs
 * with alternating voices, then concatenated via ffmpeg into a single mp3.
 *   Voice for M / Q / no-label single speaker: hpp4J3VqNfWAUOO0d1Us  (primary)
 *   Voice for W: CwhRBWXzGAHq8TQ4Fs17                                (secondary)
 *
 * Conventions match scripts/generate-b2-audio.ts and
 * scripts/generate-ielts-speaking-audio.ts: eleven_multilingual_v2,
 * voice_settings { stability: 0.5, similarity_boost: 0.75 }, idempotent
 * (skips storage keys already in the bucket), continue-on-error.
 *
 * Usage:
 *   npx tsx scripts/generate-toeic-listening-audio.ts --dry-run
 *   npx tsx scripts/generate-toeic-listening-audio.ts            (live)
 */

import { existsSync, mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import { TOEIC_LISTENING_ITEMS } from "../src/data/exam-prep/toeic/practice-items";

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
const VOICE_PRIMARY = "hpp4J3VqNfWAUOO0d1Us"; // M / Q / monologue
const VOICE_SECONDARY = "CwhRBWXzGAHq8TQ4Fs17"; // W
const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75 };
const MAX_RETRIES = 3;
const CONCURRENCY = 4;

function validateEnv(): void {
  const missing: string[] = [];
  if (!ELEVENLABS_API_KEY) missing.push("ELEVENLABS_API_KEY");
  if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
  if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length > 0) {
    console.error(`[toeic-audio] missing env: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// ─── Text parsing ────────────────────────────────────────────────────────

type Speaker = "M" | "W" | "Q" | "S"; // S = single/no-label
type Turn = { speaker: Speaker; text: string };

function stripBrackets(s: string): string {
  return s.replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Parse passage_or_audio_script into a list of turns.
 * - Drops lines starting with "(A)" "(B)" "(C)" "(D)" or "(Photo:"
 * - Recognises speaker prefix "M:" "W:" "Q:" (start of line, optional space after)
 * - Lines without a label continue the previous speaker (or default to S).
 * - Strips [bracket annotations] and collapses whitespace per turn.
 *
 * Output is empty if every line was a stripped option / photo description.
 */
function parseTurns(script: string): Turn[] {
  const lines = script.split("\n");
  const turns: Turn[] = [];
  let currentSpeaker: Speaker = "S";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.length === 0) continue;
    if (/^\([ABCD]\)/.test(line)) continue;
    if (/^\(Photo:/i.test(line)) continue;

    let text = line;
    const m = /^([MWQ]):\s*(.*)$/.exec(line);
    if (m) {
      currentSpeaker = m[1] as Speaker;
      text = m[2];
    }
    text = stripBrackets(text);
    if (text.length === 0) continue;

    // Merge consecutive lines from the same speaker into the previous turn.
    const last = turns[turns.length - 1];
    if (last && last.speaker === currentSpeaker) {
      last.text = `${last.text} ${text}`.trim();
    } else {
      turns.push({ speaker: currentSpeaker, text });
    }
  }

  return turns;
}

function voiceFor(speaker: Speaker): string {
  return speaker === "W" ? VOICE_SECONDARY : VOICE_PRIMARY;
}

type ItemPlan = {
  item_id: string;
  part: number;
  storage_key: string;
  turns: Turn[];
  total_chars: number;
  multi_speaker: boolean;
  skip_reason?: string;
};

function planItem(item: { id: string; part: number; passage_or_audio_script: string }): ItemPlan {
  const turns = parseTurns(item.passage_or_audio_script);
  const speakers = new Set(turns.map((t) => t.speaker));
  const multi = speakers.size > 1;
  const total = turns.reduce((a, t) => a + t.text.length, 0);
  return {
    item_id: item.id,
    part: item.part,
    storage_key: `toeic-listening/${item.id}.mp3`,
    turns,
    total_chars: total,
    multi_speaker: multi,
    skip_reason: turns.length === 0 ? "no voiceable turns (Part 1 photo-only)" : undefined,
  };
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

// ─── ffmpeg concat ───────────────────────────────────────────────────────

/**
 * Concatenate per-turn mp3 buffers into a single mp3 via ffmpeg `concat` demuxer.
 * Writes parts to a temp dir, runs ffmpeg, reads the result, cleans up.
 */
function concatMp3(parts: Uint8Array[]): Uint8Array {
  if (parts.length === 0) throw new Error("concatMp3: no parts");
  if (parts.length === 1) return parts[0];

  const dir = mkdtempSync(join(tmpdir(), "toeic-mp3-"));
  try {
    const partFiles: string[] = [];
    parts.forEach((buf, i) => {
      const path = join(dir, `part_${String(i).padStart(3, "0")}.mp3`);
      writeFileSync(path, buf);
      partFiles.push(path);
    });
    const list = partFiles.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join("\n");
    const listPath = join(dir, "list.txt");
    writeFileSync(listPath, list, "utf8");
    const outPath = join(dir, "out.mp3");
    const ff = spawnSync(
      "ffmpeg",
      ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", outPath],
      { encoding: "utf8" },
    );
    if (ff.status !== 0) {
      throw new Error(`ffmpeg concat failed: ${ff.stderr || ff.stdout}`);
    }
    return new Uint8Array(readFileSync(outPath));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
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
  const { data, error } = await supa().storage.from(BUCKET).list(dir, { search: filename, limit: 1 });
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

// ─── Per-item processing ────────────────────────────────────────────────

type Outcome = "generated" | "skipped_exists" | "skipped_part1" | "failed";

type RunState = {
  generated: number;
  skipped_exists: number;
  skipped_part1: number;
  failed: number;
  chars: number;
  failures: Array<{ id: string; reason: string }>;
  quota_hit: boolean;
};

async function processItem(plan: ItemPlan, state: RunState): Promise<Outcome> {
  if (state.quota_hit) return "failed";

  if (plan.skip_reason) {
    state.skipped_part1++;
    return "skipped_part1";
  }

  const present = await existsInBucket(plan.storage_key);
  if (present) {
    state.skipped_exists++;
    return "skipped_exists";
  }

  // Render each turn
  const partBytes: Uint8Array[] = [];
  for (const turn of plan.turns) {
    const r = await renderWithElevenLabs(turn.text, voiceFor(turn.speaker));
    if (!r.ok) {
      if (r.quotaHit) {
        state.quota_hit = true;
        state.failures.push({ id: plan.item_id, reason: `QUOTA: ${r.reason}` });
        console.error(`[toeic-audio] QUOTA HIT on ${plan.item_id}`);
        return "failed";
      }
      state.failures.push({ id: plan.item_id, reason: `render: ${r.reason}` });
      state.failed++;
      console.error(`[toeic-audio] FAIL render ${plan.item_id}: ${r.reason}`);
      return "failed";
    }
    partBytes.push(r.bytes);
  }

  let final: Uint8Array;
  try {
    final = concatMp3(partBytes);
  } catch (err) {
    state.failures.push({ id: plan.item_id, reason: `concat: ${String(err)}` });
    state.failed++;
    console.error(`[toeic-audio] FAIL concat ${plan.item_id}: ${err}`);
    return "failed";
  }

  const up = await uploadMp3(plan.storage_key, final);
  if (!up.ok) {
    state.failures.push({ id: plan.item_id, reason: `upload: ${up.error}` });
    state.failed++;
    return "failed";
  }

  state.generated++;
  state.chars += plan.total_chars;
  return "generated";
}

async function runPool<T>(items: T[], worker: (i: T) => Promise<unknown>, c: number): Promise<void> {
  let next = 0;
  const total = items.length;
  const workers = Array.from({ length: Math.min(c, total) }, async () => {
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
  const items = TOEIC_LISTENING_ITEMS.filter((it) => it.section === "listening");
  const plans = items.map((it) =>
    planItem({ id: it.id, part: it.part as number, passage_or_audio_script: it.passage_or_audio_script }),
  );

  const total_items = plans.length;
  const skip_count = plans.filter((p) => p.skip_reason).length;
  const voice_count = plans.length - skip_count;
  const total_chars = plans.reduce((a, p) => a + (p.skip_reason ? 0 : p.total_chars), 0);
  const multi_speaker = plans.filter((p) => p.multi_speaker).length;

  console.log(`[toeic-audio] items=${total_items} voiced=${voice_count} skip(part1)=${skip_count} multi_speaker=${multi_speaker} dry_run=${dryRun}`);
  console.log(`[toeic-audio] total chars to render (full): ${total_chars}`);
  console.log(`[toeic-audio] primary voice=${VOICE_PRIMARY}  secondary voice=${VOICE_SECONDARY}`);

  if (dryRun) {
    console.log("\n=== DRY-RUN: per-item plan ===");
    for (const p of plans) {
      if (p.skip_reason) {
        console.log(`  SKIP   part${p.part}  ${p.item_id}  reason="${p.skip_reason}"`);
        continue;
      }
      const speakerSig = p.turns.map((t) => t.speaker).join(",");
      console.log(
        `  ${p.multi_speaker ? "MULTI " : "SOLO  "} part${p.part}  ${p.item_id}  turns=${p.turns.length}  speakers=[${speakerSig}]  chars=${p.total_chars}`,
      );
    }
    console.log(`\nTotals: ${total_items} items, ${voice_count} voiced, ${skip_count} skipped, ${total_chars} chars (assuming 0 already in bucket)`);
    return;
  }

  validateEnv();
  const ffCheck = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  if (ffCheck.status !== 0) {
    console.error("[toeic-audio] ffmpeg not found in PATH — required for multi-speaker concat");
    process.exit(1);
  }

  const state: RunState = {
    generated: 0,
    skipped_exists: 0,
    skipped_part1: 0,
    failed: 0,
    chars: 0,
    failures: [],
    quota_hit: false,
  };

  console.log("\n[toeic-audio] LIVE RUN starting…");
  await runPool(plans, async (p) => {
    await processItem(p, state);
  }, CONCURRENCY);

  console.log("\n=== Summary ===");
  console.log(`  Items:                 ${total_items}`);
  console.log(`  Generated:             ${state.generated}`);
  console.log(`  Skipped (exists):      ${state.skipped_exists}`);
  console.log(`  Skipped (Part 1):      ${state.skipped_part1}`);
  console.log(`  Failed:                ${state.failed}`);
  console.log(`  Chars billed:          ${state.chars}`);
  if (state.quota_hit) console.log("  QUOTA HIT — top up and re-run.");
  if (state.failures.length > 0) {
    console.log("\n  Failures:");
    for (const f of state.failures) console.log(`    ${f.id}: ${f.reason}`);
  }

  console.log("\n[toeic-audio] JSON_SUMMARY=" + JSON.stringify({
    items: total_items,
    generated: state.generated,
    skipped_exists: state.skipped_exists,
    skipped_part1: state.skipped_part1,
    failed: state.failed,
    chars_billed: state.chars,
    quota_hit: state.quota_hit,
    failures: state.failures,
  }));
}

main().catch((err) => {
  console.error("[toeic-audio] fatal:", err);
  process.exit(1);
});
