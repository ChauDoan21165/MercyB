import { describe, expect, it } from "vitest";
import { strictTierFromIdOrPath } from "../tierRoomSource";

// Regression guard for the CEFR→Level fix: the English spine (a1..c2 +
// foundation) is free content with no vip/level token in its id. Before this
// rule those ids resolved to "unknown" and inherited the corrupted DB
// rooms.tier column. They must now be self-describing as level0 by id.
// CEFR (A1–C2) stays an orthogonal axis — it is NOT mapped onto the access
// ladder. The english_specialization_*_vip3_ii carve-out keeps its level3
// (its vip3 token is parsed earlier and intentionally wins).
describe("strictTierFromIdOrPath — English CEFR spine → level0", () => {
  it("english_a1_a101 → level0", () => {
    expect(strictTierFromIdOrPath("english_a1_a101")).toBe("level0");
  });

  it("resolves the same through a data/*.json path (real call shape)", () => {
    expect(strictTierFromIdOrPath("data/english_a1_a101.json")).toBe("level0");
  });

  it.each([
    ["english_a2_a201"],
    ["english_b1_b101"],
    ["english_b2_b201"],
    ["english_c1_c101"],
    ["english_c2_c201"],
    ["english_foundation_ef01"],
  ])("%s → level0 (every band + foundation is free)", (id) => {
    expect(strictTierFromIdOrPath(id)).toBe("level0");
  });

  it("english_specialization_mastery_vip3_ii → level3 (vip3 token precedence still wins)", () => {
    // Chau locked this carve-out: the vip3 token is parsed before the english
    // rule, so this resolves to level3 (the TierId vip3 normalizes to), NOT level0.
    expect(strictTierFromIdOrPath("english_specialization_mastery_vip3_ii")).toBe("level3");
  });

  it("english_specialization_mastery_module2_vip3_ii → level3 (other carve-out file)", () => {
    expect(strictTierFromIdOrPath("english_specialization_mastery_module2_vip3_ii")).toBe("level3");
  });

  it("non-english room with a vip token is unaffected (no bleed): addiction_support_vip1 → level1", () => {
    expect(strictTierFromIdOrPath("addiction_support_vip1")).toBe("level1");
  });

  it("non-english tokenless room still falls through to the unknown/DB fallback: matchmaker_traits → unknown", () => {
    expect(strictTierFromIdOrPath("matchmaker_traits")).toBe("unknown");
  });
});
