// Punjabi C1 final review deck for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiC1ReviewArea =
  | "source_summary"
  | "cautious_claim"
  | "compare_evidence"
  | "formal_writing"
  | "academic_register"
  | "presentation_response"
  | "public_text_handling"
  | "professional_text_handling";

export type PunjabiC1ReviewMode = "quick_check" | "qa_prompt" | "final_checkpoint";

export type PunjabiReviewPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiFinalReviewCardC1 = {
  id: string;
  level: "C1";
  area: PunjabiC1ReviewArea;
  mode: PunjabiC1ReviewMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  review_question: PunjabiReviewPhrase;
  model_answer: PunjabiReviewPhrase;
  checkpoint_vi: string;
  checkpoint_en: string;
  success_markers_vi: readonly string[];
  success_markers_en: readonly string[];
  quick_fix_language: readonly PunjabiReviewPhrase[];
  canada_example: PunjabiReviewPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const finalReviewDeckScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const finalReviewDeckC1: PunjabiFinalReviewCardC1[] = [
  {
    id: "pa_c1_review_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "quick_check",
    title_pa: "ਸਰੋਤ ਦਾ ਨਿਰਪੱਖ ਸਾਰ",
    title_rom: "sarot da nirpakh saar",
    title_vi: "Ôn summary nguồn trung lập",
    title_en: "Review neutral source summary",
    review_question: {
      pa: "ਸਰੋਤ ਦਾ claim, evidence ਅਤੇ conclusion ਤਿੰਨ ਵਾਕਾਂ ਵਿੱਚ ਕਿਵੇਂ ਦੱਸੋਗੇ?",
      rom: "sarot da claim, evidence ate conclusion tinn vakan vich kiven dassoge?",
      vi: "Bạn sẽ nêu claim, evidence và conclusion của nguồn trong ba câu như thế nào?",
      en: "How will you state the source claim, evidence, and conclusion in three sentences?",
    },
    model_answer: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ... ਲੇਖਕ ਇਸ ਨੂੰ ... ਨਾਲ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ। ਸੰਖੇਪ ਵਿੱਚ, ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ...",
      rom: "sarot da mukh daava ih hai ki ... lekhak is nu ... nal samarthan dinda hai. sankhep vich, sarot sujhaounda hai ki ...",
      vi: "Claim chính của nguồn là... Tác giả hỗ trợ điều này bằng... Tóm lại, nguồn gợi ý rằng...",
      en: "The source's main claim is that... The writer supports this with... In summary, the source suggests that...",
    },
    checkpoint_vi: "Summary phải trung lập, nén thông tin, và không thêm opinion.",
    checkpoint_en: "The summary must be neutral, compressed, and without added opinion.",
    success_markers_vi: [
      "Claim chính đứng trước chi tiết.",
      "Evidence không bị chép dài.",
      "Từ thận trọng của nguồn được giữ lại.",
    ],
    success_markers_en: [
      "Main claim comes before details.",
      "Evidence is not copied at length.",
      "The source's cautious wording is preserved.",
    ],
    quick_fix_language: [
      {
        pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "sarot da mukh daava ih hai ki ...",
        vi: "Claim chính của nguồn là...",
        en: "The source's main claim is that...",
      },
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ, ...",
        rom: "sankhep vich, ...",
        vi: "Tóm lại,...",
        en: "In summary,...",
      },
    ],
    canada_example: {
      context_vi: "Summary nguồn về dịch vụ sinh viên tại Canada.",
      context_en: "Summarizing a source about student services in Canada.",
      pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ ਅਕਾਦਮਿਕ ਯੋਜਨਾ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।",
      rom: "sarot sujhaounda hai ki Canada vich vidyarthi sahaita kendar academic yojna vich madad kar sakde han.",
      vi: "Nguồn gợi ý rằng tại Canada, trung tâm hỗ trợ sinh viên có thể giúp lập kế hoạch học thuật.",
      en: "The source suggests that in Canada, student support centres may help with academic planning.",
    },
    learner_traps_vi: [
      "Đừng thêm 'tôi nghĩ'.",
      "Đừng dịch từng câu nếu mất cấu trúc claim-evidence.",
    ],
    learner_traps_en: [
      "Do not add 'I think'.",
      "Do not translate sentence by sentence if claim-evidence structure is lost.",
    ],
  },
  {
    id: "pa_c1_review_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "qa_prompt",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ",
    title_rom: "savdhan daava",
    title_vi: "Ôn claim thận trọng",
    title_en: "Review cautious claims",
    review_question: {
      pa: "ਜੇ ਸਬੂਤ ਸੀਮਿਤ ਹੋਵੇ ਤਾਂ ਦਾਅਵੇ ਨੂੰ ਕਿਵੇਂ ਨਰਮ ਕਰੋਗੇ?",
      rom: "je sabut simit hove tan daave nu kiven naram karoge?",
      vi: "Nếu bằng chứng hạn chế, bạn sẽ làm claim thận trọng hơn như thế nào?",
      en: "If evidence is limited, how will you make the claim more cautious?",
    },
    model_answer: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ... ਕੁਝ ਸਥਿਤੀਆਂ ਵਿੱਚ ਲਾਭਕਾਰੀ ਹੋ ਸਕਦਾ ਹੈ।",
      rom: "uplabdh jankari de adhar te, ... kujh sthitian vich labhkari ho sakda hai.",
      vi: "Dựa trên thông tin hiện có, ... có thể hữu ích trong một số tình huống.",
      en: "Based on the available information, ... may be useful in some situations.",
    },
    checkpoint_vi: "Claim vẫn có stance nhưng không vượt quá evidence.",
    checkpoint_en: "The claim keeps a stance but does not exceed the evidence.",
    success_markers_vi: [
      "Có hedge hợp lý.",
      "Nêu phạm vi hoặc điều kiện.",
      "Không dùng 'always/never' khi dữ liệu yếu.",
    ],
    success_markers_en: [
      "Uses appropriate hedging.",
      "States scope or condition.",
      "Avoids always/never when data is weak.",
    ],
    quick_fix_language: [
      {
        pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ...",
        rom: "uplabdh jankari de adhar te, ...",
        vi: "Dựa trên thông tin hiện có,...",
        en: "Based on the available information,...",
      },
      {
        pa: "ਇਹ ਪੱਕਾ ਸਬੂਤ ਨਹੀਂ, ਸਗੋਂ ਇੱਕ ਸੰਕੇਤ ਹੈ।",
        rom: "ih pakka sabut nahi, sagon ikk sanket hai.",
        vi: "Đây không phải bằng chứng chắc chắn, mà là một dấu hiệu.",
        en: "This is not conclusive proof, but an indication.",
      },
    ],
    canada_example: {
      context_vi: "Claim thận trọng về dịch vụ trực tuyến tại Canada.",
      context_en: "Cautious claim about online services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਆਨਲਾਈਨ ਸੇਵਾਵਾਂ ਕੁਝ ਵਸਨੀਕਾਂ ਲਈ ਪਹੁੰਚ ਸੁਧਾਰ ਸਕਦੀਆਂ ਹਨ।",
      rom: "Canada vich online sevavan kujh vasnikan lai pahunch sudhar sakdian han.",
      vi: "Tại Canada, dịch vụ trực tuyến có thể cải thiện khả năng tiếp cận cho một số cư dân.",
      en: "In Canada, online services may improve access for some residents.",
    },
    learner_traps_vi: [
      "Đừng biến hedge thành câu không có lập trường.",
      "Đừng gọi xu hướng nhỏ là quy luật chung.",
    ],
    learner_traps_en: [
      "Do not hedge until the sentence has no stance.",
      "Do not call a small trend a general rule.",
    ],
  },
  {
    id: "pa_c1_review_compare_evidence",
    level: "C1",
    area: "compare_evidence",
    mode: "final_checkpoint",
    title_pa: "ਸਬੂਤਾਂ ਦੀ ਤੁਲਨਾ",
    title_rom: "sabutan di tulna",
    title_vi: "Ôn so sánh bằng chứng",
    title_en: "Review comparing evidence",
    review_question: {
      pa: "ਸਰਵੇਖਣ ਅਤੇ ਰਿਪੋਰਟ ਨੂੰ ਕਿਹੜੇ ਮਾਪਦੰਡਾਂ ਨਾਲ ਤੁਲਨਾ ਕਰੋਗੇ?",
      rom: "sarvekhan ate report nu kihre mapdandan nal tulna karoge?",
      vi: "Bạn sẽ so sánh khảo sát và báo cáo theo tiêu chí nào?",
      en: "What criteria will you use to compare a survey and a report?",
    },
    model_answer: {
      pa: "ਸਰਵੇਖਣ ਅਨੁਭਵ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਰਿਪੋਰਟ ਵਰਤੋਂ ਦੇ ਅੰਕੜੇ ਦਿੰਦੀ ਹੈ। ਦੋਵੇਂ ਵੱਖਰੇ ਦਾਅਵਿਆਂ ਲਈ ਲਾਭਦਾਇਕ ਹਨ।",
      rom: "sarvekhan anubhav dikhaounda hai, jadki report varton de ankde dindi hai. dovein vakhre daavian lai labhdayak han.",
      vi: "Khảo sát cho thấy trải nghiệm, trong khi báo cáo cung cấp số liệu sử dụng. Cả hai hữu ích cho các claim khác nhau.",
      en: "A survey shows experience, whereas a report gives usage data. Both are useful for different claims.",
    },
    checkpoint_vi: "So sánh evidence theo relevance, reliability, scope; không chỉ so sánh topic.",
    checkpoint_en: "Compare evidence by relevance, reliability, and scope, not only topic.",
    success_markers_vi: [
      "Tiêu chí so sánh rõ.",
      "Có strength và limitation.",
      "Kết luận phù hợp với claim.",
    ],
    success_markers_en: [
      "Clear comparison criterion.",
      "Includes strength and limitation.",
      "Conclusion fits the claim.",
    ],
    quick_fix_language: [
      {
        pa: "ਪਹਿਲਾ ਸਰੋਤ ... ਲਈ ਵਧੇਰੇ ਲਾਭਕਾਰੀ ਹੈ।",
        rom: "pahila sarot ... lai vadhere labhkari hai.",
        vi: "Nguồn thứ nhất hữu ích hơn cho...",
        en: "The first source is more useful for...",
      },
      {
        pa: "ਫਿਰ ਵੀ, ਦੋਵੇਂ ਸਰੋਤਾਂ ਦੀਆਂ ਸੀਮਾਵਾਂ ਹਨ।",
        rom: "fir vi, dovein sarotan dian simavan han.",
        vi: "Tuy vậy, cả hai nguồn đều có giới hạn.",
        en: "Even so, both sources have limitations.",
      },
    ],
    canada_example: {
      context_vi: "So sánh evidence về hỗ trợ sinh viên tại Canada.",
      context_en: "Comparing evidence about student support in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਰਵੇਖਣ ਅਨੁਭਵ ਦਿਖਾਉਂਦਾ ਹੈ, ਪਰ ਪ੍ਰਸ਼ਾਸਕੀ ਰਿਪੋਰਟ ਵਰਤੋਂ ਦੇ ਅੰਕੜੇ ਦਿੰਦੀ ਹੈ।",
      rom: "Canada vich vidyarthi sarvekhan anubhav dikhaounda hai, par prashaski report varton de ankde dindi hai.",
      vi: "Ở Canada, khảo sát sinh viên cho thấy trải nghiệm, còn báo cáo hành chính cung cấp số liệu sử dụng.",
      en: "In Canada, a student survey shows experience, while an administrative report gives usage data.",
    },
    learner_traps_vi: [
      "Đừng so sánh chỉ bằng độ dài nguồn.",
      "Đừng bỏ qua limitation của nguồn bạn thích hơn.",
    ],
    learner_traps_en: [
      "Do not compare only by source length.",
      "Do not ignore the limitation of the source you prefer.",
    ],
  },
  {
    id: "pa_c1_review_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "quick_check",
    title_pa: "ਰਸਮੀ ਲਿਖਤ",
    title_rom: "rasmi likhat",
    title_vi: "Ôn viết trang trọng",
    title_en: "Review formal writing",
    review_question: {
      pa: "ਰਸਮੀ ਈਮੇਲ ਵਿੱਚ problem, impact ਅਤੇ request ਕਿਵੇਂ ਜੋੜੋਗੇ?",
      rom: "rasmi email vich problem, impact ate request kiven joroge?",
      vi: "Trong email trang trọng, bạn sẽ nối problem, impact và request như thế nào?",
      en: "In a formal email, how will you connect problem, impact, and request?",
    },
    model_answer: {
      pa: "ਮੈਂ ... ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਇਸ ਦਾ ਪ੍ਰਭਾਵ ... ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਮਾਮਲੇ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।",
      rom: "main ... bare apni chinta darj karvauna chahunda/chahundi han. is da prabhav ... hai. kirpa karke is mamle di samikhia karo.",
      vi: "Tôi muốn ghi nhận quan ngại về... Tác động của việc này là... Xin vui lòng xem xét vấn đề này.",
      en: "I would like to register my concern about... The impact of this is... Please review this matter.",
    },
    checkpoint_vi: "Email cần purpose rõ, evidence/timeline, impact, và requested action.",
    checkpoint_en: "The email needs clear purpose, evidence/timeline, impact, and requested action.",
    success_markers_vi: [
      "Tone lịch sự nhưng chắc chắn.",
      "Request cụ thể.",
      "Không quá thân mật.",
    ],
    success_markers_en: [
      "Polite but firm tone.",
      "Specific request.",
      "Not too casual.",
    ],
    quick_fix_language: [
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ...",
        rom: "kirpa karke ...",
        vi: "Xin vui lòng...",
        en: "Please...",
      },
      {
        pa: "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ।",
        rom: "tuhade same lai dhanvad.",
        vi: "Cảm ơn thời gian của quý vị.",
        en: "Thank you for your time.",
      },
    ],
    canada_example: {
      context_vi: "Email cho văn phòng tại Canada.",
      context_en: "Email to an office in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਮੇਰੀ ਅਰਜ਼ੀ ਤਿੰਨ ਹਫ਼ਤਿਆਂ ਤੋਂ ਲੰਬਿਤ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਸਥਿਤੀ ਬਾਰੇ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਬੇਨਤੀ ਕਰਦੀ ਹਾਂ।",
      rom: "Canada vich meri arzi tinn haftian ton lambit hai, is lai main sthiti bare spashtikaran di benati kardi han.",
      vi: "Tại Canada, hồ sơ của tôi đã chờ ba tuần, vì vậy tôi xin được làm rõ tình trạng.",
      en: "In Canada, my application has been pending for three weeks, so I request clarification about the status.",
    },
    learner_traps_vi: [
      "Đừng chỉ phàn nàn mà không yêu cầu hành động.",
      "Đừng dùng giọng ra lệnh.",
    ],
    learner_traps_en: [
      "Do not only complain without requesting action.",
      "Do not use a commanding tone.",
    ],
  },
  {
    id: "pa_c1_review_academic_register",
    level: "C1",
    area: "academic_register",
    mode: "final_checkpoint",
    title_pa: "ਅਕਾਦਮਿਕ ਲਹਿਜ਼ਾ",
    title_rom: "academic lehja",
    title_vi: "Ôn register học thuật",
    title_en: "Review academic register",
    review_question: {
      pa: "ਦੋ ਸਰੋਤਾਂ ਨੂੰ academic register ਵਿੱਚ ਕਿਵੇਂ ਜੋੜੋਗੇ?",
      rom: "do sarotan nu academic register vich kiven joroge?",
      vi: "Bạn sẽ nối hai nguồn bằng register học thuật như thế nào?",
      en: "How will you connect two sources in academic register?",
    },
    model_answer: {
      pa: "ਦੋਵੇਂ ਸਰੋਤ ... ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ਪਹਿਲਾ ... ਤੇ ਜ਼ੋਰ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ... ਨੂੰ ਕੇਂਦਰੀ ਮੰਨਦਾ ਹੈ।",
      rom: "dovein sarot ... bare chintat han, par pahila ... te zor dinda hai, jadki duja ... nu kendari mannda hai.",
      vi: "Cả hai nguồn đều quan tâm đến..., nhưng nguồn thứ nhất nhấn mạnh..., trong khi nguồn thứ hai xem... là trung tâm.",
      en: "Both sources are concerned with..., but the first emphasizes..., whereas the second treats... as central.",
    },
    checkpoint_vi: "Register học thuật cần tone trung lập, transition logic, và synthesis.",
    checkpoint_en: "Academic register needs neutral tone, logical transition, and synthesis.",
    success_markers_vi: [
      "Không dùng văn nói thân mật.",
      "Có contrast hoặc cause-effect.",
      "Không đặt hai summaries rời nhau.",
    ],
    success_markers_en: [
      "Does not use casual speech.",
      "Has contrast or cause-effect.",
      "Does not place two summaries separately.",
    ],
    quick_fix_language: [
      {
        pa: "ਇਸ ਸੰਦਰਭ ਵਿੱਚ, ...",
        rom: "is sandarbh vich, ...",
        vi: "Trong bối cảnh này,...",
        en: "In this context,...",
      },
      {
        pa: "ਇਸ ਲਈ ਸੰਤੁਲਿਤ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is lai santulit natija ih hai ki ...",
        vi: "Vì vậy, kết luận cân bằng là...",
        en: "Therefore, the balanced conclusion is that...",
      },
    ],
    canada_example: {
      context_vi: "Synthesis học thuật về sinh viên tại Canada.",
      context_en: "Academic synthesis about students in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਦੋਵੇਂ ਸਰੋਤ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ਉਹ ਵੱਖ-ਵੱਖ ਸੇਵਾਵਾਂ ਤੇ ਜ਼ੋਰ ਦਿੰਦੇ ਹਨ।",
      rom: "Canada vich dovein sarot vidyarthi sahaita bare chintat han, par oh vakh-vakh sevavan te zor dinde han.",
      vi: "Tại Canada, cả hai nguồn đều quan tâm đến hỗ trợ sinh viên, nhưng chúng nhấn mạnh các dịch vụ khác nhau.",
      en: "In Canada, both sources are concerned with student support, but they emphasize different services.",
    },
    learner_traps_vi: [
      "Đừng nghĩ câu dài hơn là học thuật hơn.",
      "Đừng thiếu topic sentence.",
    ],
    learner_traps_en: [
      "Do not assume longer is more academic.",
      "Do not omit a topic sentence.",
    ],
  },
  {
    id: "pa_c1_review_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "qa_prompt",
    title_pa: "ਪ੍ਰਸਤੁਤੀ ਤੋਂ ਬਾਅਦ ਜਵਾਬ",
    title_rom: "prastuti ton baad jawab",
    title_vi: "Ôn trả lời sau thuyết trình",
    title_en: "Review presentation response",
    review_question: {
      pa: "ਜੇ ਕੋਈ ਖਰਚੇ ਬਾਰੇ ਪੁੱਛੇ ਤੇ ਅੰਕੜੇ ਪੂਰੇ ਨਾ ਹੋਣ ਤਾਂ ਕੀ ਕਹੋਗੇ?",
      rom: "je koi kharche bare puchhe te ankde pure na hon tan ki kahoge?",
      vi: "Nếu ai hỏi về chi phí nhưng số liệu chưa đầy đủ, bạn sẽ nói gì?",
      en: "If someone asks about cost but the data is incomplete, what will you say?",
    },
    model_answer: {
      pa: "ਇਹ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ। ਇਸ ਵੇਲੇ ਪੂਰੇ ਖਰਚੇ ਬਾਰੇ ਅੰਕੜੇ ਸੀਮਿਤ ਹਨ, ਇਸ ਲਈ ਅਗਲਾ ਕਦਮ ... ਦੀ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
      rom: "ih mahatvapuran sawal hai. is vele pure kharche bare ankde simit han, is lai agla kadam ... di samikhia hovegi.",
      vi: "Đây là câu hỏi quan trọng. Hiện số liệu về toàn bộ chi phí còn hạn chế, vì vậy bước tiếp theo sẽ là xem xét...",
      en: "This is an important question. At this stage, data about the full cost is limited, so the next step will be a review of...",
    },
    checkpoint_vi: "Trả lời cần acknowledge, limitation, và next step.",
    checkpoint_en: "The answer needs acknowledgement, limitation, and next step.",
    success_markers_vi: [
      "Không né câu hỏi.",
      "Không giả vờ biết số liệu.",
      "Có next step rõ.",
    ],
    success_markers_en: [
      "Does not avoid the question.",
      "Does not pretend to know figures.",
      "Has a clear next step.",
    ],
    quick_fix_language: [
      {
        pa: "ਇਹ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ।",
        rom: "ih mahatvapuran sawal hai.",
        vi: "Đây là câu hỏi quan trọng.",
        en: "This is an important question.",
      },
      {
        pa: "ਇਸ ਵੇਲੇ ... ਸਪਸ਼ਟ ਨਹੀਂ।",
        rom: "is vele ... sapashat nahi.",
        vi: "Hiện tại ... chưa rõ.",
        en: "At this stage, ... is not clear.",
      },
    ],
    canada_example: {
      context_vi: "Hỏi đáp seminar tại Canada.",
      context_en: "Seminar Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਇਸ ਪ੍ਰਸਤਾਵ ਲਈ ਪੂਰਾ ਖਰਚਾ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ, ਪਰ ਪਹਿਲਾ ਕਦਮ ਪਾਇਲਟ ਪ੍ਰੋਗਰਾਮ ਦੀ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
      rom: "Canada vich is prastav lai pura kharcha aje sapashat nahi, par pahila kadam pilot program di samikhia hovegi.",
      vi: "Tại Canada, toàn bộ chi phí cho đề xuất này chưa rõ, nhưng bước đầu sẽ là xem xét chương trình thí điểm.",
      en: "In Canada, the full cost of this proposal is not yet clear, but the first step will be a pilot-program review.",
    },
    learner_traps_vi: [
      "Đừng lặp lại slide thay vì trả lời.",
      "Đừng trả lời quá dài khi câu hỏi cần trọng tâm.",
    ],
    learner_traps_en: [
      "Do not repeat the slide instead of answering.",
      "Do not answer too long when the question needs focus.",
    ],
  },
  {
    id: "pa_c1_review_public_text",
    level: "C1",
    area: "public_text_handling",
    mode: "quick_check",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਪਾਠ",
    title_rom: "jantak seva path",
    title_vi: "Ôn văn bản dịch vụ công",
    title_en: "Review public-service text",
    review_question: {
      pa: "ਨੋਟਿਸ ਵਿੱਚ action, eligibility ਅਤੇ deadline ਕਿਵੇਂ ਲੱਭੋਗੇ?",
      rom: "notice vich action, eligibility ate deadline kiven labhoge?",
      vi: "Bạn sẽ tìm action, eligibility và deadline trong thông báo như thế nào?",
      en: "How will you find action, eligibility, and deadline in a notice?",
    },
    model_answer: {
      pa: "ਨੋਟਿਸ ਦੇ ਅਨੁਸਾਰ, ... ਲਈ ... ਕਰਨਾ ਜ਼ਰੂਰੀ ਹੈ। ਮਿਆਦ ਤੋਂ ਪਹਿਲਾਂ ... ਜਮ੍ਹਾਂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "notice de anusaar, ... lai ... karna zaruri hai. miad ton pahilan ... jamma karna chahida hai.",
      vi: "Theo thông báo, đối với... cần phải... Trước hạn chót, nên nộp...",
      en: "According to the notice, for... it is necessary to... Before the deadline, ... should be submitted.",
    },
    checkpoint_vi: "Tách deadline khỏi start date và điều kiện khỏi hành động.",
    checkpoint_en: "Separate deadline from start date and condition from action.",
    success_markers_vi: [
      "Hiểu đúng notice.",
      "Không bỏ từ điều kiện.",
      "Câu hỏi clarification cụ thể.",
    ],
    success_markers_en: [
      "Understands the notice accurately.",
      "Does not miss condition words.",
      "Asks specific clarification.",
    ],
    quick_fix_language: [
      {
        pa: "ਨੋਟਿਸ ਦੇ ਅਨੁਸਾਰ, ...",
        rom: "notice de anusaar, ...",
        vi: "Theo thông báo,...",
        en: "According to the notice,...",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਕਰੋ ਕਿ ...",
        rom: "kirpa karke sapashat karo ki ...",
        vi: "Xin vui lòng làm rõ liệu...",
        en: "Please clarify whether...",
      },
    ],
    canada_example: {
      context_vi: "Thông báo trung tâm cộng đồng tại Canada.",
      context_en: "Community-centre notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀਆਂ ਕਲਾਸਾਂ ਲਈ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਹੋਵੇਗੀ।",
      rom: "Canada vich community kendar dian classan lai navi registration prakiria hovegi.",
      vi: "Tại Canada, sẽ có quy trình đăng ký mới cho các lớp tại trung tâm cộng đồng.",
      en: "In Canada, community-centre classes will have a new registration process.",
    },
    learner_traps_vi: [
      "Đừng nhầm ngày bắt đầu với hạn nộp.",
      "Đừng chuyển clarification thành complaint.",
    ],
    learner_traps_en: [
      "Do not confuse start date with submission deadline.",
      "Do not turn clarification into a complaint.",
    ],
  },
  {
    id: "pa_c1_review_professional_text",
    level: "C1",
    area: "professional_text_handling",
    mode: "final_checkpoint",
    title_pa: "ਪੇਸ਼ਾਵਰ ਅਪਡੇਟ",
    title_rom: "peshavar update",
    title_vi: "Ôn update chuyên nghiệp",
    title_en: "Review professional updates",
    review_question: {
      pa: "ਮੀਟਿੰਗ ਨੋਟ ਤੋਂ status, risk ਅਤੇ next step ਕਿਵੇਂ ਲਿਖੋਗੇ?",
      rom: "meeting note ton status, risk ate next step kiven likhoge?",
      vi: "Từ ghi chú cuộc họp, bạn sẽ viết status, risk và next step như thế nào?",
      en: "From meeting notes, how will you write status, risk, and next step?",
    },
    model_answer: {
      pa: "ਮੌਜੂਦਾ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ... ਇੱਕ ਜੋਖਮ ... ਹੈ। ਅਗਲਾ ਕਦਮ ... ਹੋਵੇਗਾ।",
      rom: "maujuda sthiti ih hai ki ... ikk jokham ... hai. agla kadam ... hovega.",
      vi: "Tình trạng hiện tại là... Một rủi ro là... Bước tiếp theo sẽ là...",
      en: "The current status is that... One risk is... The next step will be...",
    },
    checkpoint_vi: "Professional update cần ngắn, rõ, có action owner hoặc next step.",
    checkpoint_en: "A professional update should be concise, clear, and include action owner or next step.",
    success_markers_vi: [
      "Status xuất hiện sớm.",
      "Risk/limitation rõ.",
      "Next step là hành động cụ thể.",
    ],
    success_markers_en: [
      "Status appears early.",
      "Risk/limitation is clear.",
      "Next step is a specific action.",
    ],
    quick_fix_language: [
      {
        pa: "ਮੌਜੂਦਾ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ...",
        rom: "maujuda sthiti ih hai ki ...",
        vi: "Tình trạng hiện tại là...",
        en: "The current status is that...",
      },
      {
        pa: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਅਸੀਂ ...",
        rom: "meri sifarash hai ki asin ...",
        vi: "Khuyến nghị của tôi là chúng ta...",
        en: "My recommendation is that we...",
      },
    ],
    canada_example: {
      context_vi: "Update dự án tại Canada.",
      context_en: "Project update in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਾਡੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਹੈ, ਪਰ ਅੰਕੜਿਆਂ ਦੀ ਜਾਂਚ ਹਾਲੇ ਬਾਕੀ ਹੈ।",
      rom: "Canada vich sade project lai pahila masoda tiar hai, par ankrian di janch hale baki hai.",
      vi: "Tại Canada, bản nháp đầu cho dự án của chúng ta đã sẵn sàng, nhưng việc kiểm tra số liệu vẫn còn.",
      en: "In Canada, the first draft for our project is ready, but data checking still remains.",
    },
    learner_traps_vi: [
      "Đừng viết update như essay dài.",
      "Đừng quên action owner nếu prompt có nêu.",
    ],
    learner_traps_en: [
      "Do not write an update like a long essay.",
      "Do not forget the action owner if the prompt gives one.",
    ],
  },
];
