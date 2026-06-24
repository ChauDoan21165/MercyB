// Punjabi C1 MR-readiness evidence for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1MrReadinessArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response"
  | "public_professional_tone";

export type PunjabiC1MrReadinessMode =
  | "mr_readiness"
  | "final_freeze"
  | "final_lock"
  | "pre_integration";

export type PunjabiC1MrReadinessPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1MrReadinessEvidence = {
  id: string;
  level: "C1";
  area: PunjabiC1MrReadinessArea;
  mode: PunjabiC1MrReadinessMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  mr_prompt_vi: string;
  mr_prompt_en: string;
  sample: PunjabiC1MrReadinessPhrase;
  readiness_checks_vi: readonly string[];
  readiness_checks_en: readonly string[];
  freeze_lock_notes_vi: readonly string[];
  freeze_lock_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1MrReadinessPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1MrReadinessEvidenceScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết một hệ chữ Punjabi khác, không phải phần học chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main course script.",
} as const;

export const c1MrReadinessEvidence: PunjabiC1MrReadinessEvidence[] = [
  {
    id: "pa_c1_mr_readiness_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "mr_readiness",
    title_pa: "ਸਰੋਤ ਸਾਰ MR-readiness",
    title_rom: "sarot saar MR-readiness",
    title_vi: "MR-readiness tóm tắt nguồn",
    title_en: "Source summary MR readiness",
    mr_prompt_vi: "Xác nhận summary sẵn sàng MR: claim, evidence và source voice ổn định.",
    mr_prompt_en: "Confirm MR readiness: claim, evidence, and source voice are stable.",
    sample: {
      pa: "ਸਰੋਤ ਦੱਸਦਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸੇਵਾ ਜਾਣਕਾਰੀ ਭਰੋਸੇ ਅਤੇ ਪਹੁੰਚ ਦੋਵਾਂ ਨੂੰ ਸੁਧਾਰ ਸਕਦੀ ਹੈ।",
      rom: "sarot dassda hai ki spasht seva jankari bharose ate pahunch dovan nu sudhar sakdi hai.",
      vi: "Nguồn cho biết thông tin dịch vụ rõ có thể cải thiện cả niềm tin và khả năng tiếp cận.",
      en: "The source states that clear service information can improve both trust and access.",
    },
    readiness_checks_vi: ["Claim đúng nguồn.", "Evidence còn rõ.", "Không thêm opinion."],
    readiness_checks_en: ["Claim matches the source.", "Evidence remains clear.", "No opinion is added."],
    freeze_lock_notes_vi: ["Ổn định sau final-freeze.", "Không cần dữ liệu live.", "Có thể khóa cho MR."],
    freeze_lock_notes_en: ["Stable after final freeze.", "No live data needed.", "Can be locked for MR."],
    pre_integration_notes_vi: ["Không chạy A11.", "Không chạm hệ thống live.", "Dùng được trong rubric."],
    pre_integration_notes_en: ["Does not run A11.", "Does not touch live systems.", "Usable in a rubric."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਨਵੇਂ ਆਏ ਲੋਕਾਂ ਲਈ ਭਰੋਸਾ ਬਣਾਉਂਦੀ ਹੈ।",
      rom: "Canada vich seva jankari di spashtata nave aaye lokan lai bharosa banaoundi hai.",
      vi: "Tại Canada, sự rõ ràng của thông tin dịch vụ xây dựng niềm tin cho người mới đến.",
      en: "In Canada, clarity of service information builds trust for newcomers.",
    },
    learner_traps_vi: ["Đừng biến summary thành critique.", "Đừng bỏ limitation của nguồn."],
    learner_traps_en: ["Do not turn the summary into critique.", "Do not drop the source limitation."],
  },
  {
    id: "pa_c1_mr_readiness_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "final_freeze",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ final-freeze",
    title_rom: "savdhan daava final-freeze",
    title_vi: "Final-freeze claim thận trọng",
    title_en: "Cautious claim final freeze",
    mr_prompt_vi: "Kiểm tra claim đủ rõ cho MR nhưng không vượt evidence.",
    mr_prompt_en: "Check that the claim is clear enough for MR without exceeding evidence.",
    sample: {
      pa: "ਮੌਜੂਦਾ ਸਬੂਤ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਤਰੀਕਾ ਮਦਦਗਾਰ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "maujuda sabut ih sujhaounde han ki tarika madadgar ho sakda hai, par vadde padhar te lagu karan ton pahlan hor samikhia lorindi hai.",
      vi: "Evidence hiện có gợi ý cách này có thể hữu ích, nhưng cần review thêm trước khi áp dụng rộng.",
      en: "The current evidence suggests the approach may be helpful, but further review is needed before broad implementation.",
    },
    readiness_checks_vi: ["Có hedge.", "Scope rõ.", "Không hứa kết quả."],
    readiness_checks_en: ["Has hedging.", "Scope is clear.", "Does not promise outcomes."],
    freeze_lock_notes_vi: ["Giữ final-freeze tone.", "Không overclaim.", "Không tạo claim thời sự."],
    freeze_lock_notes_en: ["Keeps final-freeze tone.", "Does not overclaim.", "Creates no current-news claim."],
    pre_integration_notes_vi: ["Không cần nguồn ngoài.", "Không chạm CI config.", "Phù hợp C1."],
    pre_integration_notes_en: ["No outside source needed.", "Does not touch CI config.", "Fits C1."],
    canada_example: {
      context_vi: "Đánh giá pilot tại Canada.",
      context_en: "Pilot evaluation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਛੋਟੇ ਪਾਇਲਟ ਤੋਂ ਵੱਡਾ ਨਤੀਜਾ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਸਬੂਤ ਚਾਹੀਦੇ ਹਨ।",
      rom: "Canada de chhote pilot ton vadda natija kadhan ton pahlan hor sabut chahide han.",
      vi: "Từ một pilot nhỏ tại Canada, cần thêm evidence trước khi rút kết luận lớn.",
      en: "From a small Canadian pilot, more evidence is needed before drawing a broad conclusion.",
    },
    learner_traps_vi: ["Đừng dùng certainty với data nhỏ.", "Đừng hedge đến mức mơ hồ."],
    learner_traps_en: ["Do not use certainty with small data.", "Do not hedge into vagueness."],
  },
  {
    id: "pa_c1_mr_readiness_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "final_lock",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ final-lock",
    title_rom: "sabut tulna final-lock",
    title_vi: "Final-lock so sánh bằng chứng",
    title_en: "Evidence comparison final lock",
    mr_prompt_vi: "Xác nhận comparison giữ vai trò từng loại evidence.",
    mr_prompt_en: "Confirm the comparison keeps the role of each evidence type.",
    sample: {
      pa: "ਅੰਕੜੇ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਭਾਗੀਦਾਰਾਂ ਦੀ ਫੀਡਬੈਕ ਉਹਨਾਂ ਰੁਝਾਨਾਂ ਦਾ ਸੰਦਰਭ ਦਿੰਦੀ ਹੈ।",
      rom: "ankde rujhan dikhaounde han, jadki bhagidaran di feedback ohnan rujhanan da sandarbh dindi hai.",
      vi: "Số liệu cho thấy xu hướng, còn feedback người tham gia cung cấp bối cảnh cho các xu hướng đó.",
      en: "The figures show patterns, while participant feedback gives context for those patterns.",
    },
    readiness_checks_vi: ["Evidence tách rõ.", "Không trộn nguồn.", "Kết luận cân bằng."],
    readiness_checks_en: ["Evidence is distinct.", "Sources are not blended.", "Conclusion is balanced."],
    freeze_lock_notes_vi: ["Ổn định cho MR.", "Không bỏ limitation.", "Không chọn phe quá sớm."],
    freeze_lock_notes_en: ["Stable for MR.", "Does not omit limitations.", "Does not take a side too early."],
    pre_integration_notes_vi: ["Không cần dữ liệu live.", "Hợp evidence review.", "Dùng được trong test app-data."],
    pre_integration_notes_en: ["No live data needed.", "Fits evidence review.", "Usable in app-data tests."],
    canada_example: {
      context_vi: "So sánh survey và interview tại Canada.",
      context_en: "Comparing a survey and interviews in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਰਵੇ ਅਤੇ ਇੰਟਰਵਿਊ ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹਣ ਨਾਲ ਫੈਸਲਾ ਸੰਤੁਲਿਤ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada vich survey ate interview nu ikathe parhan nal faisla santulit rahinda hai.",
      vi: "Tại Canada, đọc survey cùng interview giúp quyết định cân bằng.",
      en: "In Canada, reading surveys together with interviews keeps the decision balanced.",
    },
    learner_traps_vi: ["Đừng xem một evidence là đủ cho mọi kết luận.", "Đừng xóa khác biệt giữa data và experience."],
    learner_traps_en: ["Do not treat one evidence type as enough for every conclusion.", "Do not erase the difference between data and experience."],
  },
  {
    id: "pa_c1_mr_readiness_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín trang trọng",
    title_en: "Formal correspondence pre-integration",
    mr_prompt_vi: "MR-ready nếu request rõ, lịch sự và không giống chat casual.",
    mr_prompt_en: "MR-ready if the request is clear, polite, and not casual-chat style.",
    sample: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਕੀ ਵੀਰਵਾਰ ਤੱਕ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰਨਾ ਸੰਭਵ ਹੋਵੇਗਾ, ਤਾਂ ਜੋ ਅਸੀਂ ਅਗਲੇ ਕਦਮ ਯੋਜਿਤ ਕਰ ਸਕੀਏ।",
      rom: "kirpa karke dasso ki ki virvar tak update sanjha karna sambhav hovega, tan jo asin agle kadam yojit kar sakie.",
      vi: "Vui lòng cho biết liệu có thể chia sẻ cập nhật trước thứ Năm không, để chúng tôi lên kế hoạch bước tiếp theo.",
      en: "Please let us know whether it will be possible to share an update by Thursday so that we can plan the next steps.",
    },
    readiness_checks_vi: ["Request cụ thể.", "Deadline lịch sự.", "Không blaming."],
    readiness_checks_en: ["Specific request.", "Polite deadline.", "No blaming."],
    freeze_lock_notes_vi: ["Giữ formal register.", "Không cần gửi email thật.", "Không chạm auth/billing."],
    freeze_lock_notes_en: ["Keeps formal register.", "No real email sending needed.", "Does not touch auth or billing."],
    pre_integration_notes_vi: ["Sẵn sàng workplace module.", "Không cần audio.", "Không có dependency live."],
    pre_integration_notes_en: ["Ready for a workplace module.", "No audio needed.", "No live dependency."],
    canada_example: {
      context_vi: "Email phối hợp trong workplace tại Canada.",
      context_en: "Coordination email in a Canadian workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੰਮਕਾਜੀ ਸੰਦਰਭ ਵਿੱਚ ਸਿੱਧੀ ਪਰ ਨਿਮਰ ਬੇਨਤੀ ਪੇਸ਼ਾਵਰ ਲੱਗਦੀ ਹੈ।",
      rom: "Canada de kamkaji sandarbh vich sidhhi par nimar benati peshavar lagdi hai.",
      vi: "Trong môi trường làm việc tại Canada, yêu cầu thẳng nhưng lịch sự nghe chuyên nghiệp.",
      en: "In a Canadian workplace, a direct but polite request sounds professional.",
    },
    learner_traps_vi: ["Đừng ra lệnh mạnh.", "Đừng dịch văn nói casual từng chữ."],
    learner_traps_en: ["Do not use a strong command.", "Do not translate casual speech word for word."],
  },
  {
    id: "pa_c1_mr_readiness_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "mr_readiness",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ MR-readiness",
    title_rom: "karjakari sankhep MR-readiness",
    title_vi: "MR-readiness executive summary",
    title_en: "Executive summary MR readiness",
    mr_prompt_vi: "Summary sẵn sàng MR nếu có priority, risk và recommendation trong format gọn.",
    mr_prompt_en: "The summary is MR-ready if it has priority, risk, and recommendation in concise form.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਪਹੁੰਚ ਸੁਧਾਰਨੀ ਹੈ; ਜੋਖਮ ਸੀਮਿਤ ਸਟਾਫ਼ ਸਮਾਂ ਹੈ, ਇਸ ਲਈ ਸਿਫ਼ਾਰਸ਼ ਛੋਟੇ ਪਾਇਲਟ ਨਾਲ ਸ਼ੁਰੂ ਕਰਨ ਦੀ ਹੈ।",
      rom: "mukh tarji pahunch sudharni hai; jokham simit staff sama hai, is lai sifarash chhote pilot nal shuru karan di hai.",
      vi: "Ưu tiên chính là cải thiện access; rủi ro là thời gian nhân sự hạn chế, nên recommendation là bắt đầu bằng pilot nhỏ.",
      en: "The main priority is improving access; the risk is limited staff time, so the recommendation is to begin with a small pilot.",
    },
    readiness_checks_vi: ["Có priority.", "Có risk.", "Có recommendation."],
    readiness_checks_en: ["Has a priority.", "Has a risk.", "Has a recommendation."],
    freeze_lock_notes_vi: ["Không thành full report.", "Action rõ.", "Gọn cho app data."],
    freeze_lock_notes_en: ["Does not become a full report.", "Action is clear.", "Compact for app data."],
    pre_integration_notes_vi: ["Không cần dữ liệu ngoài.", "Ổn định cho MR.", "Không chạy A11."],
    pre_integration_notes_en: ["No outside data required.", "Stable for MR.", "Does not run A11."],
    canada_example: {
      context_vi: "Summary cho chương trình cộng đồng tại Canada.",
      context_en: "Summary for a community program in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਭਾਈਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਲਈ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਸਿਫ਼ਾਰਸ਼ ਇਕੱਠੇ ਦਿਖਣੇ ਚਾਹੀਦੇ ਹਨ।",
      rom: "Canada de bhaicharak program lai tarji, jokham ate sifarash ikathe dikhne chahide han.",
      vi: "Với chương trình cộng đồng tại Canada, priority, risk và recommendation nên xuất hiện cùng nhau.",
      en: "For a community program in Canada, priority, risk, and recommendation should appear together.",
    },
    learner_traps_vi: ["Đừng viết như full report.", "Đừng quên action hoặc recommendation."],
    learner_traps_en: ["Do not write it like a full report.", "Do not forget the action or recommendation."],
  },
  {
    id: "pa_c1_mr_readiness_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "final_freeze",
    title_pa: "ਰਜਿਸਟਰ calibration final-freeze",
    title_rom: "register calibration final-freeze",
    title_vi: "Final-freeze chỉnh register",
    title_en: "Register calibration final freeze",
    mr_prompt_vi: "MR-ready nếu register chuyên nghiệp, tự nhiên và giữ nghĩa gốc.",
    mr_prompt_en: "MR-ready if the register is professional, natural, and meaning-preserving.",
    sample: {
      pa: "ਇਹ ਨੁਕਤਾ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਪਰ ਅੰਤਿਮ ਰਿਪੋਰਟ ਵਿੱਚ ਇਸ ਨੂੰ ਸਬੂਤ ਅਤੇ ਸੀਮਾਵਾਂ ਨਾਲ ਜੋੜ ਕੇ ਪੇਸ਼ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "ih nukta mahatvapuran hai, par antim report vich is nu sabut ate simavan nal jor ke pesh karna chahida hai.",
      vi: "Điểm này quan trọng, nhưng trong báo cáo cuối nên trình bày cùng evidence và giới hạn.",
      en: "This point is important, but in the final report it should be presented with evidence and limitations.",
    },
    readiness_checks_vi: ["Professional.", "Không đổi nghĩa.", "Có limitation."],
    readiness_checks_en: ["Professional.", "Meaning is not changed.", "Has a limitation."],
    freeze_lock_notes_vi: ["Không quá lạnh.", "Không thêm claim mới.", "Hợp writing C1."],
    freeze_lock_notes_en: ["Not too cold.", "Adds no new claim.", "Fits C1 writing."],
    pre_integration_notes_vi: ["Không cần audio.", "Không chạm scoring.", "Sẵn sàng test."],
    pre_integration_notes_en: ["No audio needed.", "Does not touch scoring.", "Ready for tests."],
    canada_example: {
      context_vi: "Memo chuyên nghiệp tại Canada.",
      context_en: "Professional memo in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪੇਸ਼ਾਵਰ ਮੈਮੋ ਵਿੱਚ ਲਹਿਜ਼ਾ ਸਪਸ਼ਟ, ਨਿਮਰ ਅਤੇ ਕਾਰਵਾਈ-ਕੇਂਦਰਿਤ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de peshavar memo vich lehja spasht, nimar ate karvai-kendrit rahina chahida hai.",
      vi: "Trong memo chuyên nghiệp tại Canada, giọng nên rõ, lịch sự và hướng hành động.",
      en: "In a Canadian professional memo, tone should be clear, polite, and action-oriented.",
    },
    learner_traps_vi: ["Đừng dùng slang.", "Đừng làm formal bằng từ rỗng."],
    learner_traps_en: ["Do not use slang.", "Do not make it formal with empty words."],
  },
  {
    id: "pa_c1_mr_readiness_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "final_lock",
    title_pa: "ਪ੍ਰਸਤੁਤੀ ਜਵਾਬ final-lock",
    title_rom: "prastuti jawab final-lock",
    title_vi: "Final-lock phản hồi thuyết trình",
    title_en: "Presentation response final lock",
    mr_prompt_vi: "MR-ready nếu response công nhận concern, giới hạn evidence và nêu next step.",
    mr_prompt_en: "MR-ready if the response acknowledges concern, limits evidence, and gives a next step.",
    sample: {
      pa: "ਤੁਹਾਡੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ। ਸਬੂਤ ਹਾਲੇ ਸੀਮਿਤ ਹਨ, ਇਸ ਲਈ ਅਸੀਂ ਪਹਿਲਾਂ ਛੋਟਾ ਟੈਸਟ ਕਰਕੇ ਨਤੀਜੇ ਸਾਂਝੇ ਕਰਾਂਗੇ।",
      rom: "tuhadi chinta vajab hai. sabut hale simit han, is lai asin pahlan chhota test karke natije sanjhe karange.",
      vi: "Quan ngại của anh/chị là hợp lý. Evidence hiện còn hạn chế, vì vậy chúng tôi sẽ thử nhỏ trước và chia sẻ kết quả.",
      en: "Your concern is valid. The evidence is still limited, so we will first run a small test and share the results.",
    },
    readiness_checks_vi: ["Công nhận concern.", "Không né câu hỏi.", "Có next step."],
    readiness_checks_en: ["Acknowledges concern.", "Does not avoid the question.", "Has a next step."],
    freeze_lock_notes_vi: ["Tone bình tĩnh.", "Không phòng thủ.", "Không overpromise."],
    freeze_lock_notes_en: ["Calm tone.", "Not defensive.", "Does not overpromise."],
    pre_integration_notes_vi: ["Sẵn sàng Q&A C1.", "Không cần live data.", "Không cần audio."],
    pre_integration_notes_en: ["Ready for C1 Q&A.", "No live data needed.", "No audio needed."],
    canada_example: {
      context_vi: "Q&A chuyên nghiệp tại Canada.",
      context_en: "Professional Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪੇਸ਼ਾਵਰ Q&A ਵਿੱਚ ਚਿੰਤਾ ਨੂੰ ਮੰਨਣਾ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰਨਾ ਭਰੋਸਾ ਬਣਾਉਂਦਾ ਹੈ।",
      rom: "Canada de peshavar Q&A vich chinta nu mannna ate agla kadam spasht karna bharosa banaounda hai.",
      vi: "Trong Q&A chuyên nghiệp tại Canada, công nhận concern và nêu next step giúp xây dựng niềm tin.",
      en: "In a Canadian professional Q&A, acknowledging concern and clarifying the next step builds trust.",
    },
    learner_traps_vi: ["Đừng trả lời như tranh cãi cá nhân.", "Đừng hứa kết quả chắc chắn khi evidence hạn chế."],
    learner_traps_en: ["Do not answer like a personal argument.", "Do not promise a certain outcome when evidence is limited."],
  },
  {
    id: "pa_c1_mr_readiness_public_professional_tone",
    level: "C1",
    area: "public_professional_tone",
    mode: "pre_integration",
    title_pa: "ਜਨਤਕ ਪੇਸ਼ਾਵਰ ਲਹਿਜ਼ਾ pre-integration",
    title_rom: "jantak peshavar lehja pre-integration",
    title_vi: "Pre-integration giọng dịch vụ công/chuyên nghiệp",
    title_en: "Public professional tone pre-integration",
    mr_prompt_vi: "MR-ready nếu thông báo rõ, respectful, không blame và không invent date.",
    mr_prompt_en: "MR-ready if the notice is clear, respectful, blame-free, and does not invent a date.",
    sample: {
      pa: "ਅਸੁਵਿਧਾ ਲਈ ਖੇਦ ਹੈ। ਅਰਜ਼ੀਆਂ ਕ੍ਰਮਵਾਰ ਸਮੀਖਿਆ ਹੋ ਰਹੀਆਂ ਹਨ, ਅਤੇ ਅਗਲਾ ਅਪਡੇਟ ਉਪਲਬਧ ਹੋਣ ਤੇ ਸਾਂਝਾ ਕੀਤਾ ਜਾਵੇਗਾ।",
      rom: "asuvidha lai khed hai. arzian kramvar samikhia ho rahian han, ate agla update uplabdh hon te sanjha kita javega.",
      vi: "Chúng tôi xin lỗi vì sự bất tiện. Hồ sơ đang được xem xét theo thứ tự, và cập nhật tiếp theo sẽ được chia sẻ khi có.",
      en: "We apologize for the inconvenience. Applications are being reviewed in order, and the next update will be shared when available.",
    },
    readiness_checks_vi: ["Status rõ.", "Tone respectful.", "Không invent date."],
    readiness_checks_en: ["Status is clear.", "Tone is respectful.", "Does not invent a date."],
    freeze_lock_notes_vi: ["Không blame người đọc.", "Không quá mơ hồ.", "Ổn định cho MR."],
    freeze_lock_notes_en: ["Does not blame the reader.", "Not too vague.", "Stable for MR."],
    pre_integration_notes_vi: ["Không chạm Supabase.", "Không chạm hệ thống live.", "Không chạy A11."],
    pre_integration_notes_en: ["Does not touch Supabase.", "Does not touch live systems.", "Does not run A11."],
    canada_example: {
      context_vi: "Thông báo dịch vụ cộng đồng tại Canada.",
      context_en: "Community-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੇਵਾ ਸੰਦਰਭ ਵਿੱਚ ਜਨਤਕ ਸੁਨੇਹਾ ਸਪਸ਼ਟ, ਨਿਮਰ ਅਤੇ ਕਾਰਵਾਈਯੋਗ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de seva sandarbh vich jantak suneha spasht, nimar ate karvaiyog rahina chahida hai.",
      vi: "Trong bối cảnh dịch vụ tại Canada, thông báo công khai nên rõ, lịch sự và có thể hành động được.",
      en: "In a Canadian service context, a public message should be clear, polite, and actionable.",
    },
    learner_traps_vi: ["Đừng xin lỗi rỗng mà không có status.", "Đừng thêm deadline không có trong dữ liệu."],
    learner_traps_en: ["Do not use an empty apology without status.", "Do not add a deadline that is not in the data."],
  },
];
