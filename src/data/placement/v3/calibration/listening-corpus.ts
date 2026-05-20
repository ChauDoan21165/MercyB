import type { CalibrationEntry } from "./index";

export const LISTENING_CALIBRATION_CORPUS = [
  {
    id: "cal-l-a1-school-1",
    promptId: "a1-l-school-schedule",
    modality: "listening",
    expectedLevel: "A1",
    expectedSubskills: { vocabulary: "A1", coherence: "A1", taskAchievement: "A1" },
    expectedL1Flags: [],
    userResponse: "Monday nine. notebook and blue pen.",
    expertNotes: "Correct key details with minimal production, clearly sufficient for A1 listening.",
    difficulty: "clear",
  },
  {
    id: "cal-l-a2-food-1",
    promptId: "a2-l-food-order",
    modality: "listening",
    expectedLevel: "A2",
    expectedSubskills: { vocabulary: "A2", coherence: "A1", taskAchievement: "A2" },
    expectedL1Flags: ["missing-articles"],
    userResponse: "He order chicken banh mi and iced tea. Pick up ten minute.",
    expertNotes: "Correct transaction details but produced answer has A1/A2 morphology.",
    difficulty: "borderline",
  },
  {
    id: "cal-l-b1-parent-1",
    promptId: "b1-l-parent-teacher",
    modality: "listening",
    expectedLevel: "B1",
    expectedSubskills: { vocabulary: "B1", coherence: "B1", taskAchievement: "B1" },
    expectedL1Flags: ["collocation-transfer"],
    userResponse:
      "Mai is good at reading. She is quiet because she afraid making mistakes. Teacher will put her with patient partner.",
    expertNotes: "Understands strength, reason, and proposed solution. Grammar errors do not undermine listening label.",
    difficulty: "clear",
  },
  {
    id: "cal-l-b1-delivery-1",
    promptId: "b1-l-delivery-problem",
    modality: "listening",
    expectedLevel: "B1",
    expectedSubskills: { vocabulary: "B1", coherence: "B1", taskAchievement: "B1" },
    expectedL1Flags: ["tense-aspect-transfer", "preposition-transfer"],
    userResponse:
      "Package went to old address because change was after shipping, but customer says she changed before paying. If redirect, it can late two days.",
    expertNotes: "Tracks the disagreement and consequence, which is B1-level listening with transferred expression.",
    difficulty: "borderline",
  },
  {
    id: "cal-l-b2-scholarship-1",
    promptId: "b2-l-scholarship-advice",
    modality: "listening",
    expectedLevel: "B2",
    expectedSubskills: { vocabulary: "B2", coherence: "B2", taskAchievement: "B2" },
    expectedL1Flags: ["lexical-repetition"],
    userResponse:
      "The mentor says not to repeat grades because the committee already has the transcript. The essay should focus on rural students and what the student learned when the first workshop failed.",
    expertNotes: "Accurately captures advice and rationale, including the implicit purpose of the essay.",
    difficulty: "clear",
  },
  {
    id: "cal-l-c1-feedback-1",
    promptId: "c1-l-workplace-feedback",
    modality: "listening",
    expectedLevel: "C1",
    expectedSubskills: { vocabulary: "C1", coherence: "C1", taskAchievement: "C1" },
    expectedL1Flags: ["register-flattening"],
    userResponse:
      "The manager liked the careful analysis and trusted numbers. The recommendation was too safe, not decisive enough. Next version should keep evidence but explain the trade-off and say which option is recommended.",
    expertNotes: "Understands nuanced contrast and the requested revision. This is strong C1 listening comprehension.",
    difficulty: "clear",
  },
  {
    id: "cal-l-b2-scholarship-tricky",
    promptId: "b2-l-scholarship-advice",
    modality: "listening",
    expectedLevel: "B2",
    expectedSubskills: { vocabulary: "B2", coherence: "B1", taskAchievement: "B2" },
    expectedL1Flags: ["register-flattening", "word-family-confusion"],
    userResponse:
      "Don't write only grade. They know it. Better write the rural student project because it show personality and failure lesson. This is more touching for committee.",
    expertNotes:
      "Compressed but accurate; expression is informal and slightly transferred, making it a tricky B2 rather than C1.",
    difficulty: "tricky",
  },
  {
    id: "cal-l-a2-food-borderline",
    promptId: "a2-l-food-order",
    modality: "listening",
    expectedLevel: "A2",
    expectedSubskills: { vocabulary: "A2", coherence: "A2", taskAchievement: "A1" },
    expectedL1Flags: ["question-word-order-transfer"],
    userResponse:
      "Chicken banh mi yes, but I think coffee? Ten minute pick up. I not sure drink.",
    expertNotes:
      "Gets the food and pickup time but misses the drink, so comprehension sits at A2 with incomplete task achievement.",
    difficulty: "borderline",
  },
] satisfies CalibrationEntry[];
