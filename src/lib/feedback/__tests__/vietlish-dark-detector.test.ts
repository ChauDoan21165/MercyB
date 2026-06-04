import { describe, expect, it, vi } from "vitest";
import {
  detectVietlishDark,
  runVietlishDarkSeed,
  isVietlishDarkSeedEnabled,
  type VietlishDarkPatternId,
} from "../vietlish-dark-detector.js";

// ── Helpers ────────────────────────────────────────────────────────────────
function expectFires(text: string, patternId: VietlishDarkPatternId) {
  const sig = detectVietlishDark(text);
  const ids = sig.map((s) => s.patternId);
  expect(ids, `expected ${patternId} to fire on "${text}" — got [${ids.join(", ")}]`).toContain(
    patternId,
  );
}
function expectAbstains(text: string) {
  const sig = detectVietlishDark(text);
  expect(sig, `expected NO Vietlish signal on "${text}" — got [${sig.map((s) => s.patternId).join(", ")}]`).toHaveLength(
    0,
  );
}

// ── Detector: positives (grammatically valid, unnatural via VN transfer) ────
describe("detectVietlishDark — positives", () => {
  it("opinion calque: 'according to me/us'", () => {
    expectFires("According to me, this film is very good.", "vietlish-opinion-calque");
    expectFires("According to us, the plan is fine.", "vietlish-opinion-calque");
    expectFires("The result, according to me, is unfair.", "vietlish-opinion-calque");
  });

  it("resumptive topic pronoun: '<NP>, it/they <be> ...'", () => {
    expectFires("My hometown, it is very beautiful.", "vietlish-resumptive-topic");
    expectFires("My family, they are very kind.", "vietlish-resumptive-topic");
    expectFires("The weather here, it was terrible yesterday.", "vietlish-resumptive-topic");
  });

  it("play + device/app: 'play the phone / play Facebook'", () => {
    expectFires("I play the phone every night before sleep.", "vietlish-play-device");
    expectFires("She plays Facebook all day.", "vietlish-play-device");
    expectFires("My brother plays computer after school.", "vietlish-play-device");
  });

  it("too + praise adjective: 'too delicious' (quá)", () => {
    expectFires("This pho is too delicious!", "vietlish-too-as-praise");
    expectFires("Ha Long Bay is too beautiful.", "vietlish-too-as-praise");
    expectFires("Your new dress is too nice.", "vietlish-too-as-praise");
  });

  it("wish-you greeting: subjectless 'Wish you ...'", () => {
    expectFires("Wish you a nice day!", "vietlish-wish-you-greeting");
    expectFires("Wish you good health and happiness.", "vietlish-wish-you-greeting");
    expectFires("Wish you success in your new job.", "vietlish-wish-you-greeting");
  });
});

// ── Detector: confusable negatives (the FP boundary) ────────────────────────
describe("detectVietlishDark — confusable negatives must abstain", () => {
  it("opinion: native form + third-party 'according to'", () => {
    expectAbstains("In my opinion, this film is very good.");
    expectAbstains("According to the report, sales went up.");
    expectAbstains("According to her, the meeting is at five.");
  });

  it("resumptive: appositive / relative / no resumptive pronoun", () => {
    expectAbstains("My brother, who lives in Hue, is a teacher.");
    expectAbstains("My hometown is very beautiful.");
    expectAbstains("Hanoi, the capital, is crowded.");
  });

  it("play: real 'play' objects (piano, sports, games)", () => {
    expectAbstains("I play the piano every evening.");
    expectAbstains("They play football on Sunday.");
    expectAbstains("We play a game after dinner.");
  });

  it("too: genuine excess reading + ambivalent adjectives", () => {
    expectAbstains("The coffee is too hot to drink.");
    expectAbstains("This bag is too expensive for me.");
    expectAbstains("It was too good to be true.");
  });

  it("wish: with subject + counterfactual ellipsis", () => {
    expectAbstains("I wish you a nice day.");
    expectAbstains("We wish you a merry Christmas.");
    expectAbstains("Wish you were here with us.");
  });

  it("plain natural English does not fire", () => {
    expectAbstains("I love learning English.");
    expectAbstains("She studies at a university in Hanoi.");
    expectAbstains("");
  });
});

// ── Output is dark: no learner-facing text on the signal ────────────────────
describe("detectVietlishDark — signal shape is internal-only", () => {
  it("carries only patternId/confidence/marker/note, no learner copy", () => {
    const [s] = detectVietlishDark("According to me, it is good.");
    expect(s).toBeDefined();
    expect(Object.keys(s).sort()).toEqual(["confidence", "marker", "note", "patternId"]);
    expect(typeof s.confidence).toBe("number");
    expect(s.confidence).toBeGreaterThan(0);
    expect(s.confidence).toBeLessThanOrEqual(1);
  });
});

// ── Flag gate + dark emit ───────────────────────────────────────────────────
describe("runVietlishDarkSeed — flag-gated, dark-only", () => {
  it("is OFF by default (no flag set) → returns [] and never emits", () => {
    const emit = vi.fn();
    const out = runVietlishDarkSeed("According to me, it is good.", { emit });
    expect(out).toEqual([]);
    expect(emit).not.toHaveBeenCalled();
  });

  it("env flag default resolves OFF in the test runtime", () => {
    expect(isVietlishDarkSeedEnabled()).toBe(false);
  });

  it("when enabled, emits one dark info beacon per matched pattern", () => {
    const emit = vi.fn();
    const out = runVietlishDarkSeed("According to me, I play the phone every night.", {
      enabled: true,
      emit,
    });
    expect(out.length).toBe(2); // opinion-calque + play-device
    expect(emit).toHaveBeenCalledTimes(2);
    for (const call of emit.mock.calls) {
      const [message, level, context] = call;
      expect(message).toBe("[vietlish] awkward pattern detected (dark seed)");
      expect(level).toBe("info"); // telemetry, not an error
      expect(context).toMatchObject({
        mechanism: "vietlish_dark_seed_v1",
        candidate: "step11-vietlish-dark-seed",
      });
      expect(context.patternId).toBeTruthy();
      // No learner-facing English/Vietnamese copy is ever emitted.
      expect(JSON.stringify(context)).not.toMatch(/in my opinion|native|should say/i);
    }
  });

  it("when enabled but nothing matches, returns [] and does not emit", () => {
    const emit = vi.fn();
    const out = runVietlishDarkSeed("I love learning English.", { enabled: true, emit });
    expect(out).toEqual([]);
    expect(emit).not.toHaveBeenCalled();
  });
});
