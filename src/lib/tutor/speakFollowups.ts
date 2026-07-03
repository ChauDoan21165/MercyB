import {
  buildSpeakTopicCorrectionWeave,
  getSpeakTopicLibraryEntry,
  getSpeakTopicLibraryTopicId,
} from "./speakTopicLibrary";
import { isAcceptableFollowUp } from "./followUpIntelligence";

export type SpeakFollowUpPattern = {
  id: string;
  test: RegExp;
  questions: readonly string[];
};

export type SpeakFollowUpSelection = {
  topicId: string;
  question: string;
  isPivot: boolean;
  followUpId?: string;
  correctionSignalId?: string;
  correctionStatus?: "ship-safe" | "hold" | "abstain";
};

export type SpeakFollowUpTopicInput = {
  seedSentence?: string | null;
  learnerText?: string | null;
  currentTopicId?: string | null;
};

export const SPEAK_FOLLOW_UP_DEPTH_CAP = 4;
export const SPEAK_FOLLOW_UP_PIVOT = "Do you want to practice another sentence?";
export const SPEAK_TRANSCRIPT_ASK_TO_REPEAT =
  "Mercy chưa nghe rõ. Bạn nói lại câu đó nhé. I didn't catch that clearly. Can you say it again?";

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
  "a", "an", "the", "some", "my", "your", "his", "her", "our", "their",
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
  "any",
  "good", "bad", "nice", "big", "small", "old", "new", "great",
  "thing", "things", "stuff", "time", "way", "lot", "bit", "kind", "sort",
  "reason", "reasons", "idea", "ideas", "part", "parts", "case", "cases",
  "point", "points", "context", "contexts", "general", "secondhand",
  "guy", "guys", "someone", "somebody", "something", "anyone", "anybody",
  "anything", "everyone", "everybody", "everything",
  "today", "yesterday", "tomorrow", "now", "day", "night",
  // Common adjectives / states — never a good topic noun ("the tired"); when a
  // sentence has only these, the follow-up degrades to "that".
  "tired", "happy", "sad", "busy", "hungry", "thirsty", "sick", "fine", "sure",
  "ready", "sorry", "sunny", "rainy", "cloudy", "hot", "cold", "warm", "cool",
  "tall", "fast", "slow", "easy", "hard", "fun", "funny", "boring", "tasty",
  "expensive", "cheap", "beautiful", "ugly", "important", "difficult",
  "interesting", "angry", "scared", "excited", "bored", "free", "late", "early",
  // Proper-place nouns and STT fragments become awkward or misleading when
  // inserted after "the" in salience templates ("the Canada", "the I'm").
  "canada", "vietnam", "america", "usa", "california", "toronto", "vancouver",
  "hanoi", "saigon", "home",
]);

const SPEAK_UNCLEAR_TRANSCRIPT_PATTERNS = [
  /\bi bought ahead\b/i,
  /\byesterday we got this summer\b/i,
] as const;

function salienceTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\bsecond[-\s]+hand\b/g, " secondhand ")
    .replace(/[^a-z\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function isSalienceContent(token: string): boolean {
  if (token.length < 3 || SALIENCE_STOPWORDS.has(token)) return false;
  if (!/^[a-z]+$/.test(token)) return false;
  // Exclude likely verbs/participles (-ed / -ing) so the keyword is a noun:
  // "We talked …" must not yield "the talked". Loses a few real nouns
  // (e.g. "wedding") — acceptable; it degrades to the next candidate / "that".
  if (/(?:ed|ing)$/.test(token)) return false;
  return true;
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
      if (SALIENCE_STOPWORDS.has(tokens[j])) continue;
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

export function isSpeakTranscriptUnclearForFollowUp(learnerText: string): boolean {
  const normalized = learnerText.trim();
  if (!normalized) return true;
  return (
    SPEAK_UNCLEAR_TRANSCRIPT_PATTERNS.some((pattern) => pattern.test(normalized)) ||
    !assessSpeakTranscriptClarity(normalized).clear
  );
}

// ── Speak-seed coherence gate (Issue 1: don't push a garbled sample) ──
//
// A grammar-only correction can leave a sentence well-formed in tense yet still
// nonsensical ("I bought a pet yesterday bike around a lot." — only `buy→bought`
// was fixed). Treating that as a polished model to drill is dishonest. This is a
// DELIBERATELY narrow, high-precision detector: it flags the demonstrated
// failure class — a bare content noun dangling right after a time adverb with no
// connector — and defaults to `coherent` for everything else. Precision over
// recall: a false positive nags a learner whose sentence was fine, which is the
// worse error. Deterministic, no LLM. The caller only acts on this when BOTH the
// seed and the learner's own words are incoherent, so well-formed input is never
// blocked.

const COHERENCE_TIME_ADVERBS = new Set(["yesterday", "today", "tomorrow", "tonight"]);

// Temporal nouns that legitimately follow a time adverb ("yesterday morning").
const COHERENCE_TIME_ADVERB_FOLLOWERS = new Set([
  "morning", "afternoon", "evening", "night", "noon", "midnight",
]);

const COHERENCE_CONNECTORS = new Set([
  "and", "but", "or", "so", "because", "when", "while", "then", "that", "if",
  "before", "after", "since", "although", "though", "as", "until", "unless",
  "whether", "which", "who", "where", "why", "how",
]);

export type SpeakCoherenceAssessment = { coherent: boolean; reason: string };
export type SpeakTranscriptClarityAssessment = { clear: boolean; reason: string };

/**
 * Conservative coherence check for a Speak practice sentence. Returns
 * `coherent: false` only when a clear word-salad signal is present (a bare
 * content noun immediately after a time adverb with no connector — a dangling
 * fragment). Everything else passes. See the block comment above for why this is
 * intentionally narrow.
 */
export function assessSpeakSentenceCoherence(sentence: string): SpeakCoherenceAssessment {
  const tokens = salienceTokens(sentence);
  for (let i = 0; i < tokens.length - 1; i++) {
    if (!COHERENCE_TIME_ADVERBS.has(tokens[i])) continue;
    const next = tokens[i + 1];
    if (COHERENCE_CONNECTORS.has(next)) continue;            // "...yesterday because ..."
    if (COHERENCE_TIME_ADVERB_FOLLOWERS.has(next)) continue; // "yesterday morning"
    if (SALIENCE_STOPWORDS.has(next)) continue;              // pronoun/aux/prep after the adverb
    if (next.length < 3) continue;
    if (/(?:ed|ing)$/.test(next)) continue;                  // a following verb form, not a dangling noun
    return {
      coherent: false,
      reason: `dangling_token_after_time_adverb:${tokens[i]}->${next}`,
    };
  }
  return { coherent: true, reason: "no_incoherence_signal" };
}

const CLARITY_PREPOSITION_FRAGMENT_STARTERS = new Set([
  "about", "after", "at", "before", "for", "from", "in", "of", "on", "to", "with",
]);

const CLARITY_UNLIKELY_BUY_OBJECTS = new Set([
  "ahead", "again", "already", "away", "back", "behind", "here", "there", "today",
  "tomorrow", "yesterday",
]);

const CLARITY_COMMERCE_OR_NEED_VERBS = new Set([
  "buy", "bought", "need", "needed", "want", "wanted", "order", "ordered", "wear", "wearing",
]);

const CLARITY_HAT_CONFUSION_CONTEXT = new Set([
  "buy", "bought", "need", "needed", "want", "wanted", "order", "ordered", "wear", "wearing",
  "summer", "sunny", "sun", "hot", "canada",
]);

const CLARITY_PROPER_PLACE_WORDS = new Set([
  "canada", "vietnam", "america", "usa", "us", "california", "toronto", "vancouver",
  "hanoi", "saigon", "home",
]);

const CLARITY_INVALID_ARTICLE_TARGETS = new Set([
  "some", "any", "i'm", "im",
]);

const CLARITY_WEAK_NOUN_TARGETS = new Set([
  "guy", "guys", "someone", "somebody", "something", "anyone", "anybody",
  "anything", "everyone", "everybody", "everything", "person", "people",
]);

const CLARITY_WEAK_ABSTRACT_TARGETS = new Set([
  "general", "thing", "things", "stuff", "reason", "reasons", "idea", "ideas",
  "part", "parts", "way", "ways", "case", "cases", "point", "points",
  "context", "contexts", "problem", "problems",
]);

const CLARITY_FUNCTION_WORDS = new Set([
  ...SALIENCE_DET_OR_PREP,
  ...COHERENCE_CONNECTORS,
]);

const CLARITY_PRONOUN_TOKENS = new Set([
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "us", "them",
  "this", "that", "these", "those",
]);

function learnerReportsFollowUpIsUnclear(transcript: string): boolean {
  const normalized = transcript.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, " ").trim();
  const questionRef = "(?:(?:that|this|the|your)\\s+)?(?:follow[-\\s]*up\\s+)?question";
  return (
    new RegExp(`\\b(?:i\\s+)?(?:do\\s+not|don't|dont|did\\s+not|didn't|cannot|can't|cant)\\s+(?:understand|get)\\s+${questionRef}\\b`).test(normalized) ||
    new RegExp(`\\b${questionRef}\\s+(?:is|was|feels?|sounds?)\\s+(?:not\\s+clear|confusing|unclear|hard\\s+to\\s+understand)\\b`).test(normalized) ||
    new RegExp(`\\b${questionRef}\\s+(?:does\\s+not|doesn't|did\\s+not|didn't)\\s+make\\s+sense\\b`).test(normalized) ||
    /\bcau\s+hoi\s+(?:confusing|unclear|not\s+clear|khong\s+hieu)\b/.test(normalized) ||
    /\bkhong\s+hieu\s+(?:(?:that|this|the|your)\s+)?(?:follow[-\s]*up\s+)?question\b/.test(normalized) ||
    /\b(?:that|this|it)\s+(?:does\s+not|doesn't|did\s+not|didn't)\s+make\s+sense\b/.test(normalized) ||
    /\b(?:no|not)\s+sense\b/.test(normalized)
  );
}

function hasHatHomophoneConfusion(tokens: readonly string[]): boolean {
  if (!tokens.includes("head") && !tokens.includes("ahead")) return false;
  return tokens.some((token) => CLARITY_HAT_CONFUSION_CONTEXT.has(token));
}

function hasInvalidGeneratedFollowUpTarget(question: string, learnerText: string): boolean {
  const normalizedQuestion = question.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, " ").trim();
  const weakTargets = [
    ...CLARITY_WEAK_NOUN_TARGETS,
    ...CLARITY_WEAK_ABSTRACT_TARGETS,
  ].join("|");
  const invalidArticleTargetPattern = new RegExp(`\\bthe\\s+(some|any|i'm|im|canada|${weakTargets})\\b`, "g");
  for (const match of normalizedQuestion.matchAll(invalidArticleTargetPattern)) {
    const target = match[1];
    const afterTarget = normalizedQuestion.slice((match.index ?? 0) + match[0].length);
    if (target === "way" && /^\s+to\b/.test(afterTarget)) continue;
    return true;
  }
  if (/\bthe\s+(?:head|ahead)\b/.test(normalizedQuestion) && hasHatHomophoneConfusion(salienceTokens(learnerText))) {
    return true;
  }
  return false;
}

/**
 * Guard the Speak follow-up generator from bad STT. This is not a grammar
 * checker; it only blocks high-confidence transcript failures that would make
 * the deterministic salience fallback invent fake objects or topics.
 */
/**
 * Quality-gate an AI-generated follow-up question before showing it to the learner.
 *
 * Uses Teacher Mercy's follow-up intelligence layer (followUpIntelligence.ts) to
 * reject dead-end, off-topic, too-hard, or too-many follow-ups. Only follow-ups
 * rated "acceptable" or better pass through; poor ones are dropped so the caller
 * falls back to a safe generic prompt (ask-to-repeat / pivot).
 *
 * Pure function — deterministic, no I/O, no side effects.
 *
 * @param learnerText — what the learner just said/wrote (used to assess connection)
 * @param aiQuestion  — the AI-generated follow-up question (already normalized)
 * @returns the question string if acceptable, null if rejected
 */
export function validateAiSpeakFollowUp(
  learnerText: string,
  aiQuestion: string,
): string | null {
  if (!aiQuestion) return null;
  return isAcceptableFollowUp(learnerText, aiQuestion) ? aiQuestion : null;
}

export function assessSpeakTranscriptClarity(transcript: string): SpeakTranscriptClarityAssessment {
  const tokens = salienceTokens(transcript);
  if (tokens.length === 0) {
    return { clear: false, reason: "empty_transcript" };
  }

  if (learnerReportsFollowUpIsUnclear(transcript)) {
    return { clear: false, reason: "learner_reports_unclear_follow_up" };
  }

  if (tokens.length <= 3 && CLARITY_PREPOSITION_FRAGMENT_STARTERS.has(tokens[0])) {
    return { clear: false, reason: `preposition_fragment:${tokens.join("_")}` };
  }

  if (tokens.every((token) => CLARITY_FUNCTION_WORDS.has(token))) {
    return { clear: false, reason: `function_word_salad:${tokens.join("_")}` };
  }

  const lastToken = tokens[tokens.length - 1] ?? "";
  if (tokens.length >= 2 && SALIENCE_DET_OR_PREP.has(lastToken)) {
    return { clear: false, reason: `dangling_function_word:${lastToken}` };
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "the" && CLARITY_PROPER_PLACE_WORDS.has(tokens[i + 1] ?? "")) {
      return { clear: false, reason: `article_before_place:${tokens[i + 1]}` };
    }

    if (token === "the" && tokens[i + 1]?.includes("'")) {
      return { clear: false, reason: `article_before_contraction:${tokens[i + 1]}` };
    }

    if (token === "the" && CLARITY_INVALID_ARTICLE_TARGETS.has(tokens[i + 1] ?? "")) {
      return { clear: false, reason: `article_before_invalid_target:${tokens[i + 1]}` };
    }

    if (
      token === "the" &&
      (CLARITY_WEAK_NOUN_TARGETS.has(tokens[i + 1] ?? "") ||
        CLARITY_WEAK_ABSTRACT_TARGETS.has(tokens[i + 1] ?? "")) &&
      !(tokens[i + 1] === "way" && tokens[i + 2] === "to")
    ) {
      return { clear: false, reason: `article_before_weak_target:${tokens[i + 1]}` };
    }

    if (
      CLARITY_PREPOSITION_FRAGMENT_STARTERS.has(token) &&
      CLARITY_PRONOUN_TOKENS.has(tokens[i + 1] ?? "") &&
      CLARITY_WEAK_NOUN_TARGETS.has(tokens[i + 2] ?? "")
    ) {
      return { clear: false, reason: `weak_pronoun_target_fragment:${token}_${tokens[i + 1]}_${tokens[i + 2]}` };
    }

    if (
      CLARITY_WEAK_NOUN_TARGETS.has(token) &&
      tokens.some((candidate) => candidate === "sunny" || candidate === "summer") &&
      tokens.some((candidate) => candidate === "like" || candidate === "wear")
    ) {
      return { clear: false, reason: `weak_context_target:${token}` };
    }

    if (
      CLARITY_WEAK_ABSTRACT_TARGETS.has(token) &&
      tokens.some((candidate) => candidate === "sunny" || candidate === "summer" || candidate === "sunlight") &&
      tokens.some((candidate) => candidate === "like" || candidate === "wear" || candidate === "swim")
    ) {
      return { clear: false, reason: `weak_abstract_context_target:${token}` };
    }

    if (token === "lie" && tokens[i + 1] === "your" && tokens[i + 2] === "sunlight") {
      return { clear: false, reason: "broken_stt_phrase:lie_your_sunlight" };
    }

    if (token === "play" && tokens[i + 1] === "spot") {
      return { clear: false, reason: "broken_stt_phrase:play_spot" };
    }

    if (CLARITY_COMMERCE_OR_NEED_VERBS.has(token) && CLARITY_UNLIKELY_BUY_OBJECTS.has(tokens[i + 1] ?? "")) {
      return { clear: false, reason: `unlikely_buy_object:${tokens[i + 1]}` };
    }

    if (CLARITY_COMMERCE_OR_NEED_VERBS.has(token) && tokens[i + 1] === "the" && tokens[i + 2]?.includes("'")) {
      return { clear: false, reason: `broken_buy_object:${tokens[i + 2]}` };
    }

    if (
      CLARITY_COMMERCE_OR_NEED_VERBS.has(token) &&
      SALIENCE_DET_OR_PREP.has(tokens[i + 1] ?? "") &&
      (tokens[i + 2] === "head" || tokens[i + 2] === "ahead") &&
      hasHatHomophoneConfusion(tokens)
    ) {
      return { clear: false, reason: `hat_homophone_confusion:${tokens[i + 2]}` };
    }
  }

  return { clear: true, reason: "no_unclear_transcript_signal" };
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

function normalizeAskedQuestionKey(question: string): string {
  return question
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[?!.\s]+$/g, "");
}

function normalizeTurnsOnTopic(turnsOnTopic: number): number {
  if (!Number.isFinite(turnsOnTopic)) return 0;
  return Math.max(0, Math.floor(turnsOnTopic));
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
  if (pattern) return pattern.id;
  return getSpeakTopicLibraryTopicId(normalized) ?? "generic";
}

export function resolveSpeakFollowUpTopicId({
  seedSentence,
  learnerText,
  currentTopicId,
}: SpeakFollowUpTopicInput): string {
  if (learnerText?.trim() && !assessSpeakTranscriptClarity(learnerText).clear) {
    if (currentTopicId) return currentTopicId;
    return seedSentence ? getSpeakFollowUpTopicId(seedSentence) : "generic";
  }

  const learnerTopicId = learnerText ? getSpeakFollowUpTopicId(learnerText) : "generic";
  if (
    currentTopicId &&
    currentTopicId !== "generic" &&
    !currentTopicId.startsWith("topic-") &&
    learnerTopicId.startsWith("topic-")
  ) {
    return currentTopicId;
  }
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
  const libraryTopic = getSpeakTopicLibraryEntry(topicId);
  const resolvedTopicId = pattern?.id ?? libraryTopic?.id ?? "generic";
  const asked = new Set((options.askedQuestions ?? []).map(normalizeAskedQuestionKey));
  const turnsOnTopic = normalizeTurnsOnTopic(options.turnsOnTopic ?? 0);
  const learnerText = options.learnerText ?? "";

  if (learnerText.trim() && !assessSpeakTranscriptClarity(learnerText).clear) {
    return { topicId: resolvedTopicId, question: SPEAK_TRANSCRIPT_ASK_TO_REPEAT, isPivot: false };
  }

  if (turnsOnTopic >= SPEAK_FOLLOW_UP_DEPTH_CAP) {
    return { topicId: resolvedTopicId, question: SPEAK_FOLLOW_UP_PIVOT, isPivot: true };
  }

  if (libraryTopic) {
    const keyword = extractSalientKeyword(learnerText);
    const correctionWeave = buildSpeakTopicCorrectionWeave(learnerText);
    const candidates = libraryTopic.followUps.map((followUp, index) => {
      const slot = keyword;
      const baseQuestion =
        slot && followUp.salienceQuestion
          ? followUp.salienceQuestion.replace("{slot}", slot)
          : followUp.question;
      const question = index === turnsOnTopic && correctionWeave
        ? `${correctionWeave.promptPrefix} ${baseQuestion}`
        : baseQuestion;
      return {
        id: followUp.id,
        question,
      };
    });
    const ordered = [
      ...candidates.slice(turnsOnTopic),
      ...candidates.slice(0, turnsOnTopic),
    ];
    const selected = ordered.find((candidate) => !asked.has(normalizeAskedQuestionKey(candidate.question)));

    if (!selected) {
      return { topicId: resolvedTopicId, question: SPEAK_FOLLOW_UP_PIVOT, isPivot: true };
    }

    if (hasInvalidGeneratedFollowUpTarget(selected.question, learnerText)) {
      return { topicId: resolvedTopicId, question: SPEAK_TRANSCRIPT_ASK_TO_REPEAT, isPivot: false };
    }

    return {
      topicId: resolvedTopicId,
      question: selected.question,
      isPivot: false,
      followUpId: selected.id,
      correctionSignalId: correctionWeave?.signalId,
      correctionStatus: correctionWeave?.status,
    };
  }

  // Ordering:
  //  - Turn 0 (the first question, posed off the SEED sentence): scripted
  //    pattern questions lead so a known topic opens with its strong canned
  //    question; the generic case still gets salience.
  //  - Turn 1+ AND the learner's latest answer yields a concrete keyword:
  //    salience leads, so the follow-up follows the learner's OWN words rather
  //    than marching through canned topic trivia that ignores what they said.
  //  - Turn 1+ but no concrete keyword (e.g. "It was very good."): scripted
  //    leads, keeping the good canned question instead of a vague "...that?".
  const scriptedQuestions = pattern?.questions ?? [];
  const salienceQuestions = buildSalienceFollowUps(learnerText, turnsOnTopic);
  const followsLearner = turnsOnTopic >= 1 && extractSalientKeyword(learnerText) !== null;
  const candidates = followsLearner
    ? [...salienceQuestions, ...scriptedQuestions]
    : [...scriptedQuestions, ...salienceQuestions];
  const question = candidates.find((candidate) => !asked.has(normalizeAskedQuestionKey(candidate)));
  if (!question) {
    return { topicId: resolvedTopicId, question: SPEAK_FOLLOW_UP_PIVOT, isPivot: true };
  }

  if (hasInvalidGeneratedFollowUpTarget(question, learnerText)) {
    return { topicId: resolvedTopicId, question: SPEAK_TRANSCRIPT_ASK_TO_REPEAT, isPivot: false };
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
