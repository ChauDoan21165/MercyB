// src/lib/weakness/__tests__/focusAreasLogic.test.ts
//
// Unit tests for the pure decision functions that drive the
// focus-areas card state machine. No React, no Supabase — these
// functions take query results and return state. Covers the three UX
// states CC3's profiles schema disambiguates via placement_completed_at.

import { describe, expect, it } from "vitest";

import {
  deriveStateFromCache,
  deriveStateFromSource,
  type CacheResult,
  type SourceResult,
} from "../focusAreasLogic";

const LIMIT = 3;

describe("deriveStateFromCache — placement_completed_at drives the trichotomy", () => {
  it("no_placement when completedAt is null (never taken)", () => {
    const cache: CacheResult = { kind: "ok", completedAt: null, tags: [] };
    expect(deriveStateFromCache(cache, LIMIT)).toEqual({
      status: "no_placement",
    });
  });

  it("no_placement when completedAt is null even if stray tags exist", () => {
    // Defensive: a profile write order bug that leaves tags without
    // flipping completed_at should NOT surface a weaknesses card.
    const cache: CacheResult = {
      kind: "ok",
      completedAt: null,
      tags: ["vi_l1_3rd_person_s"],
    };
    expect(deriveStateFromCache(cache, LIMIT)).toEqual({
      status: "no_placement",
    });
  });

  it("no_weaknesses when completedAt is set and tags array is empty (balanced)", () => {
    const cache: CacheResult = {
      kind: "ok",
      completedAt: "2026-04-23T12:00:00.000Z",
      tags: [],
    };
    expect(deriveStateFromCache(cache, LIMIT)).toEqual({
      status: "no_weaknesses",
    });
  });

  it("weaknesses with entries when completedAt is set and tags match the catalog", () => {
    const cache: CacheResult = {
      kind: "ok",
      completedAt: "2026-04-23T12:00:00.000Z",
      tags: ["vi_l1_3rd_person_s", "vi_l1_past_ed"],
    };
    const result = deriveStateFromCache(cache, LIMIT);
    expect(result).not.toBe("use_source");
    if (result !== "use_source" && result.status === "weaknesses") {
      expect(result.entries.map((e) => e.tag)).toEqual([
        "vi_l1_3rd_person_s",
        "vi_l1_past_ed",
      ]);
    } else {
      throw new Error("expected weaknesses status");
    }
  });

  it("respects the limit when tags exceed it", () => {
    const cache: CacheResult = {
      kind: "ok",
      completedAt: "2026-04-23T12:00:00.000Z",
      tags: ["vi_l1_3rd_person_s", "vi_l1_past_ed", "vi_l1_plural_s"],
    };
    const result = deriveStateFromCache(cache, 2);
    if (result !== "use_source" && result.status === "weaknesses") {
      expect(result.entries).toHaveLength(2);
    } else {
      throw new Error("expected weaknesses status");
    }
  });

  it("returns 'use_source' when cache query errors", () => {
    const cache: CacheResult = { kind: "error" };
    expect(deriveStateFromCache(cache, LIMIT)).toBe("use_source");
  });

  it("returns 'use_source' when completedAt is set but NO tags match the catalog (drift)", () => {
    const cache: CacheResult = {
      kind: "ok",
      completedAt: "2026-04-23T12:00:00.000Z",
      tags: ["vi_l1_future_tag_we_dont_know"],
    };
    expect(deriveStateFromCache(cache, LIMIT)).toBe("use_source");
  });
});

describe("deriveStateFromSource — fallback when cache is unreachable", () => {
  it("no_placement when source query errors (conservative default)", () => {
    const source: SourceResult = { kind: "error" };
    expect(deriveStateFromSource(source, LIMIT)).toEqual({
      status: "no_placement",
    });
  });

  it("no_placement when source is reachable but empty", () => {
    // Without a completion signal in this fallback path, we cannot
    // distinguish "taken with zero flags" from "never taken." Prompt
    // a retake rather than show a wrong "balanced" badge.
    const source: SourceResult = { kind: "ok", tags: [] };
    expect(deriveStateFromSource(source, LIMIT)).toEqual({
      status: "no_placement",
    });
  });

  it("no_placement when every source tag is unknown to the catalog", () => {
    const source: SourceResult = {
      kind: "ok",
      tags: ["vi_l1_ghost_tag", "vi_l1_another_future"],
    };
    expect(deriveStateFromSource(source, LIMIT)).toEqual({
      status: "no_placement",
    });
  });

  it("weaknesses when source returns known tags", () => {
    const source: SourceResult = {
      kind: "ok",
      tags: ["vi_l1_plural_s", "vi_l1_past_ed"],
    };
    const result = deriveStateFromSource(source, LIMIT);
    expect(result.status).toBe("weaknesses");
    if (result.status === "weaknesses") {
      expect(result.entries.map((e) => e.tag)).toEqual([
        "vi_l1_plural_s",
        "vi_l1_past_ed",
      ]);
    }
  });

  it("filters unknown tags from a mixed source result", () => {
    const source: SourceResult = {
      kind: "ok",
      tags: ["vi_l1_ghost", "vi_l1_plural_s", "vi_l1_another_ghost"],
    };
    const result = deriveStateFromSource(source, LIMIT);
    if (result.status === "weaknesses") {
      expect(result.entries.map((e) => e.tag)).toEqual(["vi_l1_plural_s"]);
    } else {
      throw new Error("expected weaknesses status");
    }
  });

  it("respects the limit", () => {
    const source: SourceResult = {
      kind: "ok",
      tags: ["vi_l1_3rd_person_s", "vi_l1_past_ed", "vi_l1_plural_s"],
    };
    const result = deriveStateFromSource(source, 1);
    if (result.status === "weaknesses") {
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].tag).toBe("vi_l1_3rd_person_s");
    } else {
      throw new Error("expected weaknesses status");
    }
  });
});
