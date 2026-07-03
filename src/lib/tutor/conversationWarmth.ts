import type {
  ConversationPronunciationQuality,
  ConversationPronunciationResult,
} from "@/lib/pronunciation/conversationPronunciation";

/**
 * Step 10 — VN-calibrated warmth + trust-floor abstention redirects (Lane A).
 *
 * This module is pure and offline: it generates learner-facing copy only and
 * performs no I/O, no scoring, and no persistence. It is the moat piece, not
 * generic sentiment — every message is Vietnamese-primary, low-shame,
 * face-saving, and identity-affirming, and it treats English mistakes as the
 * natural L1 interference of a capable Vietnamese speaker rather than a failure.
 *
 * Two responsibilities:
 *  1. buildTurnWarmth   — warmth attached to a normal conversation turn.
 *  2. buildAbstentionRedirect — the trust floor: when pronunciation / Vietlish /
 *     interference confidence is low or null, acknowledge the uncertainty
 *     honestly (never a fabricated score) and ALWAYS hand back a concrete next
 *     practice prompt so the conversation never dead-ends on "try again".
 *
 * Callers pass in the topic `warmthPatterns` and the matched VN L1 interference
 * note; this module does not read or edit topic files (Lane boundary).
 */

/** Register the learner-facing Vietnamese copy is written in. */
export type WarmthRegister = "friendly" | "respectful";

/** How the learner's turn went, decided upstream by the caller. */
export type TurnOutcome = "strong" | "minor_slip" | "struggling";

export type WarmthTone = "celebrate" | "encourage" | "reassure";

/** A bilingual, learner-facing line. `vi` is primary, `en` is secondary. */
export type BilingualLine = {
  vi: string;
  en: string;
};

export type WarmthMessage = BilingualLine & {
  tone: WarmthTone;
};

/** Subset of a topic's VN L1 interference note the warmth layer consumes. */
export type L1InterferenceNoteInput = {
  id: string;
  label: string;
  note: string;
};

export type TurnWarmthInput = {
  /**
   * Topic `warmthPatterns` (AI tone guidance strings). Used to seed the English
   * secondary line and to rotate phrasing across a session. Not shown verbatim
   * as primary copy.
   */
  warmthPatterns?: readonly string[];
  /** The VN L1 interference note the caller matched for this turn, if any. */
  interferenceNote?: L1InterferenceNoteInput | null;
  /** Caller's read of how the turn went. Defaults to "minor_slip". */
  outcome?: TurnOutcome;
  /** Turn index in the session; rotates phrasing to avoid repetition. */
  turnIndex?: number;
  /** Vietnamese register. Defaults to "friendly" (mình/bạn). */
  register?: WarmthRegister;
};

/** What made us abstain from a confident correction / score this turn. */
export type AbstentionTrigger =
  | "no_audio"
  | "low_confidence_pronunciation"
  | "scoring_unavailable"
  | "uncertain_interference"
  | "uncertain_vietlish";

export type AbstentionRedirectInput = {
  trigger: AbstentionTrigger;
  turnIndex?: number;
  register?: WarmthRegister;
  /**
   * Optional topic-specific next prompt supplied by the caller. When present it
   * is used verbatim as the redirect; otherwise a safe rotating default is used.
   * Either way a concrete next prompt is ALWAYS returned.
   */
  suggestedNextPrompt?: BilingualLine | null;
};

export type AbstentionRedirect = {
  trigger: AbstentionTrigger;
  /** Honest, low-shame acknowledgment of uncertainty. Never a guessed score. */
  vi: string;
  en: string;
  /** The redirect: a concrete next engaging practice prompt. Always present. */
  nextPrompt: BilingualLine;
};

function pick<T>(items: readonly T[], turnIndex: number | undefined): T {
  const length = items.length;
  const index = ((turnIndex ?? 0) % length + length) % length;
  return items[index];
}

/**
 * Pull the actionable, quoted phrase out of a topic warmthPattern such as
 * `Stay calm around money stress: 'Let's look at the transaction step by step.'`
 * Falls back to the whole pattern when there is no quoted phrase.
 */
function actionableFromWarmthPattern(pattern: string): string {
  // Greedy capture from the first quote to the last quote so apostrophes inside
  // the phrase (e.g. "Let's") are not mistaken for the closing delimiter.
  const quoted = pattern.match(/['"“](.+)['"”]/);
  const phrase = (quoted?.[1] ?? pattern).trim();
  return phrase.replace(/\s+/g, " ");
}

/** Short, natural English tip derived from an interference note. */
function tipFromInterferenceNote(note: L1InterferenceNoteInput): string {
  // Notes end with the corrected English introduced by "...phrase is '<X>.'" or
  // "...say '<X>.'". Greedily skip to the LAST such lead-in, then take the
  // trailing quoted phrase (apostrophes allowed inside) up to end-of-string.
  const naturalPhrase = note.note.match(
    /.*\b(?:phrase is|is|say)\s+['"“](.+?)['"”]\.?\s*$/is,
  );
  const phrase = naturalPhrase?.[1]?.trim().replace(/\s+/g, " ");
  if (phrase && phrase.length > 3) {
    return `Natural phrasing: "${phrase}".`;
  }
  return note.label.trim();
}

const CELEBRATE_VI: Readonly<Record<WarmthRegister, readonly string[]>> = {
  friendly: [
    "Tuyệt vời! Câu vừa rồi bạn nói rất rõ và tự nhiên.",
    "Hay lắm! Nghe rất trôi chảy, bạn giữ nhịp này nhé.",
    "Quá tốt! Bạn diễn đạt đúng ý và rất tự tin.",
  ],
  respectful: [
    "Rất tốt! Câu vừa rồi nghe rất rõ ràng và tự nhiên.",
    "Rất hay! Cách diễn đạt rất trôi chảy và tự tin.",
    "Tốt lắm! Ý đã rõ và phát âm rất dễ nghe.",
  ],
};

const ENCOURAGE_VI: Readonly<Record<WarmthRegister, readonly string[]>> = {
  friendly: [
    "Bạn nói tốt lắm rồi — chỉ một chỗ nhỏ thôi, mình chỉnh nhẹ nhé.",
    "Gần đúng hết rồi đó — còn một điểm nhỏ, mình cùng sửa cho gọn nhé.",
    "Ý của bạn rõ rồi — mình chỉ tinh chỉnh một chút cho thật tự nhiên.",
  ],
  respectful: [
    "Đã rất tốt rồi — chỉ còn một điểm nhỏ, mình cùng chỉnh lại nhé.",
    "Gần như trọn vẹn rồi — còn một chỗ nhỏ để câu thêm tự nhiên.",
    "Ý đã rõ ràng — mình tinh chỉnh một chút cho mượt hơn nhé.",
  ],
};

const REASSURE_VI: Readonly<Record<WarmthRegister, readonly string[]>> = {
  friendly: [
    "Không sao đâu, đây là chỗ người Việt mình hay gặp. Tiếng Việt của bạn là điểm mạnh, mình chỉ thêm tiếng Anh thôi.",
    "Bình thường thôi nha — chỗ này rất nhiều người Việt cũng vướng. Mình đi từ từ từng bước một.",
    "Đừng lo, lỗi này rất tự nhiên với người nói tiếng Việt. Mình luyện thêm chút là quen ngay.",
  ],
  respectful: [
    "Không sao cả, đây là điểm rất nhiều người Việt gặp phải. Cứ từ từ, mình đi từng bước một.",
    "Hoàn toàn bình thường — đây là chỗ người nói tiếng Việt thường vướng. Mình luyện thêm là ổn.",
    "Xin đừng lo, lỗi này rất tự nhiên. Vốn tiếng Việt của mình là một lợi thế khi học tiếng Anh.",
  ],
};

const DEFAULT_WARMTH_EN: Readonly<Record<WarmthTone, string>> = {
  celebrate: "That sounded clear and natural — well done.",
  encourage: "Nice work — just one small thing to tidy up.",
  reassure: "This is a very common Vietnamese-speaker pattern — let's take it step by step.",
};

const TONE_BY_OUTCOME: Readonly<Record<TurnOutcome, WarmthTone>> = {
  strong: "celebrate",
  minor_slip: "encourage",
  struggling: "reassure",
};

const VI_BY_TONE: Readonly<Record<WarmthTone, Readonly<Record<WarmthRegister, readonly string[]>>>> = {
  celebrate: CELEBRATE_VI,
  encourage: ENCOURAGE_VI,
  reassure: REASSURE_VI,
};

/**
 * Build VN-calibrated warmth for a normal conversation turn. Vietnamese is the
 * primary channel; the English secondary line is seeded from the topic's
 * warmthPatterns or the matched interference note so the warmth stays grounded
 * in the scenario rather than generic praise.
 */
export function buildTurnWarmth(input: TurnWarmthInput): WarmthMessage {
  const register = input.register ?? "friendly";
  const outcome = input.outcome ?? "minor_slip";
  const tone = TONE_BY_OUTCOME[outcome];

  const vi = pick(VI_BY_TONE[tone][register], input.turnIndex);

  let en: string;
  if (input.interferenceNote) {
    en = tipFromInterferenceNote(input.interferenceNote);
  } else if (input.warmthPatterns && input.warmthPatterns.length > 0) {
    en = actionableFromWarmthPattern(pick(input.warmthPatterns, input.turnIndex));
  } else {
    en = DEFAULT_WARMTH_EN[tone];
  }

  return { vi, en, tone };
}

const ABSTAIN_VI: Readonly<Record<AbstentionTrigger, string>> = {
  no_audio:
    "Mình chưa nghe được phần ghi âm nên lần này mình không chấm điểm phát âm — không sao cả.",
  low_confidence_pronunciation:
    "Phần phát âm này mình chưa chắc nên mình không đoán điểm — mình cứ luyện tiếp cho thật thoải mái nhé.",
  scoring_unavailable:
    "Lúc này mình chưa chấm được phát âm nên mình sẽ không đưa con số — mình tập trung vào nói chuyện trước nhé.",
  uncertain_interference:
    "Chỗ này mình chưa chắc đúng sai nên mình không sửa vội — quan trọng là bạn đã nói ra được ý của mình.",
  uncertain_vietlish:
    "Câu này mình chưa chắc cách diễn đạt nào hợp hơn nên mình không chỉnh — ý của bạn đã rõ rồi.",
};

const ABSTAIN_EN: Readonly<Record<AbstentionTrigger, string>> = {
  no_audio: "I couldn't hear a recording this time, so I won't guess a score.",
  low_confidence_pronunciation:
    "I'm not confident about the pronunciation here, so I won't give a number — let's just keep practicing.",
  scoring_unavailable:
    "Scoring isn't available right now, so I won't show a number — let's focus on the conversation.",
  uncertain_interference:
    "I'm not sure about this one, so I won't correct it — what matters is your meaning came through.",
  uncertain_vietlish:
    "I'm not sure which phrasing is better here, so I'll leave it — your meaning was clear.",
};

/**
 * Rotating, concrete next prompts used when the caller has no topic-specific
 * redirect. Each keeps the learner talking — never "try again" or "skip".
 */
const DEFAULT_NEXT_PROMPTS: readonly BilingualLine[] = [
  {
    vi: "Mình nói tiếp nhé — bạn thử kể thêm một câu về chuyện vừa rồi xem sao?",
    en: "Let's keep going — can you tell me one more sentence about that?",
  },
  {
    vi: "Vậy bước tiếp theo bạn sẽ làm gì? Thử nói cho mình nghe một câu nhé.",
    en: "So what would you do next? Try telling me in one sentence.",
  },
  {
    vi: "Mình tò mò chút — chuyện đó với bạn thế nào? Cứ nói thoải mái nha.",
    en: "I'm curious — how was that for you? Say it however feels natural.",
  },
];

function concreteNextPrompt(input: BilingualLine | null | undefined, turnIndex: number | undefined): BilingualLine {
  const fallback = pick(DEFAULT_NEXT_PROMPTS, turnIndex);
  const vi = input?.vi.trim() || fallback.vi;
  const en = input?.en.trim() || fallback.en;
  return { vi, en };
}

/**
 * Trust floor: turn a low-confidence / null signal into an honest, low-shame
 * acknowledgment plus a concrete next practice prompt. The redirect ALWAYS
 * carries a nextPrompt so the conversation never dead-ends, and the
 * acknowledgment never contains a fabricated score.
 */
export function buildAbstentionRedirect(input: AbstentionRedirectInput): AbstentionRedirect {
  const nextPrompt = concreteNextPrompt(input.suggestedNextPrompt, input.turnIndex);
  return {
    trigger: input.trigger,
    vi: ABSTAIN_VI[input.trigger],
    en: ABSTAIN_EN[input.trigger],
    nextPrompt,
  };
}

const QUALITY_TO_TRIGGER: Readonly<
  Record<Exclude<ConversationPronunciationQuality, "ok">, AbstentionTrigger>
> = {
  low_confidence: "low_confidence_pronunciation",
  no_audio: "no_audio",
  scoring_unavailable: "scoring_unavailable",
};

/**
 * Map a C1 pronunciation result to an abstention trigger, or null when the
 * score is solid enough to render. A null `overallScore` or low confidence
 * always abstains — we never surface a guessed percentage (C1 trust contract).
 */
export function abstentionTriggerFromPronunciation(
  result: Pick<ConversationPronunciationResult, "overallScore" | "quality" | "confidence">,
): AbstentionTrigger | null {
  if (result.quality !== "ok") {
    return QUALITY_TO_TRIGGER[result.quality];
  }
  if (result.overallScore === null || result.confidence === "low") {
    return "low_confidence_pronunciation";
  }
  return null;
}

/**
 * Convenience: produce a redirect directly from a pronunciation result, or null
 * when the score is confident and can be rendered normally by the caller.
 */
export function abstentionRedirectFromPronunciation(
  result: Pick<ConversationPronunciationResult, "overallScore" | "quality" | "confidence">,
  options?: Omit<AbstentionRedirectInput, "trigger">,
): AbstentionRedirect | null {
  const trigger = abstentionTriggerFromPronunciation(result);
  if (trigger === null) return null;
  return buildAbstentionRedirect({ ...options, trigger });
}
