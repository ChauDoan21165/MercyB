import type { PlacementBenchmarkScenario } from "./types.js";

export const beginnerA1Scenario: PlacementBenchmarkScenario = {
  id: "beginner-a1",
  label: "Beginner A1 Vietnamese learner",
  expectedCefrTrajectory: ["A1", "A1", "A2"],
  expectedApiCount: 4,
  timeoutThresholdMs: 90_000,
  steps: [
    {
      id: "a1-writing-short",
      modality: "writing",
      expectedCefr: "A1",
      timeoutMs: 25_000,
      payload: {
        promptId: "a1-writing-short",
        taskText: "Write 4 sentences about your family.",
        responseText: "My family has four people. My mother is kind. My father works hard. I love them.",
        targetCefr: "A1",
      },
    },
    {
      id: "a1-reading-mcq",
      modality: "reading",
      expectedCefr: "A1",
      timeoutMs: 25_000,
      payload: {
        promptId: "a1-reading-mcq",
        passageText: "Lan is a student. She lives in Da Nang. Every morning she drinks coffee and goes to school by bus.",
        questionText: "Where does Lan live?",
        questionType: "short_answer",
        expectedAnswer: "Da Nang",
        userResponse: "Da Nang",
        targetCefr: "A1",
      },
    },
    {
      id: "a1-listening-short",
      modality: "listening",
      expectedCefr: "A1",
      timeoutMs: 25_000,
      payload: {
        promptId: "a1-listening-short",
        transcriptOfHeardContent: "The train leaves at seven thirty. Please arrive ten minutes early.",
        questionText: "What time does the train leave?",
        questionType: "short_answer",
        expectedAnswer: "seven thirty",
        userResponse: "seven thirty",
        targetCefr: "A1",
      },
    },
    {
      id: "a1-speaking-intro",
      modality: "speaking",
      expectedCefr: "A1",
      timeoutMs: 25_000,
      payload: {
        promptId: "a1-speaking-intro",
        taskText: "Introduce yourself and say what you do every day.",
        transcript: "Hello, my name is Minh. I am a student. I go to school every day and I study English at night.",
        durationSeconds: 22,
        targetLanguage: "en",
      },
    },
  ],
};
