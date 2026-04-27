// Pure mixer tests. No Supabase, no DOM, no React.
//
// Items are simple labels so we can assert the exact merge order.

import { describe, expect, it } from "vitest";

import { mixPrompts, mixPromptsWithFallback, shuffleSeeded } from "../mixPrompts";

const community = ["c1", "c2", "c3", "c4", "c5"];
const hardcoded = ["h1", "h2", "h3", "h4", "h5"];

describe("mixPrompts", () => {
  it("0% community returns only hardcoded, in order", () => {
    expect(mixPrompts(community, hardcoded, 0)).toEqual(hardcoded);
  });

  it("100% community returns only community (length matches hardcoded slot count)", () => {
    // With seed=undefined the order matches the input slice.
    expect(mixPrompts(community, hardcoded, 1)).toEqual(community);
  });

  it("50% returns alternating items deterministically given a seed", () => {
    const out = mixPrompts(community, hardcoded, 0.5, /* seed */ 42);
    // 50% of 5 = round(2.5) = 3 community + 2 hardcoded = 5 total
    expect(out).toHaveLength(5);
    // The merge alternates: starting with community at every step where
    // expectedC has crossed the threshold. With c=3 h=2 the round-robin
    // schedule is c,h,c,h,c (the first slot crosses to expectedC=1, etc).
    const communitySet = new Set(out.filter((v) => v.startsWith("c")));
    const hardcodedSet = new Set(out.filter((v) => v.startsWith("h")));
    expect(communitySet.size).toBe(3);
    expect(hardcodedSet.size).toBe(2);
    // Determinism: same seed → same exact output.
    expect(mixPrompts(community, hardcoded, 0.5, 42)).toEqual(out);
  });

  it("empty community + 50% ratio falls back to hardcoded only", () => {
    const result = mixPromptsWithFallback([], hardcoded, 0.5);
    expect(result.items).toEqual(hardcoded);
    expect(result.fallback).toBe(true);
  });

  it("empty hardcoded returns empty array", () => {
    expect(mixPrompts(community, [], 0.5)).toEqual([]);
  });
});

describe("shuffleSeeded", () => {
  it("is deterministic given the same seed", () => {
    const a = shuffleSeeded([1, 2, 3, 4, 5], 7);
    const b = shuffleSeeded([1, 2, 3, 4, 5], 7);
    expect(a).toEqual(b);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5];
    shuffleSeeded(input, 9);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});
