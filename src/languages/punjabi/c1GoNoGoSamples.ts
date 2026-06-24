// Punjabi C1 go/no-go samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1GoNoGoArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response"
  | "public_professional_tone";

export type PunjabiC1GoNoGoMode =
  | "go_no_go"
  | "release_candidate"
  | "closure_validation"
  | "pre_integration";

export type PunjabiC1GoNoGoPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1GoNoGoSample = {
  id: string;
  level: "C1";
  area: PunjabiC1GoNoGoArea;
  mode: PunjabiC1GoNoGoMode;
  decision: "go" | "no_go_review";
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  decision_prompt_vi: string;
  decision_prompt_en: string;
  sample: PunjabiC1GoNoGoPhrase;
  go_checks_vi: readonly string[];
  go_checks_en: readonly string[];
  no_go_triggers_vi: readonly string[];
  no_go_triggers_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1GoNoGoPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1GoNoGoSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1GoNoGoSamples: PunjabiC1GoNoGoSample[] = [
  {
    id: "pa_c1_go_no_go_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "go_no_go",
    decision: "go",
    title_pa: "ਸਰੋਤ ਸਾਰ go-no-go",
    title_rom: "sarot saar go-no-go",
    title_vi: "Go/no-go tóm tắt nguồn",
    title_en: "Source summary go/no-go",
    decision_prompt_vi: "Quyết định sample summary có đủ rõ để go hay cần no-go review.",
    decision_prompt_en: "Decide whether the summary sample is clear enough to go or needs no-go review.",
    sample: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ, ਅਤੇ ਇਹ ਗੱਲ ਉਡੀਕ ਸਮੇਂ ਤੇ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਿਤ ਹੈ।",
      rom: "sarot da mukh daava hai ki spasht sama-rekha bharosa vadha sakdi hai, ate ih gal udik samen te feedback nal samarthit hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin, và điều này được hỗ trợ bằng thời gian chờ cùng phản hồi.",
      en: "The source's main claim is that a clear timeline can increase trust, and this is supported by wait times and feedback.",
    },
    go_checks_vi: ["Claim rõ.", "Evidence đi kèm.", "Giọng neutral."],
    go_checks_en: ["Clear claim.", "Evidence included.", "Neutral tone."],
    no_go_triggers_vi: ["Thêm opinion cá nhân.", "Bỏ evidence chính.", "Phóng đại nguồn."],
    no_go_triggers_en: ["Adds personal opinion.", "Drops main evidence.", "Overstates the source."],
    pre_integration_notes_vi: ["Sẵn sàng cho go/no-go review.", "Không cần dữ liệu live.", "Dùng được trong rubric."],
    pre_integration_notes_en: ["Ready for go/no-go review.", "No live data needed.", "Usable in a rubric."],
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
    id: "pa_c1_go_no_go_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "release_candidate",
    decision: "go",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ release-candidate",
    title_rom: "savdhan daava release-candidate",
    title_vi: "Release-candidate claim thận trọng",
    title_en: "Cautious claim release candidate",
    decision_prompt_vi: "Kiểm tra claim có đủ mạnh để go nhưng vẫn không vượt evidence.",
    decision_prompt_en: "Check that the claim is strong enough to go while not exceeding the evidence.",
    sample: {
      pa: "ਮੌਜੂਦਾ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਮੁਲਾਂਕਣ ਦੀ ਲੋੜ ਹੈ।",
      rom: "maujuda ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par vadde padhar te lagu karan ton pahlan hor mulankan di lor hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng cần thêm đánh giá trước khi áp dụng rộng.",
      en: "The current figures suggest that the new process may be helpful, but further evaluation is needed before broad implementation.",
    },
    go_checks_vi: ["Có hedge.", "Có giới hạn scale.", "Claim vẫn rõ."],
    go_checks_en: ["Has hedging.", "Has a scale limit.", "The claim remains clear."],
    no_go_triggers_vi: ["Nói chắc từ pilot nhỏ.", "Hedge đến mơ hồ.", "Tạo claim thời sự."],
    no_go_triggers_en: ["Sounds certain from a small pilot.", "Hedges into vagueness.", "Creates a current-news claim."],
    pre_integration_notes_vi: ["Dùng được trong cautious-claim review.", "Không cần nguồn ngoài.", "Phù hợp C1."],
    pre_integration_notes_en: ["Usable in cautious-claim review.", "No outside source needed.", "Fits C1."],
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
    id: "pa_c1_go_no_go_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "closure_validation",
    decision: "go",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ closure-validation",
    title_rom: "sabut tulna closure-validation",
    title_vi: "Closure-validation so sánh bằng chứng",
    title_en: "Evidence comparison closure validation",
    decision_prompt_vi: "Quyết định comparison có giữ vai trò nguồn và kết luận vừa mức không.",
    decision_prompt_en: "Decide whether the comparison keeps source roles and a measured conclusion.",
    sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਪੇਸ਼ ਕਰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਭਾਗੀਦਾਰਾਂ ਦੇ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਦੋਵੇਂ ਮਿਲ ਕੇ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਤਸਵੀਰ ਦਿੰਦੇ ਹਨ।",
      rom: "pahla sarot ginti de ank pesh karda hai, jadki duja sarot bhagidaran de anubhav nu ubharda hai; dove mil ke vadhere santulit tasvir dinde han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người tham gia; hai nguồn cùng tạo bức tranh cân bằng hơn.",
      en: "The first source presents numerical data, while the second highlights participant experience; together they provide a more balanced picture.",
    },
    go_checks_vi: ["Vai trò nguồn rõ.", "Comparison rõ.", "Kết luận vừa mức."],
    go_checks_en: ["Source roles are clear.", "Comparison is clear.", "Measured conclusion."],
    no_go_triggers_vi: ["Trộn evidence.", "Chọn phe quá sớm.", "Bỏ limitation."],
    no_go_triggers_en: ["Blends evidence.", "Takes a side too early.", "Omits limitations."],
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
    id: "pa_c1_go_no_go_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    decision: "go",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín trang trọng",
    title_en: "Formal correspondence pre-integration",
    decision_prompt_vi: "Kiểm tra email formal có đủ rõ, lịch sự và không giống chat để go.",
    decision_prompt_en: "Check that the formal email is clear, polite, and not chat-like enough to go.",
    sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਛੋਟਾ ਜਿਹਾ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰ ਦਿਓ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke agle kadam bare chhota jiha update sanjha kar dio.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng chia sẻ cập nhật ngắn về bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please share a brief update on the next step.",
    },
    go_checks_vi: ["Request rõ.", "Tone lịch sự.", "Độ formal đủ."],
    go_checks_en: ["Clear request.", "Polite tone.", "Formal enough."],
    no_go_triggers_vi: ["Có blaming tone.", "Quá vòng vo.", "Giống tin nhắn bạn bè."],
    no_go_triggers_en: ["Has a blaming tone.", "Too indirect.", "Sounds like a message to a friend."],
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
    id: "pa_c1_go_no_go_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "go_no_go",
    decision: "go",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ go-no-go",
    title_rom: "karjakari sankhep go-no-go",
    title_vi: "Go/no-go bản tóm tắt điều hành",
    title_en: "Executive summary go/no-go",
    decision_prompt_vi: "Xác nhận summary đủ gọn để go nhưng vẫn giữ priority, risk và next step.",
    decision_prompt_en: "Confirm that the summary is concise enough to go while keeping priority, risk, and next step.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ, ਜਦਕਿ ਮੁੱਖ ਜੋਖਮ ਖਰਚੇ ਅਤੇ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ; ਅਗਲਾ ਕਦਮ ਛੋਟੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਰੱਖਣਾ ਹੈ।",
      rom: "mukh tarji seva di gunvatta kaim rakhni hai, jadki mukh jokham kharche ate samen nal juria hai; agla kadam chhoti samikhia meeting rakhna hai.",
      vi: "Ưu tiên chính là duy trì chất lượng dịch vụ, trong khi rủi ro chính liên quan đến chi phí và thời gian; bước tiếp theo là tổ chức một buổi review ngắn.",
      en: "The main priority is maintaining service quality, while the main risk concerns cost and time; the next step is to hold a short review meeting.",
    },
    go_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    go_checks_en: ["Has a priority.", "Has a risk.", "Has a next step."],
    no_go_triggers_vi: ["Lan man.", "Thành report dài.", "Bỏ action."],
    no_go_triggers_en: ["Rambles.", "Becomes a long report.", "Omits action."],
    pre_integration_notes_vi: ["Sẵn sàng cho go/no-go review.", "Compact cho app data.", "Không cần dữ liệu ngoài."],
    pre_integration_notes_en: ["Ready for go/no-go review.", "Compact for app data.", "No outside data required."],
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
    id: "pa_c1_go_no_go_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "release_candidate",
    decision: "go",
    title_pa: "ਰਜਿਸਟਰ calibration release-candidate",
    title_rom: "register calibration release-candidate",
    title_vi: "Release-candidate chỉnh register",
    title_en: "Register calibration release candidate",
    decision_prompt_vi: "Quyết định register có professional, rõ và không quá thân mật để go không.",
    decision_prompt_en: "Decide whether the register is professional, clear, and not too casual enough to go.",
    sample: {
      pa: "ਇਹ ਗੱਲ ਦਿਲਚਸਪ ਹੈ, ਪਰ ਰਿਪੋਰਟ ਵਿੱਚ ਇਸ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਲਿਖਣਾ ਵਧੀਆ ਰਹੇਗਾ ਕਿ ਨਤੀਜੇ ਨੂੰ ਹੋਰ ਸਮੀਖਿਆ ਨਾਲ ਜੋੜਿਆ ਜਾਵੇ।",
      rom: "ih gal dilchasp hai, par report vich is nu is tarah likhna vadhia rahega ki natije nu hor samikhia nal joria jave.",
      vi: "Ý này thú vị, nhưng trong báo cáo nên viết theo cách liên hệ kết quả với thêm phần xem xét.",
      en: "This point is interesting, but in a report it is better to connect the result with further review.",
    },
    go_checks_vi: ["Professional.", "Giữ ý gốc.", "Không quá lạnh."],
    go_checks_en: ["Professional.", "Keeps original meaning.", "Not too cold."],
    no_go_triggers_vi: ["Dịch word-by-word từ văn nói.", "Quá casual.", "Đổi nghĩa."],
    no_go_triggers_en: ["Translates spoken style word for word.", "Too casual.", "Changes meaning."],
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
    id: "pa_c1_go_no_go_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "closure_validation",
    decision: "go",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ closure-validation",
    title_rom: "peshkari jawab closure-validation",
    title_vi: "Closure-validation phản hồi thuyết trình",
    title_en: "Presentation response closure validation",
    decision_prompt_vi: "Kiểm tra phản hồi Q&A có đủ lịch sự, giới hạn claim và next step để go.",
    decision_prompt_en: "Check that the Q&A response is polite, limits the claim, and has a next step enough to go.",
    sample: {
      pa: "ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ। ਮੌਜੂਦਾ ਅੰਕੜੇ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਪਰ ਅਸੀਂ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਇਸ ਦੀ ਵਧੇਰੇ ਜਾਂਚ ਕਰਾਂਗੇ।",
      rom: "tuhade sawal lai dhanvad. maujuda ankde ikk shuruati rujhan dikhaounde han, par asi agle para vich is di vadhere janch karange.",
      vi: "Cảm ơn câu hỏi của bạn. Số liệu hiện có cho thấy một xu hướng ban đầu, nhưng chúng tôi sẽ kiểm tra thêm ở giai đoạn tiếp theo.",
      en: "Thank you for your question. The current figures show an initial trend, but we will examine it further in the next stage.",
    },
    go_checks_vi: ["Mở đầu lịch sự.", "Claim giới hạn.", "Có next step."],
    go_checks_en: ["Polite opening.", "Limited claim.", "Has a next step."],
    no_go_triggers_vi: ["Phòng thủ.", "Né câu hỏi.", "Hứa kết quả chưa có."],
    no_go_triggers_en: ["Defensive.", "Avoids the question.", "Promises unavailable results."],
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
    id: "pa_c1_go_no_go_public_professional_tone",
    level: "C1",
    area: "public_professional_tone",
    mode: "pre_integration",
    decision: "go",
    title_pa: "ਜਨਤਕ ਪੇਸ਼ਾਵਰ ਲਹਿਜ਼ਾ pre-integration",
    title_rom: "janatak peshavar lehja pre-integration",
    title_vi: "Pre-integration giọng công vụ/chuyên nghiệp",
    title_en: "Public/professional tone pre-integration",
    decision_prompt_vi: "Kiểm tra tone công vụ/chuyên nghiệp rõ, lịch sự và action-oriented để go.",
    decision_prompt_en: "Check that the public/professional tone is clear, polite, and action-oriented enough to go.",
    sample: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਅਰਜ਼ੀ ਦੀ ਜਾਣਕਾਰੀ ਧਿਆਨ ਨਾਲ ਜਾਂਚੋ। ਜੇ ਕੋਈ ਤਬਦੀਲੀ ਲੋੜੀਂਦੀ ਹੋਵੇ, ਤਾਂ ਅਗਲੇ ਕਾਰਜ ਦਿਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਨੂੰ ਦੱਸ ਦਿਓ।",
      rom: "kirpa karke apni arzi di jankari dhian nal janchho. je koi tabdili lorindi hove, tan agle karaj din ton pahlan sanu dass dio.",
      vi: "Vui lòng kiểm tra kỹ thông tin trong đơn. Nếu cần thay đổi, hãy cho chúng tôi biết trước ngày làm việc tiếp theo.",
      en: "Please check your application information carefully. If any change is needed, please let us know before the next business day.",
    },
    go_checks_vi: ["Rõ cho người dân.", "Lịch sự.", "Có action cụ thể."],
    go_checks_en: ["Clear for the public.", "Polite.", "Has a specific action."],
    no_go_triggers_vi: ["Dùng slang.", "Có threat tone.", "Mơ hồ deadline."],
    no_go_triggers_en: ["Uses slang.", "Has a threatening tone.", "Vague about the deadline."],
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
