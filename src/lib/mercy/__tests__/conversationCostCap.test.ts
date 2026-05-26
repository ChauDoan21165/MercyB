// Path: src/lib/mercy/__tests__/conversationCostCap.test.ts
//
// Tests for the client-side parser that detects the structured 402 body
// returned by ai-chat when a conversation crosses the per-thread spend
// cap. The pure parser must work for both `supabase.functions.invoke`
// and direct-fetch shapes.

import { describe, expect, it } from "vitest";

import {
  CAP_EXCEEDED_ERROR_CODE,
  parseCapExceeded,
  parseCapExceededFromResponse,
} from "../conversationCostCap";

describe("parseCapExceeded — recognises the canonical body shape", () => {
  it("returns cost_cap_exceeded for a complete cap-exceeded body", () => {
    const body = {
      ok: false,
      error_code: CAP_EXCEEDED_ERROR_CODE,
      error_message_vi: "VI message",
      error_message_en: "EN message",
      current_cost_vnd: 1500,
      cap_vnd: 1200,
      suggested_action: "start_new_conversation",
    };
    const parsed = parseCapExceeded(body);
    expect(parsed.kind).toBe("cost_cap_exceeded");
    if (parsed.kind === "cost_cap_exceeded") {
      expect(parsed.currentCostVnd).toBe(1500);
      expect(parsed.capVnd).toBe(1200);
      expect(parsed.messageVi).toBe("VI message");
      expect(parsed.messageEn).toBe("EN message");
      expect(parsed.suggestedAction).toBe("start_new_conversation");
    }
  });

  it("falls back to default bilingual messages when server omits them", () => {
    const body = {
      error_code: CAP_EXCEEDED_ERROR_CODE,
      current_cost_vnd: 1500,
      cap_vnd: 1200,
    };
    const parsed = parseCapExceeded(body);
    expect(parsed.kind).toBe("cost_cap_exceeded");
    if (parsed.kind === "cost_cap_exceeded") {
      expect(parsed.messageVi.length).toBeGreaterThan(0);
      expect(parsed.messageEn.length).toBeGreaterThan(0);
    }
  });
});

describe("parseCapExceeded — distinguishes other 402 bodies", () => {
  it("returns not_cap_exceeded for the existing limit_reached shape", () => {
    const body = { error: "limit_reached", message: "Daily AI budget reached." };
    expect(parseCapExceeded(body).kind).toBe("not_cap_exceeded");
  });

  it("returns not_cap_exceeded for trial_expired", () => {
    const body = { error: "trial_expired", mercy: { en: "x", vi: "y" } };
    expect(parseCapExceeded(body).kind).toBe("not_cap_exceeded");
  });

  it("returns not_cap_exceeded for null / undefined / strings", () => {
    expect(parseCapExceeded(null).kind).toBe("not_cap_exceeded");
    expect(parseCapExceeded(undefined).kind).toBe("not_cap_exceeded");
    expect(parseCapExceeded("string body").kind).toBe("not_cap_exceeded");
  });

  it("returns not_cap_exceeded when error_code is a different string", () => {
    const body = { error_code: "SOMETHING_ELSE" };
    expect(parseCapExceeded(body).kind).toBe("not_cap_exceeded");
  });
});

describe("parseCapExceededFromResponse — Response wrapper", () => {
  it("returns the parsed object when status is 402 and body matches", async () => {
    const body = {
      error_code: CAP_EXCEEDED_ERROR_CODE,
      error_message_vi: "VI",
      error_message_en: "EN",
      current_cost_vnd: 1300,
      cap_vnd: 1200,
      suggested_action: "start_new_conversation",
    };
    const response = new Response(JSON.stringify(body), { status: 402 });
    const result = await parseCapExceededFromResponse(response);
    expect(result?.kind).toBe("cost_cap_exceeded");
    expect(result?.currentCostVnd).toBe(1300);
  });

  it("returns null when status is not 402", async () => {
    const body = { error_code: CAP_EXCEEDED_ERROR_CODE };
    const response = new Response(JSON.stringify(body), { status: 200 });
    const result = await parseCapExceededFromResponse(response);
    expect(result).toBeNull();
  });

  it("returns null when 402 body is non-JSON or unparseable", async () => {
    const response = new Response("not json", { status: 402 });
    const result = await parseCapExceededFromResponse(response);
    expect(result).toBeNull();
  });

  it("returns null when 402 body is JSON but a different error", async () => {
    const body = { error: "limit_reached" };
    const response = new Response(JSON.stringify(body), { status: 402 });
    const result = await parseCapExceededFromResponse(response);
    expect(result).toBeNull();
  });
});
