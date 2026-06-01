// src/features/review/content/ingestion/chineseSeedA1.authored.ts
//
// DCzh-A1 — the human-authored seed batch for the vi→zh A1 GENERATION flow.
//
// Chinese A1 source content (src/languages/chinese/lessons-a1.ts) carries an
// authored hanzi string + tone-marked pinyin + an English gloss, but NO per-
// sentence Vietnamese. That is the known A1 generation gap: the existing vi→zh
// adaptation seed is B2 only (the only level whose lessons ship a vi field).
// So an A1 vi→zh seed must be GENERATED:
//   - the Chinese `back` (hanzi) is authored upstream (trusted),
//   - the tone-marked `pinyin` reading is authored upstream (trusted),
//   - the Vietnamese front is GENERATED at build time via an injected Translator,
//   - and because the front is machine/seed-produced it MUST clear the gate's
//     back-translation round-trip before it can be seeded.
//
// Since the build has no live MT/LLM endpoint, the "Translator" here is a static,
// HUMAN-AUTHORED vi⇄zh lookup. I (a competent ZH→VI translator) authored every
// Vietnamese gloss below by hand, using the source English as a bridge but
// translating the Chinese, aiming for natural Vietnamese-first phrasing.
//
// PROVENANCE HONESTY: this is authored/generated content PENDING human review.
// The seed it produces is marked status:"for-review" and is NOT wired live
// (vi-zh stays live at B2 only; A1 is surfaced for a human pass).
//
// Two ReadonlyMaps drive the staticTranslator:
//   toVi   : chinese(hanzi) → authored Vietnamese   (generates the card front)
//   fromVi : authored Vietnamese → chinese(hanzi)    (closes the round-trip)
// Keys on both maps are exact strings; every `back` has a toVi entry, and the
// authored vi it yields round-trips back to the same hanzi via fromVi.

import type { CefrLevel } from "../validate";
import type { RawGenItem } from "../generate";
import type { ReviewFlowId, ReviewItemKind } from "@/features/review/types";

/** One authored vi→zh A1 seed row: trusted hanzi back + my authored Vietnamese. */
export interface AuthoredZhItem {
  /** Authored Chinese answer text (trusted anchor) — hanzi. */
  back: string;
  /** Hand-authored Vietnamese gloss (the would-be card front). */
  vi: string;
  /** Tone-marked pinyin reading from the source (trusted, carried straight). */
  pinyin: string;
  /** Source English gloss I used as the translation bridge (provenance only). */
  enBridge: string;
  kind: ReviewItemKind;
}

export const FLOW: ReviewFlowId = "vi-zh";
export const LEVEL: CefrLevel = "A1";
export const SOURCE = "chinese/lessons-a1+authored-vi";

/**
 * 24 real, simple A1 sentences pulled from chinese/lessons-a1.ts (greetings,
 * numbers, family, colors, food, days, months). Vietnamese authored by hand,
 * faithful to the source; pinyin is the source's tone-marked reading verbatim.
 */
export const AUTHORED_ZH_ITEMS: readonly AuthoredZhItem[] = [
  // ── Greetings ─────────────────────────────────────────────────────────────
  { back: "你好吗？", vi: "bạn khỏe không?", pinyin: "nǐ hǎo ma?", enBridge: "How are you?", kind: "sentence" },
  { back: "我很好，谢谢。", vi: "tôi khỏe, cảm ơn.", pinyin: "wǒ hěn hǎo, xiè xiè.", enBridge: "I'm fine, thank you.", kind: "sentence" },
  { back: "再见，明天见。", vi: "tạm biệt, hẹn gặp lại ngày mai.", pinyin: "zài jiàn, míng tiān jiàn.", enBridge: "Goodbye, see you tomorrow.", kind: "sentence" },
  { back: "欢迎来到中国！", vi: "chào mừng bạn đến với Trung Quốc!", pinyin: "huān yíng lái dào zhōng guó!", enBridge: "Welcome to China!", kind: "sentence" },

  // ── Numbers ───────────────────────────────────────────────────────────────
  { back: "我有三个苹果。", vi: "tôi có ba quả táo.", pinyin: "wǒ yǒu sān gè píng guǒ.", enBridge: "I have three apples.", kind: "sentence" },
  { back: "我们班有八个学生。", vi: "lớp chúng tôi có tám học sinh.", pinyin: "wǒ men bān yǒu bā gè xué shēng.", enBridge: "Our class has eight students.", kind: "sentence" },
  { back: "请给我一杯水。", vi: "làm ơn cho tôi một ly nước.", pinyin: "qǐng gěi wǒ yī bēi shuǐ.", enBridge: "Please give me a glass of water.", kind: "sentence" },

  // ── Family ────────────────────────────────────────────────────────────────
  { back: "我爸爸是医生。", vi: "bố tôi là bác sĩ.", pinyin: "wǒ bà ba shì yī shēng.", enBridge: "My father is a doctor.", kind: "sentence" },
  { back: "我妈妈做的饭很好吃。", vi: "cơm mẹ tôi nấu rất ngon.", pinyin: "wǒ mā ma zuò de fàn hěn hǎo chī.", enBridge: "The food my mother makes is delicious.", kind: "sentence" },
  { back: "我有一个哥哥和一个妹妹。", vi: "tôi có một anh trai và một em gái.", pinyin: "wǒ yǒu yī gè gē ge hé yī gè mèi mei.", enBridge: "I have one older brother and one younger sister.", kind: "sentence" },
  { back: "我女儿今年五岁了。", vi: "con gái tôi năm nay năm tuổi.", pinyin: "wǒ nǚ ér jīn nián wǔ suì le.", enBridge: "My daughter is five years old this year.", kind: "sentence" },

  // ── Colors ────────────────────────────────────────────────────────────────
  { back: "我喜欢红色的花。", vi: "tôi thích hoa màu đỏ.", pinyin: "wǒ xǐ huān hóng sè de huā.", enBridge: "I like red flowers.", kind: "sentence" },
  { back: "天空是蓝色的。", vi: "bầu trời màu xanh dương.", pinyin: "tiān kōng shì lán sè de.", enBridge: "The sky is blue.", kind: "sentence" },
  { back: "她穿了一件白色的裙子。", vi: "cô ấy mặc một chiếc váy màu trắng.", pinyin: "tā chuān le yī jiàn bái sè de qún zi.", enBridge: "She wore a white dress.", kind: "sentence" },

  // ── Food & drink ──────────────────────────────────────────────────────────
  { back: "我喜欢吃中国菜。", vi: "tôi thích ăn món ăn Trung Quốc.", pinyin: "wǒ xǐ huān chī zhōng guó cài.", enBridge: "I like eating Chinese food.", kind: "sentence" },
  { back: "今天中午我吃了面条。", vi: "trưa nay tôi đã ăn mì.", pinyin: "jīn tiān zhōng wǔ wǒ chī le miàn tiáo.", enBridge: "I ate noodles for lunch today.", kind: "sentence" },
  { back: "中国人喜欢喝绿茶。", vi: "người Trung Quốc thích uống trà xanh.", pinyin: "zhōng guó rén xǐ huān hē lǜ chá.", enBridge: "Chinese people like to drink green tea.", kind: "sentence" },
  { back: "我每天早上喝一杯咖啡。", vi: "mỗi sáng tôi uống một ly cà phê.", pinyin: "wǒ měi tiān zǎo shang hē yī bēi kā fēi.", enBridge: "I drink a cup of coffee every morning.", kind: "sentence" },

  // ── Days of the week ──────────────────────────────────────────────────────
  { back: "今天是星期一。", vi: "hôm nay là thứ hai.", pinyin: "jīn tiān shì xīng qī yī.", enBridge: "Today is Monday.", kind: "sentence" },
  { back: "我星期五有中文课。", vi: "thứ sáu tôi có lớp tiếng Trung.", pinyin: "wǒ xīng qī wǔ yǒu zhōng wén kè.", enBridge: "I have Chinese class on Friday.", kind: "sentence" },
  { back: "星期三见！", vi: "hẹn gặp lại vào thứ tư!", pinyin: "xīng qī sān jiàn!", enBridge: "See you on Wednesday!", kind: "sentence" },

  // ── Months ────────────────────────────────────────────────────────────────
  { back: "我的生日在五月。", vi: "sinh nhật của tôi vào tháng năm.", pinyin: "wǒ de shēng rì zài wǔ yuè.", enBridge: "My birthday is in May.", kind: "sentence" },
  { back: "八月的天气很热。", vi: "thời tiết tháng tám rất nóng.", pinyin: "bā yuè de tiān qì hěn rè.", enBridge: "The weather in August is very hot.", kind: "sentence" },
  { back: "学校九月开学。", vi: "trường học khai giảng vào tháng chín.", pinyin: "xué xiào jiǔ yuè kāi xué.", enBridge: "School starts in September.", kind: "sentence" },
];

/**
 * Raw generation items fed to generateCandidates(). NOTE: no `front` is supplied
 * — the generator GENERATES it via translator.toVietnamese(back). We DO supply
 * `reading: it.pinyin` because vi-zh has no deterministic transliterator in the
 * generator; without it the gate would quarantine MISSING_READING.
 */
export const RAW_ITEMS: readonly RawGenItem[] = AUTHORED_ZH_ITEMS.map((it) => ({
  flow: FLOW,
  kind: it.kind,
  back: it.back,
  reading: it.pinyin,
  cefr: LEVEL,
  source: SOURCE,
}));

/** chinese(hanzi) → authored Vietnamese. Drives generation of the card front. */
export const toVi: ReadonlyMap<string, string> = new Map(
  AUTHORED_ZH_ITEMS.map((it) => [it.back, it.vi] as const),
);

/** authored Vietnamese → chinese(hanzi). Closes the back-translation round-trip. */
export const fromVi: ReadonlyMap<string, string> = new Map(
  AUTHORED_ZH_ITEMS.map((it) => [it.vi, it.back] as const),
);
