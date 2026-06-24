import {
  punjabiB1IntegrationSamples,
  type PunjabiB1IntegrationSampleFocus,
  type PunjabiIntegrationSampleLine,
} from "../integrationSamplesB1";

const requiredFocuses: PunjabiB1IntegrationSampleFocus[] = [
  "explain_situation",
  "retell_event",
  "clarify_next_steps",
  "service_conversation",
  "workplace_issue",
  "housing_issue",
  "school_community_task",
  "register_aware_request",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiIntegrationSampleLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1IntegrationSamples", () => {
  it("is a compact app-consumable B1 sample set with unique ids", () => {
    expect(punjabiB1IntegrationSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1IntegrationSamples.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1IntegrationSamples.map((sample) => sample.id)).size,
    ).toBe(punjabiB1IntegrationSamples.length);
    expect(
      punjabiB1IntegrationSamples.every((sample) => sample.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 20 integration-sample focus", () => {
    const actualFocuses = new Set(
      punjabiB1IntegrationSamples.map((sample) => sample.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps advice-sensitive samples inside language support", () => {
    const serializedSamples = JSON.stringify(punjabiB1IntegrationSamples);

    expect(serializedSamples).toContain("Language practice only");
    expect(serializedSamples).toContain("not medical advice");
    expect(serializedSamples).toContain("not legal or financial advice");
    expect(serializedSamples).toContain("Chỉ luyện ngôn ngữ");
    expect(serializedSamples).toContain("Chỉ hỗ trợ ngôn ngữ");
  });

  it.each(punjabiB1IntegrationSamples)(
    "$id includes bilingual task text and Canada-practical context",
    (sample) => {
      expect(sample.integrationSlot).toMatch(/^b1_final_/);
      expect(sample.title_en).toBeTruthy();
      expect(sample.title_vi).toBeTruthy();
      expect(sample.learnerTask_en).toBeTruthy();
      expect(sample.learnerTask_vi).toBeTruthy();
      expect(sample.canadaUseCase).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1IntegrationSamples)(
    "$id includes Gurmukhi-primary setup lines with romanization",
    (sample) => {
      expect(sample.setupLines.length).toBeGreaterThanOrEqual(3);
      for (const line of sample.setupLines) {
        expectLine(line);
      }
    },
  );

  it.each(punjabiB1IntegrationSamples)(
    "$id includes final-evidence prompts and sample response",
    (sample) => {
      expect(sample.finalEvidence.prompt_en).toBeTruthy();
      expect(sample.finalEvidence.prompt_vi).toBeTruthy();
      expectLine(sample.finalEvidence.sampleResponse);
      expect(sample.finalEvidence.evidenceSignals_en.length).toBeGreaterThanOrEqual(
        3,
      );
      expect(sample.finalEvidence.evidenceSignals_vi).toHaveLength(
        sample.finalEvidence.evidenceSignals_en.length,
      );
    },
  );

  it.each(punjabiB1IntegrationSamples)(
    "$id includes learner traps and repair language",
    (sample) => {
      expect(sample.commonTraps.length).toBeGreaterThanOrEqual(1);
      for (const trap of sample.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expectLine(trap.repair);
      }
    },
  );

  it.each(punjabiB1IntegrationSamples)(
    "$id includes final-QA notes for later wiring",
    (sample) => {
      expect(sample.finalQaNote_en).toMatch(/QA|evidence|wiring|verify/i);
      expect(sample.finalQaNote_vi).toBeTruthy();
    },
  );

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serializedSamples = JSON.stringify(punjabiB1IntegrationSamples);

    expect(serializedSamples).toContain("Shahmukhi");
    expect(serializedSamples).toContain("awareness only");
    expect(serializedSamples).toContain("Native review is deferred");
    expect(serializedSamples).not.toContain("native-reviewed");
    expect(serializedSamples).not.toContain("native approved");
  });
});
