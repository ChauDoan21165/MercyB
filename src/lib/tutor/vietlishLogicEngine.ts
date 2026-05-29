export type VietlishLogicDiagnosis = {
  originalPattern: string;
  correctedExample: string;
  vietnameseThinking: string;
  englishLogic: string;
  rememberRule: string;
  retryPrompt: string;
};

export type VietlishLogicDiagnosisResult = VietlishLogicDiagnosis & {
  patternId: string | null;
  isKnownPattern: boolean;
  fallbackMessage?: string;
};

type VietlishPattern = {
  id: string;
  match: RegExp;
  diagnosis: VietlishLogicDiagnosis;
};

const UNKNOWN_FALLBACK_MESSAGE =
  "Mercy can still explain the English logic. Try a common sentence like: I go school.";

const UNKNOWN_DIAGNOSIS: VietlishLogicDiagnosis = {
  originalPattern: "Unrecognized beginner pattern",
  correctedExample: "Try rewriting the sentence with one clear subject, verb, and time marker.",
  vietnameseThinking: "Vietnamese can leave some grammar relationships unstated when the meaning is clear.",
  englishLogic: "English usually needs the relationship to be visible in the sentence.",
  rememberRule: "Find the main verb, then check time, direction, and word type.",
  retryPrompt: "Try one short sentence again. What is the subject, action, and time?",
};

const PATTERNS: VietlishPattern[] = [
  {
    id: "very-like",
    match: /\bi\s+very\s+like\s+english\b/i,
    diagnosis: {
      originalPattern: "I very like English.",
      correctedExample: "I really like English.",
      vietnameseThinking: "Vietnamese can use one intensifier idea before many kinds of words.",
      englishLogic: "Very describes adjectives, but really can strengthen verbs like like.",
      rememberRule: "Use really before verbs; use very before adjectives.",
      retryPrompt: "Write one sentence with really + a verb you like.",
    },
  },
  {
    id: "go-school",
    match: /\bi\s+go\s+school\b/i,
    diagnosis: {
      originalPattern: "I go school.",
      correctedExample: "I go to school.",
      vietnameseThinking: "Vietnamese can place the destination right after the movement verb.",
      englishLogic: "English often needs to for movement toward a place.",
      rememberRule: "Movement verb + to + place.",
      retryPrompt: "Write one sentence with go to + a place.",
    },
  },
  {
    id: "yesterday-present",
    match: /\bi\s+buy\s+a\s+hat\s+yesterday\b/i,
    diagnosis: {
      originalPattern: "I buy a hat yesterday.",
      correctedExample: "I bought a hat yesterday.",
      vietnameseThinking: "Vietnamese can use a time word like yesterday without changing the verb.",
      englishLogic: "Yesterday points to the past, so English changes the verb to past tense.",
      rememberRule: "Past time word + past verb.",
      retryPrompt: "Write one sentence with yesterday and a past-tense verb.",
    },
  },
  {
    id: "l4-pronunciation-final-sound-nudge",
    match: /\b(i\s+bought\s+a\s+hat|i\s+want\s+\w+|i\s+went\b|a\s+hat\b)\b/i,
    diagnosis: {
      originalPattern: "Final sound practice: bought / hat / want / went",
      correctedExample: "Practice the final sound in 'bought' / 'hat'.",
      vietnameseThinking: "Vietnamese often does not release final consonant sounds as strongly as English.",
      englishLogic: "In English, the final -t, -d, or -s sound can change what listeners hear.",
      rememberRule: "This is only a text-based practice nudge, not an audio grade.",
      retryPrompt: "Say one short sentence slowly and touch the final sound: bought, hat, want, or went.",
    },
  },
  {
    id: "l4-article-a-an-the",
    match: /\b(i\s+bought\s+hat\s+yesterday|she\s+is\s+teacher)\b/i,
    diagnosis: {
      originalPattern: "I bought hat yesterday. / She is teacher.",
      correctedExample: "I bought a hat yesterday. / She is a teacher.",
      vietnameseThinking: "Tiếng Việt không dùng mạo từ như a/an/the, nhưng tiếng Anh thường cần a/an trước danh từ đếm được số ít.",
      englishLogic: "A singular countable noun usually needs a small marker like a or an.",
      rememberRule: "One countable thing: a/an + noun.",
      retryPrompt: "Write one sentence with a/an + one job or one object.",
    },
  },
  {
    id: "l4-plural-s-after-quantity",
    match: /\b(two\s+book|many\s+student)\b/i,
    diagnosis: {
      originalPattern: "I have two book. / Many student like English.",
      correctedExample: "I have two books. / Many students like English.",
      vietnameseThinking: "Khi có two/many/some/several..., danh từ đếm được thường cần số nhiều.",
      englishLogic: "Words like two and many point to more than one, so countable nouns usually add plural -s.",
      rememberRule: "Quantity word + plural countable noun.",
      retryPrompt: "Write one sentence with two/many + a plural noun.",
    },
  },
  {
    id: "l4-topic-comment-word-order",
    match: /\b(this\s+book\s+i\s+like|english\s+i\s+study\s+every\s+day)\b/i,
    diagnosis: {
      originalPattern: "This book I like. / English I study every day.",
      correctedExample: "I like this book. / I study English every day.",
      vietnameseThinking: "Tiếng Việt có thể đưa chủ đề lên đầu câu, nhưng tiếng Anh cơ bản thường cần trật tự Chủ ngữ + Động từ + Tân ngữ.",
      englishLogic: "Basic English usually puts the subject first, then the verb, then the object.",
      rememberRule: "Subject + verb + object.",
      retryPrompt: "Rewrite one sentence with I + verb + object.",
    },
  },
  {
    id: "interesting-interested",
    match: /\bi\s+am\s+interesting\s+in\s+english\b/i,
    diagnosis: {
      originalPattern: "I am interesting in English.",
      correctedExample: "I am interested in English.",
      vietnameseThinking: "Vietnamese often uses one feeling idea without changing the adjective form.",
      englishLogic: "Interested describes your feeling; interesting describes the thing.",
      rememberRule: "Use interested for the person who feels it; use interesting for the thing.",
      retryPrompt: "Write one sentence with I am interested in + a topic.",
    },
  },
];

function normalizeInput(value: string): string {
  return String(value ?? "")
    .replace(/[.!?。！？]+$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function diagnoseVietlishLogic(input: string): VietlishLogicDiagnosis {
  const result = diagnoseVietlishLogicWithMatch(input);
  return {
    originalPattern: result.originalPattern,
    correctedExample: result.correctedExample,
    vietnameseThinking: result.vietnameseThinking,
    englishLogic: result.englishLogic,
    rememberRule: result.rememberRule,
    retryPrompt: result.retryPrompt,
  };
}

export function diagnoseVietlishLogicWithMatch(input: string): VietlishLogicDiagnosisResult {
  const normalized = normalizeInput(input);
  const pattern = PATTERNS.find((candidate) => candidate.match.test(normalized));
  if (pattern) {
    return {
      ...pattern.diagnosis,
      patternId: pattern.id,
      isKnownPattern: true,
    };
  }

  return {
    ...UNKNOWN_DIAGNOSIS,
    patternId: null,
    isKnownPattern: false,
    fallbackMessage: UNKNOWN_FALLBACK_MESSAGE,
  };
}

export function getSupportedVietlishLogicPatterns(): string[] {
  return PATTERNS.map((pattern) => pattern.id);
}
