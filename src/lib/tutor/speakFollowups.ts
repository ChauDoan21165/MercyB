export type SpeakFollowUpPattern = {
  id: string;
  test: RegExp;
  questions: readonly string[];
};

export type SpeakFollowUpSelection = {
  topicId: string;
  question: string;
  isPivot: boolean;
};

export type SpeakFollowUpTopicInput = {
  seedSentence?: string | null;
  learnerText?: string | null;
  currentTopicId?: string | null;
};

export const SPEAK_FOLLOW_UP_DEPTH_CAP = 4;
export const SPEAK_FOLLOW_UP_PIVOT = "Do you want to practice another sentence?";

// ── Salience-following fallback (Path B: follow the learner's own words) ──
//
// When the learner's sentence doesn't match a scripted topic pattern it used to
// fall back to GENERIC_FOLLOW_UPS ("Can you tell me one more detail about
// that?") — a dead-end that ignored what they actually said. Instead we extract
// the salient content word from their last answer and ask about THAT, so the
// conversation follows the topic for the full depth cap. Deterministic, no LLM.
// Falls back to "that" only when no concrete word is found (never worse than
// the old generic line). Scripted pattern questions still lead, so scripted
// topics are unchanged.

const SALIENCE_DET_OR_PREP = new Set([
  "a", "an", "the", "my", "your", "his", "her", "our", "their",
  "at", "to", "in", "of", "on", "with", "about", "from",
]);

const SALIENCE_STOPWORDS = new Set([
  ...SALIENCE_DET_OR_PREP,
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "us", "them",
  "this", "that", "these", "those", "mine", "yours", "its",
  "am", "is", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "have", "has", "had",
  "will", "would", "can", "could", "shall", "should", "may", "might", "must",
  "go", "going", "went", "get", "got", "getting", "make", "made", "making",
  "like", "liked", "want", "wanted", "need", "needed", "see", "saw", "know",
  "knew", "think", "thought", "said", "say", "says", "tell", "told", "take",
  "took", "buy", "bought", "come", "came", "give", "gave", "use", "used",
  "and", "but", "or", "if", "so", "because", "when", "while", "then", "than",
  "as", "for", "there", "here", "very", "really", "just", "also", "too",
  "what", "where", "why", "who", "how", "which", "whose",
  "not", "no", "yes", "okay", "ok", "please", "one", "more", "much", "many",
  "good", "bad", "nice", "big", "small", "old", "new", "great",
  "thing", "things", "stuff", "time", "way", "lot", "bit", "kind", "sort",
  "today", "yesterday", "tomorrow", "now", "day", "night",
  // Common adjectives / states — never a good topic noun ("the tired"); when a
  // sentence has only these, the follow-up degrades to "that".
  "tired", "happy", "sad", "busy", "hungry", "thirsty", "sick", "fine", "sure",
  "ready", "sorry", "sunny", "rainy", "cloudy", "hot", "cold", "warm", "cool",
  "tall", "fast", "slow", "easy", "hard", "fun", "funny", "boring", "tasty",
  "expensive", "cheap", "beautiful", "ugly", "important", "difficult",
  "interesting", "angry", "scared", "excited", "bored", "free", "late", "early",
]);

function salienceTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function isSalienceContent(token: string): boolean {
  return token.length >= 3 && !SALIENCE_STOPWORDS.has(token);
}

/**
 * Pull the salient content noun from the learner's answer. Prefers a noun
 * directly after a determiner/preposition (a/the/at/to/… → the object), the
 * most reliable concrete-topic signal; falls back to the last content word;
 * returns null when nothing concrete is found.
 */
export function extractSalientKeyword(learnerText: string): string | null {
  const tokens = salienceTokens(learnerText);
  let afterDeterminer: string | null = null;
  for (let i = 0; i < tokens.length - 1; i++) {
    if (!SALIENCE_DET_OR_PREP.has(tokens[i])) continue;
    for (let j = i + 1; j < tokens.length; j++) {
      if (SALIENCE_DET_OR_PREP.has(tokens[j])) continue; // skip "at a" → "shop"
      if (isSalienceContent(tokens[j])) afterDeterminer = tokens[j];
      break;
    }
  }
  if (afterDeterminer) return afterDeterminer;
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (isSalienceContent(tokens[i])) return tokens[i];
  }
  return null;
}

const SALIENCE_FRAMES: ReadonlyArray<(ref: string) => string> = [
  (ref) => `Tell me more about ${ref}.`,
  (ref) => `What do you like about ${ref}?`,
  (ref) => `Why did you choose ${ref}?`,
  (ref) => `What did you do with ${ref} after that?`,
  (ref) => `Can you describe ${ref} a little more?`,
];

/**
 * Salience-following follow-up questions for the learner's last answer. Frame
 * order rotates by `turnsOnTopic` so the style varies across rounds; combined
 * with the changing keyword, no two rounds repeat. There are >= DEPTH_CAP
 * frames so a topic never runs dry before the cap.
 */
function buildSalienceFollowUps(learnerText: string, turnsOnTopic: number): string[] {
  const keyword = extractSalientKeyword(learnerText);
  const ref = keyword ? `the ${keyword}` : "that";
  const offset = ((turnsOnTopic % SALIENCE_FRAMES.length) + SALIENCE_FRAMES.length) % SALIENCE_FRAMES.length;
  return SALIENCE_FRAMES.map(
    (_, i) => SALIENCE_FRAMES[(i + offset) % SALIENCE_FRAMES.length](ref),
  );
}

export const SPEAK_FOLLOW_UP_PATTERNS: readonly SpeakFollowUpPattern[] = [
  {
    id: "bicycle-hat-summer",
    test: /\bi bought\b.*\bbicycle\b.*\bhat\b|\bi bought\b.*\bhat\b.*\bbicycle\b/i,
    questions: ["Where did you buy it?", "How often do you bike in the summer?", "Is it very sunny where you live?"],
  },
  {
    id: "hat-biking-summer",
    test: /\bi bought\b.*\bhat\b.*\b(?:summer|bike|biking|sunny|canada)\b/i,
    questions: ["Why do you need the hat?", "How often do you bike in the summer?", "Is it very sunny where you live?"],
  },
  {
    id: "bought-hat-yesterday",
    test: /\bi bought\b.*\bhat\b.*\byesterday\b/i,
    questions: ["Where did you buy it?", "Why do you need the hat?", "Is it very sunny where you live?"],
  },
  {
    id: "dinner-family",
    test: /\bi (?:had|ate)\b.*\bdinner\b.*\bfamily\b/i,
    questions: ["What did you eat?", "Who cooked dinner?"],
  },
  {
    id: "evening-home-dinner",
    test: /\bevening\b.*\b(?:go|went|come|came) home\b.*\bdinner\b/i,
    questions: ["What do you usually eat for dinner?", "Who do you eat dinner with?"],
  },
  {
    id: "go-to-work",
    test: /\b(?:go|went) to work\b|\barrive(?:d)? at work\b/i,
    questions: ["What do you usually do when you arrive?", "What is your first task at work?"],
  },
  {
    id: "office-tasks",
    test: /\boffice\b|\btasks?\b|\bboss\b|\bcolleagues?\b/i,
    questions: ["What is your first task there?", "Who do you usually talk to at the office?"],
  },
  {
    id: "lunch-colleagues",
    test: /\blunch\b.*\bcolleagues?\b|\bcolleagues?\b.*\blunch\b/i,
    questions: ["What do you usually eat for lunch?", "Where do you eat with your colleagues?"],
  },
  {
    id: "coffee-email",
    test: /\bcoffee\b.*\bemail\b|\bemail\b.*\bcoffee\b/i,
    questions: ["What do you usually check first?", "Do you drink coffee before work?"],
  },
  {
    id: "market-food",
    test: /\b(?:market|store|shop)\b.*\b(?:food|buy|bought)\b|\b(?:buy|bought)\b.*\bfood\b/i,
    questions: ["What did you buy?", "Who did you buy food for?"],
  },
];

export function getSpeakFollowUpTopicId(sentence: string): string {
  const normalized = sentence.replace(/\s+/g, " ").trim();
  const pattern = SPEAK_FOLLOW_UP_PATTERNS.find((candidate) => candidate.test.test(normalized));
  return pattern?.id ?? "generic";
}

export function resolveSpeakFollowUpTopicId({
  seedSentence,
  learnerText,
  currentTopicId,
}: SpeakFollowUpTopicInput): string {
  const learnerTopicId = learnerText ? getSpeakFollowUpTopicId(learnerText) : "generic";
  if (learnerTopicId !== "generic") return learnerTopicId;

  if (currentTopicId && currentTopicId !== "generic") return currentTopicId;

  return seedSentence ? getSpeakFollowUpTopicId(seedSentence) : "generic";
}

export function selectSpeakFollowUpByTopicId(
  topicId: string,
  options: {
    askedQuestions?: readonly string[];
    turnsOnTopic?: number;
    /** The learner's last answer, used to follow their words when no scripted
     * topic pattern matches (and as extra depth when one does). */
    learnerText?: string;
  } = {},
): SpeakFollowUpSelection {
  const pattern = SPEAK_FOLLOW_UP_PATTERNS.find((candidate) => candidate.id === topicId);
  const resolvedTopicId = pattern?.id ?? "generic";
  const asked = new Set((options.askedQuestions ?? []).map((question) => question.trim().toLowerCase()));
  const turnsOnTopic = options.turnsOnTopic ?? 0;

  if (turnsOnTopic >= SPEAK_FOLLOW_UP_DEPTH_CAP) {
    return { topicId: resolvedTopicId, question: SPEAK_FOLLOW_UP_PIVOT, isPivot: true };
  }

  // Scripted pattern questions still lead (no regression for known topics);
  // salience-following questions referencing the learner's own words replace
  // the old generic dead-end, so arbitrary topics keep following the learner.
  const candidates = [
    ...(pattern?.questions ?? []),
    ...buildSalienceFollowUps(options.learnerText ?? "", turnsOnTopic),
  ];
  const question = candidates.find((candidate) => !asked.has(candidate.trim().toLowerCase()));
  if (!question) {
    return { topicId: resolvedTopicId, question: SPEAK_FOLLOW_UP_PIVOT, isPivot: true };
  }

  return { topicId: resolvedTopicId, question, isPivot: false };
}

export function selectSpeakFollowUp(
  sentence: string,
  options: {
    askedQuestions?: readonly string[];
    turnsOnTopic?: number;
  } = {},
): SpeakFollowUpSelection {
  return selectSpeakFollowUpByTopicId(getSpeakFollowUpTopicId(sentence), {
    ...options,
    learnerText: sentence,
  });
}

export function calculateSentenceMatchPercent(spoken: string, target: string): number {
  const spokenWords = normalizeWords(spoken);
  const targetWords = normalizeWords(target);
  if (!spokenWords.length || !targetWords.length) return 0;

  const targetCounts = new Map<string, number>();
  for (const word of targetWords) {
    targetCounts.set(word, (targetCounts.get(word) ?? 0) + 1);
  }

  let matched = 0;
  for (const word of spokenWords) {
    const count = targetCounts.get(word) ?? 0;
    if (count > 0) {
      matched += 1;
      targetCounts.set(word, count - 1);
    }
  }

  const precision = matched / spokenWords.length;
  const recall = matched / targetWords.length;
  if (precision + recall === 0) return 0;
  return Math.round((2 * precision * recall / (precision + recall)) * 100);
}

function normalizeWords(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}' ]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}
