import { describe, expect, it } from "vitest";

import {
  c1SnapshotSamples,
  c1SnapshotSamplesScriptAwareness,
} from "../c1SnapshotSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "formal_correspondence",
  "executive_summary",
  "register_calibration",
  "presentation_response",
  "public_professional_tone",
] as const;

describe("Punjabi C1 snapshot samples - app data contract", () => {
  it("contains a compact snapshot pack with stable ids", () => {
    expect(c1SnapshotSamples.length).toBeGreaterThanOrEqual(8);
    expect(c1SnapshotSamples.length).toBeLessThanOrEqual(10);

    const ids = c1SnapshotSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_snapshot_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1SnapshotSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all Wave 51 snapshot areas", () => {
    const present = new Set(c1SnapshotSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes snapshot, pre-A11-snapshot, closure packet, pre-merge, and pre-integration modes", () => {
    const modes = new Set(c1SnapshotSamples.map((sample) => sample.mode));
    expect(modes.has("snapshot")).toBe(true);
    expect(modes.has("pre_a11_snapshot")).toBe(true);
    expect(modes.has("closure_packet")).toBe(true);
    expect(modes.has("pre_merge")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 snapshot samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of c1SnapshotSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.snapshot_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.snapshot_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes snapshot checks, pre-A11-snapshot checks, pre-merge notes, pre-integration notes, Canada examples, and learner traps", () => {
    for (const sample of c1SnapshotSamples) {
      expect(sample.snapshot_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.snapshot_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_snapshot_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_snapshot_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_merge_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_merge_notes_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(3);

      expect(sample.canada_example.context_vi).toContain("Canada");
      expect(sample.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_example.pa)).toBe(true);
      expect(sample.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_example.vi).toContain("Canada");
      expect(sample.canada_example.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 snapshot samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1SnapshotSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1SnapshotSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1SnapshotSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1SnapshotSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1SnapshotSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 51 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(c1SnapshotSamples);
    expect(allText).toContain("pre-A11-snapshot");
    expect(allText).toContain("closure packet");
    expect(allText).toContain("pre-merge");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});
