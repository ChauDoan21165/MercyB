// Punjabi C1 smoke deck for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiSmokeDeckSkillC1 =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "public_professional_text_task";

export type PunjabiSmokeDeckModeC1 = "smoke_check" | "final_qa" | "integration_readiness";

export type PunjabiSmokeDeckPhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiSmokeDeckItemC1 = {
  id: string;
  level: "C1";
  skill: PunjabiSmokeDeckSkillC1;
  mode: PunjabiSmokeDeckModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  task_prompt_vi: string;
  task_prompt_en: string;
  smoke_response: PunjabiSmokeDeckPhraseC1;
  pass_signals_vi: readonly string[];
  pass_signals_en: readonly string[];
  final_qa_vi: readonly string[];
  final_qa_en: readonly string[];
  canada_context: PunjabiSmokeDeckPhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const smokeDeckScriptAwarenessC1 = {
  vi: "Smoke deck này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải khóa học đầy đủ.",
  en: "This smoke deck uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi script, not as a full course.",
} as const;

export const smokeDeckC1: PunjabiSmokeDeckItemC1[] = [
  {
    id: "pa_c1_smoke_formal_writing",
    level: "C1",
    skill: "formal_writing",
    mode: "smoke_check",
    title_pa: "ਰਸਮੀ ਦਲੀਲ ਦੀ ਜਾਂਚ",
    title_rom: "rasmi dalil di janch",
    title_vi: "Smoke check lập luận trang trọng",
    title_en: "Formal argument smoke check",
    task_prompt_vi: "Viết một câu mở C1 nêu lập trường thận trọng về hỗ trợ học thuật.",
    task_prompt_en: "Write a C1 opening sentence giving a cautious position on academic support.",
    smoke_response: {
      pa: "ਉਪਲਬਧ ਸਬੂਤ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਅਕਾਦਮਿਕ ਸਹਾਇਤਾ ਤਦੋਂ ਵਧੇਰੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਹੋ ਸਕਦੀ ਹੈ ਜਦੋਂ ਇਹ ਭਾਸ਼ਾ ਅਤੇ ਸਲਾਹ ਨਾਲ ਜੁੜੀ ਹੋਵੇ।",
      rom: "uplabdh sabut darsaunde han ki academic sahaita tadon vadhere prabhavshali ho sakdi hai jadon ih bhasha ate salah nal judi hove.",
      vi: "Bằng chứng hiện có cho thấy hỗ trợ học thuật có thể hiệu quả hơn khi gắn với ngôn ngữ và tư vấn.",
      en: "Available evidence indicates that academic support may be more effective when connected with language and advising.",
    },
    pass_signals_vi: ["Có evidence làm cơ sở.", "Có hedge phù hợp.", "Register trang trọng."],
    pass_signals_en: ["Evidence is the basis.", "Hedging is appropriate.", "Register is formal."],
    final_qa_vi: ["Không dùng tôi nghĩ.", "Không nói chắc tuyệt đối.", "Có chủ đề rõ."],
    final_qa_en: ["No I think phrasing.", "No absolute certainty.", "Clear topic."],
    canada_context: {
      context_vi: "Lập luận trong bài viết về hỗ trợ sinh viên tại Canada.",
      context_en: "Argument in writing about student support in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਮਿਲੀ-ਜੁਲੀ ਸਹਾਇਤਾ ਫੈਸਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਬਣਾ ਸਕਦੀ ਹੈ।",
      rom: "Canada vich nave vidyarthian lai mili-juli sahaita faisle nu hor spasht bana sakdi hai.",
      vi: "Tại Canada, hỗ trợ kết hợp cho sinh viên mới có thể làm quyết định rõ hơn.",
      en: "In Canada, combined support for new students may make decisions clearer.",
    },
    learner_traps_vi: ["Đừng mở bằng câu quá chung.", "Đừng bỏ hedge khi dữ liệu chưa chắc."],
    learner_traps_en: ["Do not open with a generic sentence.", "Do not drop hedging when the data is not conclusive."],
  },
  {
    id: "pa_c1_smoke_source_summary",
    level: "C1",
    skill: "source_summary",
    mode: "final_qa",
    title_pa: "ਸਰੋਤ ਸਾਰ ਦੀ ਜਾਂਚ",
    title_rom: "sarot saar di janch",
    title_vi: "Smoke check tóm tắt nguồn",
    title_en: "Source summary smoke check",
    task_prompt_vi: "Tóm tắt claim và evidence của một nguồn trong hai câu.",
    task_prompt_en: "Summarize a source's claim and evidence in two sentences.",
    smoke_response: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਸੇਵਾ ਤੇ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਇਸ ਨੂੰ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਵਰਤੋਂਕਾਰ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ।",
      rom: "sarot da mukh daava hai ki spasht sama-rekha seva te bharosa vadha sakdi hai. lekhak is nu udik samen ate vartonkar feedback nal samarthan dinda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin vào dịch vụ. Tác giả hỗ trợ điều này bằng thời gian chờ và phản hồi người dùng.",
      en: "The source's main claim is that clear timelines can increase trust in a service. The writer supports this with wait times and user feedback.",
    },
    pass_signals_vi: ["Nguồn là chủ thể.", "Claim và evidence tách rõ.", "Không thêm ý kiến cá nhân."],
    pass_signals_en: ["The source remains the subject.", "Claim and evidence are clear.", "No personal opinion is added."],
    final_qa_vi: ["Không sao chép dài.", "Không phản biện trong summary.", "Có mức độ claim phù hợp."],
    final_qa_en: ["No long copying.", "No critique inside the summary.", "Claim strength is appropriate."],
    canada_context: {
      context_vi: "Tóm tắt nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Summarizing a source about community services in Canada.",
      pa: "ਸਰੋਤ ਕਹਿੰਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਬਹੁਭਾਸ਼ੀ ਜਾਣਕਾਰੀ ਸੇਵਾ ਪਹੁੰਚ ਨੂੰ ਸੁਧਾਰ ਸਕਦੀ ਹੈ।",
      rom: "sarot kahinda hai ki Canada vich bahubhashi jankari seva pahunch nu sudhar sakdi hai.",
      vi: "Nguồn nói rằng tại Canada, thông tin đa ngôn ngữ có thể cải thiện tiếp cận dịch vụ.",
      en: "The source states that in Canada, multilingual information can improve service access.",
    },
    learner_traps_vi: ["Đừng biến summary thành opinion.", "Đừng bỏ evidence."],
    learner_traps_en: ["Do not turn the summary into opinion.", "Do not omit evidence."],
  },
  {
    id: "pa_c1_smoke_cautious_claim",
    level: "C1",
    skill: "cautious_claim",
    mode: "integration_readiness",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵੇ ਦੀ ਜਾਂਚ",
    title_rom: "savdhan daave di janch",
    title_vi: "Smoke check claim thận trọng",
    title_en: "Cautious claim smoke check",
    task_prompt_vi: "Viết claim không quá chắc khi dữ liệu chỉ là pilot nhỏ.",
    task_prompt_en: "Write a claim that avoids overcertainty when the data is from a small pilot.",
    smoke_response: {
      pa: "ਛੋਟੇ ਪਾਇਲਟ ਦੇ ਨਤੀਜੇ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਉਡੀਕ ਘਟਾ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਨਮੂਨੇ ਨਾਲ ਹੋਰ ਸਮੀਖਿਆ ਜ਼ਰੂਰੀ ਹੈ।",
      rom: "chhote pilot de natije sujhaounde han ki navi prakiria udik ghata sakdi hai, par vadde namune nal hor samikhia zaruri hai.",
      vi: "Kết quả pilot nhỏ gợi ý quy trình mới có thể giảm thời gian chờ, nhưng cần rà soát thêm với mẫu lớn hơn.",
      en: "The small pilot suggests that the new process may reduce waiting, but further review with a larger sample is necessary.",
    },
    pass_signals_vi: ["Có may/có thể.", "Có limitation.", "Có next review."],
    pass_signals_en: ["Contains may.", "Includes a limitation.", "Includes further review."],
    final_qa_vi: ["Không dùng luôn luôn.", "Không kết luận vượt dữ liệu.", "Câu vẫn rõ dù có hedge."],
    final_qa_en: ["No always language.", "No conclusion beyond data.", "The sentence remains clear despite hedging."],
    canada_context: {
      context_vi: "Pilot quy trình tại một văn phòng ở Canada.",
      context_en: "Process pilot at an office in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਇਸ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ।",
      rom: "Canada de is pilot ton lagda hai ki online booking madadgar ho sakdi hai.",
      vi: "Từ pilot tại Canada này, có vẻ đặt lịch trực tuyến có thể hữu ích.",
      en: "This Canadian pilot suggests that online booking may be helpful.",
    },
    learner_traps_vi: ["Đừng hedge quá nhiều.", "Đừng dùng chắc chắn với mẫu nhỏ."],
    learner_traps_en: ["Do not over-hedge.", "Do not use certainty with a small sample."],
  },
  {
    id: "pa_c1_smoke_evidence_comparison",
    level: "C1",
    skill: "evidence_comparison",
    mode: "smoke_check",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ ਦੀ ਜਾਂਚ",
    title_rom: "sabut tulna di janch",
    title_vi: "Smoke check so sánh bằng chứng",
    title_en: "Evidence comparison smoke check",
    task_prompt_vi: "So sánh số liệu lớn với phỏng vấn nhỏ trong một đoạn ngắn.",
    task_prompt_en: "Compare large-scale figures with small interviews in a short paragraph.",
    smoke_response: {
      pa: "ਅੰਕੜੇ ਰੁਝਾਨ ਨੂੰ ਵਧੇਰੇ ਭਰੋਸੇਯੋਗ ਬਣਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਦੱਸਦੇ ਹਨ ਕਿ ਲੋਕ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦੇ ਹਨ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਫੈਸਲੇ ਲਈ ਗਿਣਤੀ ਅਤੇ ਅਨੁਭਵ ਦੋਹਾਂ ਦੀ ਲੋੜ ਦਿਖਾਉਂਦੇ ਹਨ।",
      rom: "ankre rujhan nu vadhere bharoseyog banaunde han, jadki interview dassde han ki lok prakiria nu kiven mahsus karde han. dovein mil ke faisle lai ginti ate anubhav dohan di lor dikhaunde han.",
      vi: "Số liệu làm xu hướng đáng tin hơn, trong khi phỏng vấn cho thấy người dùng cảm nhận quy trình ra sao. Cả hai cho thấy quyết định cần cả số lượng và trải nghiệm.",
      en: "The figures make the trend more reliable, while the interviews show how people experience the process. Together, they show that decisions need both numbers and experience.",
    },
    pass_signals_vi: ["Có tiêu chí so sánh.", "Nêu vai trò riêng của mỗi nguồn.", "Có synthesis."],
    pass_signals_en: ["A comparison criterion is present.", "Each source has a role.", "There is synthesis."],
    final_qa_vi: ["Không tóm tắt rời rạc.", "Không phóng đại interview nhỏ.", "Có kết luận tích hợp."],
    final_qa_en: ["No disconnected summaries.", "Small interviews are not overstated.", "Integrated conclusion is present."],
    canada_context: {
      context_vi: "So sánh evidence về dịch vụ công tại Canada.",
      context_en: "Comparing evidence about a public service in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਾਲੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਮਹੱਤਤਾ ਦਿਖਾਉਂਦੇ ਹਨ।",
      rom: "Canada vale ankre udik sama dikhaunde han, jadki interview bhasha sahaita di mahatta dikhaunde han.",
      vi: "Số liệu tại Canada cho thấy thời gian chờ, còn phỏng vấn cho thấy tầm quan trọng của hỗ trợ ngôn ngữ.",
      en: "The Canadian figures show wait times, while interviews show the importance of language support.",
    },
    learner_traps_vi: ["Đừng so sánh chỉ bằng however.", "Đừng coi mọi nguồn mạnh như nhau."],
    learner_traps_en: ["Do not compare only by adding however.", "Do not treat all sources as equally strong."],
  },
  {
    id: "pa_c1_smoke_professional_correspondence",
    level: "C1",
    skill: "professional_correspondence",
    mode: "final_qa",
    title_pa: "ਪੇਸ਼ਾਵਰ ਸੁਨੇਹੇ ਦੀ ਜਾਂਚ",
    title_rom: "peshavar sunehe di janch",
    title_vi: "Smoke check thư chuyên nghiệp",
    title_en: "Professional correspondence smoke check",
    task_prompt_vi: "Viết follow-up lịch sự có action rõ.",
    task_prompt_en: "Write a polite follow-up with a clear action.",
    smoke_response: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਹਫਤੇ ਭੇਜੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle hafte bheje sunehe bare nimar follow-up kar riha han. kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn đã gửi tuần trước. Vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the message sent last week. Please let me know when the next step can be expected.",
    },
    pass_signals_vi: ["Bối cảnh ngắn.", "Request rõ.", "Tone tôn trọng."],
    pass_signals_en: ["Brief context.", "Clear request.", "Respectful tone."],
    final_qa_vi: ["Không trách móc.", "Không quá dài.", "Có next step."],
    final_qa_en: ["No blaming.", "Not too long.", "Has next step."],
    canada_context: {
      context_vi: "Follow-up với văn phòng dịch vụ tại Canada.",
      context_en: "Follow-up with a service office in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੀ ਅਰਜ਼ੀ ਬਾਰੇ ਮੈਂ ਨਿਮਰਤਾ ਨਾਲ ਸਥਿਤੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
      rom: "Canada de daftar nu bheji arzi bare main nimarta nal sthiti puchhna chahunda han.",
      vi: "Về hồ sơ gửi văn phòng tại Canada, tôi muốn hỏi lịch sự về tình trạng.",
      en: "Regarding the application sent to the office in Canada, I would like to politely ask about the status.",
    },
    learner_traps_vi: ["Đừng viết như tin nhắn chat.", "Đừng dùng giọng bực bội."],
    learner_traps_en: ["Do not write like a chat message.", "Avoid irritated tone."],
  },
  {
    id: "pa_c1_smoke_executive_summary",
    level: "C1",
    skill: "executive_summary",
    mode: "integration_readiness",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ ਦੀ ਜਾਂਚ",
    title_rom: "karjakari sankhep di janch",
    title_vi: "Smoke check executive summary",
    title_en: "Executive summary smoke check",
    task_prompt_vi: "Viết summary có issue, finding, recommendation.",
    task_prompt_en: "Write a summary with issue, finding, and recommendation.",
    smoke_response: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬੀ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਨਤੀਜਾ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ, ਇਸ ਲਈ ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ।",
      rom: "mukh mudda seva pahunch ate jawabi samen vichla farak hai. natija dikhaunda hai ki mang vadhi hai, is lai sifarash hai ki uch-jokham mamlian lai vakhri katar banai jave.",
      vi: "Vấn đề chính là khoảng cách giữa tiếp cận dịch vụ và thời gian phản hồi. Kết quả cho thấy nhu cầu đã tăng, vì vậy khuyến nghị tạo hàng riêng cho trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The finding shows that demand has increased, so the recommendation is to create a separate queue for high-risk cases.",
    },
    pass_signals_vi: ["Có issue.", "Có finding.", "Có recommendation."],
    pass_signals_en: ["Has issue.", "Has finding.", "Has recommendation."],
    final_qa_vi: ["Không quá nhiều background.", "Có action.", "Có người đọc quyết định."],
    final_qa_en: ["Not too much background.", "Contains action.", "Decision-maker audience is clear."],
    canada_context: {
      context_vi: "Executive summary cho nhóm chương trình tại Canada.",
      context_en: "Executive summary for a program team in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਟੀਮ ਲਈ ਮੁੱਖ ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉਡੀਕ ਘਟਾਉਣ ਲਈ triage ਕਦਮ ਤੁਰੰਤ ਲਿਆ ਜਾਵੇ।",
      rom: "Canada vich team lai mukh sifarash hai ki udik ghataun lai triage kadam turant lia jave.",
      vi: "Tại Canada, khuyến nghị chính cho nhóm là thực hiện bước phân loại ngay để giảm thời gian chờ.",
      en: "In Canada, the main recommendation for the team is to take an immediate triage step to reduce wait time.",
    },
    learner_traps_vi: ["Đừng kể hết history.", "Đừng thiếu recommendation."],
    learner_traps_en: ["Do not narrate all history.", "Do not omit the recommendation."],
  },
  {
    id: "pa_c1_smoke_presentation_response",
    level: "C1",
    skill: "presentation_response",
    mode: "smoke_check",
    title_pa: "ਪ੍ਰਜ਼ੇਨਟੇਸ਼ਨ ਜਵਾਬ ਦੀ ਜਾਂਚ",
    title_rom: "presentation jawab di janch",
    title_vi: "Smoke check phản hồi thuyết trình",
    title_en: "Presentation response smoke check",
    task_prompt_vi: "Trả lời câu hỏi khó bằng cách công nhận giới hạn và giữ claim.",
    task_prompt_en: "Answer a difficult question by acknowledging a limitation while keeping the claim.",
    smoke_response: {
      pa: "ਤੁਹਾਡਾ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਨਮੂਨੇ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਮੇਰਾ ਨਤੀਜਾ ਅੰਤਿਮ ਨਹੀਂ, ਪਰ ਇਹ ਅਗਲੇ ਵੱਡੇ ਅਧਿਐਨ ਲਈ ਸਪਸ਼ਟ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "tuhada sawal mahatvapuran hai kyonki ih namune di sima vall dhian divaunda hai. mera natija antim nahin, par ih agle vadde adhian lai spasht disha dinda hai.",
      vi: "Câu hỏi của anh/chị quan trọng vì nó nhấn mạnh giới hạn mẫu. Kết quả của tôi chưa phải kết luận cuối cùng, nhưng nó đưa ra hướng rõ cho nghiên cứu lớn hơn tiếp theo.",
      en: "Your question is important because it points to the sample limitation. My finding is not final, but it gives a clear direction for the next larger study.",
    },
    pass_signals_vi: ["Công nhận câu hỏi.", "Nêu limitation.", "Giữ contribution."],
    pass_signals_en: ["Acknowledges the question.", "States limitation.", "Keeps contribution."],
    final_qa_vi: ["Không phòng thủ.", "Không phủ nhận toàn bộ bài.", "Có next research direction."],
    final_qa_en: ["Not defensive.", "Does not cancel the whole presentation.", "Has next research direction."],
    canada_context: {
      context_vi: "Phản hồi câu hỏi sau bài trình bày tại Canada.",
      context_en: "Responding to a question after a presentation in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਾਲੇ ਡਾਟਾ ਦੀ ਸੀਮਾ ਹੈ, ਪਰ ਇਹ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਬਾਰੇ ਅਗਲਾ ਸਵਾਲ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ।",
      rom: "Canada vale data di sima hai, par ih bhasha sahaita bare agla sawal spasht karda hai.",
      vi: "Dữ liệu tại Canada có giới hạn, nhưng nó làm rõ câu hỏi tiếp theo về hỗ trợ ngôn ngữ.",
      en: "The Canadian data has a limitation, but it clarifies the next question about language support.",
    },
    learner_traps_vi: ["Đừng trả lời phòng thủ.", "Đừng nói dữ liệu chứng minh mọi thứ."],
    learner_traps_en: ["Do not answer defensively.", "Do not say the data proves everything."],
  },
  {
    id: "pa_c1_smoke_public_professional_text",
    level: "C1",
    skill: "public_professional_text_task",
    mode: "final_qa",
    title_pa: "ਜਨਤਕ-ਪੇਸ਼ਾਵਰ ਪਾਠ ਦੀ ਜਾਂਚ",
    title_rom: "jantak-peshavar path di janch",
    title_vi: "Smoke check văn bản công/chuyên nghiệp",
    title_en: "Public/professional text smoke check",
    task_prompt_vi: "Viết thông báo ngắn, rõ, dễ hiểu cho người dùng dịch vụ.",
    task_prompt_en: "Write a short, clear, accessible notice for service users.",
    smoke_response: {
      pa: "ਸੇਵਾ ਸਮਾਂ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਬਦਲੇਗਾ। ਜੇ ਤੁਹਾਨੂੰ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਫਤਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      rom: "seva sama agle somvar ton badlega. je tuhanu bhasha sahaita chahidi hai, kirpa karke mukh daftar nal sampark karo.",
      vi: "Thời gian dịch vụ sẽ thay đổi từ thứ Hai tới. Nếu anh/chị cần hỗ trợ ngôn ngữ, vui lòng liên hệ văn phòng chính.",
      en: "Service hours will change starting next Monday. If you need language support, please contact the main office.",
    },
    pass_signals_vi: ["Thông tin chính trước.", "Action rõ.", "Ngôn ngữ dễ hiểu."],
    pass_signals_en: ["Main information first.", "Clear action.", "Accessible language."],
    final_qa_vi: ["Không dùng thuật ngữ nội bộ.", "Có ngày hoặc mốc.", "Có contact/action."],
    final_qa_en: ["No internal jargon.", "Has a date or timeline.", "Has contact/action."],
    canada_context: {
      context_vi: "Thông báo dịch vụ cộng đồng tại Canada.",
      context_en: "Community-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਦਫਤਰ ਅਗਲੇ ਹਫਤੇ ਨਵਾਂ ਸਮਾਂ-ਪੱਤਰ ਲਾਗੂ ਕਰੇਗਾ।",
      rom: "Canada vich community daftar agle hafte nava sama-pattar lagu karega.",
      vi: "Tại Canada, văn phòng cộng đồng sẽ áp dụng lịch mới vào tuần tới.",
      en: "In Canada, the community office will apply a new schedule next week.",
    },
    learner_traps_vi: ["Đừng viết quá hành chính.", "Đừng quên người đọc cần biết phải làm gì."],
    learner_traps_en: ["Do not make it overly bureaucratic.", "Do not forget that the reader needs to know what to do."],
  },
];
