// Punjabi C1 import-readiness samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1ImportReadinessArea =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response";

export type PunjabiC1ImportReadinessMode =
  | "import_readiness"
  | "final_regression"
  | "pre_integration";

export type PunjabiC1ImportReadinessPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1ImportReadinessSample = {
  id: string;
  level: "C1";
  area: PunjabiC1ImportReadinessArea;
  mode: PunjabiC1ImportReadinessMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  import_prompt_vi: string;
  import_prompt_en: string;
  sample: PunjabiC1ImportReadinessPhrase;
  import_checks_vi: readonly string[];
  import_checks_en: readonly string[];
  final_regression_checks_vi: readonly string[];
  final_regression_checks_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1ImportReadinessPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1ImportReadinessSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1ImportReadinessSamples: PunjabiC1ImportReadinessSample[] = [
  {
    id: "pa_c1_import_readiness_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "import_readiness",
    title_pa: "ਰਸਮੀ ਲਿਖਤ import-readiness",
    title_rom: "rasmi likhat import-readiness",
    title_vi: "Import-readiness văn phong trang trọng",
    title_en: "Formal writing import readiness",
    import_prompt_vi: "Kiểm tra đoạn văn có đủ trang trọng, rõ giới hạn và sẵn sàng nhập vào lesson không.",
    import_prompt_en: "Check whether the paragraph is formal, clearly limited, and ready to import into a lesson.",
    sample: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ ਇਹ ਕਿਹਾ ਜਾ ਸਕਦਾ ਹੈ ਕਿ ਨਤੀਜਾ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਪਰ ਅੰਤਿਮ ਵਿਆਖਿਆ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਸਬੂਤ ਨਾਲ ਮਿਲਾ ਕੇ ਦੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "uplabdh jankari de adhar te ih keha ja sakda hai ki natija mahatvapuran hai, par antim viakhia ton pahlan hor sabut nal mila ke dekhna chahida hai.",
      vi: "Dựa trên thông tin hiện có, có thể nói kết quả quan trọng, nhưng trước khi diễn giải cuối cùng nên đối chiếu với thêm bằng chứng.",
      en: "Based on the available information, the result can be considered important, but it should be checked against further evidence before final interpretation.",
    },
    import_checks_vi: ["Register formal.", "Có hedge rõ.", "Không giống chat."],
    import_checks_en: ["Formal register.", "Clear hedging.", "Not chat-like."],
    final_regression_checks_vi: ["Không overclaim.", "Không mất ý chính.", "Có giới hạn dữ liệu."],
    final_regression_checks_en: ["Does not overclaim.", "Does not lose the main point.", "States data limits."],
    pre_integration_notes_vi: ["Sẵn sàng cho import thử.", "Không cần dữ liệu live.", "Giữ app data compact."],
    pre_integration_notes_en: ["Ready for trial import.", "No live data required.", "Keeps app data compact."],
    canada_example: {
      context_vi: "Báo cáo học thuật hoặc công việc tại Canada.",
      context_en: "Academic or workplace report in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਇਹ ਲਹਿਜ਼ਾ ਸਾਵਧਾਨ ਅਤੇ ਪੇਸ਼ਾਵਰ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada di report vich ih lehja savdhan ate peshavar rahinda hai.",
      vi: "Trong báo cáo tại Canada, giọng này vẫn thận trọng và chuyên nghiệp.",
      en: "In a Canadian report, this tone remains cautious and professional.",
    },
    learner_traps_vi: ["Đừng viết quá chắc.", "Đừng dùng lời thân mật trong văn bản formal."],
    learner_traps_en: ["Do not sound too certain.", "Do not use casual wording in formal text."],
  },
  {
    id: "pa_c1_import_readiness_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "final_regression",
    title_pa: "ਸਰੋਤ ਸਾਰ final-regression",
    title_rom: "sarot saar final-regression",
    title_vi: "Final-regression tóm tắt nguồn",
    title_en: "Source summary final regression",
    import_prompt_vi: "Xác nhận summary giữ claim và evidence của nguồn mà không thêm đánh giá cá nhân.",
    import_prompt_en: "Confirm that the summary keeps the source claim and evidence without adding personal evaluation.",
    sample: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ, ਅਤੇ ਇਸ ਗੱਲ ਨੂੰ ਉਡੀਕ ਸਮੇਂ ਤੇ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਨ ਮਿਲਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai, ate is gal nu udik samen te feedback nal samarthan milda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin, và điều này được hỗ trợ bằng thời gian chờ cùng phản hồi.",
      en: "The source's main claim is that a clear timeline can increase trust, and this is supported by wait times and feedback.",
    },
    import_checks_vi: ["Nguồn là chủ thể.", "Claim đi cùng evidence.", "Không trượt sang critique."],
    import_checks_en: ["The source is the subject.", "Claim stays with evidence.", "Does not slide into critique."],
    final_regression_checks_vi: ["Không thêm opinion.", "Không bỏ evidence chính.", "Giữ neutrality."],
    final_regression_checks_en: ["No added opinion.", "Does not drop main evidence.", "Keeps neutrality."],
    pre_integration_notes_vi: ["Hợp cho lesson summary.", "Dễ đưa vào rubric.", "Không cần nguồn ngoài."],
    pre_integration_notes_en: ["Fits a summary lesson.", "Easy to place in a rubric.", "No external source required."],
    canada_example: {
      context_vi: "Nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸਰੋਤ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
      rom: "Canada de sarot vich seva jankari di spashtata nu bharose nal joria gaya hai.",
      vi: "Trong nguồn tại Canada, sự rõ ràng của thông tin dịch vụ được liên hệ với niềm tin.",
      en: "In the Canadian source, clarity of service information is linked to trust.",
    },
    learner_traps_vi: ["Đừng đổi summary thành review.", "Đừng bỏ evidence để viết ngắn."],
    learner_traps_en: ["Do not turn the summary into a review.", "Do not drop evidence just to be brief."],
  },
  {
    id: "pa_c1_import_readiness_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "import_readiness",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ import-readiness",
    title_rom: "savdhan daava import-readiness",
    title_vi: "Import-readiness claim thận trọng",
    title_en: "Cautious claim import readiness",
    import_prompt_vi: "Kiểm tra claim có lực nhưng không vượt quá phạm vi dữ liệu hoặc pilot.",
    import_prompt_en: "Check that the claim has force without exceeding the data or pilot scope.",
    sample: {
      pa: "ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਹਾਲਾਂਕਿ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਲਈ ਹੋਰ ਮੁਲਾਂਕਣ ਦੀ ਲੋੜ ਹੈ।",
      rom: "ankde ih sujhaounde han ki navi prakiria labhdayak ho sakdi hai, halanki vadde padhar te lagu karan lai hor mulankan di lor hai.",
      vi: "Số liệu gợi ý quy trình mới có thể hữu ích, tuy nhiên cần thêm đánh giá trước khi áp dụng rộng.",
      en: "The figures suggest that the new process may be useful, although further evaluation is needed before broad implementation.",
    },
    import_checks_vi: ["Có hedge.", "Giới hạn triển khai rõ.", "Ý chính vẫn có lực."],
    import_checks_en: ["Has hedging.", "Implementation limit is clear.", "The main point still has force."],
    final_regression_checks_vi: ["Không chắc quá mức.", "Không hedge đến mơ hồ.", "Không tạo claim thời sự."],
    final_regression_checks_en: ["Not overly certain.", "Not hedged into vagueness.", "No current-news claim."],
    pre_integration_notes_vi: ["Dùng cho cautious-claim review.", "Không cần dữ liệu live.", "Phù hợp C1."],
    pre_integration_notes_en: ["Usable for cautious-claim review.", "No live data required.", "Fits C1."],
    canada_example: {
      context_vi: "Đánh giá pilot tại Canada.",
      context_en: "Pilot evaluation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਦਾ ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਅੰਤਿਮ ਨਤੀਜਾ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ।",
      rom: "Canada de pilot da natija umidjanak hai, par is nu antim natija nahin mannna chahida.",
      vi: "Kết quả pilot tại Canada có triển vọng, nhưng không nên xem là kết luận cuối cùng.",
      en: "The Canadian pilot result is promising, but it should not be treated as a final conclusion.",
    },
    learner_traps_vi: ["Đừng nói chắc từ mẫu nhỏ.", "Đừng làm câu yếu đến mức không có claim."],
    learner_traps_en: ["Do not sound certain from a small sample.", "Do not make the sentence so weak that there is no claim."],
  },
  {
    id: "pa_c1_import_readiness_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "final_regression",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ final-regression",
    title_rom: "sabut tulna final-regression",
    title_vi: "Final-regression so sánh bằng chứng",
    title_en: "Evidence comparison final regression",
    import_prompt_vi: "Xác nhận hai nguồn được so sánh rõ về vai trò, độ mạnh và giới hạn.",
    import_prompt_en: "Confirm that the two sources are compared clearly by role, strength, and limitation.",
    sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਵਰਤੋਂਕਾਰ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਇਸ ਲਈ ਦੋਵੇਂ ਸਬੂਤ ਵੱਖਰੇ ਪਰ ਪੂਰਕ ਹਨ।",
      rom: "pahla sarot ginti de ank dinda hai, jadki duja sarot vartokar anubhav nu ubharda hai; is lai dove sabut vakhre par purak han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người dùng; vì vậy hai loại bằng chứng khác nhau nhưng bổ sung nhau.",
      en: "The first source provides numerical data, while the second highlights user experience; the two forms of evidence are different but complementary.",
    },
    import_checks_vi: ["Vai trò từng nguồn rõ.", "Không trộn evidence.", "Có quan hệ bổ sung."],
    import_checks_en: ["Each source role is clear.", "Evidence is not blended.", "The complementary relationship is explicit."],
    final_regression_checks_vi: ["Không xem hai nguồn giống nhau.", "Không kết luận rộng hơn evidence.", "Giữ logic so sánh."],
    final_regression_checks_en: ["Does not treat the two sources as identical.", "Does not conclude beyond the evidence.", "Keeps comparison logic."],
    pre_integration_notes_vi: ["Hợp cho evidence workshop.", "Dùng được trước import.", "Không cần nguồn ngoài."],
    pre_integration_notes_en: ["Fits an evidence workshop.", "Usable before import.", "No outside source required."],
    canada_example: {
      context_vi: "So sánh số liệu và trải nghiệm cộng đồng tại Canada.",
      context_en: "Comparing figures and community experience in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਭਾਈਚਾਰੇ ਦੇ ਤਜਰਬੇ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਨਤੀਜਾ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਬਣਦਾ ਹੈ।",
      rom: "Canada vich ankde ate bhaichare de tajarbe ikathe vekhan nal natija vadhere santulit bannda hai.",
      vi: "Tại Canada, xem số liệu cùng trải nghiệm cộng đồng giúp kết luận cân bằng hơn.",
      en: "In Canada, considering figures together with community experience makes the conclusion more balanced.",
    },
    learner_traps_vi: ["Đừng xóa khác biệt giữa nguồn.", "Đừng chọn phe quá sớm."],
    learner_traps_en: ["Do not erase the difference between sources.", "Do not take a side too early."],
  },
  {
    id: "pa_c1_import_readiness_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "peshavar patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín chuyên nghiệp",
    title_en: "Professional correspondence pre-integration",
    import_prompt_vi: "Kiểm tra email follow-up lịch sự, rõ request và không quá thân mật.",
    import_prompt_en: "Check that the follow-up email is polite, clear in its request, and not overly familiar.",
    sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਛੋਟਾ ਜਿਹਾ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰ ਦਿਓ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke agle kadam bare chhota jiha update sanjha kar dio.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng chia sẻ cập nhật ngắn về bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please share a brief update on the next step.",
    },
    import_checks_vi: ["Lịch sự.", "Request rõ.", "Không trách móc."],
    import_checks_en: ["Polite.", "Clear request.", "No blaming."],
    final_regression_checks_vi: ["Không giống chat bạn bè.", "Không dùng mệnh lệnh mạnh.", "Không vòng vo quá mức."],
    final_regression_checks_en: ["Not like a message to a friend.", "No strong commands.", "Not overly indirect."],
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
    learner_traps_vi: ["Đừng viết quá casual.", "Đừng làm request mơ hồ."],
    learner_traps_en: ["Do not write too casually.", "Do not make the request vague."],
  },
  {
    id: "pa_c1_import_readiness_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "import_readiness",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ import-readiness",
    title_rom: "karjakari sankhep import-readiness",
    title_vi: "Import-readiness bản tóm tắt điều hành",
    title_en: "Executive summary import readiness",
    import_prompt_vi: "Kiểm tra summary có giữ ưu tiên, rủi ro và bước tiếp theo trong một đoạn ngắn không.",
    import_prompt_en: "Check whether the summary keeps priorities, risks, and next steps in one short paragraph.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ, ਜਦਕਿ ਮੁੱਖ ਜੋਖਮ ਖਰਚੇ ਅਤੇ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ; ਅਗਲਾ ਕਦਮ ਛੋਟੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਰੱਖਣਾ ਹੈ।",
      rom: "mukh tarji seva di gunvatta kaim rakhni hai, jadki mukh jokham kharche ate samen nal juria hai; agla kadam chhoti samikhia meeting rakhna hai.",
      vi: "Ưu tiên chính là duy trì chất lượng dịch vụ, trong khi rủi ro chính liên quan đến chi phí và thời gian; bước tiếp theo là tổ chức một buổi review ngắn.",
      en: "The main priority is maintaining service quality, while the main risk concerns cost and time; the next step is to hold a short review meeting.",
    },
    import_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    import_checks_en: ["Has a priority.", "Has a risk.", "Has a next step."],
    final_regression_checks_vi: ["Không lan man.", "Không biến thành list dài.", "Không quên action."],
    final_regression_checks_en: ["Does not ramble.", "Does not become a long list.", "Does not forget action."],
    pre_integration_notes_vi: ["Sẵn sàng cho import review.", "Compact cho app data.", "Không cần dữ liệu ngoài."],
    pre_integration_notes_en: ["Ready for import review.", "Compact for app data.", "No outside data required."],
    canada_example: {
      context_vi: "Tóm tắt điều hành cho chương trình cộng đồng tại Canada.",
      context_en: "Executive summary for a community program in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਭਾਈਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਲਈ ਇਹ ਸੰਖੇਪ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de bhaicharak program lai ih sankhep tarji, jokham ate agle kadam nu ikathe rakhda hai.",
      vi: "Cho chương trình cộng đồng tại Canada, bản tóm tắt này giữ priority, risk và next step cùng nhau.",
      en: "For a community program in Canada, this summary keeps the priority, risk, and next step together.",
    },
    learner_traps_vi: ["Đừng viết thành báo cáo đầy đủ.", "Đừng bỏ next step."],
    learner_traps_en: ["Do not write a full report.", "Do not omit the next step."],
  },
  {
    id: "pa_c1_import_readiness_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "final_regression",
    title_pa: "ਰਜਿਸਟਰ calibration final-regression",
    title_rom: "register calibration final-regression",
    title_vi: "Final-regression chỉnh register",
    title_en: "Register calibration final regression",
    import_prompt_vi: "Kiểm tra câu có chuyển từ thân mật sang chuyên nghiệp mà không trở nên lạnh hoặc cứng.",
    import_prompt_en: "Check that the sentence shifts from casual to professional without becoming cold or rigid.",
    sample: {
      pa: "ਇਹ ਗੱਲ ਦਿਲਚਸਪ ਹੈ, ਪਰ ਰਿਪੋਰਟ ਵਿੱਚ ਇਸ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਲਿਖਣਾ ਵਧੀਆ ਰਹੇਗਾ ਕਿ ਨਤੀਜੇ ਨੂੰ ਹੋਰ ਸਮੀਖਿਆ ਨਾਲ ਜੋੜਿਆ ਜਾਵੇ।",
      rom: "ih gal dilchasp hai, par report vich is nu is tarah likhna vadhia rahega ki natije nu hor samikhia nal joria jave.",
      vi: "Ý này thú vị, nhưng trong báo cáo nên viết theo cách liên hệ kết quả với thêm phần xem xét.",
      en: "This point is interesting, but in a report it is better to connect the result with further review.",
    },
    import_checks_vi: ["Professional nhưng không lạnh.", "Có chỉnh register.", "Giữ ý gốc."],
    import_checks_en: ["Professional but not cold.", "Shows register adjustment.", "Keeps the original point."],
    final_regression_checks_vi: ["Không quá thân mật.", "Không quá nặng văn phong.", "Không đổi nghĩa."],
    final_regression_checks_en: ["Not too informal.", "Not overly heavy in style.", "Does not change meaning."],
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
    learner_traps_vi: ["Đừng dịch word-by-word từ văn nói.", "Đừng làm câu quá xa cách."],
    learner_traps_en: ["Do not translate spoken style word for word.", "Do not make the sentence too distant."],
  },
  {
    id: "pa_c1_import_readiness_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ pre-integration",
    title_rom: "peshkari jawab pre-integration",
    title_vi: "Pre-integration phản hồi thuyết trình",
    title_en: "Presentation response pre-integration",
    import_prompt_vi: "Kiểm tra phản hồi Q&A có cảm ơn, giới hạn claim và đưa bước tiếp theo rõ ràng.",
    import_prompt_en: "Check that the Q&A response thanks the questioner, limits the claim, and gives a clear next step.",
    sample: {
      pa: "ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ। ਮੌਜੂਦਾ ਅੰਕੜੇ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਪਰ ਅਸੀਂ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਇਸ ਦੀ ਵਧੇਰੇ ਜਾਂਚ ਕਰਾਂਗੇ।",
      rom: "tuhade sawal lai dhanvad. maujuda ankde ikk shuruati rujhan dikhaounde han, par asi agle para vich is di vadhere janch karange.",
      vi: "Cảm ơn câu hỏi của bạn. Số liệu hiện có cho thấy một xu hướng ban đầu, nhưng chúng tôi sẽ kiểm tra thêm ở giai đoạn tiếp theo.",
      en: "Thank you for your question. The current figures show an initial trend, but we will examine it further in the next stage.",
    },
    import_checks_vi: ["Mở đầu lịch sự.", "Claim có giới hạn.", "Có next step."],
    import_checks_en: ["Polite opening.", "Limited claim.", "Has a next step."],
    final_regression_checks_vi: ["Không phòng thủ.", "Không chắc quá mức.", "Không né câu hỏi."],
    final_regression_checks_en: ["Not defensive.", "Not overly certain.", "Does not avoid the question."],
    pre_integration_notes_vi: ["Dùng được trong presentation module.", "Không cần scoring phát âm.", "Hợp practice Q&A."],
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
];
