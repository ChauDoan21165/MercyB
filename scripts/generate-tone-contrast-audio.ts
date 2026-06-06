/**
 * One-time reference-audio generation for the Chau-validated EN→VN
 * tone-contrast drill set (`TONE_CONTRAST_EXTRA_SYLLABLES`, shipped in
 * MR !431).
 *
 * Unlike the older `generate-tone-references.ts` (which targets the
 * canonical ma×6 set and writes committed files into
 * `public/audio/tones/`), this script:
 *   - walks `TONE_CONTRAST_EXTRA_SYLLABLES` (the 32 validated syllables), and
 *   - UPLOADS each mp3 to the Supabase `room-audio` bucket at
 *     `tones/<syllable>.mp3` — the path `resolveRoomAudioUrl` serves from
 *     today (post-d2951ddd, all audio is Supabase-served). No mp3 binaries
 *     are committed to the repo.
 *
 * Generation route: Azure Cognitive Services TTS **direct**
 * (`{region}.tts.speech.microsoft.com`). It does NOT route through the
 * `mercy-tts` edge function (which is throwing 502) or any runtime path.
 * This is a bounded ONE-TIME operator run — existing bucket objects are
 * skipped unless `--force` is passed.
 *
 * Usage (operator-run; never in CI, never at runtime):
 *   AZURE_SPEECH_KEY="$(security find-generic-password -s mb-azure-speech-key -w)" \
 *   AZURE_SPEECH_REGION=canadacentral \
 *   SUPABASE_SERVICE_ROLE_KEY="$(security find-generic-password -s mb-supabase-service-role -w)" \
 *     npx tsx scripts/generate-tone-contrast-audio.ts
 *
 * Environment (all read from process.env; nothing is printed):
 *   AZURE_SPEECH_KEY          — Azure Speech subscription key.
 *   AZURE_SPEECH_REGION       — e.g. `canadacentral`. Must match the key.
 *   SUPABASE_SERVICE_ROLE_KEY — service-role key for the storage upload.
 *   SUPABASE_URL              — optional, defaults to the prod project.
 *   TONE_VOICE_NAME           — optional, defaults to `vi-VN-HoaiMyNeural`
 *                               (Northern female, matches the drill design).
 *
 * Flags:
 *   --force   re-synthesize + re-upload even if the bucket object exists.
 */

import { createClient } from "@supabase/supabase-js";

import {
  TONE_CONTRAST_EXTRA_SYLLABLES,
} from "../src/data/tone-drill/tone-contrast-extra";
import type { ToneTarget } from "../src/data/tone-drill/minimal-pairs";

const FORCE = process.argv.includes("--force");
const AZURE_KEY = process.env.AZURE_SPEECH_KEY ?? "";
const AZURE_REGION = process.env.AZURE_SPEECH_REGION ?? "";
const VOICE_NAME = process.env.TONE_VOICE_NAME ?? "vi-VN-HoaiMyNeural";
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://buemdfxyhxunzpgdoqin.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const BUCKET = "room-audio";
const PREFIX = "tones";

function fatal(message: string): never {
  console.error(`[generate-tone-contrast-audio] ${message}`);
  process.exit(1);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Slightly slower-than-conversational rate makes the tone shape clearer. */
function buildSsml(target: ToneTarget): string {
  return [
    `<speak version="1.0" xml:lang="vi-VN">`,
    `  <voice name="${VOICE_NAME}">`,
    `    <prosody rate="-15%">${escapeXml(target.syllable)}</prosody>`,
    `  </voice>`,
    `</speak>`,
  ].join("\n");
}

async function synthesizeOne(target: ToneTarget): Promise<Uint8Array> {
  const url = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": AZURE_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-160kbitrate-mono-mp3",
      "User-Agent": "mercyblade-tone-contrast-audio",
    },
    body: buildSsml(target),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "<unreadable>");
    throw new Error(
      `Azure TTS ${response.status} for ${target.syllable}: ${body.slice(0, 200)}`,
    );
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function main(): Promise<void> {
  if (!AZURE_KEY) fatal("AZURE_SPEECH_KEY env var is missing.");
  if (!AZURE_REGION) fatal("AZURE_SPEECH_REGION env var is missing.");
  if (!SERVICE_ROLE_KEY) fatal("SUPABASE_SERVICE_ROLE_KEY env var is missing.");

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // One existence check up front so re-runs are cheap and idempotent.
  const { data: existingList, error: listError } = await supabase.storage
    .from(BUCKET)
    .list(PREFIX, { limit: 1000 });
  if (listError) {
    fatal(`could not list ${BUCKET}/${PREFIX}: ${listError.message}`);
  }
  const existing = new Set((existingList ?? []).map((o) => o.name));

  const syllables = TONE_CONTRAST_EXTRA_SYLLABLES;
  console.log(
    `[generate-tone-contrast-audio] ${syllables.length} validated syllables → ${BUCKET}/${PREFIX}/`,
  );
  console.log(
    `[generate-tone-contrast-audio] voice: ${VOICE_NAME}, region: ${AZURE_REGION}, force: ${FORCE}`,
  );

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const target of syllables) {
    // Single source of truth: the storage key is whatever the content's
    // audioPath points at, minus the leading `/audio/` (the resolver's
    // toAudioKey convention). This is the ASCII tone-tag key, e.g.
    // `/audio/tones/xe-sac.mp3` → object `tones/xe-sac.mp3`.
    const objectPath = target.audioPath.replace(/^\/audio\//, "");
    const filename = objectPath.slice(PREFIX.length + 1);

    if (!FORCE && existing.has(filename)) {
      console.log(`[generate-tone-contrast-audio] skip ${objectPath} (exists)`);
      skipped += 1;
      continue;
    }

    try {
      const bytes = await synthesizeOne(target);
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, bytes, {
          contentType: "audio/mpeg",
          upsert: FORCE,
        });
      if (uploadError) throw new Error(uploadError.message);
      uploaded += 1;
      console.log(
        `[generate-tone-contrast-audio] uploaded ${objectPath} (${bytes.byteLength} bytes, ${target.tone})`,
      );
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[generate-tone-contrast-audio] FAIL ${objectPath}: ${reason}`);
      failed += 1;
      process.exitCode = 2;
    }
  }

  console.log(
    `[generate-tone-contrast-audio] done — ${uploaded} uploaded, ${skipped} skipped, ${failed} failed of ${syllables.length}`,
  );
}

void main();
