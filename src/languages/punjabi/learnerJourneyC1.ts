// Punjabi C1 learner journey for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiC1JourneyStage =
  | "formal_writing"
  | "source_summary"
  | "cautious_claims"
  | "evidence_comparison"
  | "academic_register"
  | "presentation_response"
  | "public_service_text"
  | "professional_text";

export type PunjabiC1JourneyReadiness = "build" | "bridge" | "handoff";

export type PunjabiJourneyPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiLearnerJourneyStepC1 = {
  id: string;
  level: "C1";
  stage: PunjabiC1JourneyStage;
  readiness: PunjabiC1JourneyReadiness;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  learner_outcome: PunjabiJourneyPhrase;
  handoff_vi: string;
  handoff_en: string;
  checkpoint_task: PunjabiJourneyPhrase;
  readiness_evidence_vi: readonly string[];
  readiness_evidence_en: readonly string[];
  support_language: readonly PunjabiJourneyPhrase[];
  canada_example: PunjabiJourneyPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const learnerJourneyScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const learnerJourneyC1: PunjabiLearnerJourneyStepC1[] = [
  {
    id: "pa_c1_journey_formal_writing",
    level: "C1",
    stage: "formal_writing",
    readiness: "build",
    title_pa: "ਰਸਮੀ ਲਿਖਤ ਨਾਲ ਸ਼ੁਰੂਆਤ",
    title_rom: "rasmi likhat nal shuruaat",
    title_vi: "Bắt đầu bằng viết trang trọng",
    title_en: "Start with formal writing",
    learner_outcome: {
      pa: "ਮੈਂ ਸਮੱਸਿਆ, ਪ੍ਰਭਾਵ ਅਤੇ ਬੇਨਤੀ ਨੂੰ ਆਦਰਪੂਰਣ ਢੰਗ ਨਾਲ ਲਿਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
      rom: "main samasya, prabhav ate benati nu adarpuran dhang nal likh sakda/sakdi han.",
      vi: "Tôi có thể viết vấn đề, tác động và yêu cầu bằng giọng tôn trọng.",
      en: "I can write a problem, impact, and request in a respectful tone.",
    },
    handoff_vi: "Sau bước này, chuyển sang đọc nguồn để yêu cầu và summary dựa trên evidence.",
    handoff_en: "After this step, move to reading sources so requests and summaries are evidence-based.",
    checkpoint_task: {
      pa: "ਦੇਰੀ ਹੋਈ ਸੇਵਾ ਬਾਰੇ ਰਸਮੀ ਈਮੇਲ ਲਿਖੋ।",
      rom: "deri hoi seva bare rasmi email likho.",
      vi: "Viết email trang trọng về dịch vụ bị chậm.",
      en: "Write a formal email about a delayed service.",
    },
    readiness_evidence_vi: [
      "Có purpose rõ.",
      "Có evidence hoặc timeline.",
      "Có requested action cụ thể.",
    ],
    readiness_evidence_en: [
      "Has clear purpose.",
      "Has evidence or timeline.",
      "Has a specific requested action.",
    ],
    support_language: [
      {
        pa: "ਮੈਂ ... ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
        rom: "main ... bare apni chinta darj karvauna chahunda/chahundi han.",
        vi: "Tôi muốn ghi nhận mối quan ngại về...",
        en: "I would like to register my concern about...",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਮਾਮਲੇ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।",
        rom: "kirpa karke is mamle di samikhia karo.",
        vi: "Xin vui lòng xem xét vấn đề này.",
        en: "Please review this matter.",
      },
    ],
    canada_example: {
      context_vi: "Email cho văn phòng dịch vụ tại Canada.",
      context_en: "Email to a service office in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਮੇਰੀ ਅਰਜ਼ੀ ਤਿੰਨ ਹਫ਼ਤਿਆਂ ਤੋਂ ਲੰਬਿਤ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਸਥਿਤੀ ਬਾਰੇ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਬੇਨਤੀ ਕਰਦੀ ਹਾਂ।",
      rom: "Canada vich meri arzi tinn haftian ton lambit hai, is lai main sthiti bare spashtikaran di benati kardi han.",
      vi: "Tại Canada, hồ sơ của tôi đã chờ ba tuần, vì vậy tôi xin được làm rõ tình trạng.",
      en: "In Canada, my application has been pending for three weeks, so I request clarification about the status.",
    },
    learner_traps_vi: [
      "Đừng chỉ phàn nàn mà không yêu cầu hành động.",
      "Đừng dùng giọng quá thân mật.",
    ],
    learner_traps_en: [
      "Do not only complain without requesting action.",
      "Do not use an overly casual tone.",
    ],
  },
  {
    id: "pa_c1_journey_source_summary",
    level: "C1",
    stage: "source_summary",
    readiness: "build",
    title_pa: "ਸਰੋਤਾਂ ਨੂੰ ਨਿਰਪੱਖ ਪੜ੍ਹਨਾ",
    title_rom: "sarotan nu nirpakh parhna",
    title_vi: "Đọc nguồn trung lập",
    title_en: "Read sources neutrally",
    learner_outcome: {
      pa: "ਮੈਂ ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ, ਸਬੂਤ ਅਤੇ ਨਤੀਜਾ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸੰਖੇਪ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
      rom: "main sarot da mukh daava, sabut ate natija apne shabdan vich sankhep kar sakda/sakdi han.",
      vi: "Tôi có thể tóm tắt claim chính, bằng chứng và kết luận của nguồn bằng lời của mình.",
      en: "I can summarize a source's main claim, evidence, and conclusion in my own words.",
    },
    handoff_vi: "Sau bước này, dùng summary để tạo claim thận trọng.",
    handoff_en: "After this step, use the summary to build cautious claims.",
    checkpoint_task: {
      pa: "ਇੱਕ ਛੋਟੇ ਸਰੋਤ ਦਾ ਤਿੰਨ ਵਾਕਾਂ ਵਿੱਚ ਸਾਰ ਲਿਖੋ।",
      rom: "ikk chhote sarot da tinn vakan vich saar likho.",
      vi: "Viết summary ba câu cho một nguồn ngắn.",
      en: "Write a three-sentence summary of a short source.",
    },
    readiness_evidence_vi: [
      "Không thêm opinion.",
      "Claim chính đứng trước chi tiết.",
      "Giữ đúng mức chắc chắn của nguồn.",
    ],
    readiness_evidence_en: [
      "Adds no opinion.",
      "Main claim comes before details.",
      "Preserves the source's certainty level.",
    ],
    support_language: [
      {
        pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "sarot da mukh daava ih hai ki ...",
        vi: "Claim chính của nguồn là...",
        en: "The source's main claim is that...",
      },
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ, ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ...",
        rom: "sankhep vich, sarot sujhaounda hai ki ...",
        vi: "Tóm lại, nguồn gợi ý rằng...",
        en: "In summary, the source suggests that...",
      },
    ],
    canada_example: {
      context_vi: "Summary nguồn sinh viên tại Canada.",
      context_en: "Summary of a student source in Canada.",
      pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ ਖੋਜ-ਲੇਖ ਦੀ ਯੋਜਨਾ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।",
      rom: "sarot sujhaounda hai ki Canada vich vidyarthi sahaita kendar khoj-lekh di yojna vich madad kar sakde han.",
      vi: "Nguồn gợi ý rằng tại Canada, trung tâm hỗ trợ sinh viên có thể giúp lập kế hoạch bài nghiên cứu.",
      en: "The source suggests that in Canada, student support centres may help with research-paper planning.",
    },
    learner_traps_vi: [
      "Đừng thêm 'tôi nghĩ'.",
      "Đừng dịch từng câu nếu mất cấu trúc summary.",
    ],
    learner_traps_en: [
      "Do not add 'I think'.",
      "Do not translate sentence by sentence if summary structure is lost.",
    ],
  },
  {
    id: "pa_c1_journey_cautious_claims",
    level: "C1",
    stage: "cautious_claims",
    readiness: "bridge",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵੇ ਬਣਾਉਣਾ",
    title_rom: "savdhan daave banauna",
    title_vi: "Tạo claim thận trọng",
    title_en: "Build cautious claims",
    learner_outcome: {
      pa: "ਮੈਂ ਸੀਮਿਤ ਸਬੂਤ ਦੇ ਆਧਾਰ ਤੇ ਹੱਦ ਅਤੇ ਸ਼ਰਤ ਵਾਲਾ ਦਾਅਵਾ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
      rom: "main simit sabut de adhar te hadd ate sharat vala daava kar sakda/sakdi han.",
      vi: "Tôi có thể tạo claim có giới hạn và điều kiện dựa trên bằng chứng hạn chế.",
      en: "I can make a scoped and conditional claim based on limited evidence.",
    },
    handoff_vi: "Sau bước này, so sánh evidence để chọn claim phù hợp.",
    handoff_en: "After this step, compare evidence to choose the right claim.",
    checkpoint_task: {
      pa: "ਬਹੁਤ ਪੱਕੇ ਦਾਅਵੇ ਨੂੰ ਸਾਵਧਾਨ ਦਾਅਵੇ ਵਿੱਚ ਬਦਲੋ।",
      rom: "bahut pakke daave nu savdhan daave vich badlo.",
      vi: "Chuyển claim quá chắc chắn thành claim thận trọng.",
      en: "Turn an overly certain claim into a cautious claim.",
    },
    readiness_evidence_vi: [
      "Có hedge đúng mức.",
      "Có phạm vi áp dụng.",
      "Vẫn giữ stance rõ.",
    ],
    readiness_evidence_en: [
      "Uses appropriate hedging.",
      "Includes scope of application.",
      "Still keeps a clear stance.",
    ],
    support_language: [
      {
        pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ...",
        rom: "uplabdh jankari de adhar te, ...",
        vi: "Dựa trên thông tin hiện có,...",
        en: "Based on the available information,...",
      },
      {
        pa: "ਇਸ ਦਾਅਵੇ ਦੀ ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is daave di ikk sima ih hai ki ...",
        vi: "Một giới hạn của claim này là...",
        en: "One limitation of this claim is that...",
      },
    ],
    canada_example: {
      context_vi: "Claim thận trọng về dịch vụ tại Canada.",
      context_en: "Cautious claim about services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਆਨਲਾਈਨ ਸੇਵਾਵਾਂ ਕੁਝ ਵਸਨੀਕਾਂ ਲਈ ਪਹੁੰਚ ਸੁਧਾਰ ਸਕਦੀਆਂ ਹਨ।",
      rom: "Canada vich online sevavan kujh vasnikan lai pahunch sudhar sakdian han.",
      vi: "Tại Canada, dịch vụ trực tuyến có thể cải thiện khả năng tiếp cận cho một số cư dân.",
      en: "In Canada, online services may improve access for some residents.",
    },
    learner_traps_vi: [
      "Đừng dùng 'chứng minh' khi dữ liệu chỉ gợi ý.",
      "Đừng hedge quá nhiều đến mức không còn stance.",
    ],
    learner_traps_en: [
      "Do not use 'proves' when data only suggests.",
      "Do not hedge so much that no stance remains.",
    ],
  },
  {
    id: "pa_c1_journey_evidence_comparison",
    level: "C1",
    stage: "evidence_comparison",
    readiness: "bridge",
    title_pa: "ਸਬੂਤਾਂ ਦੀ ਤੁਲਨਾ",
    title_rom: "sabutan di tulna",
    title_vi: "So sánh bằng chứng",
    title_en: "Compare evidence",
    learner_outcome: {
      pa: "ਮੈਂ ਦੋ ਸਰੋਤਾਂ ਦੀ ਮਜ਼ਬੂਤੀ, ਸੀਮਾ ਅਤੇ ਦਲੀਲ ਨਾਲ ਸੰਬੰਧ ਦੀ ਤੁਲਨਾ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
      rom: "main do sarotan di mazbuti, sima ate daleel nal sambandh di tulna kar sakda/sakdi han.",
      vi: "Tôi có thể so sánh độ mạnh, giới hạn và mức liên quan của hai nguồn với lập luận.",
      en: "I can compare two sources by strength, limitation, and relevance to the argument.",
    },
    handoff_vi: "Sau bước này, dùng academic register để viết synthesis.",
    handoff_en: "After this step, use academic register to write synthesis.",
    checkpoint_task: {
      pa: "ਸਰਵੇਖਣ ਅਤੇ ਰਿਪੋਰਟ ਦੇ ਸਬੂਤ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
      rom: "sarvekhan ate report de sabut di tulna karo.",
      vi: "So sánh evidence từ khảo sát và báo cáo.",
      en: "Compare evidence from a survey and a report.",
    },
    readiness_evidence_vi: [
      "Có tiêu chí so sánh.",
      "Có strength và limitation.",
      "Kết luận phù hợp với claim.",
    ],
    readiness_evidence_en: [
      "Has a comparison criterion.",
      "Has strength and limitation.",
      "Conclusion fits the claim.",
    ],
    support_language: [
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
      context_vi: "So sánh nguồn ở Canada.",
      context_en: "Comparing sources in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਰਵੇਖਣ ਵਿਦਿਆਰਥੀ ਅਨੁਭਵ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਰਿਪੋਰਟ ਸੇਵਾ ਦੀ ਵਰਤੋਂ ਬਾਰੇ ਅੰਕੜੇ ਦਿੰਦੀ ਹੈ।",
      rom: "Canada vich sarvekhan vidyarthi anubhav dikhaounda hai, jadki report seva di varton bare ankde dindi hai.",
      vi: "Ở Canada, khảo sát cho thấy trải nghiệm sinh viên, trong khi báo cáo cung cấp số liệu sử dụng dịch vụ.",
      en: "In Canada, a survey shows student experience, whereas a report gives service-use data.",
    },
    learner_traps_vi: [
      "Đừng so sánh chỉ bằng độ dài.",
      "Đừng bỏ qua limitation của nguồn bạn thích hơn.",
    ],
    learner_traps_en: [
      "Do not compare only by length.",
      "Do not ignore the limitation of the source you prefer.",
    ],
  },
  {
    id: "pa_c1_journey_academic_register",
    level: "C1",
    stage: "academic_register",
    readiness: "bridge",
    title_pa: "ਅਕਾਦਮਿਕ ਲਹਿਜ਼ੇ ਵਿੱਚ ਜੋੜਨਾ",
    title_rom: "academic lehje vich jorna",
    title_vi: "Kết nối bằng register học thuật",
    title_en: "Connect in academic register",
    learner_outcome: {
      pa: "ਮੈਂ ਸਰੋਤਾਂ ਨੂੰ ਤਟਸਥ ਅਕਾਦਮਿਕ ਲਹਿਜ਼ੇ ਵਿੱਚ ਜੋੜ ਕੇ ਸੰਤੁਲਿਤ ਨਤੀਜਾ ਦੇ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
      rom: "main sarotan nu tatasth academic lehje vich jor ke santulit natija de sakda/sakdi han.",
      vi: "Tôi có thể nối nguồn bằng register học thuật trung lập và đưa kết luận cân bằng.",
      en: "I can connect sources in neutral academic register and give a balanced conclusion.",
    },
    handoff_vi: "Sau bước này, chuyển sang presentation response hoặc integrated capstone.",
    handoff_en: "After this step, move to presentation response or integrated capstone.",
    checkpoint_task: {
      pa: "ਦੋ ਸਰੋਤਾਂ ਨੂੰ ਜੋੜਦਾ ਇੱਕ ਅਕਾਦਮਿਕ ਪੈਰਾ ਲਿਖੋ।",
      rom: "do sarotan nu jorda ikk academic para likho.",
      vi: "Viết một đoạn học thuật nối hai nguồn.",
      en: "Write an academic paragraph connecting two sources.",
    },
    readiness_evidence_vi: [
      "Tone trung lập.",
      "Có transition logic.",
      "Có synthesis, không chỉ hai summary.",
    ],
    readiness_evidence_en: [
      "Neutral tone.",
      "Has logical transition.",
      "Has synthesis, not only two summaries.",
    ],
    support_language: [
      {
        pa: "ਦੋਵੇਂ ਸਰੋਤ ... ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ...",
        rom: "dovein sarot ... bare chintat han, par ...",
        vi: "Cả hai nguồn đều quan tâm đến..., nhưng...",
        en: "Both sources are concerned with..., but...",
      },
      {
        pa: "ਇਸ ਲਈ ਸੰਤੁਲਿਤ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is lai santulit natija ih hai ki ...",
        vi: "Vì vậy, kết luận cân bằng là...",
        en: "Therefore, the balanced conclusion is that...",
      },
    ],
    canada_example: {
      context_vi: "Synthesis học thuật tại Canada.",
      context_en: "Academic synthesis in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਦੋਵੇਂ ਸਰੋਤ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ਉਹ ਵੱਖ-ਵੱਖ ਸੇਵਾਵਾਂ ਤੇ ਜ਼ੋਰ ਦਿੰਦੇ ਹਨ।",
      rom: "Canada vich dovein sarot vidyarthi sahaita bare chintat han, par oh vakh-vakh sevavan te zor dinde han.",
      vi: "Tại Canada, cả hai nguồn đều quan tâm đến hỗ trợ sinh viên, nhưng nhấn mạnh các dịch vụ khác nhau.",
      en: "In Canada, both sources are concerned with student support, but emphasize different services.",
    },
    learner_traps_vi: [
      "Đừng dùng văn nói thân mật.",
      "Đừng chỉ đặt hai summary cạnh nhau.",
    ],
    learner_traps_en: [
      "Do not use casual speech.",
      "Do not only place two summaries side by side.",
    ],
  },
  {
    id: "pa_c1_journey_presentation_response",
    level: "C1",
    stage: "presentation_response",
    readiness: "handoff",
    title_pa: "ਪ੍ਰਸਤੁਤੀ ਤੋਂ ਬਾਅਦ ਜਵਾਬ",
    title_rom: "prastuti ton baad jawab",
    title_vi: "Trả lời sau thuyết trình",
    title_en: "Respond after a presentation",
    learner_outcome: {
      pa: "ਮੈਂ ਔਖੇ ਸਵਾਲ ਨੂੰ ਮੰਨ ਕੇ ਸੀਮਾ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
      rom: "main aukhe sawal nu mann ke sima ate agla kadam spasht kar sakda/sakdi han.",
      vi: "Tôi có thể công nhận câu hỏi khó, nêu giới hạn và làm rõ bước tiếp theo.",
      en: "I can acknowledge a difficult question, state a limitation, and clarify the next step.",
    },
    handoff_vi: "Bước này chuyển người học vào integrated speaking/writing capstone.",
    handoff_en: "This step hands the learner into the integrated speaking/writing capstone.",
    checkpoint_task: {
      pa: "ਖਰਚੇ ਬਾਰੇ ਔਖੇ ਸਵਾਲ ਦਾ 45 ਸਕਿੰਟ ਦਾ ਜਵਾਬ ਦਿਓ।",
      rom: "kharche bare aukhe sawal da 45 second da jawab dio.",
      vi: "Trả lời 45 giây cho câu hỏi khó về chi phí.",
      en: "Give a 45-second answer to a difficult cost question.",
    },
    readiness_evidence_vi: [
      "Acknowledge câu hỏi.",
      "Nêu limitation nếu thiếu data.",
      "Có next step.",
    ],
    readiness_evidence_en: [
      "Acknowledges the question.",
      "States limitation if data is missing.",
      "Has a next step.",
    ],
    support_language: [
      {
        pa: "ਇਹ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ।",
        rom: "ih mahatvapuran sawal hai.",
        vi: "Đây là câu hỏi quan trọng.",
        en: "This is an important question.",
      },
      {
        pa: "ਇਸ ਵੇਲੇ ਪੂਰਾ ਖਰਚਾ ਸਪਸ਼ਟ ਨਹੀਂ, ਪਰ ...",
        rom: "is vele pura kharcha sapashat nahi, par ...",
        vi: "Hiện toàn bộ chi phí chưa rõ, nhưng...",
        en: "At this stage, the full cost is not clear, but...",
      },
    ],
    canada_example: {
      context_vi: "Q&A seminar tại Canada.",
      context_en: "Seminar Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਇਸ ਪ੍ਰਸਤਾਵ ਲਈ ਪੂਰਾ ਖਰਚਾ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ, ਪਰ ਪਹਿਲਾ ਕਦਮ ਪਾਇਲਟ ਪ੍ਰੋਗਰਾਮ ਦੀ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
      rom: "Canada vich is prastav lai pura kharcha aje sapashat nahi, par pahila kadam pilot program di samikhia hovegi.",
      vi: "Tại Canada, toàn bộ chi phí cho đề xuất này chưa rõ, nhưng bước đầu sẽ là xem xét chương trình thí điểm.",
      en: "In Canada, the full cost of this proposal is not yet clear, but the first step will be a pilot-program review.",
    },
    learner_traps_vi: [
      "Đừng né câu hỏi bằng cách lặp slide.",
      "Đừng giả vờ biết số liệu.",
    ],
    learner_traps_en: [
      "Do not avoid the question by repeating slides.",
      "Do not pretend to know figures.",
    ],
  },
  {
    id: "pa_c1_journey_public_service_text",
    level: "C1",
    stage: "public_service_text",
    readiness: "handoff",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਪਾਠ ਸੰਭਾਲਣਾ",
    title_rom: "jantak seva path sambhalna",
    title_vi: "Xử lý văn bản dịch vụ công",
    title_en: "Handle public-service text",
    learner_outcome: {
      pa: "ਮੈਂ ਨੋਟਿਸ ਤੋਂ action, eligibility ਅਤੇ deadline ਕੱਢ ਕੇ ਸਪਸ਼ਟ ਜਵਾਬ ਲਿਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
      rom: "main notice ton action, eligibility ate deadline kadd ke spasht jawab likh sakda/sakdi han.",
      vi: "Tôi có thể rút ra action, điều kiện đủ và hạn chót từ thông báo rồi viết phản hồi rõ.",
      en: "I can extract action, eligibility, and deadline from a notice and write a clear response.",
    },
    handoff_vi: "Bước này nối public-service reading với professional writing.",
    handoff_en: "This step connects public-service reading with professional writing.",
    checkpoint_task: {
      pa: "ਨੋਟਿਸ ਪੜ੍ਹ ਕੇ ਸਪਸ਼ਟੀਕਰਨ ਲਈ ਜਵਾਬ ਲਿਖੋ।",
      rom: "notice parh ke spashtikaran lai jawab likho.",
      vi: "Đọc notice và viết phản hồi xin làm rõ.",
      en: "Read a notice and write a response asking for clarification.",
    },
    readiness_evidence_vi: [
      "Không nhầm deadline với start date.",
      "Không bỏ điều kiện.",
      "Clarification cụ thể.",
    ],
    readiness_evidence_en: [
      "Does not confuse deadline with start date.",
      "Does not omit conditions.",
      "Specific clarification.",
    ],
    support_language: [
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
      context_vi: "Thông báo trung tâm cộng đồng ở Canada.",
      context_en: "Community-centre notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀਆਂ ਕਲਾਸਾਂ ਲਈ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਹੋਵੇਗੀ।",
      rom: "Canada vich community kendar dian classan lai navi registration prakiria hovegi.",
      vi: "Ở Canada, sẽ có quy trình đăng ký mới cho các lớp tại trung tâm cộng đồng.",
      en: "In Canada, community-centre classes will have a new registration process.",
    },
    learner_traps_vi: [
      "Đừng bỏ qua điều kiện áp dụng.",
      "Đừng biến clarification thành complaint.",
    ],
    learner_traps_en: [
      "Do not ignore eligibility conditions.",
      "Do not turn clarification into a complaint.",
    ],
  },
  {
    id: "pa_c1_journey_professional_text",
    level: "C1",
    stage: "professional_text",
    readiness: "handoff",
    title_pa: "ਪੇਸ਼ਾਵਰ ਅਪਡੇਟ ਨਾਲ ਸਮਾਪਤੀ",
    title_rom: "peshavar update nal samapti",
    title_vi: "Kết thúc bằng update chuyên nghiệp",
    title_en: "Finish with a professional update",
    learner_outcome: {
      pa: "ਮੈਂ status, risk ਅਤੇ next step ਵਾਲਾ ਸੰਖੇਪ ਪੇਸ਼ਾਵਰ ਅਪਡੇਟ ਲਿਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
      rom: "main status, risk ate next step vala sankhep peshavar update likh sakda/sakdi han.",
      vi: "Tôi có thể viết update chuyên nghiệp ngắn có status, risk và next step.",
      en: "I can write a concise professional update with status, risk, and next step.",
    },
    handoff_vi: "Đây là handoff cuối sang C1 capstone hoặc công việc thực tế.",
    handoff_en: "This is the final handoff into the C1 capstone or practical work.",
    checkpoint_task: {
      pa: "ਟੀਮ ਲਈ ਇੱਕ ਛੋਟਾ ਪ੍ਰੋਜੈਕਟ ਅਪਡੇਟ ਲਿਖੋ।",
      rom: "team lai ikk chhota project update likho.",
      vi: "Viết một update dự án ngắn cho nhóm.",
      en: "Write a short project update for the team.",
    },
    readiness_evidence_vi: [
      "Status xuất hiện sớm.",
      "Risk/limitation rõ.",
      "Next step cụ thể.",
    ],
    readiness_evidence_en: [
      "Status appears early.",
      "Risk/limitation is clear.",
      "Next step is specific.",
    ],
    support_language: [
      {
        pa: "ਮੌਜੂਦਾ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ...",
        rom: "maujuda sthiti ih hai ki ...",
        vi: "Tình trạng hiện tại là...",
        en: "The current status is that...",
      },
      {
        pa: "ਅਗਲਾ ਕਦਮ ... ਹੋਵੇਗਾ।",
        rom: "agla kadam ... hovega.",
        vi: "Bước tiếp theo sẽ là...",
        en: "The next step will be...",
      },
    ],
    canada_example: {
      context_vi: "Update dự án tại Canada.",
      context_en: "Project update in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਾਡੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਹੈ, ਪਰ ਅੰਕੜਿਆਂ ਦੀ ਜਾਂਚ ਹਾਲੇ ਬਾਕੀ ਹੈ।",
      rom: "Canada vich sade project lai pahila masoda tiar hai, par ankrian di janch hale baki hai.",
      vi: "Tại Canada, bản nháp đầu cho dự án đã sẵn sàng, nhưng việc kiểm tra số liệu vẫn còn.",
      en: "In Canada, the first project draft is ready, but data checking still remains.",
    },
    learner_traps_vi: [
      "Đừng viết update như essay dài.",
      "Đừng quên action owner nếu prompt có nêu.",
    ],
    learner_traps_en: [
      "Do not write an update like a long essay.",
      "Do not forget the action owner if the prompt includes one.",
    ],
  },
];
