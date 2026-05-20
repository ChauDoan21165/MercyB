import { formatRubricForPrompt } from "./rubric.ts";

export type BuildWritingPromptInput = {
  promptId: string;
  taskText: string;
  userResponse: string;
  targetLanguage: "en" | "vi";
};

const ASSESSMENT_SCHEMA = `{
  "overall": { "level": "A1|A2|B1|B2|C1|C2", "confidence": 0.0 },
  "subskills": {
    "grammar": { "level": "A1|A2|B1|B2|C1|C2", "confidence": 0.0, "notes": "string" },
    "vocabulary": { "level": "A1|A2|B1|B2|C1|C2", "confidence": 0.0, "notes": "string" },
    "coherence": { "level": "A1|A2|B1|B2|C1|C2", "confidence": 0.0, "notes": "string" },
    "taskAchievement": { "level": "A1|A2|B1|B2|C1|C2", "confidence": 0.0, "notes": "string" }
  },
  "strengths": ["2-4 concrete strengths"],
  "gaps": ["2-4 concrete, actionable gaps"],
  "l1InterferenceFlags": [
    { "pattern": "missing_articles", "severity": "low|med|high", "examples": ["exact phrase from response"] }
  ],
  "recommendedFocusAreas": ["1-3 lesson mapping tags"]
}`;

export function buildWritingGradePrompt(input: BuildWritingPromptInput): {
  systemPrompt: string;
  userMessage: string;
} {
  const assessedLanguage =
    input.targetLanguage === "vi" ? "Vietnamese" : "English";
  const learnerContext =
    input.targetLanguage === "en"
      ? "Vietnamese L1, learning English"
      : "English L1 or multilingual learner, learning Vietnamese";

  const systemPrompt = `
You are an expert CEFR-aligned ${assessedLanguage} writing evaluator for Vietnamese-first language learners.
You grade strictly per Common European Framework of Reference writing descriptors and produce structured JSON.

You are NOT lenient. A1 means beginner who can write only simple words and isolated phrases. C2 means near-native mastery. Do not inflate levels to be kind. A learner whose grammar collapses is not B2 because their vocabulary is rich.

For Vietnamese L1 speakers writing English, flag specific L1-interference patterns:
- missing_articles: Vietnamese has no a/an/the articles
- tense_aspect_confusion: Vietnamese marks aspect lexically, not morphologically
- subject_verb_agreement: Vietnamese verbs do not conjugate
- word_order_transfer: adjective placement, possessives, question order
- final_sound_spelling: pronunciation-related spelling such as -ed, plural -s, final consonants
- vietnamese_calque: literal transfer from Vietnamese idiom or phrasing

Use the rubric below as the grading anchor. Subskills may differ; grammar is often lower than vocabulary for Vietnamese learners.

CEFR writing rubric:
${formatRubricForPrompt()}

Output JSON only. No prose outside JSON.
`.trim();

  const userMessage = `
PROMPT ID:
${input.promptId}

TASK PROMPT SHOWN TO LEARNER:
${input.taskText}

LEARNER CONTEXT:
${learnerContext}

LEARNER'S RESPONSE:
${input.userResponse}

Grade per CEFR. Output structured JSON matching this schema:
${ASSESSMENT_SCHEMA}

Important calibration anchors:
- A1: simple phrases about self/routine; heavy errors; often under 50 words.
- A2: simple connected sentences; frequent errors may impede meaning; often 50-100 words.
- B1: connected text on familiar topics; errors usually do not impede meaning; often 100-200 words.
- B2: clear, detailed text; range of structures; errors rare in common patterns.
- C1: well-structured text on familiar or complex topics; subtle errors only.
- C2: near-native mastery of register, nuance, rhythm, and precision.

Rules:
- Use exact phrases from the learner response in l1InterferenceFlags.examples.
- If the response is too short for a high level, cap taskAchievement first.
- If grammar control is unstable, do not assign B2+ overall even with strong vocabulary.
- Return 2-4 strengths, 2-4 gaps, and 1-3 recommendedFocusAreas.
`.trim();

  return { systemPrompt, userMessage };
}

export { ASSESSMENT_SCHEMA };

