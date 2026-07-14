import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("supabase/functions/room-health-auto-fix/index.ts", "utf8");
const handlerSource = source.slice(source.indexOf("serve(async (req) =>"));

describe("room-health-auto-fix auth gate", () => {
  it("requires the admin cron secret before parsing the mutation request", () => {
    const secretRead = handlerSource.indexOf('Deno.env.get("ADMIN_CRON_SECRET")');
    const headerRead = handlerSource.indexOf('req.headers.get("x-cron-secret")');
    const unauthorized = handlerSource.indexOf('"unauthorized"');
    const bodyParse = handlerSource.indexOf("await req.json()");
    const roomSelect = handlerSource.indexOf('.select("id, slug, tier, raw_json")');

    expect(secretRead).toBeGreaterThan(-1);
    expect(headerRead).toBeGreaterThan(secretRead);
    expect(unauthorized).toBeGreaterThan(headerRead);
    expect(bodyParse).toBeGreaterThan(unauthorized);
    expect(roomSelect).toBeGreaterThan(bodyParse);
  });
});
