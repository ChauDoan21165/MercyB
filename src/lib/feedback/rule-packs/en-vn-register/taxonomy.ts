/**
 * EN→VN register-error taxonomy — 10 patterns.
 *
 * Covers Vietnamese politeness-tier errors produced by English-L1 learners:
 *   anh/chị/em pronoun selection, formal vs casual request framing, and
 *   refusal/softener omission.
 *
 * Pure data — no detection functions. Detection stubs live in
 * `./detectors.ts`. Only `formal_opener_peer_ban` (Pattern 1) has a
 * surface-detectable form; the remaining 9 patterns require conversational
 * context (who is the addressee?) and ABSTAIN in the current stub.
 *
 * Trust floor: a wrong register correction is worse than no correction.
 * Pattern 1 fires ONLY on the "Thưa bạn / Kính gửi bạn" structure where
 * the contradiction (formal opener + peer-register pronoun) is unambiguous
 * from surface text alone.
 */

export type RegisterCategory =
  | "pronoun_selection"    // wrong anh/chị/em/ông/bà for the relationship
  | "formal_opener"        // formal salutation clashes with wrong register
  | "request_softener"     // missing ạ / giúp / được không when addressing superior
  | "refusal_softener"     // missing softener when declining a superior's offer
  | "thanks_apology_form"; // wrong pronoun in cảm ơn / xin lỗi

export type DetectionFeasibility =
  | "surface_detectable"   // detectable from text alone, no context needed
  | "context_required";    // needs to know addressee age/relationship → ABSTAIN

export interface RegisterExample {
  learnerProduces: string;
  targetForm: string;
  explanationVi: string;
}

export interface RegisterPattern {
  id: string;
  /** Tag matches the detector rule and explanation entry. */
  tag: string;
  category: RegisterCategory;
  severity: "high" | "medium" | "low";
  /** Short English description of the pattern. */
  descriptionEn: string;
  /** Giải thích tiếng Việt, dấu đầy đủ. */
  descriptionVi: string;
  /** Whether a detector can fire without conversational context. */
  detectionFeasibility: DetectionFeasibility;
  /** Representative learner-error examples. */
  examples: RegisterExample[];
}

// ──────────────────────────────────────────────────────────────────────────
// 10 patterns — ordered by detection feasibility first, then severity.
// ──────────────────────────────────────────────────────────────────────────

export const REGISTER_TAXONOMY: RegisterPattern[] = [
  // ── 1 ── SURFACE-DETECTABLE ────────────────────────────────────────────
  {
    id: "formal_opener_peer_ban",
    tag: "en_l1_register_formal_opener_ban",
    category: "formal_opener",
    severity: "high",
    descriptionEn:
      "English speakers open formal letters or speeches with 'Thưa bạn' or 'Kính gửi bạn', pairing a high-register opener with the casual peer-pronoun 'bạn'. Vietnamese formal openers (Thưa / Kính gửi / Kính thưa) are exclusively paired with hierarchical address terms: ông, bà, thầy, cô, quý vị, anh, chị. 'bạn' is never a valid complement.",
    descriptionVi:
      "Người học gốc tiếng Anh kết hợp trợ từ lễ nghi «Thưa» hoặc «Kính gửi» với đại từ ngang hàng «bạn». Trong tiếng Việt, «Thưa» và «Kính gửi» chỉ đứng trước từ xưng hô thể hiện sự tôn trọng: ông, bà, thầy, cô, quý vị, anh, chị… Không bao giờ dùng «bạn» sau «Thưa».",
    detectionFeasibility: "surface_detectable",
    examples: [
      {
        learnerProduces: "Thưa bạn, tôi muốn hỏi về lịch học.",
        targetForm: "Thưa thầy/cô, em muốn hỏi về lịch học.",
        explanationVi:
          "«Thưa» dùng để kính trọng — không đi với «bạn» (ngang hàng). Kèm theo đó, người nói nên tự xưng «em» với thầy/cô.",
      },
      {
        learnerProduces: "Kính gửi bạn Nguyễn Văn An,",
        targetForm: "Kính gửi anh/chị Nguyễn Văn An,",
        explanationVi:
          "«Kính gửi» mở đầu thư trân trọng. Sau đó cần tên kèm «anh/chị» hoặc chức danh, không dùng «bạn».",
      },
      {
        learnerProduces: "Kính thưa bạn chủ tịch,",
        targetForm: "Kính thưa ông/bà chủ tịch,",
        explanationVi:
          "Chức danh cao cấp đi sau «Kính thưa» cần «ông/bà» — «bạn chủ tịch» mâu thuẫn ngữ cảnh hoàn toàn.",
      },
      {
        learnerProduces: "Thưa bạn đại biểu,",
        targetForm: "Thưa quý đại biểu, / Thưa các vị đại biểu,",
        explanationVi:
          "Phát biểu trước đại biểu dùng «quý» hoặc «các vị» — không dùng «bạn» khi nói với tập thể chính thức.",
      },
      {
        learnerProduces: "Thưa bạn hiệu trưởng,",
        targetForm: "Thưa ông/bà hiệu trưởng,",
        explanationVi:
          "Hiệu trưởng là bề trên — «Thưa» đi kèm «ông/bà» hoặc «thầy/cô», không phải «bạn».",
      },
    ],
  },

  // ── 2–10 ── CONTEXT-REQUIRED (ABSTAIN in current stub) ──────────────────

  {
    id: "peer_ban_to_elder",
    tag: "en_l1_register_peer_ban_to_elder",
    category: "pronoun_selection",
    severity: "high",
    descriptionEn:
      "Using 'bạn' as the second-person pronoun when addressing someone significantly older (grandparents, parents, teachers, senior colleagues). 'bạn' is reserved for peers; using it with elders is rude. The correct pronoun depends on relative age and relationship: ông/bà (elderly), cô/chú (middle-aged), thầy/cô (teacher), anh/chị (slightly older).",
    descriptionVi:
      "Dùng «bạn» để gọi người lớn tuổi hơn (ông bà, bố mẹ, thầy cô, đồng nghiệp cấp trên). «Bạn» chỉ dùng với người đồng trang lứa. Gọi người lớn bằng «bạn» bị coi là hỗn hoặc thiếu lịch sự nghiêm trọng.",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Chào bạn, bạn có khoẻ không?",
        targetForm: "Chào bà/ông/cô/thầy, bà/ông/cô/thầy có khoẻ không ạ?",
        explanationVi:
          "Nếu người được hỏi là người lớn hơn, «bạn» hoàn toàn sai. Cần biết tuổi hoặc mối quan hệ để chọn đúng đại từ.",
      },
      {
        learnerProduces: "Bạn ăn cơm chưa?",
        targetForm: "Bà/Cô/Anh ăn cơm chưa ạ?",
        explanationVi:
          "Câu hỏi này đúng khi nói với bạn bè. Với người lớn hơn, cần đổi «bạn» và thêm «ạ» cuối câu.",
      },
      {
        learnerProduces: "Tôi muốn nói chuyện với bạn.",
        targetForm: "Em muốn nói chuyện với anh/chị ạ.",
        explanationVi:
          "Với người lớn hơn: người nói tự xưng «em», gọi người kia là «anh/chị» và thêm «ạ».",
      },
    ],
  },

  {
    id: "toi_self_with_elder",
    tag: "en_l1_register_toi_self_elder",
    category: "pronoun_selection",
    severity: "medium",
    descriptionEn:
      "Using 'tôi' as first-person self-reference when speaking to an elder or superior. 'tôi' is neutral/distancing; Vietnamese convention expects the speaker to self-identify by their relative position: em (younger), cháu (child/grandchild), con (to parents), anh/chị (older sibling register). 'tôi' to an elder sounds cold.",
    descriptionVi:
      "Dùng «tôi» để tự xưng khi nói với người lớn hơn hoặc bề trên. «Tôi» mang sắc thái trung tính, giữ khoảng cách. Tiếng Việt yêu cầu tự xưng theo vị thế tương đối: em (với người lớn hơn), cháu (với ông bà/cô chú), con (với bố mẹ). Dùng «tôi» với người lớn hơn nghe lạnh lùng và đôi khi thiếu lễ độ.",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Tôi cảm ơn bà rất nhiều.",
        targetForm: "Cháu cảm ơn bà ạ.",
        explanationVi:
          "Cảm ơn bà (bề trên) — tự xưng «cháu», thêm «ạ» cuối câu.",
      },
      {
        learnerProduces: "Tôi xin phép hỏi thầy.",
        targetForm: "Em xin phép hỏi thầy ạ.",
        explanationVi:
          "Với giáo viên, học sinh tự xưng «em» và thêm «ạ» để thể hiện tôn trọng.",
      },
      {
        learnerProduces: "Tôi hiểu rồi, cảm ơn anh.",
        targetForm: "Em hiểu rồi, cảm ơn anh ạ.",
        explanationVi:
          "Đang nói với anh (người lớn hơn) — nên tự xưng «em» và thêm «ạ».",
      },
    ],
  },

  {
    id: "missing_a_particle_to_superior",
    tag: "en_l1_register_missing_a",
    category: "request_softener",
    severity: "medium",
    descriptionEn:
      "Omitting the respectful sentence-final particle 'ạ' when speaking to a superior, elder, or teacher. In Vietnamese, 'ạ' is the minimal register marker signalling deference; dropping it makes statements, answers, and requests sound blunt or rude when directed upward in the hierarchy.",
    descriptionVi:
      "Thiếu trợ từ «ạ» cuối câu khi nói với người lớn tuổi hơn hoặc bề trên. «Ạ» là dấu hiệu tôn trọng tối thiểu trong giao tiếp dọc theo chiều bậc xã hội. Câu thiếu «ạ» nghe cộc lốc và đôi khi bị coi là hỗn với thầy cô, cha mẹ, hay sếp.",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Dạ, em biết rồi.",
        targetForm: "Dạ, em biết rồi ạ.",
        explanationVi:
          "Đã có «dạ» nhưng thiếu «ạ» cuối — khi nói với người lớn hơn, cả hai thường đi cùng nhau.",
      },
      {
        learnerProduces: "Em hiểu.",
        targetForm: "Em hiểu ạ.",
        explanationVi:
          "Xác nhận hiểu bài với thầy cô — thêm «ạ» là bắt buộc để thể hiện tôn trọng.",
      },
      {
        learnerProduces: "Vâng, em sẽ làm.",
        targetForm: "Vâng, em sẽ làm ạ.",
        explanationVi:
          "«Vâng» đã là từ đồng ý lịch sự, nhưng «ạ» cuối câu bổ sung thêm sắc thái lễ độ cần thiết.",
      },
    ],
  },

  {
    id: "blunt_request_to_superior",
    tag: "en_l1_register_blunt_request",
    category: "request_softener",
    severity: "medium",
    descriptionEn:
      "Making a direct request to a superior or elder using bare imperative or 'Cho tôi…' without softening particles. English 'Could you please…' is often translated as a bare 'Cho tôi…' or imperative verb, which reads as demanding in Vietnamese. Softeners include: 'được không ạ', 'giúp em', 'làm ơn', 'có thể … không'.",
    descriptionVi:
      "Đề nghị trực tiếp với người lớn hơn bằng mệnh lệnh trần hoặc «Cho tôi…» không có cụm mềm mỏng. Tiếng Anh «Could you please…» thường bị dịch thẳng thành «Cho tôi…» hay động từ mệnh lệnh, nghe như ra lệnh trong tiếng Việt. Cần thêm «được không ạ», «giúp em», «làm ơn», «có thể … không» để lịch sự hơn.",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Cho tôi xem bài.",
        targetForm: "Cho em xem bài được không ạ? / Thầy cho em xem bài được không ạ?",
        explanationVi:
          "Yêu cầu thầy/cô cho xem bài phải có «được không ạ?» để lịch sự. Tự xưng «em» thay vì «tôi».",
      },
      {
        learnerProduces: "Giải thích lại cho tôi.",
        targetForm: "Thầy/Cô có thể giải thích lại cho em được không ạ?",
        explanationVi:
          "Mệnh lệnh trần «Giải thích lại» không phù hợp khi nhờ thầy/cô. Dùng cấu trúc «có thể … không ạ?».",
      },
      {
        learnerProduces: "Cho tôi về sớm hôm nay.",
        targetForm: "Em xin phép về sớm hôm nay ạ. / Anh/Chị có thể cho em về sớm hôm nay được không ạ?",
        explanationVi:
          "Xin phép về sớm với sếp — cần cụm «xin phép» hoặc «có thể … không ạ?».",
      },
    ],
  },

  {
    id: "bare_refusal_to_superior",
    tag: "en_l1_register_bare_refusal",
    category: "refusal_softener",
    severity: "medium",
    descriptionEn:
      "Declining a superior's offer or request with a bare 'Không' or 'Không cần' without any softening. In English 'No, thank you' is polite; in Vietnamese, a bare negative to an elder sounds abrupt. Softened refusals include: 'Không ạ, cảm ơn anh/chị', 'Thôi ạ, cảm ơn', 'Em không dám / Em xin phép từ chối'.",
    descriptionVi:
      "Từ chối lời đề nghị hay yêu cầu của bề trên bằng «Không» đơn độc hoặc «Không cần» không có cụm mềm mỏng. Trong tiếng Việt, từ chối một mình bằng «Không» với người lớn hơn nghe đột ngột và thiếu lễ độ. Cần thêm «ạ», địa chỉ đại từ và cảm ơn: «Không ạ, cảm ơn anh/chị», «Thôi ạ, cảm ơn».",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Không, tôi không cần.",
        targetForm: "Không ạ, em không cần, cảm ơn anh/chị.",
        explanationVi:
          "Từ chối cần có «ạ», tự xưng «em» và câu cảm ơn khi nói với người lớn hơn.",
      },
      {
        learnerProduces: "Không cần.",
        targetForm: "Thôi ạ, cảm ơn cô. / Không cần đâu ạ, cảm ơn cô.",
        explanationVi:
          "Với cô (giáo viên), từ chối cần «ạ» tối thiểu và cảm ơn để giữ sự lịch sự.",
      },
      {
        learnerProduces: "Tôi không muốn.",
        targetForm: "Em không muốn ạ, cảm ơn anh/chị.",
        explanationVi:
          "«Tôi không muốn» nghe thẳng thắn đến thô lỗ khi từ chối người lớn hơn.",
      },
    ],
  },

  {
    id: "thanks_with_peer_form_to_superior",
    tag: "en_l1_register_thanks_peer",
    category: "thanks_apology_form",
    severity: "medium",
    descriptionEn:
      "Using 'Cảm ơn bạn' to thank a person who is not a peer (teacher, elder, senior colleague). 'bạn' in a thanks formula signals peer relationship. To a superior: 'Cảm ơn anh/chị/thầy/cô… ạ' with the appropriate pronoun for the relationship.",
    descriptionVi:
      "Dùng «Cảm ơn bạn» để cảm ơn người không phải bạn bè đồng trang lứa (thầy cô, người lớn, đồng nghiệp cấp trên). «Cảm ơn bạn» chỉ phù hợp với bạn bè. Với người lớn hơn: «Cảm ơn anh/chị/thầy/cô… ạ».",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Cảm ơn bạn đã giúp tôi.",
        targetForm: "Cảm ơn anh/chị đã giúp em ạ.",
        explanationVi:
          "Khi nói với người lớn hơn — «bạn» → «anh/chị», «tôi» → «em», thêm «ạ».",
      },
      {
        learnerProduces: "Cảm ơn bạn rất nhiều.",
        targetForm: "Cảm ơn thầy/cô rất nhiều ạ.",
        explanationVi:
          "Cảm ơn thầy/cô — cần đúng đại từ và «ạ» cuối câu.",
      },
      {
        learnerProduces: "Bạn tốt quá, cảm ơn bạn.",
        targetForm: "Anh/Chị tốt quá, cảm ơn anh/chị ạ.",
        explanationVi:
          "Cả hai «bạn» đều cần thay nếu người được nói đến là bề trên.",
      },
    ],
  },

  {
    id: "apology_with_peer_form_to_superior",
    tag: "en_l1_register_apology_peer",
    category: "thanks_apology_form",
    severity: "medium",
    descriptionEn:
      "Apologising to an elder or superior using 'Xin lỗi bạn', which sounds peer-level. 'Xin lỗi' alone is borderline; with 'bạn' it is clearly wrong for a superior relationship. Correct form: 'Xin lỗi anh/chị/thầy/cô/ông/bà ạ' with the addressee's appropriate pronoun.",
    descriptionVi:
      "Xin lỗi người lớn hơn hay bề trên bằng «Xin lỗi bạn» — nghe ngang hàng. Với người lớn hơn: «Xin lỗi anh/chị/thầy/cô/ông/bà ạ» với đại từ phù hợp mối quan hệ.",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Xin lỗi bạn, tôi đến muộn.",
        targetForm: "Xin lỗi thầy/cô/anh/chị ạ, em đến muộn.",
        explanationVi:
          "Xin lỗi bề trên — «bạn» → đúng đại từ tôn trọng, «tôi» → «em», thêm «ạ».",
      },
      {
        learnerProduces: "Xin lỗi bạn vì tôi làm phiền.",
        targetForm: "Xin lỗi anh/chị vì em làm phiền ạ.",
        explanationVi:
          "Khi xin lỗi vì làm phiền người lớn hơn — cần đổi cả đại từ xưng hô và tự xưng.",
      },
      {
        learnerProduces: "Bạn ơi, tôi xin lỗi nhe.",
        targetForm: "Anh/Chị ơi, em xin lỗi ạ.",
        explanationVi:
          "«nhe» là trợ từ thân mật — không phù hợp khi xin lỗi bề trên. Thay bằng «ạ».",
      },
    ],
  },

  {
    id: "favor_request_no_softener",
    tag: "en_l1_register_favor_no_softener",
    category: "request_softener",
    severity: "low",
    descriptionEn:
      "Requesting a favour from anyone — peer or superior — without the softening verb 'nhờ', 'làm ơn', or the helper verb phrase 'giúp tôi/em'. English 'Can you…' is often translated as a bare 'Bạn có thể…' without the Vietnamese softener. While less severe than requests to superiors, the absence of a softener still sounds blunt in most contexts.",
    descriptionVi:
      "Nhờ ai đó làm việc gì mà không dùng «nhờ», «làm ơn», hay «giúp tôi/em». Tiếng Anh «Can you…» hay bị dịch thành «Bạn có thể…» trần không có cụm mềm mỏng. Dù ít nghiêm trọng hơn khi yêu cầu bề trên, câu thiếu softener vẫn nghe cộc lốc trong đa số ngữ cảnh.",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Bạn có thể đưa tôi đến nhà ga không?",
        targetForm: "Bạn có thể đưa tôi đến nhà ga được không? / Nhờ bạn đưa tôi đến nhà ga nhé.",
        explanationVi:
          "Thêm «được không?» thay vì «không?» để câu nghe lịch sự hơn, hoặc dùng «Nhờ bạn…».",
      },
      {
        learnerProduces: "Cho tôi mượn bút.",
        targetForm: "Bạn cho tôi mượn bút được không? / Làm ơn cho tôi mượn bút.",
        explanationVi:
          "Mệnh lệnh trần «Cho tôi mượn» phù hợp với bạn thân, nhưng với người quen bình thường cần «được không?» hay «làm ơn».",
      },
      {
        learnerProduces: "Nói lại đi.",
        targetForm: "Bạn nói lại được không? / Làm ơn nói lại.",
        explanationVi:
          "Mệnh lệnh ngắn «Nói lại đi» nghe khá thẳng — thêm «được không?» hoặc «làm ơn» mềm mỏng hơn.",
      },
    ],
  },

  {
    id: "direct_command_to_elder",
    tag: "en_l1_register_command_elder",
    category: "request_softener",
    severity: "high",
    descriptionEn:
      "Issuing a bare imperative to an elder or superior — verb-first sentence without 'ạ' or a polite framing. English imperatives are verb-first and contextually polite if tone is gentle; Vietnamese bare imperatives to elders are almost always rude. Replace with 'Có thể … được không ạ?' or 'Anh/chị/thầy/cô … giúp em với ạ.'",
    descriptionVi:
      "Ra lệnh trực tiếp với người lớn hơn hoặc bề trên bằng câu mệnh lệnh trần (động từ đứng đầu không có «ạ» hay cụm lịch sự). Mệnh lệnh trần tiếng Anh có thể lịch sự nhờ ngữ điệu; tiếng Việt thì mệnh lệnh trần với bề trên gần như luôn bị coi là hỗn hào. Thay bằng «Có thể … được không ạ?» hoặc «Anh/chị/thầy/cô … giúp em với ạ».",
    detectionFeasibility: "context_required",
    examples: [
      {
        learnerProduces: "Đọc lại bài cho tôi nghe.",
        targetForm: "Thầy/Cô có thể đọc lại bài cho em nghe được không ạ?",
        explanationVi:
          "Yêu cầu thầy/cô đọc lại — cần cấu trúc «có thể … được không ạ?».",
      },
      {
        learnerProduces: "Ngồi xuống đây đi.",
        targetForm: "Bà/Cô ngồi xuống đây đi ạ. / Mời bà/cô ngồi xuống đây.",
        explanationVi:
          "Mời người lớn ngồi — dùng «Mời» hoặc thêm «ạ» để câu thêm lịch sự.",
      },
      {
        learnerProduces: "Giải thích thêm cho tôi.",
        targetForm: "Thầy/Cô giải thích thêm cho em được không ạ?",
        explanationVi:
          "Yêu cầu thầy/cô giải thích thêm — cần đổi đại từ và thêm cấu trúc lịch sự.",
      },
    ],
  },
];

// ── Convenience look-up ────────────────────────────────────────────────────

/** Tags that have a surface-detectable stub in `./detectors.ts`. */
export const SURFACE_DETECTABLE_TAGS = REGISTER_TAXONOMY
  .filter((p) => p.detectionFeasibility === "surface_detectable")
  .map((p) => p.tag);

/** Tags that require conversational context — stubs ABSTAIN for these. */
export const CONTEXT_REQUIRED_TAGS = REGISTER_TAXONOMY
  .filter((p) => p.detectionFeasibility === "context_required")
  .map((p) => p.tag);
