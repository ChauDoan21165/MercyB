// Punjabi C1 final handoff set for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1FinalHandoffArea =
  | "academic_frames"
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "professional_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response";

export type PunjabiC1FinalHandoffMode = "handoff" | "pre_integration" | "final_readiness";

export type PunjabiC1FinalHandoffPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1FinalHandoffCard = {
  id: string;
  level: "C1";
  area: PunjabiC1FinalHandoffArea;
  mode: PunjabiC1FinalHandoffMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  handoff_prompt_vi: string;
  handoff_prompt_en: string;
  response_frame: PunjabiC1FinalHandoffPhrase;
  handoff_checks_vi: readonly string[];
  handoff_checks_en: readonly string[];
  pre_integration_vi: readonly string[];
  pre_integration_en: readonly string[];
  final_readiness_vi: readonly string[];
  final_readiness_en: readonly string[];
  canada_example: PunjabiC1FinalHandoffPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1FinalHandoffSetScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1FinalHandoffSet: PunjabiC1FinalHandoffCard[] = [
  {
    id: "pa_c1_handoff_academic_frames",
    level: "C1",
    area: "academic_frames",
    mode: "handoff",
    title_pa: "ਅਕਾਦਮਿਕ frame handoff",
    title_rom: "academic frame handoff",
    title_vi: "Bàn giao khung học thuật",
    title_en: "Academic frame handoff",
    handoff_prompt_vi: "Kiểm tra xem khung học thuật có bàn giao đúng claim, evidence và logic cho bài học tiếp theo không.",
    handoff_prompt_en: "Check whether the academic frame hands off claim, evidence, and logic cleanly to the next lesson.",
    response_frame: {
      pa: "ਲੇਖ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਬਣਤਰ ਪਾਠਕ ਦੀ ਸਮਝ ਵਧਾਉਂਦੀ ਹੈ, ਅਤੇ ਲੇਖਕ ਇਸ ਗੱਲ ਨੂੰ ਉਦਾਹਰਨਾਂ ਨਾਲ ਸਹਾਰਦਾ ਹੈ।",
      rom: "lekh da mukh daava ih hai ki spasht bantrar pathak di samajh vadhaudi hai, ate lekhak is gal nu udaharanan nal saharda hai.",
      vi: "Claim chính của bài là cấu trúc rõ giúp người đọc hiểu tốt hơn, và tác giả hỗ trợ điều này bằng ví dụ.",
      en: "The article's main claim is that clear structure improves reader comprehension, and the writer supports this with examples.",
    },
    handoff_checks_vi: ["Claim còn rõ.", "Evidence không bị lấn.", "Logic học thuật ổn."],
    handoff_checks_en: ["The claim stays clear.", "Evidence is not crowded out.", "Academic logic holds."],
    pre_integration_vi: ["Dùng lại được trong lesson plan.", "Không thêm bình luận.", "Giữ giọng học thuật."],
    pre_integration_en: ["Reusable in a lesson plan.", "Adds no commentary.", "Keeps an academic tone."],
    final_readiness_vi: ["Sẵn sàng cho capstone.", "Không đổi register.", "Có thể chuyển tiếp ngay."],
    final_readiness_en: ["Ready for the capstone.", "No register shift.", "Can transfer immediately."],
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
    id: "pa_c1_handoff_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਲਿਖਤ handoff",
    title_rom: "rasmi likhat handoff",
    title_vi: "Bàn giao văn phong trang trọng",
    title_en: "Formal writing handoff",
    handoff_prompt_vi: "Chọn cách mở văn bản trang trọng nhưng không nặng tay để chuyển sang bản nháp cuối.",
    handoff_prompt_en: "Choose a formal opening that is polished without sounding heavy as it moves toward the final draft.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਇਹ ਦਰਸਾਉਂਦੀ ਹੈ ਕਿ ਅਸੀਂ ਨਤੀਜੇ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹੀਏ ਅਤੇ ਹੋਰ ਸਬੂਤ ਦੀ ਉਡੀਕ ਕਰੀਏ।",
      rom: "uplabdh jankari ih darsaundi hai ki asi natije nu savdhani nal parhiye ate hor sabut di udik kariye.",
      vi: "Thông tin hiện có cho thấy nên đọc kết quả thận trọng và chờ thêm bằng chứng.",
      en: "The information available suggests that we should read the result cautiously and wait for more evidence.",
    },
    handoff_checks_vi: ["Giọng trang trọng.", "Có hedge.", "Không quá cứng."],
    handoff_checks_en: ["Formal tone.", "Has hedging.", "Not too rigid."],
    pre_integration_vi: ["Phù hợp cho report.", "Dễ chèn vào template.", "Không quá dài."],
    pre_integration_en: ["Fits a report.", "Easy to insert into a template.", "Not too long."],
    final_readiness_vi: ["Sẵn sàng làm bản cuối.", "Giữ lập trường vừa phải.", "Không giống chat."],
    final_readiness_en: ["Ready for the final draft.", "Keeps a measured stance.", "Does not sound chat-like."],
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
    id: "pa_c1_handoff_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "handoff",
    title_pa: "ਸਰੋਤ ਸਾਰ handoff",
    title_rom: "sarot saar handoff",
    title_vi: "Bàn giao tóm tắt nguồn",
    title_en: "Source summary handoff",
    handoff_prompt_vi: "Kiểm tra summary giữ claim chính và evidence mà không trượt sang nhận xét.",
    handoff_prompt_en: "Check that the summary keeps the main claim and evidence without sliding into commentary.",
    response_frame: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਫੀਡਬੈਕ ਨਾਲ ਇਹ ਗੱਲ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai. lekhak udik samen ate feedback nal ih gal samarthan karda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin. Tác giả hỗ trợ điều này bằng thời gian chờ và phản hồi.",
      en: "The source's main claim is that clear timelines can increase trust. The writer supports this with wait times and feedback.",
    },
    handoff_checks_vi: ["Nguồn vẫn là chủ thể.", "Claim và evidence đi cùng nhau.", "Không có ý kiến chen vào."],
    handoff_checks_en: ["The source remains the subject.", "Claim and evidence stay together.", "No inserted opinion."],
    pre_integration_vi: ["Đủ ngắn để chèn bài học.", "Không lạc sang critique.", "Giữ neutrality."],
    pre_integration_en: ["Short enough for a lesson.", "Does not drift into critique.", "Keeps neutrality."],
    final_readiness_vi: ["Đủ rõ để tái dùng.", "Không che mất cấu trúc.", "Có thể dạy ngay."],
    final_readiness_en: ["Clear enough to reuse.", "Does not hide structure.", "Can be taught immediately."],
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
    id: "pa_c1_handoff_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "final_readiness",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ handoff",
    title_rom: "savdhan daava handoff",
    title_vi: "Bàn giao claim thận trọng",
    title_en: "Cautious claim handoff",
    handoff_prompt_vi: "Chọn câu claim có lực nhưng vẫn giữ giới hạn dữ liệu rõ ràng trước khi bàn giao.",
    handoff_prompt_en: "Choose the claim that has force while keeping the data limits explicit before handoff.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "uplabdh ankde ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par lambe samen de prabhav lai hor samikhia lorindi hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng tác động dài hạn vẫn cần được xem xét thêm.",
      en: "The available figures suggest that the new process may be helpful, but the long-term effect still needs further review.",
    },
    handoff_checks_vi: ["Có hedge.", "Không overclaim.", "Có hạn chế dài hạn."],
    handoff_checks_en: ["Has hedging.", "Does not overclaim.", "Has a long-term limitation."],
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
    id: "pa_c1_handoff_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "pre_integration",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰਚਾਰ handoff",
    title_rom: "peshavar patar-vihar handoff",
    title_vi: "Bàn giao thư tín chuyên nghiệp",
    title_en: "Professional correspondence handoff",
    handoff_prompt_vi: "Chọn email follow-up lịch sự, rõ request và không giống chat để chuyển sang người nhận thật.",
    handoff_prompt_en: "Choose the follow-up email that is polite, clear in its request, and not chat-like as it moves to a real recipient.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the previous message. If possible, please let me know when the next step can be expected.",
    },
    handoff_checks_vi: ["Lịch sự.", "Có request rõ.", "Không trách móc."],
    handoff_checks_en: ["Polite.", "Has a clear request.", "No blaming."],
    pre_integration_vi: ["Giữ tone công việc.", "Không quá thân.", "Có next step."],
    pre_integration_en: ["Keeps a work tone.", "Not too familiar.", "Has a next step."],
    final_readiness_vi: ["Sẵn sàng gửi văn phòng.", "Dùng được ngay.", "Ngắn mà đủ."],
    final_readiness_en: ["Ready to send to an office.", "Usable immediately.", "Short but sufficient."],
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
    id: "pa_c1_handoff_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "handoff",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ handoff",
    title_rom: "karjakari sankhep handoff",
    title_vi: "Bàn giao bản tóm tắt điều hành",
    title_en: "Executive summary handoff",
    handoff_prompt_vi: "Chọn executive summary giữ ưu tiên, rủi ro và next step trong một đoạn ngắn rõ ràng.",
    handoff_prompt_en: "Choose the executive summary that keeps priorities, risks, and next steps in one short, clear paragraph.",
    response_frame: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਇਹ ਹੈ ਕਿ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਬਣੀ ਰਹੇ, ਖਰਚਾ ਕਾਬੂ ਵਿੱਚ ਰਹੇ, ਅਤੇ ਟੀਮ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਰੱਖੇ।",
      rom: "mukh tarji ih hai ki seva di gunvatta bani rahe, kharcha kabu vich rahe, ate team agla kadam spasht rakhe.",
      vi: "Ưu tiên chính là giữ chất lượng dịch vụ, kiểm soát chi phí, và để đội ngũ có bước tiếp theo rõ ràng.",
      en: "The main priorities are to maintain service quality, keep costs under control, and make the next step clear for the team.",
    },
    handoff_checks_vi: ["Ưu tiên rõ.", "Rủi ro không mất.", "Có next step."],
    handoff_checks_en: ["Priorities are clear.", "Risks are not lost.", "Has a next step."],
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
    id: "pa_c1_handoff_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "final_readiness",
    title_pa: "ਰਜਿਸਟਰ calibration handoff",
    title_rom: "register calibration handoff",
    title_vi: "Bàn giao hiệu chỉnh register",
    title_en: "Register calibration handoff",
    handoff_prompt_vi: "Chọn câu cân bằng giữa học thuật, công việc và giao tiếp trực tiếp mà vẫn giữ register ổn định.",
    handoff_prompt_en: "Choose the sentence that balances academic, workplace, and direct communication while keeping register stable.",
    response_frame: {
      pa: "ਇਹ ਨਤੀਜਾ ਹੁਣੇ ਅੰਤਿਮ ਨਹੀਂ ਕਿਹਾ ਜਾ ਸਕਦਾ, ਪਰ ਇਹ ਇਸ਼ਾਰਾ ਕਰਦਾ ਹੈ ਕਿ ਅਸੀਂ ਅਗਲਾ ਪੜਾਅ ਧਿਆਨ ਨਾਲ ਤੈਅ ਕਰੀਏ।",
      rom: "ih natija hune antim nahin keha ja sakda, par ih ishara karda hai ki asi agla parhav dhyan nal tay kariye.",
      vi: "Kết quả này chưa thể gọi là cuối cùng, nhưng nó cho thấy nên xác định bước tiếp theo cẩn thận.",
      en: "This result cannot yet be called final, but it suggests that we should set the next stage carefully.",
    },
    handoff_checks_vi: ["Không quá công thức.", "Không quá thân.", "Giọng giữ ổn."],
    handoff_checks_en: ["Not overly formulaic.", "Not too familiar.", "Voice stays stable."],
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
    id: "pa_c1_handoff_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "final_readiness",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ handoff",
    title_rom: "peshkari jawab handoff",
    title_vi: "Bàn giao câu trả lời khi thuyết trình",
    title_en: "Presentation response handoff",
    handoff_prompt_vi: "Chọn response ngắn gọn cho phần hỏi-đáp thuyết trình nhưng vẫn có chiều sâu.",
    handoff_prompt_en: "Choose a concise response for the presentation Q&A that still has depth.",
    response_frame: {
      pa: "ਮੈਂ ਇਸ ਨੁਕਤੇ ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਦੇਖਾਂਗਾ: ਪਹਿਲਾਂ ਮੌਜੂਦਾ ਡਾਟਾ ਕੀ ਦੱਸਦਾ ਹੈ, ਤੇ ਫਿਰ ਅਗਲੇ ਕਦਮ ਲਈ ਕੀ ਧਿਆਨ ਵਿੱਚ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "main is nukte nu do hissan vich dekhanga: pahlan maujuda data ki dassda hai, te phir agle kadam lai ki dhyan vich rakhna chahida hai.",
      vi: "Tôi sẽ nhìn điểm này theo hai phần: trước hết dữ liệu hiện có nói gì, rồi đến điều cần lưu ý cho bước tiếp theo.",
      en: "I would look at this in two parts: first what the current data shows, and then what should be kept in mind for the next step.",
    },
    handoff_checks_vi: ["Có cấu trúc rõ.", "Không lạc đề.", "Có chiều sâu vừa đủ."],
    handoff_checks_en: ["Has clear structure.", "Does not drift off topic.", "Has enough depth."],
    pre_integration_vi: ["Nghe tự nhiên khi nói.", "Không quá dài.", "Bắt được câu hỏi."],
    pre_integration_en: ["Sounds natural when spoken.", "Not too long.", "Addresses the question."],
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
