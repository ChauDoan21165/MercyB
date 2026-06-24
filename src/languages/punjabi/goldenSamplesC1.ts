// Punjabi C1 golden samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiGoldenSampleSkillC1 =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "comparing_evidence"
  | "professional_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "public_professional_text_handling";

export type PunjabiGoldenSampleModeC1 = "golden_sample" | "final_qa" | "integration_readiness";

export type PunjabiGoldenSamplePhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiGoldenSampleC1 = {
  id: string;
  level: "C1";
  skill: PunjabiGoldenSampleSkillC1;
  mode: PunjabiGoldenSampleModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  task_context_vi: string;
  task_context_en: string;
  golden_sample: PunjabiGoldenSamplePhraseC1;
  why_it_works_vi: readonly string[];
  why_it_works_en: readonly string[];
  final_qa_checks_vi: readonly string[];
  final_qa_checks_en: readonly string[];
  canada_example: PunjabiGoldenSamplePhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const goldenSamplesScriptAwareness = {
  vi: "Các golden sample dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "These golden samples use Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi script, not as the main practice script.",
} as const;

export const goldenSamplesC1: PunjabiGoldenSampleC1[] = [
  {
    id: "pa_c1_golden_formal_writing_policy",
    level: "C1",
    skill: "formal_writing",
    mode: "golden_sample",
    title_pa: "ਰਸਮੀ ਨੀਤੀ ਪੈਰਾ",
    title_rom: "rasmi niti paira",
    title_vi: "Đoạn văn chính sách trang trọng",
    title_en: "Formal policy paragraph",
    task_context_vi: "Viết một đoạn C1 nêu lập trường có điều kiện về hỗ trợ sinh viên.",
    task_context_en: "Write a C1 paragraph giving a qualified position on student support.",
    golden_sample: {
      pa: "ਮੌਜੂਦਾ ਸਬੂਤ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਨੂੰ ਸਿਰਫ ਆਰਥਿਕ ਮਦਦ ਤੱਕ ਸੀਮਿਤ ਨਹੀਂ ਰੱਖਣਾ ਚਾਹੀਦਾ। ਜੇ ਸੰਸਥਾਵਾਂ ਭਾਸ਼ਾ, ਯੋਜਨਾ ਅਤੇ ਮਾਨਸਿਕ ਸਿਹਤ ਸਹਾਇਤਾ ਨੂੰ ਇਕੱਠੇ ਜੋੜਦੀਆਂ ਹਨ, ਤਾਂ ਨਵੇਂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਅਕਾਦਮਿਕ ਫੈਸਲੇ ਹੋਰ ਸਪਸ਼ਟ ਹੋ ਸਕਦੇ ਹਨ।",
      rom: "maujuda sabut darsaunde han ki vidyarthi sahaita nu sirf arthik madad takk simit nahin rakhna chahida. je sansthavan bhasha, yojna ate mansik sehat sahaita nu ikatthe jordian han, tan nave vidyarthian lai academic faisle hor spasht ho sakde han.",
      vi: "Bằng chứng hiện có cho thấy hỗ trợ sinh viên không nên chỉ giới hạn ở tài chính. Nếu các cơ sở kết hợp hỗ trợ ngôn ngữ, lập kế hoạch và sức khỏe tinh thần, quyết định học thuật của sinh viên mới có thể rõ hơn.",
      en: "Current evidence indicates that student support should not be limited to financial aid. If institutions connect language, planning, and mental-health support, academic decisions may become clearer for new students.",
    },
    why_it_works_vi: ["Có lập trường nhưng không tuyệt đối.", "Dùng điều kiện nếu để giữ mức độ thận trọng.", "Liên kết chính sách với tác động thực tế."],
    why_it_works_en: ["It has a position without overclaiming.", "It uses if to keep the claim qualified.", "It links policy to practical effect."],
    final_qa_checks_vi: ["Thesis rõ.", "Register trang trọng.", "Không dùng giọng cá nhân."],
    final_qa_checks_en: ["Clear thesis.", "Formal register.", "No personal-opinion tone."],
    canada_example: {
      context_vi: "Đoạn chính sách về hỗ trợ sinh viên tại Canada.",
      context_en: "Policy paragraph about student support in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਸਹਾਇਤਾ ਤਦੋਂ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਜਾਣਕਾਰੀ, ਭਾਸ਼ਾ ਅਤੇ ਸਲਾਹ ਇਕੱਠੇ ਮਿਲਦੇ ਹਨ।",
      rom: "Canada vich nave vidyarthian lai sahaita tadon prabhavshali hundi hai jadon jankari, bhasha ate salah ikatthe milde han.",
      vi: "Tại Canada, hỗ trợ cho sinh viên mới hiệu quả hơn khi thông tin, ngôn ngữ và tư vấn đi cùng nhau.",
      en: "In Canada, support for new students is more effective when information, language, and advising work together.",
    },
    learner_traps_vi: ["Đừng viết quá rộng như giáo dục rất quan trọng.", "Đừng bỏ điều kiện khi dữ liệu chưa đủ mạnh."],
    learner_traps_en: ["Do not write something as broad as education is important.", "Do not remove qualification when evidence is not definitive."],
  },
  {
    id: "pa_c1_golden_source_summary",
    level: "C1",
    skill: "source_summary",
    mode: "final_qa",
    title_pa: "ਨਿਰਪੱਖ ਸਰੋਤ ਸਾਰ",
    title_rom: "nirpakh sarot saar",
    title_vi: "Tóm tắt nguồn trung lập",
    title_en: "Neutral source summary",
    task_context_vi: "Tóm tắt claim, evidence và kết luận của một nguồn mà không thêm ý kiến cá nhân.",
    task_context_en: "Summarize a source's claim, evidence, and conclusion without adding personal opinion.",
    golden_sample: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਹੈ ਕਿ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਸੁਧਾਰ ਲਈ ਸਮਾਂ-ਰੇਖਾ ਸਪਸ਼ਟ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ। ਲੇਖਕ ਇਸ ਦਾਅਵੇ ਨੂੰ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਵਰਤੋਂਕਾਰ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ। ਸੰਖੇਪ ਵਿੱਚ, ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਸਾਫ ਸੰਚਾਰ ਸੇਵਾ ਤੇ ਭਰੋਸਾ ਵਧਾ ਸਕਦਾ ਹੈ।",
      rom: "sarot da mukh daava hai ki seva di pahunch vich sudhar lai sama-rekha spasht honi chahidi hai. lekhak is daave nu udik samen ate vartonkar feedback nal samarthan dinda hai. sankhep vich, sarot sujhaounda hai ki saf sanchar seva te bharosa vadha sakda hai.",
      vi: "Claim chính của nguồn là để cải thiện khả năng tiếp cận dịch vụ, mốc thời gian cần rõ ràng. Tác giả hỗ trợ claim bằng thời gian chờ và phản hồi người dùng. Tóm lại, nguồn gợi ý rằng giao tiếp rõ có thể tăng niềm tin vào dịch vụ.",
      en: "The source's main claim is that clear timelines are needed to improve service access. The writer supports this claim with wait times and user feedback. In summary, the source suggests that clear communication can increase trust in the service.",
    },
    why_it_works_vi: ["Tách claim, evidence và conclusion.", "Không thêm tôi nghĩ.", "Giữ từ có thể để phản ánh mức độ claim."],
    why_it_works_en: ["It separates claim, evidence, and conclusion.", "It does not add I think.", "It keeps can to reflect the claim strength."],
    final_qa_checks_vi: ["Có nguồn làm chủ thể.", "Evidence được nén.", "Không sao chép dài."],
    final_qa_checks_en: ["The source remains the subject.", "Evidence is compressed.", "No long copying."],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Summarizing a source about community services in Canada.",
      pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਸੇਵਾਵਾਂ ਲਈ ਬਹੁਭਾਸ਼ੀ ਜਾਣਕਾਰੀ ਪਹੁੰਚ ਨੂੰ ਸੁਧਾਰ ਸਕਦੀ ਹੈ।",
      rom: "sarot sujhaounda hai ki Canada vich community sevavan lai bahubhashi jankari pahunch nu sudhar sakdi hai.",
      vi: "Nguồn gợi ý rằng tại Canada, thông tin đa ngôn ngữ có thể cải thiện khả năng tiếp cận dịch vụ cộng đồng.",
      en: "The source suggests that in Canada, multilingual information can improve access to community services.",
    },
    learner_traps_vi: ["Đừng biến summary thành phản hồi cá nhân.", "Đừng dịch từng câu nếu mất cấu trúc nguồn."],
    learner_traps_en: ["Do not turn the summary into a personal response.", "Do not translate sentence by sentence if source structure is lost."],
  },
  {
    id: "pa_c1_golden_cautious_claim",
    level: "C1",
    skill: "cautious_claim",
    mode: "integration_readiness",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ",
    title_rom: "savdhan daava",
    title_vi: "Claim thận trọng",
    title_en: "Cautious claim",
    task_context_vi: "Viết claim học thuật không quá chắc khi bằng chứng chỉ cho thấy xu hướng.",
    task_context_en: "Write an academic claim that avoids overcertainty when evidence shows only a trend.",
    golden_sample: {
      pa: "ਉਪਲਬਧ ਡਾਟਾ ਇਹ ਦਰਸਾਉਂਦਾ ਹੈ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਉਡੀਕ ਸਮੇਂ ਨੂੰ ਘਟਾ ਸਕਦੀ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਦੀ ਲੋੜ ਹੈ।",
      rom: "uplabdh data ih darsaunda hai ki navi prakiria udik samen nu ghata sakdi hai, par lambe samen de prabhav lai hor samikhia di lor hai.",
      vi: "Dữ liệu hiện có cho thấy quy trình mới có thể giảm thời gian chờ, nhưng tác động dài hạn cần được rà soát thêm.",
      en: "The available data indicates that the new process may reduce wait times, but its long-term effect requires further review.",
    },
    why_it_works_vi: ["Dùng có thể thay vì chắc chắn.", "Nêu giới hạn dài hạn.", "Giữ claim gắn với dữ liệu."],
    why_it_works_en: ["It uses may rather than certainty.", "It states the long-term limitation.", "It keeps the claim tied to data."],
    final_qa_checks_vi: ["Có hedge.", "Có giới hạn.", "Không thêm kết luận vượt dữ liệu."],
    final_qa_checks_en: ["Has hedging.", "Has limitation.", "No conclusion beyond the data."],
    canada_example: {
      context_vi: "Claim thận trọng trong báo cáo dịch vụ tại Canada.",
      context_en: "Cautious claim in a service report in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਇਸ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਆਨਲਾਈਨ ਫਾਰਮ ਮਦਦਗਾਰ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਨਤੀਜੇ ਹਾਲੇ ਸੀਮਿਤ ਹਨ।",
      rom: "Canada de is pilot ton lagda hai ki online form madadgar ho sakda hai, par natije hale simit han.",
      vi: "Từ thử nghiệm tại Canada này, có vẻ biểu mẫu trực tuyến có thể hữu ích, nhưng kết quả vẫn còn giới hạn.",
      en: "This Canadian pilot suggests that the online form may be helpful, but the results remain limited.",
    },
    learner_traps_vi: ["Đừng dùng luôn luôn hoặc chắc chắn khi dữ liệu nhỏ.", "Đừng hedge quá nhiều khiến câu mất ý."],
    learner_traps_en: ["Do not use always or certainly with limited data.", "Do not over-hedge until the sentence loses meaning."],
  },
  {
    id: "pa_c1_golden_compare_evidence",
    level: "C1",
    skill: "comparing_evidence",
    mode: "golden_sample",
    title_pa: "ਸਬੂਤ ਦੀ ਤੁਲਨਾ",
    title_rom: "sabut di tulna",
    title_vi: "So sánh bằng chứng",
    title_en: "Comparing evidence",
    task_context_vi: "So sánh hai nguồn có mức độ mạnh yếu khác nhau.",
    task_context_en: "Compare two sources with different strengths of evidence.",
    golden_sample: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਵੱਡੇ ਨਮੂਨੇ ਤੇ ਆਧਾਰਿਤ ਹੈ, ਇਸ ਲਈ ਇਸ ਦੀ ਦਿਸ਼ਾ ਵਧੇਰੇ ਭਰੋਸੇਯੋਗ ਹੈ। ਦੂਜਾ ਸਰੋਤ ਛੋਟੇ ਇੰਟਰਵਿਊ ਵਰਤਦਾ ਹੈ, ਪਰ ਇਹ ਦੱਸਦਾ ਹੈ ਕਿ ਲੋਕ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦੇ ਹਨ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਦਿਖਾਉਂਦੇ ਹਨ ਕਿ ਗਿਣਤੀ ਅਤੇ ਅਨੁਭਵ ਦੋਹਾਂ ਨੂੰ ਫੈਸਲੇ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "pahila sarot vadde namune te adharit hai, is lai is di disha vadhere bharoseyog hai. duja sarot chhote interview vartda hai, par ih dassda hai ki lok prakiria nu kiven mahsus karde han. dovein mil ke dikhaunde han ki ginti ate anubhav dohan nu faisle vich shamil karna chahida hai.",
      vi: "Nguồn thứ nhất dựa trên mẫu lớn nên hướng kết luận đáng tin hơn. Nguồn thứ hai dùng phỏng vấn nhỏ, nhưng cho thấy người dùng cảm nhận quy trình như thế nào. Cả hai cùng cho thấy quyết định nên tính cả số liệu và trải nghiệm.",
      en: "The first source is based on a large sample, so its direction is more reliable. The second uses small interviews, but it shows how people experience the process. Together, they show that both numbers and experience should inform the decision.",
    },
    why_it_works_vi: ["Không chỉ nói hai nguồn khác nhau.", "Nêu chức năng riêng của mỗi nguồn.", "Kết luận tích hợp hai loại evidence."],
    why_it_works_en: ["It does more than say the sources differ.", "It names what each source contributes.", "It integrates both kinds of evidence."],
    final_qa_checks_vi: ["Có source one/source two.", "Có tiêu chí so sánh.", "Có synthesis cuối."],
    final_qa_checks_en: ["Source one/source two are clear.", "A comparison criterion is present.", "There is final synthesis."],
    canada_example: {
      context_vi: "So sánh bằng chứng về dịch vụ y tế cộng đồng tại Canada.",
      context_en: "Comparing evidence about community health service in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਾਲੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਦੱਸਦੇ ਹਨ ਕਿ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਭਰੋਸੇ ਨੂੰ ਬਦਲਦੀ ਹੈ।",
      rom: "Canada vale ankde udik sama dikhaunde han, jadki interview dassde han ki bhasha sahaita bharose nu badaldi hai.",
      vi: "Số liệu tại Canada cho thấy thời gian chờ, trong khi phỏng vấn cho thấy hỗ trợ ngôn ngữ thay đổi niềm tin.",
      en: "The Canadian figures show wait time, while interviews show that language support changes trust.",
    },
    learner_traps_vi: ["Đừng tóm tắt hai nguồn riêng mà không so sánh.", "Đừng coi phỏng vấn nhỏ như bằng chứng thống kê lớn."],
    learner_traps_en: ["Do not summarize two sources separately without comparison.", "Do not treat small interviews like large statistical evidence."],
  },
  {
    id: "pa_c1_golden_professional_correspondence",
    level: "C1",
    skill: "professional_correspondence",
    mode: "final_qa",
    title_pa: "ਪੇਸ਼ਾਵਰ ਫਾਲੋ-ਅਪ",
    title_rom: "peshavar follow-up",
    title_vi: "Follow-up chuyên nghiệp",
    title_en: "Professional follow-up",
    task_context_vi: "Viết email follow-up lịch sự sau khi chưa nhận phản hồi.",
    task_context_en: "Write a polite follow-up email after receiving no response.",
    golden_sample: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਹਫਤੇ ਭੇਜੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਤੁਹਾਡੇ ਲਈ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ। ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕਿ ਸਮਾਂ-ਸਾਰਣੀ ਵਿਅਸਤ ਹੋ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ਕਿਸੇ ਵੀ ਛੋਟੀ ਅਪਡੇਟ ਲਈ ਧੰਨਵਾਦ।",
      rom: "main pichhle hafte bheje sunehe bare nimar follow-up kar riha han. je tuhade lai sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai. main samajhda han ki sama-sarni vyast ho sakdi hai, is lai kise vi chhoti update lai dhanvad.",
      vi: "Tôi xin phép follow-up lịch sự về tin nhắn đã gửi tuần trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo. Tôi hiểu lịch có thể bận, vì vậy xin cảm ơn bất kỳ cập nhật ngắn nào.",
      en: "I am politely following up on the message sent last week. If possible, please let me know when the next step can be expected. I understand schedules may be busy, so any brief update would be appreciated.",
    },
    why_it_works_vi: ["Lịch sự nhưng rõ mục đích.", "Có yêu cầu cụ thể.", "Không trách móc người nhận."],
    why_it_works_en: ["Polite but purposeful.", "Includes a specific request.", "Does not blame the recipient."],
    final_qa_checks_vi: ["Có bối cảnh.", "Có next step.", "Có register tôn trọng."],
    final_qa_checks_en: ["Context is present.", "Next step is requested.", "Respectful register is clear."],
    canada_example: {
      context_vi: "Follow-up gửi văn phòng dịch vụ tại Canada.",
      context_en: "Follow-up sent to a service office in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੇ ਸੁਨੇਹੇ ਬਾਰੇ ਮੈਂ ਨਿਮਰਤਾ ਨਾਲ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਕਦੋਂ ਅਪਡੇਟ ਹੋਵੇਗੀ।",
      rom: "Canada de daftar nu bheje sunehe bare main nimarta nal puchhna chahunda han ki arzi di sthiti kadon update hovegi.",
      vi: "Về tin nhắn gửi văn phòng tại Canada, tôi xin hỏi lịch sự khi nào tình trạng hồ sơ sẽ được cập nhật.",
      en: "Regarding the message sent to the office in Canada, I would like to politely ask when the application status will be updated.",
    },
    learner_traps_vi: ["Đừng viết quá ngắn như trả lời sớm.", "Đừng dùng giọng bực bội trong email chuyên nghiệp."],
    learner_traps_en: ["Do not write an overly short line like reply soon.", "Avoid irritated tone in professional email."],
  },
  {
    id: "pa_c1_golden_executive_summary",
    level: "C1",
    skill: "executive_summary",
    mode: "integration_readiness",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ",
    title_rom: "karjakari sankhep",
    title_vi: "Executive summary",
    title_en: "Executive summary",
    task_context_vi: "Viết summary ngắn cho người ra quyết định.",
    task_context_en: "Write a short summary for a decision-maker.",
    golden_sample: {
      pa: "ਇਸ ਸੰਖੇਪ ਦਾ ਕੇਂਦਰ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬ ਦੇਣ ਦੇ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਮੁੱਖ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ, ਪਰ ਜਵਾਬੀ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ। ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਪਹਿਲਾਂ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ ਅਤੇ ਦੋ ਹਫਤਿਆਂ ਬਾਅਦ ਨਤੀਜੇ ਸਮੀਖਿਆ ਕੀਤੇ ਜਾਣ।",
      rom: "is sankhep da kendar seva di pahunch ate jawab den de samen vichla farak hai. mukh natija ih hai ki mang vadhi hai, par jawabi samarthta use dar nal nahin vadhi. sifarash hai ki uch-jokham mamlian lai pahilan vakhri katar banai jave ate do haftian baad natije samikhia kite jan.",
      vi: "Trọng tâm của summary là khoảng cách giữa khả năng tiếp cận dịch vụ và thời gian phản hồi. Kết quả chính là nhu cầu tăng nhưng năng lực phản hồi không tăng cùng tốc độ. Khuyến nghị tạo hàng riêng cho trường hợp rủi ro cao trước và rà soát kết quả sau hai tuần.",
      en: "This summary focuses on the gap between service access and response time. The key finding is that demand has increased, but response capacity has not grown at the same rate. The recommendation is to first create a separate queue for high-risk cases and review results after two weeks.",
    },
    why_it_works_vi: ["Có issue, finding, recommendation.", "Ngắn nhưng đủ để quyết định.", "Có thời điểm review."],
    why_it_works_en: ["It includes issue, finding, and recommendation.", "Brief but decision-ready.", "Includes a review point."],
    final_qa_checks_vi: ["Không quá chi tiết.", "Có action.", "Có limitation hoặc scope rõ."],
    final_qa_checks_en: ["Not too detailed.", "Has action.", "Has clear scope or limitation."],
    canada_example: {
      context_vi: "Executive summary cho nhóm chương trình tại Canada.",
      context_en: "Executive summary for a program team in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਪ੍ਰੋਗਰਾਮ ਟੀਮ ਲਈ ਮੁੱਖ ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉਡੀਕ ਸਮਾਂ ਘਟਾਉਣ ਲਈ ਤੁਰੰਤ triage ਕਦਮ ਲਿਆ ਜਾਵੇ।",
      rom: "Canada vich program team lai mukh sifarash hai ki udik sama ghataun lai turant triage kadam lia jave.",
      vi: "Tại Canada, khuyến nghị chính cho nhóm chương trình là thực hiện bước phân loại ngay để giảm thời gian chờ.",
      en: "In Canada, the main recommendation for the program team is to take an immediate triage step to reduce wait time.",
    },
    learner_traps_vi: ["Đừng kể hết background.", "Đừng thiếu recommendation khi người đọc cần quyết định."],
    learner_traps_en: ["Do not narrate all background.", "Do not omit the recommendation when the reader needs a decision."],
  },
  {
    id: "pa_c1_golden_presentation_response",
    level: "C1",
    skill: "presentation_response",
    mode: "golden_sample",
    title_pa: "ਪ੍ਰਜ਼ੇਨਟੇਸ਼ਨ ਜਵਾਬ",
    title_rom: "presentation jawab",
    title_vi: "Phản hồi thuyết trình",
    title_en: "Presentation response",
    task_context_vi: "Trả lời câu hỏi khó sau phần trình bày học thuật.",
    task_context_en: "Answer a difficult question after an academic presentation.",
    golden_sample: {
      pa: "ਤੁਹਾਡਾ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਨਤੀਜੇ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਮੇਰੇ ਡਾਟਾ ਵਿੱਚ ਛੋਟੇ ਸ਼ਹਿਰਾਂ ਦੀ ਨਮਾਇੰਦਗੀ ਘੱਟ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਇਸ ਨਤੀਜੇ ਨੂੰ ਪੂਰੇ ਦੇਸ਼ ਲਈ ਅੰਤਿਮ ਨਹੀਂ ਕਹਾਂਗਾ। ਫਿਰ ਵੀ, ਇਹ ਪੈਟਰਨ ਅਗਲੇ ਵੱਡੇ ਅਧਿਐਨ ਲਈ ਸਪਸ਼ਟ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "tuhada sawal mahatvapuran hai kyonki ih natije di sima vall dhian divaunda hai. mere data vich chhote shahiran di numaindgi ghatt hai, is lai main is natije nu pure desh lai antim nahin kahanga. phir vi, ih pattern agle vadde adhiyan lai spasht disha dinda hai.",
      vi: "Câu hỏi của bạn quan trọng vì nó chú ý đến giới hạn của kết quả. Trong dữ liệu của tôi, thành phố nhỏ được đại diện ít, nên tôi sẽ không gọi kết quả này là kết luận cuối cho cả nước. Tuy vậy, mẫu này đưa ra hướng rõ cho nghiên cứu lớn tiếp theo.",
      en: "Your question is important because it points to a limitation of the finding. In my data, smaller cities are underrepresented, so I would not call this finding final for the whole country. Even so, the pattern gives a clear direction for the next larger study.",
    },
    why_it_works_vi: ["Công nhận câu hỏi.", "Nêu giới hạn.", "Bảo vệ giá trị của kết quả mà không phóng đại."],
    why_it_works_en: ["Acknowledges the question.", "States a limitation.", "Defends the value of the finding without overstating it."],
    final_qa_checks_vi: ["Không né câu hỏi.", "Có limitation.", "Có next research direction."],
    final_qa_checks_en: ["Does not avoid the question.", "Has limitation.", "Has next research direction."],
    canada_example: {
      context_vi: "Phản hồi sau thuyết trình nghiên cứu tại Canada.",
      context_en: "Response after a research presentation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਨਮੂਨੇ ਵਿੱਚ ਪੇਂਡੂ ਖੇਤਰ ਘੱਟ ਹਨ, ਇਸ ਲਈ ਨਤੀਜਾ ਸ਼ਹਿਰੀ ਸੇਵਾਵਾਂ ਲਈ ਵਧੇਰੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।",
      rom: "Canada de namune vich pendu khetr ghatt han, is lai natija shahiri sevavan lai vadhere lagu hunda hai.",
      vi: "Trong mẫu tại Canada, khu vực nông thôn ít hơn, vì vậy kết quả áp dụng nhiều hơn cho dịch vụ đô thị.",
      en: "In the Canadian sample, rural areas are fewer, so the finding applies more directly to urban services.",
    },
    learner_traps_vi: ["Đừng trả lời phòng thủ.", "Đừng nói dữ liệu hoàn hảo khi có limitation."],
    learner_traps_en: ["Do not answer defensively.", "Do not claim the data is perfect when there is a limitation."],
  },
  {
    id: "pa_c1_golden_public_professional_text",
    level: "C1",
    skill: "public_professional_text_handling",
    mode: "final_qa",
    title_pa: "ਜਨਤਕ ਅਤੇ ਪੇਸ਼ਾਵਰ ਲਿਖਤ",
    title_rom: "jantak ate peshavar likhat",
    title_vi: "Xử lý văn bản công và chuyên nghiệp",
    title_en: "Public and professional text handling",
    task_context_vi: "Chuyển thông tin dịch vụ thành thông báo rõ ràng, công bằng và chuyên nghiệp.",
    task_context_en: "Turn service information into a clear, fair, and professional notice.",
    golden_sample: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਲਾਗੂ ਹੋਵੇਗੀ। ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ ਦੀ ਮੀਟਿੰਗ ਪਹਿਲਾਂ ਹੀ ਬੁਕ ਹੈ, ਉਨ੍ਹਾਂ ਨੂੰ ਨਵਾਂ ਸਮਾਂ ਈਮੇਲ ਰਾਹੀਂ ਭੇਜਿਆ ਜਾਵੇਗਾ। ਜੇ ਕਿਸੇ ਨੂੰ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ, ਤਾਂ ਉਹ ਸੇਵਾ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰ ਸਕਦਾ ਹੈ।",
      rom: "seva samen vich tabdili agle somvar ton lagu hovegi. jinhan lokan di meeting pahilan hi book hai, unha nu nava sama email rahin bhejia javega. je kise nu bhasha sahaita di lor hai, tan oh seva kendar nal sampark kar sakda hai.",
      vi: "Thay đổi giờ dịch vụ sẽ có hiệu lực từ thứ Hai tới. Những người đã đặt lịch sẽ được gửi giờ mới qua email. Nếu cần hỗ trợ ngôn ngữ, họ có thể liên hệ trung tâm dịch vụ.",
      en: "The service-hour change will take effect next Monday. People who already have appointments will receive a new time by email. Anyone needing language support may contact the service centre.",
    },
    why_it_works_vi: ["Thông tin theo thứ tự hành động.", "Giữ giọng trung lập.", "Có hỗ trợ tiếp cận."],
    why_it_works_en: ["Information is ordered by action.", "Neutral tone is maintained.", "Access support is included."],
    final_qa_checks_vi: ["Ai bị ảnh hưởng rõ.", "Hành động tiếp theo rõ.", "Không dùng thuật ngữ nội bộ khó hiểu."],
    final_qa_checks_en: ["Affected people are clear.", "Next action is clear.", "No hard internal jargon."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công tại Canada.",
      context_en: "Public-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੀਂ ਸੇਵਾ ਜਾਣਕਾਰੀ ਲਈ ਵੈੱਬਸਾਈਟ, ਈਮੇਲ ਅਤੇ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਤਿੰਨੇ ਸਪਸ਼ਟ ਦਿੱਤੇ ਜਾਣ।",
      rom: "Canada vich navi seva jankari lai website, email ate bhasha sahaita tinne spasht ditte jan.",
      vi: "Tại Canada, đối với thông tin dịch vụ mới, website, email và hỗ trợ ngôn ngữ đều nên được nêu rõ.",
      en: "In Canada, for new service information, the website, email, and language support should all be stated clearly.",
    },
    learner_traps_vi: ["Đừng viết như memo nội bộ.", "Đừng quên người đọc cần biết phải làm gì tiếp theo."],
    learner_traps_en: ["Do not write it like an internal memo.", "Do not forget that readers need to know what to do next."],
  },
];
