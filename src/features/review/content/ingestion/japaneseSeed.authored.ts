// src/features/review/content/ingestion/japaneseSeed.authored.ts
//
// DC3-ja — the human-authored seed batch for the vi→ja GENERATION flow.
//
// Japanese source content (src/languages/japanese/lessons-a1.ts) carries an
// authored Japanese string + an English gloss, but NO per-sentence Vietnamese
// and NO romaji. So vi→ja is the strictest, fully-GENERATED flow:
//   - the Japanese `back` is authored (trusted),
//   - the Vietnamese front is GENERATED at build time via an injected Translator,
//   - the romaji reading is GENERATED deterministically via wanakana (deriveRomaji),
//   - and because the front is machine/seed-produced it MUST clear the gate's
//     back-translation round-trip before it can be seeded.
//
// Since the build has no live MT/LLM endpoint, the "Translator" here is a static,
// HUMAN-AUTHORED vi⇄ja lookup. I (a competent JA→VI translator) authored every
// Vietnamese gloss below by hand, using the source English as a bridge, aiming
// for natural Vietnamese-first phrasing — never machine-stiff calques.
//
// PROVENANCE HONESTY: this is authored/generated content PENDING human review.
// The seed it produces is marked status:"for-review" and is NOT wired live.
//
// Two ReadonlyMaps drive the staticTranslator:
//   toVi   : japanese  → authored Vietnamese   (generates the card front)
//   fromVi : authored Vietnamese → japanese     (closes the round-trip)
// Keys on both maps are exact strings; every `back` has a toVi entry, and the
// authored vi it yields round-trips back to the same `back` via fromVi.

import type { CefrLevel } from "../validate";
import type { RawGenItem } from "../generate";
import type { ReviewFlowId, ReviewItemKind } from "@/features/review/types";

/** One authored vi→ja seed row: trusted Japanese back + my authored Vietnamese. */
export interface AuthoredJaItem {
  /** Authored Japanese answer text (trusted anchor) — kana and/or kanji. */
  back: string;
  /** Hand-authored Vietnamese gloss (the would-be card front). */
  vi: string;
  /** Source English gloss I used as the translation bridge (provenance only). */
  enBridge: string;
  kind: ReviewItemKind;
  /**
   * Optional human-reviewed romaji override. When present it REPLACES the
   * wanakana-derived reading (which leaves kanji untransliterated and romanizes
   * the topic particle は literally as "ha"). Supplied for cards a human
   * corrected; pure-kana cards omit it and use the deterministic wanakana output.
   */
  reading?: string;
}

export const FLOW: ReviewFlowId = "vi-ja";
export const LEVEL: CefrLevel = "A1";
export const SOURCE = "japanese/lessons+authored-vi";

/**
 * ~22 real, simple A1 items pulled from japanese/lessons-a1.ts (vocabulary +
 * short example sentences). Vietnamese authored by hand, faithful to the source.
 */
export const AUTHORED_JA_ITEMS: readonly AuthoredJaItem[] = [
  // ── Greetings (lesson 3) ──────────────────────────────────────────────────
  // reading overrides: は (topic particle) → "wa", kanji transliterated. Human-reviewed.
  { back: "こんにちは", vi: "xin chào", enBridge: "hello / good afternoon", kind: "vocab", reading: "konnichiwa" },
  { back: "おはようございます", vi: "chào buổi sáng", enBridge: "good morning", kind: "vocab" },
  { back: "こんばんは", vi: "chào buổi tối", enBridge: "good evening", kind: "vocab", reading: "konbanwa" },
  { back: "さようなら", vi: "tạm biệt", enBridge: "goodbye", kind: "vocab" },
  { back: "ありがとうございます", vi: "cảm ơn", enBridge: "thank you", kind: "vocab" },

  // ── Self introduction (lesson 4) ──────────────────────────────────────────
  { back: "わたし", vi: "tôi", enBridge: "I", kind: "vocab" },
  { back: "わたしは田中です。", vi: "tôi là Tanaka.", enBridge: "I am Tanaka.", kind: "sentence", reading: "watashi wa tanaka desu." },
  { back: "出身は東京です。", vi: "tôi đến từ Tokyo.", enBridge: "I am from Tokyo.", kind: "sentence", reading: "shusshin wa tōkyō desu." },

  // ── Numbers (lesson 5) ────────────────────────────────────────────────────
  { back: "いち", vi: "một", enBridge: "1", kind: "vocab" },
  { back: "に", vi: "hai", enBridge: "2", kind: "vocab" },
  { back: "さん", vi: "ba", enBridge: "3", kind: "vocab" },
  { back: "ご", vi: "năm", enBridge: "5", kind: "vocab" },
  { back: "じゅう", vi: "mười", enBridge: "10", kind: "vocab" },

  // ── Greetings sentences (lesson 3) ────────────────────────────────────────
  { back: "こんにちは、元気ですか？", vi: "xin chào, bạn khỏe không?", enBridge: "Hello, how are you?", kind: "sentence", reading: "konnichiwa, genki desu ka?" },

  // ── Days / months / time (lessons 7, 8, 9) ────────────────────────────────
  { back: "今日は金曜日です。", vi: "hôm nay là thứ sáu.", enBridge: "Today is Friday.", kind: "sentence", reading: "kyō wa kinyōbi desu." },
  { back: "誕生日は五月です。", vi: "sinh nhật của tôi vào tháng năm.", enBridge: "My birthday is in May.", kind: "sentence", reading: "tanjōbi wa gogatsu desu." },
  { back: "今、三時です。", vi: "bây giờ là ba giờ.", enBridge: "It is 3 o'clock now.", kind: "sentence", reading: "ima, sanji desu." },
  { back: "今 (いま)", vi: "bây giờ", enBridge: "now", kind: "vocab" },

  // ── Directions (lesson 10) ────────────────────────────────────────────────
  { back: "右 (みぎ)", vi: "bên phải", enBridge: "right", kind: "vocab" },
  { back: "左 (ひだり)", vi: "bên trái", enBridge: "left", kind: "vocab" },
  { back: "駅はどこですか？", vi: "nhà ga ở đâu?", enBridge: "Where is the station?", kind: "sentence" },
  { back: "まっすぐ行って、右です。", vi: "đi thẳng, rồi rẽ phải.", enBridge: "Go straight, then it's on the right.", kind: "sentence" },
];

/**
 * Raw generation items fed to generateCandidates(). NOTE: no `front` is supplied
 * — the generator GENERATES it via translator.toVietnamese(back), and the romaji
 * reading via deriveRomaji(back). cefr is uniformly A1; source is provenance.
 */
export const RAW_ITEMS: readonly RawGenItem[] = AUTHORED_JA_ITEMS.map((it) => ({
  flow: FLOW,
  kind: it.kind,
  back: it.back,
  // Pass the human-reviewed romaji override when present; otherwise the
  // generator derives it via wanakana (correct for pure-kana cards).
  reading: it.reading,
  cefr: LEVEL,
  source: SOURCE,
}));

/** japanese → authored Vietnamese. Drives generation of the card front. */
export const toVi: ReadonlyMap<string, string> = new Map(
  AUTHORED_JA_ITEMS.map((it) => [it.back, it.vi] as const),
);

/** authored Vietnamese → japanese. Closes the back-translation round-trip. */
export const fromVi: ReadonlyMap<string, string> = new Map(
  AUTHORED_JA_ITEMS.map((it) => [it.vi, it.back] as const),
);
