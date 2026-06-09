import type {
  SpeakTopicFollowUp,
  SpeakTopicL1InterferenceNote,
  SpeakTopicLibraryEntry,
} from "./speakTopicLibrary";

export type ConversationPromptTopic = SpeakTopicLibraryEntry & {
  scenarioDescription?: string;
  aiRoleDefinition?: string;
  conversationDirections?: readonly string[];
  warmthPatterns?: readonly string[];
};

export type ConversationPromptTemplateInput = {
  topic: ConversationPromptTopic;
  turnCount?: number;
  learnerText?: string | null;
  recentAiTurns?: readonly string[];
};

export type ConversationPromptGrounding = {
  topicId: string;
  labelEn: string;
  labelVi: string;
  category: string;
  scenarioDescription: string | null;
  aiRoleDefinition: string | null;
  conversationDirections: readonly string[];
  seedInputs: readonly string[];
  warmthPatterns: readonly string[];
  l1InterferenceNotes: readonly SpeakTopicL1InterferenceNote[];
  followUps: readonly SpeakTopicFollowUp[];
};

export type ConversationPromptTemplate = {
  systemPrompt: string;
  topicGroundingPrompt: string;
  correctionStylePrompt: string;
  grounding: ConversationPromptGrounding;
};

const DEFAULT_CONVERSATION_DIRECTIONS = [
  "Stay inside the selected scenario for at least the first four learner turns unless the learner clearly asks to change topic.",
  "Respond to what the learner just said before asking the next question.",
  "Ask one natural follow-up question at a time.",
  "Avoid repeating the same question, correction, or encouragement from recent turns.",
  "Keep the exchange useful for a ten-turn practice conversation.",
] as const;

const DEFAULT_WARMTH_PATTERNS = [
  "Use face-saving Vietnamese-first coaching: name the useful next phrase, not the learner's failure.",
  "Protect the learner's dignity with face-saving language such as 'Câu này dùng tự nhiên hơn là...'",
  "Affirm Vietnamese learner identity without stereotypes: English can be adjusted while the meaning stays clear.",
] as const;

function normalizeLines(lines: readonly string[] | undefined): readonly string[] {
  if (!lines) return [];
  return lines.map((line) => line.trim()).filter(Boolean);
}

function formatBulletList(lines: readonly string[]): string {
  return lines.map((line) => `- ${line}`).join("\n");
}

function formatInterferenceNotes(notes: readonly SpeakTopicL1InterferenceNote[]): string {
  if (notes.length === 0) {
    return "- No topic-specific VN L1 notes are provided. Use only high-confidence corrections; otherwise abstain and redirect.";
  }

  return notes
    .map((note) => `- ${note.label}: ${note.note}`)
    .join("\n");
}

function formatFollowUps(followUps: readonly SpeakTopicFollowUp[]): string {
  if (followUps.length === 0) {
    return "- Ask one concrete follow-up grounded in the learner's last answer.";
  }

  return followUps
    .map((followUp) => {
      const salience = followUp.salienceQuestion ? ` / salience: ${followUp.salienceQuestion}` : "";
      return `- ${followUp.question}${salience}`;
    })
    .join("\n");
}

export function buildConversationPromptGrounding(
  topic: ConversationPromptTopic,
): ConversationPromptGrounding {
  const conversationDirections = normalizeLines(topic.conversationDirections);
  const warmthPatterns = normalizeLines(topic.warmthPatterns);

  return {
    topicId: topic.id,
    labelEn: topic.labelEn,
    labelVi: topic.labelVi,
    category: String(topic.category),
    scenarioDescription: topic.scenarioDescription?.trim() || null,
    aiRoleDefinition: topic.aiRoleDefinition?.trim() || null,
    conversationDirections: conversationDirections.length > 0
      ? conversationDirections
      : DEFAULT_CONVERSATION_DIRECTIONS,
    seedInputs: normalizeLines(topic.seedInputs),
    warmthPatterns: warmthPatterns.length > 0 ? warmthPatterns : DEFAULT_WARMTH_PATTERNS,
    l1InterferenceNotes: topic.l1InterferenceNotes ?? [],
    followUps: topic.followUps,
  };
}

export function buildConversationPromptTemplate(
  input: ConversationPromptTemplateInput,
): ConversationPromptTemplate {
  const grounding = buildConversationPromptGrounding(input.topic);
  const recentAiTurns = normalizeLines(input.recentAiTurns);
  const learnerText = input.learnerText?.trim();
  const turnCount = Math.max(0, input.turnCount ?? 0);

  const topicGroundingPrompt = [
    "Selected Speak scenario/topic grounding:",
    `- Topic: ${grounding.labelVi} / ${grounding.labelEn}`,
    `- Topic id: ${grounding.topicId}`,
    `- Category: ${grounding.category}`,
    `- Scenario: ${grounding.scenarioDescription ?? "Use the topic label, seed inputs, follow-ups, and learner text as the scenario."}`,
    `- AI role: ${grounding.aiRoleDefinition ?? "Act as a patient conversation partner inside this Speak topic."}`,
    "Conversation directions:",
    formatBulletList(grounding.conversationDirections),
    "Seed learner inputs:",
    formatBulletList(grounding.seedInputs),
    "Available follow-up lanes:",
    formatFollowUps(grounding.followUps),
    "VN L1 / interference context:",
    formatInterferenceNotes(grounding.l1InterferenceNotes),
  ].join("\n");

  const correctionStylePrompt = [
    "Correction and warmth style:",
    "- Vietnamese first, English second. Keep explanations short enough for a speaking turn.",
    "- Use this pattern when confident: 'Tiếng Việt: ...' then 'English: ...'.",
    "- Correct only high-confidence VN->EN interference or scenario-critical wording.",
    "- If confidence is low, say you are not sure in Vietnamese, then redirect into a useful next practice question.",
    "- Never invent pronunciation scores or claim an audio result from text-only input.",
    "- Do not dead-end with only 'try again' or 'skip'; always continue the scenario with one natural prompt.",
    "VN-calibrated face-saving warmth patterns:",
    formatBulletList(grounding.warmthPatterns),
  ].join("\n");

  const systemPrompt = [
    "You are MercyBlade's Vietnamese-to-English conversation tutor.",
    "Primary job: run a realistic Speak scenario conversation, not generic roleplay.",
    topicGroundingPrompt,
    "Step 8 topic persistence:",
    `- Current learner turn count in this session: ${turnCount}.`,
    "- Stay on this selected topic for 4+ learner turns before any broad pivot.",
    "- For a 10-turn practice, deepen the same situation with concrete details instead of restarting.",
    "- Avoid obvious repetition, especially questions already asked in recent AI turns.",
    "Step 9 learner pivoting:",
    `- Latest learner text: ${learnerText || "(none yet; open with the scenario seed)."}`,
    "- The next AI turn must respond to the learner's actual words before asking a follow-up.",
    "Recent AI turns to avoid repeating:",
    recentAiTurns.length > 0 ? formatBulletList(recentAiTurns) : "- None.",
    correctionStylePrompt,
    "Output contract:",
    "- Return one concise AI turn for the learner.",
    "- Include at most one correction and one follow-up question.",
    "- Keep learner-facing copy Vietnamese-primary with English-secondary examples.",
  ].join("\n\n");

  return {
    systemPrompt,
    topicGroundingPrompt,
    correctionStylePrompt,
    grounding,
  };
}
