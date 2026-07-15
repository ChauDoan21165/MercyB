import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { buildAzureTtsCacheReference } from "../../supabase/functions/mercy-tts/core.ts";
import { azureVoiceFor } from "../../supabase/functions/mercy-tts/azureProvider.ts";

type EnUnit = {
  index: number;
  content_type: string;
  text: string;
};

type CensusUnit = {
  language: string;
  storage_key: string;
  text: string;
  source: string;
  bytes?: number | null;
  status?: string;
};

type HeadResult = {
  status: number;
  ok: boolean;
  bytes: number | null;
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://buemdfxyhxunzpgdoqin.supabase.co";
const BUCKET = "room-audio";
const PRIORITY_CATEGORIES = new Set([
  "sound_pair_word_or_phrase",
  "phoneme_drill_sentence",
  "ipa_reference_vocabulary",
  "pronunciation_challenge_sentence",
]);

const SAMPLE_URLS = [
  "https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/bd3b34c56879f7f3c83cf79b91cbb2a260635b44464d3480b9a6e1a936acc62d.mp3",
  "https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/8d25de3a0828ce424fca52eed8acb12b6405b6872d766cb95ddad8e78a3fcbdd.mp3",
  "https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/26bff46bcec3e5cd8f022253ae3f2543a84c9a5d61e384f56eed5710384209e4.mp3",
  "https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/6075d58a62a07cfbd13ab9bc07537806b5391556028077196acf52137d5d80b5.mp3",
  "https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/d6748b312e9afa0a6ccdd6c4c5b5ada8549b12576e1e37f74bf429a66d4ca806.mp3",
];

function publicUrl(storageKey: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(storageKey)}`;
}

async function headObject(storageKey: string): Promise<HeadResult> {
  const response = await fetch(publicUrl(storageKey), { method: "HEAD" });
  const length = response.headers.get("content-length");
  return {
    status: response.status,
    ok: response.status === 200,
    bytes: length ? Number(length) : null,
  };
}

async function mapLimit<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      for (;;) {
        const current = next++;
        if (current >= items.length) return;
        results[current] = await fn(items[current] as T);
      }
    }),
  );
  return results;
}

async function loadJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

function targetEnglishUnits(input: { units: EnUnit[] }): EnUnit[] {
  return input.units.filter((unit) => PRIORITY_CATEGORIES.has(unit.content_type));
}

function phase2Targets(census: {
  missing_pregenerated: CensusUnit[];
  size_outliers: CensusUnit[];
}): Array<CensusUnit & { repair_reason: "missing" | "size_outlier"; voice: string; locale: string }> {
  return [
    ...census.missing_pregenerated.map((unit) => ({ ...unit, repair_reason: "missing" as const })),
    ...census.size_outliers.map((unit) => ({ ...unit, repair_reason: "size_outlier" as const })),
  ].map((unit) => {
    const voice = azureVoiceFor(unit.language);
    return {
      ...unit,
      voice: voice.name,
      locale: voice.locale,
    };
  }).sort((a, b) => a.storage_key.localeCompare(b.storage_key));
}

async function main(): Promise<void> {
  const enBreakdown = await loadJson<{ units: EnUnit[] }>("reports/audio-census/en-unit-breakdown.json");
  const census = await loadJson<{
    missing_pregenerated: CensusUnit[];
    size_outliers: CensusUnit[];
  }>("reports/audio-census/census.json");
  const targets = targetEnglishUnits(enBreakdown);
  if (targets.length !== 657) {
    throw new Error(`expected 657 pronunciation units, found ${targets.length}`);
  }

  const verified = await mapLimit(targets, 16, async (unit) => {
    const reference = await buildAzureTtsCacheReference({ text: unit.text, language: "en" });
    const head = await headObject(reference.storage_key);
    return {
      index: unit.index,
      content_type: unit.content_type,
      text: unit.text,
      storage_key: reference.storage_key,
      public_url: publicUrl(reference.storage_key),
      voice: reference.voice,
      head_status: head.status,
      bytes: head.bytes,
      present: head.ok,
    };
  });

  const phase2 = phase2Targets(census);
  const missingEnv = ["AZURE_SPEECH_KEY", "AZURE_SPEECH_REGION"].filter((name) => !process.env[name]);
  const outboxDir = resolve("reports/audio-census/pronun-prewarm-outbox");

  const report = {
    metadata: {
      task: "WP-PRONUN-PREWARM",
      branch: "c41/wp-pronun-prewarm",
      supabase_url: SUPABASE_URL,
      bucket: BUCKET,
      deployed_function: `${SUPABASE_URL}/functions/v1/mercy-tts`,
      cache_key_helper: "supabase/functions/mercy-tts/core.ts:buildAzureTtsCacheReference",
    },
    phase1: {
      priority_categories: Array.from(PRIORITY_CATEGORIES).sort(),
      target_count: targets.length,
      sample_gate: {
        approved: true,
        urls: SAMPLE_URLS,
      },
      bulk_warm: {
        attempted_after_approval: true,
        warmed_or_already_present: verified.filter((unit) => unit.present).length,
        transient_retries_observed: 1,
        transient_retry_notes: [
          "One deployed-function 502 occurred at priority ordinal 374 / source index 819 and succeeded on retry.",
        ],
      },
      verification: {
        method: "HEAD public room-audio object for each shipped buildAzureTtsCacheReference key",
        total: verified.length,
        present: verified.filter((unit) => unit.present).length,
        failed: verified.filter((unit) => !unit.present).length,
        failed_units: verified.filter((unit) => !unit.present),
      },
      units: verified,
    },
    phase2: {
      requested_missing_ko: census.missing_pregenerated.filter((unit) => unit.language === "ko").length,
      requested_size_outliers: census.size_outliers.length,
      total_targets: phase2.length,
      voice_evidence: "Azure Speech REST requested by task; voices are resolved through supabase/functions/mercy-tts/azureProvider.ts:azureVoiceFor.",
      blocked: missingEnv.length > 0,
      missing_env: missingEnv,
      outbox_dir: outboxDir,
      generated_files: existsSync(outboxDir) ? "present on disk; inspect outbox" : [],
      targets: phase2,
    },
  };

  await mkdir("reports/audio-census", { recursive: true });
  await writeFile("reports/audio-census/pronun-prewarm.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const byFamily = new Map<string, number>();
  for (const unit of verified) byFamily.set(unit.content_type, (byFamily.get(unit.content_type) ?? 0) + 1);
  const phase2ByLanguage = new Map<string, number>();
  for (const unit of phase2) phase2ByLanguage.set(unit.language, (phase2ByLanguage.get(unit.language) ?? 0) + 1);
  const failed = verified.filter((unit) => !unit.present);

  const md = [
    "# Pronunciation Prewarm",
    "",
    "## Headline",
    "",
    `- Phase 1 target units: ${targets.length}`,
    `- Cached reference-audio objects HEAD 200: ${verified.filter((unit) => unit.present).length}/${verified.length}`,
    `- Failed HEAD checks: ${failed.length}`,
    `- Phase 2 local generation: ${missingEnv.length ? `blocked; export ${missingEnv.join(" and ")}` : "ready"}`,
    "",
    "## Sample Gate",
    "",
    "Approved by Chau after these deployed-function cache URLs were produced:",
    "",
    ...SAMPLE_URLS.map((url, index) => `${index + 1}. ${url}`),
    "",
    "## Phase 1 Counts",
    "",
    "| category | units |",
    "| --- | ---: |",
    ...Array.from(byFamily.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => `| ${name} | ${count} |`),
    "",
    "Verification used `buildAzureTtsCacheReference` from the shipped `mercy-tts` core and public-object HEAD checks against `room-audio`.",
    "",
    "## Phase 2 Targets",
    "",
    `- Missing Korean structured-path files: ${census.missing_pregenerated.filter((unit) => unit.language === "ko").length}`,
    `- Size-outlier files: ${census.size_outliers.length}`,
    `- Total local regeneration targets: ${phase2.length}`,
      `- Upload script: reports/audio-census/upload-outbox.sh`,
    "",
    "| language | targets |",
    "| --- | ---: |",
    ...Array.from(phase2ByLanguage.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([language, count]) => `| ${language} | ${count} |`),
    "",
    "## Phase 2 Blocker",
    "",
    missingEnv.length
      ? `Local Azure synthesis was not run because ${missingEnv.map((name) => `\`${name}\``).join(" and ")} ${missingEnv.length === 1 ? "is" : "are"} unset in this shell.`
      : "Azure env is present; run the generation step before upload.",
    "",
  ].join("\n");
  await writeFile("reports/audio-census/pronun-prewarm.md", `${md}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
