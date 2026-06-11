/**
 * EN→VN register rule-pack: bilingual short-form feedback strings.
 *
 * One entry per detector tag. `en` is the teaching note for the
 * English-L1 learner; `vi` is a Vietnamese summary (with full diacritics)
 * for trainers / reviewers — mirrors the en-vn grammar pack convention.
 *
 * Only the tag for the surface-detectable rule ships with substantive
 * copy. The nine ABSTAINING rules also have entries here so the pack
 * validates correctly via `validateRulePack()` — their copy is a
 * one-line note explaining why detection is deferred.
 *
 * Templates support `{FIX}` (corrected sentence) and `{OPENER}` for
 * the formal-opener rule.
 */

import type { L1Explanation } from "../../rule-pack-types.js";

export const REGISTER_EXPLANATIONS: L1Explanation[] = [
  // ── Surface-detectable ─────────────────────────────────────────────────

  {
    tag: "en_l1_register_formal_opener_ban",
    en: "The formal opener **{OPENER}** is always paired with a hierarchical address term — ông, bà, thầy, cô, quý vị, anh, chị. Using **bạn** (peer pronoun) after a formal opener is a register clash: **bạn** signals peer-equality, but **{OPENER}** signals deference. Try: *{FIX}*.",
    vi: "Trợ từ lễ nghi **{OPENER}** chỉ dùng trước từ xưng hô thể hiện tôn trọng (ông, bà, thầy, cô, quý vị, anh, chị…). Dùng **bạn** sau **{OPENER}** là mâu thuẫn ngữ cảnh: **bạn** biểu thị ngang hàng, trong khi **{OPENER}** thể hiện kính trọng. Sửa: *{FIX}*.",
  },

  // ── ABSTAINING stubs (copy documents the deferral reason) ─────────────

  {
    tag: "en_l1_register_peer_ban_to_elder",
    en: "Using **bạn** to address someone older than a peer is rude in Vietnamese — the correct pronoun depends on the addressee's age and relationship (ông/bà/cô/chú/anh/chị). Detection deferred: requires knowing addressee age from conversational context. Try: *{FIX}*.",
    vi: "Dùng **bạn** để gọi người lớn tuổi hơn bị coi là hỗn trong tiếng Việt — cần biết tuổi và mối quan hệ để chọn đúng đại từ. Phát hiện tự động bị hoãn: cần ngữ cảnh hội thoại. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_toi_self_elder",
    en: "Using **tôi** as self-reference to an elder sounds cold and distant. Vietnamese expects the speaker to self-identify by relative position: em (younger), cháu (grandchild), con (to parents). Detection deferred: requires knowing the relationship from conversational context. Try: *{FIX}*.",
    vi: "Tự xưng **tôi** với người lớn hơn nghe lạnh nhạt và giữ khoảng cách. Tiếng Việt đòi hỏi tự xưng theo vị thế: em, cháu, con… Phát hiện tự động bị hoãn: cần ngữ cảnh quan hệ. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_missing_a",
    en: "Omitting the respectful particle **ạ** when speaking to a superior makes statements and requests sound blunt. Detection deferred: requires knowing the addressee is a superior from conversational context. Try: *{FIX}*.",
    vi: "Thiếu trợ từ **ạ** cuối câu khi nói với bề trên khiến câu nghe cộc lốc. Phát hiện tự động bị hoãn: cần biết người nghe là bề trên. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_blunt_request",
    en: "A bare imperative or **Cho tôi…** to a superior is demanding. Add softeners: **được không ạ?**, **giúp em**, **có thể … không?**. Detection deferred: requires knowing the addressee is a superior from context. Try: *{FIX}*.",
    vi: "Mệnh lệnh trần hay «Cho tôi…» với bề trên nghe như ra lệnh. Thêm cụm mềm mỏng: **được không ạ?**, **giúp em**, **có thể … không?**. Phát hiện tự động bị hoãn: cần biết người nghe là bề trên. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_bare_refusal",
    en: "A bare **Không** refusal to a superior sounds abrupt. Use: **Không ạ, cảm ơn anh/chị** or **Thôi ạ, cảm ơn**. Detection deferred: requires conversational context to know addressee is a superior. Try: *{FIX}*.",
    vi: "Từ chối bằng một mình **Không** với bề trên nghe đột ngột. Dùng: **Không ạ, cảm ơn anh/chị** hoặc **Thôi ạ, cảm ơn**. Phát hiện tự động bị hoãn: cần ngữ cảnh. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_thanks_peer",
    en: "**Cảm ơn bạn** is peer-register only. When thanking a superior use the appropriate pronoun: **Cảm ơn anh/chị/thầy/cô ạ**. Detection deferred: requires knowing the addressee is not a peer. Try: *{FIX}*.",
    vi: "**Cảm ơn bạn** chỉ dùng với bạn bè đồng trang lứa. Cảm ơn bề trên: **Cảm ơn anh/chị/thầy/cô ạ**. Phát hiện tự động bị hoãn: cần biết người nghe không phải ngang hàng. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_apology_peer",
    en: "**Xin lỗi bạn** sounds peer-level. To apologise to a superior: **Xin lỗi anh/chị/thầy/cô ạ**. Detection deferred: requires knowing the addressee is a superior. Try: *{FIX}*.",
    vi: "**Xin lỗi bạn** mang sắc thái ngang hàng. Xin lỗi bề trên: **Xin lỗi anh/chị/thầy/cô ạ**. Phát hiện tự động bị hoãn: cần biết người nghe là bề trên. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_favor_no_softener",
    en: "Requests for a favour sound blunt without **nhờ**, **làm ơn**, or **được không?**. Detection deferred: context-dependent severity (peer vs superior). Try: *{FIX}*.",
    vi: "Nhờ vả mà thiếu **nhờ**, **làm ơn**, hay **được không?** nghe cộc lốc. Phát hiện tự động bị hoãn: mức độ nghiêm trọng phụ thuộc ngữ cảnh (bạn bè hay bề trên). Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_command_elder",
    en: "A bare imperative to an elder is almost always rude in Vietnamese. Use **Có thể … được không ạ?** or **… giúp em với ạ**. Detection deferred: requires knowing the addressee is an elder. Try: *{FIX}*.",
    vi: "Mệnh lệnh trần với người lớn hơn gần như luôn bị coi là hỗn trong tiếng Việt. Dùng **Có thể … được không ạ?** hoặc **… giúp em với ạ**. Phát hiện tự động bị hoãn: cần biết người nghe là người lớn hơn. Sửa: *{FIX}*.",
  },
];
