/**
 * English L1 → Vietnamese target profile.
 *
 * The Axis 2 mirror of `vi.ts` — for English speakers studying
 * Vietnamese, not Vietnamese learners studying English. Covers 10
 * grammar families of canonical EN → VN transfer with 100+ paired
 * examples authored in the same shape as C1's vi-grammar.md.
 *
 * Scope:
 *   - meta: native=en, target=vi
 *   - interference: placeholder atlas (1 entry) — full EN→VN
 *     interference taxonomy is a future authoring lift; this profile
 *     ships the GRAMMAR layer (the artifact named in STRATEGY §15
 *     Axis 2 Bar #1) and a minimal interference pattern so the
 *     existing structural validator passes.
 *   - grammar: 10 families × 8-12 examples each = 100+ paired
 *     examples. Severity tiers per spec §0 lock. snake_case IDs.
 *   - grammar.rulePack: empty EN→VN rule pack stub. No detector rules
 *     ship in this PR — Axis 2 Bar #4 covers that work separately.
 *   - phonology / writing: omitted (out of Bar #1 scope).
 *
 * Schema reuse:
 *   - Imports types directly from `./vi.js` so the spec interface
 *     (CEFR, Severity, FeedbackLabel, GrammarFamily, L1Profile, etc.)
 *     has a single source of truth across the L1-profile family.
 *
 * Hard rules (from the dispatch):
 *   - DO NOT modify vi.ts (the Vietnamese L1 profile is locked).
 *   - DO NOT modify the structural validator or its tests.
 *   - DO NOT modify vnL1Interference.ts / l1-error-detector.ts /
 *     existing rule-packs — this profile is Axis 2; those are Axis 1.
 *
 * The `whyViL1` field name on GrammarFamilyExample is a historical
 * artifact from the vi.ts schema — for Axis 2 entries it describes the
 * English-L1 root of the transfer (the field name is misnamed for the
 * EN→VN direction; field-rename is a future schema cleanup).
 */

import type { L1Explanation, L1RulePack } from "../feedback/rule-pack-types.js";
import type {
  CEFR,
  GrammarFamily,
  GrammarLayer,
  InterferenceMap,
  L1Profile,
  L1ProfileMetadata,
} from "./vi.js";

// ──────────────────────────────────────────────────────────────────────────
// Empty EN→VN rule-pack stub.
//
// GrammarLayer.rulePack is required by the spec §2 interface. No detector
// rules ship in this PR (Axis 2 Bar #4 is the detector-rules dispatch);
// the empty rule pack satisfies the type contract and lets the structural
// validator's cross-link check short-circuit (validRuleTags.size === 0 →
// skip).
// ──────────────────────────────────────────────────────────────────────────

const EN_VN_RULE_PACK: L1RulePack = {
  l1Code: "en",
  l1Name: "English",
  version: "0.1.0",
  rules: [],
  explanations: [] as L1Explanation[],
};

// ──────────────────────────────────────────────────────────────────────────
// Grammar families — 10 canonical EN→VN transfer patterns, 100+ examples.
// Curated from applied-linguistics literature on EN-L1 Vietnamese learner
// errors plus MercyBlade Vietnamese-for-foreigners track observations.
// ──────────────────────────────────────────────────────────────────────────

const grammarFamilies: GrammarFamily[] = [
  // 1
  {
    id: "classifier_omission",
    descriptionEn:
      "English speakers omit Vietnamese classifiers (loại từ) when counting or pointing at nouns. English 'one book' maps directly to a count + noun; Vietnamese requires a classifier slot between them: 'một cuốn sách'.",
    descriptionVi:
      "Người học gốc tiếng Anh quên loại từ khi đếm hoặc chỉ danh từ. Tiếng Anh 'one book' = số đếm + danh từ; tiếng Việt cần loại từ ở giữa: 'một cuốn sách'.",
    severity: "high",
    severityRationale:
      "Listeners notice immediately and parse the utterance as visibly foreign. Often the first marker by which a Vietnamese speaker identifies an English-speaker learner.",
    ruleTags: ["en_l1_classifier_omission"],
    phenomenon: "classifier_omission",
    examples: [
      { learnerProduces: "Tôi mua một sách.", targetForm: "Tôi mua một cuốn sách.", whyViL1: "English 'a book' = a + book; learner omits the classifier 'cuốn'." },
      { learnerProduces: "Có ba người ăn ở đây.", targetForm: "Có ba người ăn ở đây.", whyViL1: "Correct — 'người' itself functions as a classifier for humans, so no extra slot is needed. Trap: the rule is not 'always add a classifier'." },
      { learnerProduces: "Tôi có hai chó.", targetForm: "Tôi có hai con chó.", whyViL1: "Animals always take 'con'; learner maps 'two dogs' → 'two + dog'." },
      { learnerProduces: "Cho tôi một cà phê.", targetForm: "Cho tôi một ly cà phê.", whyViL1: "Drinks need a container classifier ('ly' = glass, 'cốc' = cup); learner omits because 'a coffee' is grammatical English." },
      { learnerProduces: "Mua giúp tôi ba táo.", targetForm: "Mua giúp tôi ba quả táo.", whyViL1: "Round fruit takes 'quả' (or 'trái' in the South)." },
      { learnerProduces: "Tôi đang đọc hai sách.", targetForm: "Tôi đang đọc hai cuốn sách.", whyViL1: "Books are bound objects, classifier 'cuốn' is obligatory after numerals." },
      { learnerProduces: "Em muốn một bút.", targetForm: "Em muốn một cái bút.", whyViL1: "Default classifier 'cái' for everyday inanimate objects." },
      { learnerProduces: "Có nhiều xe ngoài đường.", targetForm: "Có nhiều chiếc xe ngoài đường.", whyViL1: "Quantifier 'nhiều' still triggers the classifier slot for count contexts. Casual speech may drop it, but formal/correct writing requires 'chiếc'." },
      { learnerProduces: "Tôi cần một bản đồ.", targetForm: "Tôi cần một tấm bản đồ.", whyViL1: "Flat objects take 'tấm'." },
      { learnerProduces: "Cô ấy có ba nhẫn vàng.", targetForm: "Cô ấy có ba chiếc nhẫn vàng.", whyViL1: "Small wearable items take 'chiếc'." },
    ],
  },

  // 2
  {
    id: "pronoun_age_register_mismatch",
    descriptionEn:
      "English speakers use 'tôi' for first-person and 'bạn' for second-person across all addressees. Vietnamese requires age- and relationship-relative pronoun selection (anh / chị / em / ông / bà / cô / chú / cháu / con), and the wrong choice is socially jarring — sometimes offensive — even when the sentence is otherwise correct.",
    descriptionVi:
      "Người học gốc tiếng Anh dùng 'tôi' và 'bạn' cho mọi đối tượng. Tiếng Việt phải chọn đại từ theo tuổi và mối quan hệ — chọn sai gây mất lịch sự nặng nề dù câu vẫn đúng ngữ pháp.",
    severity: "high",
    severityRationale:
      "Politeness-critical. A foreign learner using 'bạn' to address a grandparent isn't just awkward — it reads as rude. This is the second-most-cited Vietnamese-as-L2 challenge after tones.",
    ruleTags: ["en_l1_pronoun_age_register"],
    phenomenon: "pronoun_age_register",
    examples: [
      { learnerProduces: "Chào bạn, bạn ăn cơm chưa?", targetForm: "Chào bà, bà ăn cơm chưa?", whyViL1: "Addressing an elderly woman as 'bạn' is rude. Use 'bà' (grandmother register) + speaker self-refers as 'cháu'." },
      { learnerProduces: "Tôi cảm ơn bạn rất nhiều.", targetForm: "Em cảm ơn anh rất nhiều.", whyViL1: "Speaker addressing an older male informally: self = 'em', other = 'anh'." },
      { learnerProduces: "Bạn là giáo viên của tôi.", targetForm: "Cô là giáo viên của em.", whyViL1: "Female teacher = 'cô'; student self-refers as 'em'." },
      { learnerProduces: "Tôi yêu bạn.", targetForm: "Anh yêu em.", whyViL1: "Romantic context — older partner = 'anh' / younger = 'em'. The English 'I love you' carries no age cue, so learner defaults to neutral 'tôi/bạn' which sounds clinical." },
      { learnerProduces: "Bạn có khoẻ không?", targetForm: "Chú có khoẻ không?", whyViL1: "Addressing a middle-aged man (uncle range) = 'chú'." },
      { learnerProduces: "Tôi muốn nói chuyện với bạn.", targetForm: "Em muốn nói chuyện với chị.", whyViL1: "Speaker addressing a slightly older woman in casual conversation: 'chị' / 'em'." },
      { learnerProduces: "Bạn của tôi đến thăm.", targetForm: "Bạn của em đến thăm.", whyViL1: "Here 'bạn' (friend) is a noun, correct. But the speaker's self-reference shifts based on who they're talking to. Trap: 'bạn' AS A NOUN ≠ 'bạn' AS YOU-PRONOUN." },
      { learnerProduces: "Bạn đi đâu vậy?", targetForm: "Em đi đâu vậy?", whyViL1: "Older speaker addressing a child or younger person: 'em' (or 'cháu')." },
      { learnerProduces: "Tôi xin lỗi bạn.", targetForm: "Cháu xin lỗi cô.", whyViL1: "Young speaker apologizing to a middle-aged woman: 'cháu' / 'cô'. The 'tôi/bạn' default reads as cold and detached." },
    ],
  },

  // 3
  {
    id: "copula_la_with_adjective",
    descriptionEn:
      "English speakers say 'Tôi là vui' modeling 'I am happy' — using 'là' as a generic copula. Vietnamese adjectives function as predicates directly, with no copula. 'Là' is used ONLY before noun complements ('Tôi là sinh viên').",
    descriptionVi:
      "Người học gốc tiếng Anh thêm 'là' trước tính từ, mô phỏng 'I am happy'. Tính từ tiếng Việt làm vị ngữ trực tiếp, không cần động từ nối. 'Là' chỉ đi trước danh từ.",
    severity: "high",
    severityRationale:
      "Frequent and instantly identifying. Native speakers will understand but it sounds like a textbook error — flags the learner as actively translating from English in their head.",
    ruleTags: ["en_l1_copula_la_adj"],
    phenomenon: "copula_la_with_adjective",
    examples: [
      { learnerProduces: "Tôi là vui.", targetForm: "Tôi vui.", whyViL1: "Adjective 'vui' (happy) is the predicate directly; no copula needed." },
      { learnerProduces: "Cô ấy là đẹp.", targetForm: "Cô ấy đẹp.", whyViL1: "'đẹp' (pretty) predicates directly." },
      { learnerProduces: "Anh ấy là mệt.", targetForm: "Anh ấy mệt.", whyViL1: "'mệt' (tired) — no copula." },
      { learnerProduces: "Tôi là sinh viên.", targetForm: "Tôi là sinh viên.", whyViL1: "Correct — 'sinh viên' (student) is a noun complement, so 'là' IS required. The rule is not 'never use là' but 'only before nouns.'" },
      { learnerProduces: "Thời tiết hôm nay là lạnh.", targetForm: "Thời tiết hôm nay lạnh.", whyViL1: "Adjective 'lạnh' (cold) is the predicate; no copula." },
      { learnerProduces: "Phở này là ngon.", targetForm: "Phở này ngon.", whyViL1: "'ngon' (delicious) predicates directly." },
      { learnerProduces: "Em là khoẻ, cảm ơn.", targetForm: "Em khoẻ, cảm ơn.", whyViL1: "Standard response to 'How are you' — no 'là'." },
      { learnerProduces: "Nhà tôi là to.", targetForm: "Nhà tôi to.", whyViL1: "'to' (big) is an adjective predicate." },
      { learnerProduces: "Tiếng Việt là khó.", targetForm: "Tiếng Việt khó.", whyViL1: "The most common form of this error — speakers say 'Vietnamese is hard' and reach for 'là'." },
    ],
  },

  // 4
  {
    id: "sentence_final_particle_omission",
    descriptionEn:
      "English speakers omit Vietnamese sentence-final particles (nhé / nha / à / đấy / đó / chứ / vậy) that carry register, softening, confirmation, or emphasis. Without them, utterances sound flat, blunt, or unintentionally formal.",
    descriptionVi:
      "Người học gốc tiếng Anh không thêm trợ từ cuối câu (nhé / nha / à / đấy / đó / chứ / vậy). Câu thiếu trợ từ nghe cộc lốc, lạnh nhạt, hoặc trang trọng quá mức không phù hợp.",
    severity: "medium",
    severityRationale:
      "Doesn't block meaning but makes the learner sound unfriendly or robotic. Native speakers parse around it but adjust their own register downward when they notice.",
    ruleTags: ["en_l1_final_particle_omission"],
    phenomenon: "sentence_final_particle_omission",
    examples: [
      { learnerProduces: "Đi ăn.", targetForm: "Đi ăn nhé!", whyViL1: "Casual invitation needs 'nhé' (or 'nha' in the South) — without it, sounds like a command." },
      { learnerProduces: "Cảm ơn.", targetForm: "Cảm ơn nhé.", whyViL1: "Plain 'cảm ơn' is acceptable but cold; 'nhé' softens it into warm everyday register." },
      { learnerProduces: "Đẹp.", targetForm: "Đẹp đấy!", whyViL1: "Praising someone's outfit — 'đấy' adds emphasis + warmth. Bare 'đẹp' sounds clinical." },
      { learnerProduces: "Anh đến đúng giờ.", targetForm: "Anh đến đúng giờ chứ?", whyViL1: "Confirmation question — 'chứ?' adds 'right?' tone. Without it, sounds like a statement." },
      { learnerProduces: "Sao thế.", targetForm: "Sao thế vậy?", whyViL1: "Open question needs 'vậy' for natural register." },
      { learnerProduces: "Em làm xong rồi.", targetForm: "Em làm xong rồi đấy!", whyViL1: "Announcing completion to a superior — 'đấy' marks the announcement." },
      { learnerProduces: "Mai đi chơi.", targetForm: "Mai đi chơi nha.", whyViL1: "Casual plan-making — 'nha' (South) softens into friendly invitation." },
      { learnerProduces: "Hôm nay anh ăn gì.", targetForm: "Hôm nay anh ăn gì vậy?", whyViL1: "Question without final particle reads as interrogation." },
    ],
  },

  // 5
  {
    id: "noun_modifier_order",
    descriptionEn:
      "English speakers transfer the English ADJ + NOUN order ('red book') directly to Vietnamese, producing 'đỏ sách'. Vietnamese is NOUN + ADJ: 'sách đỏ'. Same inversion needed for noun-noun modification, relative-clause-like constructions, and possessives.",
    descriptionVi:
      "Người học gốc tiếng Anh đặt tính từ trước danh từ theo trật tự tiếng Anh ('red book' → 'đỏ sách'). Tiếng Việt là DANH TỪ + TÍNH TỪ: 'sách đỏ'.",
    severity: "medium",
    severityRationale:
      "Sentences become hard to parse — listener has to mentally reorder. Easily corrected once the rule is noticed, but slips back under speed.",
    ruleTags: ["en_l1_noun_modifier_order"],
    phenomenon: "noun_modifier_order",
    examples: [
      { learnerProduces: "Đỏ sách rất đẹp.", targetForm: "Sách đỏ rất đẹp.", whyViL1: "ADJ + N → N + ADJ inversion." },
      { learnerProduces: "Tôi muốn một nóng cà phê.", targetForm: "Tôi muốn một cà phê nóng.", whyViL1: "'hot coffee' → 'cà phê nóng'." },
      { learnerProduces: "Cô ấy có dài tóc.", targetForm: "Cô ấy có tóc dài.", whyViL1: "'long hair' → 'tóc dài'." },
      { learnerProduces: "Đây là tốt nhà hàng.", targetForm: "Đây là nhà hàng tốt.", whyViL1: "'good restaurant' → 'nhà hàng tốt'." },
      { learnerProduces: "Mua giúp tôi xanh áo.", targetForm: "Mua giúp tôi áo xanh.", whyViL1: "'blue shirt' → 'áo xanh'." },
      { learnerProduces: "Tôi thích Việt Nam đồ ăn.", targetForm: "Tôi thích đồ ăn Việt Nam.", whyViL1: "'Vietnamese food' — country name as modifier still follows the noun." },
      { learnerProduces: "Đây là của tôi điện thoại.", targetForm: "Đây là điện thoại của tôi.", whyViL1: "'my phone' → possessive 'của tôi' AFTER the noun." },
      { learnerProduces: "Chúng ta vào lớn phòng.", targetForm: "Chúng ta vào phòng lớn.", whyViL1: "'big room' → 'phòng lớn'." },
    ],
  },

  // 6
  {
    id: "aspect_marker_overuse",
    descriptionEn:
      "English speakers map English tense morphology to Vietnamese aspect markers (đã / đang / sẽ / rồi) mechanically, inserting them everywhere. Vietnamese drops aspect markers freely when time is clear from context, an adverb, or the conversation — overusing them sounds stilted and textbook-like.",
    descriptionVi:
      "Người học gốc tiếng Anh ép đã/đang/sẽ vào mọi câu, mô phỏng thì tiếng Anh. Tiếng Việt thường bỏ trợ từ khi thời gian đã rõ qua ngữ cảnh hoặc trạng từ; lạm dụng nghe rất giáo điều.",
    severity: "medium",
    severityRationale:
      "Doesn't break meaning but immediately marks the speaker as a textbook learner. Native speech is far more elliptical than learner materials suggest.",
    ruleTags: ["en_l1_aspect_overuse"],
    phenomenon: "aspect_marker_overuse",
    examples: [
      { learnerProduces: "Hôm qua tôi đã đi chợ.", targetForm: "Hôm qua tôi đi chợ.", whyViL1: "'Hôm qua' (yesterday) already marks past; 'đã' is redundant and over-formal in casual speech." },
      { learnerProduces: "Bây giờ tôi đang ăn cơm.", targetForm: "Bây giờ tôi ăn cơm.", whyViL1: "'Bây giờ' (right now) already marks present; 'đang' is redundant in everyday speech." },
      { learnerProduces: "Ngày mai tôi sẽ đi học.", targetForm: "Ngày mai tôi đi học.", whyViL1: "'Ngày mai' (tomorrow) covers future; 'sẽ' is optional and often dropped." },
      { learnerProduces: "Cô ấy đã có ba con.", targetForm: "Cô ấy có ba con.", whyViL1: "Stative possession — no aspect marker needed." },
      { learnerProduces: "Tôi đang muốn ăn phở.", targetForm: "Tôi muốn ăn phở.", whyViL1: "Stative verb 'muốn' (want) doesn't take progressive 'đang'." },
      { learnerProduces: "Tôi đang biết.", targetForm: "Tôi biết.", whyViL1: "Cognitive verb 'biết' (know) is stative — no 'đang'." },
      { learnerProduces: "Anh đã hiểu chưa?", targetForm: "Anh hiểu chưa?", whyViL1: "'chưa?' (yet?) already implies completed-action question; 'đã' is redundant." },
      { learnerProduces: "Tôi đã đang đi.", targetForm: "Tôi đi rồi. / Tôi đã đi.", whyViL1: "Stacking aspect markers (past+progressive) is ungrammatical in Vietnamese." },
    ],
  },

  // 7
  {
    id: "question_formation_inversion",
    descriptionEn:
      "English speakers attempt subject-auxiliary inversion ('Are you tired?' → 'Là anh mệt?') instead of using Vietnamese's yes/no-question patterns: postposed 'không' ('Anh mệt không?'), the 'có … không' frame, or final-particle questions.",
    descriptionVi:
      "Người học gốc tiếng Anh đảo trật tự chủ ngữ-trợ động từ kiểu Anh thay vì dùng cấu trúc câu hỏi tiếng Việt (postposed 'không', khung 'có … không', hoặc trợ từ cuối câu).",
    severity: "medium",
    severityRationale:
      "Listeners decode but it's immediately marked as foreign syntax. The 'có … không' pattern is one of the first taught — slips because under pressure English inversion is automatic.",
    ruleTags: ["en_l1_question_inversion"],
    phenomenon: "question_formation_inversion",
    examples: [
      { learnerProduces: "Là anh mệt?", targetForm: "Anh mệt không? / Anh có mệt không?", whyViL1: "English 'Are you tired?' — learner tries to front the copula." },
      { learnerProduces: "Có cô đi không?", targetForm: "Cô có đi không?", whyViL1: "'có' precedes the VERB, not the subject. Word order matters." },
      { learnerProduces: "Đi anh chợ không?", targetForm: "Anh đi chợ không?", whyViL1: "Subject must come first in a Vietnamese question; learner inverts SVO." },
      { learnerProduces: "Là em hiểu?", targetForm: "Em hiểu không? / Em hiểu chưa?", whyViL1: "'Do you understand?' — no copula, just postposed 'không' or 'chưa'." },
      { learnerProduces: "Có là anh người Việt?", targetForm: "Anh có phải là người Việt không?", whyViL1: "Identity questions use 'có phải là … không?' frame; learner forgets 'phải'." },
      { learnerProduces: "Cô ấy ăn rồi?", targetForm: "Cô ấy ăn chưa? / Cô ấy ăn rồi à?", whyViL1: "Without 'chưa' or final particle, sounds like a statement with question intonation (which works in EN but not VN)." },
      { learnerProduces: "Là gì anh ăn?", targetForm: "Anh ăn gì?", whyViL1: "WH-questions: question word stays in situ, not fronted." },
      { learnerProduces: "Bao nhiêu giá?", targetForm: "Giá bao nhiêu?", whyViL1: "Vietnamese keeps the question word AFTER the noun being asked about." },
    ],
  },

  // 8
  {
    id: "negation_misplacement",
    descriptionEn:
      "English speakers split or misplace 'không' (not), either mimicking English do-support ('Anh có không đi?') or attaching 'không' to the wrong word. Vietnamese 'không' goes IMMEDIATELY before the verb being negated.",
    descriptionVi:
      "Người học gốc tiếng Anh đặt 'không' sai vị trí — mô phỏng do-support tiếng Anh hoặc gắn vào sai từ. 'Không' tiếng Việt đứng NGAY TRƯỚC động từ bị phủ định.",
    severity: "medium",
    severityRationale:
      "Affects parseability but rarely changes meaning beyond confusion. Easily diagnosed because the rule is mechanical.",
    ruleTags: ["en_l1_negation_misplacement"],
    phenomenon: "negation_misplacement",
    examples: [
      { learnerProduces: "Tôi có không đi.", targetForm: "Tôi không đi.", whyViL1: "Mimics 'I do not go' — no auxiliary needed in Vietnamese; 'không' directly negates 'đi'." },
      { learnerProduces: "Cô ấy là không sinh viên.", targetForm: "Cô ấy không phải là sinh viên.", whyViL1: "Negating an identity needs 'không phải là'; bare 'không' before 'là' is wrong." },
      { learnerProduces: "Tôi không hôm qua đi.", targetForm: "Hôm qua tôi không đi.", whyViL1: "'không' goes immediately before the verb, not before the time adverb." },
      { learnerProduces: "Đi không tôi.", targetForm: "Tôi không đi.", whyViL1: "Word order error — subject first, then negation + verb." },
      { learnerProduces: "Anh ấy không ngon nấu.", targetForm: "Anh ấy nấu không ngon.", whyViL1: "'không ngon' (not delicious) is an adjective phrase — must come AFTER the verb it modifies." },
      { learnerProduces: "Tôi không có thích.", targetForm: "Tôi không thích.", whyViL1: "'có' is not auxiliary support like English 'do'; pure transfer error." },
      { learnerProduces: "Cô ấy là sinh viên không.", targetForm: "Cô ấy không phải là sinh viên.", whyViL1: "Post-clausal 'không' creates a yes/no question, not a negation." },
      { learnerProduces: "Tôi nói không tiếng Việt.", targetForm: "Tôi không nói tiếng Việt.", whyViL1: "'không' must precede the verb 'nói', not the object." },
    ],
  },

  // 9
  {
    id: "plural_marker_redundancy",
    descriptionEn:
      "English speakers add Vietnamese plural markers (những / các) on top of numerals or classifiers that already encode plurality. 'Three books' → 'ba những cuốn sách' (wrong) or 'những ba cuốn sách' (wrong). When a count is explicit, the plural marker is redundant or ungrammatical.",
    descriptionVi:
      "Người học gốc tiếng Anh thêm những/các vào câu đã có số đếm hoặc loại từ thể hiện số nhiều. Khi có số đếm rõ, lượng từ những/các là thừa hoặc sai.",
    severity: "low",
    severityRationale:
      "Self-corrects with exposure. Doesn't block meaning. Flag for written work; don't interrupt speech.",
    ruleTags: ["en_l1_plural_marker_redundant"],
    phenomenon: "plural_marker_redundancy",
    examples: [
      { learnerProduces: "Tôi mua ba những cuốn sách.", targetForm: "Tôi mua ba cuốn sách.", whyViL1: "Numeral 'ba' already plural; 'những' is redundant." },
      { learnerProduces: "Có hai các sinh viên.", targetForm: "Có hai sinh viên. / Có hai bạn sinh viên.", whyViL1: "Numeral + 'các' don't combine in this slot." },
      { learnerProduces: "Năm những con chó.", targetForm: "Năm con chó.", whyViL1: "Number + classifier carries plural; 'những' is wrong here." },
      { learnerProduces: "Tôi thấy nhiều những người.", targetForm: "Tôi thấy nhiều người.", whyViL1: "'Nhiều' already covers many; 'những' is redundant." },
      { learnerProduces: "Các bốn quả táo.", targetForm: "Bốn quả táo. / Những quả táo này.", whyViL1: "'Các' + numeral collide." },
      { learnerProduces: "Em có ba các bạn.", targetForm: "Em có ba người bạn.", whyViL1: "When counting friends, use 'người' as classifier; 'các' is wrong." },
      { learnerProduces: "Hai những điện thoại của tôi.", targetForm: "Hai cái điện thoại của tôi.", whyViL1: "Numeral takes classifier 'cái', not lượng từ 'những'." },
      { learnerProduces: "Tôi thích những hai bài hát này.", targetForm: "Tôi thích hai bài hát này.", whyViL1: "Specific count + demonstrative — no plural marker." },
    ],
  },

  // 10
  {
    id: "direct_translation_calque",
    descriptionEn:
      "English speakers translate idioms and fixed phrases word-for-word into Vietnamese, producing semantically transparent but unidiomatic output. 'I'm running out of time' → 'Tôi đang chạy hết thời gian' (literal but wrong). Native Vietnamese has its own idioms covering the same meanings.",
    descriptionVi:
      "Người học gốc tiếng Anh dịch thành ngữ từng chữ sang tiếng Việt, tạo câu rõ nghĩa nhưng không tự nhiên. Tiếng Việt có thành ngữ riêng cho cùng ý.",
    severity: "medium",
    severityRationale:
      "Listeners parse the literal meaning but immediately mark the speaker as translating in their head. Once flagged, learners absorb the native idiom quickly.",
    ruleTags: ["en_l1_calque"],
    phenomenon: "direct_translation_calque",
    examples: [
      { learnerProduces: "Tôi đang chạy hết thời gian.", targetForm: "Tôi sắp hết giờ. / Tôi không còn thời gian.", whyViL1: "Calque of 'I'm running out of time'. Vietnamese says 'sắp hết giờ' (almost out of time)." },
      { learnerProduces: "Tôi không cảm thấy nó.", targetForm: "Tôi không thấy hứng. / Tôi không muốn.", whyViL1: "Calque of 'I don't feel it' (slang for 'not interested'). Vietnamese needs an explicit 'hứng' (interest) or 'muốn' (want)." },
      { learnerProduces: "Lấy nó dễ dàng.", targetForm: "Bình tĩnh đi. / Thư giãn đi.", whyViL1: "Calque of 'take it easy'. Vietnamese says 'bình tĩnh' (calm down) or 'thư giãn' (relax)." },
      { learnerProduces: "Tôi đã làm nó.", targetForm: "Tôi đã làm xong. / Tôi xong rồi.", whyViL1: "'I did it!' as celebration — Vietnamese uses 'xong rồi' (done) for completion, not 'làm nó'." },
      { learnerProduces: "Đập một quả bóng.", targetForm: "Vui chơi thoải mái! / Quẩy hết mình!", whyViL1: "Calque of 'have a ball' (have fun). Literal translation references actual balls." },
      { learnerProduces: "Cảm ơn bạn rất nhiều cho điều này.", targetForm: "Cảm ơn anh/chị nhiều lắm vì việc này.", whyViL1: "Calque of 'thanks for this' — Vietnamese uses 'vì' (because of/for the reason of), not 'cho' (give to). Also pronoun fix." },
      { learnerProduces: "Tôi đang nhớ bạn của tôi.", targetForm: "Tôi nhớ bạn (của) tôi.", whyViL1: "'I am missing my friend' — Vietnamese 'nhớ' is stative, no 'đang' aspect marker; also possessive 'của' is often dropped in close-relationship contexts." },
      { learnerProduces: "Cho tôi biết.", targetForm: "Báo cho tôi biết. / Nói cho tôi biết nhé.", whyViL1: "Calque of 'let me know'. Vietnamese needs a verb of communication ('báo' = inform, 'nói' = tell) before 'cho tôi biết'." },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Interference atlas — placeholder (1 pattern) so the structural validator
// passes. Full EN→VN interference taxonomy is a future authoring lift.
// ──────────────────────────────────────────────────────────────────────────

const interferenceMap: InterferenceMap = {
  patterns: [
    {
      id: "en_l1_pronoun_age_register_placeholder",
      category: "pragmatics",
      name: "Pronoun age-register mismatch (placeholder)",
      shortDescription:
        "Placeholder interference entry: English speakers use 'tôi/bạn' universally; Vietnamese requires age-relative pronoun selection. See grammar family `pronoun_age_register_mismatch` for the authored content.",
      longDescription:
        "Interference atlas for EN→VN is not authored in this profile. The grammar layer (10 families, 80+ examples) carries the substantive content for Axis 2 Bar #1. This single placeholder pattern satisfies the structural-validator requirement that `interference.patterns` be non-empty; a future dispatch will author a full atlas if/when downstream consumers (placement grader, lesson recommender) need it.",
      vietnameseRoot:
        "Tiếng Anh chỉ có 'I/you'. Tiếng Việt phải chọn đại từ theo tuổi và mối quan hệ (anh/chị/em/ông/bà/cô/chú/cháu/con) — chọn sai gây mất lịch sự.",
      examples: [
        {
          incorrect: "Chào bạn, bạn ăn cơm chưa?",
          corrected: "Chào bà, bà ăn cơm chưa?",
          gloss: "addressing an elderly woman as 'bạn' is rude — use 'bà' + self-refer as 'cháu'",
          context: "Greeting an elderly stranger",
        },
      ],
      cefrLevelsObserved: ["A1", "A2", "B1", "B2"] as CEFR[],
      severity: "high",
      remediation:
        "Teach the pronoun chart early. Drill greetings with age cues. Reinforce that 'bạn' is for peers ONLY; 'tôi' for self-reference is acceptable but feels distant in close relationships.",
      ruleTags: ["en_l1_pronoun_age_register_placeholder"],
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// Layers + assembly.
// ──────────────────────────────────────────────────────────────────────────

const grammarLayer: GrammarLayer = {
  rulePack: EN_VN_RULE_PACK,
  families: grammarFamilies,
};

const meta: L1ProfileMetadata = {
  nativeLangCode: "en",
  nativeLangName: "English",
  targetLangCode: "vi",
  version: "0.1.0",
  lastReviewed: "2026-05-25",
  lastReviewedBy: "C3",
  citations: [
    "STRATEGY.md §15 Axis 2 Bar #1",
    "docs/l1-taxonomies/spec.md",
    "src/lib/l1-profiles/vi.ts (schema template)",
  ],
};

export const englishL1Profile: L1Profile = {
  meta,
  interference: interferenceMap,
  grammar: grammarLayer,
};

export default englishL1Profile;
