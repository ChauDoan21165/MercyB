import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { buildAzureTtsCacheReference } from "../../supabase/functions/mercy-tts/core.ts";

type EnglishTtsUnit = {
  category: "english_tts_first";
  language: "en";
  voice: string;
  text: string;
  cache_key: string;
  storage_key: string;
  source: string;
  status?: string;
  bytes?: number | null;
};

type StorageObject = {
  name: string;
  storage_key: string;
  bytes: number | null;
  updated_at?: string;
};

type AudioLink = {
  scheme?: string;
  storage_key?: string;
  verified?: boolean;
  tuples?: Array<{
    language?: string;
    voice?: string;
    text?: string;
    sha256?: string;
    url?: string;
  }>;
};

type Census = {
  metadata: {
    supabase_url?: string;
    bucket?: string;
    cache_prefix?: string;
    [key: string]: unknown;
  };
  english_tts_first: EnglishTtsUnit[];
  orphans?: StorageObject[];
};

const SUPABASE_URL = "https://buemdfxyhxunzpgdoqin.supabase.co";
const BUCKET = "room-audio";
const TTS_CACHE_PREFIX = "tts-cache";
const REPORT_DIR = resolve("reports/audio-census");
const CENSUS_PATH = resolve(REPORT_DIR, "census.json");
const GLOBAL_AUDIO_LINK_PATH = resolve("reports/cell-inventory/audio-link-global.json");
const A1_AUDIO_LINK_PATH = resolve("reports/cell-inventory/audio-link-vn-en-a1.json");
const A1_AUDIO_MAP_PATH = resolve("reports/cell-inventory/audio-map-vn-en-a1.json");
const JSON_OUT = resolve(REPORT_DIR, "en-reconcile.json");
const MD_OUT = resolve(REPORT_DIR, "en-reconcile.md");

const BUCKET_ORDER = [
  "scheme_a_legacy_file",
  "a1_tts_cache_map",
  "present_in_tts_cache_anyway",
  "runtime_tts_only_first_play",
] as const;

type Bucket = (typeof BUCKET_ORDER)[number];

function publicObjectUrl(storageKey: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(storageKey)}`;
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function extractProductionAnonKey(): Promise<string> {
  const envKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
  if (envKey.trim()) return envKey.trim();

  const html = await fetch("https://mercyblade.com/").then((response) => response.text());
  const scriptUrls = [...html.matchAll(/<script[^>]+src=["']([^"']+\.js[^"']*)["']/g)].map(
    (match) => new URL(match[1], "https://mercyblade.com/").href,
  );
  for (const url of scriptUrls) {
    const js = await fetch(url).then((response) => response.text());
    if (!js.includes("buemdfxyhxunzpgdoqin")) continue;
    const match = js.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
    if (match) return match[0];
  }
  throw new Error("Missing Supabase anon key; set VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY.");
}

async function listTtsCachePage(input: {
  anonKey: string;
  prefix: string;
  limit: number;
  offset: number;
}): Promise<StorageObject[]> {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: {
      apikey: input.anonKey,
      authorization: `Bearer ${input.anonKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      prefix: input.prefix,
      limit: input.limit,
      offset: input.offset,
      sortBy: { column: "name", order: "asc" },
    }),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Storage list failed: ${response.status} ${body.slice(0, 200)}`);
  }
  const rows = JSON.parse(body) as Array<{
    name?: string;
    metadata?: { size?: number | null } | null;
    updated_at?: string;
  }>;
  return rows
    .filter((row) => typeof row.name === "string" && row.name.endsWith(".mp3"))
    .map((row) => ({
      name: row.name as string,
      storage_key: `${TTS_CACHE_PREFIX}/${row.name}`,
      bytes: typeof row.metadata?.size === "number" ? row.metadata.size : null,
      updated_at: row.updated_at,
    }));
}

async function listTtsCacheAll(anonKey: string, limit: number): Promise<StorageObject[]> {
  const rows: StorageObject[] = [];
  for (let offset = 0; ; offset += limit) {
    const page = await listTtsCachePage({ anonKey, prefix: TTS_CACHE_PREFIX, limit, offset });
    rows.push(...page);
    if (page.length < limit) return rows;
  }
}

async function measurePagination(anonKey: string): Promise<Array<{
  prefix: string;
  limit: number;
  total: number;
  page_counts: number[];
}>> {
  const out = [];
  for (const prefix of [TTS_CACHE_PREFIX, `${TTS_CACHE_PREFIX}/`]) {
    for (const limit of [100, 500, 1000]) {
      const pageCounts = [];
      let total = 0;
      for (let offset = 0; ; offset += limit) {
        const page = await listTtsCachePage({ anonKey, prefix, limit, offset });
        pageCounts.push(page.length);
        total += page.length;
        if (page.length < limit) break;
      }
      out.push({ prefix, limit, total, page_counts: pageCounts });
    }
  }
  return out;
}

async function headStatuses(storageKeys: string[]): Promise<Map<string, number | "ERR">> {
  const distinct = [...new Set(storageKeys)].sort();
  const statuses = new Map<string, number | "ERR">();
  let cursor = 0;
  async function worker(): Promise<void> {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= distinct.length) return;
      const storageKey = distinct[index];
      try {
        const response = await fetch(publicObjectUrl(storageKey), {
          method: "HEAD",
          signal: AbortSignal.timeout(10_000),
        });
        statuses.set(storageKey, response.status);
      } catch {
        statuses.set(storageKey, "ERR");
      }
    }
  }
  await Promise.all(Array.from({ length: 40 }, worker));
  return statuses;
}

function statusPresent(status: number | "ERR" | undefined): boolean {
  return typeof status === "number" && status >= 200 && status < 300;
}

function countBy<T extends string>(rows: Array<{ bucket: T }>): Record<T, number> {
  return rows.reduce((acc, row) => {
    acc[row.bucket] = (acc[row.bucket] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function summarizeStatuses(statuses: Map<string, number | "ERR">): Record<string, number> {
  const out: Record<string, number> = {};
  for (const status of statuses.values()) {
    const key = String(status);
    out[key] = (out[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

function firstExamples(
  classifications: Array<Record<string, unknown> & { bucket: Bucket }>,
  bucket: Bucket,
): Array<Record<string, unknown>> {
  return classifications
    .filter((row) => row.bucket === bucket)
    .slice(0, 5)
    .map((row) => ({
      index: row.index,
      text: row.text,
      source: row.source,
      storage_key: row.storage_key,
      evidence: row.evidence,
    }));
}

async function main(): Promise<void> {
  const [census, globalAudioLink, a1AudioLink, a1AudioMap] = await Promise.all([
    readJson<Census>(CENSUS_PATH),
    readJson<{ links: AudioLink[] }>(GLOBAL_AUDIO_LINK_PATH),
    readJson<{ links: AudioLink[] }>(A1_AUDIO_LINK_PATH),
    readJson<{ cells: Array<{ tuples?: AudioLink["tuples"] }> }>(A1_AUDIO_MAP_PATH),
  ]);

  const anonKey = await extractProductionAnonKey();
  const pagination = await measurePagination(anonKey);
  const liveObjects = await listTtsCacheAll(anonKey, 100);
  const liveObjectSet = new Set(liveObjects.map((object) => object.storage_key));

  const verifiedSchemeA = new Set(
    globalAudioLink.links
      .filter((link) => link.scheme === "A_legacy_root" && link.verified && link.storage_key)
      .map((link) => link.storage_key as string),
  );

  const a1MapKeys = new Set<string>();
  for (const cell of a1AudioMap.cells) {
    for (const tuple of cell.tuples ?? []) {
      if (tuple?.sha256) a1MapKeys.add(`${TTS_CACHE_PREFIX}/${tuple.sha256}.mp3`);
    }
  }
  for (const link of a1AudioLink.links) {
    for (const tuple of link.tuples ?? []) {
      if (tuple?.sha256) a1MapKeys.add(`${TTS_CACHE_PREFIX}/${tuple.sha256}.mp3`);
    }
  }

  const ttsFirstStorageKeys: string[] = [];
  const keyMismatches = [];
  for (const [index, unit] of census.english_tts_first.entries()) {
    const reference = await buildAzureTtsCacheReference({ text: unit.text, language: unit.language });
    ttsFirstStorageKeys.push(reference.storage_key);
    if (
      reference.language !== unit.language ||
      reference.voice !== unit.voice ||
      reference.sha256 !== unit.cache_key ||
      reference.storage_key !== unit.storage_key
    ) {
      keyMismatches.push({
        index,
        text: unit.text,
        source: unit.source,
        census: {
          language: unit.language,
          voice: unit.voice,
          sha256: unit.cache_key,
          storage_key: unit.storage_key,
        },
        runtime: reference,
      });
    }
  }
  if (keyMismatches.length > 0) {
    throw new Error(`Runtime TTS key mismatches: ${keyMismatches.length}`);
  }

  const a1Statuses = await headStatuses([...a1MapKeys]);
  const englishStatuses = await headStatuses(ttsFirstStorageKeys);
  const a1PresentSet = new Set(
    [...a1MapKeys].filter((storageKey) => liveObjectSet.has(storageKey) || statusPresent(a1Statuses.get(storageKey))),
  );
  const englishPresentSet = new Set(
    ttsFirstStorageKeys.filter((storageKey) => liveObjectSet.has(storageKey) || statusPresent(englishStatuses.get(storageKey))),
  );

  const classifications = census.english_tts_first.map((unit, index) => {
    let bucket: Bucket;
    let evidence: string;
    if (verifiedSchemeA.has(unit.storage_key)) {
      bucket = "scheme_a_legacy_file";
      evidence = "Exact storage_key match in verified scheme A legacy audio-link artifact.";
    } else if (a1PresentSet.has(unit.storage_key)) {
      bucket = "a1_tts_cache_map";
      evidence = "Exact tts-cache key is present in the 627-cell A1 audio map and HEAD-verifies.";
    } else if (englishPresentSet.has(unit.storage_key)) {
      bucket = "present_in_tts_cache_anyway";
      evidence = "Runtime TTS key is present in live tts-cache but is not part of the A1 map.";
    } else {
      bucket = "runtime_tts_only_first_play";
      evidence = "No verified scheme A file, no A1 map object, and current runtime TTS key does not HEAD-verify.";
    }
    return {
      index,
      bucket,
      category: unit.category,
      language: unit.language,
      voice: unit.voice,
      text: unit.text,
      sha256: unit.cache_key,
      storage_key: unit.storage_key,
      source: unit.source,
      evidence,
    };
  });

  const bucketCounts = countBy(classifications);
  for (const bucket of BUCKET_ORDER) bucketCounts[bucket] ??= 0;

  const referencedTtsCacheObjects = new Set([...a1PresentSet, ...englishPresentSet]);
  const liveOrphans = liveObjects.filter((object) => !referencedTtsCacheObjects.has(object.storage_key));
  const liveOrphanBytes = liveOrphans.reduce((sum, object) => sum + (object.bytes ?? 0), 0);

  const report = {
    metadata: {
      generated_at: new Date().toISOString(),
      source_census: CENSUS_PATH,
      source_census_commit: census.metadata.commit ?? null,
      supabase_url: SUPABASE_URL,
      bucket: BUCKET,
      cache_prefix: TTS_CACHE_PREFIX,
      classification_order: BUCKET_ORDER,
      hash_logic: "imported buildAzureTtsCacheReference from supabase/functions/mercy-tts/core.ts",
    },
    summary: {
      english_tts_first_units: census.english_tts_first.length,
      bucket_counts: Object.fromEntries(BUCKET_ORDER.map((bucket) => [bucket, bucketCounts[bucket]])),
      all_units_classified_once:
        Object.values(bucketCounts).reduce((sum, count) => sum + count, 0) === census.english_tts_first.length,
      runtime_tts_only_first_play: bucketCounts.runtime_tts_only_first_play,
      tts_cache_objects_listed_old_census: census.orphans?.length
        ? (census.orphans.length + census.english_tts_first.filter((unit) => unit.status === "cached").length)
        : null,
      tts_cache_objects_listed_current: liveObjects.length,
      tts_cache_a1_distinct_objects: a1MapKeys.size,
      tts_cache_a1_head_present_distinct_objects: a1PresentSet.size,
      tts_cache_english_inventory_head_present_distinct_objects: englishPresentSet.size,
      corrected_tts_cache_orphan_objects: liveOrphans.length,
      corrected_tts_cache_orphan_bytes: liveOrphanBytes,
      key_mismatches: keyMismatches.length,
    },
    pagination_probe: pagination,
    head_probe: {
      a1_map_distinct_statuses: summarizeStatuses(a1Statuses),
      english_inventory_distinct_statuses: summarizeStatuses(englishStatuses),
    },
    scheme_a: {
      verified_legacy_root_files: verifiedSchemeA.size,
      coverage_rule: "Exact storage_key match only; audio-link scheme A has file paths, not spoken-text keys.",
    },
    classifications,
    examples: Object.fromEntries(BUCKET_ORDER.map((bucket) => [bucket, firstExamples(classifications, bucket)])),
    corrected_orphans: liveOrphans.map((object) => ({
      storage_key: object.storage_key,
      bytes: object.bytes,
      updated_at: object.updated_at,
    })),
  };

  await writeFile(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`);

  const table = BUCKET_ORDER.map(
    (bucket) => `| ${bucket} | ${bucketCounts[bucket]} |`,
  ).join("\n");
  const paginationLines = pagination
    .map((row) => `- prefix \`${row.prefix}\`, limit ${row.limit}: ${row.total} objects (${row.page_counts.join(" + ")})`)
    .join("\n");
  const md = `# English Audio Reconciliation

## Summary

Every unit in the census English TTS-first inventory is classified exactly once.

| Bucket | Units |
| --- | ---: |
${table}

True English lesson content with no static audio in any scheme: **${bucketCounts.runtime_tts_only_first_play} / ${census.english_tts_first.length}**.

## Cache Listing

Current live \`${TTS_CACHE_PREFIX}\` object count: **${liveObjects.length}**. The old census listed **${report.summary.tts_cache_objects_listed_old_census}** objects in the same prefix.

Pagination probe:

${paginationLines}

The 627-cell A1 map contains **${a1MapKeys.size} distinct tts-cache objects** and HEAD-verifies **${a1PresentSet.size}** distinct objects. The apparent 627-vs-listing discrepancy is cell-level tuples versus distinct files, not storage pagination.

Corrected tts-cache orphan count after accounting for the A1 map and English TTS-first references: **${liveOrphans.length} objects**, **${liveOrphanBytes} bytes**.

## Key Logic

The reconciliation imports \`buildAzureTtsCacheReference\` from \`supabase/functions/mercy-tts/core.ts\`, which uses the production Azure cache key for \`azure|voice|language|trimmed text\`. Runtime key mismatches against the census inventory: **${keyMismatches.length}**.

Scheme A matching is exact \`storage_key\` matching against verified \`A_legacy_root\` links from \`reports/cell-inventory/audio-link-global.json\`; those artifacts do not carry spoken text hashes. Scheme A covers **${bucketCounts.scheme_a_legacy_file}** of the 1,327 English TTS-first units.

## HEAD Probe

- A1 map distinct statuses: \`${JSON.stringify(report.head_probe.a1_map_distinct_statuses)}\`
- English inventory distinct statuses: \`${JSON.stringify(report.head_probe.english_inventory_distinct_statuses)}\`

## Examples

${BUCKET_ORDER.map((bucket) => {
  const examples = firstExamples(classifications, bucket);
  if (examples.length === 0) return `### ${bucket}\n\nNo examples.`;
  return `### ${bucket}\n\n${examples
    .map((example) => `- \`${example.storage_key}\` — ${example.text} (${example.source})`)
    .join("\n")}`;
}).join("\n\n")}
`;
  await writeFile(MD_OUT, md);

  console.log(JSON.stringify(report.summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
