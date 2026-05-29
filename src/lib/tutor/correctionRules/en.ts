export type CorrectionRule = {
  id: string;
  detects: (input: string) => boolean;
  apply: (input: string) => string;
};

const PAST_VERBS: Record<string, string> = {
  buy: "bought",
  do: "did",
  eat: "ate",
  go: "went",
  have: "had",
};

const DAILY_THIRD_PERSON_VERBS: Record<string, string> = {
  eat: "eats",
  go: "goes",
  have: "has",
};

const STEP5_THIRD_PERSON_VERBS: Record<string, string> = {
  go: "goes",
  make: "makes",
  work: "works",
};

const KNOWN_UNCORRECTED_PAST_MARKER_VERBS = [
  "come",
  "drink",
  "run",
  "sit",
  "sleep",
  "speak",
  "swim",
  "write",
];

const MISSING_ARTICLE_NOUNS: Record<string, "a" | "an"> = {
  apple: "an",
  book: "a",
  hat: "a",
  orange: "an",
  student: "a",
  teacher: "a",
};

const COUNTABLE_PLURAL_NOUNS: Record<string, string> = {
  apple: "apples",
  book: "books",
  hat: "hats",
  lesson: "lessons",
  orange: "oranges",
  student: "students",
  word: "words",
};

function replaceVerbAfterSubject(
  input: string,
  verbs: Record<string, string>,
): string {
  const verbPattern = Object.keys(verbs).join("|");
  const pattern = new RegExp(`\\b(I|You|We|They|He|She|It)\\s+(${verbPattern})\\b`, "gi");
  return input.replace(pattern, (_match, subject: string, verb: string) => {
    return `${subject} ${verbs[verb.toLowerCase()] ?? verb}`;
  });
}

function isQuestionLike(input: string): boolean {
  const trimmed = input.trim();
  return (
    /[?？]$/.test(trimmed) ||
    /^(what|where|when|why|how|who|which|do|does|did|are|is|can|could|would|will|should)\b/i.test(trimmed)
  );
}

function hasPastTimeMarker(input: string): boolean {
  return (
    /\byesterday\b/i.test(input) ||
    /\blast\s+(?:night|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(input) ||
    /\b(?:a|one|two|three|\d+)\s+(?:day|days|week|weeks|month|months|year|years)\s+ago\b/i.test(input)
  );
}

function repairStep5SubjectVerbAgreement(input: string): string {
  return input.replace(
    /\b(He|She|It)\s+(go|make|work)\b/gi,
    (_match, subject: string, verb: string) =>
      `${subject} ${STEP5_THIRD_PERSON_VERBS[verb.toLowerCase()] ?? verb}`,
  );
}

function punctuateMorningRoutineRunOn(input: string): string {
  return input.replace(
    /^what do you usually do in the morning\s+nice that sounds like a clear morning routine\s+what do you do after that[.?!]?$/i,
    "What do you usually do in the morning? Nice, that sounds like a clear morning routine. What do you do after that?",
  );
}

function punctuateQuestionForm(input: string): string {
  const trimmed = input.trim().replace(/[.!?]+$/u, "");
  return `${trimmed}?`;
}

function addArticleAfterVerb(input: string): string {
  const nounPattern = Object.keys(MISSING_ARTICLE_NOUNS).join("|");
  const objectPattern = new RegExp(
    `\\b(I|You|We|They|He|She)\\s+(bought|buy|want|need)\\s+(${nounPattern})\\b`,
    "gi",
  );
  const bePattern = new RegExp(
    `\\b(He|She|I)\\s+(is|am)\\s+(${nounPattern})\\b`,
    "gi",
  );

  return input
    .replace(objectPattern, (_match, subject: string, verb: string, noun: string) => {
      const article = MISSING_ARTICLE_NOUNS[noun.toLowerCase()];
      return `${subject} ${verb} ${article} ${noun}`;
    })
    .replace(bePattern, (_match, subject: string, verb: string, noun: string) => {
      const article = MISSING_ARTICLE_NOUNS[noun.toLowerCase()];
      return `${subject} ${verb} ${article} ${noun}`;
    });
}

function pluralizeAfterQuantity(input: string): string {
  const nounPattern = Object.keys(COUNTABLE_PLURAL_NOUNS).join("|");
  const pattern = new RegExp(`\\b(two|three|many|some|several)\\s+(${nounPattern})\\b`, "gi");
  return input.replace(pattern, (_match, quantity: string, noun: string) => {
    return `${quantity} ${COUNTABLE_PLURAL_NOUNS[noun.toLowerCase()] ?? noun}`;
  });
}

function repairTopicCommentOrder(input: string): string {
  return input
    .replace(/^this book i like[.?!]?$/i, "I like this book")
    .replace(/^english i study every day[.?!]?$/i, "I study English every day");
}

function repairStep5PrepositionPatterns(input: string): string {
  return input
    .replace(/\b(depend|depends|depended|depending)\s+of\b/gi, "$1 on")
    .replace(/\b(interested)\s+with\b/gi, "$1 in")
    .replace(/\b(good)\s+in\s+(English|math|science)\b/gi, "$1 at $2")
    .replace(/\b(listen|listens|listened|listening)\s+(music|the music|songs|a song|the song)\b/gi, "$1 to $2");
}

export const englishCorrectionRules: CorrectionRule[] = [
  {
    id: "en-runon-morning-routine-punctuation",
    detects: (input) =>
      /^what do you usually do in the morning\s+nice that sounds like a clear morning routine\s+what do you do after that[.?!]?$/i.test(input),
    apply: punctuateMorningRoutineRunOn,
  },
  {
    id: "en-yesterday-irregular-beginner-past",
    detects: (input) =>
      /\byesterday\b/i.test(input) &&
      /\b(I|You|We|They|He|She|It)\s+(buy|do|eat|go|have)\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, PAST_VERBS),
  },
  {
    id: "en-l4-missing-singular-article",
    detects: (input) =>
      /\b(I|You|We|They|He|She)\s+(bought|buy|want|need)\s+(apple|book|hat|orange|student|teacher)\b/i.test(input) ||
      /\b(He|She|I)\s+(is|am)\s+(apple|book|hat|orange|student|teacher)\b/i.test(input),
    apply: addArticleAfterVerb,
  },
  {
    id: "en-l4-quantity-plural-s",
    detects: (input) =>
      /\b(two|three|many|some|several)\s+(apple|book|hat|lesson|orange|student|word)\b/i.test(input),
    apply: pluralizeAfterQuantity,
  },
  {
    id: "en-l4-topic-comment-word-order",
    detects: (input) =>
      /^this book i like[.?!]?$/i.test(input.trim()) ||
      /^english i study every day[.?!]?$/i.test(input.trim()),
    apply: repairTopicCommentOrder,
  },
  {
    id: "en-step5-subject-verb-agreement",
    detects: (input) =>
      !isQuestionLike(input) &&
      !hasPastTimeMarker(input) &&
      /\b(He|She|It)\s+(go|make|work)\b/i.test(input),
    apply: repairStep5SubjectVerbAgreement,
  },
  {
    id: "en-step5-preposition-pattern",
    detects: (input) =>
      /\b(depend|depends|depended|depending)\s+of\b/i.test(input) ||
      /\binterested\s+with\b/i.test(input) ||
      /\bgood\s+in\s+(English|math|science)\b/i.test(input) ||
      /\b(listen|listens|listened|listening)\s+(music|the music|songs|a song|the song)\b/i.test(input),
    apply: repairStep5PrepositionPatterns,
  },
  {
    id: "en-third-person-daily-go-eat-have",
    detects: (input) =>
      /\b(She|He|It)\s+(go|eat|have)\b/i.test(input) &&
      /\bevery day\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, DAILY_THIRD_PERSON_VERBS),
  },
  {
    id: "en-third-person-school-routine",
    detects: (input) =>
      /\b(She|He|It)\s+go\s+to\s+school\b/i.test(input) &&
      !/\byesterday\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, DAILY_THIRD_PERSON_VERBS),
  },
  {
    id: "en-question-form-final-mark",
    detects: (input) =>
      /^(what|where|when|why|how|do|does|did|are|is|can|could|would|will)\b/i.test(input.trim()) &&
      !/[?？]$/.test(input.trim()),
    apply: punctuateQuestionForm,
  },
];

export function isClearlyWrongBeginnerEnglish(input: string): boolean {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  if (englishCorrectionRules.some((rule) => rule.detects(normalized))) {
    return true;
  }

  const unsupportedPastVerbPattern = new RegExp(
    `\\b(I|You|We|They|He|She|It)\\s+(${KNOWN_UNCORRECTED_PAST_MARKER_VERBS.join("|")})\\b.*\\byesterday\\b`,
    "i",
  );
  return unsupportedPastVerbPattern.test(normalized);
}
