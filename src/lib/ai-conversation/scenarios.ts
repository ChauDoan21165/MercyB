export type AiConversationScenarioId = "job-interview";

export type AiConversationScenario = {
  id: AiConversationScenarioId;
  title: string;
  themeContext: string;
  learnerRole: string;
  aiRole: string;
  topicBoundaries: string[];
  l1InterferenceNotes: Array<{
    id: string;
    pattern: string;
    watchFor: string;
    correctionHintVi: string;
  }>;
  openingPrompt: string;
};

export const AI_CONVERSATION_SCENARIOS: Record<AiConversationScenarioId, AiConversationScenario> = {
  "job-interview": {
    id: "job-interview",
    title: "Job interview practice",
    themeContext:
      "A Vietnamese learner is practicing a realistic English job interview for an entry-level or mid-level office/service role.",
    learnerRole:
      "The learner is the candidate. They answer in English and may make Vietnamese-to-English transfer errors.",
    aiRole:
      "Mercy is the interviewer and coach. Mercy asks one interview question at a time, reacts to the learner's answer, and only corrects clear high-confidence language issues.",
    topicBoundaries: [
      "Stay inside job interview practice: background, strengths, teamwork, challenges, availability, and motivation.",
      "Do not drift into general life advice, therapy, pronunciation scoring, salary negotiation details, immigration, or unrelated small talk.",
      "For at least four learner turns, keep the scenario moving like a real interview.",
    ],
    l1InterferenceNotes: [
      {
        id: "vn-en-be-missing-role",
        pattern: "Vietnamese often omits 'be', so learners may say 'I confident' or 'I suitable'.",
        watchFor: "missing am/is/are before adjectives or role descriptions",
        correctionHintVi:
          "Tiếng Việt không cần 'to be', nhưng tiếng Anh cần 'am/is/are' trước tính từ hoặc vai trò.",
      },
      {
        id: "vn-en-have-experience",
        pattern: "Vietnamese 'có kinh nghiệm' can become 'I have experience about...' in English.",
        watchFor: "have experience about/in + a task where 'experience with' is more natural",
        correctionHintVi:
          "Mẫu tự nhiên là 'experience with + việc/kỹ năng' hoặc 'experience in + lĩnh vực'.",
      },
      {
        id: "vn-en-responsible-for",
        pattern: "Vietnamese word order can produce 'I responsible for' without 'am'.",
        watchFor: "responsible for without a form of be",
        correctionHintVi:
          "Trong tiếng Anh, nói 'I am responsible for...', không nói 'I responsible for...'.",
      },
    ],
    openingPrompt:
      "Let's practice a job interview. First question: tell me about yourself and the role you want.",
  },
};

export function getAiConversationScenario(id: string): AiConversationScenario {
  return AI_CONVERSATION_SCENARIOS[id as AiConversationScenarioId] ?? AI_CONVERSATION_SCENARIOS["job-interview"];
}
