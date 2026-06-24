// Punjabi C1 learner proof pack for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiLearnerProofAreaC1 =
  | "formal_writing"
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "professional_correspondence"
  | "executive_summary"
  | "presentation_response";

export type PunjabiLearnerProofModeC1 = "proof_pack" | "final_owner_review" | "final_qa";

export type PunjabiLearnerProofPhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiLearnerProofCardC1 = {
  id: string;
  level: "C1";
  area: PunjabiLearnerProofAreaC1;
  mode: PunjabiLearnerProofModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  proof_goal_vi: string;
  proof_goal_en: string;
  proof_line: PunjabiLearnerProofPhraseC1;
  final_owner_review_vi: readonly string[];
  final_owner_review_en: readonly string[];
  final_qa_vi: readonly string[];
  final_qa_en: readonly string[];
  canada_example: PunjabiLearnerProofPhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const learnerProofPackScriptAwarenessC1 = {
  vi: "Bộ proof pack này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This proof pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi script, not as the main practice script.",
} as const;

export const learnerProofPackC1: PunjabiLearnerProofCardC1[] = [
  {
    id: "pa_c1_proof_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "proof_pack",
    title_pa: "ਰਸਮੀ ਲਿਖਤ proof",
    title_rom: "rasmi likhat proof",
    title_vi: "Proof viết trang trọng",
    title_en: "Formal writing proof",
    proof_goal_vi: "Chứng minh có thể viết thesis có điều kiện và đúng register.",
    proof_goal_en: "Prove you can write a qualified thesis in the right register.",
    proof_line: {
      pa: "ਉਪਲਬਧ ਸਬੂਤ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਇਹ ਨੀਤੀ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਜੇ ਇਸ ਨਾਲ ਸਪਸ਼ਟ ਜ਼ਿੰਮੇਵਾਰੀ ਵੀ ਜੋੜੀ ਜਾਵੇ।",
      rom: "uplabdh sabut darsaunde han ki ih niti labhdaik ho sakdi hai, je is nal spasht zimmevari vi jori jave.",
      vi: "Bằng chứng hiện có cho thấy chính sách này có thể hữu ích, nếu đi kèm trách nhiệm rõ ràng.",
      en: "The available evidence indicates that this policy may be useful if it is paired with clear accountability.",
    },
    final_owner_review_vi: ["Có thesis rõ.", "Có qualification.", "Giọng trang trọng."],
    final_owner_review_en: ["Clear thesis.", "Qualification is present.", "Formal tone."],
    final_qa_vi: ["Không dùng tôi nghĩ.", "Không nói tuyệt đối.", "Không mở quá chung."],
    final_qa_en: ["No I think phrasing.", "No absolute certainty.", "Not too generic."],
    canada_example: {
      context_vi: "Proof viết chính sách học thuật tại Canada.",
      context_en: "Formal writing proof for academic policy in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਭਾਸ਼ਾ ਅਤੇ ਸਲਾਹ ਨਾਲ ਜੋੜੀ ਹੋਵੇ ਤਾਂ ਇਹ ਹੋਰ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਹੋ ਸਕਦੀ ਹੈ।",
      rom: "Canada vich vidyarthi sahaita bhasha ate salah nal jori hove tan ih hor prabhavshali ho sakdi hai.",
      vi: "Tại Canada, hỗ trợ sinh viên nếu gắn với ngôn ngữ và tư vấn thì có thể hiệu quả hơn.",
      en: "In Canada, student support may be more effective if it is linked with language and advising.",
    },
    learner_traps_vi: ["Đừng biến thesis thành nhận xét chung.", "Đừng bỏ điều kiện khi evidence chưa đủ."],
    learner_traps_en: ["Do not turn the thesis into a generic comment.", "Do not omit qualification when evidence is limited."],
  },
  {
    id: "pa_c1_proof_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "final_qa",
    title_pa: "ਸਰੋਤ ਸਾਰ proof",
    title_rom: "sarot saar proof",
    title_vi: "Proof tóm tắt nguồn",
    title_en: "Source summary proof",
    proof_goal_vi: "Chứng minh bạn có thể tóm tắt claim, evidence và conclusion của nguồn.",
    proof_goal_en: "Prove you can summarize a source's claim, evidence, and conclusion.",
    proof_line: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਸੇਵਾ ਤੇ ਭਰੋਸਾ ਵਧਾ ਸਕਦੀ ਹੈ। ਲੇਖਕ ਇਸ ਨੂੰ ਉਡੀਕ ਸਮੇਂ ਅਤੇ ਵਰਤੋਂਕਾਰ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ।",
      rom: "sarot da mukh daava hai ki spasht sama-rekha seva te bharosa vadha sakdi hai. lekhak is nu udik samen ate vartonkar feedback nal samarthan dinda hai.",
      vi: "Claim chính của nguồn là timeline rõ có thể tăng niềm tin vào dịch vụ. Tác giả hỗ trợ điều này bằng thời gian chờ và phản hồi người dùng.",
      en: "The source's main claim is that clear timelines can increase trust in a service. The writer supports this with wait times and user feedback.",
    },
    final_owner_review_vi: ["Nguồn là chủ thể.", "Claim và evidence rõ.", "Không thêm opinion."],
    final_owner_review_en: ["Source remains the subject.", "Claim and evidence are clear.", "No added opinion."],
    final_qa_vi: ["Không sao chép dài.", "Không biến thành phản hồi cá nhân.", "Giữ mức độ claim."],
    final_qa_en: ["No long copying.", "Do not turn it into a personal response.", "Claim strength is preserved."],
    canada_example: {
      context_vi: "Proof nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source-summary proof about community services in Canada.",
      pa: "ਸਰੋਤ ਕਹਿੰਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਬਹੁਭਾਸ਼ੀ ਜਾਣਕਾਰੀ ਸੇਵਾ ਪਹੁੰਚ ਨੂੰ ਸੁਧਾਰ ਸਕਦੀ ਹੈ।",
      rom: "sarot kahinda hai ki Canada vich bahubhashi jankari seva pahunch nu sudhar sakdi hai.",
      vi: "Nguồn nói rằng tại Canada, thông tin đa ngôn ngữ có thể cải thiện tiếp cận dịch vụ.",
      en: "The source says that in Canada, multilingual information can improve service access.",
    },
    learner_traps_vi: ["Đừng nhét ý kiến cá nhân vào summary.", "Đừng bỏ evidence chính."],
    learner_traps_en: ["Do not insert personal opinion into the summary.", "Do not omit the main evidence."],
  },
  {
    id: "pa_c1_proof_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "proof_pack",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ proof",
    title_rom: "savdhan daava proof",
    title_vi: "Proof claim thận trọng",
    title_en: "Cautious claim proof",
    proof_goal_vi: "Chứng minh bạn có thể viết claim có hedge và limitation cho dữ liệu nhỏ.",
    proof_goal_en: "Prove you can write a hedged claim with a limitation for small data.",
    proof_line: {
      pa: "ਛੋਟਾ ਪਾਇਲਟ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਨਮੂਨੇ ਨਾਲ ਹੋਰ ਪੁਸ਼ਟੀ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "chhota pilot sujhaounda hai ki navi prakiria madadgar ho sakdi hai, par vadde namune nal hor pushti lorindi hai.",
      vi: "Pilot nhỏ gợi ý quy trình mới có thể hữu ích, nhưng cần xác nhận thêm bằng mẫu lớn hơn.",
      en: "The small pilot suggests that the new process may be helpful, but further confirmation with a larger sample is needed.",
    },
    final_owner_review_vi: ["Có hedge.", "Có limitation.", "Có next evidence."],
    final_owner_review_en: ["Has hedging.", "Has limitation.", "Has next evidence."],
    final_qa_vi: ["Không dùng luôn luôn.", "Không overclaim.", "Không hedge quá mức."],
    final_qa_en: ["No always language.", "No overclaiming.", "No excessive hedging."],
    canada_example: {
      context_vi: "Proof claim thận trọng tại Canada.",
      context_en: "Cautious-claim proof in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਹੋਰ ਡਾਟਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de pilot ton lagda hai ki online booking madad kar sakdi hai, par hor data chahida hai.",
      vi: "Từ pilot tại Canada, có vẻ đặt lịch trực tuyến có thể giúp ích, nhưng cần thêm dữ liệu.",
      en: "The Canadian pilot suggests that online booking may help, but more data is needed.",
    },
    learner_traps_vi: ["Đừng nói chắc từ mẫu nhỏ.", "Đừng làm câu mờ đến mức mất ý."],
    learner_traps_en: ["Do not claim certainty from a small sample.", "Do not make the sentence so vague that meaning disappears."],
  },
  {
    id: "pa_c1_proof_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "final_qa",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ proof",
    title_rom: "sabut tulna proof",
    title_vi: "Proof so sánh bằng chứng",
    title_en: "Evidence comparison proof",
    proof_goal_vi: "Chứng minh bạn có thể so sánh hai nguồn rồi tổng hợp.",
    proof_goal_en: "Prove you can compare two sources and then synthesize.",
    proof_line: {
      pa: "ਅੰਕੜੇ ਰੁਝਾਨ ਨੂੰ ਵਧੇਰੇ ਭਰੋਸੇਯੋਗ ਬਣਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਲੋਕਾਂ ਦੇ ਅਨੁਭਵ ਨੂੰ ਸਮਝਾਉਂਦੇ ਹਨ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਫੈਸਲੇ ਲਈ ਗਿਣਤੀ ਅਤੇ ਅਨੁਭਵ ਦੋਵੇਂ ਲੋੜੀਂਦੇ ਦਿਖਾਉਂਦੇ ਹਨ।",
      rom: "ankre rujhan nu vadhere bharoseyog banaunde han, jadki interview lokan de anubhav nu samjhaunde han. dovein mil ke faisle lai ginti ate anubhav dovein lorinde dikhaunde han.",
      vi: "Số liệu làm xu hướng đáng tin hơn, trong khi phỏng vấn giải thích trải nghiệm của người dùng. Cả hai cho thấy quyết định cần cả số lượng và trải nghiệm.",
      en: "The figures make the trend more reliable, while the interviews explain people's experience. Together, they show that decisions need both numbers and experience.",
    },
    final_owner_review_vi: ["Có tiêu chí so sánh.", "Nêu vai trò từng nguồn.", "Có synthesis."],
    final_owner_review_en: ["Comparison criterion is present.", "Each source's role is named.", "Synthesis is present."],
    final_qa_vi: ["Không chỉ thêm however.", "Không phóng đại interview.", "Không tóm tắt rời rạc."],
    final_qa_en: ["Do not merely add however.", "Do not overstate interviews.", "No disconnected summaries."],
    canada_example: {
      context_vi: "Proof so sánh nguồn tại Canada.",
      context_en: "Evidence-comparison proof in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਅੰਕੜੇ ਉਡੀਕ ਸਮਾਂ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੀ ਮਹੱਤਤਾ ਦਿਖਾਉਂਦੇ ਹਨ।",
      rom: "Canada de ankre udik sama dikhaunde han, jadki interview bhasha sahaita di mahatta dikhaunde han.",
      vi: "Số liệu tại Canada cho thấy thời gian chờ, còn phỏng vấn cho thấy tầm quan trọng của hỗ trợ ngôn ngữ.",
      en: "The Canadian figures show wait time, while interviews show the importance of language support.",
    },
    learner_traps_vi: ["Đừng so sánh mà không có tiêu chí.", "Đừng bỏ câu tổng hợp cuối."],
    learner_traps_en: ["Do not compare without a criterion.", "Do not omit the final synthesis sentence."],
  },
  {
    id: "pa_c1_proof_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "final_owner_review",
    title_pa: "ਪੇਸ਼ਾਵਰ ਸੁਨੇਹਾ proof",
    title_rom: "peshavar suneha proof",
    title_vi: "Proof thư chuyên nghiệp",
    title_en: "Professional correspondence proof",
    proof_goal_vi: "Chứng minh bạn có thể viết follow-up lịch sự, có context và request.",
    proof_goal_en: "Prove you can write a polite follow-up with context and request.",
    proof_line: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਹਫਤੇ ਭੇਜੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕਦੋਂ ਉਮੀਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
      rom: "main pichhle hafte bheje sunehe bare nimar follow-up kar riha han. kirpa karke dasso ki agla kadam kadon umid kita ja sakda hai.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn đã gửi tuần trước. Vui lòng cho biết khi nào có thể mong đợi bước tiếp theo.",
      en: "I am politely following up on the message sent last week. Please let me know when the next step can be expected.",
    },
    final_owner_review_vi: ["Có context.", "Có request.", "Giọng tôn trọng."],
    final_owner_review_en: ["Context is present.", "Request is present.", "Respectful tone."],
    final_qa_vi: ["Không trách móc.", "Không quá ngắn.", "Không giống chat."],
    final_qa_en: ["No blaming.", "Not too short.", "Not chat-like."],
    canada_example: {
      context_vi: "Follow-up với văn phòng tại Canada.",
      context_en: "Follow-up with an office in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੀ ਅਰਜ਼ੀ ਬਾਰੇ ਮੈਂ ਨਿਮਰਤਾ ਨਾਲ ਸਥਿਤੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
      rom: "Canada de daftar nu bheji arzi bare main nimarta nal sthiti puchhna chahunda han.",
      vi: "Về hồ sơ gửi văn phòng tại Canada, tôi muốn hỏi lịch sự về tình trạng.",
      en: "Regarding the application sent to the office in Canada, I would like to politely ask about the status.",
    },
    learner_traps_vi: ["Đừng viết như đang thúc ép.", "Đừng thiếu next step."],
    learner_traps_en: ["Do not sound pushy.", "Do not omit the next step."],
  },
  {
    id: "pa_c1_proof_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "proof_pack",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ proof",
    title_rom: "karjakari sankhep proof",
    title_vi: "Proof executive summary",
    title_en: "Executive summary proof",
    proof_goal_vi: "Chứng minh bạn có thể nêu issue, finding, recommendation ngắn gọn.",
    proof_goal_en: "Prove you can state issue, finding, and recommendation concisely.",
    proof_line: {
      pa: "ਮੁੱਖ ਮੁੱਦਾ ਸੇਵਾ ਪਹੁੰਚ ਅਤੇ ਜਵਾਬ ਦੇ ਸਮੇਂ ਵਿਚਲਾ ਫਰਕ ਹੈ। ਮੁੱਖ ਨਤੀਜਾ ਹੈ ਕਿ ਮੰਗ ਵਧੀ ਹੈ, ਪਰ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ। ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਈ ਜਾਵੇ।",
      rom: "mukh mudda seva pahunch ate jawab de samen vichla farak hai. mukh natija hai ki mang vadhi hai, par samarthta use dar nal nahin vadhi. sifarash hai ki uch-jokham mamlian lai vakhri katar banai jave.",
      vi: "Vấn đề chính là khoảng cách giữa khả năng tiếp cận dịch vụ và thời gian phản hồi. Kết quả chính là nhu cầu tăng nhưng năng lực không tăng cùng tốc độ. Khuyến nghị tạo hàng riêng cho các trường hợp rủi ro cao.",
      en: "The main issue is the gap between service access and response time. The key finding is that demand has increased, but capacity has not grown at the same rate. The recommendation is to create a separate queue for high-risk cases.",
    },
    final_owner_review_vi: ["Có issue.", "Có finding.", "Có recommendation."],
    final_owner_review_en: ["Issue is present.", "Finding is present.", "Recommendation is present."],
    final_qa_vi: ["Không quá nhiều background.", "Có action.", "Phù hợp người ra quyết định."],
    final_qa_en: ["No excessive background.", "Has action.", "Fits a decision-maker."],
    canada_example: {
      context_vi: "Executive summary tại Canada.",
      context_en: "Executive summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਟੀਮ ਲਈ ਮੁੱਖ ਕਦਮ ਹੈ ਕਿ ਅਰਜ਼ੀਆਂ ਨੂੰ ਜੋਖਮ ਅਨੁਸਾਰ ਵੰਡਿਆ ਜਾਵੇ।",
      rom: "Canada vich seva team lai mukh kadam hai ki arzian nu jokham anusaar vandia jave.",
      vi: "Tại Canada, bước chính cho nhóm dịch vụ là phân loại hồ sơ theo rủi ro.",
      en: "In Canada, the main step for the service team is to sort applications by risk.",
    },
    learner_traps_vi: ["Đừng kể quá nhiều background.", "Đừng thiếu recommendation."],
    learner_traps_en: ["Do not narrate too much background.", "Do not omit the recommendation."],
  },
  {
    id: "pa_c1_proof_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "final_qa",
    title_pa: "ਪ੍ਰਜ਼ੇਨਟੇਸ਼ਨ ਜਵਾਬ proof",
    title_rom: "presentation jawab proof",
    title_vi: "Proof phản hồi thuyết trình",
    title_en: "Presentation response proof",
    proof_goal_vi: "Chứng minh bạn có thể trả lời câu hỏi khó bằng acknowledgment, limitation và value.",
    proof_goal_en: "Prove you can answer a difficult question with acknowledgement, limitation, and value.",
    proof_line: {
      pa: "ਇਹ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਡਾਟਾ ਦੀ ਸੀਮਾ ਦਿਖਾਉਂਦਾ ਹੈ। ਨਮੂਨਾ ਹਾਲੇ ਛੋਟਾ ਹੈ, ਪਰ ਪੈਟਰਨ ਅਗਲੇ ਅਧਿਐਨ ਲਈ ਲਾਭਦਾਇਕ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "ih sawal mahatvapuran hai kyonki ih data di sima dikhaunda hai. namuna hale chhota hai, par pattern agle adhiyan lai labhdaik disha dinda hai.",
      vi: "Câu hỏi này quan trọng vì nó cho thấy giới hạn dữ liệu. Mẫu còn nhỏ, nhưng mô hình này đưa ra hướng hữu ích cho nghiên cứu tiếp theo.",
      en: "This question is important because it shows a data limitation. The sample is still small, but the pattern gives a useful direction for the next study.",
    },
    final_owner_review_vi: ["Công nhận câu hỏi.", "Nêu limitation.", "Giữ value của finding."],
    final_owner_review_en: ["Acknowledges the question.", "States limitation.", "Preserves the value of the finding."],
    final_qa_vi: ["Không phòng thủ.", "Không né câu hỏi.", "Có hướng tiếp theo."],
    final_qa_en: ["Not defensive.", "Does not avoid the question.", "Has next direction."],
    canada_example: {
      context_vi: "Q&A nghiên cứu tại Canada.",
      context_en: "Research Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਨਮੂਨੇ ਵਿੱਚ ਛੋਟੇ ਸ਼ਹਿਰ ਘੱਟ ਹਨ, ਇਸ ਲਈ ਨਤੀਜੇ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de namune vich chhote shahir ghatt han, is lai natije nu savdhani nal parhna chahida hai.",
      vi: "Trong mẫu tại Canada, thành phố nhỏ còn ít, vì vậy kết quả nên được đọc thận trọng.",
      en: "In the Canadian sample, smaller cities are limited, so the finding should be read cautiously.",
    },
    learner_traps_vi: ["Đừng trả lời như đang tranh cãi.", "Đừng phủ nhận limitation."],
    learner_traps_en: ["Do not answer as if arguing.", "Do not deny the limitation."],
  },
];
