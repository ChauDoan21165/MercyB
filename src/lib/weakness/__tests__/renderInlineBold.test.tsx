// src/lib/weakness/__tests__/renderInlineBold.test.tsx
//
// Covers the markdown-bold splitter. Plain text round-trips, single bold
// segment wraps correctly, multiple bold segments wrap correctly, and
// consecutive calls don't leak regex state.

import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { renderInlineBold } from "../renderInlineBold";

function renderFragments(parts: React.ReactNode[]): string {
  return renderToStaticMarkup(<>{parts}</>);
}

describe("renderInlineBold", () => {
  it("returns plain text when there is no bold marker", () => {
    const parts = renderInlineBold("Vietnamese nouns don't change.");
    expect(parts).toEqual(["Vietnamese nouns don't change."]);
    expect(renderFragments(parts)).toBe("Vietnamese nouns don&#x27;t change.");
  });

  it("wraps a single bold segment in <strong>", () => {
    const parts = renderInlineBold("English adds **-s** to verbs.");
    expect(renderFragments(parts)).toBe(
      "English adds <strong>-s</strong> to verbs.",
    );
  });

  it("wraps multiple bold segments in the same string", () => {
    const parts = renderInlineBold(
      "**hôm qua** and **đã** mark the past.",
    );
    expect(renderFragments(parts)).toBe(
      "<strong>hôm qua</strong> and <strong>đã</strong> mark the past.",
    );
  });

  it("handles bold at the start and end of the string", () => {
    expect(renderFragments(renderInlineBold("**work**"))).toBe(
      "<strong>work</strong>",
    );
    expect(renderFragments(renderInlineBold("**work** forms"))).toBe(
      "<strong>work</strong> forms",
    );
    expect(renderFragments(renderInlineBold("Uses **work**"))).toBe(
      "Uses <strong>work</strong>",
    );
  });

  it("does not leak regex state across calls", () => {
    // The /g regex is stateful; internal impl must reset lastIndex.
    // Calling the helper twice in a row with the same string must
    // produce the same output.
    const first = renderFragments(renderInlineBold("**book → books**"));
    const second = renderFragments(renderInlineBold("**book → books**"));
    expect(first).toBe(second);
    expect(first).toBe("<strong>book → books</strong>");
  });

  it("returns the raw string when bold markers are unbalanced", () => {
    // Single asterisks don't trigger bolding.
    const parts = renderInlineBold("*not bold* just stars");
    expect(renderFragments(parts)).toBe("*not bold* just stars");
  });

  it("returns a single-element array for empty string", () => {
    expect(renderInlineBold("")).toEqual([""]);
  });
});
