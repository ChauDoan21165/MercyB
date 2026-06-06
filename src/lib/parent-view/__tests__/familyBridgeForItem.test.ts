import { describe, expect, it } from "vitest";

import { familyBridgeForItemKey } from "../familyBridgeForItem";
import { VI_GRAMMAR_FAMILY_BRIDGE } from "@/lib/feedback/family-bridge/vi-grammar";

describe("familyBridgeForItemKey", () => {
  it("resolves a validated grammar explainer for an approved pilot tag", () => {
    const e = familyBridgeForItemKey("grammar:vi_l1_3rd_person_s");
    expect(e).not.toBeNull();
    expect(e?.tag).toBe("vi_l1_3rd_person_s");
    expect(e?.validated).toBe(true);
    expect((e?.whyVi ?? "").length).toBeGreaterThan(0);
    expect((e?.howToHelpVi ?? "").length).toBeGreaterThan(0);
  });

  it("NEVER returns an unvalidated entry (the gate is enforced at read)", () => {
    // Self-updating against the data: validated entries resolve, pending
    // (validated:false) entries return null — survives future sign-off flips.
    for (const entry of VI_GRAMMAR_FAMILY_BRIDGE) {
      const got = familyBridgeForItemKey(`grammar:${entry.tag}`);
      if (entry.validated) {
        expect(got?.tag).toBe(entry.tag);
      } else {
        expect(got).toBeNull();
      }
    }
  });

  it("returns null for unknown tags and malformed keys", () => {
    expect(familyBridgeForItemKey("grammar:vi_l1_does_not_exist")).toBeNull();
    expect(familyBridgeForItemKey("nocolon")).toBeNull();
    expect(familyBridgeForItemKey("grammar:")).toBeNull();
    expect(familyBridgeForItemKey("")).toBeNull();
  });
});
