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

export const LEARNER_LED_AI_CONVERSATION_SCENARIO_ID = "learner-led";

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
  Object.fromEntries([
    [
      LEARNER_LED_AI_CONVERSATION_SCENARIO_ID,
      {
        id: LEARNER_LED_AI_CONVERSATION_SCENARIO_ID,
        title: "Mercy follows your words",
        themeContext:
          "No preset scenario is selected. The learner's first message defines the conversation topic, situation, and next useful follow-up.",
        learnerRole:
          "The learner starts with their own English sentence. Mercy follows the learner's words instead of forcing a scripted roleplay.",
        aiRole:
          "Mercy is a warm conversation partner and coach. Mercy responds to what the learner actually said, asks one grounded follow-up, and only corrects clear high-confidence language issues.",
        topicBoundaries: [
          "Do not introduce a preset scenario unless the learner explicitly chooses one.",
          "Use the learner's latest words as the conversation seed and next-turn direction.",
          "Ask one concrete follow-up about a detail the learner already mentioned.",
          "If the learner is vague, ask one clarifying question instead of switching to a script.",
        ],
        warmthPatterns: [
          "Start from the learner's meaning, then make the next English sentence easier to say.",
          "Keep correction low-shame and optional: respond first, correct only when confident.",
        ],
        l1InterferenceNotes: [],
        openingPrompt: "",
        topic: {
          id: LEARNER_LED_AI_CONVERSATION_SCENARIO_ID,
          labelEn: "Mercy follows your words",
          labelVi: "Mercy theo lời của bạn",
          category: "learner-led",
          seedInputs: [],
          detectionPatterns: [],
          followUps: [
            {
              id: "learner-led-next-detail",
              question: "What happened next?",
              salienceQuestion: "What detail in the learner's own words should Mercy follow next?",
            },
          ],
          l1InterferenceNotes: [],
        },
      } satisfies AiConversationScenario,
    ],
    ...scenarioEntries,
  ]);

export const DEFAULT_AI_CONVERSATION_SCENARIO_ID: AiConversationScenarioId =
  LEARNER_LED_AI_CONVERSATION_SCENARIO_ID;

export function getAiConversationScenario(id: string): AiConversationScenario {
  return AI_CONVERSATION_SCENARIOS[id] ?? AI_CONVERSATION_SCENARIOS[DEFAULT_AI_CONVERSATION_SCENARIO_ID];
}
