import type { CorrectionRule } from "./en";

// Deterministic Vietnamese-L1 → Chinese (Mandarin) beginner correction rules.
//
// Foundation batch (5 rules). Each targets a high-frequency VN→ZH transfer error
// and rewrites a CLOSED, unambiguous surface so it abstains on the grammatical
// reading. Every rule's `detects` is true exactly when `apply` changes the text
// (no detect-without-fix, which would route the engine to needs_ai). All example
// evidence in the golden fixtures is captured from the live engine, never
// hand-traced. Content is restricted to neutral / pre-1900-classical / non-
// political modern contexts.

// ── Rule 1: 二 → 两 before a measure word ────────────────────────────────────
// VN "hai" is a single word for the number 2 in every context; Mandarin splits
// it into 二 (counting/ordinals/dates) vs 两 (before a measure word). Learners
// carry the single VN form over and write 二个/二本. Guarded so it never touches
// 二 inside a larger numeral (十二, 二十, 一百二十), an ordinal (第二个), or a
// date/floor where 二 is correct (二月, 二号, 二楼 — those chars are not in the
// measure-word set). The negative lookbehind blocks any preceding digit/第.
const ZH_ER_LIANG_MEASURE_PATTERN =
  /(?<![一二三四五六七八九十百千两第])二(?=[个本只张条杯瓶件位双台辆碗块斤])/;

function hasErLiangMeasure(input: string): boolean {
  return ZH_ER_LIANG_MEASURE_PATTERN.test(input);
}

function repairErLiangMeasure(input: string): string {
  return input.replace(
    /(?<![一二三四五六七八九十百千两第])二(?=[个本只张条杯瓶件位双台辆碗块斤])/g,
    "两",
  );
}

// ── Rule 2: missing measure word before 书 ───────────────────────────────────
// Mandarin requires 数词 + 量词 + 名词; the classifier for 书 is 本. VN also uses
// classifiers, but under uncertainty learners drop the Chinese one and write the
// number directly against the noun (三书) — the bare-count transfer. Scoped to
// the single noun 书 → 本 to stay high-precision. The lookahead abstains on
// compounds where 书 is not the counted head (书店/书法/图书馆 — 书 is preceded
// by 图, not a number, so those never match; 书店/书法 are blocked by the tail).
const ZH_MISSING_CLASSIFIER_SHU_PATTERN = /([一两三四五六七八九十])书(?![店法包架桌房籍馆])/;

function hasMissingClassifierShu(input: string): boolean {
  return ZH_MISSING_CLASSIFIER_SHU_PATTERN.test(input);
}

function repairMissingClassifierShu(input: string): string {
  return input.replace(
    /([一两三四五六七八九十])书(?![店法包架桌房籍馆])/g,
    "$1本书",
  );
}

// ── Rule 3: 是 + predicative adjective → 很 + adjective ───────────────────────
// Mandarin predicative adjectives take a degree adverb (很), never the copula 是
// ("我很高", not "我是高"). Beginners over-generalize 是 as a universal copula —
// reinforced by VN "là" being taught as = 是 and then mis-extended from nouns to
// adjectives. Scoped to a subject pronoun + 是 + a CLOSED monosyllabic adjective
// at clause end, so 是 + noun ("我是学生") and the 是…的 focus structure
// ("这是红的") never match. The lookbehind abstains on 不是 ("我不是高").
const ZH_ADJECTIVES = "高矮胖瘦忙累饿渴冷热贵快慢远近难";
const ZH_SHI_ADJECTIVE_PATTERN = new RegExp(
  `(?<!不)([我你他她它]们?)是([${ZH_ADJECTIVES}])(?=$|[。！？，]|吗|了|呢)`,
);

function hasShiAdjective(input: string): boolean {
  return ZH_SHI_ADJECTIVE_PATTERN.test(input);
}

function repairShiAdjective(input: string): string {
  return input.replace(
    new RegExp(`(?<!不)([我你他她它]们?)是([${ZH_ADJECTIVES}])(?=$|[。！？，]|吗|了|呢)`, "g"),
    "$1很$2",
  );
}

// ── Rule 4: completed-event negation 不 → 没 ──────────────────────────────────
// VN "không" is a single negator for every tense; Mandarin uses 没(有) for a
// COMPLETED event and 不 for habitual / future / volition / states. The 没-vs-不
// contrast is aspect (completion), not tense — so the trigger is deliberately
// narrowed to BOUNDED-OCCASION markers (昨天 / 前天 / 刚才 / 刚刚) where a single
// action verb reads as a completed occurrence. Durational / habitual-leaning
// markers (以前 / 去年 / 上周 / 上个月) are EXCLUDED: with them 不 is often correct
// ("以前他不吃肉" = used to not eat meat, habitual). Fires only when a bounded
// marker co-occurs with 不 immediately before an ACTION verb (closed set), so
// stative / modal / copula 不 ("昨天我不高兴", "昨天我不想去", "昨天我不是学生",
// "那时候我还不会说") is out of scope — those verbs are not in the action set.
const ZH_PAST_TIME_MARKER_PATTERN = /(昨天|前天|刚才|刚刚)/;
const ZH_PAST_ACTION_BU_PATTERN = /不(?=[去来吃喝看买卖做说写听见到回找])/;

function hasPastActionBu(input: string): boolean {
  return ZH_PAST_TIME_MARKER_PATTERN.test(input) && ZH_PAST_ACTION_BU_PATTERN.test(input);
}

function repairPastActionBu(input: string): string {
  if (!ZH_PAST_TIME_MARKER_PATTERN.test(input)) return input;
  return input.replace(/不(?=[去来吃喝看买卖做说写听见到回找])/g, "没");
}

// ── Rule 5: missing postposed localizer after 在 + place noun ─────────────────
// VN localizers PRECEDE the noun ("trên bàn" = on-table); Mandarin postposes them
// (桌子上). Learners drop the trailing localizer and write "在桌子". Scoped to a
// CLOSED noun→localizer map, and the lookahead abstains when a localizer is
// already present ("在桌子上"). Institution/place nouns that need no localizer
// ("在学校", "在家") are simply not in the map, so they never match.
const ZH_LOCALIZER_MAP: Record<string, string> = {
  桌子: "上",
  床: "上",
  墙: "上",
  盒子: "里",
  抽屉: "里",
};
const ZH_MISSING_LOCALIZER_PATTERN = /在(桌子|床|墙|盒子|抽屉)(?![上里下中旁边前后])/;

function hasMissingLocalizer(input: string): boolean {
  return ZH_MISSING_LOCALIZER_PATTERN.test(input);
}

function repairMissingLocalizer(input: string): string {
  return input.replace(
    /在(桌子|床|墙|盒子|抽屉)(?![上里下中旁边前后])/g,
    (_match, noun: string) => `在${noun}${ZH_LOCALIZER_MAP[noun] ?? ""}`,
  );
}

export const chineseCorrectionRules: CorrectionRule[] = [
  {
    id: "zh-er-liang-measure",
    detects: hasErLiangMeasure,
    apply: repairErLiangMeasure,
    fpRiskNote:
      "Only rewrites 二 → 两 when 二 directly precedes a measure word (个本只张条杯瓶件位双台辆碗块斤). Excludes 二 inside a larger numeral (十二, 二十, 一百二十) via the digit lookbehind, ordinals (第二) via the 第 lookbehind, and dates/floors (二月, 二号, 二楼) because those trailing chars are not measure words.",
  },
  {
    id: "zh-missing-classifier-shu",
    detects: hasMissingClassifierShu,
    apply: repairMissingClassifierShu,
    fpRiskNote:
      "Inserts 本 only between a number (一两三…十) and the bare counted noun 书. Abstains when a classifier is already present (三本书) and on compounds where 书 is not the counted head (书店/书法/图书馆) via the tail lookahead and the number-adjacency requirement.",
  },
  {
    id: "zh-shi-adjective-hen",
    detects: hasShiAdjective,
    apply: repairShiAdjective,
    fpRiskNote:
      "Replaces copula 是 with degree adverb 很 only for a subject pronoun + 是 + a closed monosyllabic adjective at clause end. 是 + noun (我是学生), the 是…的 focus structure (这是红的), and negated 不是 (我不是高) never match.",
  },
  {
    id: "zh-past-negation-bu-mei",
    detects: hasPastActionBu,
    apply: repairPastActionBu,
    fpRiskNote:
      "Rewrites 不 → 没 only when a BOUNDED-OCCASION marker (昨天/前天/刚才/刚刚) co-occurs with 不 immediately before a closed action verb (去来吃喝看买卖做说写听见到回找). Habitual/durational markers (以前/去年/上周) are excluded because 不 is often correct there ('以前他不吃肉' = used to not eat meat). Stative/modal/copula 不 (不高兴, 不想, 不是, 不会, 不喜欢) is out of scope (those verbs are not in the action set), and 不 with no bounded marker (我不去, habitual) abstains.",
  },
  {
    id: "zh-locative-localizer",
    detects: hasMissingLocalizer,
    apply: repairMissingLocalizer,
    fpRiskNote:
      "Appends the postposed localizer only for a closed noun set (桌子/床/墙 → 上; 盒子/抽屉 → 里) after 在. Abstains when a localizer is already present (在桌子上) and on nouns that need none (在学校, 在家), which are not in the map.",
  },
];
