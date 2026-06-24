// Punjabi C1 final-lock samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1FinalLockArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response"
  | "public_professional_service_tone";

export type PunjabiC1FinalLockMode =
  | "final_lock"
  | "owner_acceptance"
  | "final_acceptance"
  | "pre_integration";

export type PunjabiC1FinalLockPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1FinalLockSample = {
  id: string;
  level: "C1";
  area: PunjabiC1FinalLockArea;
  mode: PunjabiC1FinalLockMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  lock_prompt_vi: string;
  lock_prompt_en: string;
  sample: PunjabiC1FinalLockPhrase;
  final_lock_checks_vi: readonly string[];
  final_lock_checks_en: readonly string[];
  owner_acceptance_checks_vi: readonly string[];
  owner_acceptance_checks_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1FinalLockPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1FinalLockSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1FinalLockSamples: PunjabiC1FinalLockSample[] = [
  {
    id: "pa_c1_final_lock_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "final_lock",
    title_pa: "ਸਰੋਤ ਸਾਰ final-lock",
    title_rom: "sarot saar final-lock",
    title_vi: "Final-lock tóm tắt nguồn",
    title_en: "Source summary final lock",
    lock_prompt_vi: "Khóa sample summary nếu claim, evidence và neutrality đều ổn định.",
    lock_prompt_en: "Lock the summary sample if claim, evidence, and neutrality are stable.",
    sample: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ, ਅਤੇ ਇਹ ਗੱਲ ਉਡੀਕ ਸਮੇਂ ਤੇ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਿਤ ਹੈ।",
      rom: "sarot da mukh daava hai ki spasht sama-rekha bharosa vadha sakdi hai, ate ih gal udik samen te feedback nal samarthit hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin, và điều này được hỗ trợ bằng thời gian chờ cùng phản hồi.",
      en: "The source's main claim is that a clear timeline can increase trust, and this is supported by wait times and feedback.",
    },
    final_lock_checks_vi: ["Claim rõ.", "Evidence đi kèm.", "Giọng neutral."],
    final_lock_checks_en: ["Clear claim.", "Evidence included.", "Neutral tone."],
    owner_acceptance_checks_vi: ["Không thêm opinion.", "Không bỏ evidence chính.", "Không phóng đại nguồn."],
    owner_acceptance_checks_en: ["No added opinion.", "Does not drop main evidence.", "Does not overstate the source."],
    pre_integration_notes_vi: ["Sẵn sàng khóa trước freeze.", "Không cần dữ liệu live.", "Dùng được trong rubric."],
    pre_integration_notes_en: ["Ready to lock before freeze.", "No live data needed.", "Usable in a rubric."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਸਰੋਤ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਜੋੜਦਾ ਹੈ।",
      rom: "Canada de sandarbh vich sarot seva jankari di spashtata nu bharose nal jorda hai.",
      vi: "Trong bối cảnh Canada, nguồn liên hệ sự rõ ràng của thông tin dịch vụ với niềm tin.",
      en: "In the Canadian context, the source connects clarity of service information with trust.",
    },
    learner_traps_vi: ["Đừng biến summary thành critique.", "Đừng bỏ source voice."],
    learner_traps_en: ["Do not turn the summary into critique.", "Do not drop source voice."],
  },
  {
    id: "pa_c1_final_lock_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "owner_acceptance",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ owner-acceptance",
    title_rom: "savdhan daava owner-acceptance",
    title_vi: "Owner-acceptance claim thận trọng",
    title_en: "Cautious claim owner acceptance",
    lock_prompt_vi: "Khóa claim nếu đủ mạnh nhưng không vượt phạm vi evidence.",
    lock_prompt_en: "Lock the claim if it is strong enough without exceeding the evidence scope.",
    sample: {
      pa: "ਮੌਜੂਦਾ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਮੁਲਾਂਕਣ ਦੀ ਲੋੜ ਹੈ।",
      rom: "maujuda ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par vadde padhar te lagu karan ton pahlan hor mulankan di lor hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng cần thêm đánh giá trước khi áp dụng rộng.",
      en: "The current figures suggest that the new process may be helpful, but further evaluation is needed before broad implementation.",
    },
    final_lock_checks_vi: ["Có hedge.", "Có giới hạn scale.", "Claim vẫn rõ."],
    final_lock_checks_en: ["Has hedging.", "Has a scale limit.", "The claim remains clear."],
    owner_acceptance_checks_vi: ["Không chắc từ pilot nhỏ.", "Không hedge đến mơ hồ.", "Không tạo claim thời sự."],
    owner_acceptance_checks_en: ["Not certain from a small pilot.", "Not hedged into vagueness.", "No current-news claim."],
    pre_integration_notes_vi: ["Dùng được trong final-lock review.", "Không cần nguồn ngoài.", "Phù hợp C1."],
    pre_integration_notes_en: ["Usable in final-lock review.", "No outside source needed.", "Fits C1."],
    canada_example: {
      context_vi: "Đánh giá pilot tại Canada.",
      context_en: "Pilot evaluation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਦਾ ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਅੰਤਿਮ ਸਬੂਤ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ।",
      rom: "Canada de pilot da natija umidjanak hai, par is nu antim sabut nahin mannna chahida.",
      vi: "Kết quả pilot tại Canada có triển vọng, nhưng không nên xem là bằng chứng cuối cùng.",
      en: "The Canadian pilot result is promising, but it should not be treated as final evidence.",
    },
    learner_traps_vi: ["Đừng dùng certainty khi data còn hạn chế.", "Đừng làm claim yếu đến mức mất ý."],
    learner_traps_en: ["Do not use certainty when data is limited.", "Do not make the claim so weak that it loses meaning."],
  },
  {
    id: "pa_c1_final_lock_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "final_acceptance",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ final-acceptance",
    title_rom: "sabut tulna final-acceptance",
    title_vi: "Final-acceptance so sánh bằng chứng",
    title_en: "Evidence comparison final acceptance",
    lock_prompt_vi: "Khóa comparison nếu vai trò nguồn rõ và kết luận không quá rộng.",
    lock_prompt_en: "Lock the comparison if source roles are clear and the conclusion is not too broad.",
    sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਪੇਸ਼ ਕਰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਭਾਗੀਦਾਰਾਂ ਦੇ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਦੋਵੇਂ ਮਿਲ ਕੇ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਤਸਵੀਰ ਦਿੰਦੇ ਹਨ।",
      rom: "pahla sarot ginti de ank pesh karda hai, jadki duja sarot bhagidaran de anubhav nu ubharda hai; dove mil ke vadhere santulit tasvir dinde han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người tham gia; hai nguồn cùng tạo bức tranh cân bằng hơn.",
      en: "The first source presents numerical data, while the second highlights participant experience; together they provide a more balanced picture.",
    },
    final_lock_checks_vi: ["Vai trò nguồn rõ.", "Comparison rõ.", "Kết luận vừa mức."],
    final_lock_checks_en: ["Source roles are clear.", "Comparison is clear.", "Measured conclusion."],
    owner_acceptance_checks_vi: ["Không trộn evidence.", "Không chọn phe quá sớm.", "Không bỏ limitation."],
    owner_acceptance_checks_en: ["Evidence is not blended.", "Does not take a side too early.", "Does not omit limitations."],
    pre_integration_notes_vi: ["Dùng được trong evidence review.", "Không cần dữ liệu live.", "Hợp workshop."],
    pre_integration_notes_en: ["Usable in evidence review.", "No live data needed.", "Fits a workshop."],
    canada_example: {
      context_vi: "So sánh số liệu chính thức và trải nghiệm cộng đồng tại Canada.",
      context_en: "Comparing official figures and community experience in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਭਾਈਚਾਰੇ ਦੇ ਤਜਰਬੇ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਨਤੀਜਾ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada vich ankde ate bhaichare de tajarbe ikathe vekhan nal natija vadhere santulit rahinda hai.",
      vi: "Tại Canada, xem số liệu cùng trải nghiệm cộng đồng giúp kết luận cân bằng hơn.",
      en: "In Canada, considering figures together with community experience keeps the conclusion more balanced.",
    },
    learner_traps_vi: ["Đừng xóa khác biệt giữa evidence.", "Đừng kết luận rộng hơn nguồn cho phép."],
    learner_traps_en: ["Do not erase differences between evidence types.", "Do not conclude more broadly than the sources allow."],
  },
  {
    id: "pa_c1_final_lock_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín trang trọng",
    title_en: "Formal correspondence pre-integration",
    lock_prompt_vi: "Khóa email formal nếu request rõ, lịch sự và không giống chat.",
    lock_prompt_en: "Lock the formal email if the request is clear, polite, and not chat-like.",
    sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਛੋਟਾ ਜਿਹਾ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰ ਦਿਓ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke agle kadam bare chhota jiha update sanjha kar dio.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng chia sẻ cập nhật ngắn về bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please share a brief update on the next step.",
    },
    final_lock_checks_vi: ["Request rõ.", "Tone lịch sự.", "Độ formal đủ."],
    final_lock_checks_en: ["Clear request.", "Polite tone.", "Formal enough."],
    owner_acceptance_checks_vi: ["Không trách móc.", "Không quá vòng vo.", "Không giống tin nhắn bạn bè."],
    owner_acceptance_checks_en: ["No blaming.", "Not overly indirect.", "Not like a message to a friend."],
    pre_integration_notes_vi: ["Dùng được trong workplace module.", "Không liên quan auth/billing.", "Không cần gửi email thật."],
    pre_integration_notes_en: ["Usable in a workplace module.", "Not related to auth or billing.", "No real email sending needed."],
    canada_example: {
      context_vi: "Email follow-up trong môi trường làm việc tại Canada.",
      context_en: "Follow-up email in a Canadian workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੰਮਕਾਜੀ ਸੰਦਰਭ ਵਿੱਚ ਸਿੱਧੀ ਪਰ ਨਿਮਰ ਬੇਨਤੀ ਆਮ ਤੌਰ ਤੇ ਢੰਗੀ ਰਹਿੰਦੀ ਹੈ।",
      rom: "Canada de kamkaji sandarbh vich sidhhi par nimar benati aam taur te dangi rahindi hai.",
      vi: "Trong môi trường làm việc tại Canada, yêu cầu thẳng nhưng lịch sự thường phù hợp.",
      en: "In a Canadian workplace context, a direct but polite request is usually appropriate.",
    },
    learner_traps_vi: ["Đừng dùng mệnh lệnh mạnh.", "Đừng viết quá casual."],
    learner_traps_en: ["Do not use strong commands.", "Do not write too casually."],
  },
  {
    id: "pa_c1_final_lock_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "final_lock",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ final-lock",
    title_rom: "karjakari sankhep final-lock",
    title_vi: "Final-lock bản tóm tắt điều hành",
    title_en: "Executive summary final lock",
    lock_prompt_vi: "Khóa executive summary nếu vẫn giữ priority, risk và next step trong đoạn ngắn.",
    lock_prompt_en: "Lock the executive summary if it keeps priority, risk, and next step in a short paragraph.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ, ਜਦਕਿ ਮੁੱਖ ਜੋਖਮ ਖਰਚੇ ਅਤੇ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ; ਅਗਲਾ ਕਦਮ ਛੋਟੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਰੱਖਣਾ ਹੈ।",
      rom: "mukh tarji seva di gunvatta kaim rakhni hai, jadki mukh jokham kharche ate samen nal juria hai; agla kadam chhoti samikhia meeting rakhna hai.",
      vi: "Ưu tiên chính là duy trì chất lượng dịch vụ, trong khi rủi ro chính liên quan đến chi phí và thời gian; bước tiếp theo là tổ chức một buổi review ngắn.",
      en: "The main priority is maintaining service quality, while the main risk concerns cost and time; the next step is to hold a short review meeting.",
    },
    final_lock_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    final_lock_checks_en: ["Has a priority.", "Has a risk.", "Has a next step."],
    owner_acceptance_checks_vi: ["Không lan man.", "Không thành report dài.", "Không bỏ action."],
    owner_acceptance_checks_en: ["Does not ramble.", "Does not become a long report.", "Does not omit action."],
    pre_integration_notes_vi: ["Sẵn sàng khóa trước freeze.", "Compact cho app data.", "Không cần dữ liệu ngoài."],
    pre_integration_notes_en: ["Ready to lock before freeze.", "Compact for app data.", "No outside data required."],
    canada_example: {
      context_vi: "Tóm tắt điều hành cho chương trình cộng đồng tại Canada.",
      context_en: "Executive summary for a community program in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਭਾਈਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਲਈ ਇਹ ਸੰਖੇਪ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de bhaicharak program lai ih sankhep tarji, jokham ate agle kadam nu ikathe rakhda hai.",
      vi: "Cho chương trình cộng đồng tại Canada, bản tóm tắt này giữ priority, risk và next step cùng nhau.",
      en: "For a community program in Canada, this summary keeps the priority, risk, and next step together.",
    },
    learner_traps_vi: ["Đừng viết full report.", "Đừng quên bước tiếp theo."],
    learner_traps_en: ["Do not write a full report.", "Do not forget the next step."],
  },
  {
    id: "pa_c1_final_lock_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "owner_acceptance",
    title_pa: "ਰਜਿਸਟਰ calibration owner-acceptance",
    title_rom: "register calibration owner-acceptance",
    title_vi: "Owner-acceptance chỉnh register",
    title_en: "Register calibration owner acceptance",
    lock_prompt_vi: "Khóa register nếu chuyên nghiệp, rõ và không quá thân mật.",
    lock_prompt_en: "Lock the register if it is professional, clear, and not too casual.",
    sample: {
      pa: "ਇਹ ਗੱਲ ਦਿਲਚਸਪ ਹੈ, ਪਰ ਰਿਪੋਰਟ ਵਿੱਚ ਇਸ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਲਿਖਣਾ ਵਧੀਆ ਰਹੇਗਾ ਕਿ ਨਤੀਜੇ ਨੂੰ ਹੋਰ ਸਮੀਖਿਆ ਨਾਲ ਜੋੜਿਆ ਜਾਵੇ।",
      rom: "ih gal dilchasp hai, par report vich is nu is tarah likhna vadhia rahega ki natije nu hor samikhia nal joria jave.",
      vi: "Ý này thú vị, nhưng trong báo cáo nên viết theo cách liên hệ kết quả với thêm phần xem xét.",
      en: "This point is interesting, but in a report it is better to connect the result with further review.",
    },
    final_lock_checks_vi: ["Professional.", "Giữ ý gốc.", "Không quá lạnh."],
    final_lock_checks_en: ["Professional.", "Keeps original meaning.", "Not too cold."],
    owner_acceptance_checks_vi: ["Không dịch word-by-word từ văn nói.", "Không quá casual.", "Không đổi nghĩa."],
    owner_acceptance_checks_en: ["Does not translate spoken style word for word.", "Not too casual.", "Does not change meaning."],
    pre_integration_notes_vi: ["Hợp cho register calibration.", "Dùng được trong bài viết C1.", "Không cần audio."],
    pre_integration_notes_en: ["Fits register calibration.", "Usable in C1 writing.", "No audio needed."],
    canada_example: {
      context_vi: "Chỉnh register cho memo công việc tại Canada.",
      context_en: "Register adjustment for a workplace memo in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੰਮਕਾਜੀ ਮੈਮੋ ਵਿੱਚ ਇਹ ਲਹਿਜ਼ਾ ਨਿਮਰ, ਸਪਸ਼ਟ ਅਤੇ ਪੇਸ਼ਾਵਰ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada de kamkaji memo vich ih lehja nimar, spasht ate peshavar rahinda hai.",
      vi: "Trong memo công việc tại Canada, giọng này lịch sự, rõ ràng và chuyên nghiệp.",
      en: "In a Canadian workplace memo, this tone remains polite, clear, and professional.",
    },
    learner_traps_vi: ["Đừng giữ văn nói quá nhiều.", "Đừng làm câu quá quan liêu."],
    learner_traps_en: ["Do not keep too much spoken style.", "Do not make the sentence too bureaucratic."],
  },
  {
    id: "pa_c1_final_lock_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "final_acceptance",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ final-acceptance",
    title_rom: "peshkari jawab final-acceptance",
    title_vi: "Final-acceptance phản hồi thuyết trình",
    title_en: "Presentation response final acceptance",
    lock_prompt_vi: "Khóa phản hồi Q&A nếu lịch sự, giới hạn claim và có next step rõ.",
    lock_prompt_en: "Lock the Q&A response if it is polite, limits the claim, and gives a clear next step.",
    sample: {
      pa: "ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ। ਮੌਜੂਦਾ ਅੰਕੜੇ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਪਰ ਅਸੀਂ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਇਸ ਦੀ ਵਧੇਰੇ ਜਾਂਚ ਕਰਾਂਗੇ।",
      rom: "tuhade sawal lai dhanvad. maujuda ankde ikk shuruati rujhan dikhaounde han, par asi agle para vich is di vadhere janch karange.",
      vi: "Cảm ơn câu hỏi của bạn. Số liệu hiện có cho thấy một xu hướng ban đầu, nhưng chúng tôi sẽ kiểm tra thêm ở giai đoạn tiếp theo.",
      en: "Thank you for your question. The current figures show an initial trend, but we will examine it further in the next stage.",
    },
    final_lock_checks_vi: ["Mở đầu lịch sự.", "Claim giới hạn.", "Có next step."],
    final_lock_checks_en: ["Polite opening.", "Limited claim.", "Has a next step."],
    owner_acceptance_checks_vi: ["Không phòng thủ.", "Không né câu hỏi.", "Không hứa kết quả chưa có."],
    owner_acceptance_checks_en: ["Not defensive.", "Does not avoid the question.", "Does not promise unavailable results."],
    pre_integration_notes_vi: ["Dùng được trong presentation module.", "Không cần audio.", "Không cần scoring phát âm."],
    pre_integration_notes_en: ["Usable in a presentation module.", "No audio needed.", "No pronunciation scoring needed."],
    canada_example: {
      context_vi: "Q&A sau presentation trong lớp hoặc nơi làm việc tại Canada.",
      context_en: "Q&A after a presentation in a Canadian class or workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪ੍ਰਸਤੁਤੀ ਸੰਦਰਭ ਵਿੱਚ ਇਹ ਜਵਾਬ ਨਿਮਰਤਾ ਅਤੇ ਸਾਵਧਾਨੀ ਦੋਵੇਂ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de prastuti sandarbh vich ih jawab nimarta ate savdhani dove rakhda hai.",
      vi: "Trong bối cảnh thuyết trình tại Canada, câu trả lời này giữ cả lịch sự và thận trọng.",
      en: "In a Canadian presentation context, this response keeps both politeness and caution.",
    },
    learner_traps_vi: ["Đừng trả lời quá dài.", "Đừng nói chắc quá mức."],
    learner_traps_en: ["Do not answer too long.", "Do not sound overly certain."],
  },
  {
    id: "pa_c1_final_lock_public_professional_service_tone",
    level: "C1",
    area: "public_professional_service_tone",
    mode: "pre_integration",
    title_pa: "ਜਨਤਕ ਪੇਸ਼ਾਵਰ ਸੇਵਾ ਲਹਿਜ਼ਾ pre-integration",
    title_rom: "janatak peshavar seva lehja pre-integration",
    title_vi: "Pre-integration giọng dịch vụ công/chuyên nghiệp",
    title_en: "Public/professional-service tone pre-integration",
    lock_prompt_vi: "Khóa tone dịch vụ công/chuyên nghiệp nếu rõ, lịch sự và action-oriented.",
    lock_prompt_en: "Lock the public/professional-service tone if it is clear, polite, and action-oriented.",
    sample: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਅਰਜ਼ੀ ਦੀ ਜਾਣਕਾਰੀ ਧਿਆਨ ਨਾਲ ਜਾਂਚੋ। ਜੇ ਕੋਈ ਤਬਦੀਲੀ ਲੋੜੀਂਦੀ ਹੋਵੇ, ਤਾਂ ਅਗਲੇ ਕਾਰਜ ਦਿਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਨੂੰ ਦੱਸ ਦਿਓ।",
      rom: "kirpa karke apni arzi di jankari dhian nal janchho. je koi tabdili lorindi hove, tan agle karaj din ton pahlan sanu dass dio.",
      vi: "Vui lòng kiểm tra kỹ thông tin trong đơn. Nếu cần thay đổi, hãy cho chúng tôi biết trước ngày làm việc tiếp theo.",
      en: "Please check your application information carefully. If any change is needed, please let us know before the next business day.",
    },
    final_lock_checks_vi: ["Rõ cho người dân.", "Lịch sự.", "Có action cụ thể."],
    final_lock_checks_en: ["Clear for the public.", "Polite.", "Has a specific action."],
    owner_acceptance_checks_vi: ["Không dùng slang.", "Không có threat tone.", "Không mơ hồ deadline."],
    owner_acceptance_checks_en: ["No slang.", "No threatening tone.", "Not vague about the deadline."],
    pre_integration_notes_vi: ["Hợp bối cảnh dịch vụ công.", "Không chạm Supabase/RLS.", "Chỉ là dữ liệu học tập."],
    pre_integration_notes_en: ["Fits a public-service context.", "Does not touch Supabase or RLS.", "Learning data only."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công tại Canada.",
      context_en: "Public-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਜਨਤਕ ਸੇਵਾ ਸੁਨੇਹਾ ਆਮ ਤੌਰ ਤੇ ਸਪਸ਼ਟ, ਨਿਮਰ ਅਤੇ ਕਾਰਵਾਈ-ਕੇਂਦਰਿਤ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada vich janatak seva suneha aam taur te spasht, nimar ate karvai-kendrit hona chahida hai.",
      vi: "Tại Canada, thông báo dịch vụ công thường nên rõ, lịch sự và hướng đến hành động.",
      en: "In Canada, a public-service notice should usually be clear, polite, and action-oriented.",
    },
    learner_traps_vi: ["Đừng viết như quảng cáo.", "Đừng làm câu quá pháp lý khi không cần."],
    learner_traps_en: ["Do not write like an advertisement.", "Do not make the sentence too legalistic when it is not needed."],
  },
];
