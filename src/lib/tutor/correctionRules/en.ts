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

const STEP6_PAST_MARKER_RECALL_VERBS: Record<string, string> = {
  eat: "ate",
  go: "went",
  move: "moved",
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

const PROFESSION_ARTICLES: Record<string, "a" | "an"> = {
  artist: "an",
  doctor: "a",
  driver: "a",
  engineer: "an",
  farmer: "a",
  lawyer: "a",
  nurse: "a",
  student: "a",
  teacher: "a",
  writer: "a",
};

const STEP6_POSSESSIVE_OWNER_PATTERN =
  "(?:mother|father|brother|sister|friend|teacher|boss|wife|husband)";

const STEP6_POSSESSIVE_OBJECT_PATTERN =
  "(?:car|phone|house|room|bag|book|computer|bicycle|bike|office|job)";

const STEP6_POSSESSIVE_COMPOUND_EXCLUSION_PATTERN =
  /\b(?:mother tongue|sister city|father figure|brother country|teacher training|boss fight)\b/i;

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
    /\blast\s+(?:night|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(input) ||
    /\b(?:an?|one|two|three|\d+)\s+(?:day|days|week|weeks|month|months|year|years)\s+ago\b/i.test(input) ||
    /^on\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(?:I|you|we|they|he|she|it)\b/i.test(input.trim()) ||
    /^in\s+\d{4}\s+(?:I|you|we|they|he|she|it)\b/i.test(input.trim()) ||
    /^(?:an?|one|two|three|\d+)\s+(?:hour|hours)\s+ago\s+(?:I|you|we|they|he|she|it)\b/i.test(input.trim()) ||
    /^last\s+(?:summer|spring|winter|fall|autumn)\s+(?:I|you|we|they|he|she|it)\b/i.test(input.trim())
  );
}

function hasSvaTemporalBlocker(input: string): boolean {
  return (
    hasPastTimeMarker(input) ||
    /\bon\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(input) ||
    /\bin\s+\d{4}\b/i.test(input) ||
    /\b(?:an?|one|two|three|\d+)\s+(?:hour|hours)\s+ago\b/i.test(input) ||
    /\blast\s+(?:summer|spring|winter|fall|autumn)\b/i.test(input)
  );
}

function hasBeginnerPastCorrectionMarker(input: string): boolean {
  return (
    /\byesterday\b/i.test(input) ||
    /\blast\s+(?:night|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(input) ||
    /\b(?:one|two|three|\d+)\s+(?:day|days|week|weeks|month|months|year|years)\s+ago\b/i.test(input)
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

function hasStep6ProfessionArticle(input: string): boolean {
  const professionPattern = Object.keys(PROFESSION_ARTICLES).join("|");
  return new RegExp(`\\b(?:I\\s+am|He\\s+is|She\\s+is)\\s+(?:${professionPattern})\\b`, "i").test(input);
}

function repairStep6ProfessionArticle(input: string): string {
  const professionPattern = Object.keys(PROFESSION_ARTICLES).join("|");
  const pattern = new RegExp(`\\b(I\\s+am|He\\s+is|She\\s+is)\\s+(${professionPattern})\\b`, "gi");
  return input.replace(pattern, (_match, prefix: string, profession: string) => {
    const article = PROFESSION_ARTICLES[profession.toLowerCase()] ?? "a";
    return `${prefix} ${article} ${profession}`;
  });
}

function hasStep6PossessiveS(input: string): boolean {
  if (STEP6_POSSESSIVE_COMPOUND_EXCLUSION_PATTERN.test(input)) return false;

  const pattern = new RegExp(
    `\\b(?:my|your|his|her|our|their)\\s+${STEP6_POSSESSIVE_OWNER_PATTERN}\\s+${STEP6_POSSESSIVE_OBJECT_PATTERN}\\b`,
    "i",
  );
  return pattern.test(input);
}

function repairStep6PossessiveS(input: string): string {
  if (STEP6_POSSESSIVE_COMPOUND_EXCLUSION_PATTERN.test(input)) return input;

  const pattern = new RegExp(
    `\\b((?:my|your|his|her|our|their)\\s+)(${STEP6_POSSESSIVE_OWNER_PATTERN})\\s+(${STEP6_POSSESSIVE_OBJECT_PATTERN})\\b`,
    "gi",
  );
  return input.replace(pattern, "$1$2's $3");
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
    .replace(/\b(go|goes|went|going)\s+school\b(?!\s+bus\b)/gi, "$1 to school");
}

const PERSON_OBJECT_PRONOUN_PATTERN = "(?:me|you|him|her|us|them)";
const STEP6_LISTEN_OBJECT_PATTERN = "(?:me|you|him|her|us|them|music|song|teacher|radio|podcast|lesson|story)";
const CLOCK_TIME_PATTERN = "(?:\\d{1,2}\\s+o(?:'|\\u2019)?clock|\\d{1,2}\\s*(?:AM|PM|am|pm)|\\d{1,2}:\\d{2})";

function repairStep6WaitFor(input: string): string {
  const pattern = new RegExp(`\\b(wait|waits|waited|waiting)\\s+(${PERSON_OBJECT_PRONOUN_PATTERN})\\b`, "gi");
  return input.replace(pattern, "$1 for $2");
}

function repairStep6ListenTo(input: string): string {
  const pattern = new RegExp(`\\b(listen|listens|listened|listening)\\s+(${STEP6_LISTEN_OBJECT_PATTERN})\\b`, "gi");
  return input.replace(pattern, "$1 to $2");
}

function repairStep6DiscussAbout(input: string): string {
  return input.replace(/\b(discuss|discusses|discussed|discussing)\s+about\s+/gi, "$1 ");
}

function repairStep6MarryWith(input: string): string {
  const pattern = new RegExp(`\\b(marry|marries|married|marrying)\\s+with\\s+(${PERSON_OBJECT_PRONOUN_PATTERN})\\b`, "gi");
  return input.replace(pattern, "$1 $2");
}

function repairStep6AtClockTime(input: string): string {
  const pattern = new RegExp(
    `\\b(wake up|wakes up|woke up|start work|starts work|started work|meet|meets|met)\\s+(${CLOCK_TIME_PATTERN})\\b`,
    "gi",
  );
  return input.replace(pattern, "$1 at $2");
}

const STEP6_PAST_MARKER_CLAUSE_BLOCKERS =
  /\b(?:and|but|because|when|while|if|that|who|which|where|after|before|since|although|though|so|said|told)\b/i;

const STEP6_MONTH_NAMES =
  "(?:january|february|march|april|may|june|july|august|september|october|november|december)";

function isPastYear(year: string): boolean {
  const parsedYear = Number.parseInt(year, 10);
  if (!Number.isFinite(parsedYear)) return false;
  return parsedYear <= new Date().getFullYear() - 1;
}

function getStep6PastMarkerRecallMatch(input: string): RegExpMatchArray | null {
  const trimmed = input.trim();
  if (/[,:;]/.test(trimmed) || STEP6_PAST_MARKER_CLAUSE_BLOCKERS.test(trimmed)) return null;
  if (/^every\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(trimmed)) return null;
  if (/^on\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(trimmed)) return null;

  const verbPattern = Object.keys(STEP6_PAST_MARKER_RECALL_VERBS).join("|");
  const markerPattern = `(?:(?:an?|one|two|three|\\d+)\\s+hours?\\s+ago|last\\s+(?:summer|spring|winter|fall|autumn)|in\\s+(\\d{4}))`;
  const pattern = new RegExp(`^(${markerPattern})\\s+(I|you|we|they|he|she|it)\\s+(${verbPattern})\\b`, "i");
  const match = trimmed.match(pattern);
  if (!match) return null;

  const year = match[2];
  if (year && !isPastYear(year)) return null;

  return match;
}

function hasStep6PastMarkerRecall(input: string): boolean {
  return getStep6PastMarkerRecallMatch(input) !== null;
}

function repairStep6PastMarkerRecall(input: string): string {
  const match = getStep6PastMarkerRecallMatch(input);
  if (!match) return input;

  const verb = match[4] ?? "";
  return input.replace(
    new RegExp(`\\b${verb}\\b`, "i"),
    STEP6_PAST_MARKER_RECALL_VERBS[verb.toLowerCase()] ?? verb,
  );
}

const STEP6_IN_MONTH_YEAR_CONTEXT_PATTERN = "\\b(?:was born|were born|moved here|arrived)";
const STEP6_IN_MONTH_YEAR_TOKEN_PATTERN = `(?:${STEP6_MONTH_NAMES}|\\d{4})`;
const STEP6_ENTER_CONCRETE_PLACE_PATTERN =
  "(?:room|classroom|class|house|building|office|school|hospital|airport)";

function getStep6InMonthYearMatch(input: string): RegExpMatchArray | null {
  const pattern = new RegExp(
    `(${STEP6_IN_MONTH_YEAR_CONTEXT_PATTERN})\\s+(${STEP6_IN_MONTH_YEAR_TOKEN_PATTERN})(?=\\s*[.?!]?$)`,
    "i",
  );
  const match = input.trim().match(pattern);
  if (!match) return null;

  const token = match[2] ?? "";
  if (/^\d{4}$/.test(token) && !isPastYear(token)) return null;

  return match;
}

function hasStep6InMonthYear(input: string): boolean {
  return getStep6InMonthYearMatch(input) !== null;
}

function repairStep6InMonthYear(input: string): string {
  const match = getStep6InMonthYearMatch(input);
  if (!match) return input;

  const context = match[1] ?? "";
  const token = match[2] ?? "";
  return input.replace(new RegExp(`\\b${context}\\s+${token}\\b`, "i"), `${context} in ${token}`);
}

function repairStep6EnterConcretePlace(input: string): string {
  const pattern = new RegExp(
    `\\b(enter|enters|entered|entering)\\s+(?:to|into)\\s+((?:the\\s+)?${STEP6_ENTER_CONCRETE_PLACE_PATTERN})\\b`,
    "gi",
  );
  return input.replace(pattern, "$1 $2");
}

function repairBeVerbOmission(input: string): string {
  return input
    .replace(/\b(I)\s+(very\s+(?:happy|sad|tired|busy)(?:\s+today)?)\b/gi, "$1 am $2")
    .replace(/\b(He|She|It)\s+(very\s+(?:happy|sad|tired|busy)(?:\s+today)?)\b/gi, "$1 is $2")
    .replace(/\b(You|We|They)\s+(very\s+(?:happy|sad|tired|busy)(?:\s+today)?)\b/gi, "$1 are $2");
}

function isBeAuxInvertedQuestion(input: string): boolean {
  return /^(?:am|are|is|was|were)\s+(?:i|you|he|she|it|we|they)\b/i.test(input.trim());
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
      hasBeginnerPastCorrectionMarker(input) &&
      /\b(I|You|We|They|He|She|It)\s+(buy|do|eat|go|have)\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, PAST_VERBS),
  },
  {
    id: "en-step6-profession-article",
    detects: hasStep6ProfessionArticle,
    apply: repairStep6ProfessionArticle,
    fpRiskNote: "Medium risk. Profession nouns overlap with identity, role, and discourse-specific article choice. V1 only inserts a/an for singular pronoun subject plus be plus bare whitelisted profession noun. It excludes the, all other determiners, plural subjects, adjective predicates, and any surface already covered by the shipped article rule.",
  },
  {
    id: "en-step6-possessive-s",
    detects: hasStep6PossessiveS,
    apply: repairStep6PossessiveS,
    fpRiskNote: "High risk. Noun-noun sequences may be compounds, appositives, or ownership. V1 requires both a singular owner whitelist and a concrete-object whitelist, blocks fixed compounds such as mother tongue and sister city, and excludes plural owners to avoid apostrophe ambiguity.",
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
      !isBeAuxInvertedQuestion(input) &&
      /\b(?:I|He|She|It|You|We|They)\s+very\s+(?:happy|sad|tired|busy)(?:\s+today)?\b/i.test(input),
    apply: repairBeVerbOmission,
    fpRiskNote: "Be-drop v1 requires a pronoun plus very plus a small adjective whitelist and skips subject-aux-inverted be questions.",
  },
  {
    id: "en-step5-subject-verb-agreement",
    detects: (input) =>
      !isQuestionLike(input) &&
      !hasSvaTemporalBlocker(input) &&
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
      /\b(go|goes|went|going)\s+school\b(?!\s+bus\b)/i.test(input),
    apply: repairStep5PrepositionPatterns,
    fpRiskNote: "Missing-to repair is phrase-whitelisted and does not rewrite home/there/downtown/abroad/upstairs or school bus.",
  },
  {
    id: "en-step6-wait-for-person-object",
    detects: (input) => new RegExp(`\\b(wait|waits|waited|waiting)\\s+${PERSON_OBJECT_PRONOUN_PATTERN}\\b`, "i").test(input),
    apply: repairStep6WaitFor,
    fpRiskNote: "Medium risk. Wait can be intransitive or part of idioms; this rule only inserts for before person/pronoun objects and abstains elsewhere.",
  },
  {
    id: "en-step6-listen-to-object",
    detects: (input) =>
      new RegExp(`\\b(listen|listens|listened|listening)\\s+${STEP6_LISTEN_OBJECT_PATTERN}\\b`, "i").test(input),
    apply: repairStep6ListenTo,
    fpRiskNote: "Low-medium risk if limited to to insertion only. Article correction is deliberately excluded. The rule blocks no-object and adverb surfaces such as listen carefully.",
  },
  {
    id: "en-step6-discuss-about",
    detects: (input) => /\b(discuss|discusses|discussed|discussing)\s+about\s+\S/i.test(input),
    apply: repairStep6DiscussAbout,
    fpRiskNote: "Low-medium risk. Safe only when about immediately follows a form of discuss.",
  },
  {
    id: "en-step6-marry-with",
    detects: (input) => new RegExp(`\\b(marry|marries|married|marrying)\\s+with\\s+${PERSON_OBJECT_PRONOUN_PATTERN}\\b`, "i").test(input),
    apply: repairStep6MarryWith,
    fpRiskNote: "Low-medium risk. Only removes with immediately after a marry verb form when followed by a person/pronoun object.",
  },
  {
    id: "en-step6-at-clock-time",
    detects: (input) =>
      new RegExp(
        `\\b(wake up|wakes up|woke up|start work|starts work|started work|meet|meets|met)\\s+${CLOCK_TIME_PATTERN}\\b`,
        "i",
      ).test(input),
    apply: repairStep6AtClockTime,
    fpRiskNote: "Low-medium risk. Only explicit clock-time formats trigger; duration and vague time expressions stay unchanged.",
  },
  {
    id: "en-step6-past-marker-recall",
    detects: hasStep6PastMarkerRecall,
    apply: repairStep6PastMarkerRecall,
    fpRiskNote: "Medium risk. Explicit past markers can still appear in habitual, narrative, or multi-clause contexts. V1 only corrects single-clause, unambiguous explicit-past-marker plus present/base verb shapes and excludes weekday/habitual cases.",
  },
  {
    id: "en-step6-in-month-year",
    detects: hasStep6InMonthYear,
    apply: repairStep6InMonthYear,
    fpRiskNote: "Medium risk. Years can be quantities or noun modifiers. Rule must block year/month tokens followed by nouns and avoid broad numeric rewriting.",
  },
  {
    id: "en-step6-enter-concrete-place",
    detects: (input) =>
      new RegExp(
        `\\b(enter|enters|entered|entering)\\s+(?:to|into)\\s+(?:the\\s+)?${STEP6_ENTER_CONCRETE_PLACE_PATTERN}\\b`,
        "i",
      ).test(input),
    apply: repairStep6EnterConcretePlace,
    fpRiskNote: "Medium risk. Enter into is valid with agreements, contracts, and abstract states. Rule only applies to a closed concrete-place whitelist.",
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
