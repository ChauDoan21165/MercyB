#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MAP_PATH = "reports/cell-inventory/audio-map-vn-en-a1.json";
const REPORT_DIR = "reports/cell-inventory";
const SUPABASE_URL_DEFAULT = "https://buemdfxyhxunzpgdoqin.supabase.co";
const FUNCTION_NAME = "mercy-tts";
const ENGLISH_VOICE_ID = "hpp4J3VqNfWAUOO0d1Us";
const THROTTLE_MS = 1000;
const MAX_CONSECUTIVE_FAILURES = 10;
const HEAD_TIMEOUT_MS = 8000;
const INVOKE_TIMEOUT_MS = 30000;
const HEAD_CONCURRENCY = 20;

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function writeText(relativePath, text) {
  fs.writeFileSync(path.join(ROOT, relativePath), text);
}

function loadEnvFile(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) return;
  for (const line of fs.readFileSync(absolutePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isHit(status) {
  return status >= 200 && status < 300;
}

async function headUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEAD_TIMEOUT_MS);
  try {
    const response = await fetch(url, { method: "HEAD", signal: controller.signal });
    return { ok: true, status: response.status, statusText: response.statusText };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      statusText: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function invokeMercyTts({ tuple, supabaseUrl, anonKey }) {
  const endpoint = `${supabaseUrl.replace(/\/+$/, "")}/functions/v1/${FUNCTION_NAME}`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (anonKey) {
    headers.apikey = anonKey;
    headers.Authorization = `Bearer ${anonKey}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), INVOKE_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        text: tuple.text,
        voice_id: tuple.language === "en" ? ENGLISH_VOICE_ID : undefined,
        language: tuple.language,
      }),
    });
    const body = await response.text();
    let parsed = null;
    try {
      parsed = body ? JSON.parse(body) : null;
    } catch {
      parsed = null;
    }
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      provider: parsed?.provider ?? null,
      cached: parsed?.cached ?? null,
      fallbackReason: parsed?.fallback_reason ?? null,
      body: body.slice(0, 500),
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      statusText: err instanceof Error ? err.message : String(err),
      provider: null,
      cached: null,
      fallbackReason: null,
      body: "",
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  });
  await Promise.all(workers);
  return results;
}

async function countHeadHits(tuples) {
  const results = await mapWithConcurrency(tuples, HEAD_CONCURRENCY, (row) => headUrl(row.tuple.url));
  return results.filter((result) => isHit(result.status)).length;
}

function flattenTuples(audioMap) {
  const rows = [];
  for (const cell of audioMap.cells ?? []) {
    for (const tuple of cell.tuples ?? []) {
      rows.push({
        cell_id: cell.cell_id,
        cell_type: cell.cell_type,
        address: cell.address,
        tuple,
      });
    }
  }
  return rows.sort((a, b) => {
    if (a.tuple.role !== b.tuple.role) {
      if (a.tuple.role === "english_target") return -1;
      if (b.tuple.role === "english_target") return 1;
    }
    return a.cell_id.localeCompare(b.cell_id);
  });
}

function renderReport({
  audioMap,
  startedAt,
  finishedAt,
  beforeHits,
  afterHits,
  tuples,
  failures,
  skippedReason,
  aborted,
}) {
  const missBefore = tuples.length - beforeHits;
  const missAfter = tuples.length - afterHits;
  const failureText = failures.length
    ? failures
        .map((failure, index) =>
          `${index + 1}. \`${failure.cell_id}\` ${failure.tuple.role} ${failure.tuple.language}/${failure.tuple.voice} - ${failure.phase}: ${failure.status} ${failure.statusText}${failure.fallbackReason ? ` (${failure.fallbackReason})` : ""}`
        )
        .join("\n")
    : "_None._";

  return `# Vietnamese->English A1 Audio Warmup Status

Started: ${startedAt}

Finished: ${finishedAt}

Source map: \`${MAP_PATH}\`

## Runtime Tuple Finding

English target replay is mapped to finalized Azure TTS cache entries using \`language=en\`, \`voice=en-US-AvaMultilingualNeural\`, and the English source text field for each cell type: \`phrase.english\` for Vocabulary Item cells and \`dialogue.english\` for Dialogue Turn cells.

Vietnamese lesson audio is not emitted as a \`tts-cache\` tuple in this run. The current Vietnamese A1 lesson UI plays pre-generated \`room-audio\` lesson bundle keys through \`LessonAudioButton\` / \`useAudioUrl\`, and the voice config says no production surface calls \`fetchCloudTtsUrl({ language: 'vi' })\` today.

## Code Path Quotes

\`src/lib/pronunciation/tts.ts\`:

\`\`\`ts
const cloud = await fetchCloudTtsUrl({ text, language: 'en' });
\`\`\`

\`src/lib/mercyVoice.ts\`:

\`\`\`ts
supabase.functions.invoke("mercy-tts", {
  body: { text, voice_id, language },
});
\`\`\`

\`src/config/mercyVoices.ts\`:

\`\`\`ts
export const ENGLISH_VOICE_ID = ENGLISH_VOICE_IDS.us;
us: "hpp4J3VqNfWAUOO0d1Us"
\`\`\`

\`supabase/functions/mercy-tts/core.ts\`:

\`\`\`ts
azureCacheHash = await sha256Hex(\`azure|$\{azureVoice.name}|$\{language}|$\{text}\`);
\`\`\`

\`supabase/functions/mercy-tts/azureProvider.ts\`:

\`\`\`ts
en: { locale: "en-US", name: "en-US-AvaMultilingualNeural" }
\`\`\`

\`src/languages/vietnamese/normalize.ts\`:

\`\`\`ts
sentences: (lesson.phrases ?? []).map((phrase) => ({
  native: phrase.vietnamese,
  en: phrase.english,
}))
\`\`\`

\`src/components/languages/LessonRenderer.tsx\`:

\`\`\`tsx
lessonAudioKey(lesson.audioBase, {
  kind: "vocab",
  index: vi + 1,
})
\`\`\`

## Coverage

| Probe | Count |
| --- | ---: |
| Total mapped cells | ${audioMap.summary?.cells ?? 0} |
| Total mapped tuples | ${tuples.length} |
| English target tuples | ${audioMap.summary?.english_target_tuples ?? tuples.length} |
| Vietnamese TTS-cache tuples | ${audioMap.summary?.vietnamese_tts_cache_tuples ?? 0} |
| Addressable before warmup | ${beforeHits} |
| Missing before warmup | ${missBefore} |
| Addressable after warmup | ${afterHits} |
| Missing after warmup | ${missAfter} |
| Failures | ${failures.length} |

${skippedReason ? `Warmup skipped/stopped reason: ${skippedReason}\n\n` : ""}${aborted ? "Warmup aborted after 10 consecutive failures.\n\n" : ""}Post-run English-audio coverage replacing \`0/627 addressable\`: ${afterHits}/${tuples.length}.

## Failures

${failureText}
`;
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const startedAt = new Date().toISOString();
const audioMap = JSON.parse(readText(MAP_PATH));
const tuples = flattenTuples(audioMap);
const supabaseUrl =
  (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_DEFAULT).trim();
const anonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "").trim();
const reportPath = `${REPORT_DIR}/audio-warmup-status-${todayIsoDate()}.md`;

let beforeHits = 0;
let afterHits = 0;
const failures = [];
let skippedReason = "";
let aborted = false;

beforeHits = await countHeadHits(tuples);

if (!anonKey && beforeHits < tuples.length) {
  skippedReason = "Missing SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY; HEAD probes ran, but invoking the production mercy-tts endpoint requires the same anon auth the app sends.";
} else {
  let consecutiveFailures = 0;
  for (const row of tuples) {
    const before = await headUrl(row.tuple.url);
    if (isHit(before.status)) {
      consecutiveFailures = 0;
      continue;
    }

    await sleep(THROTTLE_MS);
    const invoked = await invokeMercyTts({ tuple: row.tuple, supabaseUrl, anonKey });
    const after = await headUrl(row.tuple.url);

    if (isHit(after.status)) {
      consecutiveFailures = 0;
      continue;
    }

    consecutiveFailures += 1;
    failures.push({
      cell_id: row.cell_id,
      tuple: row.tuple,
      phase: invoked.ok ? "post-invoke-head-miss" : "invoke-failed",
      status: invoked.ok ? after.status : invoked.status,
      statusText: invoked.ok ? after.statusText : invoked.statusText,
      provider: invoked.provider,
      cached: invoked.cached,
      fallbackReason: invoked.fallbackReason,
      body: invoked.body,
    });

    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      aborted = true;
      skippedReason = "10 consecutive warmup failures";
      break;
    }
  }
}

afterHits = await countHeadHits(tuples);

const finishedAt = new Date().toISOString();
writeText(
  reportPath,
  renderReport({
    audioMap,
    startedAt,
    finishedAt,
    beforeHits,
    afterHits,
    tuples,
    failures,
    skippedReason,
    aborted,
  }),
);

console.log(`Wrote ${reportPath}`);
console.log(`English target coverage: ${afterHits}/${tuples.length}`);
if (skippedReason) console.error(skippedReason);
if (aborted || skippedReason) process.exitCode = 2;
