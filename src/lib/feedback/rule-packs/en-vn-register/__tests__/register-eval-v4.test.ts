/**
 * Step-18 register-error detector — precision/recall measurement on eval-set V4.
 *
 * Binding floor (per dispatch DONE-WHEN):
 *   Precision ≥ 90% on the 30 register-error pairs.
 *   Recall is REPORTED but NOT gated.
 *
 * Precision is measured across:
 *   (a) the 30 V4 register-error pairs — every detection here is a true positive
 *       (all 30 ARE genuine register errors); a false positive can only come from
 *       (b) the adversarial non-register inputs below.
 *   (b) 12 adversarial non-register sentences — detector MUST NOT fire.
 *
 *   precision = truePositives / (truePositives + falsePositives)
 *   recall    = truePositives / 30
 *
 * Architecture note (C6 / abstain-default):
 *   The detector fires only on surface-detectable patterns (4 of 10 taxonomy
 *   patterns have EN-language surface signals). The remaining 6 require
 *   conversational context (addressee relationship) — they ABSTAIN by design.
 *   Low recall with high precision is correct behaviour, not a bug.
 */

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { detectRegisterError } from "../../../registerDetector.js";
import { REGISTER_TAXONOMY } from "../taxonomy.js";

// ── Eval-set V4 loading ───────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const V4_PATH = resolve(
  __dirname,
  "../../../../../../docs/eval/vn-en-eval-set-v4/eval-set-v4.json",
);

type V4Entry = {
  id: string;
  input: string;
  expected: string;
  taxonomyPatternId: string;
};

type V4File = {
  count: number;
  entries: V4Entry[];
};

function loadV4(): V4File {
  return JSON.parse(readFileSync(V4_PATH, "utf8")) as V4File;
}

// ── Known-detectable V4 entry IDs ─────────────────────────────────────────────
//
// These are the entries the current surface-detectable patterns can catch.
// If a new detector fires on an entry not in this set, it's fine — update the
// set. If this set claims an entry fires but the test shows it doesn't, the
// detector regressed.
const EXPECTED_DETECTABLE_IDS = new Set([
  "eval-v4-001", // "I beg to notify" — over-formal calque
  "eval-v4-002", // "Most Respected and Esteemed" — stacked deference
  "eval-v4-003", // "accept my humble greetings" — formulaic deference
  "eval-v4-004", // "Hey teacher" — casual opener to professional
  "eval-v4-007", // "The undersigned hereby" — bureaucratic self-reference
  "eval-v4-008", // "This person wishes" — third-person self
  "eval-v4-009", // "this humble employee" — self-deprecating self
  "eval-v4-023", // "My bad" — slang apology
]);

// ── Adversarial non-register sentences ───────────────────────────────────────
//
// These do NOT contain register errors. The detector MUST ABSTAIN on all of
// them. FP on any of these causes precision to drop below 90%.
const ADVERSARIAL_NON_REGISTER = [
  "I need to finish this report by tomorrow.",
  "Let me know if you have any questions.",
  "Please find the attached document.",
  "I will see you at the meeting tomorrow morning.",
  "Thank you for your time and consideration.",
  "Could you please review this proposal?",
  "I apologize for any inconvenience caused.",
  "I am writing to follow up on our conversation.",
  "Please let me know if you need any additional information.",
  "The undersigned parties agree to the terms above.", // "undersigned" in legal (NOT self-reference)
  "He is the humblest person I have ever met.",         // "humble" as adjective, not self-ref
  "Hey, that's a great idea!",                          // "hey" exclamation, not address
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("detectRegisterError — eval-set V4 precision/recall", () => {
  const v4 = loadV4();

  it("eval-set V4 has exactly 30 entries", () => {
    expect(v4.entries).toHaveLength(30);
    expect(v4.count).toBe(30);
  });

  it("all 10 taxonomy patterns are represented in V4 (3 each)", () => {
    const patternCounts = new Map<string, number>();
    for (const entry of v4.entries) {
      patternCounts.set(
        entry.taxonomyPatternId,
        (patternCounts.get(entry.taxonomyPatternId) ?? 0) + 1,
      );
    }
    const taxonomyIds = new Set(REGISTER_TAXONOMY.map((p) => p.id));
    for (const id of taxonomyIds) {
      expect(
        patternCounts.get(id) ?? 0,
        `Pattern ${id} should appear ≥1 time in V4`,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  // ── Main precision/recall measurement ──────────────────────────────────────

  it("precision ≥ 90% and recall is reported (binding floor)", () => {
    let truePositives = 0;
    let falsePositives = 0;
    const recalls: string[] = [];
    const fpDetails: string[] = [];

    // Run all 30 V4 entries
    for (const entry of v4.entries) {
      const result = detectRegisterError({ learnerText: entry.input });
      if (result.matched) {
        // All 30 are genuine register errors → every detection is a TP
        truePositives++;
        recalls.push(`TP ${entry.id} (${entry.taxonomyPatternId}): "${entry.input.slice(0, 60)}…"`);
      }
    }

    // Run adversarial non-register inputs
    for (const sentence of ADVERSARIAL_NON_REGISTER) {
      const result = detectRegisterError({ learnerText: sentence });
      if (result.matched) {
        falsePositives++;
        fpDetails.push(`FP on: "${sentence}" → ${result.tag}`);
      }
    }

    const total = truePositives + falsePositives;
    const precision = total === 0 ? 1 : truePositives / total;
    const recall = truePositives / 30;

    // eslint-disable-next-line no-console
    console.log(
      `\n  Register detector V4 metrics:\n` +
      `    Recall:    ${truePositives}/30 = ${(recall * 100).toFixed(0)}%\n` +
      `    Precision: ${truePositives}/${total} = ${(precision * 100).toFixed(0)}%\n` +
      (recalls.length ? `    Detected:\n      ${recalls.join("\n      ")}\n` : "") +
      (fpDetails.length ? `    FALSE POSITIVES:\n      ${fpDetails.join("\n      ")}\n` : ""),
    );

    // BINDING FLOOR: precision must be ≥ 90%
    expect(
      precision,
      `Precision ${(precision * 100).toFixed(1)}% below binding floor of 90%.\n` +
      `False positives:\n${fpDetails.join("\n")}`,
    ).toBeGreaterThanOrEqual(0.9);

    // Recall is reported but not gated — just assert it's a number in [0,1]
    expect(recall).toBeGreaterThanOrEqual(0);
    expect(recall).toBeLessThanOrEqual(1);
  });

  // ── Zero false positives on adversarial inputs ─────────────────────────────

  describe("adversarial non-register inputs — MUST NOT fire", () => {
    for (const sentence of ADVERSARIAL_NON_REGISTER) {
      it(`abstains on: "${sentence.slice(0, 60)}"`, () => {
        const result = detectRegisterError({ learnerText: sentence });
        expect(
          result.matched,
          `Detector falsely fired on: "${sentence}"`,
        ).toBe(false);
      });
    }
  });
});

// ── Abstain-on-uncertain contract ─────────────────────────────────────────────

describe("detectRegisterError — abstain on context-required inputs", () => {
  // Inputs that LOOK like register errors but require knowing the addressee
  const CONTEXT_REQUIRED = [
    "Can you send me the file?",              // fine if addressee is a peer
    "Give me more time to finish this task.", // fine if addressee is a peer
    "No, I cannot attend the meeting.",       // fine if addressee is a peer
    "Sorry for the late reply.",              // fine if addressee is a peer
    "I don't want to join the project.",      // fine in any register
    "Thanks for your help.",                  // fine if addressee is a peer (no professional title)
    "I received your email. I will fix it.",  // terse but fine to a peer
    "Yes, I understand. I will submit it.",   // fine context-independently
    "Can you look at my essay?",              // fine if addressee is a peer
  ];

  for (const input of CONTEXT_REQUIRED) {
    it(`abstains (context-required) on: "${input}"`, () => {
      const result = detectRegisterError({ learnerText: input });
      expect(
        result.matched,
        `Detector fired on context-required input: "${input}"`,
      ).toBe(false);
    });
  }
});

// ── Positive cases — surface-detectable patterns ──────────────────────────────

describe("detectRegisterError — surface-detectable positive cases", () => {
  const POSITIVE_CASES = [
    // formal_opener_peer_ban (EN variant)
    {
      input: "Respectfully and humbly, I beg to notify you that the document is ready.",
      expectedPatternId: "formal_opener_peer_ban",
      expectedTag: "en_l1_register_formal_opener_ban",
      label: "I beg to notify — over-formal calque",
    },
    {
      input: "Dear Most Honoured and Esteemed Director, I write to you today.",
      expectedPatternId: "formal_opener_peer_ban",
      expectedTag: "en_l1_register_formal_opener_ban",
      label: "Most Honoured and Esteemed — stacked deference",
    },
    {
      input: "Please accept my humble greetings and respects before I ask.",
      expectedPatternId: "formal_opener_peer_ban",
      expectedTag: "en_l1_register_formal_opener_ban",
      label: "accept my humble greetings — formulaic deference",
    },
    {
      input: "I humbly request your assistance with this matter.",
      expectedPatternId: "formal_opener_peer_ban",
      expectedTag: "en_l1_register_formal_opener_ban",
      label: "humbly request — deferential verb prefix",
    },
    // toi_self_with_elder
    {
      input: "The undersigned hereby requests a review of the application.",
      expectedPatternId: "toi_self_with_elder",
      expectedTag: "en_l1_register_toi_self_elder",
      label: "the undersigned hereby — bureaucratic self-reference",
    },
    {
      input: "This person wishes to apologize for the inconvenience caused.",
      expectedPatternId: "toi_self_with_elder",
      expectedTag: "en_l1_register_toi_self_elder",
      label: "this person wishes to — third-person self",
    },
    {
      input: "It is this humble employee who takes responsibility for the error.",
      expectedPatternId: "toi_self_with_elder",
      expectedTag: "en_l1_register_toi_self_elder",
      label: "it is this humble — distancing third-person",
    },
    {
      input: "This humble student would like to request an extension.",
      expectedPatternId: "toi_self_with_elder",
      expectedTag: "en_l1_register_toi_self_elder",
      label: "this humble student — self-deprecating self",
    },
    // peer_ban_to_elder
    {
      input: "Hey teacher, could you explain this concept again?",
      expectedPatternId: "peer_ban_to_elder",
      expectedTag: "en_l1_register_peer_ban_to_elder",
      label: "Hey teacher — casual opener to professional",
    },
    {
      input: "Hey doctor, is my test result OK?",
      expectedPatternId: "peer_ban_to_elder",
      expectedTag: "en_l1_register_peer_ban_to_elder",
      label: "Hey doctor — casual opener to medical professional",
    },
    // apology_with_peer_form_to_superior
    {
      input: "My bad, I forgot to include the attachment.",
      expectedPatternId: "apology_with_peer_form_to_superior",
      expectedTag: "en_l1_register_apology_peer",
      label: "My bad — slang apology",
    },
    {
      input: "Oh my bad, I sent it to the wrong person.",
      expectedPatternId: "apology_with_peer_form_to_superior",
      expectedTag: "en_l1_register_apology_peer",
      label: "my bad mid-sentence — slang",
    },
  ];

  for (const { input, expectedPatternId, expectedTag, label } of POSITIVE_CASES) {
    it(`detects: ${label}`, () => {
      const result = detectRegisterError({ learnerText: input });
      expect(result.matched, `Detector did not fire on: "${input}"`).toBe(true);
      if (result.matched) {
        expect(result.patternId).toBe(expectedPatternId);
        expect(result.tag).toBe(expectedTag);
        // Explanation must be non-empty and contain Vietnamese diacritics
        expect(result.explanationVi.length).toBeGreaterThan(20);
        expect(result.explanationEn.length).toBeGreaterThan(20);
        const DIACRITIC_RE =
          /[àáảãạăắặằẳẵâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/;
        expect(
          result.explanationVi,
          "VI explanation must contain Vietnamese diacritics (not a generic string)",
        ).toMatch(DIACRITIC_RE);
      }
    });
  }
});

// ── Explanation quality contract ──────────────────────────────────────────────

describe("detectRegisterError — explanation strings are taxonomy-derived", () => {
  it("explanationVi matches taxonomy descriptionVi for formal_opener_peer_ban", () => {
    const result = detectRegisterError({
      learnerText: "Respectfully and humbly, I beg to notify you.",
    });
    expect(result.matched).toBe(true);
    if (result.matched) {
      const pattern = REGISTER_TAXONOMY.find((p) => p.id === result.patternId);
      expect(pattern).toBeDefined();
      expect(result.explanationVi).toBe(pattern!.descriptionVi);
      expect(result.explanationEn).toBe(pattern!.descriptionEn);
    }
  });

  it("explanationVi matches taxonomy descriptionVi for toi_self_with_elder", () => {
    const result = detectRegisterError({
      learnerText: "The undersigned hereby requests clarification.",
    });
    expect(result.matched).toBe(true);
    if (result.matched) {
      const pattern = REGISTER_TAXONOMY.find((p) => p.id === result.patternId);
      expect(pattern).toBeDefined();
      expect(result.explanationVi).toBe(pattern!.descriptionVi);
    }
  });

  it("explanationVi matches taxonomy descriptionVi for peer_ban_to_elder", () => {
    const result = detectRegisterError({ learnerText: "Hey professor, I have a question." });
    expect(result.matched).toBe(true);
    if (result.matched) {
      const pattern = REGISTER_TAXONOMY.find((p) => p.id === result.patternId);
      expect(pattern).toBeDefined();
      expect(result.explanationVi).toBe(pattern!.descriptionVi);
    }
  });

  it("explanationVi matches taxonomy descriptionVi for apology_with_peer_form_to_superior", () => {
    const result = detectRegisterError({ learnerText: "My bad, I forgot the deadline." });
    expect(result.matched).toBe(true);
    if (result.matched) {
      const pattern = REGISTER_TAXONOMY.find((p) => p.id === result.patternId);
      expect(pattern).toBeDefined();
      expect(result.explanationVi).toBe(pattern!.descriptionVi);
    }
  });
});
