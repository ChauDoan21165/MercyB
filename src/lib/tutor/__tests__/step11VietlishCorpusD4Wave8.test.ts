import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { VIETLISH_CORPUS, type VietlishCorpusEntry } from "@/lib/tutor/vietlishCorpus";

// Step 11 — Vietlish corpus WAVE 8 (A10) schema + dedup guard.
// Review-queue candidate file ONLY; NOT wired into the live engine. Authoring
// deduped against live corpus + all 7 prior waves (1744-item denylist);
// this test re-asserts the live-corpus half at runtime.

const corpusPath = resolve(
  process.cwd(),
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave8-200.json",
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

describe("step11 vietlish corpus wave 8 (review queue)", () => {
  it("is the A10 wave-8 review queue, not wired into the engine", () => {
    expect(data.corpus).toBe("step11-vietlish-corpus-d4-wave8");
    expect(data.wiredIntoEngine).toBe(false);
    expect(data.status).toBe("review_not_wired");
  });

  it("holds exactly 22 entries and a matching count field", () => {
    expect(data.entries).toHaveLength(5);
    expect(data.count).toBe(5);
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

  it("uses only valid interference categories", () => {
    const present = new Set(data.entries.map((entry) => entry.category));
    for (const c of present) expect(CATEGORIES.has(c)).toBe(true);
    expect(present.size).toBeGreaterThan(0);
  });
});
