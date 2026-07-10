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
  // ── Scale group 1 ──
  // zh-comparative-bi-redundant-degree — drop 很/非常/太 inside a 比 comparative
  ["我比你很高", "我比你高。", "zh-comparative-bi-redundant-degree"],
  ["他比我非常忙", "他比我忙。", "zh-comparative-bi-redundant-degree"],
  ["今天比昨天太冷", "今天比昨天冷。", "zh-comparative-bi-redundant-degree"],
  // zh-de-verb-complement — 的 → 得 before a manner/degree complement
  ["他跑的快", "他跑得快。", "zh-de-verb-complement"],
  ["她说的好", "她说得好。", "zh-de-verb-complement"],
  ["你来的早", "你来得早。", "zh-de-verb-complement"],
  // zh-habitual-le-overmark — drop perfective 了 on a habitual clause
  ["我每天吃了饭", "我每天吃饭。", "zh-habitual-le-overmark"],
  ["他经常看了书", "他经常看书。", "zh-habitual-le-overmark"],
  ["我们常常去了公园", "我们常常去公园。", "zh-habitual-le-overmark"],
  // zh-anot-a-redundant-ma — drop redundant 吗 on an A-not-A question
  ["你是不是学生吗", "你是不是学生。", "zh-anot-a-redundant-ma"],
  ["他有没有钱吗", "他有没有钱。", "zh-anot-a-redundant-ma"],
  ["你要不要茶吗", "你要不要茶。", "zh-anot-a-redundant-ma"],
  // zh-ge-overgeneralization — 个 → correct classifier
  ["我有一个书", "我有一本书。", "zh-ge-overgeneralization"],
  ["他有一个狗", "他有一只狗。", "zh-ge-overgeneralization"],
  ["那个猫很可爱", "那只猫很可爱。", "zh-ge-overgeneralization"],
  // ── Scale group 2 ──
  // zh-tai-adjective-le — 太 + adj → append 了
  ["这个太贵", "这个太贵了。", "zh-tai-adjective-le"],
  ["今天太热", "今天太热了。", "zh-tai-adjective-le"],
  ["他太忙", "他太忙了。", "zh-tai-adjective-le"],
  // zh-mei-verb-le — drop redundant 了 after 没(有) + verb
  ["他没有来了", "他没有来。", "zh-mei-verb-le"],
  ["我没吃了", "我没吃。", "zh-mei-verb-le"],
  ["他们没买了", "他们没买。", "zh-mei-verb-le"],
  // zh-wh-redundant-ma — drop 吗 on a wh-question
  ["你想吃什么吗", "你想吃什么。", "zh-wh-redundant-ma"],
  ["他是谁吗", "他是谁。", "zh-wh-redundant-ma"],
  ["你去哪里吗", "你去哪里。", "zh-wh-redundant-ma"],
  // zh-possessive-de-insert — insert possessive 的
  ["这是我书", "这是我的书。", "zh-possessive-de-insert"],
  ["那是你车", "那是你的车。", "zh-possessive-de-insert"],
  ["这是他手机", "这是他的手机。", "zh-possessive-de-insert"],
  // zh-bare-adjective-hen — insert degree 很
  ["我累", "我很累。", "zh-bare-adjective-hen"],
  ["他忙", "他很忙。", "zh-bare-adjective-hen"],
  ["你高", "你很高。", "zh-bare-adjective-hen"],
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
