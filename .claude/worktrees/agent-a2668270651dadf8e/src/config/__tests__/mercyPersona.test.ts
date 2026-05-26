// Smoke tests for the Mercy persona config.
//
// We're not testing values for "correctness" (the strings are extracted
// verbatim from the source files), but for shape integrity:
//   - Greetings exist for every required category and have ≥ 2 entries.
//   - Encouragements / fillers don't ship with empty arrays.
//   - VN diacritics survived the file write (catches a UTF-8 mishap).
//   - Code-switch defaults match the existing behaviour of buildAltText.
//   - The template formatter strips/inserts {name} cleanly.

import { describe, it, expect } from "vitest";
import {
  MERCY_PERSONA_CONFIG,
  formatPersonaTemplate,
  pickAfterMistakeLine,
  type MercyGreetingSet,
  type MercyEncouragementMoment,
  type MercyFillerKind,
} from "../mercyPersona";

const ALL_GREETING_SETS: MercyGreetingSet[] = [
  "firstTime",
  "returning",
  "morning",
  "evening",
];
const ALL_ENCOURAGEMENT_MOMENTS: MercyEncouragementMoment[] = [
  "afterMistake",
  "afterCorrect",
  "afterStreak",
];
const ALL_FILLER_KINDS: MercyFillerKind[] = [
  "thinking",
  "acknowledging",
  "closing",
];

describe("greetings", () => {
  for (const set of ALL_GREETING_SETS) {
    it(`'${set}' has at least 2 options`, () => {
      const arr = MERCY_PERSONA_CONFIG.greetings[set];
      expect(Array.isArray(arr)).toBe(true);
      expect(arr.length).toBeGreaterThanOrEqual(2);
    });

    it(`'${set}' entries are all bilingual {en, vi}`, () => {
      for (const g of MERCY_PERSONA_CONFIG.greetings[set]) {
        expect(typeof g.en).toBe("string");
        expect(typeof g.vi).toBe("string");
        expect(g.en.length).toBeGreaterThan(0);
        expect(g.vi.length).toBeGreaterThan(0);
      }
    });
  }
});

describe("encouragements", () => {
  for (const moment of ALL_ENCOURAGEMENT_MOMENTS) {
    it(`'${moment}' has non-empty en + vi arrays`, () => {
      const block = MERCY_PERSONA_CONFIG.encouragements[moment];
      expect(Array.isArray(block.en)).toBe(true);
      expect(Array.isArray(block.vi)).toBe(true);
      expect(block.en.length).toBeGreaterThan(0);
      expect(block.vi.length).toBeGreaterThan(0);
    });
  }

  it("afterMistake has both first-time and repeated variants for both languages", () => {
    const am = MERCY_PERSONA_CONFIG.encouragements.afterMistake;
    expect(am.enRepeated.length).toBeGreaterThan(0);
    expect(am.viRepeated.length).toBeGreaterThan(0);
  });
});

describe("fillers", () => {
  for (const kind of ALL_FILLER_KINDS) {
    it(`'${kind}' has non-empty en + vi arrays`, () => {
      const block = MERCY_PERSONA_CONFIG.fillers[kind];
      expect(block.en.length).toBeGreaterThan(0);
      expect(block.vi.length).toBeGreaterThan(0);
    });
  }
});

describe("VN diacritics intact", () => {
  // The set of characters here comes straight from the encouragements
  // and fillers we extracted. If the file was ever saved as latin-1 or
  // had a BOM-related corruption, the diacritics would degrade and
  // these checks would fail.
  it("preserves precomposed Vietnamese tone marks across encouragements", () => {
    const sample = MERCY_PERSONA_CONFIG.encouragements.afterMistake.vi.join(" ");
    expect(sample).toMatch(/Nhẹ nhàng/);
    expect(sample).toMatch(/bạn gần đúng rồi/);
  });

  it("preserves diacritics across fillers", () => {
    const sample = MERCY_PERSONA_CONFIG.fillers.acknowledging.vi.join(" ");
    expect(sample).toMatch(/Mình ở đây với bạn/);
    expect(sample).toMatch(/Bạn đang làm tốt lắm/);
  });

  it("preserves diacritics across greetings", () => {
    const sample = MERCY_PERSONA_CONFIG.greetings.firstTime
      .map((g) => g.vi)
      .join(" ");
    expect(sample).toMatch(/Chào|chào|Xin chào/);
  });
});

describe("codeSwitch defaults", () => {
  it("allowVNEnglishMix is true (matches existing engine behaviour)", () => {
    expect(MERCY_PERSONA_CONFIG.codeSwitch.allowVNEnglishMix).toBe(true);
  });

  it("vnNextStepMarker is the literal 'Bước tiếp theo:'", () => {
    expect(MERCY_PERSONA_CONFIG.codeSwitch.vnNextStepMarker).toBe(
      "Bước tiếp theo:",
    );
  });

  it("preferredVNTitle defaults to 'bạn'", () => {
    expect(MERCY_PERSONA_CONFIG.codeSwitch.preferredVNTitle).toBe("bạn");
  });
});

describe("identity + voice", () => {
  it("identity.name is 'Mercy'", () => {
    expect(MERCY_PERSONA_CONFIG.identity.name).toBe("Mercy");
  });

  it("voice.useFirstName is true (templates inline {{name}})", () => {
    expect(MERCY_PERSONA_CONFIG.voice.useFirstName).toBe(true);
  });

  it("fallbackName has both EN and VI", () => {
    expect(MERCY_PERSONA_CONFIG.voice.fallbackName.en).toBe("my friend");
    expect(MERCY_PERSONA_CONFIG.voice.fallbackName.vi).toBe("bạn hiền");
  });
});

describe("formatPersonaTemplate", () => {
  it("substitutes {name} when name is provided", () => {
    expect(formatPersonaTemplate("Hi {name}, you're close.", "Linh")).toBe(
      "Hi Linh, you're close.",
    );
  });

  it("strips '{name}, ' cleanly when name is empty", () => {
    expect(formatPersonaTemplate("{name}, you're close.", null)).toBe(
      "you're close.",
    );
    expect(formatPersonaTemplate("{name}, you're close.", "")).toBe(
      "you're close.",
    );
  });

  it("strips ', {name}' tail cleanly", () => {
    expect(
      formatPersonaTemplate("Nhẹ nhàng thôi, {name}, bạn gần đúng rồi.", null),
    ).toBe("Nhẹ nhàng thôi, bạn gần đúng rồi.");
  });

  it("trims excess whitespace after stripping", () => {
    expect(formatPersonaTemplate("Hi  {name}  there", null)).toBe("Hi there");
  });
});

describe("pickAfterMistakeLine", () => {
  it("returns name-aware EN line when name provided, non-repeat", () => {
    expect(pickAfterMistakeLine("en", "Linh", false)).toContain("Linh");
  });

  it("returns anonymous EN line when name is empty, non-repeat", () => {
    expect(pickAfterMistakeLine("en", null, false)).toBe("You're close.");
  });

  it("returns repeated VN line for repeated mistakes", () => {
    expect(pickAfterMistakeLine("vi", "Linh", true)).toBe(
      "Hãy ôn lại phần này thêm một lần nữa.",
    );
  });

  it("returns name-aware VN line when name provided, non-repeat", () => {
    const line = pickAfterMistakeLine("vi", "Linh", false);
    expect(line).toContain("Linh");
    expect(line).toContain("Nhẹ nhàng thôi");
  });
});
