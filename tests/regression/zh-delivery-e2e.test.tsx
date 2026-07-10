import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLocalCorrection } from "@/pages/AiTutor";

/**
 * Phase B acceptance gate — VN→Chinese DELIVERY, end-to-end through the live
 * turn-loop seam.
 *
 * This test does NOT call the rule engine directly. It calls
 * `buildLocalCorrection(input, "zh")` — the exact function the AI Tutor submit
 * handler invokes (src/pages/AiTutor.tsx, the `const localCorrection =
 * buildLocalCorrection(trimmed, target)` seam) — so a green here proves that a
 * Chinese learner's input flows through the wired delivery path and comes back
 * as a real correction, flag-gated. This is the proof Chau can trust WITHOUT
 * reading Chinese: the assertions carry correctness.
 *
 * Every expected output was captured from the live engine (see the zh-*.json
 * golden fixtures); nothing here is hand-traced.
 */

// One case per rule × its captured positives. [input, expectedCorrected, ruleId].
const ZH_DELIVERY_CASES: ReadonlyArray<readonly [string, string, string]> = [
  // zh-er-liang-measure — 二 → 两 before a measure word
  ["我要二个", "我要两个。", "zh-er-liang-measure"],
  ["他有二本书", "他有两本书。", "zh-er-liang-measure"],
  ["买二斤茶", "买两斤茶。", "zh-er-liang-measure"],
  // zh-missing-classifier-shu — insert 本 before 书
  ["我有三书", "我有三本书。", "zh-missing-classifier-shu"],
  ["他买了五书", "他买了五本书。", "zh-missing-classifier-shu"],
  ["桌上有两书", "桌上有两本书。", "zh-missing-classifier-shu"],
  // zh-shi-adjective-hen — 是 + adjective → 很 + adjective
  ["我是高", "我很高。", "zh-shi-adjective-hen"],
  ["他是忙", "他很忙。", "zh-shi-adjective-hen"],
  ["她是累", "她很累。", "zh-shi-adjective-hen"],
  // zh-past-negation-bu-mei — completed-event 不 → 没
  ["昨天我不去", "昨天我没去。", "zh-past-negation-bu-mei"],
  ["刚才他不吃", "刚才他没吃。", "zh-past-negation-bu-mei"],
  ["前天我不买", "前天我没买。", "zh-past-negation-bu-mei"],
  // zh-locative-localizer — append postposed localizer after 在
  ["书在桌子", "书在桌子上。", "zh-locative-localizer"],
  ["猫在床", "猫在床上。", "zh-locative-localizer"],
  ["钱在盒子", "钱在盒子里。", "zh-locative-localizer"],
];

describe("Phase B — VN→Chinese delivery E2E (turn-loop seam)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("flag ON: zh corrections are delivered through the wired seam", () => {
    for (const [input, expectedCorrected, ruleId] of ZH_DELIVERY_CASES) {
      it(`delivers "${input}" → "${expectedCorrected}" (${ruleId})`, () => {
        vi.stubEnv("VITE_AI_TUTOR_ZH_CORRECTION_ENABLED", "true");
        const result = buildLocalCorrection(input, "zh");
        expect(result.ok, `seam returned not-ok for "${input}"`).toBe(true);
        if (!result.ok) return; // narrow for TS
        expect(result.status).toBe("corrected");
        expect(result.corrected).toBe(expectedCorrected);
        expect(result.appliedRuleIds).toContain(ruleId);
      });
    }
  });

  describe("flag OFF (production default): the engine is NOT wired for zh", () => {
    it("does not run the correction engine — english/default delivery unaffected", () => {
      // No stub → flag defaults OFF.
      const result = buildLocalCorrection("我是高", "zh");
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      // Legacy non-engine path fires: no engine rule id is attached.
      expect(result.appliedRuleIds).toHaveLength(0);
      expect(result.appliedRuleIds).not.toContain("zh-shi-adjective-hen");
    });

    it("leaves the English delivery path fully intact regardless of the flag", () => {
      // en is handled by the untouched first branch — never gated by the zh flag.
      const result = buildLocalCorrection("He said me the news", "en");
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.corrected).toBe("He told me the news.");
      expect(result.appliedRuleIds).toContain("en-vietlish-say-tell-person");
    });
  });
});
