/**
 * Generate ElevenLabs audio for VSTEP Listening items.
 *
 * For each item in src/data/exam-prep/vstep/listening-items.ts,
 * voice the transcript and upload a single mp3 to Supabase Storage
 * room-audio bucket at the item's audioKey (vstep-listening/{id}.mp3).
 *
 * Cleaning rules (applied per-line):
 *   1. Recognise speaker prefix "A:" "B:" or "Name:" (e.g. "Sarah:", "James:")
 *   2. Strip the prefix but keep the text
 *   3. Merge consecutive lines from the same speaker into one turn
 *   4. Strip [bracket annotations] if any
 *   5. Collapse whitespace
 *
 * Multi-speaker dialogues: each turn rendered separately via ElevenLabs
 * with alternating voices, then concatenated via ffmpeg into a single mp3.
 * Single-speaker items (talks, lectures, announcements): rendered in one
 * or more turns with the primary voice.
 *
 *   Voice for A / Moderator / named speaker A / solo: hpp4J3VqNfWAUOO0d1Us  (primary)
 *   Voice for B / named speaker B:                     CwhRBWXzGAHq8TQ4Fs17  (secondary)
 *
 * Conventions match scripts/generate-toeic-listening-audio.ts:
 * eleven_multilingual_v2, voice_settings { stability: 0.5, similarity_boost: 0.75 },
 * idempotent (skips storage keys already in the bucket), continue-on-error.
 *
 * Usage:
 *   npx tsx scripts/generate-vstep-listening-audio.ts --dry-run
 *   npx tsx scripts/generate-vstep-listening-audio.ts            (live)
 */

import { existsSync, mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import { VSTEP_LISTENING_ITEMS } from "../src/data/exam-prep/vstep/listening-items";

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
const VOICE_SECONDARY = "CwhRBWXzGAHq8TQ4Fs17";
const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75 };
const MAX_RETRIES = 3;
const CONCURRENCY = 4;

function validateEnv(): void {
  const missing: string[] = [];
  if (!ELEVENLABS_API_KEY) missing.push("ELEVENLABS_API_KEY");
  if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
  if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length > 0) {
    console.error(`[vstep-audio] missing env: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// ─── Text parsing ────────────────────────────────────────────────────────

type Speaker = "A" | "B";
type Turn = { speaker: Speaker; text: string };

/** Speaker label → voice group. "A" side speakers → primary, "B" side → secondary. */
function isBSpeaker(label: string): boolean {
  const clean = label.trim().toUpperCase();
  // Explicit B-side labels
  if (clean === "B") return true;
  // Named speakers assigned to the B group
  if (clean === "JAMES") return true;
  // Everything else (A, Moderator, Sarah, Lisa, unnamed) → primary
  return false;
}

/**
 * Parse transcript into a list of turns.
 * Recognises speaker prefix "A:" "B:" "Name:" at line start.
 * Lines without a recognised prefix continue the previous speaker.
 * Strips [bracket annotations] and collapses whitespace per turn.
 */
function parseTurns(transcript: string): Turn[] {
  const lines = transcript.split("\n");
  const turns: Turn[] = [];
  let currentSpeaker: Speaker = "A";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.length === 0) continue;

    // Match speaker prefix: "A:", "B:", or "Name:" (word chars only)
    const m = /^([A-Z][a-z]*):\s*(.*)$/.exec(line);
    let text = line;
    if (m) {
      const label = m[1];
      currentSpeaker = isBSpeaker(label) ? "B" : "A";
      text = m[2];
    }
    // Strip [bracket annotations]
    text = text.replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
    if (text.length === 0) continue;

    // Merge consecutive lines from the same speaker
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
  return speaker === "B" ? VOICE_SECONDARY : VOICE_PRIMARY;
}

type ItemPlan = {
  item_id: string;
  level: string;
  section: string;
  storage_key: string;
  turns: Turn[];
  total_chars: number;
  multi_speaker: boolean;
};

function planItem(item: (typeof VSTEP_LISTENING_ITEMS)[number]): ItemPlan {
  const turns = parseTurns(item.transcript);
  const speakers = new Set(turns.map((t) => t.speaker));
  const multi = speakers.size > 1;
  const total = turns.reduce((a, t) => a + t.text.length, 0);
  return {
    item_id: item.id,
    level: item.level,
    section: item.section,
    storage_key: item.audioKey,
    turns,
    total_chars: total,
    multi_speaker: multi,
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

function concatMp3(parts: Uint8Array[]): Uint8Array {
  if (parts.length === 0) throw new Error("concatMp3: no parts");
  if (parts.length === 1) return parts[0];

  const dir = mkdtempSync(join(tmpdir(), "vstep-mp3-"));
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

type Outcome = "generated" | "skipped_exists" | "failed";

type RunState = {
  generated: number;
  skipped_exists: number;
  failed: number;
  chars: number;
  failures: Array<{ id: string; reason: string }>;
  quota_hit: boolean;
};

async function processItem(plan: ItemPlan, state: RunState): Promise<Outcome> {
  if (state.quota_hit) return "failed";

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
        console.error(`[vstep-audio] QUOTA HIT on ${plan.item_id}`);
        return "failed";
      }
      state.failures.push({ id: plan.item_id, reason: `render: ${r.reason}` });
      state.failed++;
      console.error(`[vstep-audio] FAIL render ${plan.item_id}: ${r.reason}`);
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
    console.error(`[vstep-audio] FAIL concat ${plan.item_id}: ${err}`);
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
  const items = VSTEP_LISTENING_ITEMS;
  const plans = items.map(planItem);

  const total_items = plans.length;
  const total_chars = plans.reduce((a, p) => a + p.total_chars, 0);
  const multi_speaker = plans.filter((p) => p.multi_speaker).length;
  const byLevel = { B1: plans.filter((p) => p.level === "B1").length, B2: plans.filter((p) => p.level === "B2").length };

  console.log(`[vstep-audio] items=${total_items} B1=${byLevel.B1} B2=${byLevel.B2} multi_speaker=${multi_speaker} dry_run=${dryRun}`);
  console.log(`[vstep-audio] total chars to render: ${total_chars}`);
  console.log(`[vstep-audio] primary voice=${VOICE_PRIMARY}  secondary voice=${VOICE_SECONDARY}`);

  if (dryRun) {
    console.log("\n=== DRY-RUN: per-item plan ===");
    for (const p of plans) {
      const speakerSig = p.turns.map((t) => t.speaker).join(",");
      console.log(
        `  ${p.multi_speaker ? "MULTI " : "SOLO  "} ${p.level} ${p.section.padEnd(20)} ${p.item_id.padEnd(45)} turns=${p.turns.length}  speakers=[${speakerSig}]  chars=${p.total_chars}`,
      );
    }
    console.log(`\nTotals: ${total_items} items, ${total_chars} chars (assuming 0 already in bucket)`);
    return;
  }

  validateEnv();
  const ffCheck = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  if (ffCheck.status !== 0) {
    console.error("[vstep-audio] ffmpeg not found in PATH — required for multi-speaker concat");
    process.exit(1);
  }

  const state: RunState = {
    generated: 0,
    skipped_exists: 0,
    failed: 0,
    chars: 0,
    failures: [],
    quota_hit: false,
  };

  console.log("\n[vstep-audio] LIVE RUN starting…");
  await runPool(plans, async (p) => {
    await processItem(p, state);
  }, CONCURRENCY);

  console.log("\n=== Summary ===");
  console.log(`  Items:                 ${total_items}`);
  console.log(`  Generated:             ${state.generated}`);
  console.log(`  Skipped (exists):      ${state.skipped_exists}`);
  console.log(`  Failed:                ${state.failed}`);
  console.log(`  Chars billed:          ${state.chars}`);
  if (state.quota_hit) console.log("  QUOTA HIT — top up and re-run.");
  if (state.failures.length > 0) {
    console.log("\n  Failures:");
    for (const f of state.failures) console.log(`    ${f.id}: ${f.reason}`);
  }

  console.log("\n[vstep-audio] JSON_SUMMARY=" + JSON.stringify({
    items: total_items,
    generated: state.generated,
    skipped_exists: state.skipped_exists,
    failed: state.failed,
    chars_billed: state.chars,
    quota_hit: state.quota_hit,
    failures: state.failures,
  }));
}

main().catch((err) => {
  console.error("[vstep-audio] fatal:", err);
  process.exit(1);
});
