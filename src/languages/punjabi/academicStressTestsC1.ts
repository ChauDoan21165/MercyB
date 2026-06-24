// Punjabi C1 academic stress tests for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiAcademicStressAreaC1 =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "presentation_response"
  | "public_service_text_handling";

export type PunjabiAcademicStressModeC1 = "stress_test" | "final_risk" | "final_qa";

export type PunjabiAcademicStressPhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiAcademicStressCardC1 = {
  id: string;
  level: "C1";
  area: PunjabiAcademicStressAreaC1;
  mode: PunjabiAcademicStressModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  stress_prompt_vi: string;
  stress_prompt_en: string;
  response_frame: PunjabiAcademicStressPhraseC1;
  risk_signals_vi: readonly string[];
  risk_signals_en: readonly string[];
  final_qa_vi: readonly string[];
  final_qa_en: readonly string[];
  canada_example: PunjabiAcademicStressPhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const academicStressTestsScriptAwarenessC1 = {
  vi: "Các stress test này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "These stress tests use Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi script, not as the main practice script.",
} as const;

export const academicStressTestsC1: PunjabiAcademicStressCardC1[] = [
  {
    id: "pa_c1_stress_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "stress_test",
    title_pa: "ਰਸਮੀ ਲਿਖਤ stress",
    title_rom: "rasmi likhat stress",
    title_vi: "Stress test viết trang trọng",
    title_en: "Formal writing stress test",
    stress_prompt_vi: "Viết một câu mở trang trọng khi dữ liệu mơ hồ và chưa đủ chắc.",
    stress_prompt_en: "Write a formal opening sentence when the data is vague and not yet conclusive.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਸਬੂਤ ਅਧੂਰੇ ਹਨ, ਪਰ ਇਹ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਨੀਤੀ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਜ਼ਿੰਮੇਵਾਰੀ ਨਾਲ ਜੋੜਨਾ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ।",
      rom: "uplabdh sabut adhoore han, par ih darsaunde han ki niti nu hor spasht zimmevari nal jorna labhdaik ho sakda hai.",
      vi: "Bằng chứng hiện có còn chưa đầy đủ, nhưng cho thấy chính sách có thể hữu ích hơn nếu gắn với trách nhiệm rõ hơn.",
      en: "The available evidence is incomplete, but it suggests that the policy may be more useful if linked to clearer accountability.",
    },
    risk_signals_vi: ["Không nhầm vague thành chắc chắn.", "Không đẩy claim ra ngoài evidence.", "Giữ register trang trọng."],
    risk_signals_en: ["Do not turn vague evidence into certainty.", "Do not push the claim beyond the evidence.", "Keep the register formal."],
    final_qa_vi: ["Có hedge.", "Không phải opinion cá nhân.", "Có hướng chính sách."],
    final_qa_en: ["Has hedging.", "Not a personal opinion.", "Has a policy direction."],
    canada_example: {
      context_vi: "Viết trang trọng về hỗ trợ sinh viên tại Canada.",
      context_en: "Formal writing about student support in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਤਦੋਂ ਮਜ਼ਬੂਤ ਹੋ ਸਕਦੀ ਹੈ ਜਦੋਂ ਭਾਸ਼ਾ ਅਤੇ ਸਲਾਹ ਦੋਵੇਂ ਇਕੱਠੇ ਦਿੱਤੇ ਜਾਣ।",
      rom: "Canada vich vidyarthi sahaita tadon mazbut ho sakdi hai jadon bhasha ate salah dovein ikatthe ditte jan.",
      vi: "Tại Canada, hỗ trợ sinh viên có thể mạnh hơn khi ngôn ngữ và tư vấn được cung cấp cùng nhau.",
      en: "In Canada, student support may be stronger when language and advising are provided together.",
    },
    learner_traps_vi: ["Đừng nói data rất rõ khi thực tế mơ hồ.", "Đừng viết như đang kể chuyện."],
    learner_traps_en: ["Do not say the data is very clear when it is vague.", "Do not write it like a story."],
  },
  {
    id: "pa_c1_stress_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "final_qa",
    title_pa: "ਸਰੋਤ ਸਾਰ stress",
    title_rom: "sarot saar stress",
    title_vi: "Stress test tóm tắt nguồn",
    title_en: "Source summary stress test",
    stress_prompt_vi: "Tóm tắt nguồn khi có chi tiết thừa và thông tin mâu thuẫn nhẹ.",
    stress_prompt_en: "Summarize a source when there are extra details and a mild contradiction.",
    response_frame: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਵਿਰੋਧੀ ਵੇਰਵਿਆਂ ਦੇ ਬਾਵਜੂਦ, ਲੇਖਕ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਫੀਡਬੈਕ ਨੂੰ ਸਬੂਤ ਵਜੋਂ ਰੱਖਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki spasht sama-rekha bharosa vadha sakdi hai. virodhi veryan de bavjood, lekhak udik samen ate feedback nu sabut vajon rakhda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin. Dù có vài chi tiết trái chiều, tác giả vẫn dùng thời gian chờ và phản hồi làm bằng chứng.",
      en: "The source's main claim is that clear timelines can increase trust. Despite a few conflicting details, the writer still uses wait times and feedback as evidence.",
    },
    risk_signals_vi: ["Không để chi tiết phụ lấn claim.", "Không xóa sạch mâu thuẫn cần biết.", "Summary vẫn trung lập."],
    risk_signals_en: ["Do not let minor details overpower the claim.", "Do not erase useful tension.", "Keep the summary neutral."],
    final_qa_vi: ["Nguồn là chủ thể.", "Claim rõ.", "Evidence được nén."],
    final_qa_en: ["Source remains the subject.", "Claim is clear.", "Evidence is compressed."],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source summary about community services in Canada.",
      pa: "ਸਰੋਤ ਕਹਿੰਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਬਹੁਭਾਸ਼ੀ ਜਾਣਕਾਰੀ ਸੇਵਾ ਪਹੁੰਚ ਨੂੰ ਸੁਧਾਰ ਸਕਦੀ ਹੈ।",
      rom: "sarot kahinda hai ki Canada vich bahubhashi jankari seva pahunch nu sudhar sakdi hai.",
      vi: "Nguồn nói rằng tại Canada, thông tin đa ngôn ngữ có thể cải thiện tiếp cận dịch vụ.",
      en: "The source says that in Canada, multilingual information can improve service access.",
    },
    learner_traps_vi: ["Đừng biến summary thành phản biện.", "Đừng bỏ evidence chính."],
    learner_traps_en: ["Do not turn the summary into a critique.", "Do not omit the main evidence."],
  },
  {
    id: "pa_c1_stress_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "stress_test",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ stress",
    title_rom: "savdhan daava stress",
    title_vi: "Stress test claim thận trọng",
    title_en: "Cautious claim stress test",
    stress_prompt_vi: "Viết claim khi có xu hướng mạnh nhưng chưa đủ dữ liệu dài hạn.",
    stress_prompt_en: "Write a claim when the trend looks strong but long-term data is missing.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "uplabdh ankre ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par lambe samen de prabhav lai hor samikhia lorindi hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng tác động dài hạn cần được rà soát thêm.",
      en: "The available figures suggest that the new process may be helpful, but its long-term effect needs further review.",
    },
    risk_signals_vi: ["Có hedge.", "Có limitation dài hạn.", "Không phóng đại xu hướng."],
    risk_signals_en: ["Has hedging.", "Has a long-term limitation.", "Does not overstate the trend."],
    final_qa_vi: ["Không dùng chắc chắn.", "Có câu về review thêm.", "Claim vẫn có lực."],
    final_qa_en: ["No certainty language.", "Includes a line about further review.", "Claim still has force."],
    canada_example: {
      context_vi: "Claim thận trọng về pilot tại Canada.",
      context_en: "Cautious claim about a pilot in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਹੋਰ ਡਾਟਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de pilot ton lagda hai ki online booking madad kar sakdi hai, par hor data chahida hai.",
      vi: "Từ pilot tại Canada, có vẻ đặt lịch trực tuyến có thể giúp ích, nhưng cần thêm dữ liệu.",
      en: "The Canadian pilot suggests that online booking may help, but more data is needed.",
    },
    learner_traps_vi: ["Đừng nói chắc từ dữ liệu ngắn.", "Đừng hedge nhiều đến mức mất ý."],
    learner_traps_en: ["Do not sound certain from short data.", "Do not hedge so much that meaning disappears."],
  },
  {
    id: "pa_c1_stress_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "final_risk",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ stress",
    title_rom: "sabut tulna stress",
    title_vi: "Stress test so sánh evidence",
    title_en: "Evidence comparison stress test",
    stress_prompt_vi: "So sánh số liệu và phỏng vấn khi chúng nói cùng một chuyện nhưng khác góc nhìn.",
    stress_prompt_en: "Compare figures and interviews when they describe the same issue from different angles.",
    response_frame: {
      pa: "ਅੰਕੜੇ ਰੁਝਾਨ ਨੂੰ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਲੋਕਾਂ ਦੇ ਅਨੁਭਵ ਨੂੰ ਸਪਸ਼ਟ ਕਰਦੇ ਹਨ। ਮਿਲਾ ਕੇ ਵੇਖਣ ਤੇ, ਦੋਵੇਂ ਫੈਸਲੇ ਲਈ ਇਕ ਦੂਜੇ ਨੂੰ ਪੂਰਾ ਕਰਦੇ ਹਨ।",
      rom: "ankre rujhan nu dikhaunde han, jadki interview lokan de anubhav nu spasht karde han. mila ke vekhan te, dovein faisle lai ik duje nu poora karde han.",
      vi: "Số liệu cho thấy xu hướng, còn phỏng vấn làm rõ trải nghiệm của người dùng. Khi ghép lại, hai loại bằng chứng bổ sung cho nhau trong quyết định.",
      en: "The figures show the trend, while the interviews clarify people's experience. Put together, the two kinds of evidence complement each other in a decision.",
    },
    risk_signals_vi: ["Không so sánh rời rạc.", "Không xem nguồn yếu như nguồn mạnh.", "Có synthesis."],
    risk_signals_en: ["Not a disconnected comparison.", "Do not treat weak sources as strong.", "Synthesis is present."],
    final_qa_vi: ["Có tiêu chí so sánh.", "Nêu vai trò từng nguồn.", "Không mất kết luận tổng hợp."],
    final_qa_en: ["Has a comparison criterion.", "Names each source's role.", "Does not lose the integrated conclusion."],
    canada_example: {
      context_vi: "So sánh evidence tại Canada.",
      context_en: "Comparing evidence in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਮਹੱਤਤਾ ਦਿਖਾਉਂਦੇ ਹਨ।",
      rom: "Canada de ankre udik sama dikhaunde han, jadki interview bhasha sahaita di mahatta dikhaunde han.",
      vi: "Số liệu tại Canada cho thấy thời gian chờ, còn phỏng vấn cho thấy tầm quan trọng của hỗ trợ ngôn ngữ.",
      en: "The Canadian figures show wait time, while interviews show the importance of language support.",
    },
    learner_traps_vi: ["Đừng chỉ nói both are important.", "Đừng quên tiêu chí so sánh."],
    learner_traps_en: ["Do not only say both are important.", "Do not forget the comparison criterion."],
  },
  {
    id: "pa_c1_stress_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "final_qa",
    title_pa: "ਪੇਸ਼ਾਵਰ ਸੁਨੇਹਾ stress",
    title_rom: "peshavar suneha stress",
    title_vi: "Stress test thư chuyên nghiệp",
    title_en: "Professional correspondence stress test",
    stress_prompt_vi: "Viết follow-up khi người nhận đã chậm phản hồi và bạn cần giữ giọng chuyên nghiệp.",
    stress_prompt_en: "Write a follow-up when the recipient has been slow to respond and you need to stay professional.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਹਫਤੇ ਭੇਜੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle hafte bheje sunehe bare nimar follow-up kar riha han. je sambhav hove, kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn đã gửi tuần trước. Nếu có thể, vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the message sent last week. If possible, please let me know when the next step can be expected.",
    },
    risk_signals_vi: ["Không trách móc.", "Không quá ngắn.", "Có request rõ."],
    risk_signals_en: ["No blaming.", "Not too short.", "Clear request is present."],
    final_qa_vi: ["Không giống chat.", "Không thúc ép.", "Có next step."],
    final_qa_en: ["Not chat-like.", "Not pushy.", "Has next step."],
    canada_example: {
      context_vi: "Follow-up với văn phòng tại Canada.",
      context_en: "Follow-up with an office in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੀ ਅਰਜ਼ੀ ਬਾਰੇ ਮੈਂ ਨਿਮਰਤਾ ਨਾਲ ਸਥਿਤੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
      rom: "Canada de daftar nu bheji arzi bare main nimarta nal sthiti puchhna chahunda han.",
      vi: "Về hồ sơ gửi văn phòng tại Canada, tôi muốn hỏi lịch sự về tình trạng.",
      en: "Regarding the application sent to the office in Canada, I would like to politely ask about the status.",
    },
    learner_traps_vi: ["Đừng viết như chat.", "Đừng thiếu context."],
    learner_traps_en: ["Do not write like a chat.", "Do not omit the context."],
  },
  {
    id: "pa_c1_stress_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "stress_test",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ stress",
    title_rom: "karjakari sankhep stress",
    title_vi: "Stress test executive summary",
    title_en: "Executive summary stress test",
    stress_prompt_vi: "Viết issue, finding, recommendation khi người đọc chỉ muốn quyết định nhanh.",
    stress_prompt_en: "Write issue, finding, and recommendation when the reader only wants a quick decision.",
    response_frame: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬ ਦੇ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਮੁੱਖ ਨਤੀਜਾ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ ਪਰ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ। ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ।",
      rom: "mukh mudda seva pahunch ate jawab de samen vichla farak hai. mukh natija hai ki mang vadhi hai par samarthta use dar nal nahin vadhi. sifarash hai ki uch-jokham mamlian lai vakhri katar banai jave.",
      vi: "Vấn đề chính là khoảng cách giữa khả năng tiếp cận dịch vụ và thời gian phản hồi. Kết quả chính là nhu cầu tăng nhưng năng lực không tăng cùng tốc độ. Khuyến nghị tạo hàng riêng cho các trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The key finding is that demand has increased, but capacity has not grown at the same rate. The recommendation is to create a separate queue for high-risk cases.",
    },
    risk_signals_vi: ["Không quá nhiều background.", "Có action.", "Phù hợp người ra quyết định."],
    risk_signals_en: ["Not too much background.", "Has action.", "Fits a decision-maker."],
    final_qa_vi: ["Không lan man.", "Không thiếu recommendation.", "Không làm dài quá mức."],
    final_qa_en: ["No rambling.", "Does not omit the recommendation.", "Not overly long."],
    canada_example: {
      context_vi: "Executive summary tại Canada.",
      context_en: "Executive summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਟੀਮ ਲਈ ਮੁੱਖ ਕਦਮ ਹੈ ਕਿ ਅਰਜ਼ੀਆਂ ਨੂੰ ਜੋਖਮ ਅਨੁਸਾਰ ਵੰਡਿਆ ਜਾਵੇ।",
      rom: "Canada vich seva team lai mukh kadam hai ki arzian nu jokham anusaar vandia jave.",
      vi: "Tại Canada, bước chính cho nhóm dịch vụ là phân loại hồ sơ theo rủi ro.",
      en: "In Canada, the main step for the service team is to sort applications by risk.",
    },
    learner_traps_vi: ["Đừng kể hết background.", "Đừng bỏ recommendation."],
    learner_traps_en: ["Do not narrate all background.", "Do not omit the recommendation."],
  },
  {
    id: "pa_c1_stress_presentation_followup",
    level: "C1",
    area: "presentation_response",
    mode: "final_risk",
    title_pa: "ਪ੍ਰਜ਼ੇਨਟੇਸ਼ਨ follow-up stress",
    title_rom: "presentation follow-up stress",
    title_vi: "Stress test follow-up thuyết trình",
    title_en: "Presentation follow-up stress test",
    stress_prompt_vi: "Trả lời câu hỏi khó sau trình bày mà vẫn giữ được sự chắc chắn vừa đủ.",
    stress_prompt_en: "Answer a hard question after a presentation while keeping measured confidence.",
    response_frame: {
      pa: "ਇਹ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਡਾਟਾ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਨਮੂਨਾ ਹਾਲੇ ਛੋਟਾ ਹੈ, ਪਰ ਪੈਟਰਨ ਅਗਲੇ ਅਧਿਐਨ ਲਈ ਲਾਭਦਾਇਕ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "ih sawal mahatvapuran hai kyonki ih data di sima vall dhian divaunda hai. namuna hale chhota hai, par pattern agle adhiyan lai labhdaik disha dinda hai.",
      vi: "Câu hỏi này quan trọng vì nó chỉ ra giới hạn dữ liệu. Mẫu còn nhỏ, nhưng mô hình này đưa ra hướng hữu ích cho nghiên cứu tiếp theo.",
      en: "This question is important because it points to a data limitation. The sample is still small, but the pattern gives a useful direction for the next study.",
    },
    risk_signals_vi: ["Công nhận câu hỏi.", "Nêu limitation.", "Giữ value của finding."],
    risk_signals_en: ["Acknowledges the question.", "States limitation.", "Preserves the value of the finding."],
    final_qa_vi: ["Không phòng thủ.", "Không phủ nhận limitation.", "Có hướng tiếp theo."],
    final_qa_en: ["Not defensive.", "Does not deny limitation.", "Has next direction."],
    canada_example: {
      context_vi: "Q&A nghiên cứu tại Canada.",
      context_en: "Research Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਨਮੂਨੇ ਵਿੱਚ ਛੋਟੇ ਸ਼ਹਿਰ ਘੱਟ ਹਨ, ਇਸ ਲਈ ਨਤੀਜੇ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de namune vich chhote shahir ghatt han, is lai natije nu savdhani nal parhna chahida hai.",
      vi: "Trong mẫu tại Canada, thành phố nhỏ còn ít, vì vậy kết quả nên được đọc thận trọng.",
      en: "In the Canadian sample, smaller cities are limited, so the finding should be read cautiously.",
    },
    learner_traps_vi: ["Đừng trả lời như đang tranh cãi.", "Đừng nói dữ liệu hoàn hảo."],
    learner_traps_en: ["Do not answer as if arguing.", "Do not claim the data is perfect."],
  },
  {
    id: "pa_c1_stress_public_professional_text",
    level: "C1",
    area: "public_service_text_handling",
    mode: "final_qa",
    title_pa: "ਜਨਤਕ ਲਿਖਤ stress",
    title_rom: "jantak likhat stress",
    title_vi: "Stress test văn bản công/chuyên nghiệp",
    title_en: "Public/professional text stress test",
    stress_prompt_vi: "Viết thông báo ngắn khi một thay đổi ảnh hưởng đến nhiều người và cần rõ bước tiếp theo.",
    stress_prompt_en: "Write a short notice when a change affects many people and the next step must be clear.",
    response_frame: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਲਾਗੂ ਹੋਵੇਗੀ। ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ ਦੀ ਮੀਟਿੰਗ ਪਹਿਲਾਂ ਹੀ ਬੁਕ ਹੈ, ਉਨ੍ਹਾਂ ਨੂੰ ਨਵਾਂ ਸਮਾਂ ਈਮੇਲ ਰਾਹੀਂ ਮਿਲੇਗਾ। ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਲਈ ਸੇਵਾ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "seva samen vich tabdili agle somvar ton lagu hovegi. jinhan lokan di meeting pahilan hi book hai, unha nu nava sama email rahin milega. bhasha sahaita lai seva kendar nal sampark kita ja sakda hai.",
      vi: "Thay đổi giờ dịch vụ sẽ có hiệu lực từ thứ Hai tới. Những người đã đặt lịch sẽ nhận giờ mới qua email. Có thể liên hệ trung tâm dịch vụ để được hỗ trợ ngôn ngữ.",
      en: "The service-hour change will take effect next Monday. People with existing appointments will receive a new time by email. The service centre can be contacted for language support.",
    },
    risk_signals_vi: ["Người bị ảnh hưởng rõ.", "Bước tiếp theo rõ.", "Có access support."],
    risk_signals_en: ["Affected people are clear.", "Next step is clear.", "Access support is present."],
    final_qa_vi: ["Không dùng jargon nội bộ.", "Không quên hỗ trợ tiếp cận.", "Giọng công bằng."],
    final_qa_en: ["No internal jargon.", "Do not forget access support.", "Fair tone."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công tại Canada.",
      context_en: "Public-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੀਂ ਸੇਵਾ ਜਾਣਕਾਰੀ ਲਈ ਵੈੱਬਸਾਈਟ ਅਤੇ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੋਵੇਂ ਸਪਸ਼ਟ ਦਿੱਤੇ ਜਾਣ।",
      rom: "Canada vich navi seva jankari lai website ate bhasha sahaita dovein spasht ditte jan.",
      vi: "Tại Canada, đối với thông tin dịch vụ mới, website và hỗ trợ ngôn ngữ đều nên được nêu rõ.",
      en: "In Canada, for new service information, both the website and language support should be stated clearly.",
    },
    learner_traps_vi: ["Đừng viết như memo nội bộ.", "Đừng quên người đọc cần làm gì tiếp theo."],
    learner_traps_en: ["Do not write it like an internal memo.", "Do not forget what the reader should do next."],
  },
];
