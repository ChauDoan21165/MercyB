/**
 * EN→VN register rule-pack: bilingual short-form feedback strings.
 *
 * One entry per detector tag. `en` is the teaching note for the
 * English-L1 learner; `vi` is a Vietnamese summary (with full diacritics)
 * for trainers / reviewers — mirrors the en-vn grammar pack convention.
 *
 * Explanation strings are generated from the taxonomy entries in taxonomy.ts
 * (specific, Vietnamese-aware). Template slots: `{FIX}` (corrected sentence),
 * `{OPENER}` (formal opener token) for rule 1.
 *
 * Trust-floor note: the 9 context-required patterns (2–10) still ABSTAIN at
 * runtime — their explanation entries exist so validateRulePack() passes and
 * future implementors have named slots when context surfaces become available.
 * Their copy explains the specific error, not a generic deferral.
 */

import type { L1Explanation } from "../../rule-pack-types.js";

export const REGISTER_EXPLANATIONS: L1Explanation[] = [
  // ── 1. Surface-detectable ──────────────────────────────────────────────────

  {
    tag: "en_l1_register_formal_opener_ban",
    en: "The formal opener **{OPENER}** is always paired with a hierarchical address term — ông, bà, thầy, cô, quý vị, anh, chị. **Bạn** (peer pronoun) after a formal opener is a register clash: **bạn** signals peer-equality, but **{OPENER}** signals deference. Try: *{FIX}*.",
    vi: "Trợ từ lễ nghi **{OPENER}** chỉ dùng trước từ xưng hô thể hiện tôn trọng (ông, bà, thầy, cô, quý vị, anh, chị…). Dùng **bạn** sau **{OPENER}** là mâu thuẫn ngữ cảnh: **bạn** biểu thị ngang hàng, trong khi **{OPENER}** thể hiện kính trọng. Trong tiếng Việt, «Thưa» và «Kính gửi» không bao giờ đứng trước «bạn». Sửa: *{FIX}*.",
  },

  // ── 2–10. Context-required (ABSTAIN at runtime) ───────────────────────────
  // Copy is specific to the error pattern, not a generic deferral message.

  {
    tag: "en_l1_register_peer_ban_to_elder",
    en: "**Bạn** as a second-person pronoun is reserved for peers. Addressing someone significantly older — grandparents, parents, teachers, senior colleagues — with **bạn** is rude in Vietnamese. The correct pronoun depends on relative age and relationship: ông/bà (elderly), cô/chú (middle-aged), thầy/cô (teacher), anh/chị (slightly older). Try: *{FIX}*.",
    vi: "«Bạn» chỉ dùng để gọi người đồng trang lứa. Gọi người lớn tuổi hơn — ông bà, bố mẹ, thầy cô, đồng nghiệp cấp trên — bằng «bạn» bị coi là hỗn hoặc thiếu lịch sự nghiêm trọng. Đại từ đúng phụ thuộc vào tuổi tác và mối quan hệ: ông/bà, cô/chú, thầy/cô, anh/chị. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_toi_self_elder",
    en: "Using **tôi** as self-reference to an elder sounds cold and distancing. Vietnamese convention requires the speaker to self-identify by relative position: **em** (younger), **cháu** (grandchild/niece/nephew), **con** (to parents). **Tôi** to an elder can feel formal-cold or even slightly rude. Try: *{FIX}*.",
    vi: "Tự xưng **tôi** với người lớn hơn hoặc bề trên nghe lạnh lùng và giữ khoảng cách. Tiếng Việt đòi hỏi tự xưng theo vị thế tương đối: **em** (với người lớn hơn), **cháu** (với ông bà/cô chú), **con** (với bố mẹ), **anh/chị** (khi cần). Dùng «tôi» với người lớn hơn đôi khi bị coi là lạnh lùng hoặc thiếu lễ độ. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_missing_a",
    en: "The respectful sentence-final particle **ạ** is the minimum register marker when speaking to a superior or elder. Omitting it makes statements, answers, and requests sound blunt or curt when directed upward in the hierarchy — even when the content is polite. Try: *{FIX}*.",
    vi: "Trợ từ **ạ** cuối câu là dấu hiệu tôn trọng tối thiểu khi nói với người lớn tuổi hơn hoặc bề trên. Thiếu «ạ» khiến câu nghe cộc lốc hoặc thiếu lễ độ dù nội dung câu có lịch sự. Với thầy cô, cha mẹ, sếp — «ạ» là bắt buộc khi muốn thể hiện tôn trọng. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_blunt_request",
    en: "A direct imperative or bare **Cho tôi…** to a superior sounds demanding in Vietnamese. English *'Could you please…'* is often translated as a bare imperative, but Vietnamese requests to superiors need softeners: **được không ạ?**, **giúp em**, **có thể … không?**. Try: *{FIX}*.",
    vi: "Mệnh lệnh trần hay «Cho tôi…» với bề trên nghe như ra lệnh trong tiếng Việt. Tiếng Anh «Could you please…» thường bị dịch thẳng thành câu trực tiếp — nhưng tiếng Việt cần cụm mềm mỏng: **được không ạ?**, **giúp em**, **có thể … không?**. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_bare_refusal",
    en: "A bare **Không** refusal to a superior sounds abrupt. In English *'No, thank you'* is polite, but a standalone **Không** to an elder is curt in Vietnamese. Softened refusals: **Không ạ, cảm ơn anh/chị**, **Thôi ạ, cảm ơn**, **Em không dám**. Try: *{FIX}*.",
    vi: "Từ chối bằng một mình **Không** với bề trên nghe đột ngột và thiếu lịch sự. Tiếng Anh «No, thank you» là lịch sự, nhưng «Không» đứng một mình với người lớn hơn nghe cộc lốc trong tiếng Việt. Cần: **Không ạ, cảm ơn anh/chị**, **Thôi ạ, cảm ơn**, hoặc **Em không dám**. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_thanks_peer",
    en: "**Cảm ơn bạn** is peer-register only — it signals you are equals. When thanking someone older or senior, use the appropriate address term and add **ạ**: **Cảm ơn anh/chị/thầy/cô ạ**. Try: *{FIX}*.",
    vi: "**Cảm ơn bạn** chỉ phù hợp với người đồng trang lứa — dùng «bạn» là tín hiệu ngang hàng. Cảm ơn người lớn hơn hoặc bề trên cần đúng đại từ và thêm «ạ»: **Cảm ơn anh/chị/thầy/cô ạ**. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_apology_peer",
    en: "**Xin lỗi bạn** sounds peer-level. Apologising to an elder or superior requires the appropriate address term and **ạ**: **Xin lỗi anh/chị/thầy/cô/ông/bà ạ**. Try: *{FIX}*.",
    vi: "**Xin lỗi bạn** mang sắc thái ngang hàng — «bạn» là đại từ ngang hàng. Xin lỗi người lớn hơn hoặc bề trên cần đại từ phù hợp và «ạ»: **Xin lỗi anh/chị/thầy/cô/ông/bà ạ**. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_favor_no_softener",
    en: "Requests for a favour sound blunt without a softening verb: **nhờ**, **làm ơn**, **được không?**. Even with peers, bare requests feel abrupt. Add **nhờ bạn…** or **bạn có thể … được không?** to soften. Try: *{FIX}*.",
    vi: "Nhờ ai đó làm việc gì mà thiếu cụm mềm mỏng — **nhờ**, **làm ơn**, **được không?** — nghe cộc lốc ngay cả với bạn bè. Thêm «nhờ bạn…» hoặc «bạn có thể … được không?» để câu lịch sự hơn. Sửa: *{FIX}*.",
  },
  {
    tag: "en_l1_register_command_elder",
    en: "A bare imperative to an elder is almost always rude in Vietnamese. English imperatives can be polite if the tone is gentle, but Vietnamese bare imperatives to elders are heard as orders. Use **Có thể … được không ạ?** or **… giúp em với ạ** instead. Try: *{FIX}*.",
    vi: "Mệnh lệnh trần với người lớn hơn hoặc bề trên gần như luôn bị coi là hỗn hào trong tiếng Việt. Mệnh lệnh tiếng Anh có thể lịch sự nhờ ngữ điệu, nhưng mệnh lệnh trần tiếng Việt với bề trên nghe như ra lệnh. Dùng **Có thể … được không ạ?** hoặc **… giúp em với ạ**. Sửa: *{FIX}*.",
  },
];
