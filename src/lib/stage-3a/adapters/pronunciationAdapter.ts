// src/lib/stage-3a/adapters/pronunciationAdapter.ts
//
// Stage-3A Local Weakness Map — pronunciation adapter.
//
// One of three sibling adapter PRs per docs/stage-3a/local-weakness-map-design.md.
// Captures per-phoneme accuracy from the Speak-tab pronunciation flow
// into a small local ring-buffer that the Stage-3A aggregator
// (`aggregate-weaknesses.ts`, PR 2) reads on the /weakness-map screen.
//
// Local-only by design:
//   - localStorage key `mb.stage3a.pronunciation.recent` only — no
//     Supabase write, no network call, no shared state.
//   - Does NOT duplicate the `/progress` dashboard's Supabase aggregation;
//     that path stays the long-term source of truth. This adapter exists
//     for the within-session "what am I weakest at right now" surface.
//   - Tolerates missing / disabled / quota-exceeded localStorage: every
//     I/O is wrapped in try/catch so a failed write never crashes the
//     Speak tab's primary path.
//
// FIFO cap of 100 entries: dropping the oldest when full. Bounded
// storage footprint per the design doc's "≤ 4 KB per key, ≤ 12 KB
// total Stage-3A" budget.
//
// PhonemeResult shape is the canonical adapter type — the design doc's
// example shape (`{phoneme, score, t}`) used different field names;
// the dispatch locks the contract here as `{phoneme, accuracy, ts,
// painPointAxis?}`. The optional `painPointAxis` lets a caller tag
// the phoneme with one of the §5-named pain-point classes from
// `vn-phoneme-map.ts` (TH_T / R_L / ED_ENDINGS / S_PLURALS / STRESS /
// INTONATION) when the axis is known at emit time. The aggregator may
// also derive the axis at read time from `phoneme` alone — populating
// it here is a performance hint, not a requirement.

/**
 * Pain-point axes named in STRATEGY §5 item 3. Mirrors the
 * `PROBLEM_PAIRS_*` constants in `src/lib/pronunciation/vn-phoneme-map.ts`.
 */
export type PainPointAxis =
  | 'TH_T'
  | 'R_L'
  | 'ED_ENDINGS'
  | 'S_PLURALS'
  | 'STRESS'
  | 'INTONATION';

/** Single pronunciation observation. */
export interface PhonemeResult {
  /** Phoneme symbol as the scorer returned it (Azure IPA-flavoured /
   *  SAPI-mix, or the local-fallback equivalent). Stored verbatim. */
  phoneme: string;
  /** 0..100 accuracy from the scorer. Higher is better. */
  accuracy: number;
  /** ms since epoch — capture time, used for the 14-day rolling window
   *  the aggregator applies in PR 2. */
  ts: number;
  /** Optional pre-tagged pain-point axis. Aggregator may derive its
   *  own classification from `phoneme` if absent. */
  painPointAxis?: PainPointAxis;
}

/** localStorage key. Exported for tests + the aggregator. */
export const PRONUNCIATION_RECENT_KEY = 'mb.stage3a.pronunciation.recent';

/** FIFO cap. Drop the oldest entry when full. */
export const PRONUNCIATION_RECENT_MAX = 100;

const VALID_AXES: ReadonlySet<string> = new Set<PainPointAxis>([
  'TH_T',
  'R_L',
  'ED_ENDINGS',
  'S_PLURALS',
  'STRESS',
  'INTONATION',
]);

function safeGetStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    if (typeof window.localStorage === 'undefined') return null;
    // Touch it — Safari private mode throws on getItem, not on access.
    window.localStorage.getItem(PRONUNCIATION_RECENT_KEY);
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Validate one parsed entry. Returns the entry if usable, null if not.
 * Keeps reads resilient against schema drift (older entries in a
 * user's browser from prior sessions).
 */
function sanitizeEntry(raw: unknown): PhonemeResult | null {
  if (raw === null || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.phoneme !== 'string' || r.phoneme.length === 0) return null;
  if (typeof r.accuracy !== 'number' || !Number.isFinite(r.accuracy)) return null;
  if (typeof r.ts !== 'number' || !Number.isFinite(r.ts)) return null;
  const out: PhonemeResult = {
    phoneme: r.phoneme,
    accuracy: r.accuracy,
    ts: r.ts,
  };
  if (typeof r.painPointAxis === 'string' && VALID_AXES.has(r.painPointAxis)) {
    out.painPointAxis = r.painPointAxis as PainPointAxis;
  }
  return out;
}

/**
 * Read the recent-pronunciation ring buffer. Returns `[]` on any
 * failure (no storage, parse error, schema drift, quota). Never
 * throws — callers shouldn't need a try/catch.
 */
export function readPronunciationRecent(): PhonemeResult[] {
  const storage = safeGetStorage();
  if (!storage) return [];
  let raw: string | null;
  try {
    raw = storage.getItem(PRONUNCIATION_RECENT_KEY);
  } catch {
    return [];
  }
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const out: PhonemeResult[] = [];
  for (const item of parsed) {
    const sane = sanitizeEntry(item);
    if (sane) out.push(sane);
  }
  return out;
}

/**
 * Append one or more pronunciation observations to the ring buffer.
 * Caps at `PRONUNCIATION_RECENT_MAX` entries, dropping the oldest
 * (FIFO). Silently no-ops if storage is unavailable or the write
 * fails (Safari private mode, quota exceeded). Callers must not
 * depend on the side effect for correctness — the local-weakness-map
 * screen degrades to "not enough signal yet" when this buffer is
 * empty, which is the correct empty state per the design doc.
 */
export function recordPronunciationPhonemes(phonemes: PhonemeResult[]): void {
  if (!Array.isArray(phonemes) || phonemes.length === 0) return;
  const storage = safeGetStorage();
  if (!storage) return;
  const valid: PhonemeResult[] = [];
  for (const p of phonemes) {
    const sane = sanitizeEntry(p);
    if (sane) valid.push(sane);
  }
  if (valid.length === 0) return;
  const existing = readPronunciationRecent();
  const merged = existing.concat(valid);
  // FIFO cap — keep the last MAX entries; drop the oldest.
  const capped =
    merged.length > PRONUNCIATION_RECENT_MAX
      ? merged.slice(merged.length - PRONUNCIATION_RECENT_MAX)
      : merged;
  try {
    storage.setItem(PRONUNCIATION_RECENT_KEY, JSON.stringify(capped));
  } catch {
    // Quota exceeded / disabled — silently degrade. Aggregator's
    // empty-state branch covers the user-visible case.
  }
}
