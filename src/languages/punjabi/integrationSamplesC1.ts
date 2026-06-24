// Punjabi C1 integration samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiIntegrationSampleAreaC1 =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "public_professional_text_handling";

export type PunjabiIntegrationSampleModeC1 = "integration_sample" | "final_evidence" | "final_qa";

export type PunjabiIntegrationSamplePhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiIntegrationSampleC1 = {
  id: string;
  level: "C1";
  area: PunjabiIntegrationSampleAreaC1;
  mode: PunjabiIntegrationSampleModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  integration_goal_vi: string;
  integration_goal_en: string;
  sample: PunjabiIntegrationSamplePhraseC1;
  final_evidence_vi: readonly string[];
  final_evidence_en: readonly string[];
  final_qa_vi: readonly string[];
  final_qa_en: readonly string[];
  canada_example: PunjabiIntegrationSamplePhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const integrationSamplesScriptAwareness = {
  vi: "Các integration sample dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "These integration samples use Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi script, not as the main practice script.",
} as const;

export const integrationSamplesC1: PunjabiIntegrationSampleC1[] = [
  {
    id: "pa_c1_integration_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "integration_sample",
    title_pa: "ਰਸਮੀ ਲਿਖਤ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "rasmi likhat nu jorna",
    title_vi: "Tích hợp viết trang trọng",
    title_en: "Integrating formal writing",
    integration_goal_vi: "Dùng làm mẫu nối thesis, điều kiện và tác động trong một đoạn C1.",
    integration_goal_en: "Use as a sample for linking thesis, qualification, and effect in a C1 paragraph.",
    sample: {
      pa: "ਮੌਜੂਦਾ ਸਬੂਤ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਅਕਾਦਮਿਕ ਸਹਾਇਤਾ ਤਦੋਂ ਵਧੇਰੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਹੋ ਸਕਦੀ ਹੈ ਜਦੋਂ ਇਹ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਅਤੇ ਸਲਾਹ ਨਾਲ ਜੋੜੀ ਜਾਵੇ। ਇਸ ਲਈ ਨੀਤੀ ਨੂੰ ਸਿਰਫ ਵਿੱਤੀ ਮਦਦ ਤੱਕ ਸੀਮਿਤ ਰੱਖਣ ਦੀ ਬਜਾਇ ਵਿਆਪਕ ਸਹਾਇਤਾ ਮਾਡਲ ਵੱਲ ਵਧਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "maujuda sabut darsaunde han ki academic sahaita tadon vadhere prabhavshali ho sakdi hai jadon ih bhasha sahaita ate salah nal jori jave. is lai niti nu sirf vitti madad takk simit rakhan di bajai viapak sahaita model vall vadhna chahida hai.",
      vi: "Bằng chứng hiện có cho thấy hỗ trợ học thuật có thể hiệu quả hơn khi gắn với hỗ trợ ngôn ngữ và tư vấn. Vì vậy, chính sách không nên chỉ giới hạn ở hỗ trợ tài chính mà nên hướng đến mô hình hỗ trợ rộng hơn.",
      en: "Current evidence indicates that academic support may be more effective when linked with language support and advising. Therefore, policy should move beyond financial aid alone toward a broader support model.",
    },
    final_evidence_vi: ["Có claim chính.", "Có hedge phù hợp.", "Có hệ quả chính sách."],
    final_evidence_en: ["Main claim is present.", "Hedging is appropriate.", "Policy effect is stated."],
    final_qa_vi: ["Register trang trọng.", "Không dùng tôi nghĩ.", "Không overclaim."],
    final_qa_en: ["Formal register.", "No I think phrasing.", "No overclaiming."],
    canada_example: {
      context_vi: "Đoạn văn chính sách học thuật tại Canada.",
      context_en: "Academic policy paragraph in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਲਈ ਭਾਸ਼ਾ ਅਤੇ ਸਲਾਹ ਨੂੰ ਇਕੱਠੇ ਰੱਖਣਾ ਨੀਤੀ ਨੂੰ ਹੋਰ ਵਰਤਣਯੋਗ ਬਣਾ ਸਕਦਾ ਹੈ।",
      rom: "Canada vich vidyarthi sahaita lai bhasha ate salah nu ikatthe rakhna niti nu hor vartanyog bana sakda hai.",
      vi: "Tại Canada, đặt hỗ trợ ngôn ngữ và tư vấn cùng nhau có thể làm chính sách hỗ trợ sinh viên khả dụng hơn.",
      en: "In Canada, keeping language support and advising together may make student-support policy more usable.",
    },
    learner_traps_vi: ["Đừng viết thesis quá rộng.", "Đừng bỏ điều kiện khi dữ liệu còn giới hạn."],
    learner_traps_en: ["Do not write an overly broad thesis.", "Do not remove qualification when evidence remains limited."],
  },
  {
    id: "pa_c1_integration_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "final_evidence",
    title_pa: "ਸਰੋਤ ਸਾਰ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "sarot saar nu jorna",
    title_vi: "Tích hợp summary nguồn",
    title_en: "Integrating source summary",
    integration_goal_vi: "Dùng khi wiring cần một summary trung lập có claim, evidence và conclusion.",
    integration_goal_en: "Use when wiring needs a neutral summary with claim, evidence, and conclusion.",
    sample: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਸੇਵਾ ਤੇ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਵਰਤੋਂਕਾਰ ਫੀਡਬੈਕ ਨੂੰ ਸਬੂਤ ਵਜੋਂ ਵਰਤਦਾ ਹੈ। ਸੰਖੇਪ ਵਿੱਚ, ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਸਾਫ ਸੰਚਾਰ ਪਹੁੰਚ ਨੂੰ ਸੁਧਾਰ ਸਕਦਾ ਹੈ।",
      rom: "sarot da mukh daava hai ki spasht sama-rekha seva te bharosa vadha sakdi hai. lekhak udik samen ate vartonkar feedback nu sabut vajon vartda hai. sankhep vich, sarot sujhaounda hai ki saf sanchar pahunch nu sudhar sakda hai.",
      vi: "Claim chính của nguồn là mốc thời gian rõ có thể tăng niềm tin vào dịch vụ. Tác giả dùng thời gian chờ và phản hồi người dùng làm bằng chứng. Tóm lại, nguồn gợi ý rằng giao tiếp rõ có thể cải thiện khả năng tiếp cận.",
      en: "The source's main claim is that clear timelines can increase trust in a service. The writer uses wait times and user feedback as evidence. In summary, the source suggests that clear communication can improve access.",
    },
    final_evidence_vi: ["Claim nguồn rõ.", "Evidence được nén.", "Conclusion trung lập."],
    final_evidence_en: ["Source claim is clear.", "Evidence is compressed.", "Conclusion is neutral."],
    final_qa_vi: ["Không thêm opinion.", "Không chép dài.", "Giữ nguồn làm chủ thể."],
    final_qa_en: ["No added opinion.", "No long copying.", "The source remains the subject."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਬਹੁਭਾਸ਼ੀ ਜਾਣਕਾਰੀ ਕਮਿਊਨਿਟੀ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਸੁਧਾਰ ਸਕਦੀ ਹੈ।",
      rom: "sarot sujhaounda hai ki Canada vich bahubhashi jankari community seva di pahunch sudhar sakdi hai.",
      vi: "Nguồn gợi ý rằng tại Canada, thông tin đa ngôn ngữ có thể cải thiện khả năng tiếp cận dịch vụ cộng đồng.",
      en: "The source suggests that in Canada, multilingual information can improve access to community services.",
    },
    learner_traps_vi: ["Đừng biến summary thành reaction.", "Đừng bỏ evidence chính."],
    learner_traps_en: ["Do not turn summary into reaction.", "Do not omit the key evidence."],
  },
  {
    id: "pa_c1_integration_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "final_qa",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵੇ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "savdhan daave nu jorna",
    title_vi: "Tích hợp claim thận trọng",
    title_en: "Integrating cautious claims",
    integration_goal_vi: "Dùng làm mẫu khi hệ thống cần kiểm tra hedge, limitation và next evidence.",
    integration_goal_en: "Use as a sample when the system must check hedging, limitation, and next evidence.",
    sample: {
      pa: "ਛੋਟੇ ਪਾਇਲਟ ਦੇ ਨਤੀਜੇ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਉਡੀਕ ਘਟਾ ਸਕਦੀ ਹੈ, ਪਰ ਇਹ ਨਤੀਜਾ ਵੱਡੇ ਨਮੂਨੇ ਨਾਲ ਪੁਸ਼ਟੀ ਮੰਗਦਾ ਹੈ।",
      rom: "chhote pilot de natije sujhaounde han ki navi prakiria udik ghata sakdi hai, par ih natija vadde namune nal pushti mangda hai.",
      vi: "Kết quả pilot nhỏ gợi ý quy trình mới có thể giảm thời gian chờ, nhưng kết quả này cần được xác nhận bằng mẫu lớn hơn.",
      en: "The small pilot suggests that the new process may reduce waiting, but this finding requires confirmation with a larger sample.",
    },
    final_evidence_vi: ["Có hedge.", "Có limitation mẫu.", "Có nhu cầu evidence tiếp theo."],
    final_evidence_en: ["Hedging is present.", "Sample limitation is present.", "Need for further evidence is stated."],
    final_qa_vi: ["Không dùng chắc chắn.", "Claim vẫn rõ.", "Không hedge quá mức."],
    final_qa_en: ["No certainty language.", "Claim remains clear.", "No excessive hedging."],
    canada_example: {
      context_vi: "Pilot quy trình tại Canada.",
      context_en: "Process pilot in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਇਸ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਹੋਰ ਡਾਟਾ ਲੋੜੀਂਦਾ ਹੈ।",
      rom: "Canada de is pilot ton lagda hai ki online booking madad kar sakdi hai, par hor data lorinda hai.",
      vi: "Từ pilot tại Canada này, có vẻ đặt lịch trực tuyến có thể giúp ích, nhưng cần thêm dữ liệu.",
      en: "This Canadian pilot suggests that online booking may help, but more data is needed.",
    },
    learner_traps_vi: ["Đừng nói chắc từ pilot nhỏ.", "Đừng làm câu mơ hồ đến mức không còn claim."],
    learner_traps_en: ["Do not claim certainty from a small pilot.", "Do not make the sentence so vague that no claim remains."],
  },
  {
    id: "pa_c1_integration_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "integration_sample",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "sabut tulna nu jorna",
    title_vi: "Tích hợp so sánh evidence",
    title_en: "Integrating evidence comparison",
    integration_goal_vi: "Dùng khi wiring cần mẫu nối nguồn định lượng và định tính.",
    integration_goal_en: "Use when wiring needs a sample connecting quantitative and qualitative sources.",
    sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਵੱਡੇ ਨਮੂਨੇ ਕਰਕੇ ਰੁਝਾਨ ਨੂੰ ਵਧੇਰੇ ਭਰੋਸੇਯੋਗ ਬਣਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਲੋਕਾਂ ਦੇ ਅਨੁਭਵ ਦੀ ਗਹਿਰਾਈ ਦਿੰਦਾ ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਦਿਖਾਉਂਦੇ ਹਨ ਕਿ ਫੈਸਲੇ ਵਿੱਚ ਗਿਣਤੀ ਅਤੇ ਅਨੁਭਵ ਦੋਹਾਂ ਦੀ ਲੋੜ ਹੈ।",
      rom: "pahila sarot vadde namune karke rujhan nu vadhere bharoseyog banaunda hai, jadki duja sarot lokan de anubhav di gahirai dinda hai. dovein mil ke dikhaunde han ki faisle vich ginti ate anubhav dohan di lor hai.",
      vi: "Nguồn thứ nhất làm xu hướng đáng tin hơn nhờ mẫu lớn, trong khi nguồn thứ hai cho chiều sâu về trải nghiệm của người dùng. Cả hai cùng cho thấy quyết định cần cả số liệu và trải nghiệm.",
      en: "The first source makes the trend more reliable because of its large sample, while the second gives depth about people's experience. Together, they show that decisions need both numbers and experience.",
    },
    final_evidence_vi: ["Có tiêu chí so sánh.", "Nêu vai trò từng nguồn.", "Có synthesis."],
    final_evidence_en: ["Comparison criterion is present.", "Each source's role is named.", "Synthesis is present."],
    final_qa_vi: ["Không tóm tắt rời rạc.", "Không phóng đại interview nhỏ.", "Không bỏ synthesis."],
    final_qa_en: ["No disconnected summaries.", "Small interviews are not overstated.", "Synthesis is not omitted."],
    canada_example: {
      context_vi: "So sánh số liệu và phỏng vấn tại Canada.",
      context_en: "Comparing figures and interviews in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਮਹੱਤਤਾ ਦਿਖਾਉਂਦੇ ਹਨ।",
      rom: "Canada de ankre udik sama dikhaunde han, jadki interview bhasha sahaita di mahatta dikhaunde han.",
      vi: "Số liệu tại Canada cho thấy thời gian chờ, còn phỏng vấn cho thấy tầm quan trọng của hỗ trợ ngôn ngữ.",
      en: "The Canadian figures show wait time, while interviews show the importance of language support.",
    },
    learner_traps_vi: ["Đừng chỉ dùng however mà không so sánh thật.", "Đừng coi mọi nguồn mạnh như nhau."],
    learner_traps_en: ["Do not merely add however without real comparison.", "Do not treat all sources as equally strong."],
  },
  {
    id: "pa_c1_integration_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "final_qa",
    title_pa: "ਪੇਸ਼ਾਵਰ ਸੁਨੇਹੇ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "peshavar sunehe nu jorna",
    title_vi: "Tích hợp thư chuyên nghiệp",
    title_en: "Integrating professional correspondence",
    integration_goal_vi: "Dùng làm mẫu follow-up có bối cảnh, request và giọng tôn trọng.",
    integration_goal_en: "Use as a follow-up sample with context, request, and respectful tone.",
    sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਹਫਤੇ ਭੇਜੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ। ਕਿਸੇ ਵੀ ਛੋਟੀ ਅਪਡੇਟ ਲਈ ਧੰਨਵਾਦ।",
      rom: "main pichhle hafte bheje sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai. kise vi chhoti update lai dhanvad.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn đã gửi tuần trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo. Xin cảm ơn bất kỳ cập nhật ngắn nào.",
      en: "I am politely following up on the message sent last week. If possible, please let me know when the next step can be expected. Any brief update would be appreciated.",
    },
    final_evidence_vi: ["Có context.", "Có request cụ thể.", "Có closing lịch sự."],
    final_evidence_en: ["Context is present.", "Specific request is present.", "Polite closing is present."],
    final_qa_vi: ["Không trách móc.", "Không quá ngắn.", "Không dùng giọng chat."],
    final_qa_en: ["No blaming.", "Not too short.", "No chat-like tone."],
    canada_example: {
      context_vi: "Follow-up với văn phòng dịch vụ tại Canada.",
      context_en: "Follow-up with a service office in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੀ ਅਰਜ਼ੀ ਬਾਰੇ ਮੈਂ ਨਿਮਰਤਾ ਨਾਲ ਸਥਿਤੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
      rom: "Canada de daftar nu bheji arzi bare main nimarta nal sthiti puchhna chahunda han.",
      vi: "Về hồ sơ gửi văn phòng tại Canada, tôi muốn hỏi lịch sự về tình trạng.",
      en: "Regarding the application sent to the office in Canada, I would like to politely ask about the status.",
    },
    learner_traps_vi: ["Đừng viết như đang thúc ép.", "Đừng bỏ next step."],
    learner_traps_en: ["Do not sound pushy.", "Do not omit the next step."],
  },
  {
    id: "pa_c1_integration_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "integration_sample",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "karjakari sankhep nu jorna",
    title_vi: "Tích hợp executive summary",
    title_en: "Integrating executive summary",
    integration_goal_vi: "Dùng cho wiring cần issue, finding và recommendation ngắn.",
    integration_goal_en: "Use when wiring needs a concise issue, finding, and recommendation.",
    sample: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬ ਦੇ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਮੁੱਖ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ, ਪਰ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ। ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਪਹਿਲਾਂ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ।",
      rom: "mukh mudda seva di pahunch ate jawab de samen vichla farak hai. mukh natija ih hai ki mang vadhi hai, par samarthta use dar nal nahin vadhi. sifarash hai ki uch-jokham mamlian lai pahilan vakhri katar banai jave.",
      vi: "Vấn đề chính là khoảng cách giữa khả năng tiếp cận dịch vụ và thời gian phản hồi. Kết quả chính là nhu cầu tăng nhưng năng lực không tăng cùng tốc độ. Khuyến nghị tạo hàng riêng trước cho các trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The key finding is that demand has increased, but capacity has not grown at the same rate. The recommendation is to first create a separate queue for high-risk cases.",
    },
    final_evidence_vi: ["Có issue.", "Có finding.", "Có recommendation."],
    final_evidence_en: ["Issue is present.", "Finding is present.", "Recommendation is present."],
    final_qa_vi: ["Không quá chi tiết.", "Có action.", "Phù hợp người ra quyết định."],
    final_qa_en: ["Not too detailed.", "Has action.", "Fits a decision-maker."],
    canada_example: {
      context_vi: "Executive summary cho nhóm dịch vụ tại Canada.",
      context_en: "Executive summary for a service team in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਟੀਮ ਲਈ ਮੁੱਖ ਕਦਮ ਹੈ ਕਿ ਅਰਜ਼ੀਆਂ ਨੂੰ ਜੋਖਮ ਅਨੁਸਾਰ ਵੰਡਿਆ ਜਾਵੇ।",
      rom: "Canada vich seva team lai mukh kadam hai ki arzian nu jokham anusaar vandia jave.",
      vi: "Tại Canada, bước chính cho nhóm dịch vụ là phân loại hồ sơ theo rủi ro.",
      en: "In Canada, the main step for the service team is to sort applications by risk.",
    },
    learner_traps_vi: ["Đừng kể quá nhiều background.", "Đừng thiếu recommendation."],
    learner_traps_en: ["Do not narrate too much background.", "Do not omit the recommendation."],
  },
  {
    id: "pa_c1_integration_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "final_evidence",
    title_pa: "ਪ੍ਰਜ਼ੇਨਟੇਸ਼ਨ ਜਵਾਬ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "presentation jawab nu jorna",
    title_vi: "Tích hợp phản hồi thuyết trình",
    title_en: "Integrating presentation response",
    integration_goal_vi: "Dùng làm mẫu Q&A có acknowledgement, limitation và value.",
    integration_goal_en: "Use as a Q&A sample with acknowledgement, limitation, and value.",
    sample: {
      pa: "ਤੁਹਾਡਾ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਡਾਟਾ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਨਮੂਨਾ ਹਾਲੇ ਛੋਟਾ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਨਤੀਜੇ ਨੂੰ ਅੰਤਿਮ ਨਹੀਂ ਕਹਾਂਗਾ। ਫਿਰ ਵੀ, ਇਹ ਪੈਟਰਨ ਅਗਲੇ ਵੱਡੇ ਅਧਿਐਨ ਲਈ ਸਪਸ਼ਟ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "tuhada sawal mahatvapuran hai kyonki ih data di sima vall dhian divaunda hai. namuna hale chhota hai, is lai main natije nu antim nahin kahanga. phir vi, ih pattern agle vadde adhiyan lai spasht disha dinda hai.",
      vi: "Câu hỏi của bạn quan trọng vì nó chú ý đến giới hạn dữ liệu. Mẫu còn nhỏ nên tôi sẽ không gọi kết quả là cuối cùng. Tuy vậy, mô hình này đưa ra hướng rõ cho nghiên cứu lớn tiếp theo.",
      en: "Your question is important because it points to a data limitation. The sample is still small, so I would not call the finding final. Even so, the pattern gives a clear direction for the next larger study.",
    },
    final_evidence_vi: ["Công nhận câu hỏi.", "Nêu limitation.", "Giữ value của finding."],
    final_evidence_en: ["Question is acknowledged.", "Limitation is stated.", "Value of finding is preserved."],
    final_qa_vi: ["Không phòng thủ.", "Không phủ nhận limitation.", "Có hướng tiếp theo."],
    final_qa_en: ["Not defensive.", "Does not deny limitation.", "Has next direction."],
    canada_example: {
      context_vi: "Q&A nghiên cứu tại Canada.",
      context_en: "Research Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਨਮੂਨੇ ਵਿੱਚ ਛੋਟੇ ਸ਼ਹਿਰ ਘੱਟ ਹਨ, ਇਸ ਲਈ ਨਤੀਜੇ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de namune vich chhote shahir ghatt han, is lai natije nu savdhani nal parhna chahida hai.",
      vi: "Trong mẫu tại Canada, thành phố nhỏ còn ít, vì vậy kết quả nên được đọc thận trọng.",
      en: "In the Canadian sample, smaller cities are limited, so the finding should be read cautiously.",
    },
    learner_traps_vi: ["Đừng trả lời như đang bị tấn công.", "Đừng nói dữ liệu hoàn hảo."],
    learner_traps_en: ["Do not answer as if attacked.", "Do not claim the data is perfect."],
  },
  {
    id: "pa_c1_integration_public_professional_text",
    level: "C1",
    area: "public_professional_text_handling",
    mode: "final_qa",
    title_pa: "ਜਨਤਕ ਪੇਸ਼ਾਵਰ ਲਿਖਤ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "jantak peshavar likhat nu jorna",
    title_vi: "Tích hợp văn bản công/chuyên nghiệp",
    title_en: "Integrating public/professional text handling",
    integration_goal_vi: "Dùng làm mẫu thông báo rõ ai bị ảnh hưởng, thay đổi gì, bước tiếp theo và access support.",
    integration_goal_en: "Use as a notice sample showing who is affected, what changed, next step, and access support.",
    sample: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਲਾਗੂ ਹੋਵੇਗੀ। ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ ਦੀ ਮੀਟਿੰਗ ਪਹਿਲਾਂ ਹੀ ਬੁਕ ਹੈ, ਉਨ੍ਹਾਂ ਨੂੰ ਨਵਾਂ ਸਮਾਂ ਈਮੇਲ ਰਾਹੀਂ ਮਿਲੇਗਾ। ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਲਈ ਸੇਵਾ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "seva samen vich tabdili agle somvar ton lagu hovegi. jinhan lokan di meeting pahilan hi book hai, unha nu nava sama email rahin milega. bhasha sahaita lai seva kendar nal sampark kita ja sakda hai.",
      vi: "Thay đổi giờ dịch vụ sẽ có hiệu lực từ thứ Hai tới. Những người đã đặt lịch sẽ nhận giờ mới qua email. Có thể liên hệ trung tâm dịch vụ để được hỗ trợ ngôn ngữ.",
      en: "The service-hour change will take effect next Monday. People with existing appointments will receive a new time by email. The service centre can be contacted for language support.",
    },
    final_evidence_vi: ["Người bị ảnh hưởng rõ.", "Thay đổi rõ.", "Có hỗ trợ tiếp cận."],
    final_evidence_en: ["Affected people are clear.", "Change is clear.", "Access support is included."],
    final_qa_vi: ["Không dùng thuật ngữ nội bộ khó hiểu.", "Có next step.", "Giọng công bằng và chuyên nghiệp."],
    final_qa_en: ["No hard internal jargon.", "Next step is present.", "Tone is fair and professional."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công tại Canada.",
      context_en: "Public-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੀਂ ਸੇਵਾ ਜਾਣਕਾਰੀ ਲਈ ਵੈੱਬਸਾਈਟ ਅਤੇ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੋਵੇਂ ਸਪਸ਼ਟ ਦਿੱਤੇ ਜਾਣ।",
      rom: "Canada vich navi seva jankari lai website ate bhasha sahaita dovein spasht ditte jan.",
      vi: "Tại Canada, đối với thông tin dịch vụ mới, website và hỗ trợ ngôn ngữ đều nên được nêu rõ.",
      en: "In Canada, for new service information, both the website and language support should be stated clearly.",
    },
    learner_traps_vi: ["Đừng viết như memo nội bộ.", "Đừng quên người đọc cần làm gì tiếp theo."],
    learner_traps_en: ["Do not write it like an internal memo.", "Do not forget what the reader should do next."],
  },
];
