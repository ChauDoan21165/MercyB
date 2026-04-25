// src/data/profession-packs/nail-technician/index.ts
//
// Step 10 — VN profession pack: nail technician English.
//
// The largest Vietnamese-diaspora profession in the United States is
// nail technician (US Census + BLS surveys put it well above any
// other single trade among VN-born workers). This pack is the first
// in a planned series of profession-specific bilingual packs. The
// brief from Chau:
//
//   - Authentic VN-tech voice. Not generic ESL "vocabulary list."
//     Phrases are what you actually say to a customer in a chair.
//   - Customer-facing register: warm, direct, professional. Tip-asking
//     scenarios stay respectful, not pushy.
//   - VN-first explanations, English target. The teaching scaffold
//     reads in Vietnamese; the practice surface is English.
//   - Hand-crafted. No LLM-generated filler. If a phrase doesn't
//     come from a real salon interaction, it doesn't ship.
//
// Shape per category:
//
//   vocabulary[i]     { en, vi, pos, note_vi?, pronunciation_hint? }
//   phrases[i]        { en, vi, register, when_to_use_vi, common_response_en? }
//   scenarios[i]      { slug, title_vi, title_en, turns: { speaker, en, vi, coaching_vi? }[] }
//   pronunciation[i]  { word, ipa_hint, vn_trap_vi, drill_pair? }
//   l1_overrides[i]   { tag, name_vi, why_vi, example_wrong, example_right }
//
// Counts (enforced by tests):
//   - 30 ≤ vocabulary ≤ 100
//   - 20 ≤ phrases    ≤ 30
//   -  5 ≤ scenarios  ≤ 8
//   -  ≥ 10 pronunciation traps
//   -  ≥ 5  L1 overrides
//
// Adding a new profession pack:
//   1. Create src/data/profession-packs/<slug>/ following this layout.
//   2. Re-use the type exports below — they're the contract.
//   3. Add a companion test that validates count ranges + non-empty
//      bilingual fields.

export type Vocabulary = {
  /** English term as written on the salon menu / chair-side. */
  en: string;
  /** Vietnamese gloss — natural, not literal. */
  vi: string;
  /** Part of speech — keeps the vocabulary card cleanly typed. */
  pos: "noun" | "verb" | "adjective" | "phrase";
  /** Short Vietnamese note when the literal gloss isn't enough. */
  note_vi?: string;
  /** Optional Vietnamese pronunciation tip ("đọc kiểu ə-cri-lic"). */
  pronunciation_hint?: string;
};

export type PhraseRegister = "greeting" | "service" | "upsell" | "complaint" | "closing" | "tip";

export type Phrase = {
  /** What you say to the customer. */
  en: string;
  /** Vietnamese gloss + intent. */
  vi: string;
  /** Functional register — lets the UI group phrases by use-case. */
  register: PhraseRegister;
  /** Vietnamese teaching note: when this is the right phrase to use. */
  when_to_use_vi: string;
  /** Optional canned customer reply so the learner can practise both sides. */
  common_response_en?: string;
};

export type ScenarioTurn = {
  speaker: "tech" | "customer";
  en: string;
  vi: string;
  /** Optional Vietnamese coaching shown next to the tech's lines. */
  coaching_vi?: string;
};

export type Scenario = {
  /** URL-safe slug for any future deep-linking. */
  slug: string;
  title_vi: string;
  title_en: string;
  turns: ScenarioTurn[];
};

export type PronunciationTrap = {
  /** The English word. */
  word: string;
  /** Loose IPA-ish hint. Not strict IPA — this is for VN learners. */
  ipa_hint: string;
  /** What VN speakers typically get wrong, written in Vietnamese. */
  vn_trap_vi: string;
  /** Optional minimal-pair drill, e.g. "polish / Polish". */
  drill_pair?: string;
};

export type L1Override = {
  /** Tag prefix matches the L1 detector convention but stays scoped. */
  tag: string;
  name_vi: string;
  /** Vietnamese teacher-voice "why this is hard for us" line. */
  why_vi: string;
  example_wrong: string;
  example_right: string;
};

export type ProfessionPack = {
  slug: string;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  vocabulary: Vocabulary[];
  phrases: Phrase[];
  scenarios: Scenario[];
  pronunciation: PronunciationTrap[];
  l1_overrides: L1Override[];
};

import vocabulary from "./vocabulary.json";
import phrases from "./phrases.json";
import scenarios from "./scenarios.json";
import pronunciation from "./pronunciation-traps.json";
import l1Overrides from "./l1-overrides.json";

export const NAIL_TECHNICIAN_PACK: ProfessionPack = Object.freeze({
  slug: "nail-tech",
  title_vi: "Tiếng Anh cho thợ nail",
  title_en: "English for nail technicians",
  intro_vi:
    "Bộ tiếng Anh thực tế dành cho thợ nail người Việt — từ vựng ở salon, câu giao tiếp với khách, kịch bản role-play, và những lỗi phát âm hay gặp. Học theo những gì thật sự nói ở tiệm, không phải sách giáo khoa.",
  vocabulary: vocabulary as Vocabulary[],
  phrases: phrases as Phrase[],
  scenarios: scenarios as Scenario[],
  pronunciation: pronunciation as PronunciationTrap[],
  l1_overrides: l1Overrides as L1Override[],
});

export default NAIL_TECHNICIAN_PACK;
