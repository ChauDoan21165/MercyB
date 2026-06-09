import {
  SPEAK_TOPIC_LIBRARY,
  type SpeakTopicLibraryEntry,
} from "@/lib/tutor/speakTopicLibrary";

export type AiConversationScenarioId = string;

export type AiConversationScenario = {
  id: AiConversationScenarioId;
  title: string;
  themeContext: string;
  learnerRole: string;
  aiRole: string;
  topicBoundaries: string[];
  warmthPatterns: string[];
  l1InterferenceNotes: Array<{
    id: string;
    pattern: string;
    watchFor: string;
    correctionHintVi: string;
  }>;
  openingPrompt: string;
  topic: SpeakTopicLibraryEntry;
};

type ConversationTopic = SpeakTopicLibraryEntry & {
  scenarioDescription?: string;
  aiRoleDefinition?: string;
  conversationDirections?: readonly string[];
  warmthPatterns?: readonly string[];
};

function toScenario(topic: ConversationTopic): AiConversationScenario {
  return {
    id: topic.id,
    title: topic.labelEn,
    themeContext:
      topic.scenarioDescription ??
      `A Vietnamese learner is practicing realistic English conversation for ${topic.labelEn}.`,
    learnerRole:
      `The learner answers in English inside the ${topic.labelEn} scenario and may make Vietnamese-to-English transfer errors.`,
    aiRole:
      topic.aiRoleDefinition ??
      "Mercy is the conversation partner and coach. Mercy asks one question at a time, reacts to the learner's answer, and only corrects clear high-confidence language issues.",
    topicBoundaries: [
      ...(topic.conversationDirections ?? []),
      "For at least four learner turns, keep the scenario moving before offering to move on.",
    ],
    warmthPatterns: [...(topic.warmthPatterns ?? [])],
    l1InterferenceNotes: (topic.l1InterferenceNotes ?? []).map((note) => ({
      id: note.id,
      pattern: note.label,
      watchFor: note.note,
      correctionHintVi: note.note,
    })),
    openingPrompt:
      topic.followUps[0]?.question ??
      topic.seedInputs[0] ??
      `Let's practice ${topic.labelEn}. What would you say first?`,
    topic,
  };
}

const scenarioEntries = SPEAK_TOPIC_LIBRARY.map((topic) => {
  const scenario = toScenario(topic as ConversationTopic);
  return [scenario.id, scenario] as const;
});

export const AI_CONVERSATION_SCENARIOS: Record<AiConversationScenarioId, AiConversationScenario> =
  Object.fromEntries(scenarioEntries);

export const DEFAULT_AI_CONVERSATION_SCENARIO_ID: AiConversationScenarioId =
  AI_CONVERSATION_SCENARIOS["topic-work-job"] ? "topic-work-job" : scenarioEntries[0]?.[0] ?? "topic-ordering-food";

export function getAiConversationScenario(id: string): AiConversationScenario {
  return AI_CONVERSATION_SCENARIOS[id] ?? AI_CONVERSATION_SCENARIOS[DEFAULT_AI_CONVERSATION_SCENARIO_ID];
}
