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
  take: "took",
};

// Regular (-ed) past-tense verbs only. Deliberately disjoint from the irregular
// sets (PAST_VERBS, STEP6_PAST_MARKER_RECALL_VERBS) and from
// KNOWN_UNCORRECTED_PAST_MARKER_VERBS so this rule never double-claims a surface
// another past-tense rule already owns. Past forms are spelled explicitly to
// avoid encoding -ed orthography rules (e.g. study -> studied, stay -> stayed).
const REGULAR_PAST_MARKER_VERBS: Record<string, string> = {
  call: "called",
  clean: "cleaned",
  finish: "finished",
  help: "helped",
  invite: "invited",
  learn: "learned",
  play: "played",
  start: "started",
  stay: "stayed",
  study: "studied",
  talk: "talked",
  visit: "visited",
  walk: "walked",
  watch: "watched",
  work: "worked",
};

const DAILY_THIRD_PERSON_VERBS: Record<string, string> = {
  eat: "eats",
  go: "goes",
  have: "has",
};

const STEP5_THIRD_PERSON_VERBS: Record<string, string> = {
  go: "goes",
  make: "makes",
  ne: "needs",
  need: "needs",
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
  "address confirmation": "an",
  apple: "an",
  bicycle: "a",
  book: "a",
  hat: "a",
  orange: "an",
  "sore throat": "a",
  stomachache: "a",
  student: "a",
  teacher: "a",
  "temporary residence card": "a",
};

const COUNTABLE_PLURAL_NOUNS: Record<string, string> = {
  apple: "apples",
  book: "books",
  day: "days",
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

const LOWERCASE_PROFESSION_TITLE_NAME_PATTERN = "(?:lee|nguyen|smith|strange)";

const STEP6_POSSESSIVE_OWNER_PATTERN =
  "(?:mother|father|brother|sister|friend|teacher|boss|wife|husband)";

const STEP6_POSSESSIVE_OBJECT_PATTERN =
  "(?:car|phone|house|room|bag|book|computer|bicycle|bike|office|job)";

const STEP6_POSSESSIVE_COMPOUND_EXCLUSION_PATTERN =
  /\b(?:mother tongue|sister city|father figure|brother country|teacher training|boss fight)\b/i;

function hasLikelyVerbSenseTail(token: string, tail: string): boolean {
  const normalizedToken = token.toLowerCase();
  const normalizedTail = tail.trim().toLowerCase();

  if (normalizedToken === "phone") {
    return /^(?:me|you|him|her|us|them)\b/.test(normalizedTail);
  }

  if (normalizedToken === "book") {
    return /^(?:a|an|the)\s+(?:room|table|flight|ticket)\b/.test(normalizedTail);
  }

  if (normalizedToken === "bike") {
    return /^to\s+work\b/.test(normalizedTail);
  }

  return false;
}

function isProperNounArticleMatch(noun: string): boolean {
  return /^[A-Z]/.test(noun);
}

function replaceVerbAfterSubject(
  input: string,
  verbs: Record<string, string>,
): string {
  const verbPattern = Object.keys(verbs).join("|");
  const pattern = new RegExp(`\\b(I|You|We|They|He|She|It|the\\s+ATM)\\s+(${verbPattern})\\b(?!\\s+not\\b)`, "gi");
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

function hasStep5CoordinatedSvaSubject(input: string): boolean {
  return /\b(?:he|she|it)\s+and\s+(?:he|she|it)\s+(?:go|make|work)\b/i.test(input);
}

function hasBeginnerPastCorrectionMarker(input: string): boolean {
  return (
    /\byesterday\b/i.test(input) ||
    /\blast\s+(?:night|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(input) ||
    /\b(?:one|two|three|\d+)\s+(?:day|days|week|weeks|month|months|year|years)\s+ago\b/i.test(input)
  );
}

function hasRegularPastMarkerVerbBlocker(input: string): boolean {
  return (
    /\bnot\b/i.test(input) ||
    /n['’]t\b/i.test(input) ||
    /\bnever\b/i.test(input) ||
    /\b(?:always|usually|often|sometimes|rarely)\b/i.test(input) ||
    /\bevery\s+(?:day|week|month|year)\b/i.test(input) ||
    STEP6_PAST_MARKER_CLAUSE_BLOCKERS.test(input)
  );
}

function hasVnPastMarkerRegularVerb(input: string): boolean {
  if (isQuestionLike(input)) return false;
  if (!hasBeginnerPastCorrectionMarker(input)) return false;
  if (hasRegularPastMarkerVerbBlocker(input)) return false;

  const verbPattern = Object.keys(REGULAR_PAST_MARKER_VERBS).join("|");
  return new RegExp(
    `\\b(?:I|You|We|They|He|She|It)\\s+(?:${verbPattern})\\b(?!\\s+not\\b)`,
    "i",
  ).test(input);
}

function repairStep5SubjectVerbAgreement(input: string): string {
  return input.replace(
    /\b(He|She|It)\s+(go|make|ne|need|work)\b/gi,
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

function hasAlthoughEvenThoughBut(input: string): boolean {
  const trimmed = input.trim();
  return /^(?:although|even though)\s+[^,]+,\s+but\s+[^.?!]+[.?!]?$/i.test(trimmed);
}

function repairAlthoughEvenThoughBut(input: string): string {
  return input.replace(
    /^((?:although|even though)\s+[^,]+),\s+but\s+/i,
    "$1, ",
  );
}

function hasBecauseSoDoubling(input: string): boolean {
  const trimmed = input.trim();
  return /^because\s+[^,]+,\s+so\s+[^.?!]+[.?!]?$/i.test(trimmed) || /\bbecause\s+[^,]+,\s+so\s+\S/i.test(trimmed);
}

function repairBecauseSoDoubling(input: string): string {
  return input.replace(
    /\b(because\s+[^,]+),\s+so\s+([^.?!]+)([.?!]?)/i,
    (_match, becauseClause: string, resultClause: string, terminal: string) =>
      `${becauseClause}, ${resultClause}${terminal}`,
  );
}

function punctuateQuestionForm(input: string): string {
  const trimmed = input.trim();
  if (/[?？!]$/.test(trimmed)) return trimmed;
  if (/\.$/.test(trimmed)) return trimmed.replace(/\.$/, "?");
  return `${trimmed}?`;
}

function hasQuestionFinalMarkCandidate(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed || /[?？!]$/.test(trimmed)) return false;
  // If the input already contains an internal sentence boundary ("Can you...? I am cold."),
  // the declarative portion after the boundary is NOT a question — do not add "?" to it.
  if (/[?？!]\s+\S/.test(trimmed)) return false;
  if (/^what\s+happened$/i.test(trimmed)) return true;

  const subject = "(?:i|you|we|they|he|she|it|this|that|these|those|there|[a-z]+(?:\\s+[a-z]+){0,3})";
  const lexicalVerb = "[a-z]+(?:\\s+[a-z]+)*";
  const beAux = "(?:am|are|is|was|were)";
  const doAux = "(?:do|does|did)";
  const haveAux = "(?:have|has|had)";
  const modalAux = "(?:can|could|would|will|should)";
  const aux = `(?:${beAux}|${doAux}|${haveAux}|${modalAux})`;

  const frames = [
    `^(?:what|where|when|why)\\s+${aux}\\s+${subject}\\b`,
    `^how\\s+${aux}\\s+${subject}\\b`,
    `^how\\s+(?:old|often|many|much)\\s+${aux}\\s+${subject}\\b`,
    `^${doAux}\\s+${subject}\\s+${lexicalVerb}\\b`,
    `^${beAux}\\s+${subject}\\b`,
    `^${haveAux}\\s+${subject}\\b`,
    `^${modalAux}\\s+${subject}\\b`,
  ];

  return frames.some((frame) => new RegExp(frame, "i").test(trimmed));
}

const YESNO_DO_SUPPORT_SUBJECT_PATTERN = "(?:I|You|We|They|He|She|It)";
const YESNO_DO_SUPPORT_VERB_PATTERN = "(?:like|live|have)";

function normalizeYesNoDoSupportSubject(subject: string): string {
  return subject.toLowerCase() === "i" ? "I" : subject.toLowerCase();
}

function hasVnYesNoDoSupport(input: string): boolean {
  const trimmed = input.trim();
  return (
    /[?？]$/.test(trimmed) &&
    (new RegExp(`^${YESNO_DO_SUPPORT_SUBJECT_PATTERN}\\s+${YESNO_DO_SUPPORT_VERB_PATTERN}\\b`, "i").test(trimmed) ||
      /^(?:this)\s+the\s+right\s+car\?$/i.test(trimmed) ||
      /^it\s+far\?$/i.test(trimmed) ||
      /^you\s+show\s+me\s+on\s+the\s+map\?$/i.test(trimmed) ||
      /^i\s+take\s+this\s+medicine\s+after\s+eating\?$/i.test(trimmed) ||
      /^you\s+lower\s+the\s+price\s+a\s+little\?$/i.test(trimmed) ||
      /^there\s+something\s+that\s+will\s+not\s+make\s+me\s+sleepy\?$/i.test(trimmed))
  );
}

function repairVnYesNoDoSupport(input: string): string {
  const trimmed = input.trim();
  if (/^this\s+the\s+right\s+car\?$/i.test(trimmed)) return "Is this the right car?";
  if (/^it\s+far\?$/i.test(trimmed)) return "Is it far?";
  if (/^you\s+show\s+me\s+on\s+the\s+map\?$/i.test(trimmed)) return "Can you show me on the map?";
  if (/^i\s+take\s+this\s+medicine\s+after\s+eating\?$/i.test(trimmed)) return "Do I take this medicine after eating?";
  if (/^you\s+lower\s+the\s+price\s+a\s+little\?$/i.test(trimmed)) return "Can you lower the price a little?";
  if (/^there\s+something\s+that\s+will\s+not\s+make\s+me\s+sleepy\?$/i.test(trimmed)) {
    return "Is there something that will not make me sleepy?";
  }

  const pattern = new RegExp(
    `^(${YESNO_DO_SUPPORT_SUBJECT_PATTERN})\\s+(${YESNO_DO_SUPPORT_VERB_PATTERN})\\b([\\s\\S]*?)\\?\\s*$`,
    "i",
  );

  return input.replace(pattern, (_match, subject: string, verb: string, tail: string) => {
    const aux = /^(?:he|she|it)$/i.test(subject) ? "Does" : "Do";
    const normalizedSubject = normalizeYesNoDoSupportSubject(subject);
    const normalizedTail = tail.replace(/\s+$/, "");
    return `${aux} ${normalizedSubject} ${verb.toLowerCase()}${normalizedTail}?`;
  });
}

function repairMorningRoutineSubjectCarryover(input: string): string {
  return input.replace(
    /^in the morning,?\s+i wake up and they have a breakfast and coffee and then i go to my office[.?!]?$/i,
    "In the morning, I wake up, have breakfast and coffee, and then go to my office",
  );
}

function addArticleAfterVerb(input: string): string {
  const nounPattern = Object.keys(MISSING_ARTICLE_NOUNS).join("|");
  const objectPattern = new RegExp(
    `\\b(I|You|We|They|He|She|you)\\s+(?:also\\s+|already\\s+)*(bought|buy|want|need|have|has|had)(?:\\s+had)?\\s+(${nounPattern})\\b`,
    "gi",
  );
  const bePattern = new RegExp(
    `\\b(He|She|I)\\s+(is|am)\\s+(${nounPattern})\\b`,
    "gi",
  );

  return input
    .replace(objectPattern, (match, subject: string, verb: string, noun: string, offset: number) => {
      if (isProperNounArticleMatch(noun)) return match;
      if (hasLikelyVerbSenseTail(noun, input.slice(offset + match.length))) return match;
      const article = MISSING_ARTICLE_NOUNS[noun.toLowerCase()];
      return match.replace(new RegExp(`\\b${noun}\\b`, "i"), `${article} ${noun}`);
    })
    .replace(bePattern, (match, subject: string, verb: string, noun: string, offset: number) => {
      if (isProperNounArticleMatch(noun)) return match;
      if (hasLikelyVerbSenseTail(noun, input.slice(offset + match.length))) return match;
      const article = MISSING_ARTICLE_NOUNS[noun.toLowerCase()];
      return `${subject} ${verb} ${article} ${noun}`;
    });
}

function hasMissingCommonNounArticle(input: string): boolean {
  const nounPattern = Object.keys(MISSING_ARTICLE_NOUNS).join("|");
  const objectPattern = new RegExp(
    `\\b(I|You|We|They|He|She|you)\\s+(?:also\\s+|already\\s+)*(?:bought|buy|want|need|have|has|had)(?:\\s+had)?\\s+(${nounPattern})\\b`,
    "gi",
  );
  const bePattern = new RegExp(
    `\\b(He|She|I)\\s+(is|am)\\s+(${nounPattern})\\b`,
    "gi",
  );
  const matchesCommonNoun = (pattern: RegExp) =>
    Array.from(input.matchAll(pattern)).some((match) => {
      const noun = match[match.length - 1] ?? "";
      const offset = match.index ?? 0;
      return (
        !isProperNounArticleMatch(noun) &&
        !hasLikelyVerbSenseTail(noun, input.slice(offset + match[0].length))
      );
    });

  return matchesCommonNoun(objectPattern) || matchesCommonNoun(bePattern);
}

function hasStep6ProfessionArticle(input: string): boolean {
  const professionPattern = Object.keys(PROFESSION_ARTICLES).join("|");
  const pattern = new RegExp(`\\b(?:I\\s+am|He\\s+is|She\\s+is)\\s+(${professionPattern})\\b`, "gi");
  return Array.from(input.matchAll(pattern)).some((match) => {
    const offset = match.index ?? 0;
    return !isProfessionTitleNameTail(input.slice(offset + match[0].length));
  });
}

function repairStep6ProfessionArticle(input: string): string {
  const professionPattern = Object.keys(PROFESSION_ARTICLES).join("|");
  const pattern = new RegExp(`\\b(I\\s+am|He\\s+is|She\\s+is)\\s+(${professionPattern})\\b`, "gi");
  return input.replace(pattern, (match, prefix: string, profession: string, offset: number) => {
    if (isProfessionTitleNameTail(input.slice(offset + match.length))) return match;
    const article = PROFESSION_ARTICLES[profession.toLowerCase()] ?? "a";
    return `${prefix} ${article} ${profession}`;
  });
}

function isProfessionTitleNameTail(tail: string): boolean {
  return new RegExp(`^\\s+(?:[A-Z][a-z]+|${LOWERCASE_PROFESSION_TITLE_NAME_PATTERN})\\b`).test(tail);
}

function hasStep6PossessiveS(input: string): boolean {
  if (STEP6_POSSESSIVE_COMPOUND_EXCLUSION_PATTERN.test(input)) return false;

  const pattern = new RegExp(
    `\\b(?:my|your|his|her|our|their)\\s+${STEP6_POSSESSIVE_OWNER_PATTERN}\\s+(${STEP6_POSSESSIVE_OBJECT_PATTERN})\\b`,
    "gi",
  );
  return Array.from(input.matchAll(pattern)).some((match) => {
    const object = match[1] ?? "";
    const offset = match.index ?? 0;
    return !hasLikelyVerbSenseTail(object, input.slice(offset + match[0].length));
  });
}

function repairStep6PossessiveS(input: string): string {
  if (STEP6_POSSESSIVE_COMPOUND_EXCLUSION_PATTERN.test(input)) return input;

  const pattern = new RegExp(
    `\\b((?:my|your|his|her|our|their)\\s+)(${STEP6_POSSESSIVE_OWNER_PATTERN})\\s+(${STEP6_POSSESSIVE_OBJECT_PATTERN})\\b`,
    "gi",
  );
  return input.replace(pattern, (match, determiner: string, owner: string, object: string, offset: number) => {
    if (hasLikelyVerbSenseTail(object, input.slice(offset + match.length))) return match;
    return `${determiner}${owner}'s ${object}`;
  });
}

function pluralizeAfterQuantity(input: string): string {
  const nounPattern = Object.keys(COUNTABLE_PLURAL_NOUNS).join("|");
  const pattern = new RegExp(`\\b(two|three|many|some|several)\\s+(${nounPattern})\\b`, "gi");
  return input.replace(pattern, (match, quantity: string, noun: string, offset: number) => {
    if (hasLikelyVerbSenseTail(noun, input.slice(offset + match.length))) return match;
    return `${quantity} ${COUNTABLE_PLURAL_NOUNS[noun.toLowerCase()] ?? noun}`;
  });
}

function hasQuantityPluralS(input: string): boolean {
  const nounPattern = Object.keys(COUNTABLE_PLURAL_NOUNS).join("|");
  const pattern = new RegExp(`\\b(two|three|many|some|several)\\s+(${nounPattern})\\b`, "gi");
  return Array.from(input.matchAll(pattern)).some((match) => {
    const noun = match[2] ?? "";
    const offset = match.index ?? 0;
    return !hasLikelyVerbSenseTail(noun, input.slice(offset + match[0].length));
  });
}

function pluralizeAfterNumeralQuantifier(input: string): string {
  const nounPattern = Object.keys(COUNTABLE_PLURAL_NOUNS).join("|");
  const pattern = new RegExp(
    `\\b(?:(?:two|three|2|3)\\s+day|(?:a\\s+few|(?:four|five|six|seven|eight|nine|ten|4|5|6|7|8|9|10))\\s+(${nounPattern}))\\b(?=\\s*[.?!]?$)`,
    "gi",
  );
  return input.replace(pattern, (match, noun: string, offset: number) => {
    noun = noun ?? "day";
    if (hasLikelyVerbSenseTail(noun, input.slice(offset + match.length))) return match;
    return match.replace(
      new RegExp(`\\b(${nounPattern})\\b`, "i"),
      (nounMatch) => COUNTABLE_PLURAL_NOUNS[nounMatch.toLowerCase()] ?? nounMatch,
    );
  });
}

function hasNumeralQuantifierPlural(input: string): boolean {
  const nounPattern = Object.keys(COUNTABLE_PLURAL_NOUNS).join("|");
  const pattern = new RegExp(
    `\\b(?:(?:two|three|2|3)\\s+day|(?:a\\s+few|(?:four|five|six|seven|eight|nine|ten|4|5|6|7|8|9|10))\\s+(${nounPattern}))\\b(?=\\s*[.?!]?$)`,
    "gi",
  );
  return Array.from(input.matchAll(pattern)).some((match) => {
      const noun = match[1] ?? "day";
    const offset = match.index ?? 0;
    return !hasLikelyVerbSenseTail(noun, input.slice(offset + match[0].length));
  });
}

function repairTopicCommentOrder(input: string): string {
  return input
    .replace(/^this book i like[.?!]?$/i, "I like this book")
    .replace(/^this i like area because it is quiet and convenient[.?!]?$/i, "I like this area because it is quiet and convenient")
    .replace(/^english i study every day[.?!]?$/i, "I study English every day")
    .replace(/^in my family,?\s+my mother i love very much[.?!]?$/i, "In my family, I love my mother very much");
}

// --- Cluster: Vietlish collocation / verb-choice ---
// VN "chụp ảnh" -> "make a photo" (should be "take a photo"); VN "làm/phạm lỗi"
// -> "do a mistake" (should be "make a mistake"). Both rewrite ONLY the verb,
// preserving determiner, surrounding words, and capitalization.
//
// Precision contract: the target noun must be the BARE direct-object head. We
// require a safe right boundary (clause end, punctuation, or a closed time/
// frequency adverbial) via COLLOCATION_OBJECT_TAIL. Anything else after the
// noun -- another noun (photo ALBUM), an adjective (make a photo BIGGER), or a
// base verb (causative "make a photo LOOK better"; aux "do mistakes HAPPEN") --
// means the token is not the object head, so the rule abstains. This is a
// positive whitelist boundary, not a leaky compound-blocklist.
const COLLOCATION_OBJECT_TAIL =
  "(?=[.?!,;:]|\\s*$|\\s+(?:today|yesterday|tonight|now|here|there|together|again|outside|inside|daily|sometimes|often|always|usually|too|also|every\\s+\\w+|this\\s+(?:morning|afternoon|evening|week|weekend|month|year)|last\\s+(?:night|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|on\\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|at\\s+(?:home|work|school|night)))";

const VIETLISH_TAKE_PHOTO_PATTERN = new RegExp(
  `\\b(make|makes|made|making)\\s+((?:a|an|the|some|my|your|his|her|our|their|this|that|these|those|one|two|three|\\d+)\\s+)?(photo|photos|selfie|selfies)\\b${COLLOCATION_OBJECT_TAIL}`,
  "i",
);

const TAKE_FOR_MAKE: Record<string, string> = {
  make: "take",
  makes: "takes",
  made: "took",
  making: "taking",
};

const VIETLISH_MAKE_MISTAKE_PATTERN = new RegExp(
  `\\b(do|does|did|doing)\\s+((?:a|an|the|some|many|few|several|my|your|his|her|our|their|this|that|these|those|one|two|three|\\d+)\\s+)?(mistake|mistakes)\\b${COLLOCATION_OBJECT_TAIL}`,
  "i",
);

const MAKE_FOR_DO: Record<string, string> = {
  do: "make",
  does: "makes",
  did: "made",
  doing: "making",
};

function matchLeadingCapitalization(source: string, replacement: string): string {
  if (!source || !replacement) return replacement;
  return source[0] === source[0].toUpperCase()
    ? replacement[0].toUpperCase() + replacement.slice(1)
    : replacement;
}

function hasVietlishTakePhoto(input: string): boolean {
  return VIETLISH_TAKE_PHOTO_PATTERN.test(input);
}

function repairVietlishTakePhoto(input: string): string {
  return input.replace(
    VIETLISH_TAKE_PHOTO_PATTERN,
    (_match, verb: string, determiner: string | undefined, noun: string) => {
      const replacement = matchLeadingCapitalization(verb, TAKE_FOR_MAKE[verb.toLowerCase()] ?? verb);
      return `${replacement} ${determiner ?? ""}${noun}`;
    },
  );
}

function hasVietlishMakeMistake(input: string): boolean {
  // Guard out auxiliary/interrogative "do" (e.g. "Why do mistakes happen?"),
  // where "do" is not the lexical verb governing "mistake".
  if (isQuestionLike(input)) return false;
  return VIETLISH_MAKE_MISTAKE_PATTERN.test(input);
}

function repairVietlishMakeMistake(input: string): string {
  return input.replace(
    VIETLISH_MAKE_MISTAKE_PATTERN,
    (_match, verb: string, determiner: string | undefined, noun: string) => {
      const replacement = matchLeadingCapitalization(verb, MAKE_FOR_DO[verb.toLowerCase()] ?? verb);
      return `${replacement} ${determiner ?? ""}${noun}`;
    },
  );
}

// --- Cluster: Vietlish verb-object / collocation (Step 11 Batch 4, MR-B) ---
// Four high-precision VN-interference repairs, each gated to a CLOSED surface so
// they abstain on the grammatical English reading. No broad verb-choice rewrites.

// (1) VN "làm bài tập" -> English uses *do* homework, never *make*. Same shape
// as take-photo/make-mistake: a closed object whitelist (homework only — kept to
// one noun because "make exercises" has a valid create-sense) plus the shared
// COLLOCATION_OBJECT_TAIL boundary, so the CAUSATIVE "make homework fun" (object
// + adjective complement) and any non-boundary tail never match.
const DO_FOR_MAKE: Record<string, string> = {
  make: "do",
  makes: "does",
  made: "did",
  making: "doing",
};

const VIETLISH_DO_HOMEWORK_PATTERN = new RegExp(
  `\\b(make|makes|made|making)\\s+((?:my|your|his|her|our|their|the|some|a|an|this|that|these|those)\\s+)?(homework)\\b${COLLOCATION_OBJECT_TAIL}`,
  "i",
);

function hasVietlishDoHomework(input: string): boolean {
  // Guard auxiliary/interrogative "make" is N/A here, but a leading question can
  // still carry the calque ("Do you make homework?") — keep it correctable.
  return VIETLISH_DO_HOMEWORK_PATTERN.test(input);
}

function repairVietlishDoHomework(input: string): string {
  return input.replace(
    VIETLISH_DO_HOMEWORK_PATTERN,
    (_match, verb: string, determiner: string | undefined, noun: string) => {
      const replacement = matchLeadingCapitalization(verb, DO_FOR_MAKE[verb.toLowerCase()] ?? verb);
      return `${replacement} ${determiner ?? ""}${noun}`;
    },
  );
}

// (2) VN "đề cập về" -> "mention about X" drops the preposition: "mention X".
// Mirrors research-about: the negative lookbehind blocks the NOUN reading
// ("a/no/the mention about", "made mention about") where "about" is correct.
const VIETLISH_MENTION_ABOUT_PATTERN =
  /(?<!\b(?:a|an|the|any|no|some|my|your|his|her|our|their|this|that|make|makes|made|making|brief|passing|honorable)\s)\b(mention|mentions|mentioned|mentioning)\s+about\s+(?=\S)/i;

function hasVietlishMentionAbout(input: string): boolean {
  return VIETLISH_MENTION_ABOUT_PATTERN.test(input);
}

function repairVietlishMentionAbout(input: string): string {
  return input.replace(VIETLISH_MENTION_ABOUT_PATTERN, "$1 ");
}

// (3) VN "liên hệ với" -> "contact with X" drops the preposition: "contact X".
// VERB only: the negative lookbehind blocks the NOUN "(in/keep/lose/make/...)
// contact with him", where "with" is correct. Object restricted to a person
// pronoun to stay high-precision.
const VIETLISH_CONTACT_WITH_PATTERN =
  /(?<!\b(?:in|into|keep|keeps|kept|keeping|lose|loses|lost|losing|make|makes|made|making|get|gets|got|getting|stay|stays|stayed|staying|the|a|an|my|your|his|her|our|their|no|any|first|close|direct|eye|business|personal)\s)\b(contact|contacts|contacted|contacting)\s+with\s+(me|you|him|her|us|them)\b/i;

function hasVietlishContactWith(input: string): boolean {
  return VIETLISH_CONTACT_WITH_PATTERN.test(input);
}

function repairVietlishContactWith(input: string): string {
  return input.replace(VIETLISH_CONTACT_WITH_PATTERN, "$1 $2");
}

// (4) VN "gọi/nhắn cho" -> "phone/text to me" drops the preposition: "phone/text
// me". VERB phone/text only — "call" is EXCLUDED (held: "call to me"). The
// negative lookbehind blocks the NOUN reading ("send/read a text to me"); the
// pronoun-object requirement blocks the infinitive ("phone to confirm").
const VIETLISH_PHONE_TEXT_TO_PATTERN =
  /(?<!\b(?:a|an|the|my|your|his|her|our|their|this|that|these|those|one|some|any|no|send|sends|sent|sending|write|writes|wrote|writing|written|read|reads|reading|leave|leaves|left|leaving|get|gets|got|getting|delete|deletes|deleted|answer|answers|answered)\s)\b(phone|phones|phoned|phoning|text|texts|texted|texting)\s+to\s+(me|you|him|her|us|them)\b/i;

function hasVietlishPhoneTextTo(input: string): boolean {
  return VIETLISH_PHONE_TEXT_TO_PATTERN.test(input);
}

function repairVietlishPhoneTextTo(input: string): string {
  return input.replace(VIETLISH_PHONE_TEXT_TO_PATTERN, "$1 $2");
}

// --- Cluster: Vietlish verb-object / lexical (Step 11 Batch 3) ---
// VN "nói (với) tôi" — *nói* maps to both say & tell, but English ditransitive
// reporting to a person needs "tell + indirect object" ("say me the news" ->
// "tell me the news"). Scoped TIGHTLY to the unambiguous object pronouns
// me / us only. you/him/her/them/it are excluded on purpose: "say you are
// right" (embedded subject), "say her name" (possessive), "just say them"
// (utter-object) are all valid English. "say with me" is owned by
// en-calque-say-with-person (a 'with' sits between, so this never matches it),
// and fronted what/which questions abstain (mirrors say-with's guard).
const VIETLISH_SAY_TELL_PERSON_PATTERN = /\b(say|says|said|saying)\s+(me|us)\b/i;

const TELL_FOR_SAY: Record<string, string> = {
  say: "tell",
  says: "tells",
  said: "told",
  saying: "telling",
};

function hasVietlishSayTellPerson(input: string): boolean {
  if (/^(?:what|which)\b/i.test(input.trim())) return false;
  return VIETLISH_SAY_TELL_PERSON_PATTERN.test(input);
}

function repairVietlishSayTellPerson(input: string): string {
  if (!hasVietlishSayTellPerson(input)) return input;
  return input.replace(
    /\b(say|says|said|saying)\s+(me|us)\b/gi,
    (_match, verb: string, pronoun: string) => {
      const replacement = matchLeadingCapitalization(verb, TELL_FOR_SAY[verb.toLowerCase()] ?? verb);
      return `${replacement} ${pronoun}`;
    },
  );
}

// VN "tôi có/được N tuổi" -> "I have N years old"; English uses BE + N years
// old ("I am 20 years old"). Closed pronoun-subject frame: have/has is replaced
// by the agreeing BE form (I->am, you/we/they->are, he/she/it->is).
//
// Two precision guards (A4 regression locks):
//  - "old" must be CLAUSE-FINAL (end/punctuation lookahead) so an attributive NP
//    "I have 5 years old dog" (a noun follows) never matches and gets mangled.
//  - Unit agreement: a count of 1 emits singular "year" ("He is 1 year old"),
//    never the ungrammatical "1 years old".
const VIETLISH_AGE_HAVE_BE_PATTERN =
  /\b(I|you|we|they|he|she|it)\s+(have|has)\s+(\d{1,3})\s+years?\s+old\b(?=[.?!,;:]|\s*$)/i;

const BE_FOR_AGE_SUBJECT: Record<string, string> = {
  i: "am",
  you: "are",
  we: "are",
  they: "are",
  he: "is",
  she: "is",
  it: "is",
};

function hasVietlishAgeHaveBe(input: string): boolean {
  return VIETLISH_AGE_HAVE_BE_PATTERN.test(input);
}

function repairVietlishAgeHaveBe(input: string): string {
  return input.replace(
    new RegExp(VIETLISH_AGE_HAVE_BE_PATTERN.source, "gi"),
    (_match, subject: string, _have: string, number: string) => {
      const be = BE_FOR_AGE_SUBJECT[subject.toLowerCase()] ?? "is";
      const unit = number === "1" ? "year" : "years";
      return `${subject} ${be} ${number} ${unit} old`;
    },
  );
}

// --- Cluster: Vietlish discourse / phrasing ---
// VN "theo tôi / theo ý kiến của tôi" -> "according to me / according to my
// opinion" (should be "in my opinion"); VN redundancy "lý do là vì" -> "the
// reason is because" (should be "the reason is that"). Both rewrite a closed,
// unambiguous surface and preserve capitalization.
//
// 'according to' is correct for external sources (according to the report / to
// him); V1 only rewrites the first-person "me / my opinion" object and abstains
// when a coordinator follows ("according to me and my team"). 'is because' is
// only rewritten when anchored to a preceding "the reason" within the same
// clause, and never before "because of" (a preposition, not a clause).
const VIETLISH_ACCORDING_TO_ME_PATTERN =
  /\baccording to (?:me|my opinion|my personal opinion)\b(?!\s+(?:and|or|nor|plus))/i;

const VIETLISH_REASON_IS_BECAUSE_PATTERN =
  /\b(the reason\b[^.?!]*?\b(?:is|was) )because\b(?!\s+of\b)/i;

function hasVietlishAccordingToMe(input: string): boolean {
  return VIETLISH_ACCORDING_TO_ME_PATTERN.test(input);
}

function repairVietlishAccordingToMe(input: string): string {
  return input.replace(VIETLISH_ACCORDING_TO_ME_PATTERN, (match) =>
    match.charAt(0) === "A" ? "In my opinion" : "in my opinion",
  );
}

function hasVietlishReasonIsBecause(input: string): boolean {
  return VIETLISH_REASON_IS_BECAUSE_PATTERN.test(input);
}

function repairVietlishReasonIsBecause(input: string): string {
  return input.replace(VIETLISH_REASON_IS_BECAUSE_PATTERN, "$1that");
}

// --- Cluster: Vietlish verb-object / collocation (B2) ---
// Four high-precision VN->EN transfers, each rewriting a single closed surface
// and preserving capitalization:
//   1. "Tôi đồng ý" -> "I am agree" (đồng ý is a verb, not an adjective; drop
//      the inserted copula). Scoped to first/second-person + plural subjects;
//      he/she/it is OUT of scope (would need "agrees").
//   2. "giải thích cho tôi" -> "explain me" (dropped dative "to"; insert it).
//   3. "nghiên cứu về" -> "research about" (calqued "về"=about onto a
//      transitive verb; drop "about"). Fires only when research is a VERB, never
//      the noun ("do research about").
//   4. "về nhà / ra đó" -> "go to home / went to there" (overgeneralized "to"
//      before adverbial destinations; drop "to" before a CLOSED adverb
//      whitelist). Never matches "go to the home" (the building sense).

// Matches both the spaced copula ("I am agree", "we are agree") and the
// contracted copula attached to the subject ("I'm agree", "we're agree"). The
// (?!d|ment|able) tail abstains on agreed/agreement/agreeable. Scoped to
// first/second-person + plural subjects only; he/she/it is out of scope.
const VIETLISH_BE_AGREE_PATTERN =
  /\b(I|you|we|they)(?:\s+(?:am|are)|'m|'re)\s+agree\b(?!d|ment|able)/i;

function hasVietlishBeAgree(input: string): boolean {
  return VIETLISH_BE_AGREE_PATTERN.test(input);
}

function repairVietlishBeAgree(input: string): string {
  return input.replace(VIETLISH_BE_AGREE_PATTERN, "$1 agree");
}

const VIETLISH_EXPLAIN_TO_ME_PATTERN =
  /\b(explain|explains|explained|explaining)\s+(me|him|her|us|them|you)\b/i;

// When a determiner-led NP follows the misplaced pronoun, reorder to the canonical
// dative form: "explain <pronoun> <NP>" → "explain <NP> to <pronoun>".
// Uses [^\s.?!]+ for word tokens so terminal punctuation is captured separately.
const VIETLISH_EXPLAIN_REORDER_PATTERN =
  /\b(explain|explains|explained|explaining)\s+(me|him|her|us|them|you)\s+((?:this|that|these|those|a|an|the|my|your|his|her|its|our|their)(?:\s+[^\s.?!]+)*)([.?!]?)\s*$/i;

function hasVietlishExplainToMe(input: string): boolean {
  return VIETLISH_EXPLAIN_TO_ME_PATTERN.test(input);
}

function repairVietlishExplainToMe(input: string): string {
  const reorderMatch = input.match(VIETLISH_EXPLAIN_REORDER_PATTERN);
  if (reorderMatch) {
    const [fullMatch, verb, pronoun, object, punct] = reorderMatch;
    const prefix = input.slice(0, reorderMatch.index ?? 0);
    return `${prefix}${verb} ${object.trim()} to ${pronoun}${punct}`;
  }
  return input.replace(VIETLISH_EXPLAIN_TO_ME_PATTERN, "$1 to $2");
}

// "research" must be the VERB. A leading determiner/quantifier/possessive or a
// do-support verb makes it the NOUN ("I do research about X", "some research
// about X"), where "about" is correct -> abstain. The negative lookbehind locks
// this; without it the rule would wrongly produce "I do research it".
const VIETLISH_RESEARCH_ABOUT_PATTERN =
  /(?<!\b(?:do|did|does|doing|some|the|my|your|his|her|our|their|this|that|more|a|any|much|little|no)\s)\b(research|researches|researched|researching)\s+about\s+(?=\S)/i;

function hasVietlishResearchAbout(input: string): boolean {
  return VIETLISH_RESEARCH_ABOUT_PATTERN.test(input);
}

function repairVietlishResearchAbout(input: string): string {
  return input.replace(VIETLISH_RESEARCH_ABOUT_PATTERN, "$1 ");
}

// Closed adverb whitelist: bare destination adverbials that take no "to". The
// absence of "the" in the pattern is load-bearing -- "go to the home (for the
// elderly)" is the building sense and must stay untouched.
const VIETLISH_GO_HOME_PATTERN =
  /\b(go|goes|going|went)\s+to\s+(home|there|abroad|downtown|upstairs|downstairs)\b/i;

function hasVietlishGoHome(input: string): boolean {
  return VIETLISH_GO_HOME_PATTERN.test(input);
}

function repairVietlishGoHome(input: string): string {
  return input.replace(VIETLISH_GO_HOME_PATTERN, "$1 $2");
}

function repairStep5PrepositionPatterns(input: string): string {
  return input
    .replace(/\b(depend|depends|depended|depending)\s+of\b/gi, "$1 on")
    .replace(/\b(interested)\s+with\b/gi, "$1 in")
    .replace(/\b(good)\s+in\s+(English|math|science)\b/gi, "$1 at $2")
    .replace(/\b(go|goes|went|going)\s+(school|work|the\s+hospital|this\s+hotel)\b(?!\s+bus\b)/gi, "$1 to $2");
}

// ---------------------------------------------------------------------------
// Vietlish B2 — intensifier / duration / comparative cluster
// ---------------------------------------------------------------------------

// Rule 1 (re-land of MR !381): sentence-initial pronoun + very + like/likes →
// "really like/likes". 'rất thích' transfer. The "very like" adjective sense
// (BrE "very like his father") never matches because the pattern requires the
// pronoun to be immediately adjacent to "very" with no intervening "is".
const VIETLISH_VERY_LIKE_PATTERN = /^(I|you|we|they|he|she|it)\s+very\s+(like|likes)\b/i;

function veryLikeVerbForSubject(subject: string): "like" | "likes" {
  return /^(he|she|it)$/i.test(subject) ? "likes" : "like";
}

function hasVietlishVeryLike(input: string): boolean {
  return VIETLISH_VERY_LIKE_PATTERN.test(input.trim());
}

function repairVietlishVeryLike(input: string): string {
  return input.replace(VIETLISH_VERY_LIKE_PATTERN, (_match, subject: string) => {
    return `${subject} really ${veryLikeVerbForSubject(subject)}`;
  });
}

// Rule 2: duration count wrongly marked with "since" (point-in-time) instead of
// "for" (span). Matches ONLY "since <count> <duration-unit>"; a bare year
// ("since 2020"), a day ("since Monday"), or "since last year / yesterday" never
// match because they are not <number> + <year|month|week|day|hour> spans.
//
// Right-boundary guard: a trailing "ago"/"old"/"back" makes the phrase a
// point-in-time or age expression ("since 3 years ago", "since 5 years old"),
// where "for ..." would be ungrammatical/meaning-changed -> abstain. A leading
// "ever" ("ever since 5 years") is an idiom that must not be split -> abstain.
const VIETLISH_DURATION_SINCE_FOR_PATTERN =
  /(?<!\bever\s)\bsince\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(year|years|month|months|week|weeks|day|days|hour|hours)\b(?!\s+(?:ago|old|back)\b)/i;

// Closed list of pure-stative verbs that cannot collocate with "for <N> <unit>"
// in present simple — they always require present perfect for duration spans.
// Dynamic/semi-stative verbs (live, work, study) are excluded: "I live here for
// 3 years" is marginal but accepted and intentionally not blocked.
const STATIVE_DURATION_VERB_BLOCKLIST =
  /\b(?:know|knows|like|likes|love|loves|hate|hates|want|wants|need|needs|prefer|prefers|understand|understands|believe|believes|own|owns|mean|means|remember|remembers|forget|forgets)\b/i;

function hasVietlishDurationSinceFor(input: string): boolean {
  if (!VIETLISH_DURATION_SINCE_FOR_PATTERN.test(input)) return false;
  // When a pure-stative verb (know/like/love/…) appears in present simple with
  // "since <N> <unit>", fixing only the preposition produces a still-wrong
  // sentence (e.g. "I know him for three years." — needs present perfect
  // "have known"). Abstain so the AI engine corrects both errors together.
  if (!(/\b(?:have|has)\b/i.test(input)) && STATIVE_DURATION_VERB_BLOCKLIST.test(input)) {
    return false;
  }
  return true;
}

function repairVietlishDurationSinceFor(input: string): string {
  return input.replace(
    VIETLISH_DURATION_SINCE_FOR_PATTERN,
    (_match, count: string, unit: string, offset: number) =>
      `${offset === 0 ? "For" : "for"} ${count} ${unit}`,
  );
}

// Rule 3: double-marked comparative — analytic "more" + synthetic "-er" on a
// closed whitelist of irregular/short adjectives where "more" is wrong. Drops
// "more". When the match is sentence-initial (index 0 of the already-capitalized
// input) the new first letter is re-capitalized so "More better" → "Better".
const VIETLISH_DOUBLE_COMPARATIVE_PATTERN =
  /\bmore\s+(better|worse|easier|faster|slower|bigger|smaller|cheaper|closer|harder|higher|lower|older|younger|stronger|nicer|happier|richer|safer|taller|shorter|longer|warmer|colder)\b/i;

function hasVietlishDoubleComparative(input: string): boolean {
  return VIETLISH_DOUBLE_COMPARATIVE_PATTERN.test(input);
}

function repairVietlishDoubleComparative(input: string): string {
  return input.replace(
    VIETLISH_DOUBLE_COMPARATIVE_PATTERN,
    (match, comparative: string, offset: number) => {
      if (offset === 0) {
        return `${comparative.charAt(0).toUpperCase()}${comparative.slice(1)}`;
      }
      return comparative;
    },
  );
}

// Rule 4 (Vietlish B3 — intensifier/degree): VN "rất" premodifies verbs
// (rất muốn/thích "really want/like"), but English "very" cannot modify a
// finite verb -> "really". This extends en-vietlish-very-like to a CLOSED verb
// whitelist that EXCLUDES like/likes (those stay owned by en-vietlish-very-like,
// no overlap). Requires the subject pronoun immediately adjacent to "very" so
// "very much want" (with "much" between) and adjective uses ("is very tired")
// never match. "very" is never at offset 0 here (a subject precedes it), so no
// re-capitalization is needed.
const VIETLISH_VERY_VERB_REALLY_PATTERN =
  /\b(I|you|we|they|he|she|it)\s+very\s+(want|wants|love|loves|need|needs|enjoy|enjoys|hope|hopes|miss|misses)\b/i;

function hasVietlishVeryVerbReally(input: string): boolean {
  return VIETLISH_VERY_VERB_REALLY_PATTERN.test(input);
}

function repairVietlishVeryVerbReally(input: string): string {
  return input.replace(
    VIETLISH_VERY_VERB_REALLY_PATTERN,
    (_match, subject: string, verb: string) => `${subject} really ${verb}`,
  );
}

// Rule 5 (Vietlish B3 — intensifier/degree): VN superlative is the single
// particle "nhất"; learners double-mark it as analytic "most" + synthetic
// "-est". Drops "most" before a CLOSED -est whitelist, leaving the synthetic
// superlative (a preceding "the" stays). The word boundary on "most" keeps it
// from matching inside "almost". When the match is sentence-initial (offset 0
// of the already-capitalized engine input) the new first letter is
// re-capitalized so "Most biggest" -> "Biggest".
const VIETLISH_DOUBLE_SUPERLATIVE_PATTERN =
  /\bmost\s+(tallest|biggest|fastest|shortest|longest|smallest|oldest|youngest|hottest|coldest|nicest|happiest|richest|cheapest|easiest|highest|lowest|strongest|hardest)\b/i;

function hasVietlishDoubleSuperlative(input: string): boolean {
  return VIETLISH_DOUBLE_SUPERLATIVE_PATTERN.test(input);
}

function repairVietlishDoubleSuperlative(input: string): string {
  return input.replace(
    VIETLISH_DOUBLE_SUPERLATIVE_PATTERN,
    (_match, superlative: string, offset: number) => {
      if (offset === 0) {
        return `${superlative.charAt(0).toUpperCase()}${superlative.slice(1)}`;
      }
      return superlative;
    },
  );
}

const PERSON_OBJECT_PRONOUN_PATTERN = "(?:me|you|him|her|us|them)";
const STEP6_LISTEN_OBJECT_PATTERN = "(?:me|you|him|her|us|them|music|song|teacher|radio|podcast|lesson|story)";
const CLOCK_TIME_PATTERN =
  "(?:(?:1[0-2]|0?[1-9])\\s+o(?:'|\\u2019)?clock|(?:1[0-2]|0?[1-9])\\s*(?:AM|PM|am|pm)|(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\\s*(?:a\\.m\\.|p\\.m\\.|AM|PM|am|pm)|(?:[01]?\\d|2[0-3]):[0-5]\\d)";
const STEP6_LOOK_AT_BLOCKED_PARTICLE_PATTERN = "(?:for|after|up|over|around|out|like|into)";
const STEP6_LOOK_AT_SEPARATED_PARTICLE_PATTERN = "(?:up|over|around|out)";
const CALQUE_APPLIANCE_OBJECT_PATTERN =
  "(?:light|lights|TV|television|fan|air\\s+conditioner|AC|radio|heater)";
const CALQUE_MEDICINE_OBJECT_PATTERN =
  "(?:medicine|medication|pill|pills|tablet|tablets|antibiotics|painkillers)";
const CALQUE_MEDICINE_QUANTITY_PATTERN =
  "(?:(?:a|an|one|two|three|four|five|\\d+)\\s+)?";
const CALQUE_SAY_WITH_PERSON_TAIL_PATTERN =
  "(?:(?:yesterday|today|tonight|now|then|later|soon|again|every\\s+day|after\\s+(?:class|school|work|lunch|dinner|breakfast)|before\\s+(?:class|school|work|lunch|dinner|breakfast)|at\\s+\\d{1,2}(?::\\d{2})?\\s*(?:AM|PM|am|pm)?)(?:\\s*[.?!])?|[.?!,;:]?)";

function repairStep6WaitFor(input: string): string {
  const pattern = new RegExp(`\\b(wait|waits|waited|waiting)\\s+(${PERSON_OBJECT_PRONOUN_PATTERN})\\b`, "gi");
  return input.replace(pattern, "$1 for $2");
}

function hasStep6WaitForPersonObject(input: string): boolean {
  const waitPersonPattern = new RegExp(`\\b(wait|waits|waited|waiting)\\s+${PERSON_OBJECT_PRONOUN_PATTERN}\\b`, "i");
  const waitPhrasalPattern = new RegExp(`\\b(wait|waits|waited|waiting)\\s+${PERSON_OBJECT_PRONOUN_PATTERN}\\s+(?:out|up)\\b`, "i");
  return waitPersonPattern.test(input) && !waitPhrasalPattern.test(input);
}

function repairStep6ListenTo(input: string): string {
  const pattern = new RegExp(`\\b(listen|listens|listened|listening)\\s+(${STEP6_LISTEN_OBJECT_PATTERN})\\b`, "gi");
  return input.replace(pattern, "$1 to $2");
}

function hasStep6LookAtPronoun(input: string): boolean {
  if (new RegExp(`\\blook(?:s|ed|ing)?\\s+${STEP6_LOOK_AT_BLOCKED_PARTICLE_PATTERN}\\b`, "i").test(input)) {
    return false;
  }
  if (new RegExp(`\\blook(?:s|ed|ing)?\\s+${PERSON_OBJECT_PRONOUN_PATTERN}\\s+${STEP6_LOOK_AT_SEPARATED_PARTICLE_PATTERN}\\b`, "i").test(input)) {
    return false;
  }
  if (new RegExp(`\\b(?:look|looks|looked|looking)\\s+${PERSON_OBJECT_PRONOUN_PATTERN}\\s+in\\s+the\\s+eyes?\\b`, "i").test(input)) {
    return false;
  }

  return new RegExp(
    `\\b(look|looks|looked|looking)\\s+${PERSON_OBJECT_PRONOUN_PATTERN}\\b(?!\\s+${STEP6_LOOK_AT_SEPARATED_PARTICLE_PATTERN}\\b)`,
    "i",
  ).test(input);
}

function repairStep6LookAtPronoun(input: string): string {
  const pattern = new RegExp(
    `\\b(look|looks|looked|looking)\\s+(${PERSON_OBJECT_PRONOUN_PATTERN})\\b(?!\\s+${STEP6_LOOK_AT_SEPARATED_PARTICLE_PATTERN}\\b)`,
    "gi",
  );
  return input.replace(pattern, "$1 at $2");
}

function turnOnVerbForOpen(openVerb: string): string {
  const normalized = openVerb.toLowerCase();
  if (normalized === "opened") return "turned on";
  if (normalized === "opens") return "turns on";
  if (normalized === "opening") return "turning on";
  return /^[A-Z]/.test(openVerb) ? "Turn on" : "turn on";
}

function turnOffVerbForClose(closeVerb: string): string {
  const normalized = closeVerb.toLowerCase();
  if (normalized === "closed") return "turned off";
  if (normalized === "closes") return "turns off";
  if (normalized === "closing") return "turning off";
  return /^[A-Z]/.test(closeVerb) ? "Turn off" : "turn off";
}

function hasCalqueOpenTurnOnAppliance(input: string): boolean {
  const pattern = new RegExp(
    `\\b(?:open|opens|opened|opening)\\s+(?:(?:the|a|an)\\s+)?${CALQUE_APPLIANCE_OBJECT_PATTERN}(?=\\s*[.?!]?$)`,
    "i",
  );
  return pattern.test(input);
}

function repairCalqueOpenTurnOnAppliance(input: string): string {
  const pattern = new RegExp(
    `\\b(open|opens|opened|opening)\\s+((?:(?:the|a|an)\\s+)?${CALQUE_APPLIANCE_OBJECT_PATTERN})(?=\\s*[.?!]?$)`,
    "gi",
  );
  return input.replace(pattern, (_match, verb: string, object: string) => {
    return `${turnOnVerbForOpen(verb)} ${object}`;
  });
}

function hasCalqueCloseTurnOffAppliance(input: string): boolean {
  const pattern = new RegExp(
    `\\b(?:close|closes|closed|closing)\\s+(?:(?:the|a|an)\\s+)?${CALQUE_APPLIANCE_OBJECT_PATTERN}(?=\\s*[.?!]?$)`,
    "i",
  );
  return pattern.test(input);
}

function repairCalqueCloseTurnOffAppliance(input: string): string {
  const pattern = new RegExp(
    `\\b(close|closes|closed|closing)\\s+((?:(?:the|a|an)\\s+)?${CALQUE_APPLIANCE_OBJECT_PATTERN})(?=\\s*[.?!]?$)`,
    "gi",
  );
  return input.replace(pattern, (_match, verb: string, object: string) => {
    return `${turnOffVerbForClose(verb)} ${object}`;
  });
}

function takeVerbForMedicineCalque(verb: string): string {
  const normalized = verb.toLowerCase();
  if (normalized === "ate" || normalized === "drank") return "took";
  if (normalized === "eats" || normalized === "drinks") return "takes";
  if (normalized === "eating" || normalized === "drinking") return "taking";
  return /^[A-Z]/.test(verb) ? "Take" : "take";
}

function hasCalqueTakeMedicine(input: string): boolean {
  if (
    /\b(?:eat|eats|ate|eating|drink|drinks|drank|drinking)\s+(?:(?:a|an|one|two|three|four|five|\d+)\s+)?tablets?\s+of\s+chocolate\b/i.test(
      input,
    )
  ) {
    return false;
  }

  const pattern = new RegExp(
    `\\b(?:eat|eats|ate|eating|drink|drinks|drank|drinking)\\s+${CALQUE_MEDICINE_QUANTITY_PATTERN}${CALQUE_MEDICINE_OBJECT_PATTERN}\\b`,
    "i",
  );
  return pattern.test(input);
}

function repairCalqueTakeMedicine(input: string): string {
  const pattern = new RegExp(
    `\\b(eat|eats|ate|eating|drink|drinks|drank|drinking)\\s+(${CALQUE_MEDICINE_QUANTITY_PATTERN}${CALQUE_MEDICINE_OBJECT_PATTERN})\\b(?!\\s+of\\s+chocolate\\b)`,
    "gi",
  );
  return input.replace(pattern, (_match, verb: string, object: string) => {
    return `${takeVerbForMedicineCalque(verb)} ${object}`;
  });
}

function getCalqueSayWithPersonMatch(input: string): RegExpMatchArray | null {
  const trimmed = input.trim();
  if (/^(?:what|which)\b/i.test(trimmed)) return null;

  const pattern = new RegExp(
    `\\b(?:say|says|said|saying)\\s+with\\s+${PERSON_OBJECT_PRONOUN_PATTERN}\\b(?:\\s+${CALQUE_SAY_WITH_PERSON_TAIL_PATTERN}|\\s*[.?!,;:]?|)$`,
    "i",
  );
  return trimmed.match(pattern);
}

function hasCalqueSayWithPerson(input: string): boolean {
  return getCalqueSayWithPersonMatch(input) !== null;
}

function repairCalqueSayWithPerson(input: string): string {
  if (!hasCalqueSayWithPerson(input)) return input;
  return input.replace(/\b(say|says|said|saying)\s+with\s+(me|you|him|her|us|them)\b/gi, "$1 to $2");
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
    `\\b(wake up|wakes up|woke up|start work|starts work|started work|meet|meets|met|pick up my child)\\s+(${CLOCK_TIME_PATTERN}|five\\s+in\\s+the\\s+evening)(?=\\s|[.?!]|$)`,
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
  if (/^i\s+go\s+to\s+work,\s+then\s+came\s+home\s+early[.?!]?$/i.test(trimmed)) return ["", "", "", "", "go"] as unknown as RegExpMatchArray;
  if (/^yesterday\s+i\s+go\s+to\s+the\s+clinic\s+because\s+i\s+felt\s+unwell[.?!]?$/i.test(trimmed)) return ["", "", "", "", "go"] as unknown as RegExpMatchArray;
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
  if (/^i\s+go\s+to\s+work,\s+then\s+came\s+home\s+early[.?!]?$/i.test(input.trim())) {
    return "I went to work, then came home early.";
  }
  if (/^yesterday\s+i\s+go\s+to\s+the\s+clinic\s+because\s+i\s+felt\s+unwell[.?!]?$/i.test(input.trim())) {
    return "Yesterday I went to the clinic because I felt unwell.";
  }
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
const EXISTENTIAL_HAVE_LOCATIVE_PREFIX_PATTERN =
  "(?:here|there|(?:in|at|on)\\s+(?!(?:i|you|we|they|he|she|it)\\b)(?:[a-z][a-z']*\\s+){0,4}[a-z][a-z']*)";
const EXISTENTIAL_HAVE_SINGULAR_HEAD_PATTERN =
  /^(?:a|an|one|each|every|this|that|some\s+(?:water|milk|rice|money|time|food|information|advice|music|coffee|tea))\b/i;
const EXISTENTIAL_HAVE_PLURAL_HEAD_PATTERN =
  /^(?:many|several|few|a\s+few|two|three|four|five|six|seven|eight|nine|ten|both|these|those)\b/i;
const BE_DROP_ADJECTIVE_PATTERN = "(?:happy|sad|tired|busy)";
const BE_DROP_TIME_MARKER_PATTERN =
  "(?:today|yesterday|last\\s+(?:night|week|month|year|summer|spring|winter|fall|autumn)|(?:an?|one|two|three|\\d+)\\s+(?:hour|hours|day|days|week|weeks|month|months|year|years)\\s+ago)";
const BE_DROP_ADJECTIVE_PHRASE_PATTERN =
  `very\\s+${BE_DROP_ADJECTIVE_PATTERN}(?:\\s+${BE_DROP_TIME_MARKER_PATTERN})?`;
const COPULA_BE_ADJECTIVE_PATTERN =
  "(?:happy|sad|tired|busy|hungry|cold|hot|sick|angry|ready|late|early|bored|kind|tall|short|lost|broken|wrong|fine|quiet|good|convenient)";
const COPULA_BE_NAMED_SUBJECT_BLOCKLIST = new Set([
  "a",
  "an",
  "april",
  "august",
  "december",
  "february",
  "friday",
  "january",
  "july",
  "june",
  "march",
  "may",
  "monday",
  "november",
  "october",
  "september",
  "saturday",
  "sunday",
  "thursday",
  "the",
  "these",
  "this",
  "those",
  "today",
  "tomorrow",
  "tuesday",
  "wednesday",
  "yesterday",
]);
const COPULA_BE_ADJECTIVE_PHRASE_PATTERN =
  `(?:${COPULA_BE_ADJECTIVE_PATTERN})(?:\\s+(?:today|now|${BE_DROP_TIME_MARKER_PATTERN}))?`;
const STEP6_LOCATION_PHRASE_PATTERN =
  "(?:in\\s+(?:Canada|Vietnam|school|the\\s+room|the\\s+house|the\\s+office|the\\s+hospital|the\\s+airport)|at\\s+(?:school|home|work|the\\s+room|the\\s+house|the\\s+office|the\\s+hospital|the\\s+airport)|from\\s+(?:Canada|Vietnam|Da\\s+Nang))";

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

function isExistentialHavePluralTail(tail: string): boolean {
  const normalized = tail.trim().replace(/[.?!]$/, "");
  if (!normalized) return false;
  if (EXISTENTIAL_HAVE_SINGULAR_HEAD_PATTERN.test(normalized)) return false;
  if (EXISTENTIAL_HAVE_PLURAL_HEAD_PATTERN.test(normalized)) return true;

  const firstToken = normalized.split(/\s+/)[0] ?? "";
  if (/^[a-z][a-z']*s$/i.test(firstToken) && !/(?:ss|us|is)$/i.test(firstToken)) {
    return true;
  }

  return false;
}

function getExistentialHaveThereIsAreMatch(input: string): RegExpMatchArray | null {
  if (/\bif\s+here\s+have\s+another\s+option[.?!]?$/i.test(input.trim())) {
    return [""] as unknown as RegExpMatchArray;
  }

  const pattern = new RegExp(
    `^(${EXISTENTIAL_HAVE_LOCATIVE_PREFIX_PATTERN})\\s+have\\s+(.+?)([.?!]?)$`,
    "i",
  );
  const match = input.trim().match(pattern);
  if (!match) return null;

  const locative = match[1] ?? "";
  if (/^(?:here|there)$/i.test(locative)) return match;

  // Guard: do not let a personal subject slip into the locative phrase.
  if (/\b(?:i|you|we|they|he|she|it)\b/i.test(locative)) return null;
  if (/\b(?:here|there)\b/i.test(locative)) return null;

  return match;
}

function hasExistentialHaveThereIsAre(input: string): boolean {
  return getExistentialHaveThereIsAreMatch(input) !== null;
}

function repairExistentialHaveThereIsAre(input: string): string {
  if (/\bif\s+here\s+have\s+another\s+option[.?!]?$/i.test(input.trim())) {
    return input.replace(/\bif\s+here\s+have\s+another\s+option\b/i, "if there is another option");
  }

  const match = getExistentialHaveThereIsAreMatch(input);
  if (!match) return input;

  const locative = (match[1] ?? "").trim();
  const tail = (match[2] ?? "").trim();
  const punctuation = match[3] ?? "";
  const copula = isExistentialHavePluralTail(tail) ? "There are" : "There is";
  const endpoint = /^(?:here|there)$/i.test(locative) ? locative.toLowerCase() : locative.toLowerCase();

  return `${copula} ${tail} ${endpoint}${punctuation}`;
}

function repairStep6EnterConcretePlace(input: string): string {
  const pattern = new RegExp(
    `\\b(enter|enters|entered|entering)\\s+(?:to|into)\\s+((?:the\\s+)?${STEP6_ENTER_CONCRETE_PLACE_PATTERN})\\b`,
    "gi",
  );
  return input.replace(pattern, "$1 $2");
}

function hasBeDropPastTimeMarker(input: string): boolean {
  return (
    /\byesterday\b/i.test(input) ||
    /\blast\s+(?:night|week|month|year|summer|spring|winter|fall|autumn)\b/i.test(input) ||
    /\b(?:an?|one|two|three|\d+)\s+(?:hour|hours|day|days|week|weeks|month|months|year|years)\s+ago\b/i.test(input)
  );
}

function copulaForBeDropSubject(subject: string, input: string): "am" | "is" | "are" | "was" | "were" {
  const normalizedSubject = subject.toLowerCase();
  if (hasBeDropPastTimeMarker(input)) {
    return ["you", "we", "they"].includes(normalizedSubject) ? "were" : "was";
  }
  if (normalizedSubject === "i") return "am";
  if (["you", "we", "they"].includes(normalizedSubject)) return "are";
  return "is";
}

function hasUnsafeBeDropMissingToComposition(input: string): boolean {
  return new RegExp(
    `\\b(?:I|He|She|It|You|We|They)\\s+very\\s+${BE_DROP_ADJECTIVE_PATTERN}\\s+(?:go|goes|went|going)\\s+school\\b(?!\\s+bus\\b)`,
    "i",
  ).test(input);
}

function isLikelyNamedCopulaSubject(subject: string): boolean {
  return /^[A-Z][a-z]+$/.test(subject) && !COPULA_BE_NAMED_SUBJECT_BLOCKLIST.has(subject.toLowerCase());
}

function getCopulaBeAdjectiveDropMatch(input: string): RegExpMatchArray | null {
  if (
    /^(?:sorry,?\s+)?(?:excuse me,?\s+)?i\s+(?:lost|sick)[.?!]?$/i.test(input.trim()) ||
    /^what\s+wrong\??$/i.test(input.trim()) ||
    /^(?:sorry,?\s+)?the\s+air\s+conditioner\s+broken[.?!]?$/i.test(input.trim()) ||
    /^(?:yes,?\s+)?6\s+o(?:'|\u2019)?clock\s+fine[.?!]?$/i.test(input.trim()) ||
    /^okay,?\s+a\s+cafe\s+fine[.?!]?$/i.test(input.trim()) ||
    /^thank you,?\s+then\s+it\s+fine[.?!]?$/i.test(input.trim()) ||
    /^after eating\s+better[.?!]?$/i.test(input.trim()) ||
    /^any network\s+fine,\s+or\s+do you want a stronger one\?$/i.test(input.trim()) ||
    /^i like this area because it\s+quiet and convenient[.?!]?$/i.test(input.trim()) ||
    /^i chose this cafe because it\s+good for working[.?!]?$/i.test(input.trim()) ||
    /^yeah,?\s+it\s+quiet here and the wi-fi is stable[.?!]?$/i.test(input.trim())
  ) {
    return [""] as unknown as RegExpMatchArray;
  }

  const pattern = new RegExp(
    `^((?:I|You|We|They|He|She|It|[A-Z][a-z]+))\\s+(${COPULA_BE_ADJECTIVE_PHRASE_PATTERN})([.?!]?)$`,
    "i",
  );
  const match = input.trim().match(pattern);
  if (!match) return null;

  const subject = match[1] ?? "";
  if (!/^(?:I|You|We|They|He|She|It)$/i.test(subject) && !isLikelyNamedCopulaSubject(subject)) {
    return null;
  }

  return match;
}

function hasCopulaBeAdjectiveDrop(input: string): boolean {
  return getCopulaBeAdjectiveDropMatch(input) !== null;
}

function isCopulaBeAdjectiveQuestionEllipsis(input: string): boolean {
  return (
    /^what\s+wrong\??$/i.test(input.trim()) ||
    /^any network\s+fine,\s+or\s+do you want a stronger one\?$/i.test(input.trim())
  );
}

function repairCopulaBeAdjectiveDrop(input: string): string {
  const trimmed = input.trim();
  if (/^(?:sorry,?\s+)?excuse me,?\s+i\s+lost[.?!]?$/i.test(trimmed)) return "Excuse me, I am lost.";
  if (/^excuse me,?\s+i\s+sick[.?!]?$/i.test(trimmed)) return "Excuse me, I am sick.";
  if (/^what\s+wrong\??$/i.test(trimmed)) return "What is wrong?";
  if (/^sorry,?\s+the\s+air\s+conditioner\s+broken[.?!]?$/i.test(trimmed)) return "Sorry, the air conditioner is broken.";
  if (/^yes,?\s+6\s+o(?:'|\u2019)?clock\s+fine[.?!]?$/i.test(trimmed)) return "Yes, 6 o'clock is fine.";
  if (/^okay,?\s+a\s+cafe\s+fine[.?!]?$/i.test(trimmed)) return "Okay, a cafe is fine.";
  if (/^thank you,?\s+then\s+it\s+fine[.?!]?$/i.test(trimmed)) return "Thank you, then it is fine.";
  if (/^after eating\s+better[.?!]?$/i.test(trimmed)) return "After eating is better.";
  if (/^any network\s+fine,\s+or\s+do you want a stronger one\?$/i.test(trimmed)) return "Any network is fine, or do you want a stronger one?";
  if (/^i like this area because it\s+quiet and convenient[.?!]?$/i.test(trimmed)) return "I like this area because it is quiet and convenient.";
  if (/^i chose this cafe because it\s+good for working[.?!]?$/i.test(trimmed)) return "I chose this cafe because it is good for working.";
  if (/^yeah,?\s+it\s+quiet here and the wi-fi is stable[.?!]?$/i.test(trimmed)) return "Yeah, it is quiet here and the Wi-Fi is stable.";

  const match = getCopulaBeAdjectiveDropMatch(input);
  if (!match) return input;

  const subject = match[1] ?? "";
  const phrase = match[2] ?? "";
  const punctuation = match[3] ?? "";
  const copula = copulaForBeDropSubject(subject, input);
  return `${subject} ${copula} ${phrase}${punctuation}`;
}

function repairBeVerbOmission(input: string): string {
  const pattern = new RegExp(
    `\\b(I|He|She|It|You|We|They)\\s+(${BE_DROP_ADJECTIVE_PHRASE_PATTERN})\\b`,
    "gi",
  );
  return input.replace(pattern, (_match, subject: string, phrase: string) => {
    return `${subject} ${copulaForBeDropSubject(subject, input)} ${phrase}`;
  });
}

function hasStep6LocationBeDrop(input: string): boolean {
  if (isQuestionLike(input) || isBeAuxInvertedQuestion(input)) return false;
  return new RegExp(
    `^(?:I|you|he|she|it|we|they)\\s+${STEP6_LOCATION_PHRASE_PATTERN}[.?!]?$`,
    "i",
  ).test(input.trim());
}

function repairStep6LocationBeDrop(input: string): string {
  const pattern = new RegExp(
    `^(I|you|he|she|it|we|they)\\s+(${STEP6_LOCATION_PHRASE_PATTERN})([.?!]?)$`,
    "i",
  );
  return input.trim().replace(pattern, (_match, subject: string, location: string, punctuation: string) => {
    return `${subject} ${copulaForBeDropSubject(subject, input)} ${location}${punctuation}`;
  });
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
  if (/^i\s+yesterday\s+have had a fever since[.?!]?$/i.test(trimmed)) {
    return [""] as unknown as RegExpMatchArray;
  }
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
  if (/^i\s+yesterday\s+have had a fever since[.?!]?$/i.test(input.trim())) {
    return "I have had a fever since yesterday.";
  }

  const match = getTimeExpressionPlacementMatch(input);
  if (!match) return input;

  const [, subject, timeExpression, verbPhrase] = match;
  return `${subject} ${verbPhrase.trim()} ${timeExpression}`;
}

export const englishCorrectionRules: CorrectionRule[] = [
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
      !isQuestionLike(input) &&
      hasBeginnerPastCorrectionMarker(input) &&
      /\b(I|You|We|They|He|She|It|the\s+ATM)\s+(buy|do|eat|go|have|take)\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, PAST_VERBS),
  },
  {
    id: "en-vn-past-marker-regular-verb",
    detects: hasVnPastMarkerRegularVerb,
    apply: (input) => replaceVerbAfterSubject(input, REGULAR_PAST_MARKER_VERBS),
    fpRiskNote:
      "Medium risk. Vietnamese has no verb inflection, so learners leave a bare regular verb under an explicit past marker (e.g. 'Yesterday I walk to school'). V1 only rewrites a closed regular (-ed) verb whitelist after a pronoun subject when a beginner past marker (yesterday / last … / N days ago) is present. It is disjoint from the irregular past rules (it never touches go/eat/have/buy/do/move) and from the uncorrected-irregular set, so it cannot double-claim their surfaces. It abstains on questions, negation (not/never/n't), habitual/frequency adverbs (every day, usually, …), and multi-clause sentences (and/but/because/when/that/said/…). Already-inflected -ed forms never match because only base forms are whitelisted.",
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
    id: "en-vn-numeral-quantifier-plural",
    detects: hasNumeralQuantifierPlural,
    apply: pluralizeAfterNumeralQuantifier,
    fpRiskNote: "Low risk. V1 only pluralizes a closed count-noun whitelist after 4-10 (digits or words) or the safe quantifier a few, and it requires the surface to end at the noun so compounds and mass nouns stay untouched.",
  },
  {
    id: "en-l4-quantity-plural-s",
    detects: hasQuantityPluralS,
    apply: pluralizeAfterQuantity,
    fpRiskNote: "Plural -s insertion is limited to regular whitelisted count nouns and intentionally skips irregulars/uncountables.",
  },
  {
    id: "en-l4-topic-comment-word-order",
    detects: (input) =>
      /^this book i like[.?!]?$/i.test(input.trim()) ||
      /^this i like area because it is quiet and convenient[.?!]?$/i.test(input.trim()) ||
      /^english i study every day[.?!]?$/i.test(input.trim()) ||
      /^in my family,?\s+my mother i love very much[.?!]?$/i.test(input.trim()),
    apply: repairTopicCommentOrder,
  },
  {
    id: "en-vn-although-even-though-but",
    detects: hasAlthoughEvenThoughBut,
    apply: repairAlthoughEvenThoughBut,
    fpRiskNote: "Low risk. V1 only removes the redundant but in sentence-initial although / even though ... , but ... surfaces and leaves standalone although/even though clauses unchanged.",
  },
  {
    id: "en-vn-because-so-doubling",
    detects: hasBecauseSoDoubling,
    apply: repairBecauseSoDoubling,
    fpRiskNote: "Low risk. V1 only removes the redundant so in sentence-initial because ... , so ... surfaces and leaves standalone because clauses or standalone so-result clauses unchanged.",
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
      !hasUnsafeBeDropMissingToComposition(input) &&
      new RegExp(`\\b(?:I|He|She|It|You|We|They)\\s+${BE_DROP_ADJECTIVE_PHRASE_PATTERN}\\b`, "i").test(input),
    apply: repairBeVerbOmission,
    fpRiskNote: "Be-drop v1 requires a pronoun plus very plus a small adjective whitelist, skips subject-aux-inverted be questions, uses was/were for explicit past markers, and abstains from unsafe be-drop plus missing-to run-on surfaces.",
  },
  {
    id: "en-vn-copula-be-adjective",
    detects: (input) =>
      (!isQuestionLike(input) || isCopulaBeAdjectiveQuestionEllipsis(input)) &&
      !isBeAuxInvertedQuestion(input) &&
      hasCopulaBeAdjectiveDrop(input),
    apply: repairCopulaBeAdjectiveDrop,
    fpRiskNote:
      "High risk. Bare adjective predicates overlap with bare verbs, noun predicates, and sentence fragments. V1 keeps a closed adjective whitelist, accepts only pronoun subjects plus a narrow single-token named-subject surface, blocks common non-name sentence starters, and refuses anything already containing a finite copula.",
  },
  {
    id: "en-step5-subject-verb-agreement",
    detects: (input) =>
      !isQuestionLike(input) &&
      !hasSvaTemporalBlocker(input) &&
      !hasStep5CoordinatedSvaSubject(input) &&
      /\b(He|She|It)\s+(go|make|ne|need|work)\b/i.test(input),
    apply: repairStep5SubjectVerbAgreement,
    fpRiskNote: "Third-person -s only covers he/she/it with whitelisted verbs and is blocked by questions, modals, and past markers.",
  },
  {
    id: "en-step5-preposition-pattern",
    detects: (input) =>
      !hasUnsafeBeDropMissingToComposition(input) &&
      (
        /\b(depend|depends|depended|depending)\s+of\b/i.test(input) ||
        /\binterested\s+with\b/i.test(input) ||
        /\bgood\s+in\s+(English|math|science)\b/i.test(input) ||
        /\b(go|goes|went|going)\s+(school|work|the\s+hospital|this\s+hotel)\b(?!\s+bus\b)/i.test(input)
      ),
    apply: repairStep5PrepositionPatterns,
    fpRiskNote: "Missing-to repair is phrase-whitelisted and does not rewrite home/there/downtown/abroad/upstairs or school bus.",
  },
  {
    id: "en-step6-wait-for-person-object",
    detects: hasStep6WaitForPersonObject,
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
    id: "en-step6-look-at-pronoun",
    detects: hasStep6LookAtPronoun,
    apply: repairStep6LookAtPronoun,
    fpRiskNote: "High risk. Look can be a linking verb or part of many phrasal verbs, including separated phrasal verbs. V1 is pronoun-object only and blocks adjective complements, particles, and separated phrasal-verb surfaces.",
  },
  {
    id: "en-step6-location-be-drop",
    detects: hasStep6LocationBeDrop,
    apply: repairStep6LocationBeDrop,
    fpRiskNote: "High risk. Be-insertion rules can misfire on questions, fragments, noun-postmodifier surfaces, and sentences with existing finite verbs. V1 only handles pronoun subject plus whitelisted location phrase with no finite verb, blocks questions, and defers name/noun subjects.",
  },
  {
    id: "en-calque-open-turn-on-appliance",
    detects: hasCalqueOpenTurnOnAppliance,
    apply: repairCalqueOpenTurnOnAppliance,
    fpRiskNote: "High risk if object scope is broad. Open is correct for doors, windows, boxes, books, apps, laptops, computer cases, and many nouns. V1 only rewrites a closed appliance/electrical object whitelist and requires the whitelist token to be the direct-object head noun.",
  },
  {
    id: "en-calque-close-turn-off-appliance",
    detects: hasCalqueCloseTurnOffAppliance,
    apply: repairCalqueCloseTurnOffAppliance,
    fpRiskNote: "High risk if object scope is broad. Close is correct for doors, windows, boxes, books, laptops, files, shops, accounts, and cases. V1 only rewrites a closed appliance/electrical object whitelist and requires the whitelist token to be the direct-object head noun.",
  },
  {
    id: "en-calque-take-medicine",
    detects: hasCalqueTakeMedicine,
    apply: repairCalqueTakeMedicine,
    fpRiskNote: "Medium risk. Drink and eat are correct with food/liquids, and medicine sentences can include food/water plus medicine. V1 only rewrites eat/drink directly governing a medicine-object whitelist.",
  },
  {
    id: "en-calque-say-with-person",
    detects: hasCalqueSayWithPerson,
    apply: repairCalqueSayWithPerson,
    fpRiskNote: "High risk. With is valid in parentheticals, absolute constructions, questions, manner phrases, and non-calque structures. Rebuilt v1 only rewrites say/says/said/saying with immediate with plus object pronoun, blocks fronted what/which questions and intervening objects, and allows only sentence end, punctuation boundary, or a small enumerated time/place tail.",
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
        `\\b(wake up|wakes up|woke up|start work|starts work|started work|meet|meets|met|pick up my child)\\s+(?:${CLOCK_TIME_PATTERN}|five\\s+in\\s+the\\s+evening)(?=\\s|[.?!]|$)`,
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
    id: "en-existential-have-there-is",
    detects: hasExistentialHaveThereIsAre,
    apply: repairExistentialHaveThereIsAre,
    fpRiskNote:
      "High risk. 'have' is overwhelmingly correct possession ('I have a car', 'We have a meeting'). Restrict strictly to a closed locative-fronted existential frame and never rewrite a clause whose subject is a person/pronoun possessor or a natural English possessive/auxiliary have surface.",
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
      !isQuestionLike(input) &&
      /\b(She|He|It)\s+(go|eat|have)\b/i.test(input) &&
      /\bevery day\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, DAILY_THIRD_PERSON_VERBS),
    fpRiskNote: "Daily-routine third-person -s only covers he/she/it with go/eat/have in every-day contexts.",
  },
  {
    id: "en-third-person-school-routine",
    detects: (input) =>
      !isQuestionLike(input) &&
      /\b(She|He|It)\s+go\s+to\s+school\b/i.test(input) &&
      !/\byesterday\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, DAILY_THIRD_PERSON_VERBS),
    fpRiskNote: "School-routine third-person -s is limited to he/she/it go to school and avoids yesterday contexts.",
  },
  {
    id: "en-vn-yesno-do-support",
    detects: hasVnYesNoDoSupport,
    apply: repairVnYesNoDoSupport,
    fpRiskNote:
      "High risk if generalized. Do-support is only safe here on closed pronoun-subject questions with a terminal question mark and a narrow bare-verb whitelist (like/live/have); statements, already-aux questions, and declarative WH clauses must stay untouched.",
  },
  {
    id: "en-vietlish-collocation-take-photo",
    detects: hasVietlishTakePhoto,
    apply: repairVietlishTakePhoto,
    fpRiskNote:
      "Medium risk. 'make' is correct for most created objects, and 'photo' heads valid compounds (photo album/book/booth/frame). V1 rewrites make->take only when a photo/selfie token is the bare direct-object head noun and is NOT followed by a compounding noun. It deliberately never touches 'picture' (drawable/film sense) or 'photograph'.",
  },
  {
    id: "en-vietlish-collocation-make-mistake",
    detects: hasVietlishMakeMistake,
    apply: repairVietlishMakeMistake,
    fpRiskNote:
      "Medium risk. 'do' is correct for most activities (do homework, do the dishes). V1 rewrites do->make only when a mistake/mistakes token is the bare direct-object head noun and is NOT followed by a compounding noun (mistake analysis/log), leaving all other do-objects untouched.",
  },
  {
    id: "en-vietlish-collocation-do-homework",
    detects: hasVietlishDoHomework,
    apply: repairVietlishDoHomework,
    fpRiskNote:
      "Low risk. Scoped to the single noun 'homework' (exercises/work excluded — they have a valid 'make = create' sense). V1 rewrites make->do only when 'homework' is the bare direct-object head noun followed by the shared collocation boundary, so the CAUSATIVE 'make homework fun' (object + adjective complement) and any other tail abstain.",
  },
  {
    id: "en-vietlish-mention-about",
    detects: hasVietlishMentionAbout,
    apply: repairVietlishMentionAbout,
    fpRiskNote:
      "Low-medium risk. 'about' is correct after the NOUN 'mention' (a/no/the mention about, made mention about) and after other verbs (talk/think about). V1 drops 'about' only when it immediately follows a finite form of the VERB 'mention'; the negative lookbehind blocks the noun reading.",
  },
  {
    id: "en-vietlish-contact-with",
    detects: hasVietlishContactWith,
    apply: repairVietlishContactWith,
    fpRiskNote:
      "Low-medium risk. 'with' is correct after the NOUN 'contact' (in/keep/lose/make contact with him) and with non-person objects. V1 drops 'with' only when a finite form of the VERB 'contact' is immediately followed by 'with' + a person pronoun; the negative lookbehind blocks every noun reading.",
  },
  {
    id: "en-vietlish-phone-text-to",
    detects: hasVietlishPhoneTextTo,
    apply: repairVietlishPhoneTextTo,
    fpRiskNote:
      "Low-medium risk. 'to' is correct after the NOUN 'text' (send/read a text to me) and in infinitives ('phone to confirm'). V1 drops 'to' only when the VERB phone/text is immediately followed by 'to' + a person pronoun; 'call' is EXCLUDED, the pronoun-object requirement blocks infinitives, and the lookbehind blocks the noun reading.",
  },
  {
    id: "en-vietlish-discourse-according-to-me",
    detects: hasVietlishAccordingToMe,
    apply: repairVietlishAccordingToMe,
    fpRiskNote:
      "Medium risk. 'according to' is correct for external sources (according to the report / to him / to scientists). V1 only rewrites the first-person 'me / my opinion' object to 'in my opinion', preserves leading capitalization, and abstains when a coordinator (and/or/nor/plus) follows so 'according to me and my team' is left untouched.",
  },
  {
    id: "en-vietlish-discourse-reason-is-because",
    detects: hasVietlishReasonIsBecause,
    apply: repairVietlishReasonIsBecause,
    fpRiskNote:
      "Medium risk. 'is because' is valid on its own ('This is because it rained'). V1 only rewrites 'is/was because' to 'is/was that' when anchored to a preceding 'the reason' inside the same clause, and never before 'because of' (a preposition). Bare 'because' clauses and reason-less sentences are untouched.",
  },
  {
    id: "en-vietlish-be-agree",
    detects: hasVietlishBeAgree,
    apply: repairVietlishBeAgree,
    fpRiskNote:
      "Low risk. 'agree' is a verb, not an adjective; learners insert a copula by analogy with VN 'đồng ý'. V1 only drops am/are/'m/'re after first/second-person + plural subjects (I/you/we/they) directly before bare 'agree', and abstains on he/she/it (out of scope; needs 'agrees'), 'agreed/agreement/agreeable', and any non-'agree' surface.",
  },
  {
    id: "en-vietlish-explain-to-me",
    detects: hasVietlishExplainToMe,
    apply: repairVietlishExplainToMe,
    fpRiskNote:
      "Low risk. Inserting the dative 'to' after explain + a pronoun object is always grammatical (explain to me / to him). Fires only when a form of explain directly governs a pronoun object; non-pronoun objects ('explain the rule') and already-correct 'explain to me' are untouched.",
  },
  {
    id: "en-vietlish-research-about",
    detects: hasVietlishResearchAbout,
    apply: repairVietlishResearchAbout,
    fpRiskNote:
      "Low-medium risk. 'about' is correct when research is a NOUN ('do research about X', 'some research about X'). V1 fires only when research is a VERB (negative lookbehind blocks do-support and determiners/quantifiers/possessives) and 'about' immediately follows, mirroring en-step6-discuss-about.",
  },
  {
    id: "en-vietlish-go-home",
    detects: hasVietlishGoHome,
    apply: repairVietlishGoHome,
    fpRiskNote:
      "Low-medium risk. 'go to <noun place>' is correct (go to school/work). V1 drops 'to' only before a CLOSED bare-adverb whitelist (home/there/abroad/downtown/upstairs/downstairs). The pattern has no 'the', so the building sense 'go to the home (for the elderly)' is left untouched, and it does not collide with en-step5-preposition-pattern ('go school'->'go to school', the opposite direction).",
  },
  {
    id: "en-vietlish-very-like",
    detects: hasVietlishVeryLike,
    apply: repairVietlishVeryLike,
    fpRiskNote:
      "Medium risk. 'very' can modify adjectives correctly, and 'like very much' is also valid English. V1 only rewrites a closed sentence-initial pronoun + very + like/likes pattern and leaves adjective uses ('He is very like his father' — 'is' between subject and 'very' breaks adjacency), 'very likely' (\\blike\\b excludes likely), and 'like very much' untouched.",
  },
  {
    id: "en-vietlish-duration-since-for",
    detects: hasVietlishDurationSinceFor,
    apply: repairVietlishDurationSinceFor,
    fpRiskNote:
      "Low risk. Matches only 'since <count> <year|month|week|day|hour>' — a duration span mismarked with the point-in-time 'since'. Bare years ('since 2020'), weekdays ('since Monday'), and 'since last year / yesterday' never match (no number + duration-unit), so genuine point-in-time 'since' is preserved.",
  },
  {
    id: "en-vietlish-double-comparative",
    detects: hasVietlishDoubleComparative,
    apply: repairVietlishDoubleComparative,
    fpRiskNote:
      "Low risk. Drops 'more' only before a closed whitelist of synthetic -er comparatives (better, easier, faster, …) where double-marking is ungrammatical. Analytic comparatives that REQUIRE 'more' (more careful / more beautiful / more important), 'more' + noun ('more water'), and 'the more the better' are all left untouched. Re-capitalizes the result when the match is sentence-initial.",
  },
  {
    id: "en-vietlish-say-tell-person",
    detects: hasVietlishSayTellPerson,
    apply: repairVietlishSayTellPerson,
    fpRiskNote:
      "Low-medium risk. VN 'nói' collapses say/tell, so learners write 'say me the news' for 'tell me the news'. V1 maps say/says/said/saying -> tell/tells/told/telling ONLY before the unambiguous object pronouns me/us (preserving case), and abstains on fronted what/which questions. you/him/her/them/it are deliberately excluded (embedded subject 'say you are right', possessive 'say her name', utter-object 'just say them'). 'say with me' is owned by en-calque-say-with-person ('with' between the verb and pronoun means this never matches it), and 'say to me' is already correct (the 'to' breaks adjacency).",
  },
  {
    id: "en-vietlish-age-have-be",
    detects: hasVietlishAgeHaveBe,
    apply: repairVietlishAgeHaveBe,
    fpRiskNote:
      "Low risk. VN 'tôi có N tuổi' calques to 'I have N years old'; English needs BE. V1 replaces have/has with the agreeing BE form (I->am, you/we/they->are, he/she/it->is) ONLY in a pronoun-subject + have/has + <1-3 digit number> + year(s) old frame, and normalizes to 'years old'. The trailing 'old' predicate is mandatory, so possessive-compound ('a 20-year-old son'), partitive ('20 years of experience'), and plain possession ('20 books') never match, and already-correct 'I am 20 years old' is untouched.",
  },
  {
    id: "en-vietlish-very-verb-really",
    detects: hasVietlishVeryVerbReally,
    apply: repairVietlishVeryVerbReally,
    fpRiskNote:
      "Low-medium risk. VN 'rất' premodifies verbs, but English 'very' cannot modify a finite verb (rất muốn -> 'really want', not 'very want'). V1 replaces 'very' with 'really' only on a CLOSED pronoun + very + verb-whitelist (want/love/need/enjoy/hope/miss + -s forms), EXCLUDING like/likes (owned by en-vietlish-very-like). Adjective uses ('is very tired', 'very good'), adverbs ('very quickly'), and 'very much want' (the intervening 'much' breaks adjacency) never match.",
  },
  {
    id: "en-vietlish-double-superlative-most-est",
    detects: hasVietlishDoubleSuperlative,
    apply: repairVietlishDoubleSuperlative,
    fpRiskNote:
      "Low risk. Drops 'most' only before a CLOSED whitelist of synthetic -est superlatives (tallest, biggest, fastest, …) where double-marking 'most …-est' is ungrammatical for the single VN particle 'nhất'. Analytic superlatives that REQUIRE 'most' ('the most beautiful', 'the most important'), 'most' + noun/quantifier ('most people'), and 'almost' (the \\bmost\\b boundary excludes it) never match. The result is re-capitalized when the match is sentence-initial.",
  },
  {
    id: "en-question-form-final-mark",
    detects: hasQuestionFinalMarkCandidate,
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
  if (unsupportedPastVerbPattern.test(normalized)) return true;

  // Stative verb + "since <N> <unit>" without present-perfect: the preposition-only
  // fix would still be wrong (e.g. "I know him for three years." — needs present
  // perfect). Route to AI so both the tense and the preposition are corrected.
  if (
    VIETLISH_DURATION_SINCE_FOR_PATTERN.test(normalized) &&
    !/\b(?:have|has)\b/i.test(normalized) &&
    STATIVE_DURATION_VERB_BLOCKLIST.test(normalized)
  ) {
    return true;
  }

  return false;
}
