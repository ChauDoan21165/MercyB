import { describe, expect, it } from "vitest";
import {
  scoreEssayForVietnameseLearner,
} from "../scoreEssayVN";
import {
  VN_WRITING_PATTERNS,
  findVnPatternById,
} from "../vn-writing-patterns";
import { VN_BAND_RUBRIC, snapToHalfBand } from "../vn-band-rubric";

function detected(feedback: ReturnType<typeof scoreEssayForVietnameseLearner>, id: string) {
  return feedback.detectedPatterns.some((p) => p.pattern.id === id);
}

describe("VN_WRITING_PATTERNS catalogue", () => {
  it("ships at least 20 patterns with bilingual fields and examples", () => {
    expect(VN_WRITING_PATTERNS.length).toBeGreaterThanOrEqual(20);
    for (const p of VN_WRITING_PATTERNS) {
      expect(p.vi_name.trim().length).toBeGreaterThan(0);
      expect(p.en_name.trim().length).toBeGreaterThan(0);
      expect(p.description_vi.trim().length).toBeGreaterThan(0);
      expect(p.description_en.trim().length).toBeGreaterThan(0);
      expect(p.examples.length).toBeGreaterThanOrEqual(1);
      for (const ex of p.examples) {
        expect(ex.wrong.trim()).not.toBe(ex.correct.trim());
        expect(ex.why_vi.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("findVnPatternById returns the right entry", () => {
    expect(findVnPatternById("missing_articles")?.en_name).toMatch(/article/i);
    expect(findVnPatternById("nope_unknown")).toBeUndefined();
  });
});

describe("VN_BAND_RUBRIC + snapToHalfBand", () => {
  it("covers 11 bands from 4.0 to 9.0", () => {
    expect(VN_BAND_RUBRIC).toHaveLength(11);
    expect(VN_BAND_RUBRIC[0].band).toBe(4.0);
    expect(VN_BAND_RUBRIC[VN_BAND_RUBRIC.length - 1].band).toBe(9.0);
  });

  it("each row is bilingual with a non-empty timeline", () => {
    for (const row of VN_BAND_RUBRIC) {
      expect(row.strengths_vi.trim().length).toBeGreaterThan(20);
      expect(row.next_half_band_steps_vi.trim().length).toBeGreaterThan(20);
      expect(row.next_half_band_weeks).toBeGreaterThanOrEqual(0);
    }
  });

  it("snaps within range", () => {
    expect(snapToHalfBand(7.3)).toBe(7.5);
    expect(snapToHalfBand(7.1)).toBe(7.0);
    expect(snapToHalfBand(2.0)).toBe(4.0);
    expect(snapToHalfBand(11.0)).toBe(9.0);
    expect(snapToHalfBand(NaN)).toBe(4.0);
  });
});

describe("scoreEssayForVietnameseLearner — empty / minimal input", () => {
  it("returns a 4.0 band on empty input without crashing", () => {
    const r = scoreEssayForVietnameseLearner("");
    expect(r.estimatedBand).toBe(4.0);
    expect(r.detectedPatterns).toHaveLength(0);
    expect(r.bandRubric?.band).toBe(4.0);
  });

  it("returns deterministic output for the same input", () => {
    const text = "Pollution is bad. The government is responsible.";
    const a = scoreEssayForVietnameseLearner(text);
    const b = scoreEssayForVietnameseLearner(text);
    expect(a.estimatedBand).toBe(b.estimatedBand);
    expect(a.detectedPatterns.length).toBe(b.detectedPatterns.length);
  });
});

describe("VN pattern detection — high-precision rules", () => {
  it("detects double comparative", () => {
    const r = scoreEssayForVietnameseLearner(
      "Online learning is more easier than traditional classes for many students.",
    );
    expect(detected(r, "comparison_structure_double")).toBe(true);
  });

  it("detects plural inconsistency on numbered nouns", () => {
    const r = scoreEssayForVietnameseLearner(
      "Many student fail the exam. Several teacher complained.",
    );
    expect(detected(r, "plural_inconsistency")).toBe(true);
  });

  it("detects collective subject-verb agreement (the government are)", () => {
    const r = scoreEssayForVietnameseLearner(
      "The government are responsible for clean air. The team are working hard.",
    );
    expect(detected(r, "subject_verb_agreement_collective")).toBe(true);
  });

  it("detects uncountable-as-countable misuse", () => {
    const r = scoreEssayForVietnameseLearner(
      "She gave me many useful informations. I need an advice from a teacher.",
    );
    expect(detected(r, "uncountable_treated_countable")).toBe(true);
  });

  it("detects informal register markers (contractions, 'I think', 'kids')", () => {
    const r = scoreEssayForVietnameseLearner(
      "I think kids don't read enough books. A lot of parents agree.",
    );
    expect(detected(r, "informal_register_in_essay")).toBe(true);
  });

  it("detects overused furthermore/moreover/in addition", () => {
    const essay = `
Furthermore, education is important.

Moreover, it brings opportunities.

In addition, it changes lives.
`;
    const r = scoreEssayForVietnameseLearner(essay);
    expect(detected(r, "overused_furthermore")).toBe(true);
  });

  it("detects 'and then' chains", () => {
    const r = scoreEssayForVietnameseLearner(
      "I woke up and then I had breakfast and then I went to work and then I studied.",
    );
    expect(detected(r, "and_then_chain")).toBe(true);
  });

  it("detects fronted Because fragments", () => {
    const r = scoreEssayForVietnameseLearner(
      "Many people fall sick.\nBecause air pollution is bad.\nThis is a problem.",
    );
    expect(detected(r, "fronted_because_fragment")).toBe(true);
  });

  it("detects literal-Vietnamese idioms (eat full and warm)", () => {
    const r = scoreEssayForVietnameseLearner(
      "We must eat full and warm before we can study.",
    );
    expect(detected(r, "literal_translation_idioms")).toBe(true);
  });

  it("detects 'always/never' overuse when there is no hedging", () => {
    const r = scoreEssayForVietnameseLearner(
      "Students always cheat. Teachers always punish them. Parents never know what is happening at school.",
    );
    expect(detected(r, "always_never_overuse")).toBe(true);
  });

  it("detects under-developed body paragraphs in a 3-paragraph essay", () => {
    const essay =
      "I strongly agree with the statement. There are several reasons that support this view.\n\nThe first reason is cost.\n\nIn conclusion, the policy is justified by the points above.";
    const r = scoreEssayForVietnameseLearner(essay);
    expect(detected(r, "under_developed_body")).toBe(true);
  });

  it("detects thesis-in-conclusion structure (no opinion in intro, opinion in conclusion)", () => {
    const essay =
      "Education is a topic many people discuss every day. It has been written about for centuries.\n\nMany examples show how schools work today.\n\nIn my opinion, I strongly agree that education should be free for all.";
    const r = scoreEssayForVietnameseLearner(essay);
    expect(detected(r, "thesis_in_conclusion")).toBe(true);
  });
});

describe("scoreEssayForVietnameseLearner — band estimate", () => {
  it("a strong essay scores higher than a weak essay", () => {
    const weak = "I think kids don't read books. Many student fail. The team are bad.";
    const strong = `Education plays a central role in shaping a society. While many factors contribute to a country's prosperity, the quality of public schooling tends to be the most reliable lever for long-term improvement.

To begin with, well-funded schools generally produce graduates who can adapt to changing labour markets. For example, countries that invested in vocational training during the 1990s — Singapore, Germany, and South Korea — now show measurably higher productivity than peers that delayed such reforms. The lesson is that education shapes economic resilience over decades.

There are, however, limits. Schooling alone cannot address inequality if other factors, such as parental income or housing, undermine students at home. A balanced approach therefore combines investment in schools with broader social support.

In conclusion, education remains a critical lever, though one that works best alongside complementary policies. Governments would be wise to treat it as a foundation rather than a complete solution.`;
    const weakBand = scoreEssayForVietnameseLearner(weak).estimatedBand;
    const strongBand = scoreEssayForVietnameseLearner(strong).estimatedBand;
    expect(strongBand).toBeGreaterThan(weakBand);
  });

  it("clamps to the 4.0–9.0 range and snaps to 0.5 steps", () => {
    const r = scoreEssayForVietnameseLearner("");
    expect(r.estimatedBand).toBe(4.0);
    const all = VN_BAND_RUBRIC.map((b) => b.band);
    expect(all).toContain(r.estimatedBand);
  });
});

describe("scoreEssayForVietnameseLearner — revision suggestions", () => {
  it("returns at most 3 ranked suggestions", () => {
    const essay =
      "Many student is bad at writing. The government are wrong. I think kids don't try harder. More easier solutions are better.";
    const r = scoreEssayForVietnameseLearner(essay);
    expect(r.topRevisions.length).toBeLessThanOrEqual(3);
    for (const rev of r.topRevisions) {
      expect(rev.vi.trim().length).toBeGreaterThan(0);
      expect(rev.priority).toBeGreaterThan(0);
    }
  });

  it("includes a global band-rubric advice item even when no patterns fire", () => {
    const r = scoreEssayForVietnameseLearner("This is a short clean essay with no obvious VN errors.");
    const globalAdvice = r.topRevisions.find((rev) => rev.patternId === "global");
    expect(globalAdvice).toBeDefined();
  });
});
