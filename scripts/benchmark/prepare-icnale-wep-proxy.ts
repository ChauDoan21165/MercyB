import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

type CliOptions = {
  source: string;
  out: string;
  seed: number;
  limit: number;
};

type EssaySentence = {
  id: string;
  country: string;
  task: string;
  cefr: string;
  text: string;
};

type ProxyJsonlRecord = {
  id: string;
  corpus: "icnale-wep";
  group: "vn_l1" | "non_vn_l1_baseline";
  text: string;
  reference_text: string;
};

const COUNTRY_DIRS = new Set(["BGD", "BRN", "IND", "KHM", "LAO", "MMR", "MYS", "NPL", "VNM"]);
const DEFAULT_SOURCE = "benchmark-data/icnale/ICNALE_WEP_0.7_202603";

export function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    source: DEFAULT_SOURCE,
    out: "benchmark-data/icnale/proxy.jsonl",
    seed: 20260712,
    limit: 5000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag === "--source") {
      options.source = requireValue(flag, value);
      index += 1;
    } else if (flag === "--out") {
      options.out = requireValue(flag, value);
      index += 1;
    } else if (flag === "--seed") {
      options.seed = Number.parseInt(requireValue(flag, value), 10);
      index += 1;
    } else if (flag === "--limit") {
      options.limit = Number.parseInt(requireValue(flag, value), 10);
      index += 1;
    } else if (flag === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${flag}`);
    }
  }

  if (!Number.isFinite(options.seed)) throw new Error("--seed must be an integer");
  if (!Number.isFinite(options.limit) || options.limit < 1 || options.limit > 5000) {
    throw new Error("--limit must be between 1 and 5000");
  }
  return options;
}

export function prepareIcnaleWepProxy(options: CliOptions): {
  outputPath: string;
  records: number;
  vnSentences: number;
  baselineSentences: number;
} {
  const classifiedRoot = join(options.source, "WEP_1_Classified_Unmerged");
  const essays = collectSentences(classifiedRoot);
  const vn = essays.filter((sentence) => sentence.country === "VNM");
  const baseline = essays.filter((sentence) => sentence.country !== "VNM");
  if (vn.length === 0) throw new Error(`No VNM sentences found under ${classifiedRoot}`);
  if (baseline.length === 0) throw new Error(`No non-VNM baseline sentences found under ${classifiedRoot}`);

  const baselineByKey = groupBy(baseline, (sentence) => `${sentence.task}:${sentence.cefr}`);
  const baselineByTask = groupBy(baseline, (sentence) => sentence.task);
  const sortedBaselineByKey = sortGroups(baselineByKey, options.seed);
  const sortedBaselineByTask = sortGroups(baselineByTask, options.seed);
  const allBaseline = deterministicSample(baseline, baseline.length, options.seed);

  const vnRecords = vn.map((sentence) => toRecord(sentence, "vn_l1", chooseReference({
    sentence,
    exactPool: sortedBaselineByKey[`${sentence.task}:${sentence.cefr}`],
    taskPool: sortedBaselineByTask[sentence.task],
    fallbackPool: allBaseline,
    seed: options.seed,
  })));

  const baselineRecords = baseline.map((sentence) => toRecord(sentence, "non_vn_l1_baseline", chooseReference({
    sentence,
    exactPool: sortedBaselineByKey[`${sentence.task}:${sentence.cefr}`],
    taskPool: sortedBaselineByTask[sentence.task],
    fallbackPool: allBaseline,
    seed: options.seed,
  })));

  const records = deterministicSample([...vnRecords, ...baselineRecords], options.limit, options.seed);
  mkdirSync(dirname(options.out), { recursive: true });
  writeFileSync(options.out, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`);

  return {
    outputPath: options.out,
    records: records.length,
    vnSentences: vn.length,
    baselineSentences: baseline.length,
  };
}

function requireValue(flag: string, value: string | undefined): string {
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
  return value;
}

function printHelp(): void {
  console.log(`Usage:
  npx tsx scripts/benchmark/prepare-icnale-wep-proxy.ts \\
    --source benchmark-data/icnale/ICNALE_WEP_0.7_202603 \\
    --out benchmark-data/icnale/proxy.jsonl \\
    --seed 20260712 --limit 5000`);
}

function collectSentences(root: string): EssaySentence[] {
  const files = walk(root).filter((path) => path.endsWith(".txt"));
  return files.flatMap((path) => {
    const metadata = parseFileMetadata(path);
    if (!metadata || !COUNTRY_DIRS.has(metadata.country)) return [];
    const text = readCorpusText(path);
    return splitSentences(text).map((sentence, index) => ({
      id: `${metadata.id}:s${String(index + 1).padStart(3, "0")}`,
      country: metadata.country,
      task: metadata.task,
      cefr: metadata.cefr,
      text: sentence,
    }));
  });
}

function walk(root: string): string[] {
  return readdirSync(root).flatMap((entry) => {
    const path = join(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return walk(path);
    if (stat.isFile()) return [path];
    return [];
  });
}

function parseFileMetadata(path: string): {
  id: string;
  country: string;
  task: string;
  cefr: string;
} | null {
  const name = basename(path, ".txt");
  const match = /^WEP_([A-Z]{3})_(PTJ|SMK)0?_\d+_([A-Z]\d_\d)$/.exec(name);
  if (!match) return null;
  return {
    id: name,
    country: match[1],
    task: match[2],
    cefr: match[3],
  };
}

function readCorpusText(path: string): string {
  return readFileSync(path, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/^"+|"+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitSentences(text: string): string[] {
  const sentences: string[] = [];
  let start = 0;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char !== "." && char !== "!" && char !== "?") continue;
    let end = index + 1;
    while (end < text.length && /["')\]]/.test(text[end])) end += 1;
    sentences.push(text.slice(start, end));
    start = end;
  }
  if (start < text.length) sentences.push(text.slice(start));

  return sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 4);
}

function chooseReference(input: {
  sentence: EssaySentence;
  exactPool: EssaySentence[] | undefined;
  taskPool: EssaySentence[] | undefined;
  fallbackPool: EssaySentence[];
  seed: number;
}): string {
  const pool = input.exactPool?.length
    ? input.exactPool
    : input.taskPool?.length
      ? input.taskPool
      : input.fallbackPool;
  if (pool.length === 0) return input.sentence.text;
  let index = hash(`${input.seed}:${input.sentence.id}`) % pool.length;
  if (pool.length > 1 && pool[index]?.id === input.sentence.id) {
    index = (index + 1) % pool.length;
  }
  return pool[index]?.text ?? input.sentence.text;
}

function toRecord(
  sentence: EssaySentence,
  group: ProxyJsonlRecord["group"],
  referenceText: string,
): ProxyJsonlRecord {
  return {
    id: sentence.id,
    corpus: "icnale-wep",
    group,
    text: sentence.text,
    reference_text: referenceText,
  };
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const group = key(item);
    groups[group] = groups[group] ?? [];
    groups[group].push(item);
  }
  return groups;
}

function sortGroups<T extends { id: string }>(
  groups: Record<string, T[]>,
  seed: number,
): Record<string, T[]> {
  const sorted: Record<string, T[]> = {};
  for (const [key, records] of Object.entries(groups)) {
    sorted[key] = deterministicSample(records, records.length, seed);
  }
  return sorted;
}

export function deterministicSample<T extends { id: string }>(
  records: T[],
  limit: number,
  seed: number,
): T[] {
  return records
    .map((record) => ({ record, key: hash(`${seed}:${record.id}`) }))
    .sort((a, b) => a.key - b.key || a.record.id.localeCompare(b.record.id))
    .slice(0, Math.max(0, limit))
    .map(({ record }) => record);
}

function hash(value: string): number {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = prepareIcnaleWepProxy(parseArgs(process.argv.slice(2)));
  console.log(
    `[icnale] wrote ${result.records} proxy rows to ${relative(process.cwd(), result.outputPath)} ` +
      `(source sentences: vn_l1=${result.vnSentences}, non_vn_l1_baseline=${result.baselineSentences})`,
  );
}
