/**
 * L1 follow-up loop (conversational loop v1).
 *
 * After a learner sentence is corrected and its L1 (Vietnamese-transfer) error
 * explained, the tutor should not stop at a single correction. This engine
 * decides the NEXT conversational move so the tutor can *circle the same
 * weakness* for a few turns — each time in a NEW context, never re-using the
 * sentence just corrected — and then gracefully offer to move on.
 *
 * Design constraints (from the loop-track brief):
 *   - Continue with a follow-up targeting the SAME detected L1 tag.
 *   - Use a new context, not the same sentence.
 *   - Circle the learner's weakness for a few turns, then offer to move on.
 *   - Low detector confidence → converse naturally (no forced follow-up).
 *   - Never fabricate a detected pattern.
 *   - In-session only; no cross-session planning, no persistence.
 *
 * This module is PURE: `advanceL1Focus` is a reducer over an in-session state
 * value that the caller holds in memory (React state / runtime). It performs no
 * I/O, reads no storage, and never writes anything cross-session — so it cannot
 * leak into another session. The follow-up prompts are pre-authored practice
 * content keyed by tag; the engine only ever *selects* one for a tag the
 * detector genuinely fired on, so it never invents a pattern.
 *
 * Confidence: the grammar detector is binary (`matched: true/false`) and has no
 * numeric confidence field. We derive a focus-worthy "high confidence" signal
 * from the same vetted gate the awareness chip uses — a real match on a tag in
 * `HIGH_SEVERITY_DETECTOR_TAGS` for which we also have authored practice
 * content. Everything else is "low": no forced loop, just converse naturally.
 */

import type {
  L1DetectionResult,
  L1WeaknessTag,
} from "@/lib/feedback/l1-error-detector";
import { HIGH_SEVERITY_DETECTOR_TAGS, TAG_TO_NAME_EN } from "./detectorHint";

// ────────────────────────────────────────────────────────────────────────
// Tuning
// ────────────────────────────────────────────────────────────────────────

/**
 * How many same-tag follow-up practices to deliver before offering to move on.
 * "A few turns" — kept small so the loop circles a weakness without nagging.
 * The first practice is delivered by `start_focus` (turn 1); the cap is the
 * total number of same-tag practices before the engine switches to an offer.
 */
export const L1_FOCUS_DEPTH_CAP = 3;

// ────────────────────────────────────────────────────────────────────────
// Confidence
// ────────────────────────────────────────────────────────────────────────

export type L1DetectionConfidence = "high" | "low";

/**
 * Map a detector firing to a focus-worthy confidence. HIGH only when the
 * detector genuinely matched AND the tag is in the high-severity allowlist.
 * No fabrication: a non-match or an out-of-allowlist tag is LOW, which routes
 * the loop to "converse naturally".
 */
export function classifyL1Confidence(
  detection: L1DetectionResult,
): L1DetectionConfidence {
  if (!detection.matched) return "low";
  return HIGH_SEVERITY_DETECTOR_TAGS.has(detection.weaknessTag) ? "high" : "low";
}

// ────────────────────────────────────────────────────────────────────────
// Follow-up practice bank (new contexts, keyed by tag)
// ────────────────────────────────────────────────────────────────────────

export interface L1FollowUpContext {
  /** Stable id, unique across the whole bank. Used to avoid repeats. */
  id: string;
  tag: L1WeaknessTag;
  /**
   * Vietnamese-first practice prompt inviting the learner to try the SAME
   * pattern in a NEW situation (never the sentence just corrected).
   */
  promptVi: string;
  /** A short English target frame the learner is steered toward. */
  exampleEn: string;
}

/**
 * Authored practice contexts per focusable tag. Only tags present here can be
 * circled; a high-severity tag WITHOUT authored content is treated as
 * non-focusable (the loop degrades to "converse naturally") rather than
 * inventing a vague prompt. Each focusable tag carries >= L1_FOCUS_DEPTH_CAP
 * distinct contexts so the loop never exhausts before the depth cap.
 *
 * Vietnamese-first by product principle; the English frame is a scaffold.
 */
const L1_FOLLOW_UP_BANK: Readonly<
  Partial<Record<L1WeaknessTag, readonly L1FollowUpContext[]>>
> = {
  vi_l1_3rd_person_s: [
    { id: "3ps-morning", tag: "vi_l1_3rd_person_s", promptVi: "Thử kể về buổi sáng của em gái bạn: cô ấy làm gì mỗi ngày?", exampleEn: "She wakes up early." },
    { id: "3ps-job", tag: "vi_l1_3rd_person_s", promptVi: "Bạn của bạn làm nghề gì? Hãy viết một câu với 'he' hoặc 'she'.", exampleEn: "He works at a bank." },
    { id: "3ps-pet", tag: "vi_l1_3rd_person_s", promptVi: "Tả con vật cưng nhà bạn: nó thích ăn gì? (dùng 'it').", exampleEn: "It eats fish every day." },
  ],
  vi_l1_past_ed: [
    { id: "pasted-weekend", tag: "vi_l1_past_ed", promptVi: "Cuối tuần trước bạn làm gì? Viết một câu ở thì quá khứ.", exampleEn: "I watched a movie." },
    { id: "pasted-yesterday", tag: "vi_l1_past_ed", promptVi: "Hôm qua bạn đi đâu? Kể lại bằng một câu quá khứ.", exampleEn: "I visited my grandmother." },
    { id: "pasted-childhood", tag: "vi_l1_past_ed", promptVi: "Hồi nhỏ bạn thích chơi trò gì? Dùng động từ quá khứ.", exampleEn: "I played football." },
  ],
  vi_l1_plural_s: [
    { id: "plural-market", tag: "vi_l1_plural_s", promptVi: "Bạn mua gì ở chợ? Hãy nói có 'two' hoặc 'three' món.", exampleEn: "I bought three apples." },
    { id: "plural-class", tag: "vi_l1_plural_s", promptVi: "Lớp bạn có bao nhiêu bạn? Viết một câu với số nhiều.", exampleEn: "There are many students." },
    { id: "plural-books", tag: "vi_l1_plural_s", promptVi: "Trên bàn bạn có mấy quyển sách? Dùng 'two/many + danh từ'.", exampleEn: "I have five books." },
  ],
  vi_l1_missing_be: [
    { id: "be-feeling", tag: "vi_l1_missing_be", promptVi: "Hôm nay bạn cảm thấy thế nào? Viết một câu với 'I am ...'.", exampleEn: "I am tired today." },
    { id: "be-weather", tag: "vi_l1_missing_be", promptVi: "Thời tiết hôm nay ra sao? Dùng 'It is ...'.", exampleEn: "It is very hot." },
    { id: "be-family", tag: "vi_l1_missing_be", promptVi: "Tả một người trong gia đình: họ thế nào? Dùng 'is/are'.", exampleEn: "My brother is kind." },
  ],
  vi_l1_missing_article: [
    { id: "article-room", tag: "vi_l1_missing_article", promptVi: "Trong phòng bạn có gì? Nói một vật, nhớ dùng 'a/an'.", exampleEn: "There is a chair." },
    { id: "article-job", tag: "vi_l1_missing_article", promptVi: "Mẹ bạn làm nghề gì? Viết một câu với 'a/an' trước nghề.", exampleEn: "She is a teacher." },
    { id: "article-have", tag: "vi_l1_missing_article", promptVi: "Bạn có một con vật nuôi nào không? Dùng 'a' trước danh từ.", exampleEn: "I have a dog." },
  ],
  vi_l1_profession_article_copula: [
    { id: "profession-family", tag: "vi_l1_profession_article_copula", promptVi: "Một người trong gia đình bạn làm nghề gì? Dùng 'is a/an ...'.", exampleEn: "My mother is a nurse." },
    { id: "profession-friend", tag: "vi_l1_profession_article_copula", promptVi: "Bạn của bạn làm nghề gì? Viết một câu có 'is a/an' trước nghề.", exampleEn: "My friend is an engineer." },
    { id: "profession-goal", tag: "vi_l1_profession_article_copula", promptVi: "Sau này bạn muốn làm nghề gì? Dùng 'be a/an ...'.", exampleEn: "I want to be a pilot." },
  ],
  vi_l1_question_no_aux: [
    { id: "aux-habit", tag: "vi_l1_question_no_aux", promptVi: "Hỏi bạn cùng lớp về thói quen của họ. Bắt đầu bằng 'Do you ...?'.", exampleEn: "Do you like coffee?" },
    { id: "aux-3rd", tag: "vi_l1_question_no_aux", promptVi: "Hỏi về một người khác: bắt đầu bằng 'Does he/she ...?'.", exampleEn: "Does she play tennis?" },
    { id: "aux-past", tag: "vi_l1_question_no_aux", promptVi: "Hỏi bạn về hôm qua: bắt đầu bằng 'Did you ...?'.", exampleEn: "Did you sleep well?" },
  ],
  vi_l1_preposition_transfer: [
    { id: "prep-listen", tag: "vi_l1_preposition_transfer", promptVi: "Bạn thích nghe gì? Dùng 'listen to ...'.", exampleEn: "I listen to music." },
    { id: "prep-good", tag: "vi_l1_preposition_transfer", promptVi: "Bạn giỏi môn nào? Dùng 'good at ...'.", exampleEn: "I am good at math." },
    { id: "prep-depend", tag: "vi_l1_preposition_transfer", promptVi: "Kế hoạch cuối tuần của bạn tùy vào điều gì? Dùng 'depend on ...'.", exampleEn: "It depends on the weather." },
  ],
};

/** Whether a tag has authored practice content (so the loop can circle it). */
export function isFocusableL1Tag(tag: L1WeaknessTag): boolean {
  return (L1_FOLLOW_UP_BANK[tag]?.length ?? 0) > 0;
}

/** First unused context for a tag, or null if none / exhausted. */
function pickFollowUp(
  tag: L1WeaknessTag,
  usedContextIds: readonly string[],
): L1FollowUpContext | null {
  const bank = L1_FOLLOW_UP_BANK[tag];
  if (!bank) return null;
  return bank.find((ctx) => !usedContextIds.includes(ctx.id)) ?? null;
}

// ────────────────────────────────────────────────────────────────────────
// In-session focus state + reducer
// ────────────────────────────────────────────────────────────────────────

export interface L1FocusState {
  /** The tag currently being circled, or null when not focusing. */
  focusTag: L1WeaknessTag | null;
  /** How many same-tag follow-up practices have been delivered. */
  turnsOnTag: number;
  /** Context ids already used this focus, so the loop never repeats one. */
  usedContextIds: readonly string[];
  /** Whether a "move on?" offer has already been made for this focus. */
  offeredMoveOn: boolean;
}

export const initialL1FocusState: L1FocusState = {
  focusTag: null,
  turnsOnTag: 0,
  usedContextIds: [],
  offeredMoveOn: false,
};

export type L1FocusAction =
  /** A new high-confidence focusable tag — begin circling it. */
  | "start_focus"
  /** Still working the same weakness — deliver another new-context practice. */
  | "continue_focus"
  /** Circled enough (or the learner is clean) — offer to move on. */
  | "offer_move_on"
  /** Offer already made / focus resolved — drop focus, back to normal. */
  | "release_focus"
  /** Low confidence and no active focus — no forced loop, just converse. */
  | "converse_naturally";

export interface L1FocusDecision {
  action: L1FocusAction;
  /** The tag in focus after this decision (null when conversing/releasing). */
  focusTag: L1WeaknessTag | null;
  /** The practice to pose now (start/continue only); null otherwise. */
  followUp: L1FollowUpContext | null;
  /** Convenience flag === (action === "offer_move_on"). */
  offerMoveOn: boolean;
  /** Vietnamese-first text for an offer_move_on turn; null otherwise. */
  messageVi: string | null;
  /** The in-session state to carry into the next turn. */
  nextState: L1FocusState;
}

function patternLabel(tag: L1WeaknessTag): string {
  return TAG_TO_NAME_EN[tag] ?? tag.replace(/^vi_l1_/, "").replace(/_/g, " ");
}

/** Vietnamese-first "you've got it — want to move on?" offer. */
export function buildMoveOnMessageVi(tag: L1WeaknessTag): string {
  return `Bạn luyện phần "${patternLabel(tag)}" tốt rồi 👏 Mình chuyển sang câu mới nhé — hay bạn muốn thử thêm một câu nữa?`;
}

function converseNaturally(prev: L1FocusState): L1FocusDecision {
  return {
    action: "converse_naturally",
    focusTag: null,
    followUp: null,
    offerMoveOn: false,
    messageVi: null,
    // Conversing naturally never carries stale focus forward.
    nextState: prev.focusTag === null ? prev : initialL1FocusState,
  };
}

function releaseFocus(): L1FocusDecision {
  return {
    action: "release_focus",
    focusTag: null,
    followUp: null,
    offerMoveOn: false,
    messageVi: null,
    nextState: initialL1FocusState,
  };
}

function offerMoveOn(prev: L1FocusState, tag: L1WeaknessTag): L1FocusDecision {
  return {
    action: "offer_move_on",
    focusTag: tag,
    followUp: null,
    offerMoveOn: true,
    messageVi: buildMoveOnMessageVi(tag),
    // Keep the focus tag but mark the offer made; the next turn resolves it.
    nextState: { ...prev, focusTag: tag, offeredMoveOn: true },
  };
}

/** Advance the focus state given this turn's detector firing. Pure. */
export function advanceL1Focus(
  prev: L1FocusState,
  detection: L1DetectionResult,
): L1FocusDecision {
  const confidence = classifyL1Confidence(detection);

  // ── Low confidence: no actionable high-severity error this turn. ──
  if (confidence === "low") {
    if (prev.focusTag === null) return converseNaturally(prev);
    // The learner produced a turn WITHOUT the focus error — a good sign.
    // Offer to move on once; if we already did, release the focus.
    return prev.offeredMoveOn
      ? releaseFocus()
      : offerMoveOn(prev, prev.focusTag);
  }

  // ── High confidence: a real, focus-worthy detection. ──
  const tag = detection.weaknessTag as L1WeaknessTag;

  // No active focus: try to start one on this tag.
  if (prev.focusTag === null) {
    const ctx = pickFollowUp(tag, []);
    if (!ctx) return converseNaturally(prev); // high-severity but no content → don't force it
    return {
      action: "start_focus",
      focusTag: tag,
      followUp: ctx,
      offerMoveOn: false,
      messageVi: null,
      nextState: {
        focusTag: tag,
        turnsOnTag: 1,
        usedContextIds: [ctx.id],
        offeredMoveOn: false,
      },
    };
  }

  // Focus is STICKY: stay on the current weakness even if a different tag
  // fires, so the loop drills one thing at a time rather than thrashing.
  const focusTag = prev.focusTag;

  // We already offered to move on but another error came — stop the forced
  // loop and let the normal correction flow handle it (release).
  if (prev.offeredMoveOn) return releaseFocus();

  const nextTurns = prev.turnsOnTag + 1;
  const ctx = pickFollowUp(focusTag, prev.usedContextIds);

  // Circled enough, or ran out of fresh contexts → offer to move on.
  if (nextTurns > L1_FOCUS_DEPTH_CAP || !ctx) {
    return offerMoveOn(prev, focusTag);
  }

  return {
    action: "continue_focus",
    focusTag,
    followUp: ctx,
    offerMoveOn: false,
    messageVi: null,
    nextState: {
      focusTag,
      turnsOnTag: nextTurns,
      usedContextIds: [...prev.usedContextIds, ctx.id],
      offeredMoveOn: false,
    },
  };
}

/** Test/inspection helper: the authored contexts for a tag (read-only). */
export function followUpsForTag(
  tag: L1WeaknessTag,
): readonly L1FollowUpContext[] {
  return L1_FOLLOW_UP_BANK[tag] ?? [];
}
