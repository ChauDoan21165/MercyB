/**
 * Step 11 seed — "awkward Vietlish" DARK detector.  Candidate: step11-vietlish-dark-seed.
 *
 * WHAT THIS IS
 *   A flag-gated, telemetry-only ("dark") detector for *grammatically possible*
 *   English that sounds unnatural because of Vietnamese L1 transfer. These are
 *   NOT errors the correction engine fixes — every positive below is valid
 *   English a parser accepts; it just isn't what a native speaker would say.
 *   We want to measure how often these surface in real learner traffic BEFORE
 *   committing to any learner-facing rule.
 *
 * WHAT THIS IS NOT
 *   - NOT a corrector. It emits no learner-facing text and rewrites nothing.
 *   - NOT the code-switching detector. `vinglish-detector.ts` catches literal
 *     Vietnamese tokens ("I want ăn cơm"). This catches all-English sentences
 *     with no VN tokens at all.
 *   - NOT wired into any learner path. This is a SEED: the detector + a
 *     flag-gated dark-emit wrapper exist and are unit-tested, but nothing in
 *     the product calls `runVietlishDarkSeed` yet. Promotion is a later step.
 *
 * DARK + FLAG-GATED
 *   `runVietlishDarkSeed` is a no-op unless the flag is on (default OFF). When
 *   on, it emits one Sentry `info` beacon per matched pattern via the same
 *   `captureMessage` sink the M4 empty-VI fallback uses — no user output.
 *   Flag id: `step11-vietlish-dark-seed`.  Env: `VITE_VIETLISH_DARK_SEED`.
 *
 * PRECISION POSTURE
 *   Dark means we tolerate some false positives in exchange for signal — but
 *   "no half-formed rule": each pattern is bounded by an explicit confusable
 *   whitelist/guard and ships a documented false-positive boundary for Lane B
 *   (see step11-vietlish-dark-seed-B-boundary-handoff.md). Confidence values
 *   are internal calibration estimates, never shown to a learner.
 *
 * Pure module — no Supabase/Deno imports, and (deliberately) no static import
 * of the telemetry sink: the default emit lazily loads `captureMessage` only
 * when a beacon actually fires, so importing this module pulls in nothing and
 * the detector is trivially testable under vitest.
 */

// ── Public types ──────────────────────────────────────────────────────────

export interface VietlishDarkSignal {
  /** Stable pattern id (kebab-case). Low-cardinality; safe as a telemetry tag. */
  patternId: VietlishDarkPatternId;
  /** Internal calibration estimate 0..1. NOT learner-facing. */
  confidence: number;
  /** The matched substring, lowercased. For telemetry/debugging only. */
  marker: string;
  /** Short internal note on why the phrasing is non-native. Internal only. */
  note: string;
}

export type VietlishDarkPatternId =
  | "vietlish-opinion-calque"
  | "vietlish-resumptive-topic"
  | "vietlish-play-device"
  | "vietlish-too-as-praise"
  | "vietlish-wish-you-greeting";

type Matcher = (text: string) => VietlishDarkSignal[];

// ── Helpers ────────────────────────────────────────────────────────────────

function norm(text: string): string {
  return (text ?? "").toString().replace(/\s+/g, " ").trim();
}

function signal(
  patternId: VietlishDarkPatternId,
  confidence: number,
  marker: string,
  note: string,
): VietlishDarkSignal {
  return { patternId, confidence, marker: marker.toLowerCase(), note };
}

// ── Pattern 1: opinion calque ("according to me" = "theo tôi") ──────────────
//
// "According to me, this film is good."  Native: "In my opinion, ...".
// FP boundary: "according to <3rd party / source>" is perfectly natural and
// MUST NOT fire — only first-person "according to me/us" is the VN marker.
const matchOpinionCalque: Matcher = (text) => {
  const out: VietlishDarkSignal[] = [];
  const m = /\baccording to (me|us)\b/i.exec(text);
  if (m) {
    out.push(
      signal(
        "vietlish-opinion-calque",
        0.8,
        m[0],
        "First-person 'according to me/us' calques 'theo tôi'; native form is 'in my opinion'.",
      ),
    );
  }
  return out;
};

// ── Pattern 2: resumptive topic pronoun ("My hometown, it is ...") ──────────
//
// Topic-prominent transfer: a fronted noun-phrase topic followed by a comma
// and a resumptive subject pronoun + copula/aux.  Grammatical (left-
// dislocation exists in English) but stilted in learner writing.
// FP boundary: non-restrictive appositives / relative clauses ("My brother,
// who lives in Hue, is a teacher") and vocatives ("Mom, she is right") — the
// pre-comma chunk must be a bare NP with NO verb, and we exclude a leading
// vocative pronoun.
const matchResumptiveTopic: Matcher = (text) => {
  const out: VietlishDarkSignal[] = [];
  const m =
    /^(?:my |our |the |this |that )?[a-z][a-z' ]{1,28},\s+(it|they|he|she)\s+(is|are|was|were|has|have)\b/i.exec(
      text,
    );
  if (m) {
    const head = m[0].slice(0, m[0].indexOf(","));
    // Guard: the topic chunk must not itself contain a finite verb (which would
    // make it a clause, not a dislocated topic).
    if (!/\b(is|are|was|were|has|have|do|does|did|who|which|that)\b/i.test(head)) {
      out.push(
        signal(
          "vietlish-resumptive-topic",
          0.5,
          m[0],
          "Fronted NP topic + resumptive subject pronoun calques VN topic-comment ('Quê tôi, nó rất đẹp').",
        ),
      );
    }
  }
  return out;
};

// ── Pattern 3: "play + device/app" ("play the phone" = "chơi điện thoại") ────
//
// "I play the phone every night."  Native: "I use my phone / scroll on my
// phone".  FP boundary: "play the piano/guitar/football/a game/cards/music"
// are all correct — so the object is a CLOSED device/app whitelist only.
const PLAY_DEVICE_OBJECT =
  /(phone|facebook|computer|internet|tiktok|zalo|youtube|laptop|ipad)/;
const matchPlayDevice: Matcher = (text) => {
  const out: VietlishDarkSignal[] = [];
  const re = new RegExp(
    `\\bplay(?:s|ed|ing)?\\s+(?:the\\s+|my\\s+|your\\s+|his\\s+|her\\s+)?${PLAY_DEVICE_OBJECT.source}\\b`,
    "i",
  );
  const m = re.exec(text);
  if (m) {
    out.push(
      signal(
        "vietlish-play-device",
        0.7,
        m[0],
        "'play + device/app' calques 'chơi điện thoại/Facebook'; native uses 'use/scroll/be on'.",
      ),
    );
  }
  return out;
};

// ── Pattern 4: "too + praise adjective" ("too delicious" = "quá ngon") ───────
//
// "This food is too delicious!"  Intended as praise; native: "so delicious".
// HIGHEST false-positive risk of the set — kept dark-only and low-confidence.
// Guards: (a) the adjective is a CLOSED positive-praise whitelist (excludes
// ambivalent 'sweet/spicy/hot/expensive/big' where 'too' genuinely means
// excess); (b) no "to <verb>" / "for <obj>" complement follows (which would
// be the legitimate "too X to/for Y" excess reading).
const PRAISE_ADJ =
  /(delicious|beautiful|good|cute|nice|interesting|amazing|wonderful|handsome|lovely|tasty|fun|funny|gorgeous|awesome)/;
const matchTooAsPraise: Matcher = (text) => {
  const out: VietlishDarkSignal[] = [];
  const re = new RegExp(`\\btoo\\s+${PRAISE_ADJ.source}\\b([^.?!]*)`, "i");
  const m = re.exec(text);
  if (m) {
    const tail = (m[2] ?? "").slice(0, 24);
    // Excess reading guard: "too good TO be true", "too beautiful FOR words".
    if (!/^\s*(to\s+\w|for\s+\w)/i.test(tail)) {
      out.push(
        signal(
          "vietlish-too-as-praise",
          0.35,
          `too ${m[1]}`,
          "'too + praise adjective' calques intensifier 'quá'; native uses 'so/really'. HIGH FP — dark only.",
        ),
      );
    }
  }
  return out;
};

// ── Pattern 5: "Wish you ..." greeting ("Wish you ..." = "Chúc bạn ...") ─────
//
// Subjectless sentence-initial "Wish you a nice day".  Native: "I wish you
// .../ Have a nice day".  FP boundary: with a subject ("I/We wish you ...") it
// is correct; and the counterfactual ellipsis "Wish you were here" must NOT
// fire — so we exclude "wish you were/had/would/could/...".
const matchWishYouGreeting: Matcher = (text) => {
  const out: VietlishDarkSignal[] = [];
  const m = /^\s*wish\s+(?:you|u)\s+(?!were\b|had\b|would\b|could\b|i\b|we\b)([a-z])/i.exec(
    text,
  );
  if (m) {
    out.push(
      signal(
        "vietlish-wish-you-greeting",
        0.65,
        "wish you",
        "Subjectless sentence-initial 'Wish you ...' calques 'Chúc bạn ...'; native uses 'I wish you / Have a ...'.",
      ),
    );
  }
  return out;
};

const MATCHERS: readonly Matcher[] = [
  matchOpinionCalque,
  matchResumptiveTopic,
  matchPlayDevice,
  matchTooAsPraise,
  matchWishYouGreeting,
];

// ── Detector (pure) ─────────────────────────────────────────────────────────

/**
 * Detect awkward-Vietlish patterns in a piece of (all-English) learner text.
 * Pure: no flag check, no telemetry, no learner-facing output. Returns every
 * pattern that matched (a sentence can trip more than one).
 */
export function detectVietlishDark(text: string): VietlishDarkSignal[] {
  const safe = norm(text);
  if (!safe) return [];
  const signals: VietlishDarkSignal[] = [];
  for (const matcher of MATCHERS) signals.push(...matcher(safe));
  return signals;
}

// ── Flag gate ───────────────────────────────────────────────────────────────

/**
 * DEFAULT OFF. Candidate flag id `step11-vietlish-dark-seed`, env
 * `VITE_VIETLISH_DARK_SEED`. Read locally (self-contained seed) so this can be
 * measured without touching the shared FEATURE_FLAGS registry or any gate
 * machinery; promotion should register it there.
 */
export function isVietlishDarkSeedEnabled(): boolean {
  try {
    const raw = (import.meta as { env?: Record<string, unknown> })?.env
      ?.VITE_VIETLISH_DARK_SEED;
    if (raw === undefined || raw === null || raw === "") return false;
    const s = String(raw).toLowerCase().trim();
    return s === "true" || s === "1" || s === "yes" || s === "on";
  } catch {
    return false;
  }
}

type EmitFn = (
  message: string,
  level: "info" | "warning" | "error",
  context?: Record<string, unknown>,
) => void;

/**
 * Default telemetry sink. Lazily imports `captureMessage` so this module has
 * no static dependency on the monitoring/Sentry graph; fire-and-forget so the
 * caller stays synchronous. No-op on any failure (SSR / tests / no DSN).
 */
const defaultEmit: EmitFn = (message, level, context) => {
  void import("@/lib/monitoring/captureException")
    .then((m) => m.captureMessage(message, level, context))
    .catch(() => {
      /* dark beacon is best-effort; never throw on a measurement path */
    });
};

export interface VietlishDarkSeedOptions {
  /** Override the flag (tests / explicit callers). Default: env flag, OFF. */
  enabled?: boolean;
  /** Override the telemetry sink (tests). Default: lazy captureMessage. */
  emit?: EmitFn;
}

/**
 * Flag-gated DARK entry point. No-op (returns []) when the flag is off.
 * When on, emits one `info` telemetry beacon per matched pattern and returns
 * the signals (for instrumentation/tests). Emits NOTHING a learner can see.
 *
 * Callers MUST dedupe before calling on a hot path (the sink does not) — this
 * seed is intentionally not wired to one yet.
 */
export function runVietlishDarkSeed(
  text: string,
  opts: VietlishDarkSeedOptions = {},
): VietlishDarkSignal[] {
  const enabled = opts.enabled ?? isVietlishDarkSeedEnabled();
  if (!enabled) return [];

  const signals = detectVietlishDark(text);
  if (signals.length === 0) return [];

  const emit = opts.emit ?? defaultEmit;
  for (const s of signals) {
    emit("[vietlish] awkward pattern detected (dark seed)", "info", {
      patternId: s.patternId,
      confidence: s.confidence,
      marker: s.marker,
      mechanism: "vietlish_dark_seed_v1",
      candidate: "step11-vietlish-dark-seed",
    });
  }
  return signals;
}
