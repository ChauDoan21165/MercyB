// src/lib/queries/__tests__/client.test.ts
//
// Guard tests for the shared QueryClient. Anyone tweaking client.ts
// must consciously update these defaults — the values are load-bearing
// for the cache strategy explained inline in client.ts.

import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";

import { queryClient } from "../client";

describe("queryClient", () => {
  it("is a QueryClient instance", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it("is a module-level singleton (same reference across imports)", async () => {
    const again = (await import("../client")).queryClient;
    expect(again).toBe(queryClient);
  });

  it("uses the documented query defaults", () => {
    const defaults = queryClient.getDefaultOptions().queries;
    expect(defaults?.staleTime).toBe(30_000);
    expect(defaults?.gcTime).toBe(5 * 60_000);
    expect(defaults?.refetchOnWindowFocus).toBe(false);
    expect(defaults?.refetchOnMount).toBe(false);
    expect(defaults?.refetchOnReconnect).toBe(false);
    expect(defaults?.retry).toBe(1);
  });
});
