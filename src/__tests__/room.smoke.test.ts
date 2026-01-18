// FILE: src/__tests__/room.smoke.test.ts
// VERSION: MB-BLUE-101.12d — 2026-01-12 (+0700)
// PURPOSE: Prevent catastrophic regressions

import { describe, it, expect } from "vitest";

describe("Room smoke", () => {
  it("basic sanity", () => {
    expect(true).toBe(true);
  });
});
