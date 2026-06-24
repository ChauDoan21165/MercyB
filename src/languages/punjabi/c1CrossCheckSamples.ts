// Punjabi C1 cross-check samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1CrossCheckArea =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary";

export type PunjabiC1CrossCheckMode = "cross_check" | "verification" | "pre_integration";

export type PunjabiC1CrossCheckPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1CrossCheckSample = {
  id: string;
  level: "C1";
  area: PunjabiC1CrossCheckArea;
  mode: PunjabiC1CrossCheckMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  check_prompt_vi: string;
  check_prompt_en: string;
  sample: PunjabiC1CrossCheckPhrase;
  coherence_checks_vi: readonly string[];
  coherence_checks_en: readonly string[];
  verification_steps_vi: readonly string[];
  verification_steps_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_context: PunjabiC1CrossCheckPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1CrossCheckSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1CrossCheckSamples: PunjabiC1CrossCheckSample[] = [
  {
    id: "pa_c1_crosscheck_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "cross_check",
    title_pa: "ਰਸਮੀ ਲਿਖਤ cross-check",
    title_rom: "rasmi likhat cross-check",
    title_vi: "Cross-check văn phong trang trọng",
    title_en: "Formal writing cross-check",
    check_prompt_vi: "Kiểm tra câu mở đầu có trang trọng, thận trọng và nhất quán với register học thuật không.",
    check_prompt_en: "Check whether the opening stays formal, cautious, and consistent with academic register.",
    sample: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ ਇਹ ਕਿਹਾ ਜਾ ਸਕਦਾ ਹੈ ਕਿ ਨਤੀਜਾ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਪਰ ਇਸ ਦੀ ਵਿਆਖਿਆ ਸਾਵਧਾਨੀ ਨਾਲ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
      rom: "uplabdh jankari de adhar te ih keha ja sakda hai ki natija mahatvapuran hai, par is di viakhia savdhani nal honi chahidi hai.",
      vi: "Dựa trên thông tin hiện có, có thể nói kết quả quan trọng, nhưng việc diễn giải cần thận trọng.",
      en: "Based on the available information, the result can be considered important, but it should be interpreted cautiously.",
    },
    coherence_checks_vi: ["Giữ register học thuật.", "Hedge không làm yếu ý chính.", "Không chuyển sang giọng chat."],
    coherence_checks_en: ["Keeps academic register.", "Hedging does not weaken the main point.", "Does not shift into chat tone."],
    verification_steps_vi: ["Tìm claim chính.", "Kiểm tra giới hạn dữ liệu.", "So với tone của phần kết luận."],
    verification_steps_en: ["Find the main claim.", "Check the data limit.", "Compare with the conclusion tone."],
    pre_integration_notes_vi: ["Dùng được trong lesson về report.", "Không cần audio.", "Không có claim thời sự."],
    pre_integration_notes_en: ["Usable in a report lesson.", "No audio needed.", "No current-news claim."],
    canada_context: {
      context_vi: "Báo cáo dịch vụ cộng đồng tại Canada.",
      context_en: "Community service report in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਸੇਵਾ ਰਿਪੋਰਟ ਵਿੱਚ ਇਹ ਲਹਿਜ਼ਾ ਸੰਤੁਲਿਤ ਅਤੇ ਪੇਸ਼ਾਵਰ ਲੱਗਦਾ ਹੈ।",
      rom: "Canada di seva report vich ih lehja santulit ate peshavar lagda hai.",
      vi: "Trong báo cáo dịch vụ ở Canada, giọng này cân bằng và chuyên nghiệp.",
      en: "In a Canadian service report, this tone sounds balanced and professional.",
    },
    learner_traps_vi: ["Đừng dùng câu quá tuyệt đối.", "Đừng thêm cảm xúc cá nhân vào văn bản trang trọng."],
    learner_traps_en: ["Do not use overly absolute wording.", "Do not add personal emotion to formal text."],
  },
  {
    id: "pa_c1_crosscheck_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "verification",
    title_pa: "ਸਰੋਤ ਸਾਰ verification",
    title_rom: "sarot saar verification",
    title_vi: "Verification tóm tắt nguồn",
    title_en: "Source summary verification",
    check_prompt_vi: "Kiểm tra summary có giữ claim, evidence và voice của nguồn mà không thêm bình luận không.",
    check_prompt_en: "Verify that the summary keeps the source claim, evidence, and voice without adding commentary.",
    sample: {
      pa: "ਸਰੋਤ ਮੁੱਖ ਤੌਰ ਤੇ ਦੱਸਦਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ; ਇਸ ਲਈ ਉਹ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਫੀਡਬੈਕ ਦਾ ਹਵਾਲਾ ਦਿੰਦਾ ਹੈ।",
      rom: "sarot mukh taur te dassda hai ki spasht sama-rekha bharosa vadha sakdi hai; is lai oh udik samen ate feedback da havala dinda hai.",
      vi: "Nguồn chủ yếu nói rằng timeline rõ có thể tăng niềm tin; để hỗ trợ, nguồn dẫn thời gian chờ và phản hồi.",
      en: "The source mainly states that a clear timeline can increase trust; to support this, it cites wait times and feedback.",
    },
    coherence_checks_vi: ["Nguồn vẫn là chủ thể.", "Evidence gắn với claim.", "Không biến summary thành review."],
    coherence_checks_en: ["The source remains the subject.", "Evidence is tied to the claim.", "The summary does not become a review."],
    verification_steps_vi: ["Đối chiếu claim với nguồn.", "Đánh dấu evidence chính.", "Xóa nhận xét cá nhân nếu có."],
    verification_steps_en: ["Match the claim to the source.", "Mark the main evidence.", "Remove personal commentary if present."],
    pre_integration_notes_vi: ["Phù hợp làm mẫu trước integration.", "Dễ dùng trong rubric.", "Giữ độ dài compact."],
    pre_integration_notes_en: ["Fits as a pre-integration model.", "Easy to use in a rubric.", "Keeps compact length."],
    canada_context: {
      context_vi: "Tóm tắt nguồn về tiếp cận dịch vụ tại Canada.",
      context_en: "Source summary about service access in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਸਰੋਤ ਉਡੀਕ ਸਮੇਂ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਜੋੜਦਾ ਹੈ।",
      rom: "Canada de sandarbh vich sarot udik samen nu bharose nal jorda hai.",
      vi: "Trong bối cảnh Canada, nguồn liên hệ thời gian chờ với niềm tin.",
      en: "In the Canadian context, the source connects wait times with trust.",
    },
    learner_traps_vi: ["Đừng thêm ý kiến của người học.", "Đừng bỏ evidence vì muốn viết ngắn."],
    learner_traps_en: ["Do not add the learner's opinion.", "Do not drop evidence just to be brief."],
  },
  {
    id: "pa_c1_crosscheck_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "cross_check",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ cross-check",
    title_rom: "savdhan daava cross-check",
    title_vi: "Cross-check claim thận trọng",
    title_en: "Cautious claim cross-check",
    check_prompt_vi: "Kiểm tra claim có đủ lực nhưng không vượt dữ liệu hay tạo kết luận chắc chắn quá mức không.",
    check_prompt_en: "Check that the claim has enough force without exceeding the data or sounding too certain.",
    sample: {
      pa: "ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਹਾਲਾਂਕਿ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, halanki vadde padhar te lagu karan ton pahlan hor samikhia lorindi hai.",
      vi: "Số liệu gợi ý quy trình mới có thể hữu ích, tuy nhiên cần xem xét thêm trước khi áp dụng ở quy mô lớn.",
      en: "The figures suggest that the new process may be helpful, although further review is needed before large-scale use.",
    },
    coherence_checks_vi: ["Claim có hedge.", "Giới hạn triển khai rõ.", "Không làm mờ thông điệp chính."],
    coherence_checks_en: ["The claim has hedging.", "Implementation limits are clear.", "The main message is not blurred."],
    verification_steps_vi: ["Tìm động từ modal.", "Kiểm tra cụm giới hạn.", "So với evidence có sẵn."],
    verification_steps_en: ["Find the modal wording.", "Check the limiting phrase.", "Compare with available evidence."],
    pre_integration_notes_vi: ["Dùng được trong phần cautious claims.", "Không cần dữ liệu live.", "Hợp cho bài viết học thuật."],
    pre_integration_notes_en: ["Usable in a cautious-claims section.", "No live data needed.", "Fits academic writing."],
    canada_context: {
      context_vi: "Đánh giá pilot trong một tổ chức tại Canada.",
      context_en: "Pilot evaluation in an organization in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਵਿੱਚ ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਅੰਤਿਮ ਸਬੂਤ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ।",
      rom: "Canada de pilot vich natija umidjanak hai, par is nu antim sabut nahin mannna chahida.",
      vi: "Trong pilot tại Canada, kết quả có triển vọng nhưng không nên xem là bằng chứng cuối cùng.",
      en: "In the Canadian pilot, the result is promising but should not be treated as final evidence.",
    },
    learner_traps_vi: ["Đừng biến may/có thể thành chắc chắn.", "Đừng hedge nhiều đến mức mất claim."],
    learner_traps_en: ["Do not turn may into certainty.", "Do not hedge so much that the claim disappears."],
  },
  {
    id: "pa_c1_crosscheck_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "verification",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ verification",
    title_rom: "sabut tulna verification",
    title_vi: "Verification so sánh bằng chứng",
    title_en: "Evidence comparison verification",
    check_prompt_vi: "Kiểm tra hai nguồn có được so sánh rõ về vai trò, độ mạnh và giới hạn không.",
    check_prompt_en: "Verify that two sources are compared clearly by role, strength, and limitation.",
    sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਭਾਗੀਦਾਰਾਂ ਦੇ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਇਸ ਲਈ ਦੋਵੇਂ ਸਬੂਤ ਵੱਖਰੇ ਪਰ ਪੂਰਕ ਹਨ।",
      rom: "pahla sarot ginti de ank dinda hai, jadki duja sarot bhagidaran de anubhav nu ubharda hai; is lai dove sabut vakhre par purak han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người tham gia; vì vậy hai loại bằng chứng khác nhau nhưng bổ sung nhau.",
      en: "The first source gives numerical data, while the second highlights participant experience; the two forms of evidence are different but complementary.",
    },
    coherence_checks_vi: ["Vai trò từng nguồn rõ.", "Không trộn số liệu với trải nghiệm.", "Có quan hệ bổ sung."],
    coherence_checks_en: ["Each source role is clear.", "Numbers and experience are not mixed.", "The complementary relationship is explicit."],
    verification_steps_vi: ["Gạch chân nguồn một và nguồn hai.", "Tìm từ nối so sánh.", "Kiểm tra kết luận không quá rộng."],
    verification_steps_en: ["Underline source one and source two.", "Find the comparison connector.", "Check that the conclusion is not too broad."],
    pre_integration_notes_vi: ["Hợp cho cross-check trước bài evidence.", "Dùng được trong workshop.", "Giữ rõ register học thuật."],
    pre_integration_notes_en: ["Fits pre-evidence cross-checking.", "Usable in a workshop.", "Keeps academic register clear."],
    canada_context: {
      context_vi: "So sánh số liệu chính thức và trải nghiệm cộng đồng tại Canada.",
      context_en: "Comparing official figures and community experience in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਰਕਾਰੀ ਅੰਕੜੇ ਅਤੇ ਭਾਈਚਾਰੇ ਦੇ ਤਜਰਬੇ ਦੋਵੇਂ ਮਿਲ ਕੇ ਵਧੇਰੇ ਪੂਰੀ ਤਸਵੀਰ ਦਿੰਦੇ ਹਨ।",
      rom: "Canada vich sarkari ankde ate bhaichare de tajarbe dove mil ke vadhere puri tasvir dinde han.",
      vi: "Tại Canada, số liệu chính thức và trải nghiệm cộng đồng cùng tạo bức tranh đầy đủ hơn.",
      en: "In Canada, official figures and community experience together give a fuller picture.",
    },
    learner_traps_vi: ["Đừng gọi hai nguồn là giống nhau.", "Đừng kết luận rộng hơn evidence."],
    learner_traps_en: ["Do not call the two sources the same.", "Do not conclude more broadly than the evidence allows."],
  },
  {
    id: "pa_c1_crosscheck_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "peshavar patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín chuyên nghiệp",
    title_en: "Professional correspondence pre-integration",
    check_prompt_vi: "Kiểm tra email có lịch sự, rõ yêu cầu, và không chuyển sang giọng thân mật quá mức không.",
    check_prompt_en: "Check that the email is polite, clear in its request, and not overly familiar.",
    sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਤੁਹਾਡੇ ਲਈ ਢੰਗੀ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਦੱਸ ਦਿਓ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je tuhade lai dangi hove, kirpa karke agle kadam bare dass dio.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu tiện, vui lòng cho biết bước tiếp theo.",
      en: "I am politely following up on the previous message. If convenient, please let me know the next step.",
    },
    coherence_checks_vi: ["Request rõ.", "Lịch sự nhưng không vòng vo.", "Không có trách móc."],
    coherence_checks_en: ["The request is clear.", "Polite without being indirect.", "No blaming tone."],
    verification_steps_vi: ["Tìm câu follow-up.", "Tìm request cụ thể.", "Kiểm tra mức độ thân mật."],
    verification_steps_en: ["Find the follow-up sentence.", "Find the specific request.", "Check the level of familiarity."],
    pre_integration_notes_vi: ["Có thể dùng trong module workplace.", "Không đụng auth hay billing.", "Không cần hệ thống gửi email thật."],
    pre_integration_notes_en: ["Can be used in a workplace module.", "Does not touch auth or billing.", "No real email system needed."],
    canada_context: {
      context_vi: "Email follow-up trong môi trường làm việc tại Canada.",
      context_en: "Follow-up email in a Canadian workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੰਮਕਾਜੀ ਸੰਦਰਭ ਵਿੱਚ ਸਿੱਧੀ ਪਰ ਨਿਮਰ ਬੇਨਤੀ ਆਮ ਤੌਰ ਤੇ ਢੰਗੀ ਰਹਿੰਦੀ ਹੈ।",
      rom: "Canada de kamkaji sandarbh vich sidhhi par nimar benati aam taur te dangi rahindi hai.",
      vi: "Trong môi trường làm việc tại Canada, yêu cầu thẳng nhưng lịch sự thường phù hợp.",
      en: "In a Canadian workplace context, a direct but polite request is usually appropriate.",
    },
    learner_traps_vi: ["Đừng viết như tin nhắn bạn bè.", "Đừng dùng mệnh lệnh quá mạnh."],
    learner_traps_en: ["Do not write like a message to a friend.", "Do not use commands that are too strong."],
  },
  {
    id: "pa_c1_crosscheck_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "pre_integration",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ pre-integration",
    title_rom: "karjakari sankhep pre-integration",
    title_vi: "Pre-integration bản tóm tắt điều hành",
    title_en: "Executive summary pre-integration",
    check_prompt_vi: "Kiểm tra executive summary có giữ ưu tiên, rủi ro và bước tiếp theo trong một đoạn ngắn không.",
    check_prompt_en: "Check whether the executive summary keeps priorities, risks, and next steps in one short paragraph.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ, ਜਦਕਿ ਮੁੱਖ ਜੋਖਮ ਖਰਚੇ ਅਤੇ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ; ਅਗਲਾ ਕਦਮ ਛੋਟੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਰੱਖਣਾ ਹੈ।",
      rom: "mukh tarji seva di gunvatta kaim rakhni hai, jadki mukh jokham kharche ate samen nal juria hai; agla kadam chhoti samikhia meeting rakhna hai.",
      vi: "Ưu tiên chính là duy trì chất lượng dịch vụ, trong khi rủi ro chính liên quan đến chi phí và thời gian; bước tiếp theo là tổ chức một buổi review ngắn.",
      en: "The main priority is maintaining service quality, while the main risk concerns cost and time; the next step is to hold a short review meeting.",
    },
    coherence_checks_vi: ["Có priority.", "Có risk.", "Có next step rõ."],
    coherence_checks_en: ["Has a priority.", "Has a risk.", "Has a clear next step."],
    verification_steps_vi: ["Đếm ba phần chính.", "Kiểm tra không lan man.", "So với tone executive."],
    verification_steps_en: ["Count the three main parts.", "Check that it does not ramble.", "Compare with executive tone."],
    pre_integration_notes_vi: ["Sẵn sàng cho review trước integration.", "Chỉ là mẫu kiểm tra trước khi nhập.", "Không cần dữ liệu ngoài."],
    pre_integration_notes_en: ["Ready for review before integration.", "Only a sample for checking before import.", "No external data needed."],
    canada_context: {
      context_vi: "Tóm tắt điều hành cho chương trình cộng đồng tại Canada.",
      context_en: "Executive summary for a community program in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਭਾਈਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਲਈ ਇਹ ਸੰਖੇਪ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de bhaicharak program lai ih sankhep tarji, jokham ate agle kadam nu ikathe rakhda hai.",
      vi: "Cho chương trình cộng đồng tại Canada, bản tóm tắt này giữ priority, risk và next step cùng nhau.",
      en: "For a community program in Canada, this summary keeps the priority, risk, and next step together.",
    },
    learner_traps_vi: ["Đừng biến summary thành danh sách dài.", "Đừng quên next step."],
    learner_traps_en: ["Do not turn the summary into a long list.", "Do not forget the next step."],
  },
];
