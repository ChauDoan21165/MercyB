// Punjabi C1 academic quality guards for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiAcademicQualityGuardAreaC1 =
  | "cautious_claim"
  | "source_summary"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "professional_register_safety"
  | "public_service_register_safety";

export type PunjabiAcademicQualityGuardModeC1 =
  | "quality_guard"
  | "final_safety"
  | "export_ready";

export type PunjabiAcademicQualityGuardPhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiAcademicQualityGuardCardC1 = {
  id: string;
  level: "C1";
  area: PunjabiAcademicQualityGuardAreaC1;
  mode: PunjabiAcademicQualityGuardModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  guard_prompt_vi: string;
  guard_prompt_en: string;
  response_frame: PunjabiAcademicQualityGuardPhraseC1;
  risk_signals_vi: readonly string[];
  risk_signals_en: readonly string[];
  final_qa_vi: readonly string[];
  final_qa_en: readonly string[];
  canada_example: PunjabiAcademicQualityGuardPhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const academicQualityGuardsScriptAwarenessC1 = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const academicQualityGuardsC1: PunjabiAcademicQualityGuardCardC1[] = [
  {
    id: "pa_c1_quality_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "quality_guard",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ ਦਾ ਗਾਰਡ",
    title_rom: "savdhan daava da guard",
    title_vi: "Bộ gác cho claim thận trọng",
    title_en: "Cautious claim guard",
    guard_prompt_vi: "Nêu claim có lực nhưng vẫn giữ giới hạn dữ liệu rõ ràng.",
    guard_prompt_en: "State a claim with force while keeping data limits explicit.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਸਬੂਤ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਇਹ ਤਬਦੀਲੀ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਅੰਤਿਮ ਨਤੀਜੇ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "uplabdh sabut ih sujhaounde han ki ih tabdili labhdaik ho sakdi hai, par antim natije lai hor samikhia lorindi hai.",
      vi: "Bằng chứng hiện có gợi ý thay đổi này có thể hữu ích, nhưng kết luận cuối cùng vẫn cần được xem xét thêm.",
      en: "The available evidence suggests that this change may be helpful, but the final conclusion still needs more review.",
    },
    risk_signals_vi: ["Có hedge.", "Không tuyệt đối hóa.", "Giữ sức nặng học thuật."],
    risk_signals_en: ["Has hedging.", "Does not over-absolute.", "Keeps academic force."],
    final_qa_vi: ["Có giới hạn dữ liệu.", "Không thành lời quảng cáo.", "Vẫn rõ lập trường."],
    final_qa_en: ["States data limits.", "Does not sound like marketing.", "Still states a position."],
    canada_example: {
      context_vi: "Claim thận trọng trong bối cảnh Canada.",
      context_en: "Cautious claim in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਲਈ ਹੋਰ ਡਾਟਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de pilot ton lagda hai ki navi prakiria madad kar sakdi hai, par vadde padhar lai hor data chahida hai.",
      vi: "Từ pilot ở Canada, có vẻ quy trình mới có thể hỗ trợ, nhưng để áp dụng rộng hơn thì cần thêm dữ liệu.",
      en: "The Canadian pilot suggests the new process may help, but more data is needed for broader rollout.",
    },
    learner_traps_vi: ["Đừng nói chắc từ dữ liệu nhỏ.", "Đừng làm hedge quá mạnh đến mức mờ ý."],
    learner_traps_en: ["Do not sound certain from small data.", "Do not hedge so much that the meaning blurs."],
  },
  {
    id: "pa_c1_quality_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "export_ready",
    title_pa: "ਸਰੋਤ ਸਾਰ ਗਾਰਡ",
    title_rom: "sarot saar guard",
    title_vi: "Bộ gác cho tóm tắt nguồn",
    title_en: "Source summary guard",
    guard_prompt_vi: "Tóm tắt nguồn khi có chi tiết phụ và một chút căng giữa các dữ kiện.",
    guard_prompt_en: "Summarize a source when there are extra details and mild tension between facts.",
    response_frame: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਬਿੰਦੂ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਹਲਕੀ ਅਸੰਗਤੀ ਦੇ ਬਾਵਜੂਦ, ਲੇਖਕ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਫੀਡਬੈਕ ਨੂੰ ਕੇਂਦਰ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।",
      rom: "sarot da mukh bindu ih hai ki spasht sama-rekha bharosa vadha sakdi hai. halki asangti de bavjood, lekhak udik samen ate feedback nu kendr vich rakhda hai.",
      vi: "Điểm chính của nguồn là timeline rõ có thể tăng niềm tin. Dù có bất nhất nhẹ, tác giả vẫn đặt thời gian chờ và phản hồi vào trung tâm.",
      en: "The source's main point is that a clear timeline can increase trust. Despite a mild inconsistency, the writer keeps wait time and feedback at the centre.",
    },
    risk_signals_vi: ["Không để chi tiết phụ lấn ý chính.", "Không xóa tension hữu ích.", "Giọng trung lập."],
    risk_signals_en: ["Minor details do not overpower the main point.", "Useful tension is not erased.", "Neutral tone remains."],
    final_qa_vi: ["Có nén thông tin.", "Không biến thành phản biện.", "Nguồn vẫn là chủ thể."],
    final_qa_en: ["Information is compressed.", "It does not become a critique.", "The source remains the subject."],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ ở Canada.",
      context_en: "Summary of a source about services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਨੂੰ ਸਪਸ਼ਟ ਰੱਖਣ ਨਾਲ ਗਲਤਫਹਿਮੀ ਘੱਟ ਹੋ ਸਕਦੀ ਹੈ।",
      rom: "Canada vich seva jankari nu spasht rakhhan nal galtfehmi ghatt ho sakdi hai.",
      vi: "Tại Canada, giữ thông tin dịch vụ rõ ràng có thể giảm hiểu lầm.",
      en: "In Canada, keeping service information clear can reduce misunderstanding.",
    },
    learner_traps_vi: ["Đừng nhấn quá nhiều vào chi tiết phụ.", "Đừng biến summary thành nhận xét."],
    learner_traps_en: ["Do not over-focus on side details.", "Do not turn the summary into commentary."],
  },
  {
    id: "pa_c1_quality_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "final_safety",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ ਗਾਰਡ",
    title_rom: "sabut tulna guard",
    title_vi: "Bộ gác cho so sánh bằng chứng",
    title_en: "Evidence comparison guard",
    guard_prompt_vi: "So sánh số liệu và phỏng vấn mà không trộn vai trò của chúng.",
    guard_prompt_en: "Compare figures and interviews without mixing up their roles.",
    response_frame: {
      pa: "ਅੰਕੜੇ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਤਜਰਬੇ ਨੂੰ ਖੋਲ੍ਹਦੇ ਹਨ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਫੈਸਲੇ ਨੂੰ ਮਜ਼ਬੂਤ ਆਧਾਰ ਦਿੰਦੇ ਹਨ।",
      rom: "ankre rujhan dikhaunde han, jadki interview tajarbe nu kholde han. dovein mil ke faisle nu mazbut adhar dinde han.",
      vi: "Số liệu cho thấy xu hướng, còn phỏng vấn mở ra trải nghiệm. Ghép lại, hai loại bằng chứng tạo nền vững cho quyết định.",
      en: "The figures show the trend, while the interviews open up experience. Together, the two kinds of evidence provide a stronger basis for decisions.",
    },
    risk_signals_vi: ["Không tráo vai trò nguồn.", "Có synthesis.", "So sánh theo tiêu chí."],
    risk_signals_en: ["Does not swap source roles.", "Has synthesis.", "Compares with a criterion."],
    final_qa_vi: ["Nêu khác biệt và bổ sung.", "Không nói chung chung.", "Có kết luận hợp nhất."],
    final_qa_en: ["States difference and complementarity.", "Not vague.", "Has an integrated conclusion."],
    canada_example: {
      context_vi: "So sánh evidence trong bối cảnh Canada.",
      context_en: "Comparing evidence in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਸਾਫ਼ ਕਰਦੇ ਹਨ।",
      rom: "Canada de ankre udik sama dikhaunde han, jadki interview bhasha sahaita di lor saf karde han.",
      vi: "Số liệu ở Canada cho thấy thời gian chờ, còn phỏng vấn làm rõ nhu cầu hỗ trợ ngôn ngữ.",
      en: "The Canadian figures show wait time, while interviews clarify the need for language support.",
    },
    learner_traps_vi: ["Đừng chỉ nói cả hai đều quan trọng.", "Đừng quên điểm so sánh."],
    learner_traps_en: ["Do not just say both matter.", "Do not forget the comparison point."],
  },
  {
    id: "pa_c1_quality_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "export_ready",
    title_pa: "ਰਸਮੀ ਪੱਤਰ-ਵਿਹਾਰ ਗਾਰਡ",
    title_rom: "rasmi patar-vihar guard",
    title_vi: "Bộ gác cho thư tín trang trọng",
    title_en: "Formal correspondence guard",
    guard_prompt_vi: "Viết follow-up chuyên nghiệp khi người nhận chậm phản hồi.",
    guard_prompt_en: "Write a professional follow-up when the recipient has been slow to respond.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please let me know when the next step can be expected.",
    },
    risk_signals_vi: ["Không trách móc.", "Có yêu cầu rõ.", "Giữ giọng công việc."],
    risk_signals_en: ["No blame.", "Clear request is present.", "Keeps a workplace tone."],
    final_qa_vi: ["Không giống chat.", "Không ép người nhận.", "Có bước kế tiếp."],
    final_qa_en: ["Not chat-like.", "Does not pressure the recipient.", "Has a next step."],
    canada_example: {
      context_vi: "Email chuyên nghiệp trong bối cảnh Canada.",
      context_en: "Professional email in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੇ ਸੁਨੇਹੇ ਵਿੱਚ ਮਿਤਭਾਸ਼ੀ ਅਤੇ ਸਪਸ਼ਟਤਾ ਦੋਵੇਂ ਜ਼ਰੂਰੀ ਹਨ।",
      rom: "Canada de daftar nu bheje sunehe vich mitbhashi ate spashtata dovein zaruri han.",
      vi: "Trong email gửi văn phòng ở Canada, cả sự tiết chế và rõ ràng đều quan trọng.",
      en: "In an email sent to an office in Canada, both restraint and clarity matter.",
    },
    learner_traps_vi: ["Đừng quá lạnh.", "Đừng quá thân mật."],
    learner_traps_en: ["Do not sound cold.", "Do not sound too familiar."],
  },
  {
    id: "pa_c1_quality_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "quality_guard",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ ਗਾਰਡ",
    title_rom: "karjakari sankhep guard",
    title_vi: "Bộ gác cho executive summary",
    title_en: "Executive summary guard",
    guard_prompt_vi: "Viết issue, finding, recommendation cho người đọc chỉ muốn quyết định nhanh.",
    guard_prompt_en: "Write issue, finding, and recommendation for a reader who wants a quick decision.",
    response_frame: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬ ਦੇ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਮੁੱਖ ਨਤੀਜਾ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ ਪਰ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ। ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ।",
      rom: "mukh mudda seva pahunch ate jawab de samen vichla farak hai. mukh natija hai ki mang vadhi hai par samarthta use dar nal nahin vadhi. sifarash hai ki uch-jokham mamlian lai vakhri katar banai jave.",
      vi: "Vấn đề chính là khoảng cách giữa khả năng tiếp cận dịch vụ và thời gian phản hồi. Kết quả chính là nhu cầu tăng nhưng năng lực không tăng cùng tốc độ. Khuyến nghị là tạo hàng riêng cho các trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The key finding is that demand has increased, but capacity has not grown at the same rate. The recommendation is to create a separate queue for high-risk cases.",
    },
    risk_signals_vi: ["Không quá nhiều bối cảnh.", "Có hành động.", "Phù hợp người ra quyết định."],
    risk_signals_en: ["Not too much background.", "Has action.", "Fits a decision-maker."],
    final_qa_vi: ["Không lan man.", "Có recommendation.", "Đủ ngắn để quét nhanh."],
    final_qa_en: ["No rambling.", "Has a recommendation.", "Short enough to skim."],
    canada_example: {
      context_vi: "Executive summary tại Canada.",
      context_en: "Executive summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਟੀਮ ਲਈ ਮੁੱਖ ਕਦਮ ਹੈ ਕਿ ਅਰਜ਼ੀਆਂ ਨੂੰ ਜੋਖਮ ਅਨੁਸਾਰ ਵੰਡਿਆ ਜਾਵੇ।",
      rom: "Canada vich seva team lai mukh kadam hai ki arzian nu jokham anusaar vandia jave.",
      vi: "Tại Canada, bước chính cho nhóm dịch vụ là phân loại hồ sơ theo rủi ro.",
      en: "In Canada, the main step for the service team is to sort applications by risk.",
    },
    learner_traps_vi: ["Đừng kể hết background.", "Đừng bỏ recommendation."],
    learner_traps_en: ["Do not narrate all background.", "Do not omit the recommendation."],
  },
  {
    id: "pa_c1_quality_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "final_safety",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ ਗਾਰਡ",
    title_rom: "peshkari jawab guard",
    title_vi: "Bộ gác cho phản hồi thuyết trình",
    title_en: "Presentation response guard",
    guard_prompt_vi: "Trả lời câu hỏi khó sau thuyết trình mà vẫn giữ mức chắc chắn vừa đủ.",
    guard_prompt_en: "Answer a hard question after a presentation while keeping measured confidence.",
    response_frame: {
      pa: "ਇਹ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਡਾਟਾ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਨਮੂਨਾ ਹਾਲੇ ਛੋਟਾ ਹੈ, ਪਰ ਪੈਟਰਨ ਅਗਲੇ ਅਧਿਐਨ ਲਈ ਲਾਭਦਾਇਕ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "ih sawal mahatvapuran hai kyonki ih data di sima vall dhian divaunda hai. namuna hale chhota hai, par pattern agle adhiyan lai labhdaik disha dinda hai.",
      vi: "Câu hỏi này quan trọng vì nó chỉ ra giới hạn dữ liệu. Mẫu còn nhỏ, nhưng mô hình này đưa ra hướng hữu ích cho nghiên cứu tiếp theo.",
      en: "This question is important because it points to a data limitation. The sample is still small, but the pattern gives a useful direction for the next study.",
    },
    risk_signals_vi: ["Công nhận câu hỏi.", "Nêu giới hạn.", "Không phòng thủ."],
    risk_signals_en: ["Acknowledges the question.", "States the limitation.", "Not defensive."],
    final_qa_vi: ["Không né câu hỏi.", "Không nói quá chắc.", "Có hướng tiếp theo."],
    final_qa_en: ["Does not dodge the question.", "Does not sound too certain.", "Has next direction."],
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
    id: "pa_c1_quality_professional_register",
    level: "C1",
    area: "professional_register_safety",
    mode: "export_ready",
    title_pa: "ਪੇਸ਼ਾਵਰ ਰਜਿਸਟਰ ਸੁਰੱਖਿਆ",
    title_rom: "peshavar register surakhia",
    title_vi: "An toàn giọng văn chuyên nghiệp",
    title_en: "Professional register safety",
    guard_prompt_vi: "Giữ giọng chuyên nghiệp khi sửa văn bản cho môi trường làm việc.",
    guard_prompt_en: "Keep a professional tone when revising text for a workplace setting.",
    response_frame: {
      pa: "ਅਸੀਂ ਤੁਹਾਡੀ ਬੇਨਤੀ ਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਦਰਜ ਕਰ ਰਹੇ ਹਾਂ ਅਤੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਜਲਦੀ ਜਾਣਕਾਰੀ ਦੇਵਾਂਗੇ।",
      rom: "asi tuhadi benti nu spasht taur te darj kar rahe han ate agle kadam bare jaldi jankari dewangey.",
      vi: "Chúng tôi đang ghi nhận yêu cầu của bạn một cách rõ ràng và sẽ sớm cung cấp thông tin về bước tiếp theo.",
      en: "We are recording your request clearly and will provide information about the next step soon.",
    },
    risk_signals_vi: ["Giọng công việc.", "Không quá thân mật.", "Có follow-up."],
    risk_signals_en: ["Work tone.", "Not too familiar.", "Has follow-up."],
    final_qa_vi: ["Không chat-like.", "Không cứng đơ.", "Đủ lịch sự."],
    final_qa_en: ["Not chat-like.", "Not stiff.", "Polite enough."],
    canada_example: {
      context_vi: "Trao đổi chuyên nghiệp tại Canada.",
      context_en: "Professional exchange in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਵਿੱਚ ਸਪਸ਼ਟਤਾ ਅਤੇ ਸ਼ਿਸ਼ਟਤਾ ਦੋਵੇਂ ਇਕੱਠੇ ਰੱਖਣੇ ਚਾਹੀਦੇ ਹਨ।",
      rom: "Canada de daftar vich spashtata ate shishtata dovein ikatthe rakhne chahide han.",
      vi: "Trong văn phòng ở Canada, cần giữ đồng thời sự rõ ràng và lịch sự.",
      en: "In an office in Canada, clarity and politeness should be kept together.",
    },
    learner_traps_vi: ["Đừng quá cứng.", "Đừng quá thân."],
    learner_traps_en: ["Do not sound rigid.", "Do not sound too friendly."],
  },
  {
    id: "pa_c1_quality_public_service_register",
    level: "C1",
    area: "public_service_register_safety",
    mode: "final_safety",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਰਜਿਸਟਰ ਸੁਰੱਖਿਆ",
    title_rom: "jantak seva register surakhia",
    title_vi: "An toàn giọng văn dịch vụ công",
    title_en: "Public-service register safety",
    guard_prompt_vi: "Viết thông báo dịch vụ công rõ ràng, tôn trọng và dễ hành động.",
    guard_prompt_en: "Write a public-service notice that is clear, respectful, and easy to act on.",
    response_frame: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਲਾਗੂ ਹੋਵੇਗੀ। ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ ਦੀ ਮੀਟਿੰਗ ਬੁਕ ਹੈ, ਉਨ੍ਹਾਂ ਨੂੰ ਨਵਾਂ ਸਮਾਂ ਈਮੇਲ ਰਾਹੀਂ ਮਿਲੇਗਾ। ਮਦਦ ਲਈ ਸੇਵਾ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      rom: "seva samen vich tabdili agle somvar ton lagu hovegi. jinhan lokan di meeting book hai, unha nu nava sama email rahin milega. madad lai seva kendar nal sampark karo.",
      vi: "Thay đổi giờ dịch vụ sẽ áp dụng từ thứ Hai tới. Người đã đặt lịch sẽ nhận giờ mới qua email. Hãy liên hệ trung tâm dịch vụ để được hỗ trợ.",
      en: "The service-hours change will take effect next Monday. People with booked appointments will receive a new time by email. Contact the service centre for help.",
    },
    risk_signals_vi: ["Người bị ảnh hưởng rõ.", "Bước tiếp theo rõ.", "Có hỗ trợ tiếp cận."],
    risk_signals_en: ["Affected people are clear.", "Next step is clear.", "Access support is present."],
    final_qa_vi: ["Không có jargon nội bộ.", "Có chỉ dẫn hành động.", "Giọng công bằng."],
    final_qa_en: ["No internal jargon.", "Has action guidance.", "Fair tone."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công tại Canada.",
      context_en: "Public-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੀਂ ਸੇਵਾ ਲਈ ਵੈੱਬਸਾਈਟ ਅਤੇ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੋਵੇਂ ਸਪਸ਼ਟ ਦਿੱਤੇ ਜਾਣ।",
      rom: "Canada vich navi seva lai website ate bhasha sahaita dovein spasht ditte jan.",
      vi: "Tại Canada, với dịch vụ mới, website và hỗ trợ ngôn ngữ đều nên được nêu rõ.",
      en: "In Canada, for a new service, both the website and language support should be stated clearly.",
    },
    learner_traps_vi: ["Đừng viết như email nội bộ.", "Đừng quên người đọc cần làm gì."],
    learner_traps_en: ["Do not write it like an internal email.", "Do not forget what the reader should do."],
  },
];
