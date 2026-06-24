// Punjabi C1 closure-validation samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1ClosureValidationArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "public_service_register";

export type PunjabiC1ClosureValidationMode =
  | "closure_validation"
  | "final_cross_check"
  | "pre_integration";

export type PunjabiC1ClosureValidationPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1ClosureValidationSample = {
  id: string;
  level: "C1";
  area: PunjabiC1ClosureValidationArea;
  mode: PunjabiC1ClosureValidationMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  closure_prompt_vi: string;
  closure_prompt_en: string;
  sample: PunjabiC1ClosureValidationPhrase;
  closure_checks_vi: readonly string[];
  closure_checks_en: readonly string[];
  final_cross_checks_vi: readonly string[];
  final_cross_checks_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1ClosureValidationPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1ClosureValidationSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1ClosureValidationSamples: PunjabiC1ClosureValidationSample[] = [
  {
    id: "pa_c1_closure_validation_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "closure_validation",
    title_pa: "ਸਰੋਤ ਸਾਰ closure-validation",
    title_rom: "sarot saar closure-validation",
    title_vi: "Closure-validation tóm tắt nguồn",
    title_en: "Source summary closure validation",
    closure_prompt_vi: "Xác nhận summary giữ claim chính, evidence và neutrality trước khi đóng bộ C1.",
    closure_prompt_en: "Confirm that the summary keeps the main claim, evidence, and neutrality before C1 closure.",
    sample: {
      pa: "ਸਰੋਤ ਦੱਸਦਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ, ਅਤੇ ਇਸ ਦਾਅਵੇ ਲਈ ਉਹ ਉਡੀਕ ਸਮੇਂ ਤੇ ਫੀਡਬੈਕ ਨੂੰ ਮੁੱਖ ਸਬੂਤ ਵਜੋਂ ਵਰਤਦਾ ਹੈ।",
      rom: "sarot dassda hai ki spasht sama-rekha bharosa vadha sakdi hai, ate is daave lai oh udik samen te feedback nu mukh sabut vajon vartda hai.",
      vi: "Nguồn nói rằng timeline rõ có thể tăng niềm tin, và dùng thời gian chờ cùng phản hồi làm bằng chứng chính cho claim đó.",
      en: "The source says that a clear timeline can increase trust, and it uses wait times and feedback as the main evidence for that claim.",
    },
    closure_checks_vi: ["Claim và evidence đi cùng nhau.", "Nguồn vẫn là chủ thể.", "Giọng neutral."],
    closure_checks_en: ["Claim and evidence stay together.", "The source remains the subject.", "Neutral tone."],
    final_cross_checks_vi: ["Không thêm opinion.", "Không bỏ evidence chính.", "Không phóng đại nguồn."],
    final_cross_checks_en: ["No added opinion.", "Does not omit main evidence.", "Does not overstate the source."],
    pre_integration_notes_vi: ["Sẵn sàng cho closure review.", "Không cần dữ liệu live.", "Dùng được trong rubric."],
    pre_integration_notes_en: ["Ready for closure review.", "No live data needed.", "Usable in a rubric."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਸਰੋਤ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਜੋੜਦਾ ਹੈ।",
      rom: "Canada de sandarbh vich sarot seva jankari di spashtata nu bharose nal jorda hai.",
      vi: "Trong bối cảnh Canada, nguồn liên hệ sự rõ ràng của thông tin dịch vụ với niềm tin.",
      en: "In the Canadian context, the source connects clarity of service information with trust.",
    },
    learner_traps_vi: ["Đừng biến summary thành critique.", "Đừng bỏ actor là nguồn."],
    learner_traps_en: ["Do not turn the summary into critique.", "Do not drop the source as the actor."],
  },
  {
    id: "pa_c1_closure_validation_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "final_cross_check",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ final-cross-check",
    title_rom: "savdhan daava final-cross-check",
    title_vi: "Final-cross-check claim thận trọng",
    title_en: "Cautious claim final cross-check",
    closure_prompt_vi: "Kiểm tra claim có lực nhưng vẫn giữ giới hạn evidence rõ ràng.",
    closure_prompt_en: "Check that the claim has force while keeping evidence limits clear.",
    sample: {
      pa: "ਮੌਜੂਦਾ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਮੁਲਾਂਕਣ ਦੀ ਲੋੜ ਹੈ।",
      rom: "maujuda ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par vadde padhar te lagu karan ton pahlan hor mulankan di lor hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng cần thêm đánh giá trước khi áp dụng rộng.",
      en: "The current figures suggest that the new process may be helpful, but further evaluation is needed before broad implementation.",
    },
    closure_checks_vi: ["Có hedge.", "Giới hạn scale rõ.", "Claim vẫn có nội dung."],
    closure_checks_en: ["Has hedging.", "Scale limit is clear.", "The claim still has substance."],
    final_cross_checks_vi: ["Không nói chắc từ pilot.", "Không hedge quá nhiều.", "Không tạo claim thời sự."],
    final_cross_checks_en: ["Does not sound certain from a pilot.", "Does not over-hedge.", "No current-news claim."],
    pre_integration_notes_vi: ["Dùng được trong cautious claim closure.", "Không cần dữ liệu ngoài.", "Phù hợp C1."],
    pre_integration_notes_en: ["Usable in cautious-claim closure.", "No outside data required.", "Fits C1."],
    canada_example: {
      context_vi: "Đánh giá pilot trong tổ chức tại Canada.",
      context_en: "Pilot evaluation in an organization in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਦਾ ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਅੰਤਿਮ ਸਬੂਤ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ।",
      rom: "Canada de pilot da natija umidjanak hai, par is nu antim sabut nahin mannna chahida.",
      vi: "Kết quả pilot tại Canada có triển vọng, nhưng không nên xem là bằng chứng cuối cùng.",
      en: "The Canadian pilot result is promising, but it should not be treated as final evidence.",
    },
    learner_traps_vi: ["Đừng dùng chắc chắn khi evidence còn hạn chế.", "Đừng làm claim mơ hồ quá mức."],
    learner_traps_en: ["Do not use certainty when evidence is limited.", "Do not make the claim too vague."],
  },
  {
    id: "pa_c1_closure_validation_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "closure_validation",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ closure-validation",
    title_rom: "sabut tulna closure-validation",
    title_vi: "Closure-validation so sánh bằng chứng",
    title_en: "Evidence comparison closure validation",
    closure_prompt_vi: "Xác nhận hai nguồn evidence được phân biệt rõ và kết luận không vượt dữ liệu.",
    closure_prompt_en: "Confirm that two evidence sources are clearly distinguished and the conclusion does not exceed the data.",
    sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਪੇਸ਼ ਕਰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਭਾਗੀਦਾਰਾਂ ਦੇ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਦੋਵੇਂ ਮਿਲ ਕੇ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਤਸਵੀਰ ਦਿੰਦੇ ਹਨ।",
      rom: "pahla sarot ginti de ank pesh karda hai, jadki duja sarot bhagidaran de anubhav nu ubharda hai; dove mil ke vadhere santulit tasvir dinde han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người tham gia; hai nguồn cùng tạo bức tranh cân bằng hơn.",
      en: "The first source presents numerical data, while the second highlights participant experience; together they provide a more balanced picture.",
    },
    closure_checks_vi: ["Vai trò nguồn rõ.", "Evidence không bị trộn.", "Kết luận vừa mức."],
    closure_checks_en: ["Source roles are clear.", "Evidence is not blended.", "The conclusion is measured."],
    final_cross_checks_vi: ["Không xem hai nguồn giống nhau.", "Không chọn phe quá sớm.", "Không bỏ limitation."],
    final_cross_checks_en: ["Does not treat the sources as identical.", "Does not take a side too early.", "Does not omit limitations."],
    pre_integration_notes_vi: ["Sẵn sàng cho evidence review.", "Dùng được trong workshop.", "Không cần nguồn live."],
    pre_integration_notes_en: ["Ready for evidence review.", "Usable in a workshop.", "No live source needed."],
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
    id: "pa_c1_closure_validation_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín trang trọng",
    title_en: "Formal correspondence pre-integration",
    closure_prompt_vi: "Kiểm tra email có lịch sự, rõ request, không trách móc và đủ formal.",
    closure_prompt_en: "Check that the email is polite, clear in its request, non-blaming, and formal enough.",
    sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਛੋਟਾ ਜਿਹਾ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰ ਦਿਓ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke agle kadam bare chhota jiha update sanjha kar dio.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng chia sẻ cập nhật ngắn về bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please share a brief update on the next step.",
    },
    closure_checks_vi: ["Request rõ.", "Tone lịch sự.", "Không trách người nhận."],
    closure_checks_en: ["Clear request.", "Polite tone.", "Does not blame the recipient."],
    final_cross_checks_vi: ["Không giống chat.", "Không quá vòng vo.", "Không chạm hệ thống email thật."],
    final_cross_checks_en: ["Not chat-like.", "Not overly indirect.", "Does not touch a real email system."],
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
    learner_traps_vi: ["Đừng dùng mệnh lệnh mạnh.", "Đừng viết như nhắn bạn bè."],
    learner_traps_en: ["Do not use strong commands.", "Do not write like messaging a friend."],
  },
  {
    id: "pa_c1_closure_validation_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "closure_validation",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ closure-validation",
    title_rom: "karjakari sankhep closure-validation",
    title_vi: "Closure-validation bản tóm tắt điều hành",
    title_en: "Executive summary closure validation",
    closure_prompt_vi: "Xác nhận summary giữ priority, risk và next step mà không thành báo cáo dài.",
    closure_prompt_en: "Confirm that the summary keeps priority, risk, and next step without becoming a long report.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ, ਜਦਕਿ ਮੁੱਖ ਜੋਖਮ ਖਰਚੇ ਅਤੇ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ; ਅਗਲਾ ਕਦਮ ਛੋਟੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਰੱਖਣਾ ਹੈ।",
      rom: "mukh tarji seva di gunvatta kaim rakhni hai, jadki mukh jokham kharche ate samen nal juria hai; agla kadam chhoti samikhia meeting rakhna hai.",
      vi: "Ưu tiên chính là duy trì chất lượng dịch vụ, trong khi rủi ro chính liên quan đến chi phí và thời gian; bước tiếp theo là tổ chức một buổi review ngắn.",
      en: "The main priority is maintaining service quality, while the main risk concerns cost and time; the next step is to hold a short review meeting.",
    },
    closure_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    closure_checks_en: ["Has a priority.", "Has a risk.", "Has a next step."],
    final_cross_checks_vi: ["Không lan man.", "Không thành list dài.", "Không bỏ action."],
    final_cross_checks_en: ["Does not ramble.", "Does not become a long list.", "Does not omit action."],
    pre_integration_notes_vi: ["Sẵn sàng cho closure.", "Compact cho app data.", "Không cần dữ liệu ngoài."],
    pre_integration_notes_en: ["Ready for closure.", "Compact for app data.", "No outside data required."],
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
    id: "pa_c1_closure_validation_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "final_cross_check",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ final-cross-check",
    title_rom: "peshkari jawab final-cross-check",
    title_vi: "Final-cross-check phản hồi thuyết trình",
    title_en: "Presentation response final cross-check",
    closure_prompt_vi: "Kiểm tra phản hồi Q&A có cảm ơn, trả lời trực tiếp, giới hạn claim và next step.",
    closure_prompt_en: "Check that the Q&A response thanks the questioner, answers directly, limits the claim, and gives a next step.",
    sample: {
      pa: "ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ। ਮੌਜੂਦਾ ਅੰਕੜੇ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਪਰ ਅਸੀਂ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਇਸ ਦੀ ਵਧੇਰੇ ਜਾਂਚ ਕਰਾਂਗੇ।",
      rom: "tuhade sawal lai dhanvad. maujuda ankde ikk shuruati rujhan dikhaounde han, par asi agle para vich is di vadhere janch karange.",
      vi: "Cảm ơn câu hỏi của bạn. Số liệu hiện có cho thấy một xu hướng ban đầu, nhưng chúng tôi sẽ kiểm tra thêm ở giai đoạn tiếp theo.",
      en: "Thank you for your question. The current figures show an initial trend, but we will examine it further in the next stage.",
    },
    closure_checks_vi: ["Cảm ơn rõ.", "Claim giới hạn.", "Có next step."],
    closure_checks_en: ["Clear thanks.", "Limited claim.", "Has a next step."],
    final_cross_checks_vi: ["Không phòng thủ.", "Không né câu hỏi.", "Không hứa kết quả chưa có."],
    final_cross_checks_en: ["Not defensive.", "Does not avoid the question.", "Does not promise unavailable results."],
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
    id: "pa_c1_closure_validation_public_service_register",
    level: "C1",
    area: "public_service_register",
    mode: "pre_integration",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਰਜਿਸਟਰ pre-integration",
    title_rom: "janatak seva register pre-integration",
    title_vi: "Pre-integration register dịch vụ công",
    title_en: "Public-service register pre-integration",
    closure_prompt_vi: "Kiểm tra register dịch vụ công có rõ, lịch sự, không quá thân mật và không quá quan liêu.",
    closure_prompt_en: "Check that the public-service register is clear, polite, not too casual, and not too bureaucratic.",
    sample: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਅਰਜ਼ੀ ਦੀ ਜਾਣਕਾਰੀ ਧਿਆਨ ਨਾਲ ਜਾਂਚੋ। ਜੇ ਕੋਈ ਤਬਦੀਲੀ ਲੋੜੀਂਦੀ ਹੋਵੇ, ਤਾਂ ਅਗਲੇ ਕਾਰਜ ਦਿਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਨੂੰ ਦੱਸ ਦਿਓ।",
      rom: "kirpa karke apni arzi di jankari dhian nal janchho. je koi tabdili lorindi hove, tan agle karaj din ton pahlan sanu dass dio.",
      vi: "Vui lòng kiểm tra kỹ thông tin trong đơn. Nếu cần thay đổi, hãy cho chúng tôi biết trước ngày làm việc tiếp theo.",
      en: "Please check your application information carefully. If any change is needed, please let us know before the next business day.",
    },
    closure_checks_vi: ["Rõ cho người dân.", "Lịch sự.", "Không quá quan liêu."],
    closure_checks_en: ["Clear for the public.", "Polite.", "Not overly bureaucratic."],
    final_cross_checks_vi: ["Không dùng slang.", "Không dùng threat tone.", "Không mơ hồ về deadline."],
    final_cross_checks_en: ["No slang.", "No threatening tone.", "Not vague about the deadline."],
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
