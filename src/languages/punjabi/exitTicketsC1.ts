// Punjabi C1 exit tickets for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiExitTicketAreaC1 =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "public_professional_text_handling";

export type PunjabiExitTicketModeC1 = "exit_ticket" | "final_proof" | "final_qa";

export type PunjabiExitTicketPhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiExitTicketC1 = {
  id: string;
  level: "C1";
  area: PunjabiExitTicketAreaC1;
  mode: PunjabiExitTicketModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  prompt_vi: string;
  prompt_en: string;
  expected_response: PunjabiExitTicketPhraseC1;
  pass_criteria_vi: readonly string[];
  pass_criteria_en: readonly string[];
  final_proof_vi: readonly string[];
  final_proof_en: readonly string[];
  canada_example: PunjabiExitTicketPhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const exitTicketsScriptAwarenessC1 = {
  vi: "Các exit ticket này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải khóa học đầy đủ.",
  en: "These exit tickets use Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi script, not as a full course.",
} as const;

export const exitTicketsC1: PunjabiExitTicketC1[] = [
  {
    id: "pa_c1_exit_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "exit_ticket",
    title_pa: "ਰਸਮੀ ਲਿਖਤ ਐਗਜ਼ਿਟ ਟਿਕਟ",
    title_rom: "rasmi likhat exit ticket",
    title_vi: "Exit ticket viết trang trọng",
    title_en: "Formal writing exit ticket",
    prompt_vi: "Trong hai câu, nêu lập trường có điều kiện về hỗ trợ học thuật.",
    prompt_en: "In two sentences, state a qualified position on academic support.",
    expected_response: {
      pa: "ਮੌਜੂਦਾ ਸਬੂਤ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਅਕਾਦਮਿਕ ਸਹਾਇਤਾ ਨੂੰ ਭਾਸ਼ਾ ਅਤੇ ਸਲਾਹ ਨਾਲ ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ। ਫਿਰ ਵੀ, ਇਸ ਨੀਤੀ ਨੂੰ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਵੱਖ-ਵੱਖ ਲੋੜਾਂ ਦੀ ਸਮੀਖਿਆ ਜ਼ਰੂਰੀ ਹੈ।",
      rom: "maujuda sabut darsaunde han ki academic sahaita nu bhasha ate salah nal jorna chahida hai. phir vi, is niti nu lagu karan ton pahilan vidyarthian di vakh-vakh loran di samikhia zaruri hai.",
      vi: "Bằng chứng hiện có cho thấy hỗ trợ học thuật nên gắn với ngôn ngữ và tư vấn. Tuy vậy, trước khi triển khai chính sách này, cần rà soát các nhu cầu khác nhau của sinh viên.",
      en: "Current evidence indicates that academic support should connect with language and advising. However, before implementing this policy, students' varied needs must be reviewed.",
    },
    pass_criteria_vi: ["Có claim rõ.", "Có qualification.", "Register trang trọng."],
    pass_criteria_en: ["Clear claim.", "Qualification is present.", "Formal register."],
    final_proof_vi: ["Không dùng tôi nghĩ.", "Không overclaim.", "Có evidence phrase."],
    final_proof_en: ["No I think phrasing.", "No overclaiming.", "Evidence phrase is present."],
    canada_example: {
      context_vi: "Exit ticket về hỗ trợ sinh viên tại Canada.",
      context_en: "Exit ticket about student support in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਭਾਸ਼ਾ ਅਤੇ ਸਲਾਹ ਦੀ ਮਿਲੀ ਸਹਾਇਤਾ ਅਕਾਦਮਿਕ ਫੈਸਲੇ ਨੂੰ ਸਪਸ਼ਟ ਕਰ ਸਕਦੀ ਹੈ।",
      rom: "Canada vich nave vidyarthian lai bhasha ate salah di mili sahaita academic faisle nu spasht kar sakdi hai.",
      vi: "Tại Canada, hỗ trợ kết hợp ngôn ngữ và tư vấn cho sinh viên mới có thể làm rõ quyết định học thuật.",
      en: "In Canada, combined language and advising support for new students can clarify academic decisions.",
    },
    learner_traps_vi: ["Đừng mở quá chung.", "Đừng bỏ qualification nếu evidence còn hạn chế."],
    learner_traps_en: ["Do not open too generally.", "Do not omit qualification when evidence is limited."],
  },
  {
    id: "pa_c1_exit_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "final_proof",
    title_pa: "ਸਰੋਤ ਸਾਰ ਐਗਜ਼ਿਟ ਟਿਕਟ",
    title_rom: "sarot saar exit ticket",
    title_vi: "Exit ticket tóm tắt nguồn",
    title_en: "Source summary exit ticket",
    prompt_vi: "Tóm tắt claim và evidence của nguồn mà không thêm ý kiến cá nhân.",
    prompt_en: "Summarize the source's claim and evidence without adding personal opinion.",
    expected_response: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਸੇਵਾ ਤੇ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਇਸ ਦਾਅਵੇ ਨੂੰ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਵਰਤੋਂਕਾਰ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ।",
      rom: "sarot da mukh daava hai ki spasht sama-rekha seva te bharosa vadha sakdi hai. lekhak is daave nu udik samen ate vartonkar feedback nal samarthan dinda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin vào dịch vụ. Tác giả hỗ trợ claim này bằng thời gian chờ và phản hồi người dùng.",
      en: "The source's main claim is that clear timelines can increase trust in a service. The writer supports this claim with wait times and user feedback.",
    },
    pass_criteria_vi: ["Source là chủ thể.", "Có claim.", "Có evidence."],
    pass_criteria_en: ["Source is the subject.", "Claim is present.", "Evidence is present."],
    final_proof_vi: ["Không thêm opinion.", "Không sao chép dài.", "Có mức độ claim phù hợp."],
    final_proof_en: ["No added opinion.", "No long copying.", "Claim strength is appropriate."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਸਰੋਤ ਕਹਿੰਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਬਹੁਭਾਸ਼ੀ ਜਾਣਕਾਰੀ ਸੇਵਾ ਪਹੁੰਚ ਨੂੰ ਸੁਧਾਰ ਸਕਦੀ ਹੈ।",
      rom: "sarot kahinda hai ki Canada vich bahubhashi jankari seva pahunch nu sudhar sakdi hai.",
      vi: "Nguồn nói rằng tại Canada, thông tin đa ngôn ngữ có thể cải thiện tiếp cận dịch vụ.",
      en: "The source says that in Canada, multilingual information can improve service access.",
    },
    learner_traps_vi: ["Đừng viết phản ứng cá nhân.", "Đừng bỏ bằng chứng chính."],
    learner_traps_en: ["Do not write a personal reaction.", "Do not omit the main evidence."],
  },
  {
    id: "pa_c1_exit_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "final_qa",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ ਐਗਜ਼ਿਟ ਟਿਕਟ",
    title_rom: "savdhan daava exit ticket",
    title_vi: "Exit ticket claim thận trọng",
    title_en: "Cautious claim exit ticket",
    prompt_vi: "Viết claim về pilot nhỏ, có hedge và limitation.",
    prompt_en: "Write a claim about a small pilot with hedging and limitation.",
    expected_response: {
      pa: "ਛੋਟੇ ਪਾਇਲਟ ਦੇ ਨਤੀਜੇ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਉਡੀਕ ਘਟਾ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਨਮੂਨੇ ਨਾਲ ਹੋਰ ਪੁਸ਼ਟੀ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "chhote pilot de natije sujhaounde han ki navi prakiria udik ghata sakdi hai, par vadde namune nal hor pushti lorindi hai.",
      vi: "Kết quả pilot nhỏ gợi ý quy trình mới có thể giảm thời gian chờ, nhưng cần xác nhận thêm với mẫu lớn hơn.",
      en: "The small pilot suggests that the new process may reduce waiting, but further confirmation with a larger sample is needed.",
    },
    pass_criteria_vi: ["Có hedge.", "Có limitation.", "Claim vẫn rõ."],
    pass_criteria_en: ["Hedging is present.", "Limitation is present.", "Claim remains clear."],
    final_proof_vi: ["Không dùng chắc chắn.", "Không vượt dữ liệu.", "Không hedge quá mức."],
    final_proof_en: ["No certainty language.", "Does not exceed data.", "No excessive hedging."],
    canada_example: {
      context_vi: "Pilot quy trình tại Canada.",
      context_en: "Process pilot in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਇਸ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਨਤੀਜੇ ਹਾਲੇ ਸੀਮਿਤ ਹਨ।",
      rom: "Canada de is pilot ton lagda hai ki online booking madadgar ho sakdi hai, par natije hale simit han.",
      vi: "Từ pilot tại Canada này, có vẻ đặt lịch trực tuyến có thể hữu ích, nhưng kết quả vẫn còn giới hạn.",
      en: "This Canadian pilot suggests that online booking may be helpful, but the results remain limited.",
    },
    learner_traps_vi: ["Đừng nói chắc từ dữ liệu nhỏ.", "Đừng làm claim mơ hồ đến mức mất ý."],
    learner_traps_en: ["Do not claim certainty from small data.", "Do not make the claim so vague that it loses meaning."],
  },
  {
    id: "pa_c1_exit_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "exit_ticket",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ ਐਗਜ਼ਿਟ ਟਿਕਟ",
    title_rom: "sabut tulna exit ticket",
    title_vi: "Exit ticket so sánh evidence",
    title_en: "Evidence comparison exit ticket",
    prompt_vi: "So sánh nguồn số liệu lớn với phỏng vấn nhỏ trong hai câu.",
    prompt_en: "Compare a large-data source with small interviews in two sentences.",
    expected_response: {
      pa: "ਵੱਡੇ ਅੰਕੜੇ ਰੁਝਾਨ ਨੂੰ ਵਧੇਰੇ ਭਰੋਸੇਯੋਗ ਬਣਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਛੋਟੇ ਇੰਟਰਵਿਊ ਲੋਕਾਂ ਦੇ ਅਨੁਭਵ ਦੀ ਗਹਿਰਾਈ ਦਿੰਦੇ ਹਨ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਦਿਖਾਉਂਦੇ ਹਨ ਕਿ ਫੈਸਲੇ ਵਿੱਚ ਗਿਣਤੀ ਅਤੇ ਅਨੁਭਵ ਦੋਹਾਂ ਦੀ ਲੋੜ ਹੈ।",
      rom: "vadde ankre rujhan nu vadhere bharoseyog banaunde han, jadki chhote interview lokan de anubhav di gahirai dinde han. dovein mil ke dikhaunde han ki faisle vich ginti ate anubhav dohan di lor hai.",
      vi: "Số liệu lớn làm xu hướng đáng tin hơn, còn phỏng vấn nhỏ cho chiều sâu về trải nghiệm người dùng. Cả hai cùng cho thấy quyết định cần cả số lượng và trải nghiệm.",
      en: "Large figures make the trend more reliable, while small interviews provide depth about user experience. Together, they show that decisions need both numbers and experience.",
    },
    pass_criteria_vi: ["Có tiêu chí so sánh.", "Có vai trò của mỗi nguồn.", "Có synthesis."],
    pass_criteria_en: ["Comparison criterion is present.", "Each source has a role.", "Synthesis is present."],
    final_proof_vi: ["Không tóm tắt rời.", "Không phóng đại interview.", "Có conclusion tích hợp."],
    final_proof_en: ["No disconnected summaries.", "Interviews are not overstated.", "Integrated conclusion is present."],
    canada_example: {
      context_vi: "So sánh evidence dịch vụ tại Canada.",
      context_en: "Comparing service evidence in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਸਪਸ਼ਟ ਕਰਦੇ ਹਨ।",
      rom: "Canada de ankre udik sama dikhaunde han, jadki interview bhasha sahaita di lor spasht karde han.",
      vi: "Số liệu tại Canada cho thấy thời gian chờ, còn phỏng vấn làm rõ nhu cầu hỗ trợ ngôn ngữ.",
      en: "The Canadian figures show wait time, while interviews clarify the need for language support.",
    },
    learner_traps_vi: ["Đừng chỉ nối bằng however.", "Đừng coi mọi nguồn mạnh như nhau."],
    learner_traps_en: ["Do not just connect with however.", "Do not treat every source as equally strong."],
  },
  {
    id: "pa_c1_exit_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "final_proof",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ ਐਗਜ਼ਿਟ ਟਿਕਟ",
    title_rom: "peshavar pattarchar exit ticket",
    title_vi: "Exit ticket thư chuyên nghiệp",
    title_en: "Professional correspondence exit ticket",
    prompt_vi: "Viết follow-up lịch sự, có context và requested next step.",
    prompt_en: "Write a polite follow-up with context and requested next step.",
    expected_response: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਹਫਤੇ ਭੇਜੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle hafte bheje sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn đã gửi tuần trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the message sent last week. If possible, please let me know when the next step can be expected.",
    },
    pass_criteria_vi: ["Có context.", "Có request.", "Tone tôn trọng."],
    pass_criteria_en: ["Context is present.", "Request is present.", "Tone is respectful."],
    final_proof_vi: ["Không trách móc.", "Không quá ngắn.", "Có action rõ."],
    final_proof_en: ["No blaming.", "Not too short.", "Clear action."],
    canada_example: {
      context_vi: "Follow-up với văn phòng dịch vụ tại Canada.",
      context_en: "Follow-up with a service office in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੀ ਅਰਜ਼ੀ ਬਾਰੇ ਮੈਂ ਨਿਮਰਤਾ ਨਾਲ ਸਥਿਤੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
      rom: "Canada de daftar nu bheji arzi bare main nimarta nal sthiti puchhna chahunda han.",
      vi: "Về hồ sơ gửi văn phòng tại Canada, tôi muốn hỏi lịch sự về tình trạng.",
      en: "Regarding the application sent to the office in Canada, I would like to politely ask about the status.",
    },
    learner_traps_vi: ["Đừng dùng giọng chat.", "Đừng gây áp lực quá mức."],
    learner_traps_en: ["Do not use chat-like tone.", "Do not apply excessive pressure."],
  },
  {
    id: "pa_c1_exit_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "exit_ticket",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ ਐਗਜ਼ਿਟ ਟਿਕਟ",
    title_rom: "karjakari sankhep exit ticket",
    title_vi: "Exit ticket executive summary",
    title_en: "Executive summary exit ticket",
    prompt_vi: "Viết một executive summary có issue, finding, recommendation.",
    prompt_en: "Write an executive summary with issue, finding, and recommendation.",
    expected_response: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬੀ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਨਤੀਜਾ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ, ਇਸ ਲਈ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਉਣ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
      rom: "mukh mudda seva pahunch ate jawabi samen vichla farak hai. natija dikhaunda hai ki mang vadhi hai, is lai uch-jokham mamlian lai vakhri katar banaun di sifarash kiti jandi hai.",
      vi: "Vấn đề chính là khoảng cách giữa tiếp cận dịch vụ và thời gian phản hồi. Kết quả cho thấy nhu cầu tăng, vì vậy khuyến nghị tạo hàng riêng cho trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The finding shows that demand has increased, so a separate queue for high-risk cases is recommended.",
    },
    pass_criteria_vi: ["Có issue.", "Có finding.", "Có recommendation."],
    pass_criteria_en: ["Issue is present.", "Finding is present.", "Recommendation is present."],
    final_proof_vi: ["Không quá nhiều background.", "Có action.", "Phù hợp người ra quyết định."],
    final_proof_en: ["Not too much background.", "Action is present.", "Fits a decision-maker."],
    canada_example: {
      context_vi: "Summary cho nhóm chương trình tại Canada.",
      context_en: "Summary for a program team in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਟੀਮ ਲਈ ਮੁੱਖ ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉਡੀਕ ਘਟਾਉਣ ਲਈ triage ਕਦਮ ਤੁਰੰਤ ਲਿਆ ਜਾਵੇ।",
      rom: "Canada vich team lai mukh sifarash hai ki udik ghataun lai triage kadam turant lia jave.",
      vi: "Tại Canada, khuyến nghị chính cho nhóm là thực hiện bước phân loại ngay để giảm thời gian chờ.",
      en: "In Canada, the main recommendation for the team is to take an immediate triage step to reduce wait time.",
    },
    learner_traps_vi: ["Đừng kể hết history.", "Đừng thiếu recommendation."],
    learner_traps_en: ["Do not narrate all history.", "Do not omit the recommendation."],
  },
  {
    id: "pa_c1_exit_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "final_qa",
    title_pa: "ਪ੍ਰਜ਼ੇਨਟੇਸ਼ਨ ਜਵਾਬ ਐਗਜ਼ਿਟ ਟਿਕਟ",
    title_rom: "presentation jawab exit ticket",
    title_vi: "Exit ticket phản hồi thuyết trình",
    title_en: "Presentation response exit ticket",
    prompt_vi: "Trả lời câu hỏi khó bằng cách công nhận limitation và giữ contribution.",
    prompt_en: "Answer a difficult question by acknowledging a limitation and keeping the contribution.",
    expected_response: {
      pa: "ਤੁਹਾਡਾ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਨਮੂਨੇ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਮੇਰਾ ਨਤੀਜਾ ਅੰਤਿਮ ਨਹੀਂ, ਪਰ ਇਹ ਅਗਲੇ ਵੱਡੇ ਅਧਿਐਨ ਲਈ ਸਪਸ਼ਟ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "tuhada sawal mahatvapuran hai kyonki ih namune di sima vall dhian divaunda hai. mera natija antim nahin, par ih agle vadde adhian lai spasht disha dinda hai.",
      vi: "Câu hỏi của anh/chị quan trọng vì nó nhấn mạnh giới hạn mẫu. Kết quả của tôi chưa phải kết luận cuối cùng, nhưng nó đưa ra hướng rõ cho nghiên cứu lớn hơn tiếp theo.",
      en: "Your question is important because it points to the sample limitation. My finding is not final, but it gives a clear direction for the next larger study.",
    },
    pass_criteria_vi: ["Công nhận câu hỏi.", "Nêu limitation.", "Giữ contribution."],
    pass_criteria_en: ["Question is acknowledged.", "Limitation is named.", "Contribution remains."],
    final_proof_vi: ["Không phòng thủ.", "Không phủ định toàn bộ bài.", "Có next research direction."],
    final_proof_en: ["Not defensive.", "Does not cancel the whole presentation.", "Has next research direction."],
    canada_example: {
      context_vi: "Q&A sau thuyết trình tại Canada.",
      context_en: "Q&A after a presentation in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਾਲੇ ਡਾਟਾ ਦੀ ਸੀਮਾ ਹੈ, ਪਰ ਇਹ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਬਾਰੇ ਅਗਲਾ ਸਵਾਲ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ।",
      rom: "Canada vale data di sima hai, par ih bhasha sahaita bare agla sawal spasht karda hai.",
      vi: "Dữ liệu tại Canada có giới hạn, nhưng nó làm rõ câu hỏi tiếp theo về hỗ trợ ngôn ngữ.",
      en: "The Canadian data has a limitation, but it clarifies the next question about language support.",
    },
    learner_traps_vi: ["Đừng trả lời phòng thủ.", "Đừng claim dữ liệu chứng minh mọi thứ."],
    learner_traps_en: ["Do not answer defensively.", "Do not claim the data proves everything."],
  },
  {
    id: "pa_c1_exit_public_professional_text",
    level: "C1",
    area: "public_professional_text_handling",
    mode: "final_proof",
    title_pa: "ਜਨਤਕ-ਪੇਸ਼ਾਵਰ ਪਾਠ ਐਗਜ਼ਿਟ ਟਿਕਟ",
    title_rom: "jantak-peshavar path exit ticket",
    title_vi: "Exit ticket văn bản công/chuyên nghiệp",
    title_en: "Public/professional text exit ticket",
    prompt_vi: "Viết thông báo ngắn, rõ, có timeline và action.",
    prompt_en: "Write a short clear notice with timeline and action.",
    expected_response: {
      pa: "ਸੇਵਾ ਸਮਾਂ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਬਦਲੇਗਾ। ਜੇ ਤੁਹਾਨੂੰ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਫਤਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      rom: "seva sama agle somvar ton badlega. je tuhanu bhasha sahaita chahidi hai, kirpa karke mukh daftar nal sampark karo.",
      vi: "Thời gian dịch vụ sẽ thay đổi từ thứ Hai tới. Nếu anh/chị cần hỗ trợ ngôn ngữ, vui lòng liên hệ văn phòng chính.",
      en: "Service hours will change starting next Monday. If you need language support, please contact the main office.",
    },
    pass_criteria_vi: ["Thông tin chính trước.", "Có timeline.", "Có action."],
    pass_criteria_en: ["Main information first.", "Timeline is present.", "Action is present."],
    final_proof_vi: ["Không dùng thuật ngữ nội bộ.", "Dễ hiểu cho người dùng dịch vụ.", "Có contact hoặc next step."],
    final_proof_en: ["No internal jargon.", "Accessible for service users.", "Has contact or next step."],
    canada_example: {
      context_vi: "Thông báo dịch vụ cộng đồng tại Canada.",
      context_en: "Community-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਦਫਤਰ ਅਗਲੇ ਹਫਤੇ ਨਵਾਂ ਸਮਾਂ-ਪੱਤਰ ਲਾਗੂ ਕਰੇਗਾ।",
      rom: "Canada vich community daftar agle hafte nava sama-pattar lagu karega.",
      vi: "Tại Canada, văn phòng cộng đồng sẽ áp dụng lịch mới vào tuần tới.",
      en: "In Canada, the community office will apply a new schedule next week.",
    },
    learner_traps_vi: ["Đừng viết quá hành chính.", "Đừng quên người đọc cần biết phải làm gì."],
    learner_traps_en: ["Do not write too bureaucratically.", "Do not forget that the reader needs to know what to do."],
  },
];
