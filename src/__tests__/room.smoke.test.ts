// FILE: src/__tests__/room.smoke.test.ts
// VERSION: MB-BLUE-101.12d — 2026-01-12 (+0700)
// PURPOSE: Prevent catastrophic regressions

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import englishA1A108 from "../../public/data/english_a1_a108.json";
import { extractJsonLeafEntries } from "@/components/room/roomJsonExtract";

function leafSlug(entry: unknown): unknown {
  return typeof entry === "object" && entry !== null && "slug" in entry
    ? entry.slug
    : undefined;
}

describe("Room smoke", () => {
  it("english_a1_a108 exposes its six leaf entries safely", () => {
    const entries = extractJsonLeafEntries(englishA1A108);

    expect(entries.map(leafSlug)).toEqual([
      "basic-feelings",
      "describing-other-people",
      "common-adjectives",
      "simple-descriptive-lines",
      "feelings-in-daily-life",
      "mini-speaking-drill",
    ]);
  });

  it("room route CSS does not self-reference the zoom variable", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/pages/ChatHub.tsx"),
      "utf8",
    );

    expect(source).not.toContain("--mb-essay-zoom: var(--mb-essay-zoom");
  });
});
