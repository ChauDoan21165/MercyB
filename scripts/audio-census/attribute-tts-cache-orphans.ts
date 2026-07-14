import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import ts from "typescript";

import { buildAzureTtsCacheReference } from "../../supabase/functions/mercy-tts/core.ts";
import { azureVoiceFor } from "../../supabase/functions/mercy-tts/azureProvider.ts";
import { englishTextForTts } from "../../src/lib/tutor/englishOnlyTts.ts";

type CorrectedOrphan = {
  storage_key: string;
  bytes: number | null;
  updated_at?: string;
};

type ReconcileClassification = {
  bucket?: string;
  language?: string;
  voice?: string;
  text?: string;
  source?: string;
};

type EnReconcile = {
  classifications?: ReconcileClassification[];
  corrected_orphans?: CorrectedOrphan[];
};

type AudioMapTuple = {
  language?: string;
  voice?: string;
  text?: string;
  role?: string;
};

type AudioMapCell = {
  cell_id?: string;
  address_hash?: string;
  tuples?: AudioMapTuple[];
};

type AudioMap = {
  cells?: AudioMapCell[];
};

type Candidate = {
  text: string;
  language: string;
  voice: string;
  source: string;
  provenance: string;
  commit: string;
  tier: "current-reconcile" | "current-audio-map" | "current-source" | "historical-source";
};

type Attribution = {
  storage_key: string;
  hash: string;
  bytes: number | null;
  updated_at?: string;
  status: "matched" | "unattributed";
  classification: "matched_current_content" | "matched_stale_content" | "unattributed_dynamic";
  text: string | null;
  language: string | null;
  voice: string | null;
  last_seen_commit: string | null;
  source: string | null;
  provenance: string | null;
  candidate_tier: Candidate["tier"] | null;
  additional_match_count: number;
};

const ROOT = process.cwd();
const INPUT_JSON = "reports/audio-census/en-reconcile.json";
const OUTPUT_JSON = "reports/audio-census/orphan-attribution.json";
const OUTPUT_MD = "reports/audio-census/orphan-attribution.md";
const AUDIO_MAP_DIR = "reports/cell-inventory";
const SOURCE_EXTENSIONS = /\.(json|ts|tsx|mjs|md)$/;
const MAX_HISTORICAL_CHANGED_FILES = 120;
const SUPPORTED_LANGUAGES = ["en", "vi", "fr", "zh", "de", "ja", "ko", "es"] as const;
const CURRENT_SOURCE_ROOTS = [
  "src/languages",
  "src/data",
  "src/lib/tutor",
  "src/lib/pronunciation",
  "src/lib/teacher-mercy",
  "src/components/speech",
  "src/components/mercy-guide",
  "src/components/ai-tutor",
  "src/pages/SpeechDrillPage.tsx",
  "src/pages/AiTutor.tsx",
  "reports/cell-inventory",
  "public/data",
];

function git(args: string[], maxBuffer = 64 * 1024 * 1024): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer }).trim();
}

function gitMaybe(args: string[], maxBuffer = 64 * 1024 * 1024): string | null {
  const result = spawnSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer,
    stdio: ["ignore", "pipe", "ignore"],
  });
  if (result.status !== 0) return null;
  return String(result.stdout ?? "").trim();
}

async function readJson<T>(relativePath: string): Promise<T> {
  return JSON.parse(await readFile(resolve(ROOT, relativePath), "utf8")) as T;
}

function normalizeText(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isSpeakableText(text: string): boolean {
  if (!text || text.length > 2000) return false;
  if (!/[\p{L}\p{N}]/u.test(text)) return false;
  if (/^https?:\/\//i.test(text)) return false;
  if (/^(src|reports|public|scripts|supabase)\//.test(text)) return false;
  if (/^[./@#:_a-z0-9-]+$/i.test(text) && !/\s/.test(text)) return false;
  return true;
}

function textVariants(value: unknown): string[] {
  const text = normalizeText(value);
  const variants = new Set<string>();
  if (isSpeakableText(text)) variants.add(text);
  const english = englishTextForTts(text);
  if (isSpeakableText(english)) variants.add(english);
  return Array.from(variants);
}

function collectJsonStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectJsonStrings(item, out));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectJsonStrings(item, out));
  }
}

function collectTsStrings(fileName: string, sourceText: string): string[] {
  const out: string[] = [];
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) out.push(node.text);
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return out;
}

function collectStrings(fileName: string, sourceText: string): string[] {
  if (fileName.endsWith(".json")) {
    try {
      const out: string[] = [];
      collectJsonStrings(JSON.parse(sourceText), out);
      return out;
    } catch {
      return [];
    }
  }
  if (fileName.endsWith(".ts") || fileName.endsWith(".tsx") || fileName.endsWith(".mjs")) {
    return collectTsStrings(fileName, sourceText);
  }
  if (fileName.endsWith(".md")) return sourceText.split(/\r?\n/);
  return [];
}

function voicePairs(): Array<{ language: string; voice: string; provenance: string }> {
  const pairs = new Map<string, { language: string; voice: string; provenance: string }>();
  for (const language of SUPPORTED_LANGUAGES) {
    const voice = azureVoiceFor(language).name;
    pairs.set(`${language}\0${voice}`, { language, voice, provenance: "current azureVoiceFor(language)" });
  }
  const commits = git(["log", "--format=%H", "--", "supabase/functions/mercy-tts/azureProvider.ts"])
    .split(/\r?\n/)
    .filter(Boolean);
  const pattern = /([a-z]{2})\s*:\s*\{[^}]*name\s*:\s*["']([^"']+)["']/g;
  for (const commit of commits) {
    const source = gitMaybe(["show", `${commit}:supabase/functions/mercy-tts/azureProvider.ts`]);
    if (!source) continue;
    for (const match of source.matchAll(pattern)) {
      const language = match[1] ?? "";
      const voice = match[2] ?? "";
      if (!language || !voice) continue;
      const key = `${language}\0${voice}`;
      if (!pairs.has(key)) pairs.set(key, { language, voice, provenance: `azureProvider.ts@${commit}` });
    }
  }
  return Array.from(pairs.values()).sort((a, b) => `${a.language}:${a.voice}`.localeCompare(`${b.language}:${b.voice}`));
}

async function addCandidate(
  byHash: Map<string, Candidate[]>,
  targetHashes: Set<string>,
  seenTargetCandidates: Set<string>,
  candidate: Candidate,
): Promise<void> {
  const reference = await buildAzureTtsCacheReference({ text: candidate.text, language: candidate.language });
  if (!targetHashes.has(reference.sha256)) return;
  if (reference.voice !== candidate.voice) return;
  const key = `${reference.sha256}\0${candidate.text}\0${candidate.language}\0${candidate.source}\0${candidate.commit}`;
  if (seenTargetCandidates.has(key)) return;
  seenTargetCandidates.add(key);
  const candidates = byHash.get(reference.sha256) ?? [];
  candidates.push(candidate);
  byHash.set(reference.sha256, candidates);
}

async function addTextForLanguages(
  byHash: Map<string, Candidate[]>,
  targetHashes: Set<string>,
  seenTargetCandidates: Set<string>,
  text: unknown,
  source: string,
  provenance: string,
  commit: string,
  tier: Candidate["tier"],
  pairs: Array<{ language: string; voice: string; provenance: string }>,
): Promise<void> {
  for (const variant of textVariants(text)) {
    for (const pair of pairs) {
      await addCandidate(byHash, targetHashes, seenTargetCandidates, {
        text: variant,
        language: pair.language,
        voice: pair.voice,
        source,
        provenance: `${provenance}; ${pair.provenance}`,
        commit,
        tier,
      });
    }
  }
}

async function addReconcileCandidates(
  reconcile: EnReconcile,
  commit: string,
  byHash: Map<string, Candidate[]>,
  targetHashes: Set<string>,
  seenTargetCandidates: Set<string>,
): Promise<void> {
  for (const row of reconcile.classifications ?? []) {
    const language = normalizeText(row.language) || "en";
    await addCandidate(byHash, targetHashes, seenTargetCandidates, {
      text: normalizeText(row.text),
      language,
      voice: normalizeText(row.voice) || azureVoiceFor(language).name,
      source: row.source ?? "reports/audio-census/en-reconcile.json:classifications",
      provenance: `en-reconcile classification bucket=${row.bucket ?? "unknown"}`,
      commit,
      tier: "current-reconcile",
    });
  }
}

async function addAudioMapCandidates(
  commit: string,
  byHash: Map<string, Candidate[]>,
  targetHashes: Set<string>,
  seenTargetCandidates: Set<string>,
): Promise<void> {
  const files = git(["ls-files", `${AUDIO_MAP_DIR}/audio-map-*.json`])
    .split(/\r?\n/)
    .filter(Boolean);
  for (const file of files) {
    const parsed = await readJson<AudioMap>(file);
    for (const cell of parsed.cells ?? []) {
      for (const tuple of cell.tuples ?? []) {
        const language = normalizeText(tuple.language) || "en";
        await addCandidate(byHash, targetHashes, seenTargetCandidates, {
          text: normalizeText(tuple.text),
          language,
          voice: normalizeText(tuple.voice) || azureVoiceFor(language).name,
          source: `${file}:${cell.cell_id ?? cell.address_hash ?? "unknown-cell"}`,
          provenance: `audio map tuple role=${tuple.role ?? "unknown"} address_hash=${cell.address_hash ?? "n/a"}`,
          commit,
          tier: "current-audio-map",
        });
      }
    }
  }
}

function trackedFiles(roots: readonly string[]): string[] {
  const out = new Set<string>();
  for (const root of roots) {
    if (!existsSync(resolve(ROOT, root))) continue;
    git(["ls-files", root])
      .split(/\r?\n/)
      .filter((file) => SOURCE_EXTENSIONS.test(file))
      .forEach((file) => out.add(file));
  }
  return Array.from(out).sort();
}

function shouldScanCurrentFile(file: string): boolean {
  if (file.startsWith("reports/cell-inventory/")) {
    if (/\/audio-map-[^/]+\.json$/.test(file)) return true;
    if (/\/[^/]*inventory[^/]*\.json$/.test(file)) return true;
    return false;
  }
  try {
    return statSync(resolve(ROOT, file)).size <= 1_500_000;
  } catch {
    return false;
  }
}

async function addCurrentSourceCandidates(
  commit: string,
  byHash: Map<string, Candidate[]>,
  targetHashes: Set<string>,
  seenTargetCandidates: Set<string>,
  pairs: Array<{ language: string; voice: string; provenance: string }>,
): Promise<void> {
  const files = trackedFiles(CURRENT_SOURCE_ROOTS).filter(shouldScanCurrentFile);
  let processed = 0;
  for (const file of files) {
    processed += 1;
    if (processed % 250 === 0) {
      console.log(`[orphan-attribution] current files ${processed}/${files.length}; matched=${Array.from(targetHashes).filter((hash) => byHash.has(hash)).length}/${targetHashes.size}`);
    }
    const sourceText = await readFile(resolve(ROOT, file), "utf8");
    for (const text of collectStrings(file, sourceText)) {
      await addTextForLanguages(byHash, targetHashes, seenTargetCandidates, text, file, "current tracked source string", commit, "current-source", pairs);
    }
  }
}

function sourcePathFromReconcileSource(source: unknown): string | null {
  const match = normalizeText(source).match(/\b((?:src|reports|public|scripts)\/[^:;\s]+)/);
  if (!match?.[1]) return null;
  return SOURCE_EXTENSIONS.test(match[1]) ? match[1] : null;
}

function historyPathspecs(reconcile: EnReconcile): string[] {
  const out = new Set<string>([
    "src/languages",
    "reports/cell-inventory",
    "reports/audio-census",
    "public/data",
  ]);
  for (const row of reconcile.classifications ?? []) {
    const file = sourcePathFromReconcileSource(row.source);
    if (file) out.add(file);
  }
  out.add("src/pages/AiTutor.tsx");
  out.add("src/components/mercy-guide/MercySpeakTab.tsx");
  out.add("src/pages/SpeechDrillPage.tsx");
  out.add("src/lib/teacher-mercy");
  return Array.from(out).sort();
}

function pathMatches(file: string, pathspecs: readonly string[]): boolean {
  return pathspecs.some((root) => file === root || file.startsWith(`${root}/`));
}

function showFileAt(rev: string, file: string): string | null {
  const size = Number(gitMaybe(["cat-file", "-s", `${rev}:${file}`]) ?? 0);
  if (Number.isFinite(size) && size > 4_000_000 && !file.includes("audio-map-")) return null;
  return gitMaybe(["show", `${rev}:${file}`], 64 * 1024 * 1024);
}

async function addHistoricalCandidates(
  byHash: Map<string, Candidate[]>,
  targetHashes: Set<string>,
  seenTargetCandidates: Set<string>,
  pairs: Array<{ language: string; voice: string; provenance: string }>,
  pathspecs: readonly string[],
): Promise<string[]> {
  const skippedLargeCommits: string[] = [];
  const commits = git(["log", "--format=%H", "--", ...pathspecs])
    .split(/\r?\n/)
    .filter(Boolean);
  let processed = 0;
  for (const commit of commits) {
    const unresolved = Array.from(targetHashes).filter((hash) => !byHash.has(hash));
    if (unresolved.length === 0) break;
    processed += 1;
    if (processed % 10 === 0) {
      console.log(`[orphan-attribution] historical commits ${processed}/${commits.length}; unresolved=${unresolved.length}`);
    }
    const files = git(["diff-tree", "--no-commit-id", "--name-only", "-r", commit])
      .split(/\r?\n/)
      .filter((file) => SOURCE_EXTENSIONS.test(file))
      .filter((file) => pathMatches(file, pathspecs));
    if (files.length > MAX_HISTORICAL_CHANGED_FILES) {
      skippedLargeCommits.push(`${commit}:${files.length}`);
      console.log(`[orphan-attribution] historical commit skipped ${commit.slice(0, 8)} changed_files=${files.length}`);
      continue;
    }
    for (const file of files) {
      for (const rev of [commit, `${commit}^`]) {
        const sourceText = showFileAt(rev, file);
        if (!sourceText) continue;
        for (const text of collectStrings(file, sourceText)) {
          await addTextForLanguages(byHash, targetHashes, seenTargetCandidates, text, file, `historical source string at ${rev}`, rev, "historical-source", pairs);
        }
      }
    }
  }
  return skippedLargeCommits;
}

function choosePrimary(candidates: Candidate[]): Candidate {
  const rank: Record<Candidate["tier"], number> = {
    "current-reconcile": 0,
    "current-audio-map": 1,
    "current-source": 2,
    "historical-source": 3,
  };
  return [...candidates].sort((a, b) => rank[a.tier] - rank[b.tier] || a.source.localeCompare(b.source))[0] as Candidate;
}

function renderMarkdown(input: {
  generatedAt: string;
  commit: string;
  records: Attribution[];
  pairs: Array<{ language: string; voice: string; provenance: string }>;
}): string {
  const byClass = (classification: Attribution["classification"]) => input.records.filter((record) => record.classification === classification);
  const bytes = (records: Attribution[]) => records.reduce((sum, record) => sum + (record.bytes ?? 0), 0);
  const matchedRows = input.records
    .filter((record) => record.status === "matched")
    .map((record) => `| \`${record.hash}\` | ${record.classification} | ${record.language} | ${record.voice} | ${record.text?.replaceAll("|", "\\|")} | ${record.source} | ${record.last_seen_commit} |`);
  const unattributedRows = input.records
    .filter((record) => record.status === "unattributed")
    .map((record) => `| \`${record.hash}\` | ${record.bytes ?? "unknown"} | ${record.updated_at ?? "unknown"} |`);
  return [
    "# English tts-cache Orphan Attribution",
    "",
    `Generated: ${input.generatedAt}`,
    `Commit: ${input.commit}`,
    "",
    "Input: `reports/audio-census/en-reconcile.json` corrected orphan set. Read-only: no deletion, no synthesis, no bucket listing.",
    "",
    "## Method",
    "",
    "- Candidate key generation imports `buildAzureTtsCacheReference` from `supabase/functions/mercy-tts/core.ts`.",
    "- Candidate tiers: MR 2702 reconcile classifications, committed audio maps, current speakable source strings, then historical source strings and parent versions.",
    "- Historical `azureProvider.ts` contains no alternate voice names beyond the current resolver map; voice pairs are listed below.",
    "",
    "## Summary",
    "",
    "| class | files | bytes |",
    "| --- | ---: | ---: |",
    `| matched-current-content | ${byClass("matched_current_content").length} | ${bytes(byClass("matched_current_content"))} |`,
    `| matched-stale-content | ${byClass("matched_stale_content").length} | ${bytes(byClass("matched_stale_content"))} |`,
    `| unattributed-presumed-dynamic | ${byClass("unattributed_dynamic").length} | ${bytes(byClass("unattributed_dynamic"))} |`,
    `| total | ${input.records.length} | ${bytes(input.records)} |`,
    "",
    "## Voice Pairs",
    "",
    ...input.pairs.map((pair) => `- ${pair.language} / ${pair.voice} — ${pair.provenance}`),
    "",
    "## Matched",
    "",
    "| hash | class | lang | voice | text | source | last seen commit |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...(matchedRows.length ? matchedRows : ["| none | n/a | n/a | n/a | n/a | n/a | n/a |"]),
    "",
    "## Unattributed",
    "",
    "| hash | bytes | updated_at |",
    "| --- | ---: | --- |",
    ...(unattributedRows.length ? unattributedRows : ["| none | 0 | n/a |"]),
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  const generatedAt = new Date().toISOString();
  const commit = git(["rev-parse", "HEAD"]);
  const reconcile = await readJson<EnReconcile>(INPUT_JSON);
  const correctedOrphans = (reconcile.corrected_orphans ?? []) as CorrectedOrphan[];
  const targetHashes = new Set(correctedOrphans.map((orphan) => orphan.storage_key.match(/tts-cache\/([a-f0-9]{64})\.mp3$/)?.[1]).filter(Boolean) as string[]);
  if (correctedOrphans.length !== 57 || targetHashes.size !== 57) {
    throw new Error(`Expected 57 corrected orphans, got rows=${correctedOrphans.length} hashes=${targetHashes.size}`);
  }
  const byHash = new Map<string, Candidate[]>();
  const seenTargetCandidates = new Set<string>();
  const pairs = voicePairs();

  console.log(`[orphan-attribution] corrected_orphans=${correctedOrphans.length}`);
  await addReconcileCandidates(reconcile, commit, byHash, targetHashes, seenTargetCandidates);
  await addAudioMapCandidates(commit, byHash, targetHashes, seenTargetCandidates);
  await addCurrentSourceCandidates(commit, byHash, targetHashes, seenTargetCandidates, pairs);
  console.log(`[orphan-attribution] after current matched=${Array.from(targetHashes).filter((hash) => byHash.has(hash)).length}/${targetHashes.size}`);
  const skippedLargeHistoricalCommits = await addHistoricalCandidates(byHash, targetHashes, seenTargetCandidates, pairs, historyPathspecs(reconcile));

  const records: Attribution[] = correctedOrphans
    .map((orphan): Attribution => {
      const hash = orphan.storage_key.match(/tts-cache\/([a-f0-9]{64})\.mp3$/)?.[1] ?? "";
      const candidates = byHash.get(hash) ?? [];
      if (candidates.length === 0) {
        return {
          storage_key: orphan.storage_key,
          hash,
          bytes: orphan.bytes,
          updated_at: orphan.updated_at,
          status: "unattributed",
          classification: "unattributed_dynamic",
          text: null,
          language: null,
          voice: null,
          last_seen_commit: null,
          source: null,
          provenance: null,
          candidate_tier: null,
          additional_match_count: 0,
        };
      }
      const primary = choosePrimary(candidates);
      return {
        storage_key: orphan.storage_key,
        hash,
        bytes: orphan.bytes,
        updated_at: orphan.updated_at,
        status: "matched",
        classification: primary.tier === "historical-source" ? "matched_stale_content" : "matched_current_content",
        text: primary.text,
        language: primary.language,
        voice: primary.voice,
        last_seen_commit: primary.commit,
        source: primary.source,
        provenance: primary.provenance,
        candidate_tier: primary.tier,
        additional_match_count: Math.max(0, candidates.length - 1),
      };
    })
    .sort((a, b) => a.hash.localeCompare(b.hash));

  const summary = {
    total_orphans: records.length,
    total_bytes: records.reduce((sum, record) => sum + (record.bytes ?? 0), 0),
    matched_current_content: {
      files: records.filter((record) => record.classification === "matched_current_content").length,
      bytes: records.filter((record) => record.classification === "matched_current_content").reduce((sum, record) => sum + (record.bytes ?? 0), 0),
    },
    matched_stale_content: {
      files: records.filter((record) => record.classification === "matched_stale_content").length,
      bytes: records.filter((record) => record.classification === "matched_stale_content").reduce((sum, record) => sum + (record.bytes ?? 0), 0),
    },
    unattributed_presumed_dynamic: {
      files: records.filter((record) => record.classification === "unattributed_dynamic").length,
      bytes: records.filter((record) => record.classification === "unattributed_dynamic").reduce((sum, record) => sum + (record.bytes ?? 0), 0),
    },
  };

  await mkdir(resolve(ROOT, "reports/audio-census"), { recursive: true });
  await writeFile(resolve(ROOT, OUTPUT_JSON), `${JSON.stringify({
    metadata: {
      generated_at: generatedAt,
      commit,
      input: INPUT_JSON,
      read_only: true,
      no_deletion: true,
      no_synthesis: true,
      key_logic_import: "supabase/functions/mercy-tts/core.ts#buildAzureTtsCacheReference",
      corrected_orphan_source: "MR 2702 en-reconcile corrected_orphans",
      max_historical_changed_files: MAX_HISTORICAL_CHANGED_FILES,
      skipped_large_historical_commits: skippedLargeHistoricalCommits,
    },
    summary,
    voice_pairs: pairs,
    orphans: records,
  }, null, 2)}\n`, "utf8");
  await writeFile(resolve(ROOT, OUTPUT_MD), `${renderMarkdown({ generatedAt, commit, records, pairs })}\n`, "utf8");
  console.log(`[orphan-attribution] matched_current_content=${summary.matched_current_content.files}/${records.length} bytes=${summary.matched_current_content.bytes}`);
  console.log(`[orphan-attribution] matched_stale_content=${summary.matched_stale_content.files}/${records.length} bytes=${summary.matched_stale_content.bytes}`);
  console.log(`[orphan-attribution] unattributed_presumed_dynamic=${summary.unattributed_presumed_dynamic.files}/${records.length} bytes=${summary.unattributed_presumed_dynamic.bytes}`);
}

main().catch((error) => {
  console.error("[orphan-attribution] failed:", error);
  process.exit(1);
});
