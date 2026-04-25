// src/lib/feedback/__tests__/dialect-detection.test.ts
//
// Pure-function tests for the dialect detector + per-rule classifiers.
// No mocks; the heuristic is deterministic, so the same inputs always
// yield the same outputs.

import { describe, it, expect } from "vitest";
import {
  classifyDialectPronunciation,
  classifyDialectSpellingError,
  detectVNDialect,
  getDialectAwareNote,
  VN_DIALECT_EXPLANATIONS,
  VN_DIALECT_RULES,
  type DialectSignals,
  type VNDialectErrorTag,
} from "../dialect-detection.js";

// ── Spelling classifier — Northern ─────────────────────────────────────

describe("classifyDialectSpellingError — Northern", () => {
  it("flags 'sink' for 'think' as th/s confusion", () => {
    const r = classifyDialectSpellingError("sink", "think");
    expect(r?.tag).toBe("vn_north_th_s_confusion");
  });

  it("flags 'sanks' for 'thanks' as th/s confusion", () => {
    const r = classifyDialectSpellingError("sanks", "thanks");
    expect(r?.tag).toBe("vn_north_th_s_confusion");
  });

  it("flags 'zight' for 'right' as r→z", () => {
    const r = classifyDialectSpellingError("zight", "right");
    expect(r?.tag).toBe("vn_north_r_to_z");
  });

  it("flags 'light' for 'right' as r→l", () => {
    const r = classifyDialectSpellingError("light", "right");
    expect(r?.tag).toBe("vn_north_r_to_l");
  });

  it("flags 'vant' for 'want' as v↔w swap", () => {
    const r = classifyDialectSpellingError("vant", "want");
    expect(r?.tag).toBe("vn_north_v_w_swap");
  });
});

// ── Spelling classifier — Southern ─────────────────────────────────────

describe("classifyDialectSpellingError — Southern", () => {
  it("flags 'righ' for 'right' as final-/-t/ drop", () => {
    const r = classifyDialectSpellingError("righ", "right");
    expect(r?.tag).toBe("vn_south_final_t_drop");
  });

  it("flags 'wha' for 'what' as final-/-t/ drop", () => {
    const r = classifyDialectSpellingError("wha", "what");
    expect(r?.tag).toBe("vn_south_final_t_drop");
  });

  it("flags 'goo' for 'good' as final-/-d/ drop", () => {
    const r = classifyDialectSpellingError("goo", "good");
    expect(r?.tag).toBe("vn_south_final_d_drop");
  });

  it("flags 'loo' for 'look' as final-/-k/ drop or /-d/ drop", () => {
    const r = classifyDialectSpellingError("loo", "look");
    expect(r?.dialect).toBe("southern");
  });

  it("flags 'thin' for 'thing' as /-n/ ↔ /-ng/ merge", () => {
    const r = classifyDialectSpellingError("thin", "thing");
    expect(r?.tag).toBe("vn_south_n_ng_merge");
  });

  it("flags 'yery' for 'very' as v→y", () => {
    const r = classifyDialectSpellingError("yery", "very");
    expect(r?.tag).toBe("vn_south_v_to_y");
  });
});

// ── Negative cases ─────────────────────────────────────────────────────

describe("classifyDialectSpellingError — negatives", () => {
  it("returns null for an unrelated typo", () => {
    expect(classifyDialectSpellingError("becouse", "because")).toBeNull();
  });

  it("returns null for an empty wrong-string", () => {
    expect(classifyDialectSpellingError("", "right")).toBeNull();
  });

  it("returns null when wrong === intended (no error)", () => {
    expect(classifyDialectSpellingError("right", "right")).toBeNull();
  });
});

// ── Pronunciation classifier ───────────────────────────────────────────

describe("classifyDialectPronunciation", () => {
  it("flags spoken 'sink' for target 'think' as th/s confusion", () => {
    const r = classifyDialectPronunciation("sink", "think");
    expect(r?.tag).toBe("vn_north_th_s_confusion");
  });

  it("flags spoken 'zight' for target 'right' as r→z", () => {
    const r = classifyDialectPronunciation("zight", "right");
    expect(r?.tag).toBe("vn_north_r_to_z");
  });

  it("flags spoken 'yery' for target 'very' as v→y (Southern)", () => {
    const r = classifyDialectPronunciation("yery", "very");
    expect(r?.tag).toBe("vn_south_v_to_y");
  });

  it("returns null for a non-pattern substitution", () => {
    expect(classifyDialectPronunciation("apple", "orange")).toBeNull();
  });
});

// ── Detector — pure self-report path ───────────────────────────────────

describe("detectVNDialect — self-report only", () => {
  it("maps 'north' to northern at floor confidence 0.65", () => {
    const r = detectVNDialect({ selfReportedRegion: "north" });
    expect(r.dialect).toBe("northern");
    expect(r.confidence).toBe(0.65);
  });

  it("maps 'south' to southern", () => {
    const r = detectVNDialect({ selfReportedRegion: "south" });
    expect(r.dialect).toBe("southern");
  });

  it("maps 'central' to central", () => {
    const r = detectVNDialect({ selfReportedRegion: "central" });
    expect(r.dialect).toBe("central");
  });

  it("maps 'diaspora' to unknown", () => {
    const r = detectVNDialect({ selfReportedRegion: "diaspora" });
    expect(r.dialect).toBe("unknown");
  });

  it("returns unknown @ confidence 0 when nothing is supplied", () => {
    const r = detectVNDialect({});
    expect(r.dialect).toBe("unknown");
    expect(r.confidence).toBe(0);
  });
});

// ── Detector — Northern signal-driven ──────────────────────────────────

describe("detectVNDialect — Northern signals", () => {
  it("detects northern from a single strong spelling marker", () => {
    const r = detectVNDialect({
      spellingErrors: [{ wrong: "zight", intended: "right" }],
    });
    expect(r.dialect).toBe("northern");
    expect(r.confidence).toBeGreaterThanOrEqual(0.4);
    expect(r.evidence.northern).toBe(1);
  });

  it("scales confidence with multiple Northern markers", () => {
    const sig: DialectSignals = {
      spellingErrors: [
        { wrong: "zight", intended: "right" },
        { wrong: "sink", intended: "think" },
        { wrong: "vant", intended: "want" },
        { wrong: "light", intended: "right" },
        { wrong: "sanks", intended: "thanks" },
      ],
    };
    const r = detectVNDialect(sig);
    expect(r.dialect).toBe("northern");
    expect(r.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("self-report north + Northern markers boosts confidence", () => {
    const r = detectVNDialect({
      selfReportedRegion: "north",
      spellingErrors: [
        { wrong: "zight", intended: "right" },
        { wrong: "sink", intended: "think" },
      ],
    });
    expect(r.dialect).toBe("northern");
    expect(r.confidence).toBeGreaterThanOrEqual(0.7);
  });

  it("counts pronunciation samples toward Northern", () => {
    const r = detectVNDialect({
      pronunciationSamples: [
        { spoken: "zight", target: "right" },
        { spoken: "sink", target: "think" },
      ],
    });
    expect(r.dialect).toBe("northern");
    expect(r.evidence.northern).toBe(2);
  });
});

// ── Detector — Southern signal-driven ──────────────────────────────────

describe("detectVNDialect — Southern signals", () => {
  it("detects southern from final-consonant-drop markers", () => {
    const r = detectVNDialect({
      spellingErrors: [
        { wrong: "righ", intended: "right" },
        { wrong: "goo", intended: "good" },
      ],
    });
    expect(r.dialect).toBe("southern");
    expect(r.evidence.southern).toBeGreaterThanOrEqual(2);
  });

  it("high confidence with 5 strong Southern markers", () => {
    const sig: DialectSignals = {
      spellingErrors: [
        { wrong: "righ", intended: "right" },
        { wrong: "goo", intended: "good" },
        { wrong: "loo", intended: "look" },
        { wrong: "thin", intended: "thing" },
        { wrong: "wha", intended: "what" },
      ],
    };
    const r = detectVNDialect(sig);
    expect(r.dialect).toBe("southern");
    expect(r.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("self-report south alone yields southern @ floor", () => {
    const r = detectVNDialect({ selfReportedRegion: "south" });
    expect(r.dialect).toBe("southern");
    expect(r.confidence).toBe(0.65);
  });
});

// ── Detector — conflicting signals ─────────────────────────────────────

describe("detectVNDialect — conflicts + edges", () => {
  it("trusts markers over self-report when they disagree", () => {
    const r = detectVNDialect({
      selfReportedRegion: "north",
      spellingErrors: [
        { wrong: "righ", intended: "right" },
        { wrong: "goo", intended: "good" },
        { wrong: "wha", intended: "what" },
        { wrong: "loo", intended: "look" },
      ],
    });
    expect(r.dialect).toBe("southern");
    // Diaspora penalty caps the confidence so the UI can degrade
    expect(r.confidence).toBeLessThanOrEqual(0.55);
  });

  it("ties between northern and southern → unknown @ low confidence", () => {
    const r = detectVNDialect({
      spellingErrors: [
        { wrong: "zight", intended: "right" },
        { wrong: "righ", intended: "right" },
      ],
    });
    expect(r.dialect).toBe("unknown");
    expect(r.confidence).toBeLessThanOrEqual(0.5);
  });

  it("tie + self-report breaks the tie at 0.5 confidence", () => {
    const r = detectVNDialect({
      selfReportedRegion: "north",
      spellingErrors: [
        { wrong: "zight", intended: "right" },
        { wrong: "righ", intended: "right" },
      ],
    });
    expect(r.dialect).toBe("northern");
    expect(r.confidence).toBe(0.5);
  });

  it("returns confidence in [0, 1]", () => {
    const r = detectVNDialect({
      spellingErrors: Array.from({ length: 12 }, () => ({
        wrong: "zight",
        intended: "right",
      })),
    });
    expect(r.confidence).toBeGreaterThanOrEqual(0);
    expect(r.confidence).toBeLessThanOrEqual(1);
  });

  it("ignores spelling errors that don't match any rule", () => {
    const r = detectVNDialect({
      spellingErrors: [
        { wrong: "becouse", intended: "because" },
        { wrong: "tommorow", intended: "tomorrow" },
      ],
    });
    expect(r.dialect).toBe("unknown");
    expect(r.evidence.northern).toBe(0);
    expect(r.evidence.southern).toBe(0);
  });

  it("handles empty spelling-errors + empty pronunciation arrays", () => {
    const r = detectVNDialect({
      spellingErrors: [],
      pronunciationSamples: [],
    });
    expect(r.dialect).toBe("unknown");
    expect(r.confidence).toBe(0);
  });
});

// ── Explanations + dialect notes ──────────────────────────────────────

describe("VN_DIALECT_EXPLANATIONS", () => {
  it("has an entry for every dialect-rule tag", () => {
    for (const rule of VN_DIALECT_RULES) {
      expect(VN_DIALECT_EXPLANATIONS[rule.tag]).toBeDefined();
    }
  });

  it("every entry sets a dialect_note", () => {
    for (const tag of Object.keys(VN_DIALECT_EXPLANATIONS) as VNDialectErrorTag[]) {
      expect(VN_DIALECT_EXPLANATIONS[tag].dialect_note?.length).toBeGreaterThan(0);
    }
  });

  it("getDialectAwareNote returns the dialect_note for a known tag", () => {
    const note = getDialectAwareNote("vn_south_final_t_drop");
    expect(note).toContain("miền Nam");
  });

  it("each explanation_vi stays under the L1 mobile budget (300 chars)", () => {
    const MAX = 300;
    for (const tag of Object.keys(VN_DIALECT_EXPLANATIONS) as VNDialectErrorTag[]) {
      expect(VN_DIALECT_EXPLANATIONS[tag].explanation_vi.length).toBeLessThanOrEqual(MAX);
    }
  });
});
