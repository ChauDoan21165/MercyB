/**
 * EN→VN rule-pack: bilingual short-form feedback strings.
 *
 * One entry per detector tag. `en` is the teaching note shown to the
 * English-L1 learner; `vi` is a Vietnamese summary for trainers /
 * reviewers (since the user IS learning Vietnamese, the EN side is
 * the primary user-facing surface — mirror of `rule-packs/vi/` which
 * surfaces VI to a Vietnamese-L1 learner).
 *
 * Templates support `{FIX}` (corrected sentence) plus rule-specific
 * placeholders documented in `./detectors.ts`.
 */

import type { L1Explanation } from "../../rule-pack-types.js";

export const EN_VN_EXPLANATIONS: L1Explanation[] = [
  {
    tag: "en_l1_copula_la_adj",
    en: "Vietnamese adjectives don't take a copula. \"Tôi là vui\" mirrors English \"I am happy\" but Vietnamese says the adjective directly. Use **là** only before nouns (\"Tôi là sinh viên\"). Try: *{FIX}*.",
    vi: "Người học gốc tiếng Anh hay thêm **là** trước tính từ. Tính từ tiếng Việt làm vị ngữ trực tiếp — không cần động từ nối. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_classifier_omission",
    en: "Vietnamese needs a classifier (loại từ) between a numeral and a noun: **một** *{NOUN}* → **một** [classifier] *{NOUN}*. Common classifiers: **cuốn** (books), **con** (animals), **cái** (default inanimate), **chiếc** (vehicles + items), **quả** (round fruits). Try: *{FIX}*.",
    vi: "Học viên gốc Anh quên loại từ khi đếm. Số đếm + loại từ + danh từ. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_aspect_overuse_stative",
    en: "Stative verbs like **{VERB}** (know, want, have, like, love) don't take the progressive **đang** in Vietnamese. \"Tôi đang biết\" sounds wrong — say \"Tôi biết\". Try: *{FIX}*.",
    vi: "Động từ trạng thái ({VERB}) không kết hợp với **đang**. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_noun_modifier_inversion",
    en: "Vietnamese is NOUN + ADJECTIVE, the reverse of English. \"{ADJ} {NOUN}\" needs to flip to \"{NOUN} {ADJ}\". \"red book\" → \"sách đỏ\". Try: *{FIX}*.",
    vi: "Trật tự danh từ + tính từ ngược với tiếng Anh. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_plural_marker_redundancy",
    en: "When you've already given a number, the plural marker **{MARKER}** is redundant. \"ba **{MARKER}** cuốn sách\" → just \"ba cuốn sách\". The numeral does the plural work. Try: *{FIX}*.",
    vi: "Có số đếm rồi thì **{MARKER}** là thừa. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_negation_la_missing_phai",
    en: "To negate an identity (\"is not a teacher\"), Vietnamese uses **không phải là**, not bare \"không là\". \"Cô ấy không là sinh viên\" → \"Cô ấy không phải là sinh viên\". Try: *{FIX}*.",
    vi: "Phủ định danh tính dùng **không phải là**, không phải bare \"không là\". Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_calque_take_it_easy",
    en: "\"Lấy nó dễ dàng\" is a literal translation of \"take it easy\" — Vietnamese says \"bình tĩnh đi\" or \"thư giãn đi\". Try: *{FIX}*.",
    vi: "Calque từ tiếng Anh \"take it easy\". Tiếng Việt dùng **bình tĩnh đi** hoặc **thư giãn đi**. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_question_inversion_la_front",
    en: "Vietnamese yes/no questions don't invert subject and copula like English. \"Là {PRONOUN} mệt?\" should be \"{PRONOUN} mệt không?\" or \"{PRONOUN} có mệt không?\". Try: *{FIX}*.",
    vi: "Câu hỏi tiếng Việt không đảo chủ ngữ + động từ kiểu Anh. Dùng postposed **không** hoặc khung **có … không**. Sửa: *{FIX}*.",
  },
];
