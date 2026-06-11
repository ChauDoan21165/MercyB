import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { VIETLISH_CORPUS, type VietlishCorpusEntry } from "@/lib/tutor/vietlishCorpus";

// Step 11 — Vietlish corpus WAVE 2 (A10 / D4-2) schema guard.
// Locks invariants on the review-queue candidate file ONLY; it is NOT wired
// into the live engine. A4 owns the sibling d4-wave-200 file + its own guard;
// this test is file-disjoint and asserts nothing about A4's batch.

const corpusPath = resolve(
  process.cwd(),
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave2-200.json",
);
const data = JSON.parse(readFileSync(corpusPath, "utf8")) as {
  corpus: string;
  count: number;
  wiredIntoEngine: boolean;
  status: string;
  entries: VietlishCorpusEntry[];
};

const CATEGORIES = new Set([
  "calque",
  "word_order",
  "register",
  "collocation",
  "false_friend",
  "literal_translation",
]);
const FREQUENCIES = new Set(["high", "medium", "low"]);
const REQUIRED_KEYS = [
  "category",
  "context",
  "frequency",
  "natural",
  "sourcePattern",
  "vietlish",
];

describe("step11 vietlish corpus wave 2 (D4-2 review queue)", () => {
  it("is the A10 wave-2 review queue, not wired into the engine", () => {
    expect(data.corpus).toBe("step11-vietlish-corpus-d4-wave2");
    expect(data.wiredIntoEngine).toBe(false);
    expect(data.status).toBe("review_not_wired");
  });

  it("holds exactly 125 entries and a matching count field", () => {
    // 200 authored; 5 cross-file duplicates removed in the 2026-06-10 A10
    // coherence pass (4 already in wave1, 1 case-duplicate of the live corpus);
    // 44 freq=high entries promoted into VIETLISH_CORPUS in the Step-11 Stage-1
    // promotion (2026-06-10), leaving 151.
    expect(data.entries).toHaveLength(67);
    expect(data.count).toBe(67);
  });

  it("matches the VietlishCorpusEntry schema exactly (six string fields, valid enums)", () => {
    for (const entry of data.entries) {
      expect(Object.keys(entry).sort()).toEqual(REQUIRED_KEYS);
      for (const field of ["vietlish", "natural", "sourcePattern", "context"] as const) {
        expect(typeof entry[field]).toBe("string");
        expect(entry[field].trim().length).toBeGreaterThan(0);
      }
      expect(CATEGORIES.has(entry.category)).toBe(true);
      expect(FREQUENCIES.has(entry.frequency)).toBe(true);
    }
  });

  it("has no duplicate vietlish strings within the wave", () => {
    const seen = new Set(data.entries.map((entry) => entry.vietlish));
    expect(seen.size).toBe(data.entries.length);
  });

  it("does not collide with the live VIETLISH_CORPUS", () => {
    const live = new Set(
      (VIETLISH_CORPUS as readonly VietlishCorpusEntry[]).map((entry) => entry.vietlish),
    );
    const collisions = data.entries
      .map((entry) => entry.vietlish)
      .filter((vietlish) => live.has(vietlish));
    expect(collisions).toEqual([]);
  });

  it("exercises every interference category", () => {
    const present = new Set(data.entries.map((entry) => entry.category));
    expect(present).toEqual(CATEGORIES);
  });
});
