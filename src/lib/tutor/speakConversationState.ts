import { SPEAK_FOLLOW_UP_PIVOT } from "./speakFollowups";

export type SpeakConversationTopic =
  | "morning"
  | "work"
  | "office"
  | "lunch"
  | "evening"
  | "dinner"
  | "family"
  | "commute"
  | "general";

export type SpeakReplyType = "contextual-question" | "clarification";

export type SpeakDetectedContext = {
  topic: SpeakConversationTopic;
  intent: string;
  isUnclear: boolean;
};

export type SpeakConversationPivotReason = "depth_cap" | "no_unused_followups" | null;

export type SpeakConversationState = {
  currentTopic: SpeakConversationTopic;
  currentTopicId: string;
  topicLabel: string;
  turnCountOnTopic: number;
  usedFollowUpIds: string[];
  lastUserText: string;
  lastMercyQuestion: string;
  shouldPivot: boolean;
  pivotReason: SpeakConversationPivotReason;
  lastUserIntent: string;
  lastDetectedContext: SpeakDetectedContext | null;
  lastTeacherReplyType: SpeakReplyType | null;
  turnCount: number;
  recentTopics: SpeakConversationTopic[];
  avoidReplyTemplates: string[];
};

type ReplyCandidate = {
  id: string;
  naturalReply: string;
  nextQuestion: string;
};

export type SpeakReplySelection = ReplyCandidate & {
  replyType: SpeakReplyType;
  detectedContext: SpeakDetectedContext;
  state: SpeakConversationState;
};

const MAX_RECENT_TOPICS = 5;
const MAX_AVOID_TEMPLATES = 8;
const SPEAK_CONVERSATION_TOPIC_DEPTH_CAP = 4;

const TOPIC_LABELS: Record<SpeakConversationTopic, string> = {
  morning: "Morning routine",
  work: "Work",
  office: "Office",
  lunch: "Lunch",
  evening: "Evening",
  dinner: "Dinner",
  family: "Family",
  commute: "Commute",
  general: "General practice",
};

const TOPIC_FOLLOW_UP_PHRASES: Record<SpeakConversationTopic, string> = {
  morning: "your morning routine",
  work: "work",
  office: "the office",
  lunch: "lunch",
  evening: "your evening",
  dinner: "dinner",
  family: "your family",
  commute: "your commute",
  general: "that",
};

const UNCLEAR_ASR_PATTERNS = [
  /\band up today\b/i,
  /\b(can i buy i had|buy i had)\b/i,
  /\b(the last part is unclear|unclear)\b/i,
];

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function templateKey(reply: ReplyCandidate): string {
  return compact(`${reply.naturalReply} ${reply.nextQuestion}`).toLowerCase();
}

function pushLimited<T>(values: T[], next: T, limit: number): T[] {
  return [...values, next].slice(-limit);
}

export function createSpeakConversationState(): SpeakConversationState {
  return {
    currentTopic: "general",
    currentTopicId: "general",
    topicLabel: TOPIC_LABELS.general,
    turnCountOnTopic: 0,
    usedFollowUpIds: [],
    lastUserText: "",
    lastMercyQuestion: "",
    shouldPivot: false,
    pivotReason: null,
    lastUserIntent: "",
    lastDetectedContext: null,
    lastTeacherReplyType: null,
    turnCount: 0,
    recentTopics: [],
    avoidReplyTemplates: [],
  };
}

export function detectSpeakConversationContext(userText: string): SpeakDetectedContext {
  const normalized = compact(userText).toLowerCase();
  const isUnclear =
    normalized.length > 0 &&
    (normalized.length < 5 || UNCLEAR_ASR_PATTERNS.some((pattern) => pattern.test(normalized)));

  if (/\b(dinner|supper|eat at night|evening meal)\b/.test(normalized)) {
    return { topic: "dinner", intent: "dinner", isUnclear };
  }
  if (/\b(evening|tonight|night|go home|went home|come home|came home)\b/.test(normalized)) {
    return { topic: "evening", intent: "evening-home", isUnclear };
  }
  if (/\blunch\b/.test(normalized)) {
    if (/\bwork all day\b/.test(normalized)) return { topic: "lunch", intent: "workday-lunch", isUnclear };
    return {
      topic: "lunch",
      intent: /\bcolleagues?\b/.test(normalized) ? "lunch-with-colleagues" : "lunch",
      isUnclear,
    };
  }
  if (/\b(office|desk|meeting|boss|colleagues?|coworkers?)\b/.test(normalized)) {
    if (/\b(boss|colleagues?|coworkers?|assign(?:s|ed)?)\b/.test(normalized)) {
      return { topic: "office", intent: "office-team", isUnclear };
    }
    return { topic: "office", intent: "office-work", isUnclear };
  }
  if (/\b(commute|bus|train|drive|traffic|motorbike|bike|walk to work)\b/.test(normalized)) {
    return { topic: "commute", intent: "commute", isUnclear };
  }
  if (/\b(work|job|tasks?|emails?|urgent email|check my email|check email)\b/.test(normalized)) {
    if (/\bemails?\b|\bcheck (?:my )?email\b/.test(normalized)) {
      return {
        topic: "work",
        intent: /\b(go to work|went to work|workday)\b/.test(normalized) ? "work-email-to-work" : "work-email-start",
        isUnclear,
      };
    }
    return { topic: "work", intent: "work", isUnclear };
  }
  if (/\b(family|mother|father|wife|husband|children|kids|parents)\b/.test(normalized)) {
    return { topic: "family", intent: "family", isUnclear };
  }
  if (/\b(morning|coffee|breakfast|brush(?:ed)? my teeth|wake up|woke up)\b/.test(normalized)) {
    if (/\bdrink coffee\b/.test(normalized)) {
      return { topic: "morning", intent: "morning-coffee", isUnclear };
    }
    return {
      topic: "morning",
      intent: /\bemails?\b/.test(normalized) ? "morning-email" : "morning-routine",
      isUnclear,
    };
  }
  if (/\b(market|buy food|bought food)\b/.test(normalized)) {
    return { topic: "general", intent: "market-errand", isUnclear };
  }

  return { topic: "general", intent: "general", isUnclear };
}

function topicId(topic: SpeakConversationTopic): string {
  return topic;
}

function getPreviousTopic(previousState: SpeakConversationState): SpeakConversationTopic {
  return previousState.currentTopic ?? "general";
}

function resolveActiveContext(
  detectedContext: SpeakDetectedContext,
  previousState: SpeakConversationState,
): SpeakDetectedContext {
  const previousTopic = getPreviousTopic(previousState);
  const hasLearnerTopic = previousTopic !== "general" && (previousState.turnCountOnTopic ?? 0) > 0;

  if (detectedContext.topic !== "general") return detectedContext;
  if (!hasLearnerTopic) return detectedContext;

  return {
    topic: previousTopic,
    intent: previousState.lastUserIntent || previousState.lastDetectedContext?.intent || previousTopic,
    isUnclear: detectedContext.isUnclear,
  };
}

function selectCandidate(
  candidates: ReplyCandidate[],
  usedFollowUpIds: string[],
  avoidReplyTemplates: string[],
): ReplyCandidate | null {
  return (
    candidates.find(
      (candidate) => !usedFollowUpIds.includes(candidate.id) && !avoidReplyTemplates.includes(templateKey(candidate)),
    ) ??
    candidates.find((candidate) => !usedFollowUpIds.includes(candidate.id)) ??
    null
  );
}

function buildClarification(context: SpeakDetectedContext): ReplyCandidate {
  if (context.topic === "office") {
    return {
      id: "office-clarify-repeat",
      naturalReply: "I heard that you went to the office, but the last part was unclear.",
      nextQuestion: "Can you say that last part again in one short sentence?",
    };
  }
  if (context.topic === "evening" || context.topic === "dinner") {
    return {
      id: "dinner-clarify-home",
      naturalReply: "I heard evening or dinner, but the sentence was not fully clear.",
      nextQuestion: "Do you mean you go home in the evening?",
    };
  }
  if (context.topic === "family") {
    return {
      id: "family-clarify-repeat",
      naturalReply: "I heard something about your family, but the sentence was not fully clear.",
      nextQuestion: "Can you repeat the family part in one short sentence?",
    };
  }
  return {
    id: "general-clarify-repeat",
    naturalReply: "I heard part of that, but it was not fully clear.",
    nextQuestion: "Can you repeat it in one short sentence?",
  };
}

function buildTopicCandidates(context: SpeakDetectedContext): ReplyCandidate[] {
  switch (context.topic) {
    case "morning":
      if (context.intent === "morning-coffee") {
        return [
          { id: "morning-coffee-after", naturalReply: "Nice. That is a clear daily habit.", nextQuestion: "What do you do after that?" },
          {
            id: "morning-coffee-next-step",
            naturalReply: "Good. Coffee is a clear daily habit.",
            nextQuestion: "What is your next step after coffee?",
          },
        ];
      }
      return [
        { id: "morning-routine-after", naturalReply: "Good. Your morning routine is clear.", nextQuestion: "What do you do after that?" },
        {
          id: "morning-routine-next-step",
          naturalReply: "Nice. That sounds like a simple morning habit.",
          nextQuestion: "What is the next step in your morning?",
        },
      ];
    case "work":
      if (context.intent === "work-email-start") {
        return [
          {
            id: "work-email-after",
            naturalReply: "Coffee and email sound like a clear start to your day.",
            nextQuestion: "What do you usually do after checking email?",
          },
          {
            id: "work-email-what-happens",
            naturalReply: "Got it. You check email as part of your routine.",
            nextQuestion: "What happens after that?",
          },
        ];
      }
      if (context.intent === "work-email-to-work") {
        return [
          {
            id: "work-arrive-after-email",
            naturalReply: "That sounds like a normal start to a workday.",
            nextQuestion: "What do you usually do when you arrive at work?",
          },
          {
            id: "work-first-task-after-email",
            naturalReply: "Got it. After coffee and email, you go to work.",
            nextQuestion: "What is your first work task after that?",
          },
        ];
      }
      return [
        { id: "work-arrive", naturalReply: "Then you go to work.", nextQuestion: "What do you usually do when you arrive?" },
        { id: "work-first-task", naturalReply: "Got it. You are moving from morning to work.", nextQuestion: "What is your first task at work?" },
      ];
    case "office":
      if (context.intent === "office-team") {
        return [
          {
            id: "office-team-task",
            naturalReply: "Good detail. That sounds like a work discussion with your team.",
            nextQuestion: "What kind of tasks does your boss assign?",
          },
          {
            id: "office-team-next-task",
            naturalReply: "That sounds like a conversation with your boss and colleagues.",
            nextQuestion: "What task do you usually do after that?",
          },
        ];
      }
      return [
        {
          id: "office-first-task",
          naturalReply: "That sounds like part of your day at the office.",
          nextQuestion: "What is the first task you do there?",
        },
        {
          id: "office-work-with",
          naturalReply: "Good detail. You are talking about your office routine.",
          nextQuestion: "Who do you usually work with there?",
        },
      ];
    case "lunch":
      if (context.intent === "workday-lunch") {
        return [
          {
            id: "lunch-workday-after",
            naturalReply: "Clear. You are describing the rest of your workday.",
            nextQuestion: "What do you usually do after lunch?",
          },
          {
            id: "lunch-workday-happens-after",
            naturalReply: "Good. Now you are talking about lunch and the rest of the day.",
            nextQuestion: "What happens after lunch?",
          },
        ];
      }
      return [
        { id: "lunch-food", naturalReply: "Lunch with colleagues sounds normal.", nextQuestion: "What do you usually eat for lunch?" },
        {
          id: "lunch-place",
          naturalReply: "That is a clear lunch detail.",
          nextQuestion: "Do you usually eat at the office or outside?",
        },
      ];
    case "evening":
      return [
        {
          id: "evening-after-home",
          naturalReply: "That sounds like a normal evening.",
          nextQuestion: "What do you usually do after you get home?",
        },
        {
          id: "evening-relax",
          naturalReply: "Good. Now you are talking about your evening at home.",
          nextQuestion: "How do you usually relax at night?",
        },
      ];
    case "dinner":
      return [
        { id: "dinner-food", naturalReply: "That sounds like a normal evening.", nextQuestion: "What do you usually eat for dinner?" },
        {
          id: "dinner-with-who",
          naturalReply: "Dinner at home sounds like a clear evening routine.",
          nextQuestion: "Who do you usually have dinner with?",
        },
        { id: "dinner-cook", naturalReply: "Good. You are talking about dinner.", nextQuestion: "Do you usually cook dinner at home?" },
        { id: "dinner-time", naturalReply: "That is a clear dinner detail.", nextQuestion: "What time do you usually eat dinner?" },
      ];
    case "family":
      return [
        { id: "family-talk-with", naturalReply: "That sounds like time with your family.", nextQuestion: "Who do you usually talk with at home?" },
        { id: "family-activity", naturalReply: "Good. You are describing family time.", nextQuestion: "What do you usually do together?" },
        { id: "family-weekend", naturalReply: "That is a useful family detail.", nextQuestion: "Do you see your family on the weekend?" },
        { id: "family-home", naturalReply: "Nice. Your family topic is clear.", nextQuestion: "Where do you usually spend time together?" },
      ];
    case "commute":
      return [{ id: "commute-time", naturalReply: "That sounds like your commute.", nextQuestion: "How long does it usually take?" }];
    case "general":
      if (context.intent === "market-errand") {
        return [{ id: "general-market-buy", naturalReply: "Good. That sounds like a useful errand.", nextQuestion: "What did you buy at the market?" }];
      }
      return [
        { id: "general-when", naturalReply: "Got it. Tell me one more detail about that.", nextQuestion: "When does that usually happen?" },
        { id: "general-detail", naturalReply: "I understand the general idea.", nextQuestion: "Can you add one clear detail?" },
      ];
  }
}

function buildContinuityCandidates(context: SpeakDetectedContext): ReplyCandidate[] {
  const phrase = TOPIC_FOLLOW_UP_PHRASES[context.topic];
  return [
    {
      id: `${context.topic}-continue-detail`,
      naturalReply: `Good. Let's stay with ${phrase}.`,
      nextQuestion: `What is one more detail about ${phrase}?`,
    },
    {
      id: `${context.topic}-continue-next`,
      naturalReply: `Clear. You are still talking about ${phrase}.`,
      nextQuestion: `What usually happens next with ${phrase}?`,
    },
    {
      id: `${context.topic}-continue-feeling`,
      naturalReply: `That is useful detail about ${phrase}.`,
      nextQuestion: `How do you feel about ${phrase}?`,
    },
  ];
}

export function selectSpeakConversationReply(
  userText: string,
  previousState: SpeakConversationState = createSpeakConversationState(),
): SpeakReplySelection {
  const detectedContext = detectSpeakConversationContext(userText);
  const activeContext = resolveActiveContext(detectedContext, previousState);
  const activeTopicId = topicId(activeContext.topic);
  const previousTopicId = previousState.currentTopicId ?? topicId(getPreviousTopic(previousState));
  const topicChanged = activeTopicId !== previousTopicId;
  const previousTopicTurns = previousState.turnCountOnTopic ?? 0;
  const turnCountOnTopic = topicChanged ? 1 : previousTopicTurns + 1;
  const usedFollowUpIdsForTopic = topicChanged ? [] : previousState.usedFollowUpIds ?? [];
  const replyType: SpeakReplyType = activeContext.isUnclear ? "clarification" : "contextual-question";
  let shouldPivot = false;
  let pivotReason: SpeakConversationPivotReason = null;
  let reply: ReplyCandidate;

  if (!activeContext.isUnclear && !topicChanged && previousTopicTurns >= SPEAK_CONVERSATION_TOPIC_DEPTH_CAP) {
    shouldPivot = true;
    pivotReason = "depth_cap";
    reply = {
      id: "pivot-depth-cap",
      naturalReply: "Good practice on this topic.",
      nextQuestion: SPEAK_FOLLOW_UP_PIVOT,
    };
  } else if (activeContext.isUnclear) {
    reply = buildClarification(activeContext);
  } else {
    const selected = selectCandidate(
      [
        ...buildTopicCandidates(activeContext),
        ...buildContinuityCandidates(activeContext),
      ],
      usedFollowUpIdsForTopic,
      previousState.avoidReplyTemplates,
    );
    if (selected) {
      reply = selected;
    } else {
      shouldPivot = true;
      pivotReason = "no_unused_followups";
      reply = {
        id: "pivot-no-unused-followups",
        naturalReply: "Good practice on this topic.",
        nextQuestion: SPEAK_FOLLOW_UP_PIVOT,
      };
    }
  }

  const usedFollowUpIds =
    replyType === "clarification" || shouldPivot ? usedFollowUpIdsForTopic : [...usedFollowUpIdsForTopic, reply.id];

  const state: SpeakConversationState = {
    currentTopic: activeContext.topic,
    currentTopicId: activeTopicId,
    topicLabel: TOPIC_LABELS[activeContext.topic],
    turnCountOnTopic,
    usedFollowUpIds,
    lastUserText: compact(userText),
    lastMercyQuestion: reply.nextQuestion,
    shouldPivot,
    pivotReason,
    lastUserIntent: activeContext.intent,
    lastDetectedContext: detectedContext,
    lastTeacherReplyType: replyType,
    turnCount: previousState.turnCount + 1,
    recentTopics: pushLimited(previousState.recentTopics, activeContext.topic, MAX_RECENT_TOPICS),
    avoidReplyTemplates: pushLimited(previousState.avoidReplyTemplates, templateKey(reply), MAX_AVOID_TEMPLATES),
  };

  return {
    ...reply,
    replyType,
    detectedContext: activeContext,
    state,
  };
}
