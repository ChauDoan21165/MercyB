/**
 * EN→VN register pack — unit tests.
 *
 * Trust-floor oriented: adversarial negative cases are weighted equally
 * with positive cases. A wrong register correction is worse than silence.
 *
 * Test coverage:
 *   1. Pack assembly — rule and explanation counts, tag namespace, metadata.
 *   2. Taxonomy — all 10 patterns present, detectionFeasibility correct.
 *   3. ABSTAIN contract — every context-required rule returns null for any input.
 *   4. Positive cases — formal_opener_peer_ban fires on expected inputs.
 *   5. Adversarial negatives — must NOT fire (zero false positives).
 *   6. Fixture — full eval fixture case-by-case verification.
 */

import { describe, expect, it } from "vitest";

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EN_VN_REGISTER_PACK,
  REGISTER_RULES,
  REGISTER_EXPLANATIONS,
  REGISTER_TAXONOMY,
  SURFACE_DETECTABLE_TAGS,
  CONTEXT_REQUIRED_TAGS,
} from "../index.js";
import type { RuleArgs } from "../../../rule-pack-types.js";
import {
  ruleFormalOpenerPeerBan,
  rulePeerBanToElder,
  ruleToiselfWithElder,
  ruleMissingAParticle,
  ruleBluntRequestToSuperior,
  ruleBareRefusalToSuperior,
  ruleThanksWithPeerForm,
  ruleApologyWithPeerForm,
  ruleFavorRequestNoSoftener,
  ruleDirectCommandToElder,
} from "../detectors.js";
import { validateRulePack } from "../../../rule-pack-types.js";

// ── Fixture loading ────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = resolve(
  __dirname,
  "../../../../../../evals/en-vn-register-cases.json",
);

type FixtureCase = {
  id: string;
  family: string;
  expected_rule_id: string;
  expected_phenomenon: string;
  severity: string;
  input: string;
  expected_correction: string;
  expected_category: "expected_pass" | "expected_failure";
  source: string;
  notes?: string;
};

type Fixture = {
  _meta: Record<string, unknown>;
  cases: FixtureCase[];
};

function loadFixture(): Fixture {
  return JSON.parse(readFileSync(FIXTURE_PATH, "utf8")) as Fixture;
}

// ── Tokeniser (mirrors en-vn/detectors.ts, local copy for isolation) ──────

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[.,;:!"'()[\]{}]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function makeArgs(input: string, expected: string): RuleArgs {
  return {
    userTokens: tokenize(input),
    expectedTokens: tokenize(expected),
    userText: input,
    expectedText: expected,
    rawUser: input,
    rawExpected: expected,
    ctx: {},
  };
}

function runRegistry(args: RuleArgs): { tag: string } | null {
  for (const rule of REGISTER_RULES) {
    const hit = rule(args);
    if (hit) return hit;
  }
  return null;
}

// ── 1. Pack assembly ────────────────────────────────────────────────────────

describe("EN_VN_REGISTER_PACK — assembly", () => {
  it("ships exactly 10 rules", () => {
    expect(REGISTER_RULES.length).toBe(10);
  });

  it("ships exactly 10 explanations, one per rule tag", () => {
    expect(REGISTER_EXPLANATIONS.length).toBe(10);
  });

  it("all explanation tags are in the en_l1_register_ namespace", () => {
    for (const exp of REGISTER_EXPLANATIONS) {
      expect(exp.tag).toMatch(/^en_l1_register_/);
      expect(exp.en.length).toBeGreaterThan(0);
      expect(exp.vi.length).toBeGreaterThan(0);
    }
  });

  it("all explanation VI strings have Vietnamese diacritics", () => {
    const DIACRITIC_RE = /[àáảãạăắặằẳẵâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/;
    for (const exp of REGISTER_EXPLANATIONS) {
      expect(exp.vi).toMatch(DIACRITIC_RE);
    }
  });

  it("explanation tags are unique", () => {
    const tags = REGISTER_EXPLANATIONS.map((e) => e.tag);
    expect(new Set(tags).size).toBe(tags.length);
  });

  it("pack metadata is correct", () => {
    expect(EN_VN_REGISTER_PACK.l1Code).toBe("en");
    expect(EN_VN_REGISTER_PACK.version).toBe("0.1");
  });

  it("validateRulePack() reports no structural issues", () => {
    const issues = validateRulePack(EN_VN_REGISTER_PACK);
    expect(issues, `Pack issues:\n${issues.join("\n")}`).toEqual([]);
  });
});

// ── 2. Taxonomy ────────────────────────────────────────────────────────────

describe("REGISTER_TAXONOMY — data integrity", () => {
  it("has exactly 10 patterns", () => {
    expect(REGISTER_TAXONOMY.length).toBe(10);
  });

  it("every pattern has a non-empty tag in the en_l1_register_ namespace", () => {
    for (const p of REGISTER_TAXONOMY) {
      expect(p.tag).toMatch(/^en_l1_register_/);
    }
  });

  it("every pattern has a non-empty VI description with diacritics", () => {
    const DIACRITIC_RE = /[àáảãạăắặằẳẵâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/;
    for (const p of REGISTER_TAXONOMY) {
      expect(p.descriptionVi.length).toBeGreaterThan(10);
      expect(p.descriptionVi).toMatch(DIACRITIC_RE);
    }
  });

  it("every pattern has at least 3 examples", () => {
    const shortfalls = REGISTER_TAXONOMY.filter((p) => p.examples.length < 3);
    expect(
      shortfalls.map((p) => `${p.id} (${p.examples.length} examples)`),
      "Patterns with < 3 examples:",
    ).toEqual([]);
  });

  it("exactly 1 pattern is surface_detectable", () => {
    expect(SURFACE_DETECTABLE_TAGS.length).toBe(1);
    expect(SURFACE_DETECTABLE_TAGS[0]).toBe("en_l1_register_formal_opener_ban");
  });

  it("exactly 9 patterns are context_required", () => {
    expect(CONTEXT_REQUIRED_TAGS.length).toBe(9);
  });

  it("all pattern ids are unique", () => {
    const ids = REGISTER_TAXONOMY.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all pattern tags are unique", () => {
    const tags = REGISTER_TAXONOMY.map((p) => p.tag);
    expect(new Set(tags).size).toBe(tags.length);
  });

  it("each pattern tag has a matching explanation entry", () => {
    const expTags = new Set(REGISTER_EXPLANATIONS.map((e) => e.tag));
    const missing = REGISTER_TAXONOMY.filter((p) => !expTags.has(p.tag));
    expect(
      missing.map((p) => p.tag),
      "Taxonomy patterns with no matching explanation:",
    ).toEqual([]);
  });
});

// ── 3. ABSTAIN contract ─────────────────────────────────────────────────────

describe("Context-required rules — ABSTAIN for all inputs", () => {
  // Representative inputs that look like potential register errors
  const sampleInputs = [
    "Bạn có khoẻ không?",
    "Tôi cảm ơn bà rất nhiều.",
    "Em hiểu.",
    "Cho tôi xem bài.",
    "Không, tôi không cần.",
    "Cảm ơn bạn đã giúp tôi.",
    "Xin lỗi bạn, tôi đến muộn.",
    "Cho tôi mượn bút.",
    "Đọc lại bài cho tôi nghe.",
    "Thưa thầy, em hiểu rồi.",
    "Kính gửi ông Nam,",
    "Bạn tôi rất thông minh.",
  ];

  const ABSTAINING_RULES: Array<[string, typeof rulePeerBanToElder]> = [
    ["rulePeerBanToElder", rulePeerBanToElder],
    ["ruleToiselfWithElder", ruleToiselfWithElder],
    ["ruleMissingAParticle", ruleMissingAParticle],
    ["ruleBluntRequestToSuperior", ruleBluntRequestToSuperior],
    ["ruleBareRefusalToSuperior", ruleBareRefusalToSuperior],
    ["ruleThanksWithPeerForm", ruleThanksWithPeerForm],
    ["ruleApologyWithPeerForm", ruleApologyWithPeerForm],
    ["ruleFavorRequestNoSoftener", ruleFavorRequestNoSoftener],
    ["ruleDirectCommandToElder", ruleDirectCommandToElder],
  ];

  for (const [ruleName, rule] of ABSTAINING_RULES) {
    it(`${ruleName} returns null for every sample input`, () => {
      for (const input of sampleInputs) {
        const args = makeArgs(input, input);
        expect(
          rule(args),
          `${ruleName} fired on: "${input}"`,
        ).toBeNull();
      }
    });
  }
});

// ── 4. Positive cases — formal opener + "bạn" ──────────────────────────────

describe("ruleFormalOpenerPeerBan — positive cases", () => {
  const POSITIVE_CASES = [
    { input: "Thưa bạn, tôi muốn hỏi.", expected: "Thưa thầy, em muốn hỏi." },
    { input: "Kính gửi bạn Nguyễn Văn An,", expected: "Kính gửi anh Nguyễn Văn An," },
    { input: "Kính thưa bạn chủ tịch,", expected: "Kính thưa ông chủ tịch," },
    { input: "Thưa bạn đại biểu,", expected: "Thưa quý đại biểu," },
    { input: "Kính gửi bạn hiệu trưởng,", expected: "Kính gửi ông hiệu trưởng," },
    { input: "Thưa bạn giám đốc, tôi xin phép trình bày.", expected: "Thưa ông giám đốc, tôi xin phép trình bày." },
  ];

  for (const { input, expected } of POSITIVE_CASES) {
    it(`fires on: "${input}"`, () => {
      const args = makeArgs(input, expected);
      const hit = ruleFormalOpenerPeerBan(args);
      expect(hit).not.toBeNull();
      expect(hit?.tag).toBe("en_l1_register_formal_opener_ban");
    });
  }

  it("registry fires the correct tag for all positive cases", () => {
    const mismatches: string[] = [];
    for (const { input, expected } of POSITIVE_CASES) {
      const hit = runRegistry(makeArgs(input, expected));
      if (hit?.tag !== "en_l1_register_formal_opener_ban") {
        mismatches.push(`"${input}" → ${hit?.tag ?? "null"}`);
      }
    }
    expect(mismatches, `Tag mismatches:\n${mismatches.join("\n")}`).toEqual([]);
  });
});

// ── 5. Adversarial negatives — must NOT fire ────────────────────────────────

describe("Adversarial negatives — ZERO false positives", () => {
  const ADVERSARIAL = [
    // Correct formal openers with non-"bạn" address terms
    "Thưa thầy, em xin phép hỏi.",
    "Thưa cô, em hiểu rồi ạ.",
    "Kính gửi ông Nam,",
    "Kính gửi bà Linh,",
    "Kính thưa quý vị,",
    "Kính gửi quý vị lãnh đạo,",
    // "bạn" as noun (friend), not 2nd-person pronoun
    "Bạn tôi là sinh viên đại học.",
    "Bạn của tôi đến thăm hôm qua.",
    "Tôi gặp bạn tôi ở đó.",
    // "bạn" as pronoun but NOT after a formal opener
    "Cảm ơn bạn đã giúp tôi.",
    "Xin lỗi bạn, tôi đến muộn.",
    "Em chào bạn.",
    "Tôi gửi lời chào đến bạn.",
    // "Thưa các bạn" — valid peer-group address
    "Thưa các bạn trong phòng,",
    "Thưa các bạn sinh viên,",
    // Sentences with "kính" as a standalone adjective (respectful), not part of opener
    "Anh ấy rất kính trọng cha mẹ.",
    // Edge: "bạn" at end of sentence after other words
    "Hôm nay tôi đi học với bạn.",
  ];

  for (const input of ADVERSARIAL) {
    it(`does NOT fire on: "${input}"`, () => {
      const args = makeArgs(input, input);
      const hit = runRegistry(args);
      expect(hit, `Registry fired on adversarial input: "${input}"`).toBeNull();
    });
  }
});

// ── 6. Fixture — full eval case-by-case ────────────────────────────────────

describe("Fixture — en-vn-register-cases.json", () => {
  const fixture = loadFixture();
  const passCases = fixture.cases.filter(
    (c) => c.expected_category === "expected_pass",
  );
  const failCases = fixture.cases.filter(
    (c) => c.expected_category === "expected_failure",
  );

  it("fixture has expected_pass cases for the surface-detectable rule", () => {
    expect(passCases.length).toBeGreaterThanOrEqual(3);
  });

  it("fixture has adversarial expected_failure cases", () => {
    const adversarialCases = failCases.filter(
      (c) => c.notes && c.notes.startsWith("ADVERSARIAL:"),
    );
    expect(adversarialCases.length).toBeGreaterThanOrEqual(5);
  });

  it("every expected_pass case fires the EXACT expected tag", () => {
    const mismatches: string[] = [];
    for (const c of passCases) {
      const hit = runRegistry(makeArgs(c.input, c.expected_correction));
      if (!hit || hit.tag !== c.expected_rule_id) {
        mismatches.push(
          `${c.id}: expected ${c.expected_rule_id} got ${hit?.tag ?? "null"} (input: ${c.input})`,
        );
      }
    }
    expect(mismatches, `Mismatches:\n${mismatches.join("\n")}`).toEqual([]);
  });

  it("NO expected_failure case fires — zero confident-wrong", () => {
    const wrongFires: string[] = [];
    for (const c of failCases) {
      const hit = runRegistry(makeArgs(c.input, c.expected_correction));
      if (hit) {
        wrongFires.push(
          `${c.id} (${c.notes ?? ""}): fired ${hit.tag} on: ${c.input}`,
        );
      }
    }
    expect(
      wrongFires,
      `CONFIDENT-WRONG FIRES — these must be fixed before shipping:\n${wrongFires.join("\n")}`,
    ).toEqual([]);
  });
});

// ── 7. Case-insensitivity / diacritics-preserved ───────────────────────────

describe("ruleFormalOpenerPeerBan — case variants", () => {
  // The tokeniser lowercases, so the rule works on lowercased tokens.
  // Verify that sentence-initial capitalisation ('Thưa', 'THƯA') is handled.
  const VARIANTS = [
    "Thưa bạn, xin hỏi.",
    "thưa bạn, xin hỏi.",
    "THƯA bạn, xin hỏi.",
    "Kính Gửi bạn,",
    "KÍNH GỬI bạn,",
    "Kính Thưa bạn,",
  ];

  for (const input of VARIANTS) {
    it(`fires on case variant: "${input}"`, () => {
      const args = makeArgs(input, "Thưa ông,");
      const hit = ruleFormalOpenerPeerBan(args);
      expect(hit?.tag).toBe("en_l1_register_formal_opener_ban");
    });
  }
});
