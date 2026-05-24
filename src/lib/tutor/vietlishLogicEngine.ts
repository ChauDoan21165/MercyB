export type VietlishLogicDiagnosis = {
  originalPattern: string;
  correctedExample: string;
  vietnameseThinking: string;
  englishLogic: string;
  rememberRule: string;
  retryPrompt: string;
};

type VietlishPattern = {
  id: string;
  match: RegExp;
  diagnosis: VietlishLogicDiagnosis;
};

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
  const normalized = normalizeInput(input);
  const pattern = PATTERNS.find((candidate) => candidate.match.test(normalized));
  return pattern?.diagnosis ?? UNKNOWN_DIAGNOSIS;
}

export function getSupportedVietlishLogicPatterns(): string[] {
  return PATTERNS.map((pattern) => pattern.id);
}
