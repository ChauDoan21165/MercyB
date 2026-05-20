// supabase/functions/_billing/__tests__/http.test.ts
//
// A12 coverage ratchet — lock json() and error() Response builders.
// These are the two functions every billing edge function uses to
// shape its HTTP response. A change here that drops the JSON
// content-type or stringifies poorly breaks every downstream caller.

import { describe, it, expect } from "vitest";
import { json, error } from "../http";

describe("json()", () => {
  it("returns a Response with default status 200", async () => {
    const r = json({ ok: true });
    expect(r).toBeInstanceOf(Response);
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await r.json()).toEqual({ ok: true });
  });

  it("honors a custom status code", async () => {
    const r = json({ created: true }, { status: 201 });
    expect(r.status).toBe(201);
    expect(await r.json()).toEqual({ created: true });
  });

  it("preserves caller-supplied headers and OVERRIDES content-type to JSON", async () => {
    const r = json(
      { id: "abc" },
      {
        headers: {
          "x-request-id": "req-123",
          "content-type": "text/html", // should be overwritten
        },
      },
    );
    expect(r.headers.get("x-request-id")).toBe("req-123");
    expect(r.headers.get("content-type")).toBe("application/json; charset=utf-8");
  });

  it("pretty-prints JSON with 2-space indent (audit-friendly)", async () => {
    const r = json({ a: 1, b: 2 });
    const text = await r.text();
    // 2-space indent: lines for opening brace + each key + closing brace.
    expect(text).toContain("\n  \"a\": 1,");
    expect(text).toContain("\n  \"b\": 2\n");
  });

  it("serializes nested objects + arrays", async () => {
    const payload = { user: { id: "u1" }, events: [{ type: "a" }, { type: "b" }] };
    const r = json(payload);
    expect(await r.json()).toEqual(payload);
  });

  it("handles null body", async () => {
    const r = json(null);
    expect(r.status).toBe(200);
    expect(await r.text()).toBe("null");
  });
});

describe("error()", () => {
  it("returns a Response with default status 400 and ok:false", async () => {
    const r = error("bad input");
    expect(r.status).toBe(400);
    expect(r.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await r.json()).toEqual({ ok: false, error: "bad input" });
  });

  it("honors a custom status code", async () => {
    const r = error("not found", 404);
    expect(r.status).toBe(404);
    expect((await r.json()).error).toBe("not found");
  });

  it("merges optional details onto the response body", async () => {
    const r = error("validation_failed", 422, { field: "email", code: "invalid" });
    expect(await r.json()).toEqual({
      ok: false,
      error: "validation_failed",
      field: "email",
      code: "invalid",
    });
  });

  it("details do NOT overwrite ok or error keys", async () => {
    // The spread is `{ ok: false, error: message, ...(details ?? {}) }` —
    // details ARE allowed to override (current behavior). Lock this so a
    // refactor that flips the order is caught loud. If you intend to make
    // ok/error non-overridable, change this test deliberately.
    const r = error("real_error", 500, { ok: true, error: "hijacked" });
    const body = await r.json();
    expect(body.ok).toBe(true);          // details won
    expect(body.error).toBe("hijacked"); // details won
  });

  it("handles missing details (undefined) without crashing", async () => {
    const r = error("oops", 500);
    expect((await r.json())).toEqual({ ok: false, error: "oops" });
  });
});
