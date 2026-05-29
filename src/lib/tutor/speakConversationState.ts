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

export type SpeakConversationState = {
  currentTopic: SpeakConversationTopic;
  lastUserIntent: string;
  lastDetectedContext: SpeakDetectedContext | null;
  lastTeacherReplyType: SpeakReplyType | null;
  turnCount: number;
  recentTopics: SpeakConversationTopic[];
  avoidReplyTemplates: string[];
};

type ReplyCandidate = {
  naturalReply: string;
  nextQuestion: string;
};

export type SpeakReplySelection = ReplyCandidate & {
  replyType: SpeakReplyType;
  detectedContext: SpeakDetectedContext;
  state: SpeakConversationState;
};

const MAX_RECENT_TOPICS = 5;
const MAX_AVOID_TEMPLATES = 3;

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
  if (/\b(commute|bus|train|drive|traffic|motorbike|bike|walk to work)\b/.test(normalized)) {
    return { topic: "commute", intent: "commute", isUnclear };
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

function selectCandidate(candidates: ReplyCandidate[], avoidReplyTemplates: string[]): ReplyCandidate {
  return (
    candidates.find((candidate) => !avoidReplyTemplates.includes(templateKey(candidate))) ??
    candidates[0] ??
    { naturalReply: "Got it.", nextQuestion: "Can you say one more detail about that?" }
  );
}

function buildClarification(context: SpeakDetectedContext): ReplyCandidate {
  if (context.topic === "office") {
    return {
      naturalReply: "I heard that you went to the office, but the last part was unclear.",
      nextQuestion: "Can you say that last part again in one short sentence?",
    };
  }
  if (context.topic === "evening" || context.topic === "dinner") {
    return {
      naturalReply: "I heard evening or dinner, but the sentence was not fully clear.",
      nextQuestion: "Do you mean you go home in the evening?",
    };
  }
  return {
    naturalReply: "I heard part of that, but it was not fully clear.",
    nextQuestion: "Can you repeat it in one short sentence?",
  };
}

function buildTopicCandidates(context: SpeakDetectedContext): ReplyCandidate[] {
  switch (context.topic) {
    case "morning":
      if (context.intent === "morning-coffee") {
        return [
          { naturalReply: "Nice. That is a clear daily habit.", nextQuestion: "What do you do after that?" },
          { naturalReply: "Good. Coffee is a clear daily habit.", nextQuestion: "What is your next step after coffee?" },
        ];
      }
      return [
        { naturalReply: "Good. Your morning routine is clear.", nextQuestion: "What do you do after that?" },
        { naturalReply: "Nice. That sounds like a simple morning habit.", nextQuestion: "What is the next step in your morning?" },
      ];
    case "work":
      if (context.intent === "work-email-start") {
        return [
          {
            naturalReply: "Coffee and email sound like a clear start to your day.",
            nextQuestion: "What do you usually do after checking email?",
          },
          {
            naturalReply: "Got it. You check email as part of your routine.",
            nextQuestion: "What happens after that?",
          },
        ];
      }
      if (context.intent === "work-email-to-work") {
        return [
          { naturalReply: "That sounds like a normal start to a workday.", nextQuestion: "What do you usually do when you arrive at work?" },
          { naturalReply: "Got it. After coffee and email, you go to work.", nextQuestion: "What is your first work task after that?" },
        ];
      }
      return [
        { naturalReply: "Then you go to work.", nextQuestion: "What do you usually do when you arrive?" },
        { naturalReply: "Got it. You are moving from morning to work.", nextQuestion: "What is your first task at work?" },
      ];
    case "office":
      if (context.intent === "office-team") {
        return [
          {
            naturalReply: "Good detail. That sounds like a work discussion with your team.",
            nextQuestion: "What kind of tasks does your boss assign?",
          },
          {
            naturalReply: "That sounds like a conversation with your boss and colleagues.",
            nextQuestion: "What task do you usually do after that?",
          },
        ];
      }
      return [
        { naturalReply: "That sounds like part of your day at the office.", nextQuestion: "What is the first task you do there?" },
        { naturalReply: "Good detail. You are talking about your office routine.", nextQuestion: "Who do you usually work with there?" },
      ];
    case "lunch":
      if (context.intent === "workday-lunch") {
        return [
          { naturalReply: "Clear. You are describing the rest of your workday.", nextQuestion: "What do you usually do after lunch?" },
          { naturalReply: "Good. Now you are talking about lunch and the rest of the day.", nextQuestion: "What happens after lunch?" },
        ];
      }
      return [
        { naturalReply: "Lunch with colleagues sounds normal.", nextQuestion: "What do you usually eat for lunch?" },
        { naturalReply: "That is a clear lunch detail.", nextQuestion: "Do you usually eat at the office or outside?" },
      ];
    case "evening":
      return [
        { naturalReply: "That sounds like a normal evening.", nextQuestion: "What do you usually do after you get home?" },
        { naturalReply: "Good. Now you are talking about your evening at home.", nextQuestion: "How do you usually relax at night?" },
      ];
    case "dinner":
      return [
        { naturalReply: "That sounds like a normal evening.", nextQuestion: "What do you usually eat for dinner?" },
        { naturalReply: "Dinner at home sounds like a clear evening routine.", nextQuestion: "Who do you usually have dinner with?" },
      ];
    case "family":
      return [{ naturalReply: "That sounds like time with your family.", nextQuestion: "Who do you usually talk with at home?" }];
    case "commute":
      return [{ naturalReply: "That sounds like your commute.", nextQuestion: "How long does it usually take?" }];
    case "general":
      if (context.intent === "market-errand") {
        return [{ naturalReply: "Good. That sounds like a useful errand.", nextQuestion: "What did you buy at the market?" }];
      }
      return [
        { naturalReply: "Got it. Tell me one more detail about that.", nextQuestion: "When does that usually happen?" },
        { naturalReply: "I understand the general idea.", nextQuestion: "Can you add one clear detail?" },
      ];
  }
}

export function selectSpeakConversationReply(
  userText: string,
  previousState: SpeakConversationState = createSpeakConversationState(),
): SpeakReplySelection {
  const detectedContext = detectSpeakConversationContext(userText);
  const replyType: SpeakReplyType = detectedContext.isUnclear ? "clarification" : "contextual-question";
  const reply = detectedContext.isUnclear
    ? buildClarification(detectedContext)
    : selectCandidate(buildTopicCandidates(detectedContext), previousState.avoidReplyTemplates);

  const state: SpeakConversationState = {
    currentTopic: detectedContext.topic,
    lastUserIntent: detectedContext.intent,
    lastDetectedContext: detectedContext,
    lastTeacherReplyType: replyType,
    turnCount: previousState.turnCount + 1,
    recentTopics: pushLimited(previousState.recentTopics, detectedContext.topic, MAX_RECENT_TOPICS),
    avoidReplyTemplates: pushLimited(previousState.avoidReplyTemplates, templateKey(reply), MAX_AVOID_TEMPLATES),
  };

  return {
    ...reply,
    replyType,
    detectedContext,
    state,
  };
}
