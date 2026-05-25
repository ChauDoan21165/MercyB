import type { PlacementBenchmarkScenario } from "./types.js";

export const advancedC1Scenario: PlacementBenchmarkScenario = {
  id: "advanced-c1",
  label: "Advanced C1 DET-class flow",
  expectedCefrTrajectory: ["B2", "C1", "C1"],
  expectedApiCount: 4,
  timeoutThresholdMs: 90_000,
  steps: [
    {
      id: "c1-writing-argument",
      modality: "writing",
      expectedCefr: "C1",
      timeoutMs: 30_000,
      payload: {
        promptId: "c1-writing-argument",
        taskText: "Evaluate whether remote work improves productivity.",
        responseText: "Remote work can improve productivity when teams define outcomes clearly, but it also exposes weak management habits. The decisive factor is not location; it is whether communication norms, accountability, and deep-work time are protected.",
        targetCefr: "C1",
      },
    },
    {
      id: "c1-reading-synthesis",
      modality: "reading",
      expectedCefr: "C1",
      timeoutMs: 30_000,
      payload: {
        promptId: "c1-reading-synthesis",
        passageText: "The policy reduced headline congestion, yet its benefits were uneven: affluent commuters shifted schedules while lower-income workers absorbed longer transfers.",
        questionText: "What limitation of the policy does the passage identify?",
        questionType: "short_answer",
        expectedAnswer: "Its benefits were uneven and burdened lower-income workers.",
        userResponse: "It helped overall congestion but distributed the costs unfairly, especially to workers with less schedule flexibility.",
        targetCefr: "C1",
      },
    },
    {
      id: "c1-listening-nuance",
      modality: "listening",
      expectedCefr: "C1",
      timeoutMs: 30_000,
      payload: {
        promptId: "c1-listening-nuance",
        transcriptOfHeardContent: "The speaker concedes that automation displaces some roles, but argues the larger risk is a skills mismatch during the transition.",
        questionText: "What does the speaker see as the larger risk?",
        questionType: "short_answer",
        expectedAnswer: "A skills mismatch during the transition.",
        userResponse: "Not automation itself, but the temporary mismatch between available jobs and workers' skills.",
        targetCefr: "C1",
      },
    },
    {
      id: "c1-speaking-policy",
      modality: "speaking",
      expectedCefr: "C1",
      timeoutMs: 30_000,
      payload: {
        promptId: "c1-speaking-policy",
        taskText: "Discuss whether cities should restrict private cars downtown.",
        transcript: "I would support restrictions, provided they are paired with reliable public transport. Otherwise the policy becomes symbolic: it reduces traffic for people who already have options while punishing workers whose jobs require inconvenient travel times.",
        durationSeconds: 58,
        targetLanguage: "en",
      },
    },
  ],
};
