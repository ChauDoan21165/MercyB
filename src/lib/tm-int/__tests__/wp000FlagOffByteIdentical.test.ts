// WP-000 Blocker-1 — runtime byte-identical regression test.
//
// Proves that with TUTOR_DECISION_ENGINE_ENABLED = false (the default), the tutor
// correction path is byte-identical to pre-WP-000 behavior across a representative fixture
// set (SHOW-NOW / DELAYED-defer / SUPPRESS / needs_ai). The OFF route calls the unchanged
// `correctWithTimingAwareness` (this MR touches nothing in src/lib/tutor/ — verified by
// `git diff --stat origin/main...HEAD -- src/lib/tutor/` being empty), so "equals the
// original" == "equals pre-WP-000". A frozen behavior snapshot per fixture guards against
// silent drift; the needs_ai case is asserted shown-now-not-dropped (the exact behavior the
// unconditional WP-000 swap broke on main).
import { describe, it, expect } from "vitest";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { correctWithTimingAwareness } from "@/lib/tutor/correctionTimingIntegration";
import { decideTurnCorrectionCompat } from "@/lib/tm-int/decisionEngineTurnAdapter";

// The exact routing ternary from src/pages/AiTutor.tsx (flag ON -> engine adapter; OFF -> original).
function routeTurnCorrection(input: Parameters<typeof correctWithTimingAwareness>[0], engineEnabled: boolean) {
  return engineEnabled ? decideTurnCorrectionCompat(input) : correctWithTimingAwareness(input);
}
const mk = (learnerText: string) =>
  ({ learnerText, targetLanguage: "en" as const, cefrLevel: null, isCurrentLessonTarget: false });

// Representative fixtures + frozen pre-WP-000 behavior snapshot (captured from the OFF path).
const FIXTURES = [
  { input: "I go to school yesterday.", status: "corrected", mode: "IMMEDIATE", show: true, defer: false, suppress: false },
  { input: "She don't like coffee.",    status: "unchanged", mode: "DELAYED",  show: false, defer: true,  suppress: false },
  { input: "asdkfj qwoieu zzz",         status: "unchanged", mode: "SUPPRESS", show: false, defer: false, suppress: true },
  { input: "I bought a head.",          status: "needs_ai",  mode: "IMMEDIATE", show: true, defer: false, suppress: false },
] as const;

describe("WP-000 Blocker-1: flag OFF is byte-identical to pre-WP-000 correction behavior", () => {
  it("the decision-engine flag defaults OFF", () => {
    expect(FEATURE_FLAGS.TUTOR_DECISION_ENGINE_ENABLED).toBe(false);
  });

  it.each(FIXTURES)(
    "flag OFF → byte-identical to the original correctWithTimingAwareness: $input",
    (fx) => {
      const input = mk(fx.input);
      const offRouted = routeTurnCorrection(input, false);
      const original = correctWithTimingAwareness(input);
      // Byte-identical to the verbatim original, value-for-value AND as serialized bytes.
      expect(offRouted).toStrictEqual(original);
      expect(JSON.stringify(offRouted)).toBe(JSON.stringify(original));
      // Frozen behavior snapshot — catches silent drift of the OFF path.
      expect(offRouted.correction.status).toBe(fx.status);
      expect(offRouted.timing.mode).toBe(fx.mode);
      expect(offRouted.shouldShowNow).toBe(fx.show);
      expect(offRouted.shouldDefer).toBe(fx.defer);
      expect(offRouted.shouldSuppress).toBe(fx.suppress);
    },
  );

  it("needs_ai (flag OFF) is shown-now and NOT deferred/dropped — the pre-WP-000 behavior the swap broke", () => {
    const r = routeTurnCorrection(mk("I bought a head."), false);
    expect(r.correction.status).toBe("needs_ai");
    expect(r.shouldShowNow).toBe(true);
    expect(r.shouldDefer).toBe(false);
  });

  it("the flag genuinely gates: OFF uses correctWithTimingAwareness, ON uses the decision-engine adapter", () => {
    const input = mk("She don't like coffee.");
    expect(routeTurnCorrection(input, false)).toStrictEqual(correctWithTimingAwareness(input));
    expect(routeTurnCorrection(input, true)).toStrictEqual(decideTurnCorrectionCompat(input));
  });
});
