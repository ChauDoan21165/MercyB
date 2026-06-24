// Punjabi C1 consistency review for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiConsistencyReviewAreaC1 =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "public_professional_register";

export type PunjabiConsistencyReviewModeC1 =
  | "consistency_review"
  | "final_guardrail"
  | "integration_ready";

export type PunjabiConsistencyReviewPhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiConsistencyReviewCardC1 = {
  id: string;
  level: "C1";
  area: PunjabiConsistencyReviewAreaC1;
  mode: PunjabiConsistencyReviewModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  review_prompt_vi: string;
  review_prompt_en: string;
  response_frame: PunjabiConsistencyReviewPhraseC1;
  consistency_checks_vi: readonly string[];
  consistency_checks_en: readonly string[];
  final_guardrail_vi: readonly string[];
  final_guardrail_en: readonly string[];
  integration_readiness_vi: readonly string[];
  integration_readiness_en: readonly string[];
  canada_example: PunjabiConsistencyReviewPhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const consistencyReviewScriptAwarenessC1 = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const consistencyReviewC1: PunjabiConsistencyReviewCardC1[] = [
  {
    id: "pa_c1_consistency_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "consistency_review",
    title_pa: "ਰਸਮੀ ਲਿਖਤ consistency review",
    title_rom: "rasmi likhat consistency review",
    title_vi: "Rà soát tính nhất quán cho văn bản trang trọng",
    title_en: "Consistency review for formal writing",
    review_prompt_vi: "Kiểm tra văn bản trang trọng có cùng giọng, cùng mức chắc và không đổi register giữa chừng không.",
    review_prompt_en: "Check whether the formal text keeps one voice, one certainty level, and no mid-stream register shift.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਸਬੂਤ ਸਾਵਧਾਨੀ ਨਾਲ ਇਹ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਨੀਤੀ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਜ਼ਿੰਮੇਵਾਰੀ ਨਾਲ ਜੋੜਨਾ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ।",
      rom: "uplabdh sabut savdhani nal ih darsaunde han ki niti nu hor spasht zimmevari nal jorna labhdaik ho sakda hai.",
      vi: "Bằng chứng hiện có cho thấy có thể hữu ích nếu gắn chính sách với trách nhiệm rõ hơn.",
      en: "The available evidence suggests that the policy may be more useful if it is linked to clearer accountability.",
    },
    consistency_checks_vi: ["Cùng một register.", "Cùng một mức hedge.", "Không đổi giọng giữa chừng."],
    consistency_checks_en: ["One register throughout.", "One hedge level throughout.", "No mid-stream voice shift."],
    final_guardrail_vi: ["Không ngả sang trò chuyện.", "Không quá cứng.", "Claim vẫn giữ lực."],
    final_guardrail_en: ["Does not drift into chat.", "Not too rigid.", "The claim still has force."],
    integration_readiness_vi: ["Sẵn sàng cho report.", "Dễ ghép vào template.", "Giọng ổn định."],
    integration_readiness_en: ["Ready for a report.", "Easy to place in a template.", "Stable tone."],
    canada_example: {
      context_vi: "Văn bản trang trọng cho bối cảnh Canada.",
      context_en: "Formal text for a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਰਿਪੋਰਟ ਲਈ ਇਹ ਕਹਿਣਾ ਢੰਗੀ ਹੈ ਕਿ ਮੌਜੂਦਾ ਸਬੂਤ ਹਾਲੇ ਪੂਰੇ ਨਹੀਂ ਹਨ।",
      rom: "Canada vich report lai ih kahna dangi hai ki maujuda sabut hale pure nahin han.",
      vi: "Trong báo cáo ở Canada, nên nói rằng bằng chứng hiện có vẫn chưa đầy đủ.",
      en: "In a report in Canada, it is appropriate to say that the current evidence is still incomplete.",
    },
    learner_traps_vi: ["Đừng đổi giọng giữa các câu.", "Đừng làm câu trang trọng thành thân mật."],
    learner_traps_en: ["Do not switch voice from sentence to sentence.", "Do not make formal text sound casual."],
  },
  {
    id: "pa_c1_consistency_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "final_guardrail",
    title_pa: "ਸਰੋਤ ਸਾਰ consistency review",
    title_rom: "sarot saar consistency review",
    title_vi: "Rà soát nhất quán cho tóm tắt nguồn",
    title_en: "Consistency review for source summary",
    review_prompt_vi: "Kiểm tra summary có giữ claim, evidence và neutrality từ đầu đến cuối không.",
    review_prompt_en: "Check whether the summary keeps claim, evidence, and neutrality from start to finish.",
    response_frame: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਫੀਡਬੈਕ ਨਾਲ ਇਹ ਗੱਲ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai. lekhak udik samen ate feedback nal ih gal samarthan karda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin. Tác giả hỗ trợ điều này bằng thời gian chờ và phản hồi.",
      en: "The source's main claim is that clear timelines can increase trust. The writer supports this with wait times and feedback.",
    },
    consistency_checks_vi: ["Nguồn là chủ thể.", "Claim và evidence đi cùng nhau.", "Không có judgment chen vào."],
    consistency_checks_en: ["The source stays as the subject.", "Claim and evidence stay together.", "No judgment is inserted."],
    final_guardrail_vi: ["Không biến summary thành review.", "Không nhặt chi tiết phụ thành trung tâm.", "Giọng trung lập."],
    final_guardrail_en: ["Does not turn the summary into a review.", "Does not make side details central.", "Neutral tone."],
    integration_readiness_vi: ["Dùng được cho handout.", "Sẵn sàng cho lesson.", "Không quá dài."],
    integration_readiness_en: ["Usable in a handout.", "Ready for a lesson.", "Not overly long."],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source summary about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਨੂੰ ਸਪਸ਼ਟ ਰੱਖਣ ਨਾਲ ਗਲਤਫਹਿਮੀ ਘੱਟ ਹੋ ਸਕਦੀ ਹੈ।",
      rom: "Canada vich seva jankari nu spasht rakhhan nal galtfehmi ghatt ho sakdi hai.",
      vi: "Tại Canada, giữ thông tin dịch vụ rõ ràng có thể giảm hiểu lầm.",
      en: "In Canada, keeping service information clear can reduce misunderstanding.",
    },
    learner_traps_vi: ["Đừng biến summary thành comment.", "Đừng làm mờ claim chính."],
    learner_traps_en: ["Do not turn the summary into commentary.", "Do not blur the main claim."],
  },
  {
    id: "pa_c1_consistency_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "integration_ready",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ consistency review",
    title_rom: "savdhan daava consistency review",
    title_vi: "Rà soát nhất quán cho claim thận trọng",
    title_en: "Consistency review for cautious claims",
    review_prompt_vi: "Kiểm tra câu claim có giữ mức chắc vừa phải và không bị overclaim ở cuối không.",
    review_prompt_en: "Check whether the claim keeps measured certainty and does not overclaim at the end.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "uplabdh ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par lambe samen de prabhav lai hor samikhia lorindi hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng tác động dài hạn vẫn cần được xem xét thêm.",
      en: "The available figures suggest that the new process may be helpful, but the long-term effect still needs further review.",
    },
    consistency_checks_vi: ["Có hedge từ đầu đến cuối.", "Không đổi sang khẳng định tuyệt đối.", "Kết luận và hạn chế cùng tồn tại."],
    consistency_checks_en: ["Hedging is consistent throughout.", "No shift into absolute certainty.", "Conclusion and limitation coexist."],
    final_guardrail_vi: ["Không dùng always/never.", "Không biến pilot thành chân lý.", "Claim vẫn rõ."],
    final_guardrail_en: ["No always/never language.", "Does not turn a pilot into certainty.", "The claim remains clear."],
    integration_readiness_vi: ["Sẵn sàng cho report.", "Đủ rõ để tái dùng.", "Không mơ hồ."],
    integration_readiness_en: ["Ready for a report.", "Clear enough to reuse.", "Not vague."],
    canada_example: {
      context_vi: "Claim thận trọng về pilot tại Canada.",
      context_en: "Cautious claim about a pilot in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਲਈ ਹੋਰ ਡਾਟਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de pilot ton lagda hai ki navi prakiria madad kar sakdi hai, par vadde padhar lai hor data chahida hai.",
      vi: "Từ pilot ở Canada, có vẻ quy trình mới có thể hữu ích, nhưng để mở rộng cần thêm dữ liệu.",
      en: "The Canadian pilot suggests the new process may help, but more data is needed for scaling.",
    },
    learner_traps_vi: ["Đừng nói chắc từ dữ liệu nhỏ.", "Đừng hedge đến mức mất ý."],
    learner_traps_en: ["Do not sound certain from small data.", "Do not hedge so much that the meaning disappears."],
  },
  {
    id: "pa_c1_consistency_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "consistency_review",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ consistency review",
    title_rom: "sabut tulna consistency review",
    title_vi: "Rà soát nhất quán cho so sánh bằng chứng",
    title_en: "Consistency review for evidence comparison",
    review_prompt_vi: "Kiểm tra số liệu và phỏng vấn có vai trò nhất quán và có synthesis cuối không.",
    review_prompt_en: "Check whether figures and interviews keep consistent roles and whether there is final synthesis.",
    response_frame: {
      pa: "ਅੰਕੜੇ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਤਜਰਬੇ ਨੂੰ ਖੋਲ੍ਹਦੇ ਹਨ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਫੈਸਲੇ ਨੂੰ ਮਜ਼ਬੂਤ ਆਧਾਰ ਦਿੰਦੇ ਹਨ।",
      rom: "ankre rujhan dikhaunde han, jadki interview tajarbe nu kholde han. dovein mil ke faisle nu mazbut adhar dinde han.",
      vi: "Số liệu cho thấy xu hướng, còn phỏng vấn mở ra trải nghiệm. Ghép lại, hai loại bằng chứng tạo nền vững cho quyết định.",
      en: "The figures show the trend, while the interviews open up experience. Together, the two kinds of evidence provide a stronger basis for decisions.",
    },
    consistency_checks_vi: ["Vai trò nguồn tách bạch.", "So sánh có tiêu chí.", "Kết luận tích hợp không đổi hướng."],
    consistency_checks_en: ["Source roles are distinct.", "Comparison has a criterion.", "Integrated conclusion does not drift."],
    final_guardrail_vi: ["Không chỉ nói both matter.", "Không trộn chức năng nguồn.", "Giữ synthesis."],
    final_guardrail_en: ["Does not merely say both matter.", "Does not mix source functions.", "Keeps synthesis."],
    integration_readiness_vi: ["Dùng được cho lesson.", "Có logic mẫu.", "Sẵn sàng xuất bản."],
    integration_readiness_en: ["Usable in a lesson.", "Has a model logic.", "Ready for publication."],
    canada_example: {
      context_vi: "So sánh evidence trong bối cảnh Canada.",
      context_en: "Comparing evidence in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਸਾਫ਼ ਕਰਦੇ ਹਨ।",
      rom: "Canada de ankre udik sama dikhaunde han, jadki interview bhasha sahaita di lor saf karde han.",
      vi: "Số liệu ở Canada cho thấy thời gian chờ, còn phỏng vấn làm rõ nhu cầu hỗ trợ ngôn ngữ.",
      en: "The Canadian figures show wait time, while interviews clarify the need for language support.",
    },
    learner_traps_vi: ["Đừng nói chung chung rằng cả hai đều tốt.", "Đừng quên tiêu chí so sánh."],
    learner_traps_en: ["Do not vaguely say both are good.", "Do not forget the comparison criterion."],
  },
  {
    id: "pa_c1_consistency_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "final_guardrail",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ consistency review",
    title_rom: "peshavar patarchar consistency review",
    title_vi: "Rà soát nhất quán cho thư tín chuyên nghiệp",
    title_en: "Consistency review for professional correspondence",
    review_prompt_vi: "Kiểm tra email follow-up có giữ giọng lịch sự, rõ request và không trượt sang chat không.",
    review_prompt_en: "Check whether the follow-up email stays polite, has a clear request, and does not slip into chat style.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please let me know when the next step can be expected.",
    },
    consistency_checks_vi: ["Giọng công việc ổn định.", "Có request rõ.", "Không chuyển sang thân mật."],
    consistency_checks_en: ["Work tone stays stable.", "Clear request is present.", "Does not become familiar."],
    final_guardrail_vi: ["Không giống chat.", "Không thành complaint.", "Có next step."],
    final_guardrail_en: ["Not chat-like.", "Not a complaint.", "Has a next step."],
    integration_readiness_vi: ["Sẵn sàng gửi văn phòng.", "Ngắn mà đủ.", "Dễ nhúng vào mẫu email."],
    integration_readiness_en: ["Ready to send to an office.", "Short but sufficient.", "Easy to embed in an email template."],
    canada_example: {
      context_vi: "Email chuyên nghiệp trong bối cảnh Canada.",
      context_en: "Professional email in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੇ ਸੁਨੇਹੇ ਵਿੱਚ ਮਿਤਭਾਸ਼ੀ ਅਤੇ ਸਪਸ਼ਟਤਾ ਦੋਵੇਂ ਜ਼ਰੂਰੀ ਹਨ।",
      rom: "Canada de daftar nu bheje sunehe vich mitbhashi ate spashtata dovein zaruri han.",
      vi: "Trong email gửi văn phòng ở Canada, cả sự tiết chế và rõ ràng đều quan trọng.",
      en: "In an email sent to an office in Canada, both restraint and clarity matter.",
    },
    learner_traps_vi: ["Đừng quá lạnh.", "Đừng quá thân mật."],
    learner_traps_en: ["Do not sound too cold.", "Do not sound too familiar."],
  },
  {
    id: "pa_c1_consistency_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "integration_ready",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ consistency review",
    title_rom: "karjakari sankhep consistency review",
    title_vi: "Rà soát nhất quán cho executive summary",
    title_en: "Consistency review for executive summary",
    review_prompt_vi: "Kiểm tra issue, finding và recommendation có cùng hướng và không lặp ý không.",
    review_prompt_en: "Check whether issue, finding, and recommendation point in the same direction and do not repeat each other.",
    response_frame: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬ ਦੇ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਮੁੱਖ ਨਤੀਜਾ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ ਪਰ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ। ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ।",
      rom: "mukh mudda seva pahunch ate jawab de samen vichla farak hai. mukh natija hai ki mang vadhi hai par samarthta use dar nal nahin vadhi. sifarash hai ki uch-jokham mamlian lai vakhri katar banai jave.",
      vi: "Vấn đề chính là khoảng cách giữa khả năng tiếp cận dịch vụ và thời gian phản hồi. Kết quả chính là nhu cầu tăng nhưng năng lực không tăng cùng tốc độ. Khuyến nghị là tạo hàng riêng cho các trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The key finding is that demand has increased, but capacity has not grown at the same rate. The recommendation is to create a separate queue for high-risk cases.",
    },
    consistency_checks_vi: ["Issue, finding, recommendation cùng hướng.", "Không lặp ý.", "Không thêm nền thừa."],
    consistency_checks_en: ["Issue, finding, and recommendation point the same way.", "No repeated ideas.", "No unnecessary background."],
    final_guardrail_vi: ["Không lan man.", "Không thiếu recommendation.", "Đủ cho người ra quyết định."],
    final_guardrail_en: ["No rambling.", "Does not omit the recommendation.", "Enough for a decision-maker."],
    integration_readiness_vi: ["Sẵn sàng cho memo.", "Dễ quét nhanh.", "Phù hợp bản cuối."],
    integration_readiness_en: ["Ready for a memo.", "Easy to skim.", "Fits a final version."],
    canada_example: {
      context_vi: "Executive summary tại Canada.",
      context_en: "Executive summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਟੀਮ ਲਈ ਮੁੱਖ ਕਦਮ ਹੈ ਕਿ ਅਰਜ਼ੀਆਂ ਨੂੰ ਜੋਖਮ ਅਨੁਸਾਰ ਵੰਡਿਆ ਜਾਵੇ।",
      rom: "Canada vich seva team lai mukh kadam hai ki arzian nu jokham anusaar vandia jave.",
      vi: "Tại Canada, bước chính cho nhóm dịch vụ là phân loại hồ sơ theo rủi ro.",
      en: "In Canada, the main step for the service team is to sort applications by risk.",
    },
    learner_traps_vi: ["Đừng kể hết bối cảnh.", "Đừng bỏ recommendation."],
    learner_traps_en: ["Do not narrate all the background.", "Do not omit the recommendation."],
  },
  {
    id: "pa_c1_consistency_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "consistency_review",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ consistency review",
    title_rom: "peshkari jawab consistency review",
    title_vi: "Rà soát nhất quán cho phản hồi thuyết trình",
    title_en: "Consistency review for presentation response",
    review_prompt_vi: "Kiểm tra câu trả lời khó có giữ mức tự tin vừa phải và không phòng thủ không.",
    review_prompt_en: "Check whether the hard answer keeps measured confidence and avoids defensiveness.",
    response_frame: {
      pa: "ਇਹ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਡਾਟਾ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਨਮੂਨਾ ਹਾਲੇ ਛੋਟਾ ਹੈ, ਪਰ ਪੈਟਰਨ ਅਗਲੇ ਅਧਿਐਨ ਲਈ ਲਾਭਦਾਇਕ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "ih sawal mahatvapuran hai kyonki ih data di sima vall dhian divaunda hai. namuna hale chhota hai, par pattern agle adhiyan lai labhdaik disha dinda hai.",
      vi: "Câu hỏi này quan trọng vì nó chỉ ra giới hạn dữ liệu. Mẫu còn nhỏ, nhưng mô hình này đưa ra hướng hữu ích cho nghiên cứu tiếp theo.",
      en: "This question is important because it points to a data limitation. The sample is still small, but the pattern gives a useful direction for the next study.",
    },
    consistency_checks_vi: ["Công nhận câu hỏi.", "Giữ mức tự tin vừa phải.", "Không đổi sang phòng thủ."],
    consistency_checks_en: ["Acknowledges the question.", "Keeps measured confidence.", "Does not become defensive."],
    final_guardrail_vi: ["Không né câu hỏi.", "Không nói quá chắc.", "Có hướng tiếp theo."],
    final_guardrail_en: ["Does not dodge the question.", "Does not sound too certain.", "Has next direction."],
    integration_readiness_vi: ["Sẵn sàng cho Q&A.", "Giữ tone nhất quán.", "Dùng được sau slide."],
    integration_readiness_en: ["Ready for Q&A.", "Keeps tone consistent.", "Usable after slides."],
    canada_example: {
      context_vi: "Q&A thuyết trình tại Canada.",
      context_en: "Presentation Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਰਸ਼ਕਾਂ ਲਈ ਇਹ ਕਹਿਣਾ ਢੰਗੀ ਹੈ ਕਿ ਨਤੀਜੇ ਹਾਲੇ ਸ਼ੁਰੂਆਤੀ ਹਨ।",
      rom: "Canada de darshkan lai ih kahna dangi hai ki natije hale shuruaati han.",
      vi: "Với khán giả ở Canada, nên nói kết quả vẫn còn ở giai đoạn đầu.",
      en: "For an audience in Canada, it is appropriate to say the results are still early-stage.",
    },
    learner_traps_vi: ["Đừng trả lời như đang cãi nhau.", "Đừng phóng đại mẫu nhỏ."],
    learner_traps_en: ["Do not answer as if arguing.", "Do not overstate a small sample."],
  },
  {
    id: "pa_c1_consistency_public_register",
    level: "C1",
    area: "public_professional_register",
    mode: "final_guardrail",
    title_pa: "ਜਨਤਕ/ਪੇਸ਼ਾਵਰ ਰਜਿਸਟਰ consistency review",
    title_rom: "jantak/peshavar register consistency review",
    title_vi: "Rà soát nhất quán giọng công cộng/chuyên nghiệp",
    title_en: "Consistency review for public/professional register",
    review_prompt_vi: "Kiểm tra thông báo công cộng có giữ sự rõ ràng, tôn trọng và hướng hành động không.",
    review_prompt_en: "Check whether the public-facing notice stays clear, respectful, and action-oriented.",
    response_frame: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਲਾਗੂ ਹੋਵੇਗੀ। ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ ਦੀ ਮੀਟਿੰਗ ਬੁਕ ਹੈ, ਉਨ੍ਹਾਂ ਨੂੰ ਨਵਾਂ ਸਮਾਂ ਈਮੇਲ ਰਾਹੀਂ ਮਿਲੇਗਾ। ਮਦਦ ਲਈ ਸੇਵਾ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      rom: "seva samen vich tabdili agle somvar ton lagu hovegi. jinhan lokan di meeting book hai, unha nu nava sama email rahin milega. madad lai seva kendar nal sampark karo.",
      vi: "Thay đổi giờ dịch vụ sẽ áp dụng từ thứ Hai tới. Người đã đặt lịch sẽ nhận giờ mới qua email. Hãy liên hệ trung tâm dịch vụ để được hỗ trợ.",
      en: "The service-hours change will take effect next Monday. People with booked appointments will receive a new time by email. Contact the service centre for help.",
    },
    consistency_checks_vi: ["Người bị ảnh hưởng rõ.", "Bước tiếp theo rõ.", "Hỗ trợ ngôn ngữ vẫn rõ."],
    consistency_checks_en: ["Affected people are clear.", "Next step is clear.", "Language support remains clear."],
    final_guardrail_vi: ["Không có jargon nội bộ.", "Không quá thân mật.", "Không thiếu hướng dẫn."],
    final_guardrail_en: ["No internal jargon.", "Not too familiar.", "No missing instructions."],
    integration_readiness_vi: ["Sẵn sàng cho thông báo.", "Không gây hiểu nhầm.", "Dễ bản địa hóa."],
    integration_readiness_en: ["Ready for a notice.", "Does not mislead.", "Easy to localize."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công tại Canada.",
      context_en: "Public-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੀਂ ਸੇਵਾ ਲਈ ਵੈੱਬਸਾਈਟ ਅਤੇ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੋਵੇਂ ਸਪਸ਼ਟ ਦਿੱਤੇ ਜਾਣ।",
      rom: "Canada vich navi seva lai website ate bhasha sahaita dovein spasht ditte jan.",
      vi: "Tại Canada, với dịch vụ mới, website và hỗ trợ ngôn ngữ đều nên được nêu rõ.",
      en: "In Canada, for a new service, both the website and language support should be stated clearly.",
    },
    learner_traps_vi: ["Đừng viết như memo nội bộ.", "Đừng quên người đọc cần làm gì."],
    learner_traps_en: ["Do not write it like an internal memo.", "Do not forget what the reader should do."],
  },
];
