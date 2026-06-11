// src/lib/tutor/learnerHistoryProfile.ts
//
// Learner History Profile — Step 14 scaffold.
//
// DESIGN INTENT
// =============
// This type captures a per-learner summary that is richer than the existing
// TutorMemorySummary (which is per-product/language aggregate) and includes:
//   1. Per-topic mastery scores (from masteryGraph)
//   2. L1 interference patterns observed in corrections (Vietnamese-to-English)
//   3. Session cadence and mode preference
//
// PERSISTENCE
// ===========
// localStorage key: mercy.learnerHistoryProfile.v1.{product}.{targetLanguage}
//   — same scoping strategy as studySessionState and learningEvents
//   — profile is written after each session completion and after each correction
//   — max 4 KB; old interferencePatterns are pruned after 60 days of silence
//
// PRIVACY INVARIANTS
// ==================
// NEVER store: raw learner text, corrected sentences, transcripts, PII, JWT.
// Only store: safe topic tags, aggregate counts, timestamps, derived signals.
// (Mirrors the invariants in learningMemory.ts.)
//
// WIRING (deferred to A1)
// =======================
// The engine-wiring step (reading from IndexedDB / writing profile after each
// session) is A1's responsibility. This file is the contract they wire against.

import type { TutorProduct } from "@/lib/ai-tutor/learningMemory";
import type { TodayLessonMode } from "@/lib/tutor/todayLessonPlanner";

// ---------------------------------------------------------------------------
// Vietnamese → English interference pattern tags
// ---------------------------------------------------------------------------
// These tags map directly onto the error classes that the correction engine
// already detects (see correctionRules/en.ts). They are safe: never raw text.
//
// Rationale for each tag:
//   missing-article     — Vietnamese has no determiner articles (a/an/the).
//                         #1 observed error class in VN learner corpora.
//   tense-omission      — Vietnamese marks time adverbially, not by verb
//                         inflection. Learners often omit past/present markers.
//   subj-verb-agreement — Vietnamese verbs do not conjugate for person/number.
//   preposition-calque  — Learners translate Vietnamese spatial/temporal prep
//                         phrases literally (e.g. "in the morning" → "at the
//                         morning").
//   word-order          — SVO is shared, but Vietnamese nominal modifiers come
//                         after the head noun, causing adjective-order errors.
//   zero-copula         — Vietnamese copula ("là") is frequently omitted in
//                         speech; learners carry this into writing.
//   double-negation     — Vietnamese uses double negation ("không … không");
//                         learners apply it in English.
export type VietEnInterferenceTag =
  | "missing-article"
  | "tense-omission"
  | "subj-verb-agreement"
  | "preposition-calque"
  | "word-order"
  | "zero-copula"
  | "double-negation"
  | (string & {});

export type InterferencePattern = {
  tag: VietEnInterferenceTag;
  observedCount: number;
  lastSeenAt: number;
};

// ---------------------------------------------------------------------------
// Learner History Profile
// ---------------------------------------------------------------------------
export type LearnerHistoryProfile = {
  product: TutorProduct;
  targetLanguage: string;

  // Per-topic mastery scores, 0–100. Keys are safe topic tags (kebab-case).
  // Updated by merging with the latest masteryGraph output after each session.
  topicMastery: Record<string, number>;

  // L1 interference patterns from corrections. Pruned after 60-day silence.
  interferencePatterns: InterferencePattern[];

  // Aggregate session counts.
  sessionCount: number;
  completedSessionCount: number;

  // Derived mode preference from learningEvents. null = not enough data.
  preferredMode: TodayLessonMode | null;

  // Unix ms of last profile update.
  updatedAt: number;
};

// ---------------------------------------------------------------------------
// Profile persistence helpers
// ---------------------------------------------------------------------------
const STORAGE_PREFIX = "mercy.learnerHistoryProfile.v1";
const PRUNE_AGE_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

export function getLearnerHistoryProfileKey(
  product: TutorProduct,
  targetLanguage: string,
): string {
  return `${STORAGE_PREFIX}.${normalizeKeyPart(product)}.${normalizeKeyPart(targetLanguage)}`;
}

export function createEmptyLearnerHistoryProfile(
  product: TutorProduct,
  targetLanguage: string,
  now = Date.now(),
): LearnerHistoryProfile {
  return {
    product: normalizeKeyPart(product) as TutorProduct,
    targetLanguage: normalizeKeyPart(targetLanguage),
    topicMastery: {},
    interferencePatterns: [],
    sessionCount: 0,
    completedSessionCount: 0,
    preferredMode: null,
    updatedAt: now,
  };
}

export function loadLearnerHistoryProfile(
  product: TutorProduct,
  targetLanguage: string,
): LearnerHistoryProfile | null {
  const storage = getLocalStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(getLearnerHistoryProfileKey(product, targetLanguage));
    if (!raw) return null;
    return normalizeLearnerHistoryProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveLearnerHistoryProfile(
  profile: LearnerHistoryProfile,
  now = Date.now(),
): LearnerHistoryProfile {
  const pruned = pruneOldInterferencePatterns(profile, now);
  const storage = getLocalStorage();
  if (!storage) return pruned;

  try {
    storage.setItem(
      getLearnerHistoryProfileKey(pruned.product, pruned.targetLanguage),
      JSON.stringify(pruned),
    );
  } catch {
    // Best-effort; quota/private-mode failures must not block study.
  }

  return pruned;
}

// ---------------------------------------------------------------------------
// Merge helpers (called by the engine after each session — A1's wiring)
// ---------------------------------------------------------------------------

export function mergeTopicMastery(
  profile: LearnerHistoryProfile,
  incoming: Record<string, number>,
): LearnerHistoryProfile {
  const merged: Record<string, number> = { ...profile.topicMastery };
  for (const [topic, score] of Object.entries(incoming)) {
    const safe = Math.min(100, Math.max(0, Math.round(score)));
    merged[topic] = safe;
  }
  return { ...profile, topicMastery: merged };
}

export function recordInterferencePattern(
  profile: LearnerHistoryProfile,
  tag: VietEnInterferenceTag,
  now = Date.now(),
): LearnerHistoryProfile {
  const existing = profile.interferencePatterns.find((p) => p.tag === tag);
  const updated: InterferencePattern[] = existing
    ? profile.interferencePatterns.map((p) =>
        p.tag === tag
          ? { ...p, observedCount: p.observedCount + 1, lastSeenAt: now }
          : p,
      )
    : [
        ...profile.interferencePatterns,
        { tag, observedCount: 1, lastSeenAt: now },
      ];
  return { ...profile, interferencePatterns: updated };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
function pruneOldInterferencePatterns(
  profile: LearnerHistoryProfile,
  now: number,
): LearnerHistoryProfile {
  const cutoff = now - PRUNE_AGE_DAYS * DAY_MS;
  return {
    ...profile,
    interferencePatterns: profile.interferencePatterns.filter(
      (p) => p.lastSeenAt >= cutoff,
    ),
  };
}

function normalizeLearnerHistoryProfile(raw: unknown): LearnerHistoryProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<LearnerHistoryProfile>;
  if (!r.product || !r.targetLanguage) return null;

  return {
    product: normalizeKeyPart(r.product),
    targetLanguage: normalizeKeyPart(r.targetLanguage),
    topicMastery: normalizeTopicMastery(r.topicMastery),
    interferencePatterns: normalizeInterferencePatterns(r.interferencePatterns),
    sessionCount: Math.max(0, Math.floor(Number(r.sessionCount) || 0)),
    completedSessionCount: Math.max(0, Math.floor(Number(r.completedSessionCount) || 0)),
    preferredMode: normalizeMode(r.preferredMode),
    updatedAt: Math.floor(Number(r.updatedAt) || 0),
  };
}

function normalizeTopicMastery(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value)) {
    const score = Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
    const key = String(k).slice(0, 48).trim();
    if (key) out[key] = score;
  }
  return out;
}

function normalizeInterferencePatterns(value: unknown): InterferencePattern[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const p = item as Partial<InterferencePattern>;
      const tag = String(p.tag ?? "").slice(0, 48).trim();
      if (!tag) return null;
      return {
        tag: tag as VietEnInterferenceTag,
        observedCount: Math.max(0, Math.floor(Number(p.observedCount) || 0)),
        lastSeenAt: Math.floor(Number(p.lastSeenAt) || 0),
      };
    })
    .filter((p): p is InterferencePattern => p !== null);
}

const MODES = new Set(["journey", "grammar", "speak", "logic"]);

function normalizeMode(value: unknown): TodayLessonMode | null {
  return typeof value === "string" && MODES.has(value)
    ? (value as TodayLessonMode)
    : null;
}

function normalizeKeyPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined")
    return null;
  return window.localStorage;
}
