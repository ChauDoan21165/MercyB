/**
 * scripts/regen-audio-defects.ts
 *
 * Targeted, entry-level audio regeneration for the 19 defect clips surfaced by
 * RECON-vi-rooms-audit-v2 / RECON-audio-regen.md. Generates ONLY the explicit
 * keys in TARGET_KEYS and uploads them to the Supabase `room-audio` bucket.
 *
 * Why this exists (not `generate-missing-audio.ts`): that script regenerates
 * EVERY entry of a touched room. The 7 vip9 rooms have 59 entries but only 7
 * are 0-byte; a room-granular run would overwrite 52 working files. This
 * script is driven by an explicit 19-key allowlist — it can never touch a
 * working clip.
 *
 * Same voice/model as the canonical room generator (OpenAI gpt-4o-mini-tts,
 * voice "alloy", text = "<room title.en>. <entry copy.en>") so the regenerated
 * audio matches the rest of the corpus.
 *
 * Required env (read from .env.local then .env, both gitignored):
 *   OPENAI_API_KEY
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (NOT the anon key — bypasses RLS for the write)
 *
 * Usage:
 *   npx tsx scripts/regen-audio-defects.ts --dry-run     # list targets, no API
 *   npx tsx scripts/regen-audio-defects.ts --limit=1     # smoke: 1 clip
 *   npx tsx scripts/regen-audio-defects.ts --only=<key>  # one specific key
 *   npx tsx scripts/regen-audio-defects.ts --category=A|B|C
 *   npx tsx scripts/regen-audio-defects.ts               # full 19-clip run
 *
 * Fails loud: any synth/upload/verify error aborts that clip with a logged
 * reason; no silent fallback.
 */

import { config as loadDotenv } from "dotenv";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

for (const p of [".env.local", ".env"]) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const OPENAI_API_KEY = (process.env.OPENAI_API_KEY ?? "").trim();
const SUPA_URL = (process.env.VITE_SUPABASE_URL ?? "").trim();
const SUPA_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

if (!OPENAI_API_KEY || !SUPA_URL || !SUPA_KEY) {
  console.error(
    "[regen] missing env: OPENAI_API_KEY, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT_ARG = args.find((a) => a.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split("=")[1]!, 10) : Infinity;
const ONLY_ARG = args.find((a) => a.startsWith("--only="));
const ONLY = ONLY_ARG ? ONLY_ARG.split("=")[1]!.trim() : null;
const CAT_ARG = args.find((a) => a.startsWith("--category="));
const CAT = CAT_ARG ? CAT_ARG.split("=")[1]!.trim().toUpperCase() : null;

const DATA_DIR = join(process.cwd(), "public", "data");
const BUCKET = "room-audio";

// ─── Explicit 19-key allowlist (the ONLY keys this script will ever write) ──
// Keys MUST match an `entry.audio` string in some public/data/*.json (the
// Step-0 JSON edits assign B/C keys; A keys were already correct).
const TARGETS: Record<"A" | "B" | "C", readonly string[]> = {
  // A — vip9 entry[0] 0-byte overwrites (7)
  A: [
    "genghis_v2_1_en.mp3",
    "genghis_v3_1_en.mp3",
    "cyrus_v3_1_en.mp3",
    "caesar_v2_1_en.mp3",
    "kautilya_vol1_1_en.mp3",
    "musashi_vol1_1_en.mp3",
    "corporate_cross_functional_1_en.mp3",
  ],
  // B — kids rooms, previously audio:null (9)
  B: [
    "creativity_challenges_v1_picture_challenge.mp3",
    "creativity_challenges_v1_what_if_game.mp3",
    "creativity_challenges_v1_new_game_ideas.mp3",
    "feelings_social_v1_sharing_feelings.mp3",
    "feelings_social_v1_kind_words.mp3",
    "feelings_social_v1_making_friends.mp3",
    "little_scientist_v1_science_tools.mp3",
    "little_scientist_v1_states_of_matter.mp3",
    "little_scientist_v1_simple_experiments.mp3",
  ],
  // C — sleep_improvement_vip3: only the 3 with NO existing bucket object.
  // (deepening/perfecting/incorporating already exist lowercase — NOT here.)
  C: [
    "mastering_your_sleep_schedule_vip3.mp3",
    "optimizing_pre-bed_nutrition_vip3.mp3",
    "tracking_sleep_patterns_vip3.mp3",
  ],
} as const;

type Job = {
  category: "A" | "B" | "C";
  key: string;
  roomFile: string;
  slug: string;
  text: string;
  chars: number;
};

type RoomJson = {
  title?: { en?: string };
  content?: { en?: string };
  entries?: Array<{ slug?: string; audio?: unknown; copy?: { en?: string } }>;
};

function buildJobs(): Job[] {
  // Index every (key -> {roomFile, entry}) across the corpus once.
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const index = new Map<string, { roomFile: string; text: string; slug: string }>();

  for (const f of files) {
    let room: RoomJson;
    try {
      room = JSON.parse(readFileSync(join(DATA_DIR, f), "utf8"));
    } catch {
      continue;
    }
    if (!Array.isArray(room.entries)) continue;
    const baseTitle = room.title?.en ?? "Mercy Blade";
    const baseIntro = room.content?.en ?? "";
    for (const e of room.entries) {
      if (typeof e?.audio !== "string") continue;
      const body = e.copy?.en?.trim();
      const text =
        body && body.length > 0
          ? `${baseTitle}. ${body}`
          : `${baseTitle}. ${baseIntro || "Guidance from Mercy Blade."}`;
      // First room wins per key (keys are unique in practice).
      if (!index.has(e.audio)) {
        index.set(e.audio, { roomFile: f, text, slug: e.slug ?? "entry" });
      }
    }
  }

  const jobs: Job[] = [];
  for (const cat of ["C", "B", "A"] as const) {
    if (CAT && CAT !== cat) continue;
    for (const key of TARGETS[cat]) {
      if (ONLY && key !== ONLY) continue;
      const hit = index.get(key);
      if (!hit) {
        console.error(
          `[regen] FATAL: target key not referenced by any room JSON: ${key}`,
        );
        process.exit(1);
      }
      jobs.push({
        category: cat,
        key,
        roomFile: hit.roomFile,
        slug: hit.slug,
        text: hit.text,
        chars: hit.text.length,
      });
    }
  }
  return jobs.slice(0, LIMIT);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function publicSize(key: string): Promise<{ status: number; size: number }> {
  const url = `${SUPA_URL}/storage/v1/object/public/${BUCKET}/${key}`;
  const res = await fetch(url, { method: "GET" });
  const buf = res.ok ? new Uint8Array(await res.arrayBuffer()) : new Uint8Array();
  return { status: res.status, size: buf.byteLength };
}

async function runOne(job: Job): Promise<boolean> {
  const tag = `[${job.category}] ${job.key}`;
  console.log(
    `🎧 ${tag}  (room: ${job.roomFile}, slug: ${job.slug}, chars: ${job.chars})`,
  );
  if (DRY_RUN) {
    console.log(`   DRY-RUN — would synth+upload. Preview: "${job.text.slice(0, 80)}…"`);
    return true;
  }

  let buffer: Buffer;
  try {
    const resp = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      response_format: "mp3",
      input: job.text,
    });
    buffer = Buffer.from(await resp.arrayBuffer());
  } catch (err) {
    console.error(`   ✗ SYNTH FAILED ${tag}:`, err);
    return false;
  }
  if (buffer.byteLength < 1024) {
    console.error(`   ✗ SYNTH returned ${buffer.byteLength} B (<1KB) — refusing to upload ${tag}`);
    return false;
  }

  try {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(job.key, buffer, { contentType: "audio/mpeg", upsert: true });
    if (error) throw error;
  } catch (err) {
    console.error(`   ✗ UPLOAD FAILED ${tag}:`, err);
    return false;
  }

  // Verify the public URL now serves real bytes.
  const { status, size } = await publicSize(job.key);
  if (status !== 200 || size < 1024) {
    console.error(`   ✗ VERIFY FAILED ${tag}: HTTP ${status}, ${size} B`);
    return false;
  }
  console.log(`   ✅ ${tag}  synth=${buffer.byteLength}B  bucket=${size}B  HTTP ${status}`);
  return true;
}

async function main(): Promise<void> {
  const jobs = buildJobs();
  const totalChars = jobs.reduce((a, j) => a + j.chars, 0);
  console.log(
    `[regen] ${jobs.length} target clip(s)  total_chars=${totalChars}  dry_run=${DRY_RUN}`,
  );
  for (const c of ["A", "B", "C"] as const) {
    const n = jobs.filter((j) => j.category === c).length;
    if (n) console.log(`[regen]   category ${c}: ${n}`);
  }

  let ok = 0;
  const failed: string[] = [];
  for (const job of jobs) {
    const success = await runOne(job);
    if (success) ok++;
    else failed.push(`${job.category}:${job.key}`);
    if (!DRY_RUN) await new Promise((r) => setTimeout(r, 350));
  }

  console.log(`\n[regen] done: ok=${ok}/${jobs.length} failed=${failed.length}`);
  if (failed.length) {
    console.log(`[regen] FAILURES:\n  ${failed.join("\n  ")}`);
    process.exit(2);
  }
}

main().catch((err) => {
  console.error("[regen] fatal:", err);
  process.exit(1);
});
