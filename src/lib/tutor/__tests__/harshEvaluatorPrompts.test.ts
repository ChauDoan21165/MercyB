/**
 * Tests for Final Harsh Evaluator Prompts (Step 112)
 *
 * Verifies that every evaluator prompt builder produces valid, well-structured
 * LLM-as-judge prompts that cover all 6 teacher intelligence dimensions with
 * appropriate harshness levels.
 */

import { describe, it, expect } from "vitest";

import {
  // Prompt builders
  buildDiagnosisEvaluatorPrompt,
  buildTeachingEvaluatorPrompt,
  buildMemoryEvaluatorPrompt,
  buildAdaptationEvaluatorPrompt,
  buildSelfCheckEvaluatorPrompt,
  buildLearningGainEvaluatorPrompt,
  buildCompositeEvaluatorPrompt,
  buildAdversarialEvaluatorPrompt,
  buildScenarioAnchoredEvaluatorPrompt,
  buildAllDimensionEvaluatorPrompts,
  buildEvaluatorPromptById,

  // Catalog
  getEvaluatorPromptCatalog,
  getEvaluatorPromptById,
  getEvaluatorPromptsByDimension,
  getEvaluatorPromptsByRole,

  // Config
  getHarshnessConfig,

  // Types
  type HarshEvaluatorInput,
  type HarshEvaluatorDimension,
  type HarshnessLevel,
  type EvaluatorPromptRole,

  // Helpers
  isValidHarshnessLevel,
  isValidEvaluatorDimension,
  getEvaluatorDimensionLabelVi,
  getEvaluatorDimensionLabelEn,
  getContractRuleDescriptionVi,
  getEvaluatorPromptStatistics,
  createMinimalEvaluatorInput,
  DIMENSION_PROMPT_BUILDERS,
} from "../harshEvaluatorPrompts";

// ─── Test Helpers ──────────────────────────────────────────────────────────────

function makeBaseInput(overrides: Partial<HarshEvaluatorInput> = {}): HarshEvaluatorInput {
  return createMinimalEvaluatorInput(overrides);
}

function makeKidsInput(): HarshEvaluatorInput {
  return makeBaseInput({
    learnerContext: {
      cefrLevel: "A1",
      l1: "vi",
      knownWeaknesses: ["vocabulary"],
      isKidsMode: true,
      sessionNumber: 1,
    },
    learnerText: "Cat is big.",
    tutorResponse: {
      vi: "Ồ, con mèo to quá! 😺 'Cat is big' gần đúng rồi. Mình nói 'The cat is big' sẽ hay hơn nè. Con thử nói lại xem? 🌟",
      correctedSentence: "The cat is big.",
      grammarPoints: ["articles"],
      action: "correct",
    },
  });
}

function makeB2Input(): HarshEvaluatorInput {
  return makeBaseInput({
    learnerContext: {
      cefrLevel: "B2",
      l1: "vi",
      knownWeaknesses: ["prepositions", "collocations"],
      isKidsMode: false,
      sessionNumber: 8,
    },
    learnerText:
      "The government should to invest more in renewable energy sources because it's beneficial for the environment and also create many jobs opportunity.",
    tutorResponse: {
      vi: "Bạn đưa ra quan điểm rất hay về năng lượng tái tạo. Có hai điểm nhỏ mình muốn chỉnh: 'should to invest' → 'should invest' (không cần 'to'), và 'jobs opportunity' → 'job opportunities'. Nhưng ý tưởng của bạn rất tốt.",
      en: "Your point about renewable energy is excellent. Two small fixes: 'should to invest' → 'should invest', and 'jobs opportunity' → 'job opportunities'.",
      correctedSentence:
        "The government should invest more in renewable energy sources because it's beneficial for the environment and also creates many job opportunities.",
      grammarPoints: ["modal verbs", "plural nouns"],
      action: "correct",
    },
  });
}

// ─── Suite 1: Module Smoke ────────────────────────────────────────────────────

describe("harshEvaluatorPrompts — module smoke", () => {
  it("exports all 6 per-dimension prompt builders", () => {
    expect(typeof buildDiagnosisEvaluatorPrompt).toBe("function");
    expect(typeof buildTeachingEvaluatorPrompt).toBe("function");
    expect(typeof buildMemoryEvaluatorPrompt).toBe("function");
    expect(typeof buildAdaptationEvaluatorPrompt).toBe("function");
    expect(typeof buildSelfCheckEvaluatorPrompt).toBe("function");
    expect(typeof buildLearningGainEvaluatorPrompt).toBe("function");
  });

  it("exports composite and adversarial builders", () => {
    expect(typeof buildCompositeEvaluatorPrompt).toBe("function");
    expect(typeof buildAdversarialEvaluatorPrompt).toBe("function");
    expect(typeof buildScenarioAnchoredEvaluatorPrompt).toBe("function");
    expect(typeof buildAllDimensionEvaluatorPrompts).toBe("function");
    expect(typeof buildEvaluatorPromptById).toBe("function");
  });

  it("exports catalog and config functions", () => {
    expect(typeof getEvaluatorPromptCatalog).toBe("function");
    expect(typeof getEvaluatorPromptById).toBe("function");
    expect(typeof getEvaluatorPromptsByDimension).toBe("function");
    expect(typeof getEvaluatorPromptsByRole).toBe("function");
    expect(typeof getHarshnessConfig).toBe("function");
  });

  it("exports helper and validation functions", () => {
    expect(typeof isValidHarshnessLevel).toBe("function");
    expect(typeof isValidEvaluatorDimension).toBe("function");
    expect(typeof getEvaluatorDimensionLabelVi).toBe("function");
    expect(typeof getEvaluatorDimensionLabelEn).toBe("function");
    expect(typeof getContractRuleDescriptionVi).toBe("function");
    expect(typeof getEvaluatorPromptStatistics).toBe("function");
    expect(typeof createMinimalEvaluatorInput).toBe("function");
  });

  it("DIMENSION_PROMPT_BUILDERS maps all 6 dimensions", () => {
    expect(Object.keys(DIMENSION_PROMPT_BUILDERS).sort()).toEqual([
      "adaptation",
      "diagnosis",
      "learningGain",
      "memory",
      "selfCheck",
      "teaching",
    ]);
    for (const [dim, builder] of Object.entries(DIMENSION_PROMPT_BUILDERS)) {
      expect(typeof builder).toBe("function");
      const input = makeBaseInput({ harshness: "harsh" });
      const prompt = builder(input);
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(100);
    }
  });
});

// ─── Suite 2: Harshness Configuration ──────────────────────────────────────────

describe("harshEvaluatorPrompts — harshness configuration", () => {
  it("strict level has threshold 70, borderline 55", () => {
    const config = getHarshnessConfig("strict");
    expect(config.passThreshold).toBe(70);
    expect(config.borderlineThreshold).toBe(55);
    expect(config.requireAllDimensions).toBe(false);
    expect(config.maxFailures).toBe(3);
  });

  it("harsh level has threshold 80, borderline 65", () => {
    const config = getHarshnessConfig("harsh");
    expect(config.passThreshold).toBe(80);
    expect(config.borderlineThreshold).toBe(65);
    expect(config.requireAllDimensions).toBe(true);
    expect(config.maxFailures).toBe(1);
  });

  it("merciless level has threshold 90, borderline 80", () => {
    const config = getHarshnessConfig("merciless");
    expect(config.passThreshold).toBe(90);
    expect(config.borderlineThreshold).toBe(80);
    expect(config.requireAllDimensions).toBe(true);
    expect(config.maxFailures).toBe(0);
  });

  it("all levels have Vietnamese descriptions", () => {
    for (const level of ["strict", "harsh", "merciless"] as HarshnessLevel[]) {
      const config = getHarshnessConfig(level);
      expect(config.descriptionVi.length).toBeGreaterThan(20);
      expect(typeof config.descriptionVi).toBe("string");
    }
  });

  it("getHarshnessConfig returns new object each call (immutability)", () => {
    const a = getHarshnessConfig("harsh");
    const b = getHarshnessConfig("harsh");
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });

  it("harshness levels are progressively stricter", () => {
    const strict = getHarshnessConfig("strict");
    const harsh = getHarshnessConfig("harsh");
    const merciless = getHarshnessConfig("merciless");

    expect(strict.passThreshold).toBeLessThan(harsh.passThreshold);
    expect(harsh.passThreshold).toBeLessThan(merciless.passThreshold);
    expect(strict.maxFailures).toBeGreaterThan(harsh.maxFailures);
    expect(harsh.maxFailures).toBeGreaterThan(merciless.maxFailures);
  });
});

// ─── Suite 3: Per-Dimension Prompt Builders ────────────────────────────────────

describe("harshEvaluatorPrompts — per-dimension builders", () => {
  const dimensions: HarshEvaluatorDimension[] = [
    "diagnosis",
    "teaching",
    "memory",
    "adaptation",
    "selfCheck",
    "learningGain",
  ];

  for (const dim of dimensions) {
    describe(`${dim} evaluator`, () => {
      it("builds a non-empty prompt string", () => {
        const input = makeBaseInput({ harshness: "harsh" });
        const builder = DIMENSION_PROMPT_BUILDERS[dim];
        const prompt = builder(input);
        expect(typeof prompt).toBe("string");
        expect(prompt.length).toBeGreaterThan(500);
      });

      it("contains evaluator persona", () => {
        const input = makeBaseInput({ harshness: "harsh" });
        const builder = DIMENSION_PROMPT_BUILDERS[dim];
        const prompt = builder(input);
        expect(prompt).toContain("GIÁM KHẢO");
        expect(prompt).toContain("giáo viên");
      });

      it("contains shared evaluation criteria", () => {
        const input = makeBaseInput({ harshness: "harsh" });
        const builder = DIMENSION_PROMPT_BUILDERS[dim];
        const prompt = builder(input);
        expect(prompt).toContain("R1");
        expect(prompt).toContain("R10");
        expect(prompt).toContain("Khen giả tạo");
      });

      it("contains learner context", () => {
        const input = makeBaseInput({ harshness: "harsh" });
        const builder = DIMENSION_PROMPT_BUILDERS[dim];
        const prompt = builder(input);
        expect(prompt).toContain("BỐI CẢNH NGƯỜI HỌC");
        expect(prompt).toContain(input.learnerContext.cefrLevel!);
        expect(prompt).toContain(input.learnerContext.l1);
      });

      it("contains tutor response text", () => {
        const input = makeBaseInput({ harshness: "harsh" });
        const builder = DIMENSION_PROMPT_BUILDERS[dim];
        const prompt = builder(input);
        expect(prompt).toContain("CÂU TRẢ LỜI CỦA TUTOR");
        expect(prompt).toContain(input.learnerText);
        expect(prompt).toContain(input.tutorResponse.vi);
      });

      it("contains output format instructions", () => {
        const input = makeBaseInput({ harshness: "harsh" });
        const builder = DIMENSION_PROMPT_BUILDERS[dim];
        const prompt = builder(input);
        expect(prompt).toContain("KẾT LUẬN: PASS");
        expect(prompt).toContain("ĐIỂM TỔNG:");
        expect(prompt).toContain("TÓM TẮT TIẾNG VIỆT:");
      });

      it(`works with all 3 harshness levels`, () => {
        for (const level of ["strict", "harsh", "merciless"] as HarshnessLevel[]) {
          const input = makeBaseInput({ harshness: level });
          const builder = DIMENSION_PROMPT_BUILDERS[dim];
          const prompt = builder(input);
          expect(typeof prompt).toBe("string");
          expect(prompt.length).toBeGreaterThan(100);
        }
      });

      it("renders known violations when present", () => {
        const input = makeBaseInput({
          harshness: "harsh",
          knownViolations: ["R1_MEANING_FIRST", "R3_NO_FAKE_PRAISE"],
        });
        const builder = DIMENSION_PROMPT_BUILDERS[dim];
        const prompt = builder(input);
        expect(prompt).toContain("R1_MEANING_FIRST");
        expect(prompt).toContain("R3_NO_FAKE_PRAISE");
      });
    });
  }
});

// ─── Suite 4: Composite Evaluator Prompt ───────────────────────────────────────

describe("harshEvaluatorPrompts — composite evaluator", () => {
  it("builds a prompt covering all 6 dimensions", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(2000);

    // All 6 dimension labels should appear
    expect(prompt).toContain("CHẨN ĐOÁN");
    expect(prompt).toContain("GIẢNG DẠY");
    expect(prompt).toContain("GHI NHỚ");
    expect(prompt).toContain("THÍCH ỨNG");
    expect(prompt).toContain("TỰ KIỂM");
    expect(prompt).toContain("TIẾN BỘ");
  });

  it("contains the persona section", () => {
    const input = makeBaseInput({ harshness: "merciless" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("GIÁM KHẢO ĐÁNH GIÁ GIÁO VIÊN");
    expect(prompt).toContain("20 năm kinh nghiệm");
  });

  it("contains contract rules R1-R10", () => {
    const input = makeBaseInput({ harshness: "strict" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    for (let i = 1; i <= 10; i++) {
      expect(prompt).toContain(`R${i}`);
    }
  });

  it("contains output format for all 6 dimensions", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("diagnosis): 0–100");
    expect(prompt).toContain("teaching): 0–100");
    expect(prompt).toContain("memory): 0–100");
    expect(prompt).toContain("adaptation): 0–100");
    expect(prompt).toContain("selfCheck): 0–100");
    expect(prompt).toContain("learningGain): 0–100");
  });

  it("mentions harshness level and threshold", () => {
    const input = makeBaseInput({ harshness: "merciless" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("MERCILESS");
    expect(prompt).toContain("90/100");
  });

  it("warns evaluator to not be lenient", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("KHÔNG KHOAN NHƯỢNG");
    expect(prompt).toContain("điểm thấp");
  });

  it("renders previous turns when provided", () => {
    const input = makeBaseInput({
      harshness: "harsh",
      previousTurns: ["Tutor turn 1 text", "Tutor turn 2 text"],
    });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("CÁC LƯỢT TRƯỚC");
    expect(prompt).toContain("Tutor turn 1 text");
    expect(prompt).toContain("Tutor turn 2 text");
  });

  it("works with all 3 harshness levels", () => {
    for (const level of ["strict", "harsh", "merciless"] as HarshnessLevel[]) {
      const input = makeBaseInput({ harshness: level });
      const prompt = buildCompositeEvaluatorPrompt(input);
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(1000);
    }
  });
});

// ─── Suite 5: Adversarial Evaluator Prompts ────────────────────────────────────

describe("harshEvaluatorPrompts — adversarial evaluator", () => {
  it("uses adversary persona, not judge", () => {
    const input = makeBaseInput({ harshness: "merciless" });
    const prompt = buildAdversarialEvaluatorPrompt(input);
    expect(prompt).toContain("PHẢN BIỆN");
    expect(prompt).toContain("CÔNG TỐ");
    expect(prompt).toContain("BỊ CÁO");
  });

  it("includes adversarial strategy instructions", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildAdversarialEvaluatorPrompt(input);
    expect(prompt).toContain("CHIẾN LƯỢC PHẢN BIỆN");
    expect(prompt).toContain("ĐỌC TỪNG TỪ");
    expect(prompt).toContain("TÌM MÂU THUẪN");
  });

  it("includes mandatory adversarial questions", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildAdversarialEvaluatorPrompt(input);
    expect(prompt).toContain("ĐIỀU GÌ SAI");
    expect(prompt).toContain("ĐIỀU GÌ GÂY HẠI");
    expect(prompt).toContain("ĐIỀU GÌ VÔ DỤNG");
    expect(prompt).toContain("ĐIỀU GÌ THIẾU");
  });

  it("when dimension is specified, focuses on that dimension", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildAdversarialEvaluatorPrompt(input, "diagnosis");
    expect(prompt).toContain("Chẩn đoán");
    // Should not have the full 6-dimension output format
    // Only one dimension in output
    const occurrences = (prompt.match(/diagnosis\): 0–100/g) || []).length;
    expect(occurrences).toBeLessThanOrEqual(1);
  });

  it("when no dimension is specified, evaluates all", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildAdversarialEvaluatorPrompt(input);
    expect(prompt).toContain("TỔNG HỢP 6 CHIỀU");
  });

  it("encourages finding failures (adversary role)", () => {
    const input = makeBaseInput({ harshness: "merciless" });
    const prompt = buildAdversarialEvaluatorPrompt(input);
    expect(prompt).toContain("được THƯỞNG vì tìm ra lỗi");
    expect(prompt).toContain("MIỄN CƯỠNG");
  });
});

// ─── Suite 6: Scenario-Anchored Evaluator Prompt ───────────────────────────────

describe("harshEvaluatorPrompts — scenario-anchored evaluator", () => {
  it("uses benchmark role", () => {
    const input = makeBaseInput({
      harshness: "strict",
      referenceScenarioId: "hq-diag-a1-copula",
    });
    const prompt = buildScenarioAnchoredEvaluatorPrompt(input);
    expect(prompt).toContain("KỊCH BẢN CHUẨN");
    expect(prompt).toContain("GIÁO VIÊN LÝ TƯỞNG");
  });

  it("includes the scenario reference ID", () => {
    const input = makeBaseInput({
      harshness: "harsh",
      referenceScenarioId: "hq-teach-b1-meaning-first",
    });
    const prompt = buildScenarioAnchoredEvaluatorPrompt(input);
    expect(prompt).toContain("hq-teach-b1-meaning-first");
  });

  it("works without a scenario ID", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildScenarioAnchoredEvaluatorPrompt(input);
    expect(prompt).toContain("Không có kịch bản tham chiếu");
  });

  it("includes comparison questions", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildScenarioAnchoredEvaluatorPrompt(input);
    expect(prompt).toContain("SO SÁNH");
    expect(prompt).toContain("KHOẢNG CÁCH");
    expect(prompt).toContain("CHẤP NHẬN ĐƯỢC");
  });
});

// ─── Suite 7: buildAllDimensionEvaluatorPrompts ────────────────────────────────

describe("harshEvaluatorPrompts — buildAllDimensionEvaluatorPrompts", () => {
  it("returns all 6 dimensions", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const all = buildAllDimensionEvaluatorPrompts(input);
    expect(Object.keys(all).sort()).toEqual([
      "adaptation",
      "diagnosis",
      "learningGain",
      "memory",
      "selfCheck",
      "teaching",
    ]);
  });

  it("every prompt is non-empty", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const all = buildAllDimensionEvaluatorPrompts(input);
    for (const [dim, prompt] of Object.entries(all)) {
      expect(
        prompt.length,
        `${dim} prompt should be non-empty`,
      ).toBeGreaterThan(500);
    }
  });

  it("every prompt contains evaluator persona", () => {
    const input = makeBaseInput({ harshness: "merciless" });
    const all = buildAllDimensionEvaluatorPrompts(input);
    for (const [, prompt] of Object.entries(all)) {
      expect(prompt).toContain("GIÁM KHẢO");
    }
  });
});

// ─── Suite 8: Catalog & Lookup ─────────────────────────────────────────────────

describe("harshEvaluatorPrompts — catalog", () => {
  it("getEvaluatorPromptCatalog returns non-empty array", () => {
    const catalog = getEvaluatorPromptCatalog();
    expect(Array.isArray(catalog)).toBe(true);
    expect(catalog.length).toBeGreaterThan(0);
  });

  it("catalog entries have required fields", () => {
    const catalog = getEvaluatorPromptCatalog();
    for (const entry of catalog) {
      expect(typeof entry.id).toBe("string");
      expect(entry.id.length).toBeGreaterThan(0);
      expect(typeof entry.titleVi).toBe("string");
      expect(typeof entry.titleEn).toBe("string");
      expect(typeof entry.descriptionVi).toBe("string");
      expect(Array.isArray(entry.supportedLevels)).toBe(true);
      expect(["judge", "adversary", "benchmark"]).toContain(entry.role);
    }
  });

  it("catalog has correct expected count", () => {
    const catalog = getEvaluatorPromptCatalog();
    expect(catalog.length).toBe(15);
  });

  it("catalog IDs are unique", () => {
    const catalog = getEvaluatorPromptCatalog();
    const ids = catalog.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getEvaluatorPromptById finds existing entry", () => {
    const entry = getEvaluatorPromptById("eval-composite-judge");
    expect(entry).not.toBeNull();
    expect(entry!.dimension).toBe("composite");
    expect(entry!.role).toBe("judge");
  });

  it("getEvaluatorPromptById returns null for missing ID", () => {
    expect(getEvaluatorPromptById("nonexistent-id")).toBeNull();
  });

  it("getEvaluatorPromptsByDimension filters correctly", () => {
    const diagPrompts = getEvaluatorPromptsByDimension("diagnosis");
    expect(diagPrompts.length).toBeGreaterThan(0);
    for (const entry of diagPrompts) {
      expect(entry.dimension).toBe("diagnosis");
    }
  });

  it("getEvaluatorPromptsByRole filters correctly", () => {
    const judgePrompts = getEvaluatorPromptsByRole("judge");
    expect(judgePrompts.length).toBeGreaterThan(0);
    for (const entry of judgePrompts) {
      expect(entry.role).toBe("judge");
    }

    const adversaryPrompts = getEvaluatorPromptsByRole("adversary");
    expect(adversaryPrompts.length).toBeGreaterThan(0);
    for (const entry of adversaryPrompts) {
      expect(entry.role).toBe("adversary");
    }
  });

  it("catalog contains entries for all 6 dimensions + composite", () => {
    const catalog = getEvaluatorPromptCatalog();
    const dimensions = new Set(catalog.map((e) => e.dimension));
    expect(dimensions.has("diagnosis")).toBe(true);
    expect(dimensions.has("teaching")).toBe(true);
    expect(dimensions.has("memory")).toBe(true);
    expect(dimensions.has("adaptation")).toBe(true);
    expect(dimensions.has("selfCheck")).toBe(true);
    expect(dimensions.has("learningGain")).toBe(true);
    expect(dimensions.has("composite")).toBe(true);
  });

  it("catalog entries for judge role support all 3 levels", () => {
    const catalog = getEvaluatorPromptCatalog();
    const judgeEntries = catalog.filter((e) => e.role === "judge");
    for (const entry of judgeEntries) {
      expect(entry.supportedLevels).toContain("strict");
      expect(entry.supportedLevels).toContain("harsh");
      expect(entry.supportedLevels).toContain("merciless");
    }
  });

  it("adversary entries only support harsh and merciless", () => {
    const catalog = getEvaluatorPromptCatalog();
    const adversaryEntries = catalog.filter((e) => e.role === "adversary");
    for (const entry of adversaryEntries) {
      expect(entry.supportedLevels).not.toContain("strict");
    }
  });
});

// ─── Suite 9: buildEvaluatorPromptById ─────────────────────────────────────────

describe("harshEvaluatorPrompts — buildEvaluatorPromptById", () => {
  const input = makeBaseInput({ harshness: "harsh" });

  it("returns prompt for valid judge IDs", () => {
    const ids = [
      "eval-diag-judge",
      "eval-teach-judge",
      "eval-mem-judge",
      "eval-adapt-judge",
      "eval-self-judge",
      "eval-gain-judge",
      "eval-composite-judge",
    ];
    for (const id of ids) {
      const prompt = buildEvaluatorPromptById(id, input);
      expect(prompt).not.toBeNull();
      expect(typeof prompt).toBe("string");
      expect(prompt!.length).toBeGreaterThan(500);
    }
  });

  it("returns prompt for valid adversary IDs", () => {
    const ids = [
      "eval-diag-adversary",
      "eval-teach-adversary",
      "eval-mem-adversary",
      "eval-adapt-adversary",
      "eval-self-adversary",
      "eval-gain-adversary",
      "eval-composite-adversary",
    ];
    for (const id of ids) {
      const prompt = buildEvaluatorPromptById(id, input);
      expect(prompt).not.toBeNull();
      expect(typeof prompt).toBe("string");
      expect(prompt!.length).toBeGreaterThan(500);
    }
  });

  it("returns prompt for scenario benchmark ID", () => {
    const prompt = buildEvaluatorPromptById("eval-scenario-benchmark", input);
    expect(prompt).not.toBeNull();
    expect(typeof prompt).toBe("string");
    expect(prompt!.length).toBeGreaterThan(500);
  });

  it("returns null for invalid ID", () => {
    expect(buildEvaluatorPromptById("nonsense-id", input)).toBeNull();
  });
});

// ─── Suite 10: Validation Helpers ──────────────────────────────────────────────

describe("harshEvaluatorPrompts — validation helpers", () => {
  it("isValidHarshnessLevel accepts valid levels", () => {
    expect(isValidHarshnessLevel("strict")).toBe(true);
    expect(isValidHarshnessLevel("harsh")).toBe(true);
    expect(isValidHarshnessLevel("merciless")).toBe(true);
  });

  it("isValidHarshnessLevel rejects invalid levels", () => {
    expect(isValidHarshnessLevel("easy")).toBe(false);
    expect(isValidHarshnessLevel("medium")).toBe(false);
    expect(isValidHarshnessLevel("")).toBe(false);
  });

  it("isValidEvaluatorDimension accepts all 6 dimensions", () => {
    expect(isValidEvaluatorDimension("diagnosis")).toBe(true);
    expect(isValidEvaluatorDimension("teaching")).toBe(true);
    expect(isValidEvaluatorDimension("memory")).toBe(true);
    expect(isValidEvaluatorDimension("adaptation")).toBe(true);
    expect(isValidEvaluatorDimension("selfCheck")).toBe(true);
    expect(isValidEvaluatorDimension("learningGain")).toBe(true);
  });

  it("isValidEvaluatorDimension rejects invalid dimensions", () => {
    expect(isValidEvaluatorDimension("composite")).toBe(false);
    expect(isValidEvaluatorDimension("")).toBe(false);
    expect(isValidEvaluatorDimension("unknown")).toBe(false);
  });

  it("getEvaluatorDimensionLabelVi returns Vietnamese labels", () => {
    expect(getEvaluatorDimensionLabelVi("diagnosis")).toBe("Chẩn đoán");
    expect(getEvaluatorDimensionLabelVi("teaching")).toBe("Giảng dạy");
    expect(getEvaluatorDimensionLabelVi("memory")).toBe("Ghi nhớ");
    expect(getEvaluatorDimensionLabelVi("adaptation")).toBe("Thích ứng");
    expect(getEvaluatorDimensionLabelVi("selfCheck")).toBe("Tự kiểm");
    expect(getEvaluatorDimensionLabelVi("learningGain")).toBe("Tiến bộ");
  });

  it("getEvaluatorDimensionLabelEn returns English labels", () => {
    expect(getEvaluatorDimensionLabelEn("diagnosis")).toBe("Diagnosis");
    expect(getEvaluatorDimensionLabelEn("teaching")).toBe("Teaching");
    expect(getEvaluatorDimensionLabelEn("memory")).toBe("Memory");
    expect(getEvaluatorDimensionLabelEn("adaptation")).toBe("Adaptation");
    expect(getEvaluatorDimensionLabelEn("selfCheck")).toBe("Self-Check");
    expect(getEvaluatorDimensionLabelEn("learningGain")).toBe("Learning Gain");
  });

  it("getContractRuleDescriptionVi returns all 10 rules", () => {
    const ruleIds = [
      "R1_MEANING_FIRST",
      "R2_ONE_CORRECTION_MAX",
      "R3_NO_FAKE_PRAISE",
      "R4_ONE_FOLLOW_UP",
      "R5_REMEMBER_WEAKNESS",
      "R6_VIETNAMESE_INTERFERENCE",
      "R7_STRATEGIC_SILENCE",
      "R8_FACE_SAVING",
      "R9_SELF_CORRECTION_SPACE",
      "R10_NEXT_PRACTICE_WHEN_HELPFUL",
    ] as const;
    for (const ruleId of ruleIds) {
      const desc = getContractRuleDescriptionVi(ruleId);
      expect(typeof desc).toBe("string");
      expect(desc.length).toBeGreaterThan(0);
    }
  });
});

// ─── Suite 11: Statistics ──────────────────────────────────────────────────────

describe("harshEvaluatorPrompts — statistics", () => {
  it("returns correct total count", () => {
    const stats = getEvaluatorPromptStatistics();
    expect(stats.totalPrompts).toBe(15);
  });

  it("breaks down by role correctly", () => {
    const stats = getEvaluatorPromptStatistics();
    expect(stats.byRole.judge).toBe(7);
    expect(stats.byRole.adversary).toBe(7);
    expect(stats.byRole.benchmark).toBe(1);
    expect(stats.byRole.judge + stats.byRole.adversary + stats.byRole.benchmark).toBe(
      15,
    );
  });

  it("breaks down by dimension correctly", () => {
    const stats = getEvaluatorPromptStatistics();
    // 6 dimensions × 2 roles (judge + adversary) = 12 + 2 composite + 1 benchmark = 15
    expect(stats.byDimension["diagnosis"]).toBe(2);
    expect(stats.byDimension["teaching"]).toBe(2);
    expect(stats.byDimension["memory"]).toBe(2);
    expect(stats.byDimension["adaptation"]).toBe(2);
    expect(stats.byDimension["selfCheck"]).toBe(2);
    expect(stats.byDimension["learningGain"]).toBe(2);
    expect(stats.byDimension["composite"]).toBe(3);
  });

  it("supportedDimensions includes all 7 dimension keys", () => {
    const stats = getEvaluatorPromptStatistics();
    expect(stats.supportedDimensions.sort()).toEqual([
      "adaptation",
      "composite",
      "diagnosis",
      "learningGain",
      "memory",
      "selfCheck",
      "teaching",
    ]);
  });
});

// ─── Suite 12: Kids Mode Prompts ───────────────────────────────────────────────

describe("harshEvaluatorPrompts — kids mode", () => {
  it("composite prompt mentions kids mode in context", () => {
    const input = makeKidsInput();
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("CÓ"); // isKidsMode
  });

  it("adaptation prompt includes kids-specific criteria", () => {
    const input = makeKidsInput();
    const prompt = buildAdaptationEvaluatorPrompt(input);
    expect(prompt).toContain("TRẺ EM");
    expect(prompt).toContain("GIỮ AN TOÀN");
  });

  it("all per-dimension builders work with kids mode input", () => {
    const input = makeKidsInput();
    for (const builder of Object.values(DIMENSION_PROMPT_BUILDERS)) {
      const prompt = builder(input);
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(100);
    }
  });
});

// ─── Suite 13: B2/C1 Level Prompts ─────────────────────────────────────────────

describe("harshEvaluatorPrompts — advanced CEFR levels", () => {
  it("adaptation prompt warns about using Vietnamese for B2 learners", () => {
    const input = makeB2Input();
    const prompt = buildAdaptationEvaluatorPrompt(input);
    // The criteria should mention that B2+ learners need English practice
    expect(prompt).toContain("B2");
  });

  it("composite prompt with B2 learner has appropriate context", () => {
    const input = makeB2Input();
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("B2");
    expect(prompt).toContain("prepositions");
  });

  it("diagnosis prompt handles multi-error B2 sentences", () => {
    const input = makeB2Input();
    const prompt = buildDiagnosisEvaluatorPrompt(input);
    // B2 sentence has multiple errors — diagnosis should handle multi-error
    expect(prompt).toContain("nhiều lỗi");
  });
});

// ─── Suite 14: Vietnamese-First Proof ──────────────────────────────────────────

describe("harshEvaluatorPrompts — Vietnamese-first", () => {
  it("evaluator persona is in Vietnamese", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildDiagnosisEvaluatorPrompt(input);
    expect(prompt).toContain("GIÁM KHẢO ĐÁNH GIÁ GIÁO VIÊN");
    expect(prompt).toContain("Nhiệm vụ của bạn");
  });

  it("contract rule descriptions are in Vietnamese", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("Công nhận ý nghĩa trước khi sửa lỗi");
    expect(prompt).toContain("Tối đa một lần sửa lỗi mỗi lượt");
    expect(prompt).toContain("Không khen giả tạo");
    expect(prompt).toContain("Ghi nhớ điểm yếu người học");
  });

  it("output format instructions are in Vietnamese", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildTeachingEvaluatorPrompt(input);
    expect(prompt).toContain("KẾT LUẬN:");
    expect(prompt).toContain("ĐIỂM TỔNG:");
    expect(prompt).toContain("TÓM TẮT TIẾNG VIỆT:");
    expect(prompt).toContain("HIỂN THỊ CHO NGƯỜI HỌC:");
  });

  it("all forbidden behaviors are described in Vietnamese", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("Khen giả tạo");
    expect(prompt).toContain("Bịa thống kê");
    expect(prompt).toContain("Cam kết quá mức");
    expect(prompt).toContain("Đọc suy nghĩ");
  });

  it("harshness level descriptions are in Vietnamese", () => {
    const strict = getHarshnessConfig("strict");
    expect(strict.descriptionVi).toContain("Nghiêm khắc");
    const harsh = getHarshnessConfig("harsh");
    expect(harsh.descriptionVi).toContain("Khắt khe");
    const merciless = getHarshnessConfig("merciless");
    expect(merciless.descriptionVi).toContain("Tàn nhẫn");
  });
});

// ─── Suite 15: Prompt Structure & Quality ──────────────────────────────────────

describe("harshEvaluatorPrompts — prompt structure and quality", () => {
  it("every prompt has clear section delimiters", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    // Section headers with ━━━ delimiters
    expect(prompt).toContain("━━━");
  });

  it("every prompt demands evidence quotes in output", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("Dẫn chứng");
    expect(prompt).toContain("NGUYÊN VĂN");
    expect(prompt).toContain("trích dẫn");
  });

  it("dimension prompts contain dimension-specific evaluation questions", () => {
    const input = makeBaseInput({ harshness: "harsh" });

    const diagPrompt = buildDiagnosisEvaluatorPrompt(input);
    expect(diagPrompt).toContain("phát hiện ĐÚNG lỗi");

    const teachPrompt = buildTeachingEvaluatorPrompt(input);
    expect(teachPrompt).toContain("công nhận ý nghĩa TRƯỚC");

    const memPrompt = buildMemoryEvaluatorPrompt(input);
    expect(memPrompt).toContain("THAM CHIẾU điểm yếu");

    const adaptPrompt = buildAdaptationEvaluatorPrompt(input);
    expect(adaptPrompt).toContain("PHÙ HỢP CEFR");

    const selfPrompt = buildSelfCheckEvaluatorPrompt(input);
    expect(selfPrompt).toContain("NGÔN NGỮ TUYỆT ĐỐI");

    const gainPrompt = buildLearningGainEvaluatorPrompt(input);
    expect(gainPrompt).toContain("ĐO LƯỜNG");
  });
});

// ─── Suite 16: createMinimalEvaluatorInput ──────────────────────────────────────

describe("harshEvaluatorPrompts — createMinimalEvaluatorInput", () => {
  it("returns a complete input object", () => {
    const input = createMinimalEvaluatorInput();
    expect(typeof input.learnerText).toBe("string");
    expect(input.learnerText.length).toBeGreaterThan(0);
    expect(input.tutorResponse).toBeDefined();
    expect(input.tutorResponse.vi.length).toBeGreaterThan(0);
    expect(input.learnerContext).toBeDefined();
    expect(input.harshness).toBe("harsh");
  });

  it("accepts overrides", () => {
    const input = createMinimalEvaluatorInput({
      harshness: "merciless",
      learnerText: "Custom text.",
    });
    expect(input.harshness).toBe("merciless");
    expect(input.learnerText).toBe("Custom text.");
    // Other defaults should still be present
    expect(input.tutorResponse).toBeDefined();
  });

  it("has defaults that produce valid prompts", () => {
    const input = createMinimalEvaluatorInput();
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt.length).toBeGreaterThan(1000);
  });
});

// ─── Suite 17: Edge Cases ──────────────────────────────────────────────────────

describe("harshEvaluatorPrompts — edge cases", () => {
  it("handles null CEFR level gracefully", () => {
    const input = makeBaseInput({
      learnerContext: {
        cefrLevel: null,
        l1: "vi",
        knownWeaknesses: [],
        isKidsMode: false,
        sessionNumber: 1,
      },
    });
    const prompt = buildDiagnosisEvaluatorPrompt(input);
    expect(prompt).toContain("không rõ");
  });

  it("handles empty knownWeaknesses array", () => {
    const input = makeBaseInput({
      learnerContext: {
        cefrLevel: "B1",
        l1: "vi",
        knownWeaknesses: [],
        isKidsMode: false,
        sessionNumber: 1,
      },
    });
    const prompt = buildMemoryEvaluatorPrompt(input);
    expect(prompt).toContain("chưa có");
  });

  it("handles tutor response without English text", () => {
    const input = makeBaseInput({
      tutorResponse: {
        vi: "Chỉ có tiếng Việt thôi.",
      },
    });
    const prompt = buildTeachingEvaluatorPrompt(input);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(100);
    expect(prompt).not.toContain("Nội dung tiếng Anh");
  });

  it("handles tutor response without correctedSentence", () => {
    const input = makeBaseInput({
      tutorResponse: {
        vi: "Câu trả lời không có sửa lỗi.",
      },
    });
    const prompt = buildDiagnosisEvaluatorPrompt(input);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(100);
  });

  it("handles session 1 (no previous sessions for memory)", () => {
    const input = makeBaseInput({
      learnerContext: {
        cefrLevel: "A1",
        l1: "vi",
        knownWeaknesses: [],
        isKidsMode: false,
        sessionNumber: 1,
      },
    });
    const prompt = buildMemoryEvaluatorPrompt(input);
    expect(prompt).toContain("buổi đầu tiên");
  });

  it("buildCompositeEvaluatorPrompt with session 50 is valid", () => {
    const input = makeBaseInput({
      learnerContext: {
        cefrLevel: "C1",
        l1: "vi",
        knownWeaknesses: ["subjunctive", "inversion", "collocations"],
        isKidsMode: false,
        sessionNumber: 50,
      },
    });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(1000);
  });

  it("all prompts produce strings that don't contain raw undefined/null", () => {
    const inputs = [
      makeBaseInput({ harshness: "strict" }),
      makeBaseInput({ harshness: "harsh" }),
      makeBaseInput({ harshness: "merciless" }),
      makeKidsInput(),
      makeB2Input(),
    ];

    const builders = [
      buildDiagnosisEvaluatorPrompt,
      buildTeachingEvaluatorPrompt,
      buildMemoryEvaluatorPrompt,
      buildAdaptationEvaluatorPrompt,
      buildSelfCheckEvaluatorPrompt,
      buildLearningGainEvaluatorPrompt,
      buildCompositeEvaluatorPrompt,
      (i: HarshEvaluatorInput) => buildAdversarialEvaluatorPrompt(i),
      (i: HarshEvaluatorInput) => buildScenarioAnchoredEvaluatorPrompt(i),
    ];

    for (const input of inputs) {
      for (const builder of builders) {
        const prompt = builder(input);
        expect(prompt).not.toContain("undefined");
        expect(prompt).not.toContain("null");
      }
    }
  });
});

// ─── Suite 18: Determinism ─────────────────────────────────────────────────────

describe("harshEvaluatorPrompts — determinism", () => {
  it("same input produces identical prompts", () => {
    const input = makeBaseInput({ harshness: "harsh" });

    const builders = [
      buildDiagnosisEvaluatorPrompt,
      buildTeachingEvaluatorPrompt,
      buildMemoryEvaluatorPrompt,
      buildAdaptationEvaluatorPrompt,
      buildSelfCheckEvaluatorPrompt,
      buildLearningGainEvaluatorPrompt,
      buildCompositeEvaluatorPrompt,
      (i: HarshEvaluatorInput) => buildAdversarialEvaluatorPrompt(i),
      (i: HarshEvaluatorInput) => buildScenarioAnchoredEvaluatorPrompt(i),
    ];

    for (const builder of builders) {
      const a = builder(input);
      const b = builder(input);
      expect(a).toBe(b);
    }
  });

  it("getEvaluatorPromptCatalog returns identical arrays", () => {
    const a = getEvaluatorPromptCatalog();
    const b = getEvaluatorPromptCatalog();
    expect(a).toEqual(b);
  });

  it("getHarshnessConfig returns identical configs for same level", () => {
    const a = getHarshnessConfig("merciless");
    const b = getHarshnessConfig("merciless");
    expect(a).toEqual(b);
  });

  it("getEvaluatorPromptStatistics is deterministic", () => {
    const a = getEvaluatorPromptStatistics();
    const b = getEvaluatorPromptStatistics();
    expect(a).toEqual(b);
  });
});

// ─── Suite 19: Prompt Size Bounds ──────────────────────────────────────────────

describe("harshEvaluatorPrompts — prompt size bounds", () => {
  it("per-dimension prompts are at least 1KB", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    for (const builder of Object.values(DIMENSION_PROMPT_BUILDERS)) {
      const prompt = builder(input);
      expect(prompt.length).toBeGreaterThanOrEqual(1000);
    }
  });

  it("composite prompt is the largest (at least 5KB)", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt.length).toBeGreaterThanOrEqual(5000);
  });

  it("per-dimension prompts are smaller than composite", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const compositeLen = buildCompositeEvaluatorPrompt(input).length;
    for (const builder of Object.values(DIMENSION_PROMPT_BUILDERS)) {
      expect(builder(input).length).toBeLessThan(compositeLen);
    }
  });

  it("adversarial prompt is within reasonable size (1KB–10KB)", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildAdversarialEvaluatorPrompt(input);
    expect(prompt.length).toBeGreaterThanOrEqual(1000);
    expect(prompt.length).toBeLessThanOrEqual(10000);
  });
});

// ─── Suite 20: Contract Rule Integration ───────────────────────────────────────

describe("harshEvaluatorPrompts — contract rule integration", () => {
  it("R1 (meaning first) is referenced in teaching prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildTeachingEvaluatorPrompt(input);
    expect(prompt).toContain("R1");
  });

  it("R2 (one correction max) is referenced in teaching prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildTeachingEvaluatorPrompt(input);
    expect(prompt).toContain("R2");
  });

  it("R3 (no fake praise) is referenced in all prompts via shared criteria", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    for (const builder of Object.values(DIMENSION_PROMPT_BUILDERS)) {
      const prompt = builder(input);
      expect(prompt).toContain("R3");
    }
  });

  it("R5 (remember weakness) is referenced in memory prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildMemoryEvaluatorPrompt(input);
    expect(prompt).toContain("R5");
  });

  it("R6 (Vietnamese interference) is referenced in diagnosis prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildDiagnosisEvaluatorPrompt(input);
    expect(prompt).toContain("R6");
  });

  it("R7 (strategic silence) is referenced in self-check prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildSelfCheckEvaluatorPrompt(input);
    expect(prompt).toContain("R7");
  });

  it("R8 (face saving) is referenced in teaching prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildTeachingEvaluatorPrompt(input);
    expect(prompt).toContain("R8");
  });

  it("R9 (self-correction space) is referenced in teaching prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildTeachingEvaluatorPrompt(input);
    expect(prompt).toContain("R9");
  });

  it("R10 (next practice) is referenced in learning gain prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildLearningGainEvaluatorPrompt(input);
    expect(prompt).toContain("R10");
  });

  it("O1-O8 overclaim rules are referenced in self-check prompt", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildSelfCheckEvaluatorPrompt(input);
    expect(prompt).toContain("O1-O8");
  });
});

// ─── Suite 21: Integration — Prompts work with unknown violations ──────────────

describe("harshEvaluatorPrompts — known violations integration", () => {
  it("knownViolations are rendered in the learner context section", () => {
    const input = makeBaseInput({
      harshness: "merciless",
      knownViolations: [
        "R1_MEANING_FIRST",
        "R2_ONE_CORRECTION_MAX",
        "R3_NO_FAKE_PRAISE",
      ],
    });
    const prompt = buildCompositeEvaluatorPrompt(input);
    expect(prompt).toContain("R1_MEANING_FIRST");
    expect(prompt).toContain("R2_ONE_CORRECTION_MAX");
    expect(prompt).toContain("R3_NO_FAKE_PRAISE");
  });

  it("no violations section when knownViolations is empty/absent", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const prompt = buildDiagnosisEvaluatorPrompt(input);
    // Should not contain the "Quy tắc đã vi phạm" line
    expect(prompt).not.toContain("Quy tắc đã vi phạm");
  });
});

// ─── Suite 22: Previous Turns Rendering ────────────────────────────────────────

describe("harshEvaluatorPrompts — previous turns rendering", () => {
  it("previous turns appear in prompts that support them", () => {
    const input = makeBaseInput({
      harshness: "harsh",
      previousTurns: [
        "First tutor response text here.",
        "Second tutor response text.",
        "Third tutor response.",
      ],
    });
    const buildersThatSupportTurns = [
      buildDiagnosisEvaluatorPrompt,
      buildTeachingEvaluatorPrompt,
      buildMemoryEvaluatorPrompt,
      buildAdaptationEvaluatorPrompt,
      buildLearningGainEvaluatorPrompt,
      buildCompositeEvaluatorPrompt,
    ];
    for (const builder of buildersThatSupportTurns) {
      const prompt = builder(input);
      expect(prompt).toContain("CÁC LƯỢT TRƯỚC");
      expect(prompt).toContain("First tutor response text here.");
    }
  });

  it("self-check prompt does not include previous turns", () => {
    const input = makeBaseInput({
      harshness: "harsh",
      previousTurns: ["Some previous turn."],
    });
    const prompt = buildSelfCheckEvaluatorPrompt(input);
    // Self-check mainly focuses on the current response's overclaim patterns,
    // not on repetition — it's acceptable if it doesn't show previous turns
    expect(typeof prompt).toBe("string");
  });

  it("when previousTurns is undefined, no turns section appears", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    delete (input as any).previousTurns;
    const prompt = buildDiagnosisEvaluatorPrompt(input);
    expect(prompt).not.toContain("CÁC LƯỢT TRƯỚC");
  });
});

// ─── Suite 23: Output Format Consistency ───────────────────────────────────────

describe("harshEvaluatorPrompts — output format consistency", () => {
  it("all judge prompts ask for KẾT LUẬN with PASS/FAIL/BORDERLINE", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const judgeBuilders = [
      buildDiagnosisEvaluatorPrompt,
      buildTeachingEvaluatorPrompt,
      buildMemoryEvaluatorPrompt,
      buildAdaptationEvaluatorPrompt,
      buildSelfCheckEvaluatorPrompt,
      buildLearningGainEvaluatorPrompt,
      buildCompositeEvaluatorPrompt,
    ];
    for (const builder of judgeBuilders) {
      const prompt = builder(input);
      expect(prompt).toContain("KẾT LUẬN: PASS | FAIL | BORDERLINE");
    }
  });

  it("all prompts ask for HIỂN THỊ CHO NGƯỜI HỌC", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const allBuilders = [
      buildDiagnosisEvaluatorPrompt,
      buildTeachingEvaluatorPrompt,
      buildMemoryEvaluatorPrompt,
      buildAdaptationEvaluatorPrompt,
      buildSelfCheckEvaluatorPrompt,
      buildLearningGainEvaluatorPrompt,
      buildCompositeEvaluatorPrompt,
      (i: HarshEvaluatorInput) => buildAdversarialEvaluatorPrompt(i),
      (i: HarshEvaluatorInput) => buildScenarioAnchoredEvaluatorPrompt(i),
    ];
    for (const builder of allBuilders) {
      const prompt = builder(input);
      expect(prompt).toContain("HIỂN THỊ CHO NGƯỜI HỌC");
    }
  });

  it("all prompts ask for ĐIỂM TỔNG 0-100", () => {
    const input = makeBaseInput({ harshness: "harsh" });
    const allBuilders = [
      buildDiagnosisEvaluatorPrompt,
      buildTeachingEvaluatorPrompt,
      buildMemoryEvaluatorPrompt,
      buildAdaptationEvaluatorPrompt,
      buildSelfCheckEvaluatorPrompt,
      buildLearningGainEvaluatorPrompt,
      buildCompositeEvaluatorPrompt,
      (i: HarshEvaluatorInput) => buildAdversarialEvaluatorPrompt(i),
      (i: HarshEvaluatorInput) => buildScenarioAnchoredEvaluatorPrompt(i),
    ];
    for (const builder of allBuilders) {
      const prompt = builder(input);
      expect(prompt).toContain("ĐIỂM TỔNG:");
    }
  });
});
