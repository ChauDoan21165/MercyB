// Punjabi C1 merge-readiness samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1MergeReadinessArea =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response";

export type PunjabiC1MergeReadinessMode =
  | "merge_readiness"
  | "final_regression"
  | "pre_integration";

export type PunjabiC1MergeReadinessPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1MergeReadinessCard = {
  id: string;
  level: "C1";
  area: PunjabiC1MergeReadinessArea;
  mode: PunjabiC1MergeReadinessMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  readiness_prompt_vi: string;
  readiness_prompt_en: string;
  sample: PunjabiC1MergeReadinessPhrase;
  merge_checks_vi: readonly string[];
  merge_checks_en: readonly string[];
  regression_checks_vi: readonly string[];
  regression_checks_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1MergeReadinessPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1MergeReadinessSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1MergeReadinessSamples: PunjabiC1MergeReadinessCard[] = [
  {
    id: "pa_c1_merge_readiness_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "merge_readiness",
    title_pa: "ਰਸਮੀ ਲਿਖਤ merge readiness",
    title_rom: "rasmi likhat merge readiness",
    title_vi: "Sẵn sàng merge: văn phong trang trọng",
    title_en: "Merge readiness: formal writing",
    readiness_prompt_vi: "Kiểm tra đoạn formal có đủ thận trọng, rõ claim và không giống chat trước khi merge.",
    readiness_prompt_en: "Check that the formal passage is cautious, clear in claim, and not chat-like before merge.",
    sample: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਇਹ ਦਰਸਾਉਂਦੀ ਹੈ ਕਿ ਨਤੀਜਾ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਪਰ ਅੰਤਿਮ ਵਿਆਖਿਆ ਲਈ ਹੋਰ ਸਬੂਤ ਨਾਲ ਮਿਲਾ ਕੇ ਦੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "uplabdh jankari ih darsaundi hai ki natija mahatvapuran hai, par antim viakhia lai hor sabut nal mila ke dekhna chahida hai.",
      vi: "Thông tin hiện có cho thấy kết quả quan trọng, nhưng để diễn giải cuối cùng nên đối chiếu với thêm bằng chứng.",
      en: "The available information indicates that the result is important, but final interpretation should compare it with further evidence.",
    },
    merge_checks_vi: ["Register trang trọng.", "Claim rõ.", "Có hedge hợp lý."],
    merge_checks_en: ["Formal register.", "Clear claim.", "Reasonable hedging."],
    regression_checks_vi: ["Không quá chắc.", "Không chuyển giọng chat.", "Không che mất ý chính."],
    regression_checks_en: ["Not too certain.", "No chat-like drift.", "Main point remains visible."],
    pre_integration_notes_vi: ["Dùng được trong report lesson.", "Không có claim thời sự.", "Không cần audio."],
    pre_integration_notes_en: ["Usable in a report lesson.", "No current-news claim.", "No audio needed."],
    canada_example: {
      context_vi: "Báo cáo học thuật hoặc công việc tại Canada.",
      context_en: "Academic or workplace report in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਇਹ ਲਹਿਜ਼ਾ ਸਾਵਧਾਨ ਅਤੇ ਪੇਸ਼ਾਵਰ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada di report vich ih lehja savdhan ate peshavar rahinda hai.",
      vi: "Trong báo cáo tại Canada, giọng này vẫn thận trọng và chuyên nghiệp.",
      en: "In a Canadian report, this tone remains cautious and professional.",
    },
    learner_traps_vi: ["Đừng viết như tin nhắn.", "Đừng kết luận chắc hơn evidence."],
    learner_traps_en: ["Do not write like a message.", "Do not conclude more strongly than the evidence allows."],
  },
  {
    id: "pa_c1_merge_readiness_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "final_regression",
    title_pa: "ਸਰੋਤ ਸਾਰ final regression",
    title_rom: "sarot saar final regression",
    title_vi: "Final regression: tóm tắt nguồn",
    title_en: "Final regression: source summary",
    readiness_prompt_vi: "Kiểm tra summary giữ claim và evidence của nguồn, không thêm ý kiến cá nhân.",
    readiness_prompt_en: "Check that the summary keeps the source claim and evidence without adding personal opinion.",
    sample: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ, ਅਤੇ ਲੇਖਕ ਇਸ ਨੂੰ ਉਡੀਕ ਸਮੇਂ ਤੇ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai, ate lekhak is nu udik samen te feedback nal samarthan karda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin, và tác giả hỗ trợ điều này bằng thời gian chờ cùng phản hồi.",
      en: "The source's main claim is that a clear timeline can increase trust, and the writer supports this with wait times and feedback.",
    },
    merge_checks_vi: ["Nguồn là chủ thể.", "Claim và evidence đi cùng nhau.", "Không thêm critique."],
    merge_checks_en: ["The source is the subject.", "Claim and evidence stay together.", "No added critique."],
    regression_checks_vi: ["Không đổi voice của nguồn.", "Không bỏ evidence chính.", "Không thành review."],
    regression_checks_en: ["Does not change the source voice.", "Does not drop main evidence.", "Does not become a review."],
    pre_integration_notes_vi: ["Dễ dùng trong rubric.", "Compact cho app data.", "Hợp với bài source-based writing."],
    pre_integration_notes_en: ["Easy to use in a rubric.", "Compact for app data.", "Fits source-based writing."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸਰੋਤ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
      rom: "Canada de sarot vich seva jankari di spashtata nu bharose nal joria gaya hai.",
      vi: "Trong nguồn tại Canada, sự rõ ràng của thông tin dịch vụ được liên hệ với niềm tin.",
      en: "In the Canadian source, clarity of service information is linked to trust.",
    },
    learner_traps_vi: ["Đừng biến summary thành opinion.", "Đừng bỏ evidence vì muốn viết ngắn."],
    learner_traps_en: ["Do not turn the summary into an opinion.", "Do not drop evidence just to be brief."],
  },
  {
    id: "pa_c1_merge_readiness_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "merge_readiness",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ merge readiness",
    title_rom: "savdhan daava merge readiness",
    title_vi: "Sẵn sàng merge: claim thận trọng",
    title_en: "Merge readiness: cautious claim",
    readiness_prompt_vi: "Kiểm tra claim có lực nhưng vẫn giữ giới hạn dữ liệu rõ ràng.",
    readiness_prompt_en: "Check that the claim has force while keeping the data limit clear.",
    sample: {
      pa: "ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਹਾਲਾਂਕਿ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਮੁਲਾਂਕਣ ਲੋੜੀਂਦਾ ਹੈ।",
      rom: "ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, halanki vadde padhar te lagu karan ton pahlan hor mulankan lorinda hai.",
      vi: "Số liệu gợi ý quy trình mới có thể hữu ích, tuy nhiên cần thêm đánh giá trước khi áp dụng rộng.",
      en: "The figures suggest that the new process may be helpful, although further evaluation is needed before broad implementation.",
    },
    merge_checks_vi: ["Có hedge.", "Có giới hạn triển khai.", "Claim vẫn rõ."],
    merge_checks_en: ["Has hedging.", "Has an implementation limit.", "Claim remains clear."],
    regression_checks_vi: ["Không overclaim.", "Không hedge quá mơ hồ.", "Không rời khỏi evidence."],
    regression_checks_en: ["Does not overclaim.", "Hedging is not too vague.", "Does not move beyond evidence."],
    pre_integration_notes_vi: ["Dùng được trong cautious-claim review.", "Không cần dữ liệu live.", "Hợp cho C1 academic."],
    pre_integration_notes_en: ["Usable in cautious-claim review.", "No live data needed.", "Fits C1 academic work."],
    canada_example: {
      context_vi: "Đánh giá pilot tại Canada.",
      context_en: "Pilot evaluation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਦਾ ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਅੰਤਿਮ ਸਬੂਤ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ।",
      rom: "Canada de pilot da natija umidjanak hai, par is nu antim sabut nahin mannna chahida.",
      vi: "Kết quả pilot tại Canada có triển vọng, nhưng không nên xem là bằng chứng cuối cùng.",
      en: "The Canadian pilot result is promising, but it should not be treated as final evidence.",
    },
    learner_traps_vi: ["Đừng nói chắc từ mẫu nhỏ.", "Đừng dùng hedge làm mất ý."],
    learner_traps_en: ["Do not sound certain from a small sample.", "Do not let hedging erase the point."],
  },
  {
    id: "pa_c1_merge_readiness_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "final_regression",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ final regression",
    title_rom: "sabut tulna final regression",
    title_vi: "Final regression: so sánh bằng chứng",
    title_en: "Final regression: evidence comparison",
    readiness_prompt_vi: "Kiểm tra hai nguồn được so sánh rõ về vai trò và giới hạn.",
    readiness_prompt_en: "Check that two sources are compared clearly by role and limitation.",
    sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਵਰਤੋਂਕਾਰ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਦੋਵੇਂ ਸਬੂਤ ਵੱਖਰੇ ਪਰ ਪੂਰਕ ਹਨ।",
      rom: "pahla sarot ginti de ank dinda hai, jadki duja sarot vartokar anubhav nu ubharda hai; dove sabut vakhre par purak han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người dùng; hai loại bằng chứng khác nhau nhưng bổ sung nhau.",
      en: "The first source provides numerical data, while the second highlights user experience; the two forms of evidence are different but complementary.",
    },
    merge_checks_vi: ["Vai trò nguồn rõ.", "Không trộn evidence.", "Quan hệ bổ sung rõ."],
    merge_checks_en: ["Source roles are clear.", "Evidence is not blended.", "Complementary relationship is clear."],
    regression_checks_vi: ["Không chọn phe quá sớm.", "Không xóa khác biệt.", "Không kết luận quá rộng."],
    regression_checks_en: ["Does not take a side too early.", "Does not erase differences.", "Does not conclude too broadly."],
    pre_integration_notes_vi: ["Dùng được trong evidence workshop.", "Hợp merge-readiness.", "Không cần nguồn ngoài."],
    pre_integration_notes_en: ["Usable in an evidence workshop.", "Fits merge readiness.", "No external source needed."],
    canada_example: {
      context_vi: "So sánh số liệu và trải nghiệm cộng đồng tại Canada.",
      context_en: "Comparing figures and community experience in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਭਾਈਚਾਰੇ ਦੇ ਤਜਰਬੇ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਨਤੀਜਾ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਬਣਦਾ ਹੈ।",
      rom: "Canada vich ankde ate bhaichare de tajarbe ikathe vekhan nal natija vadhere santulit bannda hai.",
      vi: "Tại Canada, xem số liệu cùng trải nghiệm cộng đồng giúp kết luận cân bằng hơn.",
      en: "In Canada, considering figures together with community experience makes the conclusion more balanced.",
    },
    learner_traps_vi: ["Đừng coi hai nguồn giống nhau.", "Đừng kết luận rộng hơn evidence."],
    learner_traps_en: ["Do not treat the two sources as identical.", "Do not conclude more broadly than the evidence allows."],
  },
  {
    id: "pa_c1_merge_readiness_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "peshavar patar-vihar pre-integration",
    title_vi: "Pre-integration: thư tín chuyên nghiệp",
    title_en: "Pre-integration: professional correspondence",
    readiness_prompt_vi: "Kiểm tra email follow-up lịch sự, rõ request và không quá thân mật.",
    readiness_prompt_en: "Check that the follow-up email is polite, clear in request, and not overly familiar.",
    sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਛੋਟਾ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰ ਦਿਓ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke agle kadam bare chhota update sanjha kar dio.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng chia sẻ cập nhật ngắn về bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please share a brief update on the next step.",
    },
    merge_checks_vi: ["Lịch sự.", "Request rõ.", "Không trách móc."],
    merge_checks_en: ["Polite.", "Clear request.", "No blaming."],
    regression_checks_vi: ["Không giống chat.", "Không quá lạnh.", "Không vòng vo."],
    regression_checks_en: ["Not chat-like.", "Not too cold.", "Not roundabout."],
    pre_integration_notes_vi: ["Dùng được trong workplace module.", "Không cần hệ thống gửi email thật.", "Không đụng auth hay billing."],
    pre_integration_notes_en: ["Usable in a workplace module.", "No real email system needed.", "Does not touch auth or billing."],
    canada_example: {
      context_vi: "Email follow-up trong văn phòng tại Canada.",
      context_en: "Follow-up email in a Canadian office.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਵਿੱਚ ਸਿੱਧੀ ਪਰ ਨਿਮਰ ਬੇਨਤੀ ਆਮ ਤੌਰ ਤੇ ਸਭ ਤੋਂ ਢੰਗੀ ਰਹਿੰਦੀ ਹੈ।",
      rom: "Canada de daftar vich sidhhi par nimar benati aam taur te sab ton dangi rahindi hai.",
      vi: "Trong văn phòng tại Canada, yêu cầu thẳng nhưng lịch sự thường phù hợp nhất.",
      en: "In a Canadian office, a direct but polite request is usually the most appropriate.",
    },
    learner_traps_vi: ["Đừng viết như chat với bạn.", "Đừng dùng mệnh lệnh quá mạnh."],
    learner_traps_en: ["Do not write like a chat with a friend.", "Do not use overly strong commands."],
  },
  {
    id: "pa_c1_merge_readiness_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "merge_readiness",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ merge readiness",
    title_rom: "karjakari sankhep merge readiness",
    title_vi: "Sẵn sàng merge: bản tóm tắt điều hành",
    title_en: "Merge readiness: executive summary",
    readiness_prompt_vi: "Kiểm tra summary giữ priority, risk và next step trong một đoạn ngắn.",
    readiness_prompt_en: "Check that the summary keeps priority, risk, and next step in one short paragraph.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ; ਮੁੱਖ ਜੋਖਮ ਖਰਚੇ ਅਤੇ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ; ਅਗਲਾ ਕਦਮ ਛੋਟੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਰੱਖਣਾ ਹੈ।",
      rom: "mukh tarji seva di gunvatta kaim rakhni hai; mukh jokham kharche ate samen nal juria hai; agla kadam chhoti samikhia meeting rakhna hai.",
      vi: "Ưu tiên chính là duy trì chất lượng dịch vụ; rủi ro chính liên quan đến chi phí và thời gian; bước tiếp theo là tổ chức một buổi review ngắn.",
      en: "The main priority is maintaining service quality; the main risk concerns cost and time; the next step is to hold a short review meeting.",
    },
    merge_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    merge_checks_en: ["Has priority.", "Has risk.", "Has next step."],
    regression_checks_vi: ["Không lan man.", "Không thành list dài.", "Không mất giọng executive."],
    regression_checks_en: ["Does not ramble.", "Does not become a long list.", "Does not lose executive tone."],
    pre_integration_notes_vi: ["Dễ tái dùng trong app.", "Không cần dữ liệu ngoài.", "Sẵn sàng trước merge."],
    pre_integration_notes_en: ["Easy to reuse in the app.", "No external data needed.", "Ready before merge."],
    canada_example: {
      context_vi: "Tóm tắt chương trình cộng đồng tại Canada.",
      context_en: "Community program summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਭਾਈਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਲਈ ਇਹ ਸੰਖੇਪ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਸਪਸ਼ਟ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de bhaicharak program lai ih sankhep tarji, jokham ate agle kadam nu spasht rakhda hai.",
      vi: "Cho chương trình cộng đồng tại Canada, bản tóm tắt này giữ priority, risk và next step rõ ràng.",
      en: "For a community program in Canada, this summary keeps the priority, risk, and next step clear.",
    },
    learner_traps_vi: ["Đừng quên next step.", "Đừng thêm chi tiết phụ quá nhiều."],
    learner_traps_en: ["Do not forget the next step.", "Do not add too many side details."],
  },
  {
    id: "pa_c1_merge_readiness_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "final_regression",
    title_pa: "ਲਹਿਜ਼ਾ calibration final regression",
    title_rom: "lehja calibration final regression",
    title_vi: "Final regression: hiệu chỉnh register",
    title_en: "Final regression: register calibration",
    readiness_prompt_vi: "Kiểm tra câu đã chuyển từ thân mật sang formal mà vẫn tự nhiên và rõ nghĩa.",
    readiness_prompt_en: "Check that the sentence has shifted from casual to formal while staying natural and clear.",
    sample: {
      pa: "ਚੰਗਾ ਲੱਗਿਆ ਵਾਲੀ ਬੋਲੀ ਨੂੰ ਰਿਪੋਰਟ ਵਿੱਚ ਇਹ ਰੂਪ ਦਿੱਤਾ ਜਾ ਸਕਦਾ ਹੈ: ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "changa laggia vali boli nu report vich ih rup ditta ja sakda hai: natija umidjanak hai, par hor samikhia lorindi hai.",
      vi: "Cách nói kiểu 'thấy tốt' có thể chuyển trong report thành: kết quả có triển vọng, nhưng cần xem xét thêm.",
      en: "A phrase like 'it seems good' can be recast in a report as: the result is promising, but further review is needed.",
    },
    merge_checks_vi: ["Có chuyển register.", "Formal tự nhiên.", "Không mất ý ban đầu."],
    merge_checks_en: ["Register shift is present.", "Formal version is natural.", "Original meaning is not lost."],
    regression_checks_vi: ["Không dịch word-for-word.", "Không quá nặng.", "Không quá đời thường."],
    regression_checks_en: ["No word-for-word casual transfer.", "Not too heavy.", "Not too casual."],
    pre_integration_notes_vi: ["Dùng được làm learner trap.", "Hợp final regression.", "Không cần pronunciation scoring."],
    pre_integration_notes_en: ["Usable as a learner trap.", "Fits final regression.", "No pronunciation scoring needed."],
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
    id: "pa_c1_merge_readiness_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ pre-integration",
    title_rom: "peshkari jawab pre-integration",
    title_vi: "Pre-integration: phản hồi thuyết trình",
    title_en: "Pre-integration: presentation response",
    readiness_prompt_vi: "Kiểm tra phản hồi trả lời trực tiếp, lịch sự và có giới hạn dữ liệu.",
    readiness_prompt_en: "Check that the response answers directly, stays polite, and includes a data limit.",
    sample: {
      pa: "ਇਹ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ। ਮੌਜੂਦਾ ਅੰਕੜਿਆਂ ਦੇ ਆਧਾਰ ਤੇ ਅਸੀਂ ਰੁਝਾਨ ਵੇਖ ਸਕਦੇ ਹਾਂ, ਪਰ ਵੱਡੇ ਨਤੀਜੇ ਲਈ ਹੋਰ ਡਾਟਾ ਦੀ ਲੋੜ ਰਹੇਗੀ।",
      rom: "ih mahatvapuran sawal hai. maujuda ankrian de adhar te asi rujhan vekh sakde han, par vadde natije lai hor data di lor rahegi.",
      vi: "Đây là câu hỏi quan trọng. Dựa trên số liệu hiện có, chúng ta có thể thấy xu hướng, nhưng để kết luận lớn hơn sẽ cần thêm dữ liệu.",
      en: "That is an important question. Based on the current figures, we can see a trend, but a broader conclusion will require more data.",
    },
    merge_checks_vi: ["Trả lời trực tiếp.", "Có hedge.", "Lịch sự."],
    merge_checks_en: ["Answers directly.", "Has hedging.", "Polite."],
    regression_checks_vi: ["Không né câu hỏi.", "Không phòng thủ.", "Không phóng đại."],
    regression_checks_en: ["Does not dodge the question.", "Not defensive.", "Does not exaggerate."],
    pre_integration_notes_vi: ["Dùng được cho presentation Q&A.", "Không cần audio.", "Hợp với lớp C1."],
    pre_integration_notes_en: ["Usable for presentation Q&A.", "No audio needed.", "Fits a C1 class."],
    canada_example: {
      context_vi: "Q&A trong lớp hoặc nơi làm việc tại Canada.",
      context_en: "Q&A in a Canadian class or workplace.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਕਲਾਸ ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੇ ਸਮੇਂ ਸਵਾਲ ਦੀ ਕਦਰ ਕਰਨੀ ਅਤੇ ਸੀਮਾ ਦੱਸਣੀ ਦੋਵੇਂ ਮਦਦਗਾਰ ਹਨ।",
      rom: "Canada di class vich jawab dinde samen sawal di kadar karni ate sima dassni dovein madadgar han.",
      vi: "Trong lớp học tại Canada, khi trả lời nên ghi nhận câu hỏi và nêu giới hạn.",
      en: "In a Canadian class, it helps to acknowledge the question and state the limit when answering.",
    },
    learner_traps_vi: ["Đừng né câu hỏi.", "Đừng trả lời chắc hơn dữ liệu cho phép."],
    learner_traps_en: ["Do not dodge the question.", "Do not answer more confidently than the data allows."],
  },
];
