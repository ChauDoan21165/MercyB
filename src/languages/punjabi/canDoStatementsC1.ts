// Punjabi C1 can-do statements for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiC1CanDoArea =
  | "summarize_sources"
  | "cautious_claims"
  | "compare_evidence"
  | "formal_writing"
  | "academic_register"
  | "presentation_response"
  | "public_text_handling"
  | "professional_text_handling";

export type PunjabiC1CanDoReadiness = "checkpoint" | "practice_ready" | "capstone_ready";

export type PunjabiCanDoPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiCanDoStatementC1 = {
  id: string;
  level: "C1";
  area: PunjabiC1CanDoArea;
  readiness: PunjabiC1CanDoReadiness;
  statement_pa: string;
  statement_rom: string;
  statement_vi: string;
  statement_en: string;
  learner_evidence_vi: string;
  learner_evidence_en: string;
  checkpoint_task: PunjabiCanDoPhrase;
  success_markers_vi: readonly string[];
  success_markers_en: readonly string[];
  useful_language: readonly PunjabiCanDoPhrase[];
  canada_example: PunjabiCanDoPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const canDoStatementsScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const canDoStatementsC1: PunjabiCanDoStatementC1[] = [
  {
    id: "pa_c1_cando_summarize_sources",
    level: "C1",
    area: "summarize_sources",
    readiness: "checkpoint",
    statement_pa: "ਮੈਂ ਛੋਟੇ ਅਕਾਦਮਿਕ ਜਾਂ ਪੇਸ਼ਾਵਰ ਸਰੋਤ ਦਾ ਨਿਰਪੱਖ ਸਾਰ ਦੇ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    statement_rom: "main chhote academic ja peshavar sarot da nirpakh saar de sakda/sakdi han.",
    statement_vi: "Tôi có thể tóm tắt trung lập một nguồn học thuật hoặc chuyên nghiệp ngắn.",
    statement_en: "I can give a neutral summary of a short academic or professional source.",
    learner_evidence_vi: "Bạn nêu claim chính, evidence chính, và implication mà không thêm opinion.",
    learner_evidence_en: "You state the main claim, key evidence, and implication without adding opinion.",
    checkpoint_task: {
      pa: "ਇੱਕ ਸਰੋਤ ਪੜ੍ਹੋ ਅਤੇ ਤਿੰਨ ਵਾਕਾਂ ਦਾ ਨਿਰਪੱਖ ਸਾਰ ਲਿਖੋ।",
      rom: "ikk sarot parho ate tinn vakan da nirpakh saar likho.",
      vi: "Đọc một nguồn và viết summary trung lập ba câu.",
      en: "Read one source and write a neutral three-sentence summary.",
    },
    success_markers_vi: [
      "Claim chính được nêu trước chi tiết.",
      "Evidence được nén, không liệt kê quá nhiều.",
      "Giọng không có đánh giá cá nhân.",
    ],
    success_markers_en: [
      "Main claim is stated before details.",
      "Evidence is compressed, not over-listed.",
      "Tone has no personal evaluation.",
    ],
    useful_language: [
      {
        pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "sarot da mukh daava ih hai ki ...",
        vi: "Luận điểm chính của nguồn là...",
        en: "The source's main claim is that...",
      },
      {
        pa: "ਲੇਖਕ ਇਸ ਨੂੰ ... ਨਾਲ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ।",
        rom: "lekhak is nu ... nal samarthan dinda hai.",
        vi: "Tác giả hỗ trợ điều này bằng...",
        en: "The writer supports this with...",
      },
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ, ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ...",
        rom: "sankhep vich, sarot sujhaounda hai ki ...",
        vi: "Tóm lại, nguồn gợi ý rằng...",
        en: "In summary, the source suggests that...",
      },
    ],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ sinh viên tại Canada.",
      context_en: "Summarizing a source about student services in Canada.",
      pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ ਖੋਜ-ਲੇਖ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।",
      rom: "sarot sujhaounda hai ki Canada vich vidyarthi sahaita kendar khoj-lekh di yojna banaun vich madad kar sakde han.",
      vi: "Nguồn gợi ý rằng tại Canada, trung tâm hỗ trợ sinh viên có thể giúp lập kế hoạch bài nghiên cứu.",
      en: "The source suggests that in Canada, student support centres may help with research-paper planning.",
    },
    learner_traps_vi: [
      "Đừng thêm 'tôi nghĩ' vào summary.",
      "Không dịch từng câu nếu làm mất cấu trúc claim-evidence.",
    ],
    learner_traps_en: [
      "Do not add 'I think' to a summary.",
      "Do not translate sentence by sentence if claim-evidence structure is lost.",
    ],
  },
  {
    id: "pa_c1_cando_cautious_claims",
    level: "C1",
    area: "cautious_claims",
    readiness: "practice_ready",
    statement_pa: "ਮੈਂ ਸਬੂਤ ਦੇ ਅਨੁਸਾਰ ਸਾਵਧਾਨ ਦਾਅਵੇ ਪੇਸ਼ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    statement_rom: "main sabut de anusaar savdhan daave pesh kar sakda/sakdi han.",
    statement_vi: "Tôi có thể trình bày claim thận trọng theo mức bằng chứng.",
    statement_en: "I can present cautious claims according to the strength of evidence.",
    learner_evidence_vi: "Bạn dùng hedge, điều kiện, và phạm vi thay vì khẳng định tuyệt đối.",
    learner_evidence_en: "You use hedges, conditions, and scope instead of absolute assertions.",
    checkpoint_task: {
      pa: "ਇੱਕ ਬਹੁਤ ਪੱਕੇ ਦਾਅਵੇ ਨੂੰ ਸਾਵਧਾਨ ਦਾਅਵੇ ਵਿੱਚ ਬਦਲੋ।",
      rom: "ikk bahut pakke daave nu savdhan daave vich badlo.",
      vi: "Chuyển một claim quá chắc chắn thành claim thận trọng.",
      en: "Turn an overly certain claim into a cautious claim.",
    },
    success_markers_vi: [
      "Giảm always/never hoặc hamesha kiểu tuyệt đối.",
      "Nêu điều kiện hoặc nhóm áp dụng.",
      "Vẫn giữ lập trường chính.",
    ],
    success_markers_en: [
      "Reduces always/never-style absolutes.",
      "States condition or affected group.",
      "Still keeps the main stance.",
    ],
    useful_language: [
      {
        pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ...",
        rom: "uplabdh jankari de adhar te, ...",
        vi: "Dựa trên thông tin hiện có,...",
        en: "Based on the available information,...",
      },
      {
        pa: "ਕੁਝ ਸਥਿਤੀਆਂ ਵਿੱਚ, ... ਲਾਭਕਾਰੀ ਹੋ ਸਕਦਾ ਹੈ।",
        rom: "kujh sthitian vich, ... labhkari ho sakda hai.",
        vi: "Trong một số tình huống,... có thể hữu ích.",
        en: "In some situations, ... may be useful.",
      },
      {
        pa: "ਇਹ ਕਹਿਣਾ ਵਧੇਰੇ ਸਹੀ ਹੋਵੇਗਾ ਕਿ ...",
        rom: "ih kehna vadhere sahi hovega ki ...",
        vi: "Sẽ chính xác hơn nếu nói rằng...",
        en: "It would be more accurate to say that...",
      },
    ],
    canada_example: {
      context_vi: "Claim thận trọng về dịch vụ trực tuyến tại Canada.",
      context_en: "Cautious claim about online services in Canada.",
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ਕੈਨੇਡਾ ਵਿੱਚ ਆਨਲਾਈਨ ਸੇਵਾਵਾਂ ਕੁਝ ਵਸਨੀਕਾਂ ਲਈ ਪਹੁੰਚ ਸੁਧਾਰ ਸਕਦੀਆਂ ਹਨ।",
      rom: "uplabdh jankari de adhar te, Canada vich online sevavan kujh vasnikan lai pahunch sudhar sakdian han.",
      vi: "Dựa trên thông tin hiện có, tại Canada dịch vụ trực tuyến có thể cải thiện khả năng tiếp cận cho một số cư dân.",
      en: "Based on the available information, online services in Canada may improve access for some residents.",
    },
    learner_traps_vi: [
      "Hedge không có nghĩa là yếu; nó làm claim chính xác hơn.",
      "Đừng hedge quá nhiều đến mức câu không còn lập trường.",
    ],
    learner_traps_en: [
      "Hedging does not mean weakness; it makes the claim more precise.",
      "Do not hedge so much that the sentence loses its stance.",
    ],
  },
  {
    id: "pa_c1_cando_compare_evidence",
    level: "C1",
    area: "compare_evidence",
    readiness: "practice_ready",
    statement_pa: "ਮੈਂ ਦੋ ਸਬੂਤਾਂ ਦੀ ਮਜ਼ਬੂਤੀ ਅਤੇ ਸੀਮਾ ਦੀ ਤੁਲਨਾ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    statement_rom: "main do sabutan di mazbuti ate sima di tulna kar sakda/sakdi han.",
    statement_vi: "Tôi có thể so sánh độ mạnh và giới hạn của hai bằng chứng.",
    statement_en: "I can compare the strength and limitation of two pieces of evidence.",
    learner_evidence_vi: "Bạn nêu tiêu chí so sánh, không chỉ nói nguồn A khác nguồn B.",
    learner_evidence_en: "You state a comparison criterion, not only that source A differs from source B.",
    checkpoint_task: {
      pa: "ਸਰਵੇਖਣ ਅਤੇ ਰਿਪੋਰਟ ਦੇ ਸਬੂਤ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
      rom: "sarvekhan ate report de sabut di tulna karo.",
      vi: "So sánh evidence từ khảo sát và báo cáo.",
      en: "Compare evidence from a survey and a report.",
    },
    success_markers_vi: [
      "Có tiêu chí như relevance, reliability, scope.",
      "Nêu strength và limitation.",
      "Kết luận nguồn nào phù hợp với claim nào.",
    ],
    success_markers_en: [
      "Has criteria such as relevance, reliability, scope.",
      "States strength and limitation.",
      "Concludes which source fits which claim.",
    ],
    useful_language: [
      {
        pa: "ਪਹਿਲਾ ਸਰੋਤ ... ਲਈ ਵਧੇਰੇ ਲਾਭਕਾਰੀ ਹੈ।",
        rom: "pahila sarot ... lai vadhere labhkari hai.",
        vi: "Nguồn thứ nhất hữu ích hơn cho...",
        en: "The first source is more useful for...",
      },
      {
        pa: "ਦੂਜਾ ਸਰੋਤ ... ਬਾਰੇ ਵਧੇਰੇ ਮਜ਼ਬੂਤ ਸਬੂਤ ਦਿੰਦਾ ਹੈ।",
        rom: "duja sarot ... bare vadhere mazbut sabut dinda hai.",
        vi: "Nguồn thứ hai đưa bằng chứng mạnh hơn về...",
        en: "The second source gives stronger evidence about...",
      },
      {
        pa: "ਫਿਰ ਵੀ, ਦੋਵੇਂ ਸਰੋਤਾਂ ਦੀਆਂ ਆਪਣੀਆਂ ਸੀਮਾਵਾਂ ਹਨ।",
        rom: "fir vi, dovein sarotan dian apnian simavan han.",
        vi: "Tuy vậy, cả hai nguồn đều có giới hạn riêng.",
        en: "Even so, both sources have their own limitations.",
      },
    ],
    canada_example: {
      context_vi: "So sánh evidence về hỗ trợ sinh viên tại Canada.",
      context_en: "Comparing evidence about student support in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਰਵੇਖਣ ਅਨੁਭਵ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਾਸਕੀ ਰਿਪੋਰਟ ਸੇਵਾ ਦੀ ਵਰਤੋਂ ਬਾਰੇ ਵਧੇਰੇ ਸਥਿਰ ਅੰਕੜੇ ਦਿੰਦੀ ਹੈ।",
      rom: "Canada vich vidyarthi sarvekhan anubhav dikhaounda hai, jadki prashaski report seva di varton bare vadhere sthir ankde dindi hai.",
      vi: "Tại Canada, khảo sát sinh viên cho thấy trải nghiệm, trong khi báo cáo hành chính đưa số liệu ổn định hơn về việc dùng dịch vụ.",
      en: "In Canada, a student survey shows experience, whereas an administrative report gives more stable data about service use.",
    },
    learner_traps_vi: [
      "Đừng so sánh chỉ bằng dài/ngắn.",
      "Không bỏ qua limitation của nguồn bạn thích hơn.",
    ],
    learner_traps_en: [
      "Do not compare only by longer/shorter.",
      "Do not ignore the limitation of the source you prefer.",
    ],
  },
  {
    id: "pa_c1_cando_formal_writing",
    level: "C1",
    area: "formal_writing",
    readiness: "capstone_ready",
    statement_pa: "ਮੈਂ ਰਸਮੀ ਈਮੇਲ ਜਾਂ ਪੱਤਰ ਵਿੱਚ ਸਮੱਸਿਆ, ਪ੍ਰਭਾਵ ਅਤੇ ਬੇਨਤੀ ਸਪਸ਼ਟ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    statement_rom: "main rasmi email ja pattar vich samasya, prabhav ate benati sapashat kar sakda/sakdi han.",
    statement_vi: "Tôi có thể nêu rõ vấn đề, tác động, và yêu cầu trong email hoặc thư trang trọng.",
    statement_en: "I can clearly state a problem, impact, and request in a formal email or letter.",
    learner_evidence_vi: "Bạn viết với greeting, purpose, evidence, impact, and requested action.",
    learner_evidence_en: "You write with greeting, purpose, evidence, impact, and requested action.",
    checkpoint_task: {
      pa: "ਦੇਰੀ ਹੋਈ ਸੇਵਾ ਬਾਰੇ ਰਸਮੀ ਈਮੇਲ ਲਿਖੋ।",
      rom: "deri hoi seva bare rasmi email likho.",
      vi: "Viết email trang trọng về dịch vụ bị chậm.",
      en: "Write a formal email about a delayed service.",
    },
    success_markers_vi: [
      "Giọng lịch sự nhưng chắc chắn.",
      "Có evidence về thời gian/sự kiện.",
      "Yêu cầu hành động cụ thể.",
    ],
    success_markers_en: [
      "Polite but firm tone.",
      "Includes time/event evidence.",
      "Requests a specific action.",
    ],
    useful_language: [
      {
        pa: "ਮੈਂ ... ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
        rom: "main ... bare apni chinta darj karvauna chahunda/chahundi han.",
        vi: "Tôi muốn ghi nhận mối quan ngại về...",
        en: "I would like to register my concern about...",
      },
      {
        pa: "ਇਸ ਦਾ ਪ੍ਰਭਾਵ ਇਹ ਹੋਇਆ ਕਿ ...",
        rom: "is da prabhav ih hoia ki ...",
        vi: "Tác động của việc này là...",
        en: "The impact of this was that...",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਮਾਮਲੇ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।",
        rom: "kirpa karke is mamle di samikhia karo.",
        vi: "Xin vui lòng xem xét vấn đề này.",
        en: "Please review this matter.",
      },
    ],
    canada_example: {
      context_vi: "Email về hồ sơ hành chính tại Canada.",
      context_en: "Email about an administrative file in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਮੇਰੀ ਅਰਜ਼ੀ ਤਿੰਨ ਹਫ਼ਤਿਆਂ ਤੋਂ ਲੰਬਿਤ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਸਥਿਤੀ ਬਾਰੇ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਬੇਨਤੀ ਕਰਦੀ ਹਾਂ।",
      rom: "Canada vich meri arzi tinn haftian ton lambit hai, is lai main sthiti bare spashtikaran di benati kardi han.",
      vi: "Tại Canada, hồ sơ của tôi đã chờ ba tuần, vì vậy tôi xin được làm rõ tình trạng.",
      en: "In Canada, my application has been pending for three weeks, so I request clarification about the status.",
    },
    learner_traps_vi: [
      "Đừng viết quá thân mật.",
      "Không chỉ phàn nàn; cần action cụ thể.",
    ],
    learner_traps_en: [
      "Do not write too casually.",
      "Do not only complain; include a specific action.",
    ],
  },
  {
    id: "pa_c1_cando_academic_register",
    level: "C1",
    area: "academic_register",
    readiness: "capstone_ready",
    statement_pa: "ਮੈਂ ਅਕਾਦਮਿਕ ਲਹਿਜ਼ੇ ਵਿੱਚ ਸਰੋਤਾਂ ਨੂੰ ਜੋੜ ਕੇ ਤਰਕ ਪੇਸ਼ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    statement_rom: "main academic lehje vich sarotan nu jor ke tark pesh kar sakda/sakdi han.",
    statement_vi: "Tôi có thể dùng register học thuật để tổng hợp nguồn và trình bày lập luận.",
    statement_en: "I can use academic register to synthesize sources and present an argument.",
    learner_evidence_vi: "Bạn dùng tone trung lập, connectors, và synthesis thay vì hai summaries rời.",
    learner_evidence_en: "You use neutral tone, connectors, and synthesis instead of two separate summaries.",
    checkpoint_task: {
      pa: "ਦੋ ਸਰੋਤਾਂ ਨੂੰ ਜੋੜਦਾ ਇੱਕ ਅਕਾਦਮਿਕ ਪੈਰਾ ਲਿਖੋ।",
      rom: "do sarotan nu jorda ikk academic para likho.",
      vi: "Viết một đoạn học thuật nối hai nguồn.",
      en: "Write an academic paragraph connecting two sources.",
    },
    success_markers_vi: [
      "Tone không cảm tính.",
      "Có contrast hoặc therefore relationship.",
      "Evidence được so sánh, không chỉ kể lại.",
    ],
    success_markers_en: [
      "Tone is not emotional.",
      "Has contrast or therefore relationship.",
      "Evidence is compared, not only retold.",
    ],
    useful_language: [
      {
        pa: "ਦੋਵੇਂ ਸਰੋਤ ... ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ...",
        rom: "dovein sarot ... bare chintat han, par ...",
        vi: "Cả hai nguồn đều quan tâm đến..., nhưng...",
        en: "Both sources are concerned with..., but...",
      },
      {
        pa: "ਇਹ ਸਬੂਤ ਪੂਰਾ ਨਹੀਂ, ਪਰ ਇਹ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ...",
        rom: "ih sabut pura nahi, par ih sujhaounda hai ki ...",
        vi: "Bằng chứng này chưa đầy đủ, nhưng gợi ý rằng...",
        en: "This evidence is not complete, but it suggests that...",
      },
      {
        pa: "ਇਸ ਲਈ ਸਭ ਤੋਂ ਸੰਤੁਲਿਤ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is lai sab ton santulit natija ih hai ki ...",
        vi: "Vì vậy, kết luận cân bằng nhất là...",
        en: "Therefore, the most balanced conclusion is that...",
      },
    ],
    canada_example: {
      context_vi: "Synthesis học thuật về hỗ trợ sinh viên tại Canada.",
      context_en: "Academic synthesis about student support in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਦੋਵੇਂ ਸਰੋਤ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ਪਹਿਲਾ ਲਿਖਣ ਕੇਂਦਰ ਤੇ ਅਤੇ ਦੂਜਾ ਮਾਰਗਦਰਸ਼ਨ ਸੇਵਾਵਾਂ ਤੇ ਜ਼ੋਰ ਦਿੰਦਾ ਹੈ।",
      rom: "Canada vich dovein sarot vidyarthi sahaita bare chintat han, par pahila likhan kendar te ate duja margdarshan sevavan te zor dinda hai.",
      vi: "Tại Canada, cả hai nguồn đều quan tâm đến hỗ trợ sinh viên, nhưng nguồn thứ nhất nhấn mạnh trung tâm viết và nguồn thứ hai nhấn mạnh dịch vụ cố vấn.",
      en: "In Canada, both sources are concerned with student support, but the first emphasizes writing centres and the second emphasizes advising services.",
    },
    learner_traps_vi: [
      "Đừng dùng văn nói thân mật trong register học thuật.",
      "Không đặt hai summaries cạnh nhau mà thiếu synthesis.",
    ],
    learner_traps_en: [
      "Do not use casual speech in academic register.",
      "Do not place two summaries side by side without synthesis.",
    ],
  },
  {
    id: "pa_c1_cando_presentation_response",
    level: "C1",
    area: "presentation_response",
    readiness: "practice_ready",
    statement_pa: "ਮੈਂ ਪ੍ਰਸਤੁਤੀ ਤੋਂ ਬਾਅਦ ਔਖੇ ਸਵਾਲ ਦਾ ਸੰਤੁਲਿਤ ਜਵਾਬ ਦੇ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    statement_rom: "main prastuti ton baad aukhe saval da santulit jawab de sakda/sakdi han.",
    statement_vi: "Tôi có thể trả lời cân bằng một câu hỏi khó sau bài thuyết trình.",
    statement_en: "I can give a balanced answer to a difficult question after a presentation.",
    learner_evidence_vi: "Bạn thừa nhận câu hỏi, nêu limitation nếu cần, và đưa next step.",
    learner_evidence_en: "You acknowledge the question, state limitation if needed, and give a next step.",
    checkpoint_task: {
      pa: "ਪ੍ਰਸਤੁਤੀ ਦੇ ਅੰਤ ਤੇ ਖਰਚੇ ਬਾਰੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।",
      rom: "prastuti de ant te kharche bare saval da jawab dio.",
      vi: "Trả lời câu hỏi về chi phí ở cuối bài thuyết trình.",
      en: "Answer a question about cost at the end of a presentation.",
    },
    success_markers_vi: [
      "Mở đầu bình tĩnh.",
      "Không giả vờ biết số liệu chưa có.",
      "Có nguyên tắc hoặc bước tiếp theo.",
    ],
    success_markers_en: [
      "Opens calmly.",
      "Does not pretend to know missing figures.",
      "Has a principle or next step.",
    ],
    useful_language: [
      {
        pa: "ਇਹ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ।",
        rom: "ih bahut mahatvapuran saval hai.",
        vi: "Đây là câu hỏi rất quan trọng.",
        en: "This is a very important question.",
      },
      {
        pa: "ਇਸ ਵੇਲੇ ਪੂਰਾ ਖਰਚਾ ਸਪਸ਼ਟ ਨਹੀਂ, ਪਰ ...",
        rom: "is vele pura kharcha sapashat nahi, par ...",
        vi: "Hiện tại toàn bộ chi phí chưa rõ, nhưng...",
        en: "At this stage, the full cost is not clear, but...",
      },
      {
        pa: "ਅਗਲਾ ਕਦਮ ... ਦੀ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
        rom: "agla kadam ... di samikhia hovegi.",
        vi: "Bước tiếp theo sẽ là xem xét...",
        en: "The next step will be a review of...",
      },
    ],
    canada_example: {
      context_vi: "Trả lời sau presentation về dự án cộng đồng tại Canada.",
      context_en: "Answering after a presentation about a community project in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਇਸ ਪ੍ਰਸਤਾਵ ਲਈ ਪੂਰਾ ਖਰਚਾ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ, ਪਰ ਪਹਿਲਾ ਕਦਮ ਪਾਇਲਟ ਪ੍ਰੋਗਰਾਮ ਦੀ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
      rom: "Canada vich is prastav lai pura kharcha aje sapashat nahi, par pahila kadam pilot program di samikhia hovegi.",
      vi: "Tại Canada, toàn bộ chi phí cho đề xuất này chưa rõ, nhưng bước đầu sẽ là xem xét chương trình thí điểm.",
      en: "In Canada, the full cost of this proposal is not yet clear, but the first step will be a pilot-program review.",
    },
    learner_traps_vi: [
      "Đừng né câu hỏi bằng cách lặp lại slide.",
      "Nếu không biết số liệu, nói limitation rõ.",
    ],
    learner_traps_en: [
      "Do not avoid the question by repeating the slide.",
      "If you do not know the figure, state the limitation clearly.",
    ],
  },
  {
    id: "pa_c1_cando_public_text",
    level: "C1",
    area: "public_text_handling",
    readiness: "checkpoint",
    statement_pa: "ਮੈਂ ਜਨਤਕ ਸੇਵਾ ਨੋਟਿਸ ਪੜ੍ਹ ਕੇ ਸਪਸ਼ਟ ਰਸਮੀ ਜਵਾਬ ਦੇ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    statement_rom: "main jantak seva notice parh ke sapashat rasmi jawab de sakda/sakdi han.",
    statement_vi: "Tôi có thể đọc thông báo dịch vụ công và trả lời trang trọng rõ ràng.",
    statement_en: "I can read a public-service notice and give a clear formal response.",
    learner_evidence_vi: "Bạn summarize notice đúng, hỏi clarification cụ thể, và không claim ngoài prompt.",
    learner_evidence_en: "You summarize the notice accurately, ask specific clarification, and do not claim beyond the prompt.",
    checkpoint_task: {
      pa: "ਨੋਟਿਸ ਪੜ੍ਹ ਕੇ ਸਪਸ਼ਟੀਕਰਨ ਲਈ ਜਵਾਬ ਲਿਖੋ।",
      rom: "notice parh ke spashtikaran lai jawab likho.",
      vi: "Đọc thông báo và viết phản hồi xin làm rõ.",
      en: "Read the notice and write a response asking for clarification.",
    },
    success_markers_vi: [
      "Nêu đúng nội dung notice.",
      "Câu hỏi cụ thể.",
      "Tone lịch sự, không phóng đại quyền lợi.",
    ],
    success_markers_en: [
      "States the notice content accurately.",
      "Specific question.",
      "Polite tone, without overstating rights.",
    ],
    useful_language: [
      {
        pa: "ਨੋਟਿਸ ਦੇ ਅਨੁਸਾਰ, ...",
        rom: "notice de anusaar, ...",
        vi: "Theo thông báo,...",
        en: "According to the notice,...",
      },
      {
        pa: "ਮੇਰੀ ਮੁੱਖ ਚਿੰਤਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "meri mukh chinta ih hai ki ...",
        vi: "Mối quan ngại chính của tôi là...",
        en: "My main concern is that...",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਕਰੋ ਕਿ ...",
        rom: "kirpa karke sapashat karo ki ...",
        vi: "Xin vui lòng làm rõ liệu...",
        en: "Please clarify whether...",
      },
    ],
    canada_example: {
      context_vi: "Phản hồi thông báo trung tâm cộng đồng tại Canada.",
      context_en: "Responding to a community-centre notice in Canada.",
      pa: "ਨੋਟਿਸ ਦੇ ਅਨੁਸਾਰ, ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀਆਂ ਕਲਾਸਾਂ ਲਈ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਹੋਵੇਗੀ।",
      rom: "notice de anusaar, Canada vich community kendar dian classan lai navi registration prakiria hovegi.",
      vi: "Theo thông báo, tại Canada sẽ có quy trình đăng ký mới cho lớp tại trung tâm cộng đồng.",
      en: "According to the notice, community-centre classes in Canada will have a new registration process.",
    },
    learner_traps_vi: [
      "Đừng biến clarification thành complaint nếu prompt không yêu cầu.",
      "Không bỏ qua nội dung chính của notice.",
    ],
    learner_traps_en: [
      "Do not turn clarification into a complaint if the prompt does not ask for it.",
      "Do not skip the main content of the notice.",
    ],
  },
  {
    id: "pa_c1_cando_professional_text",
    level: "C1",
    area: "professional_text_handling",
    readiness: "capstone_ready",
    statement_pa: "ਮੈਂ ਪੇਸ਼ਾਵਰ ਅਪਡੇਟ ਵਿੱਚ ਸਥਿਤੀ, ਜੋਖਮ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    statement_rom: "main peshavar update vich sthiti, jokham ate agla kadam sapashat kar sakda/sakdi han.",
    statement_vi: "Tôi có thể nêu rõ tình trạng, rủi ro, và bước tiếp theo trong update chuyên nghiệp.",
    statement_en: "I can clearly state status, risk, and next step in a professional update.",
    learner_evidence_vi: "Bạn viết memo/update ngắn, có status, risk/limitation, và recommendation.",
    learner_evidence_en: "You write a concise memo/update with status, risk/limitation, and recommendation.",
    checkpoint_task: {
      pa: "ਟੀਮ ਲਈ ਇੱਕ ਛੋਟਾ ਪ੍ਰੋਜੈਕਟ ਅਪਡੇਟ ਲਿਖੋ।",
      rom: "team lai ikk chhota project update likho.",
      vi: "Viết một update dự án ngắn cho nhóm.",
      en: "Write a short project update for the team.",
    },
    success_markers_vi: [
      "Mở đầu nêu status.",
      "Có risk hoặc limitation.",
      "Kết thúc bằng next step cụ thể.",
    ],
    success_markers_en: [
      "Opening states status.",
      "Has risk or limitation.",
      "Ends with a specific next step.",
    ],
    useful_language: [
      {
        pa: "ਮੌਜੂਦਾ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ...",
        rom: "maujuda sthiti ih hai ki ...",
        vi: "Tình trạng hiện tại là...",
        en: "The current status is that...",
      },
      {
        pa: "ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਜੋਖਮ ਇਹ ਹੈ ਕਿ ...",
        rom: "ikk mahatvapuran jokham ih hai ki ...",
        vi: "Một rủi ro quan trọng là...",
        en: "One important risk is that...",
      },
      {
        pa: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਅਸੀਂ ...",
        rom: "meri sifarash hai ki asin ...",
        vi: "Khuyến nghị của tôi là chúng ta...",
        en: "My recommendation is that we...",
      },
    ],
    canada_example: {
      context_vi: "Update nhóm dự án tại Canada.",
      context_en: "Project-team update in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਾਡੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਹੈ, ਪਰ ਜਨਤਕ ਸੇਵਾ ਸੰਬੰਧੀ ਅੰਕੜਿਆਂ ਦੀ ਜਾਂਚ ਹਾਲੇ ਬਾਕੀ ਹੈ।",
      rom: "Canada vich sade project lai pahila masoda tiar hai, par jantak seva sambandhi ankrian di janch hale baki hai.",
      vi: "Tại Canada, bản nháp đầu cho dự án của chúng ta đã sẵn sàng, nhưng việc kiểm tra số liệu về dịch vụ công vẫn còn.",
      en: "In Canada, the first draft for our project is ready, but checking public-service data still remains.",
    },
    learner_traps_vi: [
      "Đừng viết update như essay dài.",
      "Next step phải là hành động cụ thể.",
    ],
    learner_traps_en: [
      "Do not write an update like a long essay.",
      "The next step must be a specific action.",
    ],
  },
];
