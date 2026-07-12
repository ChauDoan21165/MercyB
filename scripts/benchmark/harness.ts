import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { runViEnL1Detector } from "./detectors.js";

export type AnnotatedRecord = {
  id: string;
  corpus: string;
  learner_l1?: string;
  source: string;
  reference: string;
  gold_tags?: string[];
  gold_error_codes?: string[];
};

export type ProxyRecord = {
  id: string;
  corpus: string;
  group: "vn_l1" | "native_reference";
  text: string;
  reference_text: string;
};

export type BenchmarkOptions = {
  annotatedPath?: string;
  proxyPath?: string;
  outputPath: string;
  reportPath?: string;
  seed: number;
  limit: number;
};

export type BenchmarkResults = {
  generated_at: string;
  seed: number;
  limit_per_track: number;
  detectors: string[];
  annotated: {
    sample_size: number;
    corpus_counts: Record<string, number>;
    per_tag: Record<string, TagMetrics>;
    unmappable_gold_codes: Record<string, number>;
  };
  proxy: {
    sample_size: number;
    corpus_counts: Record<string, number>;
    groups: Record<string, ProxyGroupMetrics>;
  };
};

export type TagMetrics = {
  tp: number;
  fp: number;
  fn: number;
  precision: number | null;
  recall: number | null;
  support: number;
};

export type ProxyGroupMetrics = {
  samples: number;
  detector_fires: number;
  fire_rate: number;
  tags: Record<string, number>;
};

const GOLD_CODE_TO_TAG: Record<string, string> = {
  "M:VERB:SVA": "vi_l1_3rd_person_s",
  "R:VERB:SVA": "vi_l1_3rd_person_s",
  "M:VERB:TENSE": "vi_l1_past_ed",
  "R:VERB:TENSE": "vi_l1_past_ed",
  "M:NOUN:NUM": "vi_l1_plural_s",
  "R:NOUN:NUM": "vi_l1_plural_s",
  "M:AUX": "vi_l1_missing_be",
  "M:DET": "vi_l1_missing_article",
  "R:DET": "vi_l1_missing_article",
  "M:PREP": "vi_l1_preposition_transfer",
  "R:PREP": "vi_l1_preposition_transfer",
  "WO": "vi_l1_adjective_order",
};

export function readJsonl<T>(path: string): T[] {
  const text = readFileSync(path, "utf8");
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line) as T;
      } catch (error) {
        throw new Error(`Invalid JSONL in ${path}:${index + 1}: ${(error as Error).message}`);
      }
    });
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

export function runBenchmark(options: BenchmarkOptions): BenchmarkResults {
  const annotated = options.annotatedPath
    ? deterministicSample(readJsonl<AnnotatedRecord>(options.annotatedPath), options.limit, options.seed)
    : [];
  const proxy = options.proxyPath
    ? deterministicSample(readJsonl<ProxyRecord>(options.proxyPath), options.limit, options.seed)
    : [];

  const results: BenchmarkResults = {
    generated_at: new Date().toISOString(),
    seed: options.seed,
    limit_per_track: options.limit,
    detectors: ["detectL1Error"],
    annotated: evaluateAnnotated(annotated),
    proxy: evaluateProxy(proxy),
  };

  writeJson(options.outputPath, results);
  if (options.reportPath) {
    writeText(options.reportPath, renderReport(results));
  }
  return results;
}

function evaluateAnnotated(records: AnnotatedRecord[]): BenchmarkResults["annotated"] {
  const tags = new Set<string>();
  const rows = records.map((record) => {
    const mapped = mapGoldTags(record);
    const prediction = runViEnL1Detector({
      userAnswer: record.source,
      expectedAnswer: record.reference,
    });
    for (const tag of mapped.tags) tags.add(tag);
    if (prediction.tag) tags.add(prediction.tag);
    return { record, mapped, prediction };
  });

  const perTag: Record<string, TagMetrics> = {};
  for (const tag of [...tags].sort()) {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    for (const row of rows) {
      const gold = row.mapped.tags.has(tag);
      const predicted = row.prediction.tag === tag;
      if (gold && predicted) tp += 1;
      if (!gold && predicted) fp += 1;
      if (gold && !predicted) fn += 1;
    }
    perTag[tag] = {
      tp,
      fp,
      fn,
      precision: tp + fp === 0 ? null : round(tp / (tp + fp)),
      recall: tp + fn === 0 ? null : round(tp / (tp + fn)),
      support: tp + fn,
    };
  }

  return {
    sample_size: records.length,
    corpus_counts: countBy(records, (record) => record.corpus),
    per_tag: perTag,
    unmappable_gold_codes: countUnmappable(rows.map((row) => row.mapped.unmappable).flat()),
  };
}

function evaluateProxy(records: ProxyRecord[]): BenchmarkResults["proxy"] {
  const groups: Record<string, ProxyGroupMetrics> = {};
  for (const record of records) {
    const group = groups[record.group] ?? {
      samples: 0,
      detector_fires: 0,
      fire_rate: 0,
      tags: {},
    };
    const prediction = runViEnL1Detector({
      userAnswer: record.text,
      expectedAnswer: record.reference_text,
    });
    group.samples += 1;
    if (prediction.tag) {
      group.detector_fires += 1;
      group.tags[prediction.tag] = (group.tags[prediction.tag] ?? 0) + 1;
    }
    group.fire_rate = round(group.detector_fires / group.samples);
    groups[record.group] = group;
  }

  return {
    sample_size: records.length,
    corpus_counts: countBy(records, (record) => record.corpus),
    groups,
  };
}

function mapGoldTags(record: AnnotatedRecord): {
  tags: Set<string>;
  unmappable: string[];
} {
  const tags = new Set(record.gold_tags ?? []);
  const unmappable: string[] = [];
  for (const code of record.gold_error_codes ?? []) {
    const mapped = GOLD_CODE_TO_TAG[code];
    if (mapped) tags.add(mapped);
    else unmappable.push(code);
  }
  return { tags, unmappable };
}

export function renderReport(results: BenchmarkResults): string {
  const fixtureOnly = Object.keys({
    ...results.annotated.corpus_counts,
    ...results.proxy.corpus_counts,
  }).every((corpus) => corpus.startsWith("fixture-"));
  const annotatedRows = Object.entries(results.annotated.per_tag)
    .map(([tag, metric]) => (
      `| ${tag} | ${metric.support} | ${display(metric.precision)} | ${display(metric.recall)} | ${metric.tp} | ${metric.fp} | ${metric.fn} |`
    ))
    .join("\n");
  const proxyRows = Object.entries(results.proxy.groups)
    .map(([group, metric]) => (
      `| ${group} | ${metric.samples} | ${metric.detector_fires} | ${display(metric.fire_rate)} | ${formatTags(metric.tags)} |`
    ))
    .join("\n");
  const unmappable = Object.entries(results.annotated.unmappable_gold_codes)
    .map(([code, count]) => `- ${code}: ${count}`)
    .join("\n") || "- None in this run.";

  return `# Vietnamese-L1 Detector Benchmark v1

Generated: ${results.generated_at}

Status: ${fixtureOnly ? "fixture-smoke-run; public-corpus run pending licensed local data" : "public-corpus-derived metrics"}

## Method

This report was produced by scripts/benchmark/run-vi-en-detector-benchmark.ts. It imports the shipped detectL1Error detector surface and does not inline detector logic. The annotated track measures precision/recall against mappable gold tags. The VN-L1 proxy track measures detector fire-rate against a native/reference comparison set and is not an accuracy score.

Seed: ${results.seed}

Limit per track: ${results.limit_per_track}

## Corpus Choices And Licenses

- Annotated track: CLC FCE Dataset, optionally paired with UD English-ESL/TLE annotations. FCE contains learner scripts, error annotation, and first-language metadata under a non-commercial research/education license that excludes product/service use and requires citation. UD English-ESL annotations are CC BY-SA 4.0 but omit the underlying FCE text.
- VN-L1 proxy track: ICNALE Written Essays Plus, selected because WEP includes Vietnam-region learner essays and ICNALE includes native-speaker reference data. ICNALE downloads require registration/password and prohibit reproducing or redistributing data.
- Skipped in v1: Lang-8 because the public release does not provide a clean Vietnamese-L1 English subset for this harness; BEA W&I+LOCNESS because FCE/UD is the clearer first annotated path.

## Annotated Track

Sample size: ${results.annotated.sample_size}

Corpus counts: ${JSON.stringify(results.annotated.corpus_counts)}

| Detector tag | Gold support | Precision | Recall | TP | FP | FN |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${annotatedRows || "| No public annotated corpus rows were run. | 0 | n/a | n/a | 0 | 0 | 0 |"}

Unmappable gold codes:

${unmappable}

## VN-L1 Proxy Track

Sample size: ${results.proxy.sample_size}

Corpus counts: ${JSON.stringify(results.proxy.corpus_counts)}

| Group | Samples | Detector fires | Fire-rate | Tags |
| --- | ---: | ---: | ---: | --- |
${proxyRows || "| No public proxy corpus rows were run. | 0 | 0 | n/a | n/a |"}

## Limitations

- ${fixtureOnly ? "The numbers above are fixture smoke data, not public-corpus evidence." : "The numbers above are derived from local licensed corpus exports; raw corpus text is not committed."}
- The committed snapshot is a fixture smoke run unless the owner reruns the harness with licensed local FCE and ICNALE exports.
- FCE error annotations are not Vietnamese-L1-specific; only mappable error classes are scored, and unmappable classes remain explicit.
- ICNALE/WEP proxy results are a false-positive/fire-rate proxy over learner and native/reference texts, not an accuracy measurement.
- Corpus text is intentionally excluded from git because the source licenses restrict redistribution.

## Publishability Read

${fixtureOnly ? "Not publishable as an accuracy claim yet. It is publishable only as a methods draft until the owner supplies licensed local FCE and ICNALE exports and reruns the harness." : "Publishable as a v1 draft if the sample preparation notes and corpus license citations are kept with the report."}
`;
}

function hash(value: string): number {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function countBy<T>(records: T[], key: (record: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const record of records) {
    const value = key(record);
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

function countUnmappable(codes: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const code of codes) counts[code] = (counts[code] ?? 0) + 1;
  return counts;
}

function writeJson(path: string, data: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function display(value: number | null): string {
  return value === null ? "n/a" : value.toFixed(4);
}

function formatTags(tags: Record<string, number>): string {
  const entries = Object.entries(tags);
  if (entries.length === 0) return "none";
  return entries.map(([tag, count]) => `${tag}=${count}`).join(", ");
}
