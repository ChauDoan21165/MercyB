// Punjabi C1 release-candidate samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1ReleaseCandidateArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response"
  | "public_professional_service_tone";

export type PunjabiC1ReleaseCandidateMode =
  | "release_candidate"
  | "closure_validation"
  | "pre_integration";

export type PunjabiC1ReleaseCandidatePhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1ReleaseCandidateSample = {
  id: string;
  level: "C1";
  area: PunjabiC1ReleaseCandidateArea;
  mode: PunjabiC1ReleaseCandidateMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  release_prompt_vi: string;
  release_prompt_en: string;
  sample: PunjabiC1ReleaseCandidatePhrase;
  release_checks_vi: readonly string[];
  release_checks_en: readonly string[];
  closure_validation_vi: readonly string[];
  closure_validation_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1ReleaseCandidatePhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1ReleaseCandidateSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1ReleaseCandidateSamples: PunjabiC1ReleaseCandidateSample[] = [
  {
    id: "pa_c1_release_candidate_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "release_candidate",
    title_pa: "ਸਰੋਤ ਸਾਰ release candidate",
    title_rom: "sarot saar release candidate",
    title_vi: "Release candidate tóm tắt nguồn",
    title_en: "Source summary release candidate",
    release_prompt_vi: "Xác nhận summary giữ claim và evidence của nguồn mà không thêm đánh giá cá nhân.",
    release_prompt_en: "Confirm that the summary keeps the source claim and evidence without adding personal evaluation.",
    sample: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ, ਅਤੇ ਇਸ ਨੂੰ ਉਡੀਕ ਸਮੇਂ ਤੇ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਨ ਮਿਲਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai, ate is nu udik samen te feedback nal samarthan milda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin, và điều này được hỗ trợ bằng thời gian chờ cùng phản hồi.",
      en: "The source's main claim is that a clear timeline can increase trust, and this is supported by wait times and feedback.",
    },
    release_checks_vi: ["Nguồn là chủ thể.", "Claim đi cùng evidence.", "Không thêm opinion."],
    release_checks_en: ["The source is the subject.", "Claim stays with evidence.", "No added opinion."],
    closure_validation_vi: ["Không thành review.", "Không bỏ evidence chính.", "Giữ neutrality."],
    closure_validation_en: ["Does not become a review.", "Does not drop main evidence.", "Keeps neutrality."],
    pre_integration_notes_vi: ["Sẵn sàng cho release review.", "Dễ đưa vào rubric.", "Không cần nguồn ngoài."],
    pre_integration_notes_en: ["Ready for release review.", "Easy to place in a rubric.", "No outside source required."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸਰੋਤ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
      rom: "Canada de sarot vich seva jankari di spashtata nu bharose nal joria gaya hai.",
      vi: "Trong nguồn tại Canada, sự rõ ràng của thông tin dịch vụ được liên hệ với niềm tin.",
      en: "In the Canadian source, clarity of service information is linked to trust.",
    },
    learner_traps_vi: ["Đừng biến summary thành nhận xét.", "Đừng bỏ evidence để viết ngắn."],
    learner_traps_en: ["Do not turn the summary into commentary.", "Do not drop evidence just to be brief."],
  },
  {
    id: "pa_c1_release_candidate_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "closure_validation",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ closure validation",
    title_rom: "savdhan daava closure validation",
    title_vi: "Closure validation claim thận trọng",
    title_en: "Cautious claim closure validation",
    release_prompt_vi: "Kiểm tra claim có lực nhưng không vượt phạm vi dữ liệu.",
    release_prompt_en: "Check that the claim has force without exceeding the data scope.",
    sample: {
      pa: "ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਹਾਲਾਂਕਿ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਮੁਲਾਂਕਣ ਲੋੜੀਂਦਾ ਹੈ।",
      rom: "ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, halanki vadde padhar te lagu karan ton pahlan hor mulankan lorinda hai.",
      vi: "Số liệu gợi ý quy trình mới có thể hữu ích, tuy nhiên cần thêm đánh giá trước khi áp dụng rộng.",
      en: "The figures suggest that the new process may be helpful, although further evaluation is needed before broad implementation.",
    },
    release_checks_vi: ["Có hedge.", "Giới hạn triển khai rõ.", "Ý chính vẫn mạnh."],
    release_checks_en: ["Has hedging.", "Implementation limit is clear.", "Main point remains strong."],
    closure_validation_vi: ["Không overclaim.", "Không hedge đến mơ hồ.", "Không tạo claim thời sự."],
    closure_validation_en: ["Does not overclaim.", "Not hedged into vagueness.", "No current-news claim."],
    pre_integration_notes_vi: ["Dùng được trong cautious-claim review.", "Không cần dữ liệu live.", "Hợp C1 academic."],
    pre_integration_notes_en: ["Usable in cautious-claim review.", "No live data required.", "Fits C1 academic work."],
    canada_example: {
      context_vi: "Đánh giá pilot tại Canada.",
      context_en: "Pilot evaluation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਦਾ ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਅੰਤਿਮ ਸਬੂਤ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ।",
      rom: "Canada de pilot da natija umidjanak hai, par is nu antim sabut nahin mannna chahida.",
      vi: "Kết quả pilot tại Canada có triển vọng, nhưng không nên xem là bằng chứng cuối cùng.",
      en: "The Canadian pilot result is promising, but it should not be treated as final evidence.",
    },
    learner_traps_vi: ["Đừng nói chắc từ mẫu nhỏ.", "Đừng hedge nhiều đến mức mất claim."],
    learner_traps_en: ["Do not sound certain from a small sample.", "Do not hedge so much that the claim disappears."],
  },
  {
    id: "pa_c1_release_candidate_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "release_candidate",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ release candidate",
    title_rom: "sabut tulna release candidate",
    title_vi: "Release candidate so sánh bằng chứng",
    title_en: "Evidence comparison release candidate",
    release_prompt_vi: "Xác nhận hai nguồn được so sánh rõ về vai trò, giới hạn và quan hệ bổ sung.",
    release_prompt_en: "Confirm that two sources are compared clearly by role, limitation, and complementary relationship.",
    sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਵਰਤੋਂਕਾਰ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਇਸ ਲਈ ਦੋਵੇਂ ਸਬੂਤ ਵੱਖਰੇ ਪਰ ਪੂਰਕ ਹਨ।",
      rom: "pahla sarot ginti de ank dinda hai, jadki duja sarot vartokar anubhav nu ubharda hai; is lai dove sabut vakhre par purak han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người dùng; vì vậy hai loại bằng chứng khác nhau nhưng bổ sung nhau.",
      en: "The first source provides numerical data, while the second highlights user experience; the two forms of evidence are different but complementary.",
    },
    release_checks_vi: ["Vai trò từng nguồn rõ.", "Không trộn evidence.", "Quan hệ bổ sung rõ."],
    release_checks_en: ["Each source role is clear.", "Evidence is not blended.", "Complementary relationship is clear."],
    closure_validation_vi: ["Không xóa khác biệt.", "Không kết luận quá rộng.", "Giữ logic so sánh."],
    closure_validation_en: ["Does not erase differences.", "Does not conclude too broadly.", "Keeps comparison logic."],
    pre_integration_notes_vi: ["Hợp evidence workshop.", "Dùng được trước release.", "Không cần nguồn ngoài."],
    pre_integration_notes_en: ["Fits an evidence workshop.", "Usable before release.", "No outside source required."],
    canada_example: {
      context_vi: "So sánh số liệu và trải nghiệm cộng đồng tại Canada.",
      context_en: "Comparing figures and community experience in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਭਾਈਚਾਰੇ ਦੇ ਤਜਰਬੇ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਨਤੀਜਾ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਬਣਦਾ ਹੈ।",
      rom: "Canada vich ankde ate bhaichare de tajarbe ikathe vekhan nal natija vadhere santulit bannda hai.",
      vi: "Tại Canada, xem số liệu cùng trải nghiệm cộng đồng giúp kết luận cân bằng hơn.",
      en: "In Canada, considering figures together with community experience makes the conclusion more balanced.",
    },
    learner_traps_vi: ["Đừng xem hai nguồn giống nhau.", "Đừng chọn phe quá sớm."],
    learner_traps_en: ["Do not treat the two sources as identical.", "Do not take a side too early."],
  },
  {
    id: "pa_c1_release_candidate_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín trang trọng",
    title_en: "Formal correspondence pre-integration",
    release_prompt_vi: "Kiểm tra email follow-up lịch sự, rõ request và không giống chat.",
    release_prompt_en: "Check that the follow-up email is polite, clear in request, and not chat-like.",
    sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਛੋਟਾ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰ ਦਿਓ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke agle kadam bare chhota update sanjha kar dio.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng chia sẻ cập nhật ngắn về bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please share a brief update on the next step.",
    },
    release_checks_vi: ["Lịch sự.", "Request rõ.", "Không trách móc."],
    release_checks_en: ["Polite.", "Clear request.", "No blaming."],
    closure_validation_vi: ["Không giống chat.", "Không dùng mệnh lệnh mạnh.", "Không vòng vo quá mức."],
    closure_validation_en: ["Not chat-like.", "No overly strong commands.", "Not overly indirect."],
    pre_integration_notes_vi: ["Dùng được trong workplace module.", "Không cần hệ thống email thật.", "Không đụng auth hay billing."],
    pre_integration_notes_en: ["Usable in a workplace module.", "No real email system needed.", "Does not touch auth or billing."],
    canada_example: {
      context_vi: "Email follow-up trong môi trường làm việc tại Canada.",
      context_en: "Follow-up email in a Canadian workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੰਮਕਾਜੀ ਸੰਦਰਭ ਵਿੱਚ ਸਿੱਧੀ ਪਰ ਨਿਮਰ ਬੇਨਤੀ ਆਮ ਤੌਰ ਤੇ ਢੰਗੀ ਰਹਿੰਦੀ ਹੈ।",
      rom: "Canada de kamkaji sandarbh vich sidhhi par nimar benati aam taur te dangi rahindi hai.",
      vi: "Trong môi trường làm việc tại Canada, yêu cầu thẳng nhưng lịch sự thường phù hợp.",
      en: "In a Canadian workplace context, a direct but polite request is usually appropriate.",
    },
    learner_traps_vi: ["Đừng viết như chat với bạn.", "Đừng làm request mơ hồ."],
    learner_traps_en: ["Do not write like a chat with a friend.", "Do not make the request vague."],
  },
  {
    id: "pa_c1_release_candidate_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "release_candidate",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ release candidate",
    title_rom: "karjakari sankhep release candidate",
    title_vi: "Release candidate bản tóm tắt điều hành",
    title_en: "Executive summary release candidate",
    release_prompt_vi: "Kiểm tra summary giữ priority, risk và next step trong một đoạn ngắn.",
    release_prompt_en: "Check that the summary keeps priority, risk, and next step in one short paragraph.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ; ਮੁੱਖ ਜੋਖਮ ਖਰਚੇ ਅਤੇ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ; ਅਗਲਾ ਕਦਮ ਛੋਟੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਰੱਖਣਾ ਹੈ।",
      rom: "mukh tarji seva di gunvatta kaim rakhni hai; mukh jokham kharche ate samen nal juria hai; agla kadam chhoti samikhia meeting rakhna hai.",
      vi: "Ưu tiên chính là duy trì chất lượng dịch vụ; rủi ro chính liên quan đến chi phí và thời gian; bước tiếp theo là tổ chức một buổi review ngắn.",
      en: "The main priority is maintaining service quality; the main risk concerns cost and time; the next step is to hold a short review meeting.",
    },
    release_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    release_checks_en: ["Has priority.", "Has risk.", "Has next step."],
    closure_validation_vi: ["Không lan man.", "Không thành list dài.", "Không mất giọng executive."],
    closure_validation_en: ["Does not ramble.", "Does not become a long list.", "Does not lose executive tone."],
    pre_integration_notes_vi: ["Sẵn sàng release review.", "Compact cho app data.", "Không cần dữ liệu ngoài."],
    pre_integration_notes_en: ["Ready for release review.", "Compact for app data.", "No outside data required."],
    canada_example: {
      context_vi: "Tóm tắt chương trình cộng đồng tại Canada.",
      context_en: "Community program summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਭਾਈਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਲਈ ਇਹ ਸੰਖੇਪ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਸਪਸ਼ਟ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de bhaicharak program lai ih sankhep tarji, jokham ate agle kadam nu spasht rakhda hai.",
      vi: "Cho chương trình cộng đồng tại Canada, bản tóm tắt này giữ priority, risk và next step rõ ràng.",
      en: "For a community program in Canada, this summary keeps the priority, risk, and next step clear.",
    },
    learner_traps_vi: ["Đừng viết thành báo cáo đầy đủ.", "Đừng quên next step."],
    learner_traps_en: ["Do not write a full report.", "Do not forget the next step."],
  },
  {
    id: "pa_c1_release_candidate_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "closure_validation",
    title_pa: "ਰਜਿਸਟਰ calibration closure validation",
    title_rom: "register calibration closure validation",
    title_vi: "Closure validation chỉnh register",
    title_en: "Register calibration closure validation",
    release_prompt_vi: "Kiểm tra câu đã chuyển từ thân mật sang formal mà vẫn tự nhiên và rõ nghĩa.",
    release_prompt_en: "Check that the sentence has shifted from casual to formal while staying natural and clear.",
    sample: {
      pa: "ਚੰਗਾ ਲੱਗਿਆ ਵਾਲੀ ਬੋਲੀ ਨੂੰ ਰਿਪੋਰਟ ਵਿੱਚ ਇਹ ਰੂਪ ਦਿੱਤਾ ਜਾ ਸਕਦਾ ਹੈ: ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "changa laggia vali boli nu report vich ih rup ditta ja sakda hai: natija umidjanak hai, par hor samikhia lorindi hai.",
      vi: "Cách nói kiểu 'thấy tốt' có thể chuyển trong report thành: kết quả có triển vọng, nhưng cần xem xét thêm.",
      en: "A phrase like 'it seems good' can be recast in a report as: the result is promising, but further review is needed.",
    },
    release_checks_vi: ["Có chuyển register.", "Formal tự nhiên.", "Không mất ý ban đầu."],
    release_checks_en: ["Register shift is present.", "Formal version is natural.", "Original meaning is not lost."],
    closure_validation_vi: ["Không dịch word-for-word.", "Không quá nặng.", "Không quá đời thường."],
    closure_validation_en: ["No word-for-word casual transfer.", "Not too heavy.", "Not too casual."],
    pre_integration_notes_vi: ["Dùng được làm learner trap.", "Hợp release candidate.", "Không cần pronunciation scoring."],
    pre_integration_notes_en: ["Usable as a learner trap.", "Fits release candidate review.", "No pronunciation scoring needed."],
    canada_example: {
      context_vi: "Hiệu chỉnh register cho báo cáo tại Canada.",
      context_en: "Register calibration for a Canadian report.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਸਧਾਰਨ ਟਿੱਪਣੀ ਨੂੰ ਮਾਪੇ ਹੋਏ ਦਾਅਵੇ ਵਿੱਚ ਬਦਲਣਾ ਜ਼ਰੂਰੀ ਹੈ।",
      rom: "Canada di report vich sadharan tippani nu mape hoe daave vich badalna zaruri hai.",
      vi: "Trong báo cáo tại Canada, cần chuyển nhận xét thường ngày thành claim có mức độ.",
      en: "In a Canadian report, a casual comment should be changed into a measured claim.",
    },
    learner_traps_vi: ["Đừng giữ giọng thân mật.", "Đừng làm formal đến mức khó hiểu."],
    learner_traps_en: ["Do not keep the casual tone.", "Do not make the formal version hard to understand."],
  },
  {
    id: "pa_c1_release_candidate_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ pre-integration",
    title_rom: "peshkari jawab pre-integration",
    title_vi: "Pre-integration phản hồi thuyết trình",
    title_en: "Presentation response pre-integration",
    release_prompt_vi: "Kiểm tra phản hồi Q&A lịch sự, giới hạn claim và trả lời trực tiếp.",
    release_prompt_en: "Check that the Q&A response is polite, limits the claim, and answers directly.",
    sample: {
      pa: "ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ। ਮੌਜੂਦਾ ਅੰਕੜੇ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਪਰ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਇਸ ਦੀ ਵਧੇਰੇ ਜਾਂਚ ਲੋੜੀਂਦੀ ਰਹੇਗੀ।",
      rom: "tuhade sawal lai dhanvad. maujuda ankde ikk shuruati rujhan dikhaounde han, par agle para vich is di vadhere janch lorindi rahegi.",
      vi: "Cảm ơn câu hỏi của bạn. Số liệu hiện có cho thấy một xu hướng ban đầu, nhưng ở giai đoạn tiếp theo vẫn cần kiểm tra thêm.",
      en: "Thank you for your question. The current figures show an initial trend, but further examination will still be needed in the next stage.",
    },
    release_checks_vi: ["Mở đầu lịch sự.", "Claim có giới hạn.", "Trả lời trực tiếp."],
    release_checks_en: ["Polite opening.", "Limited claim.", "Answers directly."],
    closure_validation_vi: ["Không phòng thủ.", "Không chắc quá mức.", "Không né câu hỏi."],
    closure_validation_en: ["Not defensive.", "Not overly certain.", "Does not avoid the question."],
    pre_integration_notes_vi: ["Dùng được trong presentation module.", "Không cần scoring phát âm.", "Hợp Q&A practice."],
    pre_integration_notes_en: ["Usable in a presentation module.", "No pronunciation scoring needed.", "Fits Q&A practice."],
    canada_example: {
      context_vi: "Q&A sau presentation trong lớp hoặc nơi làm việc tại Canada.",
      context_en: "Q&A after a presentation in a Canadian class or workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪ੍ਰਸਤੁਤੀ ਸੰਦਰਭ ਵਿੱਚ ਇਹ ਜਵਾਬ ਨਿਮਰਤਾ ਅਤੇ ਸਾਵਧਾਨੀ ਦੋਵੇਂ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de prastuti sandarbh vich ih jawab nimarta ate savdhani dove rakhda hai.",
      vi: "Trong bối cảnh thuyết trình tại Canada, câu trả lời này giữ cả lịch sự và thận trọng.",
      en: "In a Canadian presentation context, this response keeps both politeness and caution.",
    },
    learner_traps_vi: ["Đừng trả lời quá dài.", "Đừng hứa kết quả chưa có."],
    learner_traps_en: ["Do not answer too long.", "Do not promise results that are not available."],
  },
  {
    id: "pa_c1_release_candidate_public_professional_service_tone",
    level: "C1",
    area: "public_professional_service_tone",
    mode: "release_candidate",
    title_pa: "ਜਨਤਕ ਸੇਵਾ tone release candidate",
    title_rom: "jantak seva tone release candidate",
    title_vi: "Release candidate tone chuyên nghiệp/dịch vụ công",
    title_en: "Public/professional-service tone release candidate",
    release_prompt_vi: "Kiểm tra thông báo dịch vụ công rõ người đọc, hành động tiếp theo và tone trung lập.",
    release_prompt_en: "Check that the public-service notice is clear about reader, next action, and neutral tone.",
    sample: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਲਾਗੂ ਹੋਵੇਗੀ। ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ ਦੀ ਮੀਟਿੰਗ ਬੁਕ ਹੈ, ਉਨ੍ਹਾਂ ਨੂੰ ਨਵਾਂ ਸਮਾਂ ਈਮੇਲ ਰਾਹੀਂ ਮਿਲੇਗਾ।",
      rom: "seva samen vich tabdili agle somvar ton lagu hovegi. jinhan lokan di meeting book hai, unha nu nava sama email rahin milega.",
      vi: "Thay đổi giờ dịch vụ sẽ áp dụng từ thứ Hai tới. Người đã đặt lịch sẽ nhận giờ mới qua email.",
      en: "The service-hours change will take effect next Monday. People with booked appointments will receive a new time by email.",
    },
    release_checks_vi: ["Người bị ảnh hưởng rõ.", "Hành động tiếp theo rõ.", "Tone trung lập."],
    release_checks_en: ["Affected readers are clear.", "Next action is clear.", "Tone is neutral."],
    closure_validation_vi: ["Không có jargon nội bộ.", "Không giống email thân mật.", "Không thiếu thông tin hỗ trợ."],
    closure_validation_en: ["No internal jargon.", "Not like a casual email.", "Support information is not missing."],
    pre_integration_notes_vi: ["Dùng được trong public-service tone.", "Không cần Supabase.", "Không liên quan billing hay auth."],
    pre_integration_notes_en: ["Usable in public-service tone work.", "No Supabase needed.", "No billing or auth connection."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công tại Canada.",
      context_en: "Public-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਸੂਚਨਾ ਲਈ ਸਪਸ਼ਟ ਸਮਾਂ, ਸੰਪਰਕ ਅਤੇ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੱਸਣੀ ਚਾਹੀਦੀ ਹੈ।",
      rom: "Canada vich seva suchna lai spasht sama, sampark ate bhasha sahaita dassni chahidi hai.",
      vi: "Tại Canada, thông báo dịch vụ nên nêu rõ thời gian, liên hệ và hỗ trợ ngôn ngữ.",
      en: "In Canada, a service notice should clearly state time, contact, and language support.",
    },
    learner_traps_vi: ["Đừng viết như memo nội bộ.", "Đừng quên người đọc cần làm gì."],
    learner_traps_en: ["Do not write like an internal memo.", "Do not forget what the reader should do."],
  },
];
