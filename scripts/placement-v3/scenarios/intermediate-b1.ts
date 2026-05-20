import type { PlacementBenchmarkScenario } from "./types.js";

export const intermediateB1Scenario: PlacementBenchmarkScenario = {
  id: "intermediate-b1",
  label: "Intermediate B1 placement flow",
  expectedCefrTrajectory: ["B1", "B1", "B2"],
  expectedApiCount: 4,
  timeoutThresholdMs: 90_000,
  steps: [
    {
      id: "b1-writing-opinion",
      modality: "writing",
      expectedCefr: "B1",
      timeoutMs: 25_000,
      payload: {
        promptId: "b1-writing-opinion",
        taskText: "Do you prefer studying online or in a classroom? Explain why.",
        responseText: "I prefer studying online because it saves time and I can replay the lesson. However, classroom study is useful when I need to ask questions quickly.",
        targetCefr: "B1",
      },
    },
    {
      id: "b1-reading-inference",
      modality: "reading",
      expectedCefr: "B1",
      timeoutMs: 25_000,
      payload: {
        promptId: "b1-reading-inference",
        passageText: "Although the new bus route is slower during rush hour, many office workers use it because it stops near two large apartment blocks.",
        questionText: "Why do many workers still use the route?",
        questionType: "short_answer",
        expectedAnswer: "It stops near their homes.",
        userResponse: "Because it is convenient and stops near apartment buildings.",
        targetCefr: "B1",
      },
    },
    {
      id: "b1-listening-detail",
      modality: "listening",
      expectedCefr: "B1",
      timeoutMs: 25_000,
      payload: {
        promptId: "b1-listening-detail",
        transcriptOfHeardContent: "The meeting has moved from Tuesday afternoon to Wednesday morning because the client is flying in late.",
        questionText: "Why was the meeting moved?",
        questionType: "short_answer",
        expectedAnswer: "The client is flying in late.",
        userResponse: "The client will arrive late.",
        targetCefr: "B1",
      },
    },
    {
      id: "b1-speaking-work",
      modality: "speaking",
      expectedCefr: "B1",
      timeoutMs: 25_000,
      payload: {
        promptId: "b1-speaking-work",
        taskText: "Describe a work problem you solved.",
        transcript: "Last month our team had a problem with a late order. I called the supplier, explained the deadline, and arranged a smaller first delivery so the customer could start on time.",
        durationSeconds: 42,
        targetLanguage: "en",
      },
    },
  ],
};
