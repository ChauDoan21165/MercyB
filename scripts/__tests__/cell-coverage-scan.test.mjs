import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  compareCellCoverageToBaseline,
  scanCellCoverage,
} from "../cell-coverage-scan.mjs";

let tmpDir;

function makeFixture() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cell-coverage-"));
  fs.mkdirSync(path.join(tmpDir, "src/languages/mock"), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, "public/audio"), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, "reports/cell-inventory"), { recursive: true });
  fs.writeFileSync(path.join(tmpDir, "public/audio/existing.mp3"), "fixture");
  fs.writeFileSync(
    path.join(tmpDir, "reports/cell-inventory/audio-map-mock.json"),
    JSON.stringify({
      cells: [
        {
          cell_type: "Vocabulary Item",
          source_file: "src/languages/mock/lesson.ts",
          source_object: { lesson_id: "mock-a1", ordinal: 2 },
          tuples: [{ role: "english_target", url: "https://example.test/cache/beta.mp3" }],
        },
        {
          cell_type: "Dialogue Turn",
          source_file: "src/languages/mock/lesson.ts",
          source_object: { lesson_id: "mock-a1", ordinal: 2 },
          tuples: [{ role: "english_target", url: "https://example.test/cache/adios.mp3" }],
        },
      ],
    }),
  );
  fs.writeFileSync(
    path.join(tmpDir, "src/languages/mock/lesson.ts"),
    `
export const lessons = [
  {
    id: "mock-a1",
    level: "A1",
    vocabulary: [
      { word: "alpha beta", pronunciation: "/al.fa/", audio: "/audio/existing.mp3" },
      { word: "beta gamma", pronunciation: "", audio: "/audio/missing.mp3" },
      { word: "delta", pronunciation: "", audio: "/audio/missing-other.mp3" }
    ],
    dialogue: [
      { speaker: "A", spanish: "hola beta", pronunciation: "OH-la", audio: "audio/existing.mp3" },
      { speaker: "B", spanish: "adios", pronunciation: "", audio: "audio/missing.mp3" }
    ]
  }
];
`,
  );
  return tmpDir;
}

afterEach(() => {
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  tmpDir = undefined;
});

describe("cell-coverage-scan", () => {
  it("counts IPA/audio coverage and unique-token denominators from CELL fixtures", () => {
    const root = makeFixture();
    const scan = scanCellCoverage({ root });

    expect(scan.filesScanned).toBe(1);
    expect(scan.filesWithCell).toBe(1);
    expect(scan.lessonObjects).toBe(1);

    expect(scan.audioMapFiles).toBe(1);
    expect(scan.audioMapCells).toBe(2);

    expect(scan.totals.vocabulary.objects).toBe(3);
    expect(scan.totals.vocabulary.ipaCoveredObjects).toBe(1);
    expect(scan.totals.vocabulary.audioCoveredObjects).toBe(1);
    expect(scan.totals.vocabulary.cacheMappedObjects).toBe(1);
    expect(scan.totals.vocabulary.runtimeTtsOnlyObjects).toBe(1);
    expect(scan.totals.vocabulary.uniqueWordTokens).toBe(4);
    expect(scan.totals.vocabulary.ipaCoveredUniqueWordTokens).toBe(2);
    expect(scan.totals.vocabulary.audioCoveredUniqueWordTokens).toBe(2);
    expect(scan.totals.vocabulary.cacheMappedUniqueWordTokens).toBe(1);
    expect(scan.totals.vocabulary.runtimeTtsOnlyUniqueWordTokens).toBe(1);

    expect(scan.totals.dialogue.objects).toBe(2);
    expect(scan.totals.dialogue.ipaCoveredObjects).toBe(1);
    expect(scan.totals.dialogue.audioCoveredObjects).toBe(1);
    expect(scan.totals.dialogue.cacheMappedObjects).toBe(1);
    expect(scan.totals.dialogue.runtimeTtsOnlyObjects).toBe(0);
    expect(scan.totals.dialogue.uniqueWordTokens).toBe(3);
    expect(scan.totals.dialogue.ipaCoveredUniqueWordTokens).toBe(2);
    expect(scan.totals.dialogue.audioCoveredUniqueWordTokens).toBe(2);
    expect(scan.totals.dialogue.cacheMappedUniqueWordTokens).toBe(1);
    expect(scan.totals.dialogue.runtimeTtsOnlyUniqueWordTokens).toBe(0);
  });

  it("flags only uncovered-count increases against the baseline", () => {
    const root = makeFixture();
    const scan = scanCellCoverage({ root });
    const baseline = {
      totals: {
        vocabulary: {
          uncoveredIpaObjects: 0,
          uncoveredAudioObjects: 2,
          uncoveredIpaUniqueWordTokens: 2,
          uncoveredAudioUniqueWordTokens: 2,
        },
        dialogue: {
          uncoveredIpaObjects: 1,
          uncoveredAudioObjects: 1,
          uncoveredIpaUniqueWordTokens: 1,
          uncoveredAudioUniqueWordTokens: 1,
        },
      },
    };

    expect(compareCellCoverageToBaseline(scan, baseline)).toEqual([
      {
        type: "vocabulary",
        metric: "uncoveredIpaObjects",
        baseline: 0,
        actual: 2,
      },
    ]);
  });
});
