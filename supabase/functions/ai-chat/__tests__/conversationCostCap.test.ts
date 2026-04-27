// Path: supabase/functions/ai-chat/__tests__/conversationCostCap.test.ts
//
// Unit tests for the per-conversation cost-cap decision rule. Pure
// inputs, pure output. The edge function provides the I/O (cumulative
// cost from ai_usage_logs, admin level from get_admin_level RPC, flag
// from feature_flags); this module decides whether to allow or block.

import { describe, expect, it } from "vitest";

import {
  DEFAULT_CONVERSATION_COST_CAP_VND,
  buildCapExceededResponseBody,
  decideConversationCostCap,
  resolveCapVndFromEnv,
} from "../conversationCostCap.ts";

const baseInput = {
  conversationId: "conv-1",
  cumulativeCostVnd: 0,
  capVnd: DEFAULT_CONVERSATION_COST_CAP_VND,
  capEnabled: true,
  isAdmin: false,
};

describe("decideConversationCostCap — admin bypass takes precedence", () => {
  it("admin user is allowed even when over cap", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: 9999,
      isAdmin: true,
    });
    expect(decision).toEqual({ kind: "allow", reason: "admin_bypass" });
  });

  it("admin user is allowed when cap is disabled", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      isAdmin: true,
      capEnabled: false,
    });
    expect(decision.kind).toBe("allow");
    expect((decision as { reason: string }).reason).toBe("admin_bypass");
  });
});

describe("decideConversationCostCap — kill switch", () => {
  it("returns allow with reason 'cap_disabled' when capEnabled is false", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: 9999,
      capEnabled: false,
    });
    expect(decision).toEqual({ kind: "allow", reason: "cap_disabled" });
  });
});

describe("decideConversationCostCap — missing conversation_id edge case", () => {
  it("returns allow with reason 'no_conversation_id' when conversationId is null", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      conversationId: null,
      cumulativeCostVnd: 9999,
    });
    expect(decision).toEqual({ kind: "allow", reason: "no_conversation_id" });
  });

  it("returns allow when conversationId is undefined", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      conversationId: undefined,
      cumulativeCostVnd: 9999,
    });
    expect(decision).toEqual({ kind: "allow", reason: "no_conversation_id" });
  });

  it("returns allow when conversationId is whitespace-only", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      conversationId: "   ",
      cumulativeCostVnd: 9999,
    });
    expect(decision).toEqual({ kind: "allow", reason: "no_conversation_id" });
  });
});

describe("decideConversationCostCap — cap not exceeded", () => {
  it("allows when cumulative cost is well below cap", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: 100,
    });
    expect(decision).toEqual({ kind: "allow", reason: "ok" });
  });

  it("allows at exactly the cap (boundary — not strictly greater)", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: 1200,
      capVnd: 1200,
    });
    expect(decision.kind).toBe("allow");
  });
});

describe("decideConversationCostCap — cap exceeded", () => {
  it("blocks when cumulative cost is one VND over the cap", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: 1201,
      capVnd: 1200,
    });
    expect(decision.kind).toBe("block");
    if (decision.kind === "block") {
      expect(decision.reason).toBe("cap_exceeded");
      expect(decision.observedCostVnd).toBe(1201);
      expect(decision.capVnd).toBe(1200);
    }
  });

  it("blocks at well over cap", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: 5000,
      capVnd: 1200,
    });
    expect(decision.kind).toBe("block");
  });
});

describe("decideConversationCostCap — defensive bad inputs", () => {
  it("allows when cap is non-finite (misconfigured)", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: 9999,
      capVnd: NaN,
    });
    expect(decision.kind).toBe("allow");
  });

  it("allows when cap is zero or negative", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: 9999,
      capVnd: 0,
    });
    expect(decision.kind).toBe("allow");
  });

  it("allows when cumulative cost is non-finite", () => {
    const decision = decideConversationCostCap({
      ...baseInput,
      cumulativeCostVnd: Number.POSITIVE_INFINITY,
    });
    expect(decision.kind).toBe("allow");
  });
});

describe("resolveCapVndFromEnv", () => {
  it("returns the default when env value is null", () => {
    expect(resolveCapVndFromEnv(null)).toBe(DEFAULT_CONVERSATION_COST_CAP_VND);
  });

  it("returns the default when env value is empty string", () => {
    expect(resolveCapVndFromEnv("")).toBe(DEFAULT_CONVERSATION_COST_CAP_VND);
  });

  it("returns the parsed integer value", () => {
    expect(resolveCapVndFromEnv("2400")).toBe(2400);
  });

  it("accepts decimals", () => {
    expect(resolveCapVndFromEnv("1500.5")).toBe(1500.5);
  });

  it("falls back to default for non-numeric input", () => {
    expect(resolveCapVndFromEnv("abc")).toBe(DEFAULT_CONVERSATION_COST_CAP_VND);
  });

  it("falls back to default for negative or zero values", () => {
    expect(resolveCapVndFromEnv("-100")).toBe(DEFAULT_CONVERSATION_COST_CAP_VND);
    expect(resolveCapVndFromEnv("0")).toBe(DEFAULT_CONVERSATION_COST_CAP_VND);
  });
});

describe("buildCapExceededResponseBody — bilingual contract", () => {
  it("returns the documented shape with both VI and EN messages", () => {
    const body = buildCapExceededResponseBody({
      observedCostVnd: 1500.123,
      capVnd: 1200,
    });
    expect(body.ok).toBe(false);
    expect(body.error_code).toBe("CONVERSATION_COST_CAP_EXCEEDED");
    expect(body.error_message_vi.length).toBeGreaterThan(0);
    expect(body.error_message_en.length).toBeGreaterThan(0);
    expect(body.suggested_action).toBe("start_new_conversation");
    expect(body.cap_vnd).toBe(1200);
    // current_cost_vnd is rounded to 2dp.
    expect(body.current_cost_vnd).toBe(1500.12);
  });
});

