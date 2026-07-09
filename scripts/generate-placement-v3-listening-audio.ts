/**
 * Generate ElevenLabs audio for the 6 placement-v3 listening prompts.
 *
 * For each item in src/data/placement/v3/prompts/listening.ts, voice its
 * `audioScript` and upload one mp3 to the Supabase Storage room-audio bucket at:
 *   placement-v3-listening/{id}.mp3
 *
 * Same voice config as the room-audio generators (generate-toeic-listening-audio
 * / generate-b2-audio / generate-ielts-speaking-audio):
 *   model eleven_multilingual_v2, voice_settings { stability: 0.5, similarity_boost: 0.75 }
 *   primary voice hpp4J3VqNfWAUOO0d1Us, secondary CwhRBWXzGAHq8TQ4Fs17.
 *
 * Placement scripts use INLINE speaker labels ("Customer:", "Server:", "Teacher:",
 * "Parent:", "Agent:", "Mentor:", "Manager:") rather than the TOEIC M:/W:/Q: format.
 * We split on those labels: the first distinct speaker → primary voice, the second
 * → secondary. Monologues (no label, or a single label) render as one primary turn.
 * Multi-turn dialogues are concatenated with ffmpeg `-c copy`.
 *
 * BILLING SAFETY: on the FIRST 401 / 402 / 429 from ElevenLabs we STOP the whole
 * run immediately (no retries, no further items) and exit non-zero — the billing
 * card was just replaced and may be declining.
 *
 * Usage:
 *   npx tsx scripts/generate-placement-v3-listening-audio.ts --dry-run
 *   npx tsx scripts/generate-placement-v3-listening-audio.ts
 */
import { existsSync, mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import { LISTENING_PLACEMENT_PROMPTS } from "../src/data/placement/v3/prompts/listening.ts";

// ─── Env (absolute paths so this runs from a git worktree too) ───────────────
for (const p of [
  ".env.local",
  ".env",
  "/Users/admin/MercyB/.env.local",
  "/Users/admin/MercyB/.env",
]) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const ELEVENLABS_API_KEY = (process.env.ELEVENLABS_API_KEY ?? "").trim();
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? "").trim();
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

const dryRun = process.argv.slice(2).includes("--dry-run");

const BUCKET = "room-audio";
const KEY_PREFIX = "placement-v3-listening";
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const MODEL_ID = "eleven_multilingual_v2";
const VOICE_PRIMARY = "hpp4J3VqNfWAUOO0d1Us";
const VOICE_SECONDARY = "CwhRBWXzGAHq8TQ4Fs17";
const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75 };
const MAX_5XX_RETRIES = 3;

function validateEnv(): void {
  const missing: string[] = [];
  if (!ELEVENLABS_API_KEY) missing.push("ELEVENLABS_API_KEY");
  if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
  if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length > 0) {
    console.error(`[placement-audio] missing env: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// ─── Speaker parsing ─────────────────────────────────────────────────────────
type Turn = { text: string; voice: string };

const KNOWN_LABELS = ["Customer", "Server", "Teacher", "Parent", "Agent", "Mentor", "Manager"];
const LABEL_RE = new RegExp(`(?:^|\\s)(${KNOWN_LABELS.join("|")}):\\s*`, "g");

/**
 * Split an inline-labelled script into voiced turns. First distinct speaker →
 * primary voice, second → secondary. Text before any label (or a label-less
 * script) is one primary monologue turn.
 */
function parseTurns(script: string): Turn[] {
  const markers: Array<{ index: number; label: string; textStart: number }> = [];
  for (const m of script.matchAll(LABEL_RE)) {
    markers.push({ index: m.index ?? 0, label: m[1], textStart: (m.index ?? 0) + m[0].length });
  }

  const speakerVoice = new Map<string, string>();
  const voiceForLabel = (label: string): string => {
    if (!speakerVoice.has(label)) {
      speakerVoice.set(label, speakerVoice.size === 0 ? VOICE_PRIMARY : VOICE_SECONDARY);
    }
    return speakerVoice.get(label)!;
  };

  const turns: Turn[] = [];
  if (markers.length === 0) {
    const text = script.trim();
    return text ? [{ text, voice: VOICE_PRIMARY }] : [];
  }

  // Any lead-in text before the first label is a primary monologue turn.
  const lead = script.slice(0, markers[0].index).trim();
  if (lead) turns.push({ text: lead, voice: VOICE_PRIMARY });

  for (let i = 0; i < markers.length; i++) {
    const end = i + 1 < markers.length ? markers[i + 1].index : script.length;
    const text = script.slice(markers[i].textStart, end).trim();
    if (text) turns.push({ text, voice: voiceForLabel(markers[i].label) });
  }
  return turns;
}

// ─── ElevenLabs ──────────────────────────────────────────────────────────────
type RenderResult =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; billingStop: boolean; status: number; reason: string };

async function render(text: string, voiceId: string): Promise<RenderResult> {
  for (let attempt = 1; attempt <= MAX_5XX_RETRIES; attempt++) {
    let resp: Response;
    try {
      resp = await fetch(`${ELEVENLABS_BASE}/${voiceId}`, {
        method: "POST",
        headers: { "xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS }),
      });
    } catch (err) {
      if (attempt === MAX_5XX_RETRIES) return { ok: false, billingStop: false, status: 0, reason: `network: ${String(err)}` };
      await sleep(1000 * 2 ** (attempt - 1));
      continue;
    }
    if (resp.ok) return { ok: true, bytes: new Uint8Array(await resp.arrayBuffer()) };

    const detail = (await resp.text().catch(() => "")).slice(0, 240);
    // Billing / auth / quota → STOP the whole run immediately, no retries.
    if (resp.status === 401 || resp.status === 402 || resp.status === 429) {
      return { ok: false, billingStop: true, status: resp.status, reason: detail };
    }
    if (resp.status >= 500 && attempt < MAX_5XX_RETRIES) {
      await sleep(1000 * 2 ** (attempt - 1));
      continue;
    }
    return { ok: false, billingStop: false, status: resp.status, reason: detail };
  }
  return { ok: false, billingStop: false, status: 0, reason: "max retries" };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function concatMp3(parts: Uint8Array[]): Uint8Array {
  if (parts.length === 1) return parts[0];
  const dir = mkdtempSync(join(tmpdir(), "placement-mp3-"));
  try {
    const files = parts.map((buf, i) => {
      const p = join(dir, `part_${String(i).padStart(3, "0")}.mp3`);
      writeFileSync(p, buf);
      return p;
    });
    const listPath = join(dir, "list.txt");
    writeFileSync(listPath, files.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join("\n"), "utf8");
    const outPath = join(dir, "out.mp3");
    const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", outPath], { encoding: "utf8" });
    if (ff.status !== 0) throw new Error(`ffmpeg concat failed: ${ff.stderr || ff.stdout}`);
    return new Uint8Array(readFileSync(outPath));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const plans = LISTENING_PLACEMENT_PROMPTS.map((p) => ({
    id: p.id,
    key: `${KEY_PREFIX}/${p.id}.mp3`,
    turns: parseTurns(p.audioScript),
  }));

  console.log(`[placement-audio] items=${plans.length} model=${MODEL_ID} primary=${VOICE_PRIMARY} secondary=${VOICE_SECONDARY} dry_run=${dryRun}`);
  for (const p of plans) {
    const voices = p.turns.map((t) => (t.voice === VOICE_PRIMARY ? "P" : "S")).join(",");
    console.log(`  ${p.id}: turns=${p.turns.length} voices=[${voices}] chars=${p.turns.reduce((a, t) => a + t.text.length, 0)}`);
  }
  if (dryRun) {
    for (const p of plans) {
      console.log(`\n--- ${p.id} ---`);
      p.turns.forEach((t, i) => console.log(`  [${i}] ${t.voice === VOICE_PRIMARY ? "PRIMARY" : "SECONDARY"}: ${t.text}`));
    }
    return;
  }

  validateEnv();
  if (spawnSync("ffmpeg", ["-version"], { encoding: "utf8" }).status !== 0) {
    console.error("[placement-audio] ffmpeg not found");
    process.exit(1);
  }
  const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

  const generated: string[] = [];
  for (const p of plans) {
    const parts: Uint8Array[] = [];
    for (const turn of p.turns) {
      const r = await render(turn.text, turn.voice);
      if (!r.ok) {
        if (r.billingStop) {
          console.error(`\n[placement-audio] BILLING_STOP on ${p.id}: HTTP ${r.status} — ${r.reason}`);
          console.error("[placement-audio] STOPPING. No retries. Nothing further generated.");
          console.log("JSON_SUMMARY=" + JSON.stringify({ billingStop: true, status: r.status, generated }));
          process.exit(2);
        }
        console.error(`[placement-audio] FAIL render ${p.id}: HTTP ${r.status} — ${r.reason}`);
        process.exit(1);
      }
      parts.push(r.bytes);
    }
    const mp3 = concatMp3(parts);
    const { error } = await db.storage.from(BUCKET).upload(p.key, mp3, { contentType: "audio/mpeg", upsert: true });
    if (error) {
      console.error(`[placement-audio] FAIL upload ${p.key}: ${error.message}`);
      process.exit(1);
    }
    generated.push(p.key);
    console.log(`  ✓ ${p.key} (${mp3.byteLength} bytes)`);
  }

  console.log("\n=== DONE ===");
  for (const k of generated) console.log(`  ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${k}`);
  console.log("JSON_SUMMARY=" + JSON.stringify({ billingStop: false, generated }));
}

main().catch((err) => {
  console.error("[placement-audio] fatal:", err);
  process.exit(1);
});
