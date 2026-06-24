// Punjabi C1 final integration selectors for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1FinalIntegrationSelectorArea =
  | "academic_frames"
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "professional_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response";

export type PunjabiC1FinalIntegrationSelectorMode =
  | "selector"
  | "pre_integration"
  | "final_readiness";

export type PunjabiC1FinalIntegrationSelectorPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1FinalIntegrationSelectorCard = {
  id: string;
  level: "C1";
  area: PunjabiC1FinalIntegrationSelectorArea;
  mode: PunjabiC1FinalIntegrationSelectorMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  selector_prompt_vi: string;
  selector_prompt_en: string;
  response_frame: PunjabiC1FinalIntegrationSelectorPhrase;
  decision_checks_vi: readonly string[];
  decision_checks_en: readonly string[];
  final_readiness_vi: readonly string[];
  final_readiness_en: readonly string[];
  integration_readiness_vi: readonly string[];
  integration_readiness_en: readonly string[];
  canada_example: PunjabiC1FinalIntegrationSelectorPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1FinalIntegrationSelectorsScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1FinalIntegrationSelectors: PunjabiC1FinalIntegrationSelectorCard[] = [
  {
    id: "pa_c1_selector_academic_frames",
    level: "C1",
    area: "academic_frames",
    mode: "selector",
    title_pa: "ਅਕਾਦਮਿਕ frame selector",
    title_rom: "academic frame selector",
    title_vi: "Bộ chọn khung học thuật",
    title_en: "Academic frame selector",
    selector_prompt_vi: "Chọn khung học thuật nào giữ claim, evidence và logic mà không bị nói quá.",
    selector_prompt_en: "Choose the academic frame that keeps claim, evidence, and logic without overstatement.",
    response_frame: {
      pa: "ਲੇਖ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਬਣਤਰ ਪਾਠਕ ਦੀ ਸਮਝ ਵਧਾਉਂਦੀ ਹੈ, ਅਤੇ ਲੇਖਕ ਇਸ ਨੂੰ ਉਦਾਹਰਨਾਂ ਨਾਲ ਸਹਾਰਦਾ ਹੈ।",
      rom: "lekh da mukh daava ih hai ki spasht bantrar pathak di samajh vadhaudi hai, ate lekhak is nu udaharanan nal saharda hai.",
      vi: "Claim chính của bài là cấu trúc rõ giúp người đọc hiểu tốt hơn, và tác giả hỗ trợ điều này bằng ví dụ.",
      en: "The article's main claim is that clear structure improves reader comprehension, and the writer supports this with examples.",
    },
    decision_checks_vi: ["Claim còn rõ.", "Evidence không bị lấn.", "Logic học thuật ổn."],
    decision_checks_en: ["The claim stays clear.", "Evidence is not crowded out.", "Academic logic holds."],
    final_readiness_vi: ["Dùng được cho class note.", "Không thêm đánh giá cá nhân.", "Giữ tone học thuật."],
    final_readiness_en: ["Usable for class notes.", "Adds no personal judgment.", "Keeps an academic tone."],
    integration_readiness_vi: ["Có thể tái dùng trong template.", "Ngắn gọn đủ ý.", "Giữ register ổn định."],
    integration_readiness_en: ["Reusable in a template.", "Short but complete.", "Keeps a stable register."],
    canada_example: {
      context_vi: "Khung học thuật cho bối cảnh Canada.",
      context_en: "Academic frame for a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਲੇਖ ਵਿੱਚ ਸਪਸ਼ਟ ਬਣਤਰ ਨੂੰ ਪੜ੍ਹਨਯੋਗਤਾ ਦਾ ਮੁੱਖ ਕਾਰਨ ਦੱਸਿਆ ਗਿਆ ਹੈ।",
      rom: "Canada de lekh vich spasht bantrar nu parhn yogyta da mukh karan dassia gaya hai.",
      vi: "Trong bài viết ở Canada, cấu trúc rõ được nêu là lý do chính cho khả năng đọc hiểu.",
      en: "In the Canadian article, clear structure is given as the main reason for readability.",
    },
    learner_traps_vi: ["Đừng biến frame thành nhận xét.", "Đừng bỏ claim chính."],
    learner_traps_en: ["Do not turn the frame into commentary.", "Do not lose the main claim."],
  },
  {
    id: "pa_c1_selector_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਲਿਖਤ selector",
    title_rom: "rasmi likhat selector",
    title_vi: "Bộ chọn văn phong trang trọng",
    title_en: "Formal writing selector",
    selector_prompt_vi: "Chọn cách viết mở trang trọng nhưng không nặng tay.",
    selector_prompt_en: "Choose a formal opening that is polished without sounding heavy.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਇਹ ਦਰਸਾਉਂਦੀ ਹੈ ਕਿ ਅਸੀਂ ਨਤੀਜੇ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹੀਏ ਅਤੇ ਹੋਰ ਸਬੂਤ ਦੀ ਉਡੀਕ ਕਰੀਏ।",
      rom: "uplabdh jankari ih darsaundi hai ki asi natije nu savdhani nal parhiye ate hor sabut di udik kariye.",
      vi: "Thông tin hiện có cho thấy nên đọc kết quả thận trọng và chờ thêm bằng chứng.",
      en: "The information available suggests that we should read the result cautiously and wait for more evidence.",
    },
    decision_checks_vi: ["Giọng trang trọng.", "Có hedge.", "Không quá cứng."],
    decision_checks_en: ["Formal tone.", "Has hedging.", "Not too rigid."],
    final_readiness_vi: ["Phù hợp report.", "Không đổi giọng.", "Giữ lập trường vừa phải."],
    final_readiness_en: ["Fits a report.", "No voice shift.", "Keeps measured stance."],
    integration_readiness_vi: ["Sẵn sàng cho slide.", "Dễ đưa vào handout.", "Câu ngắn mà đủ."],
    integration_readiness_en: ["Ready for slides.", "Easy to place in a handout.", "Short but sufficient."],
    canada_example: {
      context_vi: "Văn bản trang trọng cho bối cảnh Canada.",
      context_en: "Formal text for a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਰਿਪੋਰਟ ਲਈ ਇਹ ਕਹਿਣਾ ਢੰਗੀ ਹੈ ਕਿ ਮੌਜੂਦਾ ਸਬੂਤ ਹਾਲੇ ਪੂਰੇ ਨਹੀਂ ਹਨ।",
      rom: "Canada vich report lai ih kahna dangi hai ki maujuda sabut hale pure nahin han.",
      vi: "Trong báo cáo ở Canada, nên nói rằng bằng chứng hiện có vẫn chưa đầy đủ.",
      en: "In a report in Canada, it is appropriate to say that the current evidence is still incomplete.",
    },
    learner_traps_vi: ["Đừng viết như chat.", "Đừng quá tuyệt đối."],
    learner_traps_en: ["Do not write like chat.", "Do not sound absolute."],
  },
  {
    id: "pa_c1_selector_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "selector",
    title_pa: "ਸਰੋਤ ਸਾਰ selector",
    title_rom: "sarot saar selector",
    title_vi: "Bộ chọn tóm tắt nguồn",
    title_en: "Source summary selector",
    selector_prompt_vi: "Chọn summary giữ claim chính và evidence mà không trượt sang nhận xét.",
    selector_prompt_en: "Choose the summary that keeps the main claim and evidence without sliding into commentary.",
    response_frame: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਫੀਡਬੈਕ ਨਾਲ ਇਹ ਗੱਲ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai. lekhak udik samen ate feedback nal ih gal samarthan karda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin. Tác giả hỗ trợ điều này bằng thời gian chờ và phản hồi.",
      en: "The source's main claim is that clear timelines can increase trust. The writer supports this with wait times and feedback.",
    },
    decision_checks_vi: ["Nguồn vẫn là chủ thể.", "Claim và evidence đi cùng nhau.", "Không có ý kiến chen vào."],
    decision_checks_en: ["The source remains the subject.", "Claim and evidence stay together.", "No inserted opinion."],
    final_readiness_vi: ["Đủ ngắn để chèn bài học.", "Không lạc sang critique.", "Giữ neutrality."],
    final_readiness_en: ["Short enough for a lesson.", "Does not drift into critique.", "Keeps neutrality."],
    integration_readiness_vi: ["Dùng được làm mẫu.", "Tái dùng dễ.", "Giữ thứ tự thông tin."],
    integration_readiness_en: ["Usable as a model.", "Easy to reuse.", "Keeps information order."],
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
    id: "pa_c1_selector_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "final_readiness",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ selector",
    title_rom: "savdhan daava selector",
    title_vi: "Bộ chọn claim thận trọng",
    title_en: "Cautious claim selector",
    selector_prompt_vi: "Chọn câu claim có lực nhưng vẫn giữ giới hạn dữ liệu rõ ràng.",
    selector_prompt_en: "Choose the claim that has force while keeping the data limits explicit.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "uplabdh ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par lambe samen de prabhav lai hor samikhia lorindi hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng tác động dài hạn vẫn cần được xem xét thêm.",
      en: "The available figures suggest that the new process may be helpful, but the long-term effect still needs further review.",
    },
    decision_checks_vi: ["Có hedge.", "Không overclaim.", "Có hạn chế dài hạn."],
    decision_checks_en: ["Has hedging.", "Does not overclaim.", "Has a long-term limitation."],
    final_readiness_vi: ["Nói chắc vừa đủ.", "Không làm mờ ý.", "Giữ tính học thuật."],
    final_readiness_en: ["Measured certainty.", "Does not blur meaning.", "Keeps academic tone."],
    integration_readiness_vi: ["Phù hợp report.", "Dễ rà nhanh.", "Không mơ hồ."],
    integration_readiness_en: ["Fits a report.", "Easy to review quickly.", "Not vague."],
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
    id: "pa_c1_selector_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ selector",
    title_rom: "peshavar patar-vihar selector",
    title_vi: "Bộ chọn thư tín chuyên nghiệp",
    title_en: "Professional correspondence selector",
    selector_prompt_vi: "Chọn email follow-up lịch sự, rõ request và không giống chat.",
    selector_prompt_en: "Choose the follow-up email that is polite, clear in its request, and not chat-like.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please let me know when the next step can be expected.",
    },
    decision_checks_vi: ["Lịch sự.", "Có request rõ.", "Không trách móc."],
    decision_checks_en: ["Polite.", "Has a clear request.", "No blaming."],
    final_readiness_vi: ["Giữ tone công việc.", "Không quá thân.", "Có next step."],
    final_readiness_en: ["Keeps a work tone.", "Not too familiar.", "Has a next step."],
    integration_readiness_vi: ["Sẵn sàng gửi văn phòng.", "Dùng được ngay.", "Ngắn mà đủ."],
    integration_readiness_en: ["Ready to send to an office.", "Usable immediately.", "Short but sufficient."],
    canada_example: {
      context_vi: "Email chuyên nghiệp trong bối cảnh Canada.",
      context_en: "Professional email in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੇ ਸੁਨੇਹੇ ਵਿੱਚ ਮਿਤਭਾਸ਼ੀ ਅਤੇ ਸਪਸ਼ਟਤਾ ਦੋਵੇਂ ਜ਼ਰੂਰੀ ਹਨ।",
      rom: "Canada de daftar nu bheje sunehe vich mitbhashi ate spashtata dovein zaruri han.",
      vi: "Trong email gửi văn phòng ở Canada, cả sự tiết chế và rõ ràng đều quan trọng.",
      en: "In an email sent to an office in Canada, both restraint and clarity matter.",
    },
    learner_traps_vi: ["Đừng quá lạnh.", "Đừng quá thân mật."],
    learner_traps_en: ["Do not sound too cold.", "Do not sound too familiar."],
  },
  {
    id: "pa_c1_selector_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "selector",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ selector",
    title_rom: "karjakari sankhep selector",
    title_vi: "Bộ chọn executive summary",
    title_en: "Executive summary selector",
    selector_prompt_vi: "Chọn bản tóm tắt có issue, finding, recommendation và đủ ngắn để ra quyết định.",
    selector_prompt_en: "Choose the summary with issue, finding, recommendation, and enough brevity for a decision.",
    response_frame: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬ ਦੇ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਮੁੱਖ ਨਤੀਜਾ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ ਪਰ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ। ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ।",
      rom: "mukh mudda seva pahunch ate jawab de samen vichla farak hai. mukh natija hai ki mang vadhi hai par samarthta use dar nal nahin vadhi. sifarash hai ki uch-jokham mamlian lai vakhri katar banai jave.",
      vi: "Vấn đề chính là khoảng cách giữa tiếp cận dịch vụ và thời gian phản hồi. Kết quả chính là nhu cầu tăng nhưng năng lực không tăng cùng tốc độ. Khuyến nghị là tạo hàng riêng cho các trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The key finding is that demand has increased, but capacity has not grown at the same rate. The recommendation is to create a separate queue for high-risk cases.",
    },
    decision_checks_vi: ["Có issue.", "Có finding.", "Có recommendation."],
    decision_checks_en: ["Has issue.", "Has finding.", "Has recommendation."],
    final_readiness_vi: ["Không lan man.", "Dễ quét nhanh.", "Phù hợp người ra quyết định."],
    final_readiness_en: ["No rambling.", "Easy to skim.", "Fits a decision-maker."],
    integration_readiness_vi: ["Sẵn sàng cho memo.", "Dùng tốt cho brief.", "Không dài dòng."],
    integration_readiness_en: ["Ready for a memo.", "Works for a brief.", "Not long-winded."],
    canada_example: {
      context_vi: "Executive summary tại Canada.",
      context_en: "Executive summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਟੀਮ ਲਈ ਮੁੱਖ ਕਦਮ ਹੈ ਕਿ ਅਰਜ਼ੀਆਂ ਨੂੰ ਜੋਖਮ ਅਨੁਸਾਰ ਵੰਡਿਆ ਜਾਵੇ।",
      rom: "Canada vich seva team lai mukh kadam hai ki arzian nu jokham anusaar vandia jave.",
      vi: "Tại Canada, bước chính cho nhóm dịch vụ là phân loại hồ sơ theo rủi ro.",
      en: "In Canada, the main step for the service team is to sort applications by risk.",
    },
    learner_traps_vi: ["Đừng kể hết bối cảnh.", "Đừng bỏ recommendation."],
    learner_traps_en: ["Do not narrate all the background.", "Do not omit the recommendation."],
  },
  {
    id: "pa_c1_selector_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "final_readiness",
    title_pa: "ਰਜਿਸਟਰ calibration selector",
    title_rom: "register calibration selector",
    title_vi: "Bộ chọn điều chỉnh giọng văn",
    title_en: "Register calibration selector",
    selector_prompt_vi: "Chọn cách giữ giọng phù hợp giữa học thuật, chuyên nghiệp và công vụ.",
    selector_prompt_en: "Choose the phrasing that keeps the right balance between academic, professional, and public-service tone.",
    response_frame: {
      pa: "ਅਸੀਂ ਤੁਹਾਡੀ ਬੇਨਤੀ ਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਦਰਜ ਕਰ ਰਹੇ ਹਾਂ ਅਤੇ ਅਗਲੇ ਕਦਮ ਬਾਰੇ ਜਲਦੀ ਜਾਣਕਾਰੀ ਦੇਵਾਂਗੇ।",
      rom: "asi tuhadi benti nu spasht taur te darj kar rahe han ate agle kadam bare jaldi jankari dewangey.",
      vi: "Chúng tôi đang ghi nhận yêu cầu của bạn một cách rõ ràng và sẽ sớm cung cấp thông tin về bước tiếp theo.",
      en: "We are recording your request clearly and will provide information about the next step soon.",
    },
    decision_checks_vi: ["Giọng ổn định.", "Không quá thân mật.", "Không quá lạnh."],
    decision_checks_en: ["Tone is stable.", "Not too familiar.", "Not too cold."],
    final_readiness_vi: ["Dùng cho văn phòng.", "Có thể tái dùng trong mẫu.", "Giữ đà chuyên nghiệp."],
    final_readiness_en: ["Usable in an office.", "Reusable in a template.", "Keeps a professional flow."],
    integration_readiness_vi: ["Sẵn sàng cho nội dung công vụ.", "Giữ mức lịch sự.", "Dễ bản địa hóa."],
    integration_readiness_en: ["Ready for public-service content.", "Maintains politeness.", "Easy to localize."],
    canada_example: {
      context_vi: "Trao đổi chuyên nghiệp tại Canada.",
      context_en: "Professional exchange in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਵਿੱਚ ਸਪਸ਼ਟਤਾ ਅਤੇ ਸ਼ਿਸ਼ਟਤਾ ਦੋਵੇਂ ਇਕੱਠੇ ਰੱਖਣੇ ਚਾਹੀਦੇ ਹਨ।",
      rom: "Canada de daftar vich spashtata ate shishtata dovein ikatthe rakhne chahide han.",
      vi: "Trong văn phòng ở Canada, cần giữ đồng thời sự rõ ràng và lịch sự.",
      en: "In an office in Canada, clarity and politeness should be kept together.",
    },
    learner_traps_vi: ["Đừng quá cứng.", "Đừng quá suồng sã."],
    learner_traps_en: ["Do not sound rigid.", "Do not sound overly familiar."],
  },
  {
    id: "pa_c1_selector_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ selector",
    title_rom: "peshkari jawab selector",
    title_vi: "Bộ chọn phản hồi thuyết trình",
    title_en: "Presentation response selector",
    selector_prompt_vi: "Chọn câu trả lời sau thuyết trình vừa chắc vừa nhận diện giới hạn dữ liệu.",
    selector_prompt_en: "Choose the post-presentation answer that is confident yet recognizes data limits.",
    response_frame: {
      pa: "ਇਹ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਡਾਟਾ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਨਮੂਨਾ ਹਾਲੇ ਛੋਟਾ ਹੈ, ਪਰ ਪੈਟਰਨ ਅਗਲੇ ਅਧਿਐਨ ਲਈ ਲਾਭਦਾਇਕ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "ih sawal mahatvapuran hai kyonki ih data di sima vall dhian divaunda hai. namuna hale chhota hai, par pattern agle adhiyan lai labhdaik disha dinda hai.",
      vi: "Câu hỏi này quan trọng vì nó chỉ ra giới hạn dữ liệu. Mẫu còn nhỏ, nhưng mô hình này đưa ra hướng hữu ích cho nghiên cứu tiếp theo.",
      en: "This question is important because it points to a data limitation. The sample is still small, but the pattern gives a useful direction for the next study.",
    },
    decision_checks_vi: ["Công nhận câu hỏi.", "Có giới hạn dữ liệu.", "Không phòng thủ."],
    decision_checks_en: ["Acknowledges the question.", "States the data limit.", "Not defensive."],
    final_readiness_vi: ["Giữ tự tin vừa đủ.", "Không nói quá chắc.", "Có hướng nghiên cứu tiếp."],
    final_readiness_en: ["Keeps measured confidence.", "Does not sound too certain.", "Has a next research direction."],
    integration_readiness_vi: ["Sẵn sàng cho Q&A.", "Dùng sau slide.", "Giữ tone nhất quán."],
    integration_readiness_en: ["Ready for Q&A.", "Usable after slides.", "Keeps tone consistent."],
    canada_example: {
      context_vi: "Q&A thuyết trình tại Canada.",
      context_en: "Presentation Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਰਸ਼ਕਾਂ ਲਈ ਇਹ ਕਹਿਣਾ ਢੰਗੀ ਹੈ ਕਿ ਨਤੀਜੇ ਹਾਲੇ ਸ਼ੁਰੂਆਤੀ ਹਨ।",
      rom: "Canada de darshkan lai ih kahna dangi hai ki natije hale shuruaati han.",
      vi: "Với khán giả ở Canada, nên nói kết quả vẫn còn ở giai đoạn đầu.",
      en: "For an audience in Canada, it is appropriate to say the results are still early-stage.",
    },
    learner_traps_vi: ["Đừng trả lời như đang cãi nhau.", "Đừng phóng đại mẫu nhỏ."],
    learner_traps_en: ["Do not answer like an argument.", "Do not overstate a small sample."],
  },
];
