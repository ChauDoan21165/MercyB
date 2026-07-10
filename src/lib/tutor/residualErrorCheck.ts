// Residual-error check on ALREADY-CORRECTED output.
//
// WHY THIS EXISTS
//   The correction engine can return status "corrected" — i.e. confident — on a
//   sentence it only PARTIALLY fixed. That output is then promoted into the
//   speak-practice model slot, so the learner reads broken English aloud and
//   imitates it. Five reproduced examples (learner input → promoted-as-model):
//
//     "Yesterday I go to school and I no have book."
//       → "Yesterday I went to school and I no have book."      (negation left)
//     "He go to work by bus everyday and he no late."
//       → "He goes to work by bus everyday and he no late."     (negation left)
//     "My father he is teacher and he teach math at school."
//       → "My father he is a teacher and he teach math at school."  (agreement left)
//     "There have many people in the party yesterday."
//       → "There are many people in the party yesterday there."  (doubled "there")
//     "Because I am tired, so I go sleep early."
//       → "Because I am tired, I go sleep early."                (bare-infinitive)
//
//   In every case a single clause-level rule fired, declared success, and the
//   remaining clause was never re-examined.
//
// WHAT THIS IS NOT
//   Not a grammar checker. It answers exactly one question: "does this corrected
//   sentence still carry an error from a class we can detect CONFIDENTLY?" Four
//   closed, evidence-derived classes, listed below. Anything outside them is
//   deliberately un-gated.
//
// PRECISION IS THE LOAD-BEARING PROPERTY
//   A false positive silently withholds a GOOD correction from the learner — a
//   worse outcome than the bug being fixed. Every pattern here is closed-class
//   (explicit word lists, no part-of-speech guessing) and every exclusion below
//   exists because a real grammatical English sentence would otherwise be
//   flagged. When in doubt, DO NOT FLAG.
//
// NOTE — re-running correctWithTutorRules on its own output does not work as a
// residual check. It returns "unchanged" for all five broken outputs above (it
// has no detector for them) and returns "needs_ai" for clean sentences such as
// "I do not understand what the teacher said yesterday." Wrong in both
// directions; hence this independent, purpose-built check.

/** The error classes this check can detect. Keep in sync with the tests. */
export type ResidualErrorClass =
  | "uncorrected-negation"
  | "subject-verb-agreement"
  | "doubled-token"
  | "bare-infinitive-after-motion-verb";

export type ResidualErrorFinding = {
  errorClass: ResidualErrorClass;
  /** The exact substring that triggered the flag — for logging, never shown to learners. */
  evidence: string;
};

// ---------------------------------------------------------------------------
// C1 — uncorrected negation: `no` used as a VERBAL negator ("I no have book").
//
// "no" is a perfectly good determiner ("I have no book", "there is no problem"),
// so we only flag it in positions where it can never be one.
// ---------------------------------------------------------------------------

/** Followers that make a subject+`no` sequence grammatical: "I no longer live here." */
const NEGATION_SAFE_FOLLOWERS = ["longer", "doubt", "one", "body", "thing", "where", "matter"];

/**
 * Auxiliaries/copulas that `no` can never legally precede. "no have", "no is".
 * `can` is deliberately omitted — "there is no can of soup" would false-flag,
 * and subject-pronoun + "no can" is already caught by the pronoun pattern.
 */
const NEGATION_ILLEGAL_FOLLOWERS = [
  "have", "has", "had", "will", "do", "does", "did", "is", "are", "am", "was", "were",
];

const SUBJECT_PRONOUNS = ["i", "you", "he", "she", "it", "we", "they"];

function detectUncorrectedNegation(text: string): ResidualErrorFinding | null {
  const lower = text.toLowerCase();

  // (a) subject pronoun + "no" → "I no have book", "he no late", "he no can buy".
  //     Never grammatical, whatever follows, except the safe-follower list.
  const pronounNo = new RegExp(
    `\\b(${SUBJECT_PRONOUNS.join("|")})\\s+no\\s+(?!(?:${NEGATION_SAFE_FOLLOWERS.join("|")})\\b)(\\w+)`,
    "i",
  );
  const a = pronounNo.exec(lower);
  if (a) return { errorClass: "uncorrected-negation", evidence: a[0] };

  // (b) "no" directly before an auxiliary/copula → catches non-pronoun subjects,
  //     e.g. "My father no have money."
  const noAux = new RegExp(`\\bno\\s+(${NEGATION_ILLEGAL_FOLLOWERS.join("|")})\\b`, "i");
  const b = noAux.exec(lower);
  if (b) return { errorClass: "uncorrected-negation", evidence: b[0] };

  return null;
}

// ---------------------------------------------------------------------------
// C2 — subject-verb agreement left unfixed: "he teach math".
//
// Closed list of common learner base verbs. Verbs whose BASE FORM is identical
// to their PAST form are excluded outright (read/put/cut/hit/let/set/cost/hurt/
// shut/spread/quit) — "Yesterday he read a book" is correct English and must
// never be flagged.
// ---------------------------------------------------------------------------

const THIRD_SINGULAR_SUBJECTS = ["he", "she", "it"];

const BASE_VERBS = [
  "teach", "go", "have", "do", "make", "take", "like", "want", "need", "work",
  "live", "eat", "drink", "study", "play", "come", "get", "know", "think", "say",
  "speak", "run", "write", "buy", "sell", "love", "help", "look", "watch",
  "listen", "learn", "cook", "drive", "walk", "sleep", "sit", "stand", "open",
  "close", "start", "finish", "use", "call", "ask", "tell", "give", "keep",
  "feel", "seem", "become", "bring", "send", "meet", "leave", "arrive", "return",
  "understand", "remember", "forget", "wear", "wash", "clean", "visit", "travel",
  "enjoy", "hate", "hope", "wish", "believe", "agree", "decide", "try", "stay",
  "move", "happen", "appear", "belong", "mean", "own", "prefer", "realize",
];

/**
 * Auxiliaries/modals that, when they appear IMMEDIATELY BEFORE the subject
 * pronoun, make a following bare verb correct English through subject-aux
 * inversion: "Does he like it?", "Can he teach?", "Did she go?". Without this
 * guard every do-support question would be false-flagged.
 */
const INVERTING_AUXILIARIES = [
  "do", "does", "did", "can", "could", "will", "would", "shall", "should",
  "may", "might", "must",
];

function detectSubjectVerbAgreement(text: string): ResidualErrorFinding | null {
  const lower = text.toLowerCase();
  // A modal/auxiliary AFTER the pronoun ("he can teach", "he will teach") never
  // matches, because the token following the pronoun would be the modal, which is
  // not in BASE_VERBS. A modal/auxiliary BEFORE the pronoun ("does he like") is
  // subject-aux inversion and must be excluded explicitly.
  const pattern = new RegExp(
    `(?<!\\b(?:${INVERTING_AUXILIARIES.join("|")})\\s)` +
      `\\b(${THIRD_SINGULAR_SUBJECTS.join("|")})\\s+(${BASE_VERBS.join("|")})\\b`,
    "i",
  );
  const m = pattern.exec(lower);
  return m ? { errorClass: "subject-verb-agreement", evidence: m[0] } : null;
}

// ---------------------------------------------------------------------------
// C3 — doubled / garbled output produced by the engine itself.
//
// (a) The existential rule appends a trailing "there" to a sentence that already
//     opens with "There is/are/was/were" → "There are many people ... there."
// (b) Any consecutive repeated word ("the the"), minus the handful of legitimate
//     English doublings.
// ---------------------------------------------------------------------------

/**
 * Consecutive repeats that must not be flagged: "I had had enough", "he said that
 * that was fine". "very very" is informal emphasis, not a grammar error — and a
 * merely inelegant correction is still a correct one, so it must still promote.
 */
const LEGITIMATE_DOUBLES = ["had", "that", "very"];

/**
 * Particles that turn a trailing "there" into a legal locative: "over there",
 * "out there", "back there". Checked first — these are never the engine's bug.
 */
const LOCATIVE_PARTICLES = ["over", "out", "in", "up", "down", "back", "right", "around"];

/**
 * An adjunct anywhere before the trailing "there" means the locative slot is
 * already filled, so the trailing "there" is a redundant artifact rather than a
 * legal locative. Without one, "There are many people there." is ordinary
 * English and must still promote — even though the same rule produced it.
 */
const ADJUNCT_MARKERS = [
  "in", "on", "at", "under", "over", "near", "behind", "beside", "between",
  "inside", "outside", "by", "from", "with", "into", "onto",
  "yesterday", "today", "tomorrow", "tonight", "now", "then", "ago", "later", "earlier",
];

function detectDoubledToken(text: string): ResidualErrorFinding | null {
  const lower = text.toLowerCase();

  // (a) The existential rule (`en-existential-have-there-is`) appends " there."
  //     unconditionally. That is only an ERROR when a locative/temporal adjunct
  //     already occupies the slot — "…in the party yesterday there." Bare
  //     "There are many people there." is grammatical and must still promote.
  const existentialOpen = /^\s*there\s+(is|are|was|were)\b/i.test(lower);
  const trailingThere = /\bthere\s*[.!?]?\s*$/i.test(lower);
  if (existentialOpen && trailingThere) {
    const particleBefore = new RegExp(`\\b(${LOCATIVE_PARTICLES.join("|")})\\s+there\\s*[.!?]?\\s*$`, "i");
    if (!particleBefore.test(lower)) {
      // Look only at the span between the existential verb and the trailing "there".
      const middle = lower.replace(/^\s*there\s+(is|are|was|were)\b/i, "").replace(/\bthere\s*[.!?]?\s*$/i, "");
      const hasAdjunct = new RegExp(`\\b(${ADJUNCT_MARKERS.join("|")})\\b`, "i").test(middle);
      if (hasAdjunct) return { errorClass: "doubled-token", evidence: "there … there" };
    }
  }

  // (b) consecutive duplicate word.
  const dup = /\b(\w+)\s+\1\b/i.exec(lower);
  if (dup && !LEGITIMATE_DOUBLES.includes(dup[1].toLowerCase())) {
    return { errorClass: "doubled-token", evidence: dup[0] };
  }

  return null;
}

// ---------------------------------------------------------------------------
// C4 — bare infinitive after a motion verb: "I go sleep early" (→ "go to sleep").
//
// The least confident class, so the verb list is the tightest. Excluded on
// purpose: "go home"/"go out"/"go there" (not verbs), "go shopping"/"go
// swimming" (gerunds), "go get"/"come see" (idiomatic American English), and
// anything already carrying "to".
// ---------------------------------------------------------------------------

const MOTION_VERBS = ["go", "goes", "went", "come", "comes", "came"];
const BARE_COMPLEMENT_VERBS = ["sleep", "eat", "study", "buy", "drink", "cook", "swim", "shop", "rest"];

function detectBareInfinitiveAfterMotionVerb(text: string): ResidualErrorFinding | null {
  const pattern = new RegExp(
    `\\b(${MOTION_VERBS.join("|")})\\s+(${BARE_COMPLEMENT_VERBS.join("|")})\\b`,
    "i",
  );
  const m = pattern.exec(text.toLowerCase());
  return m ? { errorClass: "bare-infinitive-after-motion-verb", evidence: m[0] } : null;
}

// ---------------------------------------------------------------------------

const DETECTORS = [
  detectUncorrectedNegation,
  detectSubjectVerbAgreement,
  detectDoubledToken,
  detectBareInfinitiveAfterMotionVerb,
];

/**
 * Inspect an already-corrected sentence for a residual grammatical error.
 *
 * Returns the first confident finding, or `null` when the sentence is clean
 * *as far as this check can tell*. `null` means "not detectably broken", NOT
 * "proven correct" — the caller must treat it as permission to promote, not as
 * a grammaticality guarantee.
 *
 * Never throws: any unexpected input degrades to `null` (promote), preserving
 * today's behaviour rather than withholding a correction on a bug in this file.
 */
export function detectResidualError(corrected: string): ResidualErrorFinding | null {
  try {
    if (typeof corrected !== "string") return null;
    const text = corrected.trim();
    if (!text) return null;
    for (const detect of DETECTORS) {
      const finding = detect(text);
      if (finding) return finding;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Promotion gate. `true` when the corrected sentence is safe to hand to the
 * speak-practice model slot for the learner to read aloud and imitate.
 */
export function isSafeToPromote(corrected: string): boolean {
  return detectResidualError(corrected) === null;
}
