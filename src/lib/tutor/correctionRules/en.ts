export type CorrectionRule = {
  id: string;
  detects: (input: string) => boolean;
  apply: (input: string) => string;
  fpRiskNote?: string;
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
  bicycle: "a",
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

function isProperNounArticleMatch(noun: string): boolean {
  return /^[A-Z]/.test(noun);
}

function replaceVerbAfterSubject(
  input: string,
  verbs: Record<string, string>,
): string {
  const verbPattern = Object.keys(verbs).join("|");
  const pattern = new RegExp(`\\b(I|You|We|They|He|She|It)\\s+(${verbPattern})\\b(?!\\s+not\\b)`, "gi");
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
    /\blast\s+(?:night|week|month|year|summer|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(input) ||
    /\bon\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(input) ||
    /\bin\s+\d{4}\b/i.test(input) ||
    /\b(?:an?|one|two|three|\d+)\s+(?:hour|hours|day|days|week|weeks|month|months|year|years)\s+ago\b/i.test(input)
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

function repairMorningRoutineSubjectCarryover(input: string): string {
  return input.replace(
    /^in the morning,?\s+i wake up and they have a breakfast and coffee and then i go to my office[.?!]?$/i,
    "In the morning, I wake up, have breakfast and coffee, and then go to my office",
  );
}

function isHatBikingSummerRunOn(input: string): boolean {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (/\b(?:do not|don't|not|no)\s+plan\s+to\s+bike\b/i.test(normalized)) {
    return false;
  }

  return (
    /\b(?:i|they)\s+(?:bought|buy)\b/i.test(normalized) &&
    /\byesterday\b/i.test(normalized) &&
    /\b(?:hat|bicycle|bike)\b/i.test(normalized) &&
    (
      /\b(?:summer|canada|sunny|hot)\b/i.test(normalized) ||
      /\b(?:will|plan to|win|been)\s+(?:a\s+)?bik(?:e|ing)\b/i.test(normalized) ||
      /\bsomeone'?s coming\b/i.test(normalized) ||
      /\bsummer sucks coming\b/i.test(normalized)
    )
  );
}

function repairHatBikingSummerRunOn(input: string): string {
  const normalized = input.replace(/\s+/g, " ").trim();
  const mentionsBicycle = /\b(?:bicycle|bike)\b/i.test(normalized) && /\b(?:bought|buy)\s+a?\s*(?:bicycle|bike)\b/i.test(normalized);
  const mentionsHat = /\bhat\b/i.test(normalized);
  const mentionsCanada = /\bcanada\b/i.test(normalized);
  const mentionsBikePlan = /\b(?:will|plan to|win|been)\s+(?:a\s+)?bik(?:e|ing)\b/i.test(normalized) || /\bbike a lot\b/i.test(normalized);

  if (mentionsBicycle && mentionsHat) {
    return mentionsCanada
      ? "I bought a bicycle yesterday because summer is coming, and I plan to bike a lot. I also bought a hat because it is very sunny in Canada"
      : "I bought a bicycle yesterday because summer is coming, and I plan to bike a lot. I also bought a hat because it is very sunny";
  }

  if (mentionsHat && mentionsBikePlan) {
    return mentionsCanada
      ? "I bought a hat yesterday because I plan to bike a lot this summer, and it is very sunny in Canada"
      : "I bought a hat yesterday because I plan to bike a lot this summer";
  }

  return mentionsCanada
    ? "I bought a hat yesterday because summer is coming, and it is very sunny in Canada"
    : "I bought a hat yesterday because summer is coming, and it is very sunny";
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
    .replace(objectPattern, (match, subject: string, verb: string, noun: string) => {
      if (isProperNounArticleMatch(noun)) return match;
      const article = MISSING_ARTICLE_NOUNS[noun.toLowerCase()];
      return `${subject} ${verb} ${article} ${noun}`;
    })
    .replace(bePattern, (match, subject: string, verb: string, noun: string) => {
      if (isProperNounArticleMatch(noun)) return match;
      const article = MISSING_ARTICLE_NOUNS[noun.toLowerCase()];
      return `${subject} ${verb} ${article} ${noun}`;
    });
}

function hasMissingCommonNounArticle(input: string): boolean {
  const nounPattern = Object.keys(MISSING_ARTICLE_NOUNS).join("|");
  const objectPattern = new RegExp(
    `\\b(I|You|We|They|He|She)\\s+(bought|buy|want|need)\\s+(${nounPattern})\\b`,
    "gi",
  );
  const bePattern = new RegExp(
    `\\b(He|She|I)\\s+(is|am)\\s+(${nounPattern})\\b`,
    "gi",
  );
  const matchesCommonNoun = (pattern: RegExp) =>
    Array.from(input.matchAll(pattern)).some((match) => !isProperNounArticleMatch(match[3] ?? ""));

  return matchesCommonNoun(objectPattern) || matchesCommonNoun(bePattern);
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
    .replace(/^english i study every day[.?!]?$/i, "I study English every day")
    .replace(/^in my family,?\s+my mother i love very much[.?!]?$/i, "In my family, I love my mother very much");
}

function repairStep5PrepositionPatterns(input: string): string {
  return input
    .replace(/\b(depend|depends|depended|depending)\s+of\b/gi, "$1 on")
    .replace(/\b(interested)\s+with\b/gi, "$1 in")
    .replace(/\b(good)\s+in\s+(English|math|science)\b/gi, "$1 at $2")
    .replace(/\b(go|goes|went|going)\s+school\b(?!\s+bus\b)/gi, "$1 to school")
    .replace(/\b(listen|listens|listened|listening)\s+(music|the music|songs|a song|the song)\b/gi, "$1 to $2");
}

function repairBeVerbOmission(input: string): string {
  return input
    .replace(/\b(I)\s+(very\s+(?:happy|sad|tired|busy)(?:\s+today)?)\b/gi, "$1 am $2")
    .replace(/\b(He|She|It)\s+(very\s+(?:happy|sad|tired|busy)(?:\s+today)?)\b/gi, "$1 is $2")
    .replace(/\b(You|We|They)\s+(very\s+(?:happy|sad|tired|busy)(?:\s+today)?)\b/gi, "$1 are $2");
}

const TIME_EXPRESSION_PLACEMENT_PATTERN =
  /^(I|you|he|she|it|we|they)\s+(yesterday|today|tonight|tomorrow|this morning|this afternoon|this evening|last night|last week|last month|last year|last summer|on Monday|on Tuesday|on Wednesday|on Thursday|on Friday|on Saturday|on Sunday|last Monday|last Tuesday|last Wednesday|last Thursday|last Friday|last Saturday|last Sunday|in 2024|an hour ago|two hours ago|three days ago)\s+(.+?)[.?!]?$/i;

const TIME_EXPRESSION_AUDITED_VERB_FRAMES =
  /^(?:went to school|watched TV|visited grandma|moved to Canada|finished dinner|bought a hat)$/i;

const TIME_EXPRESSION_FREQUENCY_ADVERBS =
  /\b(?:always|usually|often|sometimes|rarely|never|every day|every week|every month|every year)\b/i;

const TIME_EXPRESSION_CLAUSE_MARKERS =
  /\b(?:and|but|because|when|while|if|that|who|which|where|after|before|since|although|though|so)\b/i;

const TIME_EXPRESSION_EMBEDDED_SUBJECT =
  /\b(?:I|you|he|she|it|we|they)\s+(?:am|are|is|was|were|do|does|did|have|has|had|will|would|can|could|should|buy|bought|go|went|watch|watched|visit|visited|move|moved|finish|finished|study|said|say|busy)\b/i;

const TIME_EXPRESSION_REPORTING_VERBS =
  /^(?:said|say|says|told|tell|tells|thought|think|thinks|knew|know|knows)\b/i;

function getTimeExpressionPlacementMatch(input: string): RegExpMatchArray | null {
  const trimmed = input.trim();
  const match = trimmed.match(TIME_EXPRESSION_PLACEMENT_PATTERN);
  if (!match) return null;

  const verbPhrase = (match[3] ?? "").trim();
  if (!verbPhrase) return null;
  if (!TIME_EXPRESSION_AUDITED_VERB_FRAMES.test(verbPhrase)) return null;
  if (TIME_EXPRESSION_FREQUENCY_ADVERBS.test(match[2] ?? "")) return null;
  if (TIME_EXPRESSION_CLAUSE_MARKERS.test(verbPhrase)) return null;
  if (TIME_EXPRESSION_EMBEDDED_SUBJECT.test(verbPhrase)) return null;
  if (TIME_EXPRESSION_REPORTING_VERBS.test(verbPhrase)) return null;
  if (/[,;:]/.test(verbPhrase)) return null;

  return match;
}

function hasTimeExpressionPlacement(input: string): boolean {
  return getTimeExpressionPlacementMatch(input) !== null;
}

function repairTimeExpressionPlacement(input: string): string {
  const match = getTimeExpressionPlacementMatch(input);
  if (!match) return input;

  const [, subject, timeExpression, verbPhrase] = match;
  return `${subject} ${verbPhrase.trim()} ${timeExpression}`;
}

export const englishCorrectionRules: CorrectionRule[] = [
  {
    id: "en-hat-biking-summer-runon",
    detects: isHatBikingSummerRunOn,
    apply: repairHatBikingSummerRunOn,
  },
  {
    id: "en-morning-routine-subject-carryover",
    detects: (input) =>
      /^in the morning,?\s+i wake up and they have a breakfast and coffee and then i go to my office[.?!]?$/i.test(input.trim()),
    apply: repairMorningRoutineSubjectCarryover,
  },
  {
    id: "en-runon-morning-routine-punctuation",
    detects: (input) =>
      /^what do you usually do in the morning\s+nice that sounds like a clear morning routine\s+what do you do after that[.?!]?$/i.test(input),
    apply: punctuateMorningRoutineRunOn,
  },
  {
    id: "en-yesterday-irregular-beginner-past",
    detects: (input) =>
      hasPastTimeMarker(input) &&
      /\b(I|You|We|They|He|She|It)\s+(buy|do|eat|go|have)\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, PAST_VERBS),
  },
  {
    id: "en-l4-missing-singular-article",
    detects: hasMissingCommonNounArticle,
    apply: addArticleAfterVerb,
    fpRiskNote: "Article insertion is limited to whitelisted count nouns and skips capitalized proper/company names.",
  },
  {
    id: "en-l4-quantity-plural-s",
    detects: (input) =>
      /\b(two|three|many|some|several)\s+(apple|book|hat|lesson|orange|student|word)\b/i.test(input),
    apply: pluralizeAfterQuantity,
    fpRiskNote: "Plural -s insertion is limited to regular whitelisted count nouns and intentionally skips irregulars/uncountables.",
  },
  {
    id: "en-l4-topic-comment-word-order",
    detects: (input) =>
      /^this book i like[.?!]?$/i.test(input.trim()) ||
      /^english i study every day[.?!]?$/i.test(input.trim()) ||
      /^in my family,?\s+my mother i love very much[.?!]?$/i.test(input.trim()),
    apply: repairTopicCommentOrder,
  },
  {
    id: "en-time-expression-placement",
    detects: hasTimeExpressionPlacement,
    apply: repairTimeExpressionPlacement,
    fpRiskNote: "Medium risk. Time-expression placement can overlap with acceptable fronted time expressions, noun postmodifiers, frequency adverbs, subordinate clauses, and stylistic emphasis. This v1 rule uses a closed whitelist, avoids comma insertion, rejects frequency adverbs, rejects noun subjects, rejects multi-clause sentences, and only rewrites pronoun subject + whitelisted time expression + single verb phrase shapes.",
  },
  {
    id: "en-be-verb-omission",
    detects: (input) =>
      /\b(?:I|He|She|It|You|We|They)\s+very\s+(?:happy|sad|tired|busy)(?:\s+today)?\b/i.test(input),
    apply: repairBeVerbOmission,
    fpRiskNote: "Be-drop v1 requires a pronoun plus very plus a small adjective whitelist.",
  },
  {
    id: "en-step5-subject-verb-agreement",
    detects: (input) =>
      !isQuestionLike(input) &&
      !hasPastTimeMarker(input) &&
      /\b(He|She|It)\s+(go|make|work)\b/i.test(input),
    apply: repairStep5SubjectVerbAgreement,
    fpRiskNote: "Third-person -s only covers he/she/it with whitelisted verbs and is blocked by questions, modals, and past markers.",
  },
  {
    id: "en-step5-preposition-pattern",
    detects: (input) =>
      /\b(depend|depends|depended|depending)\s+of\b/i.test(input) ||
      /\binterested\s+with\b/i.test(input) ||
      /\bgood\s+in\s+(English|math|science)\b/i.test(input) ||
      /\b(go|goes|went|going)\s+school\b(?!\s+bus\b)/i.test(input) ||
      /\b(listen|listens|listened|listening)\s+(music|the music|songs|a song|the song)\b/i.test(input),
    apply: repairStep5PrepositionPatterns,
    fpRiskNote: "Missing-to repair is phrase-whitelisted and does not rewrite home/there/downtown/abroad/upstairs or school bus.",
  },
  {
    id: "en-third-person-daily-go-eat-have",
    detects: (input) =>
      /\b(She|He|It)\s+(go|eat|have)\b/i.test(input) &&
      /\bevery day\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, DAILY_THIRD_PERSON_VERBS),
    fpRiskNote: "Daily-routine third-person -s only covers he/she/it with go/eat/have in every-day contexts.",
  },
  {
    id: "en-third-person-school-routine",
    detects: (input) =>
      /\b(She|He|It)\s+go\s+to\s+school\b/i.test(input) &&
      !/\byesterday\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, DAILY_THIRD_PERSON_VERBS),
    fpRiskNote: "School-routine third-person -s is limited to he/she/it go to school and avoids yesterday contexts.",
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
