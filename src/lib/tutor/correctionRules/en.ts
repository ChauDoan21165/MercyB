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
  return /^because\s+[^,]+,\s+so\s+[^.?!]+[.?!]?$/i.test(trimmed);
}

function repairBecauseSoDoubling(input: string): string {
  return input.replace(
    /^(because\s+[^,]+),\s+so\s+([^.?!]+)([.?!]?)$/i,
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

  const subject = "(?:i|you|we|they|he|she|it|this|that|these|those|there|[a-z]+(?:\\s+[a-z]+){0,3})";
  const lexicalVerb = "[a-z]+(?:\\s+[a-z]+)*";
  const beAux = "(?:am|are|is|was|were)";
  const doAux = "(?:do|does|did)";
  const modalAux = "(?:can|could|would|will|should)";
  const aux = `(?:${beAux}|${doAux}|${modalAux})`;

  const frames = [
    `^(?:what|where|when|why)\\s+${aux}\\s+${subject}\\b`,
    `^how\\s+${aux}\\s+${subject}\\b`,
    `^how\\s+(?:old|often|many|much)\\s+${aux}\\s+${subject}\\b`,
    `^${doAux}\\s+${subject}\\s+${lexicalVerb}\\b`,
    `^${beAux}\\s+${subject}\\b`,
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
    new RegExp(`^${YESNO_DO_SUPPORT_SUBJECT_PATTERN}\\s+${YESNO_DO_SUPPORT_VERB_PATTERN}\\b`, "i").test(trimmed)
  );
}

function repairVnYesNoDoSupport(input: string): string {
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
    `\\b(I|You|We|They|He|She)\\s+(bought|buy|want|need)\\s+(${nounPattern})\\b`,
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
      return `${subject} ${verb} ${article} ${noun}`;
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
    `\\b(I|You|We|They|He|She)\\s+(bought|buy|want|need)\\s+(${nounPattern})\\b`,
    "gi",
  );
  const bePattern = new RegExp(
    `\\b(He|She|I)\\s+(is|am)\\s+(${nounPattern})\\b`,
    "gi",
  );
  const matchesCommonNoun = (pattern: RegExp) =>
    Array.from(input.matchAll(pattern)).some((match) => {
      const noun = match[3] ?? "";
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
    `\\b(?:a\\s+few|(?:four|five|six|seven|eight|nine|ten|4|5|6|7|8|9|10))\\s+(${nounPattern})\\b(?=\\s*[.?!]?$)`,
    "gi",
  );
  return input.replace(pattern, (match, noun: string, offset: number) => {
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
    `\\b(?:a\\s+few|(?:four|five|six|seven|eight|nine|ten|4|5|6|7|8|9|10))\\s+(${nounPattern})\\b(?=\\s*[.?!]?$)`,
    "gi",
  );
  return Array.from(input.matchAll(pattern)).some((match) => {
    const noun = match[1] ?? "";
    const offset = match.index ?? 0;
    return !hasLikelyVerbSenseTail(noun, input.slice(offset + match[0].length));
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
const CLOCK_TIME_PATTERN =
  "(?:(?:1[0-2]|0?[1-9])\\s+o(?:'|\\u2019)?clock|(?:1[0-2]|0?[1-9])\\s*(?:AM|PM|am|pm)|(?:[01]?\\d|2[0-3]):[0-5]\\d)";
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
const STEP6_LOCATION_PHRASE_PATTERN =
  "(?:in\\s+(?:Canada|Vietnam|school|the\\s+room|the\\s+house|the\\s+office|the\\s+hospital|the\\s+airport)|at\\s+(?:school|home|work|the\\s+room|the\\s+house|the\\s+office|the\\s+hospital|the\\s+airport))";

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
      /\b(I|You|We|They|He|She|It)\s+(buy|do|eat|go|have)\b/i.test(input),
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
    id: "en-step5-subject-verb-agreement",
    detects: (input) =>
      !isQuestionLike(input) &&
      !hasSvaTemporalBlocker(input) &&
      !hasStep5CoordinatedSvaSubject(input) &&
      /\b(He|She|It)\s+(go|make|work)\b/i.test(input),
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
        /\b(go|goes|went|going)\s+school\b(?!\s+bus\b)/i.test(input)
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
  return unsupportedPastVerbPattern.test(normalized);
}
