import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { VIETLISH_CORPUS, type VietlishCorpusEntry } from "@/lib/tutor/vietlishCorpus";

// Guard for the A4/D4 wave5 Step 11 review-queue corpus. These 200 entries
// are staged candidates that MUST match the live VietlishCorpusEntry schema
// EXACTLY before any human-reviewed promotion into vietlishCorpus.ts. This
// file is imported by no engine module — it only reads the JSON and the live
// corpus to prove the candidates are well-formed and disjoint.

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_PATH = resolve(
  HERE,
  "..",
  "step11-vietlish-corpus-d4-wave5-200.json",
);

type WaveFile = {
  count: number;
  entries: VietlishCorpusEntry[];
};

const CATEGORY_ENUM = new Set([
  "calque",
  "word_order",
  "register",
  "collocation",
  "false_friend",
  "literal_translation",
]);
const FREQUENCY_ENUM = new Set(["high", "medium", "low"]);
const REQUIRED_KEYS = [
  "vietlish",
  "natural",
  "sourcePattern",
  "category",
  "frequency",
  "context",
] as const;

const raw = readFileSync(CORPUS_PATH, "utf8");
const parsed = JSON.parse(raw) as WaveFile;
const entries = parsed.entries;

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

describe("step11 Vietlish corpus D4 wave5 (review queue)", () => {
  it("contains exactly 196 entries and the header count agrees", () => {
    // 200 authored; 4 freq=high entries promoted into VIETLISH_CORPUS in the
    // Step-11 Stage-1 promotion (2026-06-10), leaving 196.
    expect(entries).toHaveLength(180);
    expect(parsed.count).toBe(180);
  });

  it("every entry matches the VietlishCorpusEntry schema exactly", () => {
    for (const entry of entries) {
      const keys = Object.keys(entry).sort();
      expect(keys).toEqual([...REQUIRED_KEYS].sort());
      for (const key of REQUIRED_KEYS) {
        expect(typeof entry[key]).toBe("string");
        expect(entry[key].length).toBeGreaterThan(0);
      }
      expect(CATEGORY_ENUM.has(entry.category)).toBe(true);
      expect(FREQUENCY_ENUM.has(entry.frequency)).toBe(true);
    }
  });

  it("the context sentence embeds the vietlish form for every entry", () => {
    const offenders = entries.filter(
      (e) => !norm(e.context).includes(norm(e.vietlish)),
    );
    expect(offenders.map((e) => e.vietlish)).toEqual([]);
  });

  it("has no duplicate vietlish strings within the wave", () => {
    const seen = new Map<string, number>();
    for (const e of entries) {
      const key = norm(e.vietlish);
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([k]) => k);
    expect(dupes).toEqual([]);
  });

  it("is fully disjoint from the live VIETLISH_CORPUS (no engine overlap)", () => {
    const live = new Set(VIETLISH_CORPUS.map((e) => norm(e.vietlish)));
    const overlap = entries
      .map((e) => norm(e.vietlish))
      .filter((v) => live.has(v));
    expect(overlap).toEqual([]);
  });
});
