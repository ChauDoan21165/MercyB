// Punjabi C1 final regression samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1FinalRegressionArea =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response";

export type PunjabiC1FinalRegressionMode =
  | "regression"
  | "sanity"
  | "pre_integration"
  | "final_readiness";

export type PunjabiC1FinalRegressionPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1FinalRegressionCard = {
  id: string;
  level: "C1";
  area: PunjabiC1FinalRegressionArea;
  mode: PunjabiC1FinalRegressionMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  regression_prompt_vi: string;
  regression_prompt_en: string;
  response_frame: PunjabiC1FinalRegressionPhrase;
  regression_checks_vi: readonly string[];
  regression_checks_en: readonly string[];
  sanity_checks_vi: readonly string[];
  sanity_checks_en: readonly string[];
  pre_integration_vi: readonly string[];
  pre_integration_en: readonly string[];
  final_readiness_vi: readonly string[];
  final_readiness_en: readonly string[];
  canada_example: PunjabiC1FinalRegressionPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1FinalRegressionSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1FinalRegressionSamples: PunjabiC1FinalRegressionCard[] = [
  {
    id: "pa_c1_regression_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "regression",
    title_pa: "ਰਸਮੀ ਲਿਖਤ regression",
    title_rom: "rasmi likhat regression",
    title_vi: "Regression văn phong trang trọng",
    title_en: "Formal writing regression",
    regression_prompt_vi: "Chọn opening trang trọng nhưng không bị nặng tay để kiểm tra lại.",
    regression_prompt_en: "Choose a formal opening that stays polished without becoming heavy.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਇਹ ਦਰਸਾਉਂਦੀ ਹੈ ਕਿ ਅਸੀਂ ਨਤੀਜੇ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹੀਏ ਅਤੇ ਹੋਰ ਸਬੂਤ ਦੀ ਉਡੀਕ ਕਰੀਏ।",
      rom: "uplabdh jankari ih darsaundi hai ki asi natije nu savdhani nal parhiye ate hor sabut di udik kariye.",
      vi: "Thông tin hiện có cho thấy nên đọc kết quả thận trọng và chờ thêm bằng chứng.",
      en: "The information available suggests that we should read the result cautiously and wait for more evidence.",
    },
    regression_checks_vi: ["Giữ giọng trang trọng.", "Có hedge hợp lý.", "Không quá cứng."],
    regression_checks_en: ["Keeps a formal tone.", "Uses reasonable hedging.", "Not too rigid."],
    sanity_checks_vi: ["Nghe như văn viết.", "Không giống chat.", "Không rơi vào tuyệt đối."],
    sanity_checks_en: ["Sounds written.", "Does not sound chat-like.", "Does not become absolute."],
    pre_integration_vi: ["Dùng được trong report.", "Dễ chuyển vào template.", "Câu gọn mà đủ."],
    pre_integration_en: ["Usable in a report.", "Easy to move into a template.", "Short but sufficient."],
    final_readiness_vi: ["Sẵn sàng đưa vào sản phẩm.", "Không lệch register.", "Giữ tác dụng học thuật."],
    final_readiness_en: ["Ready for product use.", "No register drift.", "Keeps academic value."],
    canada_example: {
      context_vi: "Văn phong trang trọng cho bối cảnh Canada.",
      context_en: "Formal writing for a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਰਿਪੋਰਟ ਲਈ ਇਹ ਕਹਿਣਾ ਢੰਗੀ ਹੈ ਕਿ ਮੌਜੂਦਾ ਸਬੂਤ ਹਾਲੇ ਪੂਰੇ ਨਹੀਂ ਹਨ।",
      rom: "Canada vich report lai ih kahna dangi hai ki maujuda sabut hale pure nahin han.",
      vi: "Trong báo cáo ở Canada, nên nói rằng bằng chứng hiện có vẫn chưa đầy đủ.",
      en: "In a report in Canada, it is appropriate to say that the current evidence is still incomplete.",
    },
    learner_traps_vi: ["Đừng viết như chat.", "Đừng quá tuyệt đối."],
    learner_traps_en: ["Do not write like chat.", "Do not sound absolute."],
  },
  {
    id: "pa_c1_regression_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "regression",
    title_pa: "ਸਰੋਤ ਸਾਰ regression",
    title_rom: "sarot saar regression",
    title_vi: "Regression tóm tắt nguồn",
    title_en: "Source summary regression",
    regression_prompt_vi: "Chọn summary giữ claim chính và evidence mà không trượt sang nhận xét.",
    regression_prompt_en: "Choose the summary that keeps the main claim and evidence without slipping into commentary.",
    response_frame: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਫੀਡਬੈਕ ਨਾਲ ਇਹ ਗੱਲ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai. lekhak udik samen ate feedback nal ih gal samarthan karda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin. Tác giả hỗ trợ điều này bằng thời gian chờ và phản hồi.",
      en: "The source's main claim is that clear timelines can increase trust. The writer supports this with wait times and feedback.",
    },
    regression_checks_vi: ["Nguồn vẫn là chủ thể.", "Claim và evidence đi cùng nhau.", "Không có ý kiến chen vào."],
    regression_checks_en: ["The source remains the subject.", "Claim and evidence stay together.", "No inserted opinion."],
    sanity_checks_vi: ["Không biến thành review.", "Giữ trật tự thông tin.", "Không phóng đại vai trò."],
    sanity_checks_en: ["Does not become a review.", "Keeps information order.", "Does not exaggerate the role."],
    pre_integration_vi: ["Đủ ngắn cho bài học.", "Không trượt sang critique.", "Giữ neutrality."],
    pre_integration_en: ["Short enough for a lesson.", "Does not drift into critique.", "Keeps neutrality."],
    final_readiness_vi: ["Đủ rõ để tái dùng.", "Có thể chèn vào handout.", "Dạy ngay được."],
    final_readiness_en: ["Clear enough to reuse.", "Can be inserted into a handout.", "Ready to teach immediately."],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source summary about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਨੂੰ ਸਪਸ਼ਟ ਰੱਖਣ ਨਾਲ ਗਲਤਫਹਿਮੀ ਘੱਟ ਹੋ ਸਕਦੀ ਹੈ।",
      rom: "Canada vich seva jankari nu spasht rakhhan nal galtfehmi ghatt ho sakdi hai.",
      vi: "Tại Canada, giữ thông tin dịch vụ rõ ràng có thể giảm hiểu lầm.",
      en: "In Canada, keeping service information clear can reduce misunderstanding.",
    },
    learner_traps_vi: ["Đừng biến summary thành review.", "Đừng nhấn chi tiết phụ."],
    learner_traps_en: ["Do not turn the summary into a review.", "Do not over-emphasize side details."],
  },
  {
    id: "pa_c1_regression_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "sanity",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ sanity",
    title_rom: "savdhan daava sanity",
    title_vi: "Sanity check claim thận trọng",
    title_en: "Cautious claim sanity check",
    regression_prompt_vi: "Chọn câu claim có lực nhưng vẫn giữ giới hạn dữ liệu rõ ràng.",
    regression_prompt_en: "Choose the claim that has force while keeping the data limits explicit.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "uplabdh ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par lambe samen de prabhav lai hor samikhia lorindi hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng tác động dài hạn vẫn cần được xem xét thêm.",
      en: "The available figures suggest that the new process may be helpful, but the long-term effect still needs further review.",
    },
    regression_checks_vi: ["Có hedge.", "Không overclaim.", "Có hạn chế dài hạn."],
    regression_checks_en: ["Has hedging.", "Does not overclaim.", "Has a long-term limitation."],
    sanity_checks_vi: ["Nghe có cân nhắc.", "Không nói quá đà.", "Còn thấy dữ liệu."],
    sanity_checks_en: ["Sounds measured.", "Does not overstate.", "Still reflects the data."],
    pre_integration_vi: ["Nói chắc vừa đủ.", "Không làm mờ ý.", "Giữ tính học thuật."],
    pre_integration_en: ["Measured certainty.", "Does not blur meaning.", "Keeps academic tone."],
    final_readiness_vi: ["Chuyển sang bản cuối được.", "Có thể dùng ở slide.", "Không vượt dữ liệu."],
    final_readiness_en: ["Ready to move into the final version.", "Usable in a slide.", "Does not exceed the data."],
    canada_example: {
      context_vi: "Claim thận trọng về pilot tại Canada.",
      context_en: "Cautious claim about a pilot in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਲਈ ਹੋਰ ਡਾਟਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de pilot ton lagda hai ki navi prakiria madad kar sakdi hai, par vadde padhar lai hor data chahida hai.",
      vi: "Từ pilot ở Canada, có vẻ quy trình mới có thể hữu ích, nhưng để mở rộng cần thêm dữ liệu.",
      en: "The Canadian pilot suggests the new process may help, but more data is needed for scaling.",
    },
    learner_traps_vi: ["Đừng nói chắc từ mẫu nhỏ.", "Đừng hedge quá mạnh."],
    learner_traps_en: ["Do not sound certain from a small sample.", "Do not hedge too much."],
  },
  {
    id: "pa_c1_regression_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "regression",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ regression",
    title_rom: "sabut tulna regression",
    title_vi: "Regression so sánh bằng chứng",
    title_en: "Evidence comparison regression",
    regression_prompt_vi: "Chọn cách so sánh hai nguồn chứng cứ mà không làm mờ khác biệt chính.",
    regression_prompt_en: "Choose the way to compare two evidence sources without blurring their key differences.",
    response_frame: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਗਿਣਤੀ ਦੇ ਅੰਕ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਵਰਤੋਂਕਾਰ ਅਨੁਭਵ ਨੂੰ ਉਭਾਰਦਾ ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਤਸਵੀਰ ਪੂਰੀ ਕਰਦੇ ਹਨ।",
      rom: "pahla sarot ginti de ank dinda hai, jadki duja sarot vartokar anubhav nu ubharda hai. dono mil ke tasvir puri karde han.",
      vi: "Nguồn thứ nhất đưa số liệu, còn nguồn thứ hai nhấn mạnh trải nghiệm người dùng. Hai nguồn cùng làm bức tranh đầy đủ hơn.",
      en: "The first source provides numbers, while the second highlights user experience. Together they complete the picture.",
    },
    regression_checks_vi: ["So sánh rõ.", "Khác biệt còn thấy.", "Không trộn lẫn bằng chứng."],
    regression_checks_en: ["Comparison is clear.", "Differences remain visible.", "Evidence is not blended together."],
    sanity_checks_vi: ["Không coi nguồn nào là tuyệt đối.", "Có trật tự so sánh.", "Giữ đúng vai trò."],
    sanity_checks_en: ["Does not treat either source as absolute.", "Keeps comparison order.", "Maintains the right role."],
    pre_integration_vi: ["Dùng được trong workshop.", "Có thể chuyển vào rubric.", "Không lẫn nhận xét."],
    pre_integration_en: ["Usable in a workshop.", "Can move into a rubric.", "Does not merge with commentary."],
    final_readiness_vi: ["Sẵn sàng cho phần so sánh.", "Giữ cấu trúc ổn.", "Hợp để ôn cuối."],
    final_readiness_en: ["Ready for the comparison section.", "Keeps a stable structure.", "Good for final review."],
    canada_example: {
      context_vi: "So sánh bằng chứng cho bối cảnh Canada.",
      context_en: "Evidence comparison for a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੇਸ ਵਿੱਚ ਸਰਕਾਰੀ ਅੰਕੜੇ ਅਤੇ ਲੋਕਾਂ ਦੇ ਤਜਰਬੇ ਦੋਵੇਂ ਨੂੰ ਇਕੱਠੇ ਦੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de case vich sarkari ankde ate lokan de tajarbe dono nu ikathe dekhna chahida hai.",
      vi: "Trong trường hợp Canada, nên xem cả số liệu chính thức lẫn trải nghiệm của người dân.",
      en: "In the Canadian case, both official figures and people's experiences should be considered together.",
    },
    learner_traps_vi: ["Đừng lẫn comparison với kết luận.", "Đừng xóa khác biệt."],
    learner_traps_en: ["Do not mix comparison with conclusion.", "Do not erase the differences."],
  },
  {
    id: "pa_c1_regression_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ regression",
    title_rom: "peshavar patar-vihar regression",
    title_vi: "Regression thư tín chuyên nghiệp",
    title_en: "Professional correspondence regression",
    regression_prompt_vi: "Chọn email follow-up lịch sự, rõ request và không giống chat.",
    regression_prompt_en: "Choose the follow-up email that is polite, clear in its request, and not chat-like.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please let me know when the next step can be expected.",
    },
    regression_checks_vi: ["Lịch sự.", "Có request rõ.", "Không trách móc."],
    regression_checks_en: ["Polite.", "Has a clear request.", "No blaming."],
    sanity_checks_vi: ["Giọng công việc còn rõ.", "Không quá thân.", "Nghe như email thật."],
    sanity_checks_en: ["Work tone stays clear.", "Not too familiar.", "Sounds like a real email."],
    pre_integration_vi: ["Sẵn sàng gửi văn phòng.", "Dùng được ngay.", "Ngắn mà đủ."],
    pre_integration_en: ["Ready to send to an office.", "Usable immediately.", "Short but sufficient."],
    final_readiness_vi: ["Đi vào workflow được.", "Giữ lịch sự ổn.", "Có next step."],
    final_readiness_en: ["Fits into workflow.", "Keeps politeness stable.", "Has a next step."],
    canada_example: {
      context_vi: "Email công việc cho bối cảnh Canada.",
      context_en: "Work email for a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਫਾਲੋ-ਅਪ ਈਮੇਲ ਵਿੱਚ ਸਿੱਧੀ ਪਰ ਨਿਮਰ ਬੋਲੀ ਸਭ ਤੋਂ ਢੰਗੀ ਲੱਗਦੀ ਹੈ।",
      rom: "Canada vich follow-up email vich sidhhi par nimar boli sab ton dangi lagdi hai.",
      vi: "Trong email follow-up ở Canada, lối nói thẳng nhưng lịch sự là phù hợp nhất.",
      en: "In a follow-up email in Canada, direct but polite wording feels most appropriate.",
    },
    learner_traps_vi: ["Đừng quá thân mật.", "Đừng vòng vo."],
    learner_traps_en: ["Do not sound overly familiar.", "Do not be roundabout."],
  },
  {
    id: "pa_c1_regression_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "sanity",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ sanity",
    title_rom: "karjakari sankhep sanity",
    title_vi: "Sanity check bản tóm tắt điều hành",
    title_en: "Executive summary sanity check",
    regression_prompt_vi: "Chọn executive summary giữ ưu tiên, rủi ro và next step trong một đoạn ngắn rõ ràng.",
    regression_prompt_en: "Choose the executive summary that keeps priorities, risks, and next steps in one short, clear paragraph.",
    response_frame: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਇਹ ਹੈ ਕਿ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਬਣੀ ਰਹੇ, ਖਰਚਾ ਕਾਬੂ ਵਿੱਚ ਰਹੇ, ਅਤੇ ਟੀਮ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਰੱਖੇ।",
      rom: "mukh tarji ih hai ki seva di gunvatta bani rahe, kharcha kabu vich rahe, ate team agla kadam spasht rakhe.",
      vi: "Ưu tiên chính là giữ chất lượng dịch vụ, kiểm soát chi phí, và để đội ngũ có bước tiếp theo rõ ràng.",
      en: "The main priorities are to maintain service quality, keep costs under control, and make the next step clear for the team.",
    },
    regression_checks_vi: ["Ưu tiên rõ.", "Rủi ro không mất.", "Có next step."],
    regression_checks_en: ["Priorities are clear.", "Risks are not lost.", "Has a next step."],
    sanity_checks_vi: ["Ngắn đúng mức.", "Không thành memo dài.", "Có thứ tự quản trị."],
    sanity_checks_en: ["Concise enough.", "Does not become a long memo.", "Has executive order."],
    pre_integration_vi: ["Ngắn gọn đúng mức.", "Giữ nhịp điều hành.", "Dùng được cho leadership."],
    pre_integration_en: ["Concise but sufficient.", "Keeps an executive rhythm.", "Usable for leadership."],
    final_readiness_vi: ["Sẵn sàng vào deck.", "Không quá dài.", "Có thể đọc nhanh."],
    final_readiness_en: ["Ready for a deck.", "Not too long.", "Can be read quickly."],
    canada_example: {
      context_vi: "Tóm tắt điều hành cho dự án Canada.",
      context_en: "Executive summary for a Canadian project.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚ ਖਰਚੇ ਤੇ ਗੁਣਵੱਤਾ ਦੋਵੇਂ ਨੂੰ ਇਕੱਠੇ ਸੰਭਾਲਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
      rom: "Canada de project vich kharche te gunvatta dono nu ikathe sambhalna lazmi hai.",
      vi: "Trong dự án Canada, cần xử lý đồng thời chi phí và chất lượng.",
      en: "In the Canadian project, cost and quality need to be managed together.",
    },
    learner_traps_vi: ["Đừng biến thành memo dài.", "Đừng mất ưu tiên chính."],
    learner_traps_en: ["Do not turn it into a long memo.", "Do not lose the main priorities."],
  },
  {
    id: "pa_c1_regression_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "final_readiness",
    title_pa: "ਰਜਿਸਟਰ calibration regression",
    title_rom: "register calibration regression",
    title_vi: "Regression hiệu chỉnh register",
    title_en: "Register calibration regression",
    regression_prompt_vi: "Chọn câu cân bằng giữa học thuật, công việc và giao tiếp trực tiếp mà vẫn giữ register ổn định.",
    regression_prompt_en: "Choose the sentence that balances academic, workplace, and direct communication while keeping register stable.",
    response_frame: {
      pa: "ਇਹ ਨਤੀਜਾ ਹੁਣੇ ਅੰਤਿਮ ਨਹੀਂ ਕਿਹਾ ਜਾ ਸਕਦਾ, ਪਰ ਇਹ ਇਸ਼ਾਰਾ ਕਰਦਾ ਹੈ ਕਿ ਅਸੀਂ ਅਗਲਾ ਪੜਾਅ ਧਿਆਨ ਨਾਲ ਤੈਅ ਕਰੀਏ।",
      rom: "ih natija hune antim nahin keha ja sakda, par ih ishara karda hai ki asi agla parhav dhyan nal tay kariye.",
      vi: "Kết quả này chưa thể gọi là cuối cùng, nhưng nó cho thấy nên xác định bước tiếp theo cẩn thận.",
      en: "This result cannot yet be called final, but it suggests that we should set the next stage carefully.",
    },
    regression_checks_vi: ["Không quá công thức.", "Không quá thân.", "Giọng giữ ổn."],
    regression_checks_en: ["Not overly formulaic.", "Not too familiar.", "Voice stays stable."],
    sanity_checks_vi: ["Nghe tự nhiên.", "Không ép độ trang trọng.", "Vẫn rõ ý."],
    sanity_checks_en: ["Sounds natural.", "Does not force formality.", "Meaning stays clear."],
    pre_integration_vi: ["Có thể dùng trong workshop.", "Giữ tone trung tính.", "Không đẩy sắc thái."],
    pre_integration_en: ["Usable in a workshop.", "Keeps a neutral tone.", "Does not push the shade too far."],
    final_readiness_vi: ["Sẵn sàng cho chuyển đổi register.", "Đủ trung tính.", "Không lệch nghĩa."],
    final_readiness_en: ["Ready for register transfer.", "Neutral enough.", "Does not distort meaning."],
    canada_example: {
      context_vi: "Hiệu chỉnh register cho bối cảnh Canada.",
      context_en: "Register calibration for a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਇੰਟਰਵਿਊ ਅਤੇ ਰਿਪੋਰਟ ਦੋਵੇਂ ਲਈ ਟੋਨ ਸਹੀ ਰੱਖਣਾ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
      rom: "Canada vich interview ate report dono lai tone sahi rakhna mahattvapurn hai.",
      vi: "Ở Canada, giữ đúng giọng cho cả phỏng vấn và báo cáo đều rất quan trọng.",
      en: "In Canada, keeping the right tone for both interviews and reports matters a lot.",
    },
    learner_traps_vi: ["Đừng để tone trôi.", "Đừng ép câu quá formal."],
    learner_traps_en: ["Do not let the tone drift.", "Do not force the sentence too formal."],
  },
  {
    id: "pa_c1_regression_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ regression",
    title_rom: "peshkari jawab regression",
    title_vi: "Regression câu trả lời thuyết trình",
    title_en: "Presentation response regression",
    regression_prompt_vi: "Chọn response ngắn gọn cho phần hỏi-đáp thuyết trình nhưng vẫn có chiều sâu.",
    regression_prompt_en: "Choose a concise response for the presentation Q&A that still has depth.",
    response_frame: {
      pa: "ਮੈਂ ਇਸ ਨੁਕਤੇ ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਦੇਖਾਂਗਾ: ਪਹਿਲਾਂ ਮੌਜੂਦਾ ਡਾਟਾ ਕੀ ਦੱਸਦਾ ਹੈ, ਤੇ ਫਿਰ ਅਗਲੇ ਕਦਮ ਲਈ ਕੀ ਧਿਆਨ ਵਿੱਚ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "main is nukte nu do hissan vich dekhanga: pahlan maujuda data ki dassda hai, te phir agle kadam lai ki dhyan vich rakhna chahida hai.",
      vi: "Tôi sẽ nhìn điểm này theo hai phần: trước hết dữ liệu hiện có nói gì, rồi đến điều cần lưu ý cho bước tiếp theo.",
      en: "I would look at this in two parts: first what the current data shows, and then what should be kept in mind for the next step.",
    },
    regression_checks_vi: ["Có cấu trúc rõ.", "Không lạc đề.", "Có chiều sâu vừa đủ."],
    regression_checks_en: ["Has clear structure.", "Does not drift off topic.", "Has enough depth."],
    sanity_checks_vi: ["Nghe tự nhiên khi nói.", "Không quá dài.", "Bắt được câu hỏi."],
    sanity_checks_en: ["Sounds natural when spoken.", "Not too long.", "Addresses the question."],
    pre_integration_vi: ["Dùng được cho workshop.", "Dễ đưa vào deck.", "Có nhịp Q&A."],
    pre_integration_en: ["Usable in a workshop.", "Easy to place in a deck.", "Has Q&A rhythm."],
    final_readiness_vi: ["Dùng được cho Q&A.", "Giữ nhịp trình bày.", "Không thừa lời."],
    final_readiness_en: ["Usable for Q&A.", "Keeps the presentation rhythm.", "No extra words."],
    canada_example: {
      context_vi: "Phần hỏi-đáp thuyết trình ở Canada.",
      context_en: "Presentation Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਰਸ਼ਕ ਲਈ ਸੰਖੇਪ ਜਵਾਬ ਦੇ ਨਾਲ ਇਹ ਵੀ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ਅਸੀਂ ਅਗਲਾ ਕਦਮ ਸਮਝਦੇ ਹਾਂ।",
      rom: "Canada de darsak lai sankhep jawab de nal ih vi dikhona chahida hai ki asi agla kadam samajhde han.",
      vi: "Với khán giả ở Canada, câu trả lời ngắn cũng nên cho thấy ta hiểu bước tiếp theo.",
      en: "For a Canadian audience, a brief answer should also show that we understand the next step.",
    },
    learner_traps_vi: ["Đừng trả lời lan man.", "Đừng quá phòng thủ."],
    learner_traps_en: ["Do not answer at length.", "Do not become defensive."],
  },
];
