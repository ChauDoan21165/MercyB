import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Regression guard for the get_admin_level RPC signature.
//
// Prod (and the repo migrations) define `public.get_admin_level(_user_id uuid)`.
// Calling it with `p_user_id` 404s (PostgREST PGRST202: "Perhaps you meant
// public.get_admin_level(_user_id)"), so the admin-gate callers below silently
// fail closed to level 0 — stripping the admin bypass / elevated quota for a
// real admin (admin_level >= 9). These three callers must always pass `_user_id`.
//
// Out of scope on purpose: `check_ai_budget(p_user_id, ...)` is a DIFFERENT RPC
// whose own signature legitimately uses `p_user_id`; this guard only inspects
// get_admin_level calls, so it never flags it.
const CALLERS = [
  "supabase/functions/ai-chat/index.ts",
  "supabase/functions/azure-phoneme/index.ts",
  "supabase/functions/mock-interview/index.ts",
];

// Matches `rpc("get_admin_level", { <param>:` and captures the first param name.
const GET_ADMIN_LEVEL_CALL = /rpc\(\s*["']get_admin_level["']\s*,\s*\{\s*([A-Za-z_]\w*)\s*:/g;

describe("get_admin_level RPC callers use the prod _user_id signature", () => {
  for (const rel of CALLERS) {
    it(`${rel} passes _user_id to get_admin_level, never p_user_id`, () => {
      const src = readFileSync(resolve(process.cwd(), rel), "utf8");
      const params = [...src.matchAll(GET_ADMIN_LEVEL_CALL)].map((m) => m[1]);

      // The admin-gate caller must still exist (catches accidental removal).
      expect(params.length).toBeGreaterThan(0);
      // Fail-closed regression: the wrong param name must never reappear.
      expect(params).not.toContain("p_user_id");
      expect(params.every((p) => p === "_user_id")).toBe(true);
    });
  }
});
