// supabase/functions/placement-session/__tests__/cefrToRoomServer.test.ts
//
// ANTI-DRIFT GOLDEN for reconstruction flag #1 (PR 9). The URL-free
// server engine cannot import the browser `src/lib/placement/
// cefrToRoom.ts`, so `config.ts:CEFR_TO_ROOM_SERVER` is a hand-mirrored
// copy. This test makes silent divergence IMPOSSIBLE: it deep-equals the
// server map against the browser source of truth. If anyone edits one
// and not the other, CI fails here — exactly the discipline the browser
// `cefrToRoom.test.ts` already applies against public/data/*.json.
//
// vitest (Node) can import both; the browser module's only engine import
// is `import type { ResultCEFR }` (type-only ⇒ erased ⇒ no engine
// runtime is pulled).

import { describe, expect, it } from "vitest";

import { CEFR_TO_ROOM_SERVER } from "../config";
import { CEFR_TO_ROOM, roomForCefr } from "@/lib/placement/cefrToRoom";
import { recommendedRoomFor } from "../core";

describe("CEFR_TO_ROOM_SERVER ⇄ browser cefrToRoom.ts (flag #1 anti-drift)", () => {
  it("is byte-identical to the browser CEFR_TO_ROOM map", () => {
    expect(CEFR_TO_ROOM_SERVER).toEqual(CEFR_TO_ROOM);
  });

  it("covers every CEFR band exactly once (no missing/extra key)", () => {
    expect(Object.keys(CEFR_TO_ROOM_SERVER).sort()).toEqual(
      ["A1", "A2", "B1", "B2", "C1", "C2", "pre_a1"].sort(),
    );
  });

  it("recommendedRoomFor matches the browser roomForCefr for every band", () => {
    for (const band of Object.keys(CEFR_TO_ROOM) as Array<
      keyof typeof CEFR_TO_ROOM
    >) {
      expect(recommendedRoomFor(band)).toBe(roomForCefr(band));
    }
  });
});
