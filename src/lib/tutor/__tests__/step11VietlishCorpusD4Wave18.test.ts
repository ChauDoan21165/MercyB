import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { VIETLISH_CORPUS, type VietlishCorpusEntry } from "@/lib/tutor/vietlishCorpus";

// Step 11 - Vietlish corpus WAVE 18 (A4 Content Factory) schema guard.
// Review-queue only; not wired into the live engine. Dedupe is asserted
// case-insensitively against the live corpus and all previous wave files.

const corpusPath = resolve(
  process.cwd(),
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave18-200.json",
);

const pendingWavePaths = [
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave2-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave3-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave4-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave5-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave6-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave7-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave8-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave9-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave10-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave11-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave12-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave13-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave14-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave15-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave16-200.json",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave17-200.json",
];

type WaveFile = {
  corpus: string;
  count: number;
  wiredIntoEngine: boolean;
  status: string;
  entries: VietlishCorpusEntry[];
};

const data = JSON.parse(readFileSync(corpusPath, "utf8")) as WaveFile;

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

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

const readPendingEntries = (relativePath: string): VietlishCorpusEntry[] => {
  const parsed = JSON.parse(readFileSync(resolve(process.cwd(), relativePath), "utf8")) as {
    entries: VietlishCorpusEntry[];
  };
  return parsed.entries;
};

describe("step11 vietlish corpus wave 18 (A4 review queue)", () => {
  it("is the A4 wave-18 review queue, not wired into the engine", () => {
    expect(data.corpus).toBe("step11-vietlish-corpus-d4-wave18");
    expect(data.wiredIntoEngine).toBe(false);
    expect(data.status).toBe("review_not_wired");
  });

  it("holds exactly 200 entries and a matching count field", () => {
    expect(data.entries).toHaveLength(200);
    expect(data.count).toBe(200);
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

  it("embeds each vietlish form in its review context", () => {
    const offenders = data.entries
      .filter((entry) => !normalize(entry.context).includes(normalize(entry.vietlish)))
      .map((entry) => entry.vietlish);
    expect(offenders).toEqual([]);
  });

  it("has no duplicate vietlish strings within the wave, case-insensitively", () => {
    const seen = new Set(data.entries.map((entry) => normalize(entry.vietlish)));
    expect(seen.size).toBe(data.entries.length);
  });

  it("does not collide with live corpus or waves 1-17, case-insensitively", () => {
    const baseline = new Set(
      (VIETLISH_CORPUS as readonly VietlishCorpusEntry[]).map((entry) =>
        normalize(entry.vietlish),
      ),
    );
    for (const relativePath of pendingWavePaths) {
      for (const entry of readPendingEntries(relativePath)) {
        baseline.add(normalize(entry.vietlish));
      }
    }

    const collisions = data.entries
      .map((entry) => entry.vietlish)
      .filter((vietlish) => baseline.has(normalize(vietlish)));
    expect(collisions).toEqual([]);
  });

  it("exercises every interference category", () => {
    const present = new Set(data.entries.map((entry) => entry.category));
    expect(present).toEqual(CATEGORIES);
  });
});
