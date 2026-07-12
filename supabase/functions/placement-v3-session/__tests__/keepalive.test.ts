import { describe, expect, it } from "vitest";

import { isKeepaliveRequestBody } from "../keepalive.ts";

describe("placement v3 keepalive body detection", () => {
  it("accepts empty cron pings before auth", () => {
    expect(isKeepaliveRequestBody("")).toBe(true);
    expect(isKeepaliveRequestBody("   \n\t")).toBe(true);
  });

  it("accepts empty JSON object and explicit keepalive pings before auth", () => {
    expect(isKeepaliveRequestBody("{}")).toBe(true);
    expect(isKeepaliveRequestBody('{ "keepalive": true }')).toBe(true);
    expect(isKeepaliveRequestBody('{ "keepalive": true, "source": "pg_cron" }')).toBe(true);
  });

  it("does not bypass auth for placement actions or malformed bodies", () => {
    expect(isKeepaliveRequestBody('{ "action": "start" }')).toBe(false);
    expect(isKeepaliveRequestBody('{ "keepalive": false }')).toBe(false);
    expect(isKeepaliveRequestBody("[]")).toBe(false);
    expect(isKeepaliveRequestBody("{")).toBe(false);
  });
});
