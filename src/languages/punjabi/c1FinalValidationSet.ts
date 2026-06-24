// Punjabi C1 final validation set for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1FinalValidationArea =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response";

export type PunjabiC1FinalValidationMode =
  | "final_validation"
  | "cross_check"
  | "pre_integration";

export type PunjabiC1FinalValidationPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1FinalValidationCard = {
  id: string;
  level: "C1";
  area: PunjabiC1FinalValidationArea;
  mode: PunjabiC1FinalValidationMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  validation_prompt_vi: string;
  validation_prompt_en: string;
  final_sample: PunjabiC1FinalValidationPhrase;
  register_checks_vi: readonly string[];
  register_checks_en: readonly string[];
  tone_checks_vi: readonly string[];
  tone_checks_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1FinalValidationPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1FinalValidationSetScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1FinalValidationSet: PunjabiC1FinalValidationCard[] = [
  {
    id: "pa_c1_final_validation_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "final_validation",
    title_pa: "ਰਸਮੀ ਲਿਖਤ final validation",
    title_rom: "rasmi likhat final validation",
    title_vi: "Final validation văn phong trang trọng",
    title_en: "Formal writing final validation",
    validation_prompt_vi: "Xác nhận đoạn văn giữ formal register, có hedge hợp lý và không giống văn chat.",
    validation_prompt_en: "Confirm that the paragraph keeps formal register, uses reasonable hedging, and does not sound chat-like.",
    final_sample: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਇਹ ਦਰਸਾਉਂਦੀ ਹੈ ਕਿ ਨਤੀਜਾ ਧਿਆਨਯੋਗ ਹੈ, ਪਰ ਅੰਤਿਮ ਵਿਆਖਿਆ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਸਬੂਤ ਨਾਲ ਮਿਲਾ ਕੇ ਦੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "uplabdh jankari ih darsaundi hai ki natija dhianyog hai, par antim viakhia ton pahlan hor sabut nal mila ke dekhna chahida hai.",
      vi: "Thông tin hiện có cho thấy kết quả đáng chú ý, nhưng trước khi diễn giải cuối cùng nên đối chiếu với thêm bằng chứng.",
      en: "The available information indicates that the result is noteworthy, but it should be checked against further evidence before final interpretation.",
    },
    register_checks_vi: ["Trang trọng.", "Có giới hạn dữ liệu.", "Không quá cứng."],
    register_checks_en: ["Formal.", "States data limits.", "Not overly rigid."],
    tone_checks_vi: ["Cân bằng.", "Không phóng đại.", "Có lập trường vừa đủ."],
    tone_checks_en: ["Balanced.", "Does not exaggerate.", "Has a measured stance."],
    pre_integration_notes_vi: ["Dùng được trong report lesson.", "Không cần audio.", "Không có claim thời sự."],
    pre_integration_notes_en: ["Usable in a report lesson.", "No audio needed.", "No current-news claim."],
    canada_example: {
      context_vi: "Báo cáo học thuật hoặc công việc tại Canada.",
      context_en: "Academic or workplace report in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਇਹ ਲਹਿਜ਼ਾ ਸਾਵਧਾਨ ਅਤੇ ਪੇਸ਼ਾਵਰ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada di report vich ih lehja savdhan ate peshavar rahinda hai.",
      vi: "Trong báo cáo tại Canada, giọng này vẫn thận trọng và chuyên nghiệp.",
      en: "In a Canadian report, this tone remains cautious and professional.",
    },
    learner_traps_vi: ["Đừng viết quá chắc.", "Đừng dùng câu thân mật trong văn bản formal."],
    learner_traps_en: ["Do not sound too certain.", "Do not use casual wording in formal text."],
  },
  {
    id: "pa_c1_final_validation_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "cross_check",
    title_pa: "ਸਰੋਤ ਸਾਰ cross-check",
    title_rom: "sarot saar cross-check",
    title_vi: "Cross-check tóm tắt nguồn",
    title_en: "Source summary cross-check",
    validation_prompt_vi: "Xác nhận summary giữ claim và evidence của nguồn, không thêm đánh giá cá nhân.",
    validation_prompt_en: "Confirm that the summary keeps the source claim and evidence without adding personal evaluation.",
    final_sample: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ, ਅਤੇ ਇਸ ਗੱਲ ਨੂੰ ਉਡੀਕ ਸਮੇਂ ਤੇ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਨ ਮਿਲਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai, ate is gal nu udik samen te feedback nal samarthan milda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin, và điều này được hỗ trợ bằng thời gian chờ cùng phản hồi.",
      en: "The source's main claim is that a clear timeline can increase trust, and this is supported by wait times and feedback.",
    },
    register_checks_vi: ["Nguồn là chủ thể.", "Claim đi cùng evidence.", "Không trượt sang critique."],
    register_checks_en: ["The source is the subject.", "Claim stays with evidence.", "Does not slide into critique."],
    tone_checks_vi: ["Neutral.", "Gọn.", "Không thêm cảm xúc."],
    tone_checks_en: ["Neutral.", "Concise.", "Adds no emotion."],
    pre_integration_notes_vi: ["Hợp cho mẫu summary.", "Dễ gắn vào rubric.", "Compact cho app data."],
    pre_integration_notes_en: ["Fits a summary model.", "Easy to attach to a rubric.", "Compact for app data."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸਰੋਤ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
      rom: "Canada de sarot vich seva jankari di spashtata nu bharose nal joria gaya hai.",
      vi: "Trong nguồn tại Canada, sự rõ ràng của thông tin dịch vụ được liên hệ với niềm tin.",
      en: "In the Canadian source, clarity of service information is linked to trust.",
    },
    learner_traps_vi: ["Đừng đổi summary thành opinion.", "Đừng bỏ evidence chính."],
    learner_traps_en: ["Do not turn the summary into an opinion.", "Do not drop the main evidence."],
  },
  {
    id: "pa_c1_final_validation_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "final_validation",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ final validation",
    title_rom: "savdhan daava final validation",
    title_vi: "Final validation claim thận trọng",
    title_en: "Cautious claim final validation",
    validation_prompt_vi: "Xác nhận claim có lực nhưng không vượt quá phạm vi dữ liệu.",
    validation_prompt_en: "Confirm that the claim has force without exceeding the data scope.",
    final_sample: {
      pa: "ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਹਾਲਾਂਕਿ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਲਈ ਹੋਰ ਮੁਲਾਂਕਣ ਦੀ ਲੋੜ ਹੈ।",
      rom: "ankde ih sujhaounde han ki navi prakiria labhdayak ho sakdi hai, halanki vadde padhar te lagu karan lai hor mulankan di lor hai.",
      vi: "Số liệu gợi ý quy trình mới có thể hữu ích, tuy nhiên cần thêm đánh giá trước khi áp dụng rộng.",
      en: "The figures suggest that the new process may be useful, although further evaluation is needed before broad implementation.",
    },
    register_checks_vi: ["Có hedge.", "Có giới hạn triển khai.", "Không mất ý chính."],
    register_checks_en: ["Has hedging.", "Has an implementation limit.", "Does not lose the main point."],
    tone_checks_vi: ["Thận trọng.", "Không yếu.", "Không chắc quá mức."],
    tone_checks_en: ["Cautious.", "Not weak.", "Not overly certain."],
    pre_integration_notes_vi: ["Dùng được cho cautious-claim review.", "Không cần dữ liệu live.", "Phù hợp bài học C1."],
    pre_integration_notes_en: ["Usable for cautious-claim review.", "No live data needed.", "Fits a C1 lesson."],
    canada_example: {
      context_vi: "Đánh giá pilot tại Canada.",
      context_en: "Pilot evaluation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਦਾ ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਅੰਤਿਮ ਨਤੀਜਾ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ।",
      rom: "Canada de pilot da natija umidjanak hai, par is nu antim natija nahin mannna chahida.",
      vi: "Kết quả pilot tại Canada có triển vọng, nhưng không nên xem là kết luận cuối cùng.",
      en: "The Canadian pilot result is promising, but it should not be treated as a final conclusion.",
    },
    learner_traps_vi: ["Đừng nói chắc từ mẫu nhỏ.", "Đừng hedge quá nhiều đến mức mơ hồ."],
    learner_traps_en: ["Do not sound certain from a small sample.", "Do not hedge so much that it becomes vague."],
  },
  {
    id: "pa_c1_final_validation_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "cross_check",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ cross-check",
    title_rom: "sabut tulna cross-check",
    title_vi: "Cross-check so sánh bằng chứng",
    title_en: "Evidence comparison cross-check",
    validation_prompt_vi: "Xác nhận hai nguồn được so sánh rõ về vai trò và giới hạn.",
    validation_prompt_en: "Confirm that the two sources are compared clearly by role and limitation.",
    final_sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਵਰਤੋਂਕਾਰ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਇਸ ਲਈ ਦੋਵੇਂ ਸਬੂਤ ਵੱਖਰੇ ਪਰ ਪੂਰਕ ਹਨ।",
      rom: "pahla sarot ginti de ank dinda hai, jadki duja sarot vartokar anubhav nu ubharda hai; is lai dove sabut vakhre par purak han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người dùng; vì vậy hai loại bằng chứng khác nhau nhưng bổ sung nhau.",
      en: "The first source provides numerical data, while the second highlights user experience; the two forms of evidence are different but complementary.",
    },
    register_checks_vi: ["Vai trò từng nguồn rõ.", "Không trộn evidence.", "Có quan hệ bổ sung."],
    register_checks_en: ["Each source role is clear.", "Evidence is not blended.", "Complementary relationship is present."],
    tone_checks_vi: ["Khách quan.", "Không chọn phe quá sớm.", "Giữ logic so sánh."],
    tone_checks_en: ["Objective.", "Does not take a side too early.", "Keeps comparison logic."],
    pre_integration_notes_vi: ["Dùng được trong evidence workshop.", "Hợp cho final validation.", "Không cần nguồn ngoài."],
    pre_integration_notes_en: ["Usable in an evidence workshop.", "Fits final validation.", "No external source needed."],
    canada_example: {
      context_vi: "So sánh số liệu và trải nghiệm cộng đồng tại Canada.",
      context_en: "Comparing figures and community experience in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਭਾਈਚਾਰੇ ਦੇ ਤਜਰਬੇ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਨਤੀਜਾ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਬਣਦਾ ਹੈ।",
      rom: "Canada vich ankde ate bhaichare de tajarbe ikathe vekhan nal natija vadhere santulit bannda hai.",
      vi: "Tại Canada, xem số liệu cùng trải nghiệm cộng đồng giúp kết luận cân bằng hơn.",
      en: "In Canada, considering figures together with community experience makes the conclusion more balanced.",
    },
    learner_traps_vi: ["Đừng xem hai nguồn là giống nhau.", "Đừng kết luận rộng hơn evidence."],
    learner_traps_en: ["Do not treat the two sources as identical.", "Do not conclude more broadly than the evidence allows."],
  },
  {
    id: "pa_c1_final_validation_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "peshavar patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín chuyên nghiệp",
    title_en: "Professional correspondence pre-integration",
    validation_prompt_vi: "Xác nhận email follow-up lịch sự, rõ request và không quá thân mật.",
    validation_prompt_en: "Confirm that the follow-up email is polite, clear in its request, and not overly familiar.",
    final_sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਛੋਟਾ ਜਿਹਾ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰ ਦਿਓ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke agle kadam bare chhota jiha update sanjha kar dio.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng chia sẻ cập nhật ngắn về bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please share a brief update on the next step.",
    },
    register_checks_vi: ["Lịch sự.", "Request rõ.", "Không trách móc."],
    register_checks_en: ["Polite.", "Clear request.", "No blaming."],
    tone_checks_vi: ["Công việc.", "Không lạnh.", "Không quá thân."],
    tone_checks_en: ["Work-appropriate.", "Not cold.", "Not too familiar."],
    pre_integration_notes_vi: ["Dùng được trong workplace module.", "Không cần hệ thống email thật.", "Không đụng auth hay billing."],
    pre_integration_notes_en: ["Usable in a workplace module.", "No real email system needed.", "Does not touch auth or billing."],
    canada_example: {
      context_vi: "Email follow-up tại nơi làm việc ở Canada.",
      context_en: "Workplace follow-up email in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਵਿੱਚ ਸਿੱਧੀ ਪਰ ਨਿਮਰ ਬੇਨਤੀ ਆਮ ਤੌਰ ਤੇ ਸਭ ਤੋਂ ਢੰਗੀ ਰਹਿੰਦੀ ਹੈ।",
      rom: "Canada de daftar vich sidhhi par nimar benati aam taur te sab ton dangi rahindi hai.",
      vi: "Trong văn phòng tại Canada, yêu cầu thẳng nhưng lịch sự thường phù hợp nhất.",
      en: "In a Canadian office, a direct but polite request is usually the most appropriate.",
    },
    learner_traps_vi: ["Đừng viết như chat với bạn.", "Đừng dùng mệnh lệnh mạnh."],
    learner_traps_en: ["Do not write like a chat with a friend.", "Do not use strong commands."],
  },
  {
    id: "pa_c1_final_validation_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "final_validation",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ final validation",
    title_rom: "karjakari sankhep final validation",
    title_vi: "Final validation bản tóm tắt điều hành",
    title_en: "Executive summary final validation",
    validation_prompt_vi: "Xác nhận executive summary giữ priority, risk và next step trong một đoạn ngắn.",
    validation_prompt_en: "Confirm that the executive summary keeps priority, risk, and next step in one short paragraph.",
    final_sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ; ਮੁੱਖ ਜੋਖਮ ਖਰਚੇ ਅਤੇ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ; ਅਗਲਾ ਕਦਮ ਛੋਟੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਰੱਖਣਾ ਹੈ।",
      rom: "mukh tarji seva di gunvatta kaim rakhni hai; mukh jokham kharche ate samen nal juria hai; agla kadam chhoti samikhia meeting rakhna hai.",
      vi: "Ưu tiên chính là duy trì chất lượng dịch vụ; rủi ro chính liên quan đến chi phí và thời gian; bước tiếp theo là tổ chức một buổi review ngắn.",
      en: "The main priority is maintaining service quality; the main risk concerns cost and time; the next step is to hold a short review meeting.",
    },
    register_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    register_checks_en: ["Has priority.", "Has risk.", "Has next step."],
    tone_checks_vi: ["Gọn.", "Executive.", "Không lan man."],
    tone_checks_en: ["Concise.", "Executive.", "Does not ramble."],
    pre_integration_notes_vi: ["Sẵn sàng cho final validation.", "Không cần dữ liệu ngoài.", "Dễ tái dùng trong app."],
    pre_integration_notes_en: ["Ready for final validation.", "No external data needed.", "Easy to reuse in the app."],
    canada_example: {
      context_vi: "Tóm tắt chương trình cộng đồng tại Canada.",
      context_en: "Summary of a community program in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਭਾਈਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਲਈ ਇਹ ਸੰਖੇਪ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਸਪਸ਼ਟ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de bhaicharak program lai ih sankhep tarji, jokham ate agle kadam nu spasht rakhda hai.",
      vi: "Cho chương trình cộng đồng tại Canada, bản tóm tắt này giữ priority, risk và next step rõ ràng.",
      en: "For a community program in Canada, this summary keeps the priority, risk, and next step clear.",
    },
    learner_traps_vi: ["Đừng viết thành danh sách quá dài.", "Đừng quên bước tiếp theo."],
    learner_traps_en: ["Do not turn it into a long list.", "Do not forget the next step."],
  },
  {
    id: "pa_c1_final_validation_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "cross_check",
    title_pa: "ਲਹਿਜ਼ਾ calibration cross-check",
    title_rom: "lehja calibration cross-check",
    title_vi: "Cross-check hiệu chỉnh register",
    title_en: "Register calibration cross-check",
    validation_prompt_vi: "Xác nhận câu chuyển từ thân mật sang trang trọng mà vẫn tự nhiên và dễ dùng.",
    validation_prompt_en: "Confirm that the sentence shifts from casual to formal while remaining natural and usable.",
    final_sample: {
      pa: "ਚੰਗਾ ਲੱਗਿਆ ਵਾਲੀ ਬੋਲੀ ਨੂੰ ਰਿਪੋਰਟ ਵਿੱਚ ਇਹ ਰੂਪ ਦਿੱਤਾ ਜਾ ਸਕਦਾ ਹੈ: ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "changa laggia vali boli nu report vich ih rup ditta ja sakda hai: natija umidjanak hai, par hor samikhia lorindi hai.",
      vi: "Cách nói kiểu 'thấy tốt' có thể chuyển trong report thành: kết quả có triển vọng, nhưng cần xem xét thêm.",
      en: "A phrase like 'it seems good' can be recast in a report as: the result is promising, but further review is needed.",
    },
    register_checks_vi: ["Có chuyển register.", "Bản formal tự nhiên.", "Không mất ý ban đầu."],
    register_checks_en: ["Register shift is present.", "The formal version is natural.", "Original meaning is not lost."],
    tone_checks_vi: ["Không quá đời thường.", "Không quá nặng.", "Giữ giọng học thuật."],
    tone_checks_en: ["Not too casual.", "Not too heavy.", "Keeps academic tone."],
    pre_integration_notes_vi: ["Dùng được làm validation item.", "Hợp cho learner trap.", "Không cần pronunciation scoring."],
    pre_integration_notes_en: ["Usable as a validation item.", "Fits a learner trap.", "No pronunciation scoring needed."],
    canada_example: {
      context_vi: "Hiệu chỉnh register cho báo cáo ở Canada.",
      context_en: "Register calibration for a report in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਸਧਾਰਨ ਟਿੱਪਣੀ ਨੂੰ ਮਾਪੇ ਹੋਏ ਦਾਅਵੇ ਵਿੱਚ ਬਦਲਣਾ ਜ਼ਰੂਰੀ ਹੈ।",
      rom: "Canada di report vich sadharan tippani nu mape hoe daave vich badalna zaruri hai.",
      vi: "Trong báo cáo tại Canada, cần chuyển nhận xét thường ngày thành claim có mức độ.",
      en: "In a Canadian report, a casual comment should be changed into a measured claim.",
    },
    learner_traps_vi: ["Đừng dịch word-for-word từ câu thân mật.", "Đừng làm formal đến mức khó hiểu."],
    learner_traps_en: ["Do not translate casual wording word for word.", "Do not make the formal version hard to understand."],
  },
  {
    id: "pa_c1_final_validation_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ pre-integration",
    title_rom: "peshkari jawab pre-integration",
    title_vi: "Pre-integration phản hồi thuyết trình",
    title_en: "Presentation response pre-integration",
    validation_prompt_vi: "Xác nhận phản hồi presentation trả lời câu hỏi trực tiếp, giữ tone lịch sự và có giới hạn.",
    validation_prompt_en: "Confirm that the presentation response answers directly, stays polite, and includes limits.",
    final_sample: {
      pa: "ਇਹ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ। ਮੌਜੂਦਾ ਅੰਕੜਿਆਂ ਦੇ ਆਧਾਰ ਤੇ ਅਸੀਂ ਰੁਝਾਨ ਵੇਖ ਸਕਦੇ ਹਾਂ, ਪਰ ਵੱਡੇ ਨਤੀਜੇ ਲਈ ਹੋਰ ਡਾਟਾ ਦੀ ਲੋੜ ਰਹੇਗੀ।",
      rom: "ih mahatvapuran sawal hai. maujuda ankrian de adhar te asi rujhan vekh sakde han, par vadde natije lai hor data di lor rahegi.",
      vi: "Đây là câu hỏi quan trọng. Dựa trên số liệu hiện có, chúng ta có thể thấy xu hướng, nhưng để kết luận lớn hơn sẽ cần thêm dữ liệu.",
      en: "That is an important question. Based on the current figures, we can see a trend, but a broader conclusion will require more data.",
    },
    register_checks_vi: ["Trả lời trực tiếp.", "Có hedge.", "Giữ lịch sự."],
    register_checks_en: ["Answers directly.", "Has hedging.", "Keeps politeness."],
    tone_checks_vi: ["Tự tin vừa đủ.", "Không phòng thủ.", "Không phóng đại."],
    tone_checks_en: ["Measured confidence.", "Not defensive.", "Does not exaggerate."],
    pre_integration_notes_vi: ["Dùng được trước presentation module.", "Không cần audio.", "Hợp cho Q&A học thuật."],
    pre_integration_notes_en: ["Usable before a presentation module.", "No audio needed.", "Fits academic Q&A."],
    canada_example: {
      context_vi: "Q&A presentation trong lớp hoặc nơi làm việc tại Canada.",
      context_en: "Presentation Q&A in a Canadian class or workplace.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਕਲਾਸ ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੇ ਸਮੇਂ ਸਵਾਲ ਦੀ ਕਦਰ ਕਰਨੀ ਅਤੇ ਸੀਮਾ ਦੱਸਣੀ ਦੋਵੇਂ ਮਦਦਗਾਰ ਹਨ।",
      rom: "Canada di class vich jawab dinde samen sawal di kadar karni ate sima dassni dovein madadgar han.",
      vi: "Trong lớp học tại Canada, khi trả lời nên ghi nhận câu hỏi và nêu giới hạn.",
      en: "In a Canadian class, it helps to acknowledge the question and state the limit when answering.",
    },
    learner_traps_vi: ["Đừng né câu hỏi.", "Đừng trả lời chắc hơn dữ liệu cho phép."],
    learner_traps_en: ["Do not dodge the question.", "Do not answer more confidently than the data allows."],
  },
];
