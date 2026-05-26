/**
 * scripts/regen-audio-defects.ts
 *
 * Targeted, entry-level audio regeneration driven by an explicit committed
 * allowlist. Generates ONLY the keys in `scripts/audio-regen-manifest.json`
 * and uploads them to the Supabase `room-audio` bucket.
 *
 * History:
 *   - PR #566 shipped this for 19 defect clips (RECON-audio-regen.md), with a
 *     hardcoded 19-key A/B/C TARGETS const + a string-only `entry.audio` indexer.
 *   - This revision (RECON-audio-byte-full-audit.md) widens it to the full
 *     154-clip corpus defect set (34 zero-byte + 31 suspect + 89 genuinely
 *     missing) and broadens the corpus indexer to the field shapes those keys
 *     actually live in: `entry.audio` / `entry.audio_en` (EN copy),
 *     `entry.audio_vi` (VI copy — sun_tzu narration), and `content.audio`
 *     (the room-intro clip, e.g. every kids `*_v1_intro.mp3`).
 *
 * Why this exists (not `generate-missing-audio.ts`): that script regenerates
 * EVERY entry of a touched room. Here, only the 154 explicitly-listed defect
 * keys are written — the 2,603 healthy sibling clips are never touched. The
 * allowlist is the committed manifest; a key absent from the corpus FATALs.
 *
 * Source text matches the corpus generation convention so regenerated audio is
 * indistinguishable from the rest of the library:
 *   - EN clip  (entry.audio / entry.audio_en): "<room title.en>. <entry copy.en>"
 *   - VI clip  (entry.audio_vi):                "<room title.vi>. <entry copy.vi>"
 *   - intro    (content.audio):                 "<room title.en>. <room content.en>"
 *   OpenAI gpt-4o-mini-tts, voice "alloy" (same as the canonical room generator;
 *   the existing healthy `*_vi` siblings in sun_tzu_strategy_vip9 were generated
 *   with this same model/voice, so alloy-speaking-Vietnamese is corpus-consistent).
 *
 * Required env (read from .env.local then .env, both gitignored):
 *   OPENAI_API_KEY
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (NOT the anon key — bypasses RLS for the write)
 *
 * Usage:
 *   npx tsx scripts/regen-audio-defects.ts --dry-run            # list targets, no API
 *   npx tsx scripts/regen-audio-defects.ts --limit=1            # smoke: 1 clip
 *   npx tsx scripts/regen-audio-defects.ts --only=a.mp3,b.mp3   # specific keys (CSV)
 *   npx tsx scripts/regen-audio-defects.ts --class=zero|suspect|missing
 *   npx tsx scripts/regen-audio-defects.ts                      # full 154-clip run
 *
 * Fails loud: any synth/upload/verify error aborts that clip with a logged
 * reason; no silent fallback. A synth or bucket object < MIN_BYTES (10 KB,
 * the CI-guard floor) is treated as a failure.
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
const ONLY = ONLY_ARG
  ? new Set(
      ONLY_ARG.split("=")[1]!
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
  : null;
const CLASS_ARG = args.find((a) => a.startsWith("--class="));
const CLASS = CLASS_ARG ? CLASS_ARG.split("=")[1]!.trim().toLowerCase() : null;

const DATA_DIR = join(process.cwd(), "public", "data");
const MANIFEST_PATH = join(process.cwd(), "scripts", "audio-regen-manifest.json");
const BUCKET = "room-audio";

// 10 KB — the CI-guard floor (scripts/check-room-audio-bytes.mjs). Smallest
// real clip in the corpus is 48,527 B; the defect band is ≤ 67 B. A synth or
// bucket object under this is, by definition, the defect we are fixing.
const MIN_BYTES = 10_240;

// ─── Committed 154-key allowlist (the ONLY keys this script will ever write) ──
type Manifest = {
  _meta: Record<string, unknown>;
  keys: Array<{ key: string; class: "zero" | "suspect" | "missing" }>;
};
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
const ALLOW = new Map(manifest.keys.map((k) => [k.key, k.class] as const));

type Lang = "en" | "vi";
type Job = {
  cls: "zero" | "suspect" | "missing";
  key: string;
  roomFile: string;
  slug: string;
  lang: Lang;
  field: string;
  text: string;
  chars: number;
};

type Entry = {
  slug?: string;
  audio?: unknown;
  audio_en?: unknown;
  audio_vi?: unknown;
  copy?: { en?: string; vi?: string };
  title?: { en?: string; vi?: string };
};
type RoomJson = {
  title?: { en?: string; vi?: string };
  content?: { en?: string; vi?: string; audio?: unknown };
  intro?: { en?: string; vi?: string } | string;
  audio?: unknown;
  intro_audio?: unknown;
  entries?: Entry[];
};

function clean(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
}

/**
 * Index every defect-relevant audio key across the corpus → its source text.
 * Covers the three field shapes the 154 keys actually occupy. First room to
 * declare a key wins (keys are unique in practice).
 */
function buildIndex(): Map<
  string,
  { roomFile: string; text: string; slug: string; lang: Lang; field: string }
> {
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const index = new Map<
    string,
    { roomFile: string; text: string; slug: string; lang: Lang; field: string }
  >();

  const put = (
    key: string,
    rec: { roomFile: string; text: string; slug: string; lang: Lang; field: string },
  ) => {
    if (key && !index.has(key)) index.set(key, rec);
  };

  for (const f of files) {
    let room: RoomJson;
    try {
      room = JSON.parse(readFileSync(join(DATA_DIR, f), "utf8"));
    } catch {
      continue;
    }
    const titleEn = clean(room.title?.en) || "Mercy Blade";
    const titleVi = clean(room.title?.vi) || titleEn;
    const fallback = "Guidance from Mercy Blade.";
    // Room-intro narration text — rooms carry it as content.{en}, intro.{en},
    // or a bare `intro` string depending on era/template. First non-empty wins.
    const introEn =
      clean(room.content?.en) ||
      clean(typeof room.intro === "object" ? room.intro?.en : room.intro) ||
      "";
    const introText = `${titleEn}. ${introEn || fallback}`;

    // (1) Room-intro clip. Three field shapes across the corpus carry it:
    //     content.audio (kids `*_v1_intro.mp3`), root.audio (mental_health_vip1),
    //     root.intro_audio (story_builder / study_skills kids). Same EN text.
    for (const [val, fieldName] of [
      [room.content?.audio, "content.audio"],
      [room.audio, "root.audio"],
      [room.intro_audio, "root.intro_audio"],
    ] as const) {
      if (typeof val === "string" && !val.includes(" ")) {
        put(val, {
          roomFile: f,
          slug: "__intro__",
          lang: "en",
          field: fieldName,
          text: introText,
        });
      }
    }

    if (!Array.isArray(room.entries)) continue;
    for (const e of room.entries) {
      const slug = clean(e?.slug) || "entry";
      const copyEn = clean(e?.copy?.en);
      const copyVi = clean(e?.copy?.vi);
      const eTitleEn = clean(e?.title?.en);
      const eTitleVi = clean(e?.title?.vi);

      // (2) EN clip — entry.audio / entry.audio_en
      for (const af of ["audio", "audio_en"] as const) {
        const v = e?.[af];
        if (typeof v !== "string") continue;
        // skip space-joined slug:"all" play-all concat pseudo-refs
        if (v.includes(" ")) continue;
        put(v, {
          roomFile: f,
          slug,
          lang: "en",
          field: `entry.${af}`,
          text: `${eTitleEn || titleEn}. ${copyEn || introEn || fallback}`,
        });
      }

      // (3) VI clip — entry.audio_vi (sun_tzu narration)
      if (typeof e?.audio_vi === "string" && !e.audio_vi.includes(" ")) {
        put(e.audio_vi, {
          roomFile: f,
          slug,
          lang: "vi",
          field: "entry.audio_vi",
          text: `${eTitleVi || titleVi}. ${copyVi || copyEn || fallback}`,
        });
      }
    }
  }
  return index;
}

function buildJobs(): Job[] {
  const index = buildIndex();
  const jobs: Job[] = [];
  const missingFromCorpus: string[] = [];

  for (const [key, cls] of ALLOW) {
    if (CLASS && CLASS !== cls) continue;
    if (ONLY && !ONLY.has(key)) continue;
    const hit = index.get(key);
    if (!hit) {
      missingFromCorpus.push(key);
      continue;
    }
    jobs.push({
      cls,
      key,
      roomFile: hit.roomFile,
      slug: hit.slug,
      lang: hit.lang,
      field: hit.field,
      text: hit.text,
      chars: hit.text.length,
    });
  }

  if (missingFromCorpus.length) {
    console.error(
      `[regen] FATAL: ${missingFromCorpus.length} allowlist key(s) not referenced by any room JSON:\n  ${missingFromCorpus.join("\n  ")}`,
    );
    process.exit(1);
  }
  // stable order: class then key
  jobs.sort((a, b) => a.cls.localeCompare(b.cls) || a.key.localeCompare(b.key));
  return jobs.slice(0, LIMIT);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function publicSize(key: string): Promise<{ status: number; size: number }> {
  // Cache-bust the verify read. The public bucket sits behind Cloudflare; a key
  // that previously served a defective object (0/67 B) keeps that body at the
  // edge until revalidation, so a plain GET right after upsert can return the
  // STALE old bytes even though the origin object is now correct (observed on
  // alphabet_adventure_v1_abc_song: plain=67 B, ?v=…=421,632 B). A unique query
  // forces an origin read so we verify the object we actually wrote. Objects are
  // `cache-control: no-cache`, so real clients revalidate on next request too.
  const url = `${SUPA_URL}/storage/v1/object/public/${BUCKET}/${key}?v=${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  const buf = res.ok ? new Uint8Array(await res.arrayBuffer()) : new Uint8Array();
  return { status: res.status, size: buf.byteLength };
}

async function runOne(job: Job): Promise<boolean> {
  const tag = `[${job.cls}/${job.lang}] ${job.key}`;
  console.log(
    `🎧 ${tag}  (room: ${job.roomFile}, slug: ${job.slug}, field: ${job.field}, chars: ${job.chars})`,
  );
  if (DRY_RUN) {
    console.log(`   DRY-RUN — would synth+upload. Preview: "${job.text.slice(0, 90)}…"`);
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
  if (buffer.byteLength < MIN_BYTES) {
    console.error(
      `   ✗ SYNTH returned ${buffer.byteLength} B (< ${MIN_BYTES}) — refusing to upload ${tag}`,
    );
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

  // Verify the public URL now serves real bytes (≥ CI-guard floor).
  const { status, size } = await publicSize(job.key);
  if (status !== 200 || size < MIN_BYTES) {
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
  for (const c of ["zero", "suspect", "missing"] as const) {
    const n = jobs.filter((j) => j.cls === c).length;
    if (n) console.log(`[regen]   class ${c}: ${n}`);
  }

  let ok = 0;
  const failed: string[] = [];
  for (const job of jobs) {
    const success = await runOne(job);
    if (success) ok++;
    else failed.push(`${job.cls}:${job.key}`);
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
