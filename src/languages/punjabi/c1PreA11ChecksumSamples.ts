// Punjabi C1 Pre-A11-checksum samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1PreA11ChecksumArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response"
  | "public_professional_tone";

export type PunjabiC1PreA11ChecksumMode =
  | "pre_a11_checksum"
  | "runner_readiness"
  | "pipeline_readiness"
  | "pre_integration";

export type PunjabiC1PreA11ChecksumPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1PreA11ChecksumSample = {
  id: string;
  level: "C1";
  area: PunjabiC1PreA11ChecksumArea;
  mode: PunjabiC1PreA11ChecksumMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  checksum_prompt_vi: string;
  checksum_prompt_en: string;
  sample: PunjabiC1PreA11ChecksumPhrase;
  pre_a11_checksum_checks_vi: readonly string[];
  pre_a11_checksum_checks_en: readonly string[];
  pipeline_readiness_checks_vi: readonly string[];
  pipeline_readiness_checks_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1PreA11ChecksumPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1PreA11ChecksumSamplesScriptAwareness = {
  vi: "Bộ Pre-A11-checksum này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết một hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This Pre-A11-checksum pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1PreA11ChecksumSamples: PunjabiC1PreA11ChecksumSample[] = [
  {
    id: "pa_c1_pre_a11_checksum_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "pre_a11_checksum",
    title_pa: "ਸਰੋਤ ਸਾਰ Pre-A11-checksum",
    title_rom: "sarot saar Pre-A11-checksum",
    title_vi: "Sample Pre-A11-checksum cho tóm tắt nguồn",
    title_en: "Pre-A11-checksum sample for source summary",
    checksum_prompt_vi: "Dùng sample này để kiểm tra pre-A11 checksum có thể bắt claim, evidence và neutrality ổn định.",
    checksum_prompt_en: "Use this sample to check that checksum can catch stable claim, evidence, and neutrality.",
    sample: {
      pa: "ਸਰੋਤ ਦਾ ਕੇਂਦਰੀ ਦਾਅਵਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਜਾਣਕਾਰੀ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਸੁਧਾਰ ਸਕਦੀ ਹੈ, ਅਤੇ ਇਹ ਦਾਅਵਾ ਉਡੀਕ ਸਮੇਂ ਤੇ ਵਰਤੋਂਕਾਰ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਿਤ ਹੈ।",
      rom: "sarot da kendri daava hai ki spasht jankari seva di pahunch sudhar sakdi hai, ate ih daava udik samen te vartonkar feedback nal samarthit hai.",
      vi: "Claim trung tâm của nguồn là thông tin rõ có thể cải thiện khả năng tiếp cận dịch vụ, và claim này được hỗ trợ bằng thời gian chờ cùng phản hồi người dùng.",
      en: "The source's central claim is that clear information can improve service access, and this claim is supported by wait times and user feedback.",
    },
    pre_a11_checksum_checks_vi: ["Claim rõ để test.", "Evidence có mặt.", "Không thêm opinion."],
    pre_a11_checksum_checks_en: ["Clear claim for testing.", "Evidence is present.", "No added opinion."],
    pipeline_readiness_checks_vi: ["Sẵn sàng pipeline.", "Không phụ thuộc dữ liệu live.", "Có thể freeze."],
    pipeline_readiness_checks_en: ["Ready for pipeline.", "Does not depend on live data.", "Can be frozen."],
    pre_integration_notes_vi: ["Không chạy A11.", "Không cần Supabase.", "Không claim native review."],
    pre_integration_notes_en: ["No A11 run.", "No Supabase needed.", "No native-review claim."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਲੋਕਾਂ ਦੀ ਪਹੁੰਚ ਅਤੇ ਭਰੋਸੇ ਦੋਵੇਂ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
      rom: "Canada vich seva jankari di spashtata lokan di pahunch ate bharose dove lai mahatvapuran hai.",
      vi: "Tại Canada, sự rõ ràng của thông tin dịch vụ quan trọng cho cả khả năng tiếp cận và niềm tin.",
      en: "In Canada, clarity of service information matters for both access and trust.",
    },
    learner_traps_vi: ["Đừng thêm đánh giá cá nhân vào summary.", "Đừng bỏ evidence chính."],
    learner_traps_en: ["Do not add personal evaluation to a summary.", "Do not omit the main evidence."],
  },
  {
    id: "pa_c1_pre_a11_checksum_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "runner_readiness",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ runner-readiness",
    title_rom: "savdhan daava runner-readiness",
    title_vi: "Claim thận trọng cho runner-readiness",
    title_en: "Cautious claim for runner readiness",
    checksum_prompt_vi: "Dùng sample này để kiểm tra claim có hedge nhưng vẫn đủ rõ.",
    checksum_prompt_en: "Use this sample to check that the claim has hedging but remains clear.",
    sample: {
      pa: "ਮੌਜੂਦਾ ਸਬੂਤ ਇਹ ਸੰਕੇਤ ਦਿੰਦੇ ਹਨ ਕਿ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਸਮੀਖਿਆ ਜ਼ਰੂਰੀ ਹੈ।",
      rom: "maujuda sabut ih sanket dinde han ki prakiria madadgar ho sakdi hai, par vadde padhar te lagu karan ton pahlan hor samikhia zaruri hai.",
      vi: "Bằng chứng hiện có gợi ý quy trình có thể hữu ích, nhưng cần review thêm trước khi áp dụng rộng.",
      en: "The current evidence suggests that the process may be helpful, but further review is necessary before broad implementation.",
    },
    pre_a11_checksum_checks_vi: ["Có hedge.", "Có giới hạn scale.", "Claim không mơ hồ."],
    pre_a11_checksum_checks_en: ["Has hedging.", "Has a scale limit.", "Claim is not vague."],
    pipeline_readiness_checks_vi: ["Không phóng đại.", "Không quá yếu.", "Có thể dùng trong runner."],
    pipeline_readiness_checks_en: ["No exaggeration.", "Not too weak.", "Usable in a runner."],
    pre_integration_notes_vi: ["Không cần nguồn ngoài.", "Không chạm scoring.", "Không chạm Azure."],
    pre_integration_notes_en: ["No outside source needed.", "Does not touch scoring.", "Does not touch Azure."],
    canada_example: {
      context_vi: "Đánh giá pilot tại Canada.",
      context_en: "Pilot evaluation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਮਿਲੇ ਨਤੀਜੇ ਉਮੀਦਜਨਕ ਹਨ, ਪਰ ਇਹ ਅਜੇ ਵੱਡੇ ਫੈਸਲੇ ਲਈ ਪੂਰੇ ਸਬੂਤ ਨਹੀਂ ਹਨ।",
      rom: "Canada de pilot ton mile natije umidjanak han, par ih aje vadde faisle lai pure sabut nahin han.",
      vi: "Kết quả từ pilot tại Canada có triển vọng, nhưng chưa phải bằng chứng đầy đủ cho quyết định lớn.",
      en: "Results from the Canadian pilot are promising, but they are not yet full evidence for a large decision.",
    },
    learner_traps_vi: ["Đừng dùng certainty với pilot nhỏ.", "Đừng hedge đến mức không còn luận điểm."],
    learner_traps_en: ["Do not use certainty with a small pilot.", "Do not hedge until no point remains."],
  },
  {
    id: "pa_c1_pre_a11_checksum_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "pipeline_readiness",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ pipeline-readiness",
    title_rom: "sabut tulna pipeline-readiness",
    title_vi: "So sánh bằng chứng cho pipeline-readiness",
    title_en: "Evidence comparison for pipeline readiness",
    checksum_prompt_vi: "Dùng sample này để pre-A11 checksum kiểm tra comparison giữa số liệu và trải nghiệm.",
    checksum_prompt_en: "Use this sample so checksum can check comparison between figures and experience.",
    sample: {
      pa: "ਅੰਕੜੇ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਲੋਕਾਂ ਦੇ ਤਜਰਬੇ ਦੀ ਵਜ੍ਹਾ ਸਮਝਾਉਂਦੇ ਹਨ; ਇਸ ਲਈ ਦੋਵੇਂ ਸਬੂਤ ਇਕੱਠੇ ਪੜ੍ਹਣੇ ਚਾਹੀਦੇ ਹਨ।",
      rom: "ankde badlaa di matra dikhaunde han, jadki interview lokan de tajarbe di vajah samjhaunde han; is lai dove sabut ikathe parhne chahide han.",
      vi: "Số liệu cho thấy mức độ thay đổi, còn phỏng vấn giải thích lý do trong trải nghiệm của người dân; vì vậy nên đọc hai loại bằng chứng cùng nhau.",
      en: "Figures show the amount of change, while interviews explain the reason within people's experience; therefore both types of evidence should be read together.",
    },
    pre_a11_checksum_checks_vi: ["Phân biệt evidence.", "Có kết luận vừa mức.", "Không trộn nguồn."],
    pre_a11_checksum_checks_en: ["Distinguishes evidence.", "Measured conclusion.", "Does not blend sources."],
    pipeline_readiness_checks_vi: ["Sẵn sàng review.", "Không chọn phe sớm.", "Có limitation ngầm rõ."],
    pipeline_readiness_checks_en: ["Ready for review.", "Does not choose a side early.", "Limits are clear enough."],
    pre_integration_notes_vi: ["Không cần live data.", "Không chạm cấu hình hệ thống.", "Dùng được trong app data."],
    pre_integration_notes_en: ["No live data needed.", "Does not touch system configuration.", "Usable in app data."],
    canada_example: {
      context_vi: "So sánh dữ liệu và interview cộng đồng tại Canada.",
      context_en: "Comparing data and community interviews in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਇੰਟਰਵਿਊ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਸੇਵਾ ਫੈਸਲਾ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada vich ankde ate interview ikathe vekhan nal seva faisla vadhere santulit rahinda hai.",
      vi: "Tại Canada, xem số liệu và interview cùng nhau giúp quyết định dịch vụ cân bằng hơn.",
      en: "In Canada, looking at figures and interviews together keeps a service decision more balanced.",
    },
    learner_traps_vi: ["Đừng nói số liệu và interview có cùng chức năng.", "Đừng kết luận rộng hơn evidence."],
    learner_traps_en: ["Do not say figures and interviews have the same function.", "Do not conclude more broadly than the evidence."],
  },
  {
    id: "pa_c1_pre_a11_checksum_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Thư tín trang trọng trước integration",
    title_en: "Formal correspondence before integration",
    checksum_prompt_vi: "Dùng sample này để test email formal: request rõ, lịch sự, không casual.",
    checksum_prompt_en: "Use this sample to test a formal email: clear request, polite, not casual.",
    sample: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਮੀਖਿਆ ਤੋਂ ਪਹਿਲਾਂ ਅਪਡੇਟ ਕੀਤੀ ਸੂਚੀ ਸਾਂਝੀ ਕਰ ਦਿਓ, ਤਾਂ ਜੋ ਟੀਮ ਮੀਟਿੰਗ ਵਿੱਚ ਸਹੀ ਤਰ੍ਹਾਂ ਤਿਆਰ ਹੋ ਸਕੇ।",
      rom: "kirpa karke samikhia ton pahlan update kiti suchi sanjhi kar dio, tan jo team meeting vich sahi tarah tiar ho sake.",
      vi: "Vui lòng chia sẻ danh sách đã cập nhật trước buổi review để đội ngũ có thể chuẩn bị đúng cho cuộc họp.",
      en: "Please share the updated list before the review so the team can prepare properly for the meeting.",
    },
    pre_a11_checksum_checks_vi: ["Request rõ.", "Tone lịch sự.", "Không giống tin nhắn bạn bè."],
    pre_a11_checksum_checks_en: ["Clear request.", "Polite tone.", "Not like a message to a friend."],
    pipeline_readiness_checks_vi: ["Đủ formal.", "Không trách móc.", "Có lý do request."],
    pipeline_readiness_checks_en: ["Formal enough.", "No blaming.", "Has a reason for the request."],
    pre_integration_notes_vi: ["Không gửi email thật.", "Không chạm auth.", "Không chạm billing."],
    pre_integration_notes_en: ["No real email sending.", "Does not touch auth.", "Does not touch billing."],
    canada_example: {
      context_vi: "Email chuẩn bị review trong workplace tại Canada.",
      context_en: "Review-preparation email in a Canadian workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੰਮਕਾਜੀ ਸੰਦਰਭ ਵਿੱਚ ਪਹਿਲਾਂ ਸੂਚੀ ਮੰਗਣਾ ਸਿੱਧਾ ਅਤੇ ਨਿਮਰ ਦੋਵੇਂ ਹੋ ਸਕਦਾ ਹੈ।",
      rom: "Canada de kamkaji sandarbh vich pahlan suchi mangna sidhha ate nimar dove ho sakda hai.",
      vi: "Trong workplace tại Canada, yêu cầu danh sách trước có thể vừa trực tiếp vừa lịch sự.",
      en: "In a Canadian workplace, asking for the list in advance can be both direct and polite.",
    },
    learner_traps_vi: ["Đừng dùng mệnh lệnh gắt.", "Đừng quên mục đích của request."],
    learner_traps_en: ["Do not use a harsh command.", "Do not forget the purpose of the request."],
  },
  {
    id: "pa_c1_pre_a11_checksum_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "pre_a11_checksum",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ Pre-A11-checksum",
    title_rom: "karjakari sankhep Pre-A11-checksum",
    title_vi: "Executive summary cho Pre-A11-checksum",
    title_en: "Executive summary for Pre-A11 checksum",
    checksum_prompt_vi: "Dùng sample này để test summary ngắn có priority, risk và next step.",
    checksum_prompt_en: "Use this sample to test a short summary with priority, risk, and next step.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਭਰੋਸੇਯੋਗਤਾ ਹੈ, ਮੁੱਖ ਜੋਖਮ ਸੀਮਿਤ ਸਟਾਫ ਸਮਾਂ ਹੈ, ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੋ ਹਫ਼ਤਿਆਂ ਦੀ ਸਮੀਖਿਆ ਪੂਰੀ ਕਰਨਾ ਹੈ।",
      rom: "mukh tarji seva di bharoseyogta hai, mukh jokham simit staff sama hai, ate agla kadam do haftian di samikhia puri karna hai.",
      vi: "Ưu tiên chính là độ tin cậy của dịch vụ, rủi ro chính là thời gian nhân sự hạn chế, và bước tiếp theo là hoàn tất review hai tuần.",
      en: "The main priority is service reliability, the main risk is limited staff time, and the next step is to complete a two-week review.",
    },
    pre_a11_checksum_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    pre_a11_checksum_checks_en: ["Has a priority.", "Has a risk.", "Has a next step."],
    pipeline_readiness_checks_vi: ["Compact.", "Không thành report dài.", "Action rõ."],
    pipeline_readiness_checks_en: ["Compact.", "Does not become a long report.", "Clear action."],
    pre_integration_notes_vi: ["Không cần nguồn ngoài.", "Không chạm RLS.", "Không deploy."],
    pre_integration_notes_en: ["No outside source needed.", "Does not touch RLS.", "No deploy."],
    canada_example: {
      context_vi: "Tóm tắt điều hành cho chương trình dịch vụ tại Canada.",
      context_en: "Executive summary for a service program in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੇਵਾ ਪ੍ਰੋਗਰਾਮ ਲਈ ਇਹ ਸੰਖੇਪ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਛੋਟੇ ਰੂਪ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de seva program lai ih sankhep tarji, jokham ate agle kadam nu chhote rup vich rakhda hai.",
      vi: "Cho chương trình dịch vụ tại Canada, summary này giữ priority, risk và next step ở dạng ngắn.",
      en: "For a service program in Canada, this summary keeps the priority, risk, and next step in a short form.",
    },
    learner_traps_vi: ["Đừng viết background dài.", "Đừng bỏ bước tiếp theo."],
    learner_traps_en: ["Do not write long background.", "Do not omit the next step."],
  },
  {
    id: "pa_c1_pre_a11_checksum_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "runner_readiness",
    title_pa: "ਰਜਿਸਟਰ calibration runner-readiness",
    title_rom: "register calibration runner-readiness",
    title_vi: "Chỉnh register cho runner-readiness",
    title_en: "Register calibration for runner readiness",
    checksum_prompt_vi: "Dùng sample này để test register formal, cautious và không quá casual.",
    checksum_prompt_en: "Use this sample to test formal, cautious, and not-too-casual register.",
    sample: {
      pa: "ਇਸ ਨਤੀਜੇ ਨੂੰ ਰਿਪੋਰਟ ਵਿੱਚ ਸਾਵਧਾਨੀ ਨਾਲ ਦਰਸਾਉਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਇਹ ਸੰਭਾਵੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦਾ ਹੈ ਪਰ ਕਾਰਨ ਪੱਕਾ ਨਹੀਂ ਕਰਦਾ।",
      rom: "is natije nu report vich savdhani nal darsaunda chahida hai, kyonki ih sambhavi rujhan dikhaunda hai par karan pakka nahin karda.",
      vi: "Kết quả này nên được trình bày thận trọng trong báo cáo vì nó cho thấy xu hướng có thể có nhưng không xác nhận nguyên nhân.",
      en: "This result should be presented cautiously in the report because it shows a possible trend but does not confirm the cause.",
    },
    pre_a11_checksum_checks_vi: ["Register formal.", "Claim cautious.", "Không casual."],
    pre_a11_checksum_checks_en: ["Formal register.", "Cautious claim.", "Not casual."],
    pipeline_readiness_checks_vi: ["Giữ nghĩa.", "Không phóng đại.", "Đủ rõ cho review."],
    pipeline_readiness_checks_en: ["Keeps meaning.", "No exaggeration.", "Clear enough for review."],
    pre_integration_notes_vi: ["Không cần audio.", "Không scoring.", "Không Azure."],
    pre_integration_notes_en: ["No audio needed.", "No scoring.", "No Azure."],
    canada_example: {
      context_vi: "Memo công việc tại Canada.",
      context_en: "Workplace memo in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਮੈਮੋ ਵਿੱਚ ਇਹ ਲਹਿਜ਼ਾ ਪੇਸ਼ਾਵਰ ਰਹਿੰਦਾ ਹੈ ਅਤੇ ਨਤੀਜੇ ਨੂੰ ਹੱਦ ਤੋਂ ਵੱਧ ਨਹੀਂ ਦਿਖਾਉਂਦਾ।",
      rom: "Canada de memo vich ih lehja peshavar rahinda hai ate natije nu hadd ton vadh nahin dikhaunda.",
      vi: "Trong memo tại Canada, giọng này chuyên nghiệp và không phóng đại kết quả.",
      en: "In a Canadian memo, this tone remains professional and does not overstate the result.",
    },
    learner_traps_vi: ["Đừng dịch văn nói word-by-word.", "Đừng làm câu quá lạnh hoặc mơ hồ."],
    learner_traps_en: ["Do not translate spoken wording word for word.", "Do not make the sentence too cold or vague."],
  },
  {
    id: "pa_c1_pre_a11_checksum_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "runner_readiness",
    title_pa: "ਪ੍ਰਜ਼ੈਂਟੇਸ਼ਨ ਜਵਾਬ runner-readiness",
    title_rom: "presentation jawab runner-readiness",
    title_vi: "Phản hồi presentation cho runner-readiness",
    title_en: "Presentation response for runner readiness",
    checksum_prompt_vi: "Dùng sample này để test câu trả lời Q&A có cấu trúc và không phòng thủ.",
    checksum_prompt_en: "Use this sample to test a structured, non-defensive Q&A answer.",
    sample: {
      pa: "ਇਹ ਵਾਜਬ ਸਵਾਲ ਹੈ। ਪਹਿਲਾਂ, ਅੰਕੜੇ ਸੀਮਿਤ ਸਮੇਂ ਨੂੰ ਕਵਰ ਕਰਦੇ ਹਨ; ਦੂਜਾ, ਫੀਡਬੈਕ ਨਤੀਜੇ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ ਪਰ ਇਸ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
      rom: "ih vajab sawal hai. pahlan, ankde simit samen nu cover karde han; duja, feedback natije da samarthan karda hai par is nu puri tarah sabat nahin karda.",
      vi: "Đây là câu hỏi hợp lý. Thứ nhất, số liệu chỉ bao phủ thời gian giới hạn; thứ hai, phản hồi hỗ trợ kết quả nhưng không chứng minh hoàn toàn.",
      en: "This is a reasonable question. First, the figures cover a limited period; second, feedback supports the result but does not fully prove it.",
    },
    pre_a11_checksum_checks_vi: ["Ghi nhận câu hỏi.", "Có cấu trúc.", "Không overstated."],
    pre_a11_checksum_checks_en: ["Acknowledges the question.", "Structured.", "Not overstated."],
    pipeline_readiness_checks_vi: ["Không né câu hỏi.", "Có limitation.", "Tone chuyên nghiệp."],
    pipeline_readiness_checks_en: ["Does not avoid the question.", "Has a limitation.", "Professional tone."],
    pre_integration_notes_vi: ["Không tạo audio.", "Không pronunciation scoring.", "Không native-review claim."],
    pre_integration_notes_en: ["Creates no audio.", "No pronunciation scoring.", "No native-review claim."],
    canada_example: {
      context_vi: "Q&A sau presentation tại Canada.",
      context_en: "Q&A after a presentation in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਪ੍ਰਜ਼ੈਂਟੇਸ਼ਨ ਤੋਂ ਬਾਅਦ ਇਹ ਜਵਾਬ ਸਵਾਲ ਦਾ ਆਦਰ ਕਰਦਾ ਹੈ ਅਤੇ ਸਬੂਤ ਦੀ ਸੀਮਾ ਸਾਫ਼ ਕਰਦਾ ਹੈ।",
      rom: "Canada vich presentation ton baad ih jawab sawal da adar karda hai ate sabut di sima saaf karda hai.",
      vi: "Tại Canada, câu trả lời sau presentation này tôn trọng câu hỏi và làm rõ giới hạn bằng chứng.",
      en: "In Canada, this post-presentation answer respects the question and clarifies the evidence limit.",
    },
    learner_traps_vi: ["Đừng trả lời phòng thủ.", "Đừng nói evidence chứng minh nhiều hơn nó có thể."],
    learner_traps_en: ["Do not answer defensively.", "Do not say the evidence proves more than it can."],
  },
  {
    id: "pa_c1_pre_a11_checksum_public_professional_tone",
    level: "C1",
    area: "public_professional_tone",
    mode: "pre_integration",
    title_pa: "ਜਨਤਕ ਪੇਸ਼ਾਵਰ ਲਹਿਜ਼ਾ pre-integration",
    title_rom: "jantak peshavar lehja pre-integration",
    title_vi: "Giọng public/professional trước integration",
    title_en: "Public/professional tone before integration",
    checksum_prompt_vi: "Dùng sample này để pre-A11 checksum kiểm tra thông báo công khai rõ, tôn trọng và có next action.",
    checksum_prompt_en: "Use this sample so checksum can check a public notice that is clear, respectful, and has a next action.",
    sample: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਅਗਲੇ ਹਫ਼ਤੇ ਤੋਂ ਬਦਲੇ ਜਾਣਗੇ। ਕਿਰਪਾ ਕਰਕੇ ਨਵਾਂ ਸਮਾਂ ਵੇਖੋ ਅਤੇ ਜੇ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ ਤਾਂ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      rom: "seva samen agle hafte ton badle jaan ge. kirpa karke nava sama vekho ate je tuhanu madad chahidi hai tan team nal sampark karo.",
      vi: "Giờ dịch vụ sẽ thay đổi từ tuần tới. Vui lòng xem giờ mới và liên hệ đội ngũ nếu bạn cần hỗ trợ.",
      en: "Service hours will change starting next week. Please check the new hours and contact the team if you need support.",
    },
    pre_a11_checksum_checks_vi: ["Thông báo rõ.", "Tone tôn trọng.", "Có next action."],
    pre_a11_checksum_checks_en: ["Clear notice.", "Respectful tone.", "Has a next action."],
    pipeline_readiness_checks_vi: ["Không đổ lỗi.", "Không quá dài.", "Sẵn sàng freeze."],
    pipeline_readiness_checks_en: ["No blaming.", "Not too long.", "Ready to freeze."],
    pre_integration_notes_vi: ["Không deploy.", "Không RLS.", "Không Supabase."],
    pre_integration_notes_en: ["No deploy.", "No RLS.", "No Supabase."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công cộng tại Canada.",
      context_en: "Public service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਜਨਤਕ ਸੇਵਾ ਸੰਦਰਭ ਵਿੱਚ ਸਾਫ਼ ਸਮਾਂ ਅਤੇ ਸੰਪਰਕ ਵਿਕਲਪ ਲੋਕਾਂ ਲਈ ਲਾਭਦਾਇਕ ਹੁੰਦੇ ਹਨ।",
      rom: "Canada de jantak seva sandarbh vich saaf sama ate sampark vikalp lokan lai labhdayak hunde han.",
      vi: "Trong bối cảnh dịch vụ công cộng tại Canada, giờ rõ và lựa chọn liên hệ có ích cho người dân.",
      en: "In a Canadian public-service context, clear hours and contact options are useful for people.",
    },
    learner_traps_vi: ["Đừng nghe như trách người đọc.", "Đừng thiếu hành động tiếp theo."],
    learner_traps_en: ["Do not sound as if blaming the reader.", "Do not omit the next action."],
  },
];
