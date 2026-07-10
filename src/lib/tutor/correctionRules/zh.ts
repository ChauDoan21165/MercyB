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

// ── Rule 6: redundant degree adverb inside a 比 comparative ───────────────────
// Mandarin "A 比 B adj" is inherently comparative and REJECTS an absolute degree
// adverb (很/非常/太) before the adjective — the correct intensifier is 更/还
// ("我比你更高"). VN "hơn" and English "-er than" keep the plain degree adverb, so
// learners write "我比你很高". Drops the stray 很/非常/太 between 比…B and the
// adjective. Closed adjective set (多 is excluded to avoid the valid "很多"
// quantifier reading). The comparand B is 1–6 Han chars (non-greedy).
const ZH_COMPARATIVE_ADJ = "高大小长短贵快慢胖瘦忙累冷热远近难";
const ZH_BI_REDUNDANT_DEGREE_PATTERN = new RegExp(
  `(比[\\u4e00-\\u9fa5]{1,6}?)(很|非常|太)([${ZH_COMPARATIVE_ADJ}])`,
);

function hasBiRedundantDegree(input: string): boolean {
  return ZH_BI_REDUNDANT_DEGREE_PATTERN.test(input);
}

function repairBiRedundantDegree(input: string): string {
  return input.replace(
    new RegExp(`(比[\\u4e00-\\u9fa5]{1,6}?)(很|非常|太)([${ZH_COMPARATIVE_ADJ}])`, "g"),
    "$1$3",
  );
}

// ── Rule 7: 的 → 得 before a manner/degree complement ─────────────────────────
// The three "de" particles collapse for learners; after a verb, a following
// manner/degree complement needs 得, not attributive 的 ("他跑得快", not "他跑的
// 快"). Scoped to a closed verb set + a closed single-char complement at clause
// end, so the nominalizer/attributive 的 ("我买的书" = the book I bought — a NOUN
// follows) and possessive 的 ("这是我的") never match.
const ZH_DE_VERB = "跑|走|说|写|吃|唱|做|来|去|睡|笑|画|飞|读|想";
const ZH_DE_COMPLEMENT = "快慢好早晚对多清楚";
const ZH_DE_COMPLEMENT_PATTERN = new RegExp(
  `(${ZH_DE_VERB})的([${ZH_DE_COMPLEMENT}])(?=$|[。！？，])`,
);

function hasDeVerbComplement(input: string): boolean {
  return ZH_DE_COMPLEMENT_PATTERN.test(input);
}

function repairDeVerbComplement(input: string): string {
  return input.replace(
    new RegExp(`(${ZH_DE_VERB})的([${ZH_DE_COMPLEMENT}])(?=$|[。！？，])`, "g"),
    "$1得$2",
  );
}

// ── Rule 8: perfective 了 over-marked on a habitual clause ────────────────────
// VN has no aspect particle, so learners over-apply 了 as a generic past marker,
// including on habitual clauses where it is ungrammatical ("我每天吃了饭" — a
// habitual with 每天 rejects perfective 了). Fires only when a habitual adverb
// (每天/经常/常常/通常/总是) co-occurs with a closed action verb + 了, dropping the
// post-verb 了. A completed single event ("我昨天吃了饭") keeps 了 because 昨天 is
// not habitual and the verb-了 stays untouched.
const ZH_HABITUAL_MARKER_PATTERN = /每天|经常|常常|通常|总是/;
const ZH_HABITUAL_LE_PATTERN = /(吃|喝|看|买|做|写|说|去|来|读|听)了/;

function hasHabitualLe(input: string): boolean {
  return ZH_HABITUAL_MARKER_PATTERN.test(input) && ZH_HABITUAL_LE_PATTERN.test(input);
}

function repairHabitualLe(input: string): string {
  if (!ZH_HABITUAL_MARKER_PATTERN.test(input)) return input;
  return input.replace(/(吃|喝|看|买|做|写|说|去|来|读|听)了/g, "$1");
}

// ── Rule 9: redundant 吗 on an A-not-A question ───────────────────────────────
// An A-not-A question (是不是 / 有没有 / V不V) is ALREADY a yes/no question and
// must not also carry sentence-final 吗 — learners double-mark the question.
// Scoped to an A-not-A that immediately follows the leading subject pronoun so
// an EMBEDDED A-not-A under a matrix verb ("你知道他是不是学生吗" — 吗 is correct
// there) never matches. Drops the trailing 吗.
const ZH_ANOT_A =
  "是不是|有没有|去不去|吃不吃|要不要|来不来|好不好|对不对|会不会|能不能|想不想|喜不喜欢";
const ZH_ANOT_A_MA_PATTERN = new RegExp(`^[我你他她它]们?(${ZH_ANOT_A})[\\u4e00-\\u9fa5]*吗$`);

function hasAnotARedundantMa(input: string): boolean {
  return ZH_ANOT_A_MA_PATTERN.test(input.trim());
}

function repairAnotARedundantMa(input: string): string {
  if (!hasAnotARedundantMa(input)) return input;
  return input.replace(/吗(?=[。！？]?$)/, "");
}

// ── Rule 10: 个 over-generalized as a universal classifier ────────────────────
// VN learners default to 个 for every noun; Mandarin assigns a specific
// classifier per noun. Rewrites 个 → the correct classifier for a CLOSED noun map
// (书→本, 狗/猫/鸟→只, 马→匹). Compounds where the char is not the counted head
// (书店/书法/书架, 马路/马桶) are guarded by tail lookaheads. Nouns that genuinely
// take 个 (人, 苹果, 学生) are not in the map, so they abstain.
const ZH_GE_CLASSIFIER_MAP: Record<string, string> = {
  书: "本",
  狗: "只",
  猫: "只",
  鸟: "只",
  马: "匹",
};
const ZH_GE_OVERGENERAL_PATTERN =
  /(一|两|三|四|五|六|七|八|九|十|这|那|几)个(书(?![店法馆架包])|狗|猫|鸟|马(?![路桶]))/;

function hasGeOvergeneralization(input: string): boolean {
  return ZH_GE_OVERGENERAL_PATTERN.test(input);
}

function repairGeOvergeneralization(input: string): string {
  return input.replace(
    /(一|两|三|四|五|六|七|八|九|十|这|那|几)个(书(?![店法馆架包])|狗|猫|鸟|马(?![路桶]))/g,
    (_match, quantifier: string, noun: string) =>
      `${quantifier}${ZH_GE_CLASSIFIER_MAP[noun] ?? "个"}${noun}`,
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
  {
    id: "zh-comparative-bi-redundant-degree",
    detects: hasBiRedundantDegree,
    apply: repairBiRedundantDegree,
    fpRiskNote:
      "Drops 很/非常/太 only between 比…B and a closed comparative adjective (高大小长短贵快慢胖瘦忙累冷热远近难). 比 with the correct comparative intensifier (更/还) never matches; a sentence with no 比 never matches; 多 is excluded so the valid quantifier 很多 is untouched.",
  },
  {
    id: "zh-de-verb-complement",
    detects: hasDeVerbComplement,
    apply: repairDeVerbComplement,
    fpRiskNote:
      "Rewrites 的 → 得 only between a closed verb (跑走说写吃唱做来去睡笑画飞读想) and a closed single-char manner/degree complement (快慢好早晚对多清楚) at clause end. The nominalizer/attributive 的 before a noun (我买的书) and possessive 的 (这是我的) never match.",
  },
  {
    id: "zh-habitual-le-overmark",
    detects: hasHabitualLe,
    apply: repairHabitualLe,
    fpRiskNote:
      "Drops perfective 了 only when a habitual adverb (每天/经常/常常/通常/总是) co-occurs with a closed action verb + 了. A completed single event (昨天我吃了饭) keeps 了 because 昨天 is not habitual; verbs outside the set (忘了, 累了) are untouched.",
  },
  {
    id: "zh-anot-a-redundant-ma",
    detects: hasAnotARedundantMa,
    apply: repairAnotARedundantMa,
    fpRiskNote:
      "Drops sentence-final 吗 only when an A-not-A form (是不是/有没有/V不V) immediately follows the leading subject pronoun. A plain 吗 question (你是学生吗) has no A-not-A and never matches; an embedded A-not-A under a matrix verb (你知道他是不是学生吗, where 吗 is correct) never matches because 知道 sits between the pronoun and the A-not-A.",
  },
  {
    id: "zh-ge-overgeneralization",
    detects: hasGeOvergeneralization,
    apply: repairGeOvergeneralization,
    fpRiskNote:
      "Rewrites 个 → the correct classifier for a closed noun map (书→本; 狗/猫/鸟→只; 马→匹). Compounds where the char is not the counted head (书店/书法/书架, 马路/马桶) are guarded by tail lookaheads; nouns that genuinely take 个 (人, 苹果, 学生) are not in the map and abstain.",
  },
];
