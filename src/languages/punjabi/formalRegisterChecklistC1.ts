// Punjabi C1 formal register checklist for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiFormalRegisterChecklistAreaC1 =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "public_service_register"
  | "professional_register_safety";

export type PunjabiFormalRegisterChecklistModeC1 =
  | "checklist"
  | "final_stability"
  | "boundary_check"
  | "regression_check";

export type PunjabiFormalRegisterChecklistPhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiFormalRegisterChecklistCardC1 = {
  id: string;
  level: "C1";
  area: PunjabiFormalRegisterChecklistAreaC1;
  mode: PunjabiFormalRegisterChecklistModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  checklist_prompt_vi: string;
  checklist_prompt_en: string;
  response_frame: PunjabiFormalRegisterChecklistPhraseC1;
  stability_checks_vi: readonly string[];
  stability_checks_en: readonly string[];
  boundary_checks_vi: readonly string[];
  boundary_checks_en: readonly string[];
  export_readiness_vi: readonly string[];
  export_readiness_en: readonly string[];
  regression_checks_vi: readonly string[];
  regression_checks_en: readonly string[];
  canada_example: PunjabiFormalRegisterChecklistPhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const formalRegisterChecklistScriptAwarenessC1 = {
  vi: "Bộ checklist này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This checklist pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi script, not as the main practice script.",
} as const;

export const formalRegisterChecklistC1: PunjabiFormalRegisterChecklistCardC1[] = [
  {
    id: "pa_c1_checklist_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "checklist",
    title_pa: "ਸਰੋਤ ਸਾਰ ਚੈਕਲਿਸਟ",
    title_rom: "sarot saar checklist",
    title_vi: "Checklist tóm tắt nguồn",
    title_en: "Source-summary checklist",
    checklist_prompt_vi: "Kiểm tra xem summary có giữ claim, evidence và neutrality không.",
    checklist_prompt_en: "Check whether the summary keeps claim, evidence, and neutrality.",
    response_frame: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਫੀਡਬੈਕ ਨਾਲ ਇਹ ਗੱਲ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai. lekhak udik samen ate feedback nal ih gal samarthan karda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin. Tác giả hỗ trợ điều này bằng thời gian chờ và phản hồi.",
      en: "The source's main claim is that clear timelines can increase trust. The writer supports this with wait times and feedback.",
    },
    stability_checks_vi: ["Nguồn vẫn là chủ thể.", "Claim và evidence đều còn.", "Không thêm ý kiến riêng."],
    stability_checks_en: ["The source remains the subject.", "Claim and evidence are still present.", "No personal opinion is added."],
    boundary_checks_vi: ["Không biến summary thành phản biện.", "Không nhặt chi tiết phụ lên làm trung tâm."],
    boundary_checks_en: ["Does not turn the summary into critique.", "Does not promote side details to the centre."],
    export_readiness_vi: ["Đủ ngắn để dùng trong bài học.", "Có thể đưa vào mẫu luyện tập.", "Giữ register ổn định."],
    export_readiness_en: ["Short enough for a lesson.", "Can go into a practice template.", "Keeps the register stable."],
    regression_checks_vi: ["Không chèn judgment.", "Không làm mờ claim."],
    regression_checks_en: ["Does not insert judgment.", "Does not blur the claim."],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source summary about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਨੂੰ ਸਪਸ਼ਟ ਰੱਖਣ ਨਾਲ ਗਲਤਫਹਿਮੀ ਘੱਟ ਹੋ ਸਕਦੀ ਹੈ।",
      rom: "Canada vich seva jankari nu spasht rakhhan nal galtfehmi ghatt ho sakdi hai.",
      vi: "Tại Canada, giữ thông tin dịch vụ rõ ràng có thể giảm hiểu lầm.",
      en: "In Canada, keeping service information clear can reduce misunderstanding.",
    },
    learner_traps_vi: ["Đừng biến summary thành review.", "Đừng bỏ claim chính."],
    learner_traps_en: ["Do not turn the summary into a review.", "Do not omit the main claim."],
  },
  {
    id: "pa_c1_checklist_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "final_stability",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ ਚੈਕਲਿਸਟ",
    title_rom: "savdhan daava checklist",
    title_vi: "Checklist cho claim thận trọng",
    title_en: "Cautious-claim checklist",
    checklist_prompt_vi: "Kiểm tra xem câu có lực nhưng vẫn giữ giới hạn dữ liệu ngắn hạn không.",
    checklist_prompt_en: "Check whether the sentence is forceful while still respecting short-term data limits.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਇਹ ਤਬਦੀਲੀ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "uplabdh ankde ih sujhaounde han ki ih tabdili labhdaik ho sakdi hai, par lambe samen de prabhav lai hor samikhia lorindi hai.",
      vi: "Số liệu hiện có gợi ý thay đổi này có thể hữu ích, nhưng tác động dài hạn vẫn cần được rà soát thêm.",
      en: "The available figures suggest this change may be helpful, but the long-term effect still needs further review.",
    },
    stability_checks_vi: ["Có hedge.", "Có limitation.", "Không overclaim."],
    stability_checks_en: ["Has hedging.", "Has limitation.", "Does not overclaim."],
    boundary_checks_vi: ["Không dùng always/never.", "Không biến pilot thành chân lý."],
    boundary_checks_en: ["Does not use always/never.", "Does not turn a pilot into certainty."],
    export_readiness_vi: ["Dùng được cho report.", "Giữ mức chắc vừa phải.", "Phù hợp C1."],
    export_readiness_en: ["Works in a report.", "Keeps measured certainty.", "Fits C1."],
    regression_checks_vi: ["Không hedge quá mờ.", "Không nói quá chắc từ mẫu nhỏ."],
    regression_checks_en: ["Does not hedge so much that meaning blurs.", "Does not sound certain from small data."],
    canada_example: {
      context_vi: "Claim thận trọng về pilot tại Canada.",
      context_en: "Cautious claim about a pilot in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਲਈ ਹੋਰ ਡਾਟਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de pilot ton lagda hai ki navi prakiria madad kar sakdi hai, par vadde padhar lai hor data chahida hai.",
      vi: "Từ pilot ở Canada, có vẻ quy trình mới có thể hỗ trợ, nhưng để mở rộng thì cần thêm dữ liệu.",
      en: "The Canadian pilot suggests the new process may help, but more data is needed for broader rollout.",
    },
    learner_traps_vi: ["Đừng nói chắc từ dữ liệu nhỏ.", "Đừng hedge đến mức mất ý."],
    learner_traps_en: ["Do not sound certain from small data.", "Do not hedge so much that the meaning disappears."],
  },
  {
    id: "pa_c1_checklist_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "boundary_check",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ ਚੈਕਲਿਸਟ",
    title_rom: "sabut tulna checklist",
    title_vi: "Checklist so sánh bằng chứng",
    title_en: "Evidence-comparison checklist",
    checklist_prompt_vi: "Kiểm tra xem số liệu và phỏng vấn có được phân vai đúng không.",
    checklist_prompt_en: "Check whether figures and interviews are assigned the right roles.",
    response_frame: {
      pa: "ਅੰਕੜੇ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਤਜਰਬੇ ਨੂੰ ਖੋਲ੍ਹਦੇ ਹਨ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਫੈਸਲੇ ਨੂੰ ਮਜ਼ਬੂਤ ਆਧਾਰ ਦਿੰਦੇ ਹਨ।",
      rom: "ankre rujhan dikhaunde han, jadki interview tajarbe nu kholde han. dovein mil ke faisle nu mazbut adhar dinde han.",
      vi: "Số liệu cho thấy xu hướng, còn phỏng vấn mở ra trải nghiệm. Ghép lại, hai loại bằng chứng tạo nền vững cho quyết định.",
      en: "The figures show the trend, while the interviews open up experience. Together, the two kinds of evidence provide a stronger basis for decisions.",
    },
    stability_checks_vi: ["Có tiêu chí so sánh.", "Có synthesis.", "Không trộn vai trò."],
    stability_checks_en: ["Has a comparison criterion.", "Has synthesis.", "Does not mix roles."],
    boundary_checks_vi: ["Không chỉ nói both matter.", "Không xếp hạng sai loại nguồn."],
    boundary_checks_en: ["Does not merely say both matter.", "Does not rank unlike sources incorrectly."],
    export_readiness_vi: ["Dùng được cho synthesis.", "Không tách nguồn rời nhau.", "Giữ logic đánh giá."],
    export_readiness_en: ["Usable for synthesis.", "Does not split sources apart.", "Keeps evaluation logic."],
    regression_checks_vi: ["Không so sánh mù.", "Không làm yếu nguồn mạnh."],
    regression_checks_en: ["Does not compare blindly.", "Does not weaken the stronger source."],
    canada_example: {
      context_vi: "So sánh evidence trong bối cảnh Canada.",
      context_en: "Comparing evidence in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਸਾਫ਼ ਕਰਦੇ ਹਨ।",
      rom: "Canada de ankre udik sama dikhaunde han, jadki interview bhasha sahaita di lor saf karde han.",
      vi: "Số liệu ở Canada cho thấy thời gian chờ, còn phỏng vấn làm rõ nhu cầu hỗ trợ ngôn ngữ.",
      en: "The Canadian figures show wait time, while interviews clarify the need for language support.",
    },
    learner_traps_vi: ["Đừng chỉ nói hai nguồn đều tốt.", "Đừng quên điểm so sánh."],
    learner_traps_en: ["Do not just say both sources are good.", "Do not forget the comparison point."],
  },
  {
    id: "pa_c1_checklist_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "final_stability",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ ਚੈਕਲਿਸਟ",
    title_rom: "rasmi patar-vihar checklist",
    title_vi: "Checklist thư tín trang trọng",
    title_en: "Formal correspondence checklist",
    checklist_prompt_vi: "Kiểm tra follow-up có lịch sự, có context và có request rõ không.",
    checklist_prompt_en: "Check whether the follow-up is polite, contextual, and has a clear request.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please let me know when the next step can be expected.",
    },
    stability_checks_vi: ["Lịch sự.", "Có yêu cầu rõ.", "Giữ tone công việc."],
    stability_checks_en: ["Polite tone.", "Clear request is present.", "Keeps a workplace tone."],
    boundary_checks_vi: ["Không giống chat.", "Không thành complaint.", "Không gây áp lực."],
    boundary_checks_en: ["Not chat-like.", "Not a complaint.", "Does not pressure the recipient."],
    export_readiness_vi: ["Sẵn sàng gửi văn phòng.", "Ngắn nhưng đủ.", "Dễ dùng trong email."],
    export_readiness_en: ["Ready to send to an office.", "Short but sufficient.", "Easy to use in email."],
    regression_checks_vi: ["Đừng quá lạnh.", "Đừng quá thân mật."],
    regression_checks_en: ["Do not sound too cold.", "Do not sound too familiar."],
    canada_example: {
      context_vi: "Email chuyên nghiệp trong bối cảnh Canada.",
      context_en: "Professional email in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੇ ਸੁਨੇਹੇ ਵਿੱਚ ਮਿਤਭਾਸ਼ੀ ਅਤੇ ਸਪਸ਼ਟਤਾ ਦੋਵੇਂ ਜ਼ਰੂਰੀ ਹਨ।",
      rom: "Canada de daftar nu bheje sunehe vich mitbhashi ate spashtata dovein zaruri han.",
      vi: "Trong email gửi văn phòng ở Canada, cả sự tiết chế và rõ ràng đều quan trọng.",
      en: "In an email sent to an office in Canada, both restraint and clarity matter.",
    },
    learner_traps_vi: ["Đừng thành lời than phiền.", "Đừng thiếu next step."],
    learner_traps_en: ["Do not become a complaint.", "Do not omit the next step."],
  },
  {
    id: "pa_c1_checklist_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "checklist",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ ਚੈਕਲਿਸਟ",
    title_rom: "karjakari sankhep checklist",
    title_vi: "Checklist executive summary",
    title_en: "Executive-summary checklist",
    checklist_prompt_vi: "Kiểm tra issue, finding và recommendation có đủ trong 3 dòng không.",
    checklist_prompt_en: "Check whether issue, finding, and recommendation fit into three lines.",
    response_frame: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬ ਦੇ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਮੁੱਖ ਨਤੀਜਾ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ ਪਰ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ। ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ।",
      rom: "mukh mudda seva pahunch ate jawab de samen vichla farak hai. mukh natija hai ki mang vadhi hai par samarthta use dar nal nahin vadhi. sifarash hai ki uch-jokham mamlian lai vakhri katar banai jave.",
      vi: "Vấn đề chính là khoảng cách giữa khả năng tiếp cận dịch vụ và thời gian phản hồi. Kết quả chính là nhu cầu tăng nhưng năng lực không tăng cùng tốc độ. Khuyến nghị là tạo hàng riêng cho các trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The key finding is that demand has increased, but capacity has not grown at the same rate. The recommendation is to create a separate queue for high-risk cases.",
    },
    stability_checks_vi: ["Có issue.", "Có finding.", "Có recommendation."],
    stability_checks_en: ["Has issue.", "Has finding.", "Has recommendation."],
    boundary_checks_vi: ["Không quá nhiều bối cảnh.", "Không kể hết nền.", "Ưu tiên quyết định."],
    boundary_checks_en: ["Not too much background.", "Does not narrate all context.", "Prioritizes decision-making."],
    export_readiness_vi: ["Sẵn sàng cho memo.", "Dùng tốt cho brief.", "Không dài dòng."],
    export_readiness_en: ["Ready for a memo.", "Works for a brief.", "Not long-winded."],
    regression_checks_vi: ["Không bỏ recommendation.", "Không lan man."],
    regression_checks_en: ["Does not omit the recommendation.", "Does not ramble."],
    canada_example: {
      context_vi: "Executive summary tại Canada.",
      context_en: "Executive summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਟੀਮ ਲਈ ਮੁੱਖ ਕਦਮ ਹੈ ਕਿ ਅਰਜ਼ੀਆਂ ਨੂੰ ਜੋਖਮ ਅਨੁਸਾਰ ਵੰਡਿਆ ਜਾਵੇ।",
      rom: "Canada vich seva team lai mukh kadam hai ki arzian nu jokham anusaar vandia jave.",
      vi: "Tại Canada, bước chính cho nhóm dịch vụ là phân loại hồ sơ theo rủi ro.",
      en: "In Canada, the main step for the service team is to sort applications by risk.",
    },
    learner_traps_vi: ["Đừng kể quá nhiều nền.", "Đừng quên recommendation."],
    learner_traps_en: ["Do not include too much background.", "Do not forget the recommendation."],
  },
  {
    id: "pa_c1_checklist_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "boundary_check",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ ਚੈਕਲਿਸਟ",
    title_rom: "peshkari jawab checklist",
    title_vi: "Checklist phản hồi thuyết trình",
    title_en: "Presentation-response checklist",
    checklist_prompt_vi: "Kiểm tra xem câu trả lời có công nhận câu hỏi, giới hạn và hướng tiếp theo không.",
    checklist_prompt_en: "Check whether the response acknowledges the question, limitation, and next direction.",
    response_frame: {
      pa: "ਇਹ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਡਾਟਾ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਨਮੂਨਾ ਹਾਲੇ ਛੋਟਾ ਹੈ, ਪਰ ਪੈਟਰਨ ਅਗਲੇ ਅਧਿਐਨ ਲਈ ਲਾਭਦਾਇਕ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "ih sawal mahatvapuran hai kyonki ih data di sima vall dhian divaunda hai. namuna hale chhota hai, par pattern agle adhiyan lai labhdaik disha dinda hai.",
      vi: "Câu hỏi này quan trọng vì nó chỉ ra giới hạn dữ liệu. Mẫu còn nhỏ, nhưng xu hướng này cho hướng hữu ích cho nghiên cứu tiếp theo.",
      en: "This question is important because it points to a data limitation. The sample is still small, but the pattern gives a useful direction for the next study.",
    },
    stability_checks_vi: ["Công nhận câu hỏi.", "Nói rõ giới hạn.", "Có next step."],
    stability_checks_en: ["Acknowledges the question.", "States the limitation.", "Has a next step."],
    boundary_checks_vi: ["Không né câu hỏi.", "Không phòng thủ.", "Không phóng đại."],
    boundary_checks_en: ["Does not dodge the question.", "Not defensive.", "Does not overstate."],
    export_readiness_vi: ["Sẵn sàng cho Q&A.", "Không lặp lại slide.", "Giữ nhịp ngắn."],
    export_readiness_en: ["Ready for Q&A.", "Does not repeat the slide.", "Keeps the response concise."],
    regression_checks_vi: ["Đừng trả lời như đang cãi nhau.", "Đừng phóng đại mẫu nhỏ."],
    regression_checks_en: ["Do not answer as if arguing.", "Do not overstate a small sample."],
    canada_example: {
      context_vi: "Q&A thuyết trình tại Canada.",
      context_en: "Presentation Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਰਸ਼ਕਾਂ ਲਈ ਇਹ ਕਹਿਣਾ ਢੰਗੀ ਹੈ ਕਿ ਨਤੀਜੇ ਹਾਲੇ ਸ਼ੁਰੂਆਤੀ ਹਨ।",
      rom: "Canada de darshkan lai ih kahna dangi hai ki natije hale shuruaati han.",
      vi: "Với khán giả ở Canada, nên nói kết quả vẫn còn ở giai đoạn đầu.",
      en: "For an audience in Canada, it is appropriate to say the results are still early-stage.",
    },
    learner_traps_vi: ["Đừng phòng thủ.", "Đừng nói quá chắc."],
    learner_traps_en: ["Do not become defensive.", "Do not sound too certain."],
  },
  {
    id: "pa_c1_checklist_public_service_register",
    level: "C1",
    area: "public_service_register",
    mode: "final_stability",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਰਜਿਸਟਰ ਚੈਕਲਿਸਟ",
    title_rom: "jantak seva register checklist",
    title_vi: "Checklist register dịch vụ công",
    title_en: "Public-service register checklist",
    checklist_prompt_vi: "Kiểm tra xem notice có rõ hành động, điều kiện và hạn chót không.",
    checklist_prompt_en: "Check whether the notice makes the action, condition, and deadline clear.",
    response_frame: {
      pa: "ਨੋਟਿਸ ਦੇ ਅਨੁਸਾਰ, eligibility ਪੂਰੀ ਹੋਣ ਤੇ ਹੀ registration ਕਰਨੀ ਹੈ, ਅਤੇ ਮਿਆਦ ਤੋਂ ਪਹਿਲਾਂ form ਜਮ੍ਹਾਂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "notice de anusaar, eligibility poori hon te hi registration karni hai, ate miad ton pahilan form jamma karna chahida hai.",
      vi: "Theo thông báo, chỉ khi đủ điều kiện mới đăng ký, và nên nộp form trước hạn.",
      en: "According to the notice, registration is only allowed when eligibility is met, and the form should be submitted before the deadline.",
    },
    stability_checks_vi: ["Tách điều kiện khỏi hành động.", "Tách deadline khỏi ngày bắt đầu.", "Không gây mơ hồ."],
    stability_checks_en: ["Separates condition from action.", "Separates deadline from start date.", "Does not create ambiguity."],
    boundary_checks_vi: ["Không biến thành complaint.", "Không bỏ từ điều kiện."],
    boundary_checks_en: ["Does not become a complaint.", "Does not omit condition words."],
    export_readiness_vi: ["Dùng tốt cho checklist.", "Phù hợp reading task.", "Rõ và ngắn."],
    export_readiness_en: ["Works for a checklist.", "Fits a reading task.", "Clear and concise."],
    regression_checks_vi: ["Không nhầm start date với deadline.", "Không đổi clarification thành complaint."],
    regression_checks_en: ["Does not confuse start date with deadline.", "Does not turn clarification into a complaint."],
    canada_example: {
      context_vi: "Thông báo trung tâm cộng đồng tại Canada.",
      context_en: "Community-centre notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀਆਂ ਕਲਾਸਾਂ ਲਈ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਹੋਵੇਗੀ।",
      rom: "Canada vich community kendar dian classan lai navi registration prakiria hovegi.",
      vi: "Tại Canada, sẽ có quy trình đăng ký mới cho các lớp tại trung tâm cộng đồng.",
      en: "In Canada, community-centre classes will have a new registration process.",
    },
    learner_traps_vi: ["Đừng nhầm điều kiện với hành động.", "Đừng bỏ deadline."],
    learner_traps_en: ["Do not confuse the condition with the action.", "Do not omit the deadline."],
  },
  {
    id: "pa_c1_checklist_professional_register_safety",
    level: "C1",
    area: "professional_register_safety",
    mode: "regression_check",
    title_pa: "ਪੇਸ਼ਾਵਰ ਰਜਿਸਟਰ ਸੁਰੱਖਿਆ",
    title_rom: "peshavar register surakhia",
    title_vi: "Checklist an toàn register chuyên nghiệp",
    title_en: "Professional register safety checklist",
    checklist_prompt_vi: "Kiểm tra xem email có quá lạnh, quá thân hay vừa đủ không.",
    checklist_prompt_en: "Check whether the email is too cold, too familiar, or just right.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please let me know when the next step can be expected.",
    },
    stability_checks_vi: ["Lịch sự.", "Có context.", "Có request rõ."],
    stability_checks_en: ["Polite.", "Has context.", "Clear request."],
    boundary_checks_vi: ["Không giống chat.", "Không thành complaint.", "Không gây áp lực."],
    boundary_checks_en: ["Not chat-like.", "Not a complaint.", "Does not pressure the recipient."],
    export_readiness_vi: ["Sẵn sàng gửi văn phòng.", "Giữ tone công việc.", "Dùng được ngay."],
    export_readiness_en: ["Ready to send to an office.", "Keeps workplace tone.", "Usable immediately."],
    regression_checks_vi: ["Đừng quá lạnh.", "Đừng quá thân mật."],
    regression_checks_en: ["Do not sound too cold.", "Do not sound too familiar."],
    canada_example: {
      context_vi: "Email chuyên nghiệp trong bối cảnh Canada.",
      context_en: "Professional email in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੇ ਸੁਨੇਹੇ ਵਿੱਚ ਮਿਤਭਾਸ਼ੀ ਅਤੇ ਸਪਸ਼ਟਤਾ ਦੋਵੇਂ ਜ਼ਰੂਰੀ ਹਨ।",
      rom: "Canada de daftar nu bheje sunehe vich mitbhashi ate spashtata dovein zaruri han.",
      vi: "Trong email gửi văn phòng ở Canada, cả sự tiết chế và rõ ràng đều quan trọng.",
      en: "In an email sent to an office in Canada, both restraint and clarity matter.",
    },
    learner_traps_vi: ["Đừng thành lời than phiền.", "Đừng thiếu next step."],
    learner_traps_en: ["Do not become a complaint.", "Do not omit the next step."],
  },
];
