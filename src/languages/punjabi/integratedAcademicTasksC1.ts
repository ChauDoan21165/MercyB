// Punjabi C1 integrated academic tasks for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiIntegratedTaskFocus =
  | "source_summary"
  | "evidence_comparison"
  | "cautious_claim"
  | "formal_writing"
  | "presentation_response"
  | "public_professional_text";

export type PunjabiIntegratedTaskRoute = "capstone_ready" | "review_then_try" | "targeted_practice";

export type PunjabiIntegratedPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiIntegratedAcademicTaskC1 = {
  id: string;
  level: "C1";
  focus: PunjabiIntegratedTaskFocus;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  integrated_goal_vi: string;
  integrated_goal_en: string;
  input_brief: PunjabiIntegratedPhrase;
  required_moves_vi: readonly string[];
  required_moves_en: readonly string[];
  output_format_vi: string;
  output_format_en: string;
  route_if_weak: PunjabiIntegratedTaskRoute;
  routing_note_vi: string;
  routing_note_en: string;
  language_frames: readonly PunjabiIntegratedPhrase[];
  canada_example: PunjabiIntegratedPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const integratedAcademicTasksScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const integratedAcademicTasksC1: PunjabiIntegratedAcademicTaskC1[] = [
  {
    id: "pa_c1_integrated_source_summary",
    level: "C1",
    focus: "source_summary",
    title_pa: "ਸਰੋਤ ਤੋਂ ਸੰਖੇਪ ਅਤੇ ਜਵਾਬ",
    title_rom: "sarot ton sankhep ate jawab",
    title_vi: "Tóm tắt nguồn rồi phản hồi",
    title_en: "Summarize a source then respond",
    integrated_goal_vi: "Tóm tắt nguồn trung lập, sau đó thêm một phản hồi ngắn có giới hạn rõ.",
    integrated_goal_en: "Summarize the source neutrally, then add a short response with clear limits.",
    input_brief: {
      pa: "ਛੋਟਾ ਸਰੋਤ ਪੜ੍ਹੋ: ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ ਲਿਖਣ ਦੀ ਯੋਜਨਾ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।",
      rom: "chhota sarot parho: vidyarthi sahaita kendar likhan di yojna vich madad kar sakde han.",
      vi: "Đọc nguồn ngắn: trung tâm hỗ trợ sinh viên có thể giúp lập kế hoạch viết.",
      en: "Read a short source: student support centres may help with writing plans.",
    },
    required_moves_vi: [
      "Nêu claim chính của nguồn.",
      "Nêu evidence hoặc lý do chính.",
      "Thêm phản hồi thận trọng, không biến summary thành opinion.",
    ],
    required_moves_en: [
      "State the source's main claim.",
      "State the key evidence or reason.",
      "Add a cautious response without turning the summary into opinion.",
    ],
    output_format_vi: "Summary 3 câu + response 2 câu.",
    output_format_en: "Three-sentence summary plus two-sentence response.",
    route_if_weak: "review_then_try",
    routing_note_vi: "Nếu summary lẫn opinion, ôn source summary trước khi thử lại.",
    routing_note_en: "If summary mixes with opinion, review source summary before retrying.",
    language_frames: [
      {
        pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "sarot da mukh daava ih hai ki ...",
        vi: "Claim chính của nguồn là...",
        en: "The source's main claim is that...",
      },
      {
        pa: "ਇਸ ਤੋਂ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ...",
        rom: "is ton pata lagda hai ki ...",
        vi: "Điều này cho thấy rằng...",
        en: "This suggests that...",
      },
      {
        pa: "ਫਿਰ ਵੀ, ਇਸ ਨਤੀਜੇ ਨੂੰ ... ਤੱਕ ਸੀਮਿਤ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "fir vi, is natije nu ... tak seemit rakhna chahida hai.",
        vi: "Tuy vậy, nên giới hạn kết luận này ở...",
        en: "Even so, this conclusion should be limited to...",
      },
    ],
    canada_example: {
      context_vi: "Nguồn về trung tâm hỗ trợ sinh viên tại Canada.",
      context_en: "Source about student support centres in Canada.",
      pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ ਖੋਜ-ਲੇਖ ਦੀ ਯੋਜਨਾ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।",
      rom: "sarot sujhaounda hai ki Canada vich vidyarthi sahaita kendar khoj-lekh di yojna vich madad kar sakde han.",
      vi: "Nguồn gợi ý rằng tại Canada, trung tâm hỗ trợ sinh viên có thể giúp lập kế hoạch bài nghiên cứu.",
      en: "The source suggests that in Canada, student support centres may help with research-paper planning.",
    },
    learner_traps_vi: [
      "Đừng thêm 'tôi nghĩ' vào phần summary.",
      "Đừng bỏ hedge nếu nguồn dùng 'có thể'.",
    ],
    learner_traps_en: [
      "Do not add 'I think' to the summary section.",
      "Do not drop hedging if the source uses 'may'.",
    ],
  },
  {
    id: "pa_c1_integrated_evidence_comparison",
    level: "C1",
    focus: "evidence_comparison",
    title_pa: "ਦੋ ਸਬੂਤਾਂ ਤੋਂ ਦਲੀਲ",
    title_rom: "do sabutan ton daleel",
    title_vi: "Lập luận từ hai bằng chứng",
    title_en: "Build an argument from two pieces of evidence",
    integrated_goal_vi: "So sánh hai nguồn rồi chọn nguồn phù hợp hơn cho một claim cụ thể.",
    integrated_goal_en: "Compare two sources and choose the better source for a specific claim.",
    input_brief: {
      pa: "ਇੱਕ ਸਰਵੇਖਣ ਅਨੁਭਵ ਦਿਖਾਉਂਦਾ ਹੈ; ਇੱਕ ਰਿਪੋਰਟ ਸੇਵਾ ਵਰਤੋਂ ਦੇ ਅੰਕੜੇ ਦਿੰਦੀ ਹੈ।",
      rom: "ikk sarvekhan anubhav dikhaounda hai; ikk report seva varton de ankde dindi hai.",
      vi: "Một khảo sát cho thấy trải nghiệm; một báo cáo đưa số liệu sử dụng dịch vụ.",
      en: "A survey shows experience; a report gives service-use data.",
    },
    required_moves_vi: [
      "Nêu tiêu chí so sánh.",
      "Nêu strength và limitation của từng nguồn.",
      "Kết luận nguồn nào hỗ trợ claim nào tốt hơn.",
    ],
    required_moves_en: [
      "State the comparison criterion.",
      "State each source's strength and limitation.",
      "Conclude which source better supports which claim.",
    ],
    output_format_vi: "Đoạn 5-6 câu có comparison và conclusion.",
    output_format_en: "Five- to six-sentence paragraph with comparison and conclusion.",
    route_if_weak: "targeted_practice",
    routing_note_vi: "Nếu chỉ kể lại hai nguồn, luyện evidence comparison.",
    routing_note_en: "If the response only retells two sources, practice evidence comparison.",
    language_frames: [
      {
        pa: "ਪਹਿਲਾ ਸਰੋਤ ... ਲਈ ਵਧੇਰੇ ਲਾਭਕਾਰੀ ਹੈ।",
        rom: "pahila sarot ... lai vadhere labhkari hai.",
        vi: "Nguồn thứ nhất hữu ích hơn cho...",
        en: "The first source is more useful for...",
      },
      {
        pa: "ਦੂਜਾ ਸਰੋਤ ... ਬਾਰੇ ਵਧੇਰੇ ਸਥਿਰ ਸਬੂਤ ਦਿੰਦਾ ਹੈ।",
        rom: "duja sarot ... bare vadhere sthir sabut dinda hai.",
        vi: "Nguồn thứ hai đưa bằng chứng ổn định hơn về...",
        en: "The second source gives more stable evidence about...",
      },
      {
        pa: "ਇਸ ਕਰਕੇ claim ਲਈ ... ਵਧੇਰੇ ਉਚਿਤ ਹੈ।",
        rom: "is karke claim lai ... vadhere uchit hai.",
        vi: "Vì vậy, đối với claim này, ... phù hợp hơn.",
        en: "Therefore, for this claim, ... is more suitable.",
      },
    ],
    canada_example: {
      context_vi: "So sánh nguồn về dịch vụ sinh viên tại Canada.",
      context_en: "Comparing sources about student services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਰਵੇਖਣ ਵਿਦਿਆਰਥੀ ਅਨੁਭਵ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਰਿਪੋਰਟ ਸੇਵਾ ਦੀ ਵਰਤੋਂ ਬਾਰੇ ਅੰਕੜੇ ਦਿੰਦੀ ਹੈ।",
      rom: "Canada vich sarvekhan vidyarthi anubhav dikhaounda hai, jadki report seva di varton bare ankde dindi hai.",
      vi: "Ở Canada, khảo sát cho thấy trải nghiệm sinh viên, trong khi báo cáo cung cấp số liệu sử dụng dịch vụ.",
      en: "In Canada, a survey shows student experience, whereas a report gives service-use data.",
    },
    learner_traps_vi: [
      "Đừng so sánh chỉ bằng dài/ngắn.",
      "Đừng nói nguồn tốt hơn nếu chưa nêu claim cụ thể.",
    ],
    learner_traps_en: [
      "Do not compare only by length.",
      "Do not say a source is better without naming the specific claim.",
    ],
  },
  {
    id: "pa_c1_integrated_cautious_claim",
    level: "C1",
    focus: "cautious_claim",
    title_pa: "ਸੀਮਿਤ ਸਬੂਤ ਤੋਂ ਸਾਵਧਾਨ ਦਾਅਵਾ",
    title_rom: "simit sabut ton savdhan daava",
    title_vi: "Claim thận trọng từ bằng chứng hạn chế",
    title_en: "Cautious claim from limited evidence",
    integrated_goal_vi: "Dùng nguồn ngắn và limitation để viết claim có phạm vi, điều kiện, và stance rõ.",
    integrated_goal_en: "Use a short source and limitation to write a claim with scope, condition, and clear stance.",
    input_brief: {
      pa: "ਛੋਟਾ ਸਰਵੇਖਣ ਕੁਝ ਲਾਭ ਦਿਖਾਉਂਦਾ ਹੈ, ਪਰ ਨਮੂਨਾ ਸੀਮਿਤ ਹੈ।",
      rom: "chhota sarvekhan kujh labh dikhaounda hai, par namuna simit hai.",
      vi: "Một khảo sát nhỏ cho thấy một số lợi ích, nhưng mẫu còn hạn chế.",
      en: "A small survey shows some benefits, but the sample is limited.",
    },
    required_moves_vi: [
      "Nêu evidence ngắn.",
      "Nêu limitation của mẫu.",
      "Viết claim thận trọng không mất stance.",
    ],
    required_moves_en: [
      "State the evidence briefly.",
      "State the sample limitation.",
      "Write a cautious claim without losing stance.",
    ],
    output_format_vi: "Đoạn 4 câu: evidence, limitation, cautious claim, next data need.",
    output_format_en: "Four-sentence paragraph: evidence, limitation, cautious claim, next data need.",
    route_if_weak: "targeted_practice",
    routing_note_vi: "Nếu claim quá chắc hoặc quá mơ hồ, luyện cautious claims.",
    routing_note_en: "If the claim is too certain or too vague, practice cautious claims.",
    language_frames: [
      {
        pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ...",
        rom: "uplabdh jankari de adhar te, ...",
        vi: "Dựa trên thông tin hiện có,...",
        en: "Based on the available information,...",
      },
      {
        pa: "ਇਸ ਦੀ ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is di ikk sima ih hai ki ...",
        vi: "Một giới hạn của điều này là...",
        en: "One limitation of this is that...",
      },
      {
        pa: "ਹੋਰ ਅੰਕੜਿਆਂ ਤੋਂ ਬਿਨਾਂ, ਇਸ ਦਾਅਵੇ ਨੂੰ ... ਤੱਕ ਸੀਮਿਤ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "hor ankrian ton bina, is daave nu ... tak simit rakhna chahida hai.",
        vi: "Nếu không có thêm số liệu, nên giới hạn claim này ở...",
        en: "Without more data, this claim should be limited to...",
      },
    ],
    canada_example: {
      context_vi: "Claim thận trọng về dịch vụ buổi tối tại Canada.",
      context_en: "Cautious claim about evening services in Canada.",
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ਕੈਨੇਡਾ ਵਿੱਚ ਸ਼ਾਮ ਦੀਆਂ ਸੇਵਾਵਾਂ ਕੁਝ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀਆਂ ਹਨ।",
      rom: "uplabdh jankari de adhar te, Canada vich sham dian sevavan kujh vidyarthian lai labhdayak ho sakdian han.",
      vi: "Dựa trên thông tin hiện có, tại Canada dịch vụ buổi tối có thể hữu ích cho một số sinh viên.",
      en: "Based on the available information, evening services in Canada may be useful for some students.",
    },
    learner_traps_vi: [
      "Đừng viết 'chứng minh' khi mẫu nhỏ.",
      "Đừng hedge quá nhiều đến mức không còn kết luận.",
    ],
    learner_traps_en: [
      "Do not write 'proves' when the sample is small.",
      "Do not hedge so much that no conclusion remains.",
    ],
  },
  {
    id: "pa_c1_integrated_formal_public_response",
    level: "C1",
    focus: "formal_writing",
    title_pa: "ਨੋਟਿਸ ਤੋਂ ਰਸਮੀ ਜਵਾਬ",
    title_rom: "notice ton rasmi jawab",
    title_vi: "Từ thông báo đến phản hồi trang trọng",
    title_en: "From notice to formal response",
    integrated_goal_vi: "Đọc notice dịch vụ công rồi viết phản hồi trang trọng xin làm rõ.",
    integrated_goal_en: "Read a public-service notice and write a formal clarification response.",
    input_brief: {
      pa: "ਨੋਟਿਸ ਕਹਿੰਦਾ ਹੈ ਕਿ ਅਗਲੇ ਮਹੀਨੇ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਲਾਗੂ ਹੋਵੇਗੀ।",
      rom: "notice kehnda hai ki agle mahine navi registration prakiria lagu hovegi.",
      vi: "Thông báo nói rằng từ tháng tới quy trình đăng ký mới sẽ áp dụng.",
      en: "The notice says a new registration process will apply next month.",
    },
    required_moves_vi: [
      "Tóm tắt nội dung notice.",
      "Nêu câu hỏi clarification cụ thể.",
      "Dùng tone trang trọng, không complaint quá mức.",
    ],
    required_moves_en: [
      "Summarize the notice content.",
      "Ask a specific clarification question.",
      "Use formal tone without over-complaining.",
    ],
    output_format_vi: "Email 120-150 từ hoặc đoạn formal response.",
    output_format_en: "120-150 word email or formal response paragraph.",
    route_if_weak: "review_then_try",
    routing_note_vi: "Nếu nhầm notice, quay lại public-service text handling.",
    routing_note_en: "If the notice is misunderstood, return to public-service text handling.",
    language_frames: [
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
      {
        pa: "ਤੁਹਾਡੇ ਸਮੇਂ ਅਤੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ।",
        rom: "tuhade same ate sahiyog lai dhanvad.",
        vi: "Cảm ơn thời gian và sự hỗ trợ của quý vị.",
        en: "Thank you for your time and support.",
      },
    ],
    canada_example: {
      context_vi: "Phản hồi thông báo trung tâm cộng đồng ở Canada.",
      context_en: "Responding to a community-centre notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀਆਂ ਕਲਾਸਾਂ ਲਈ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਕਿਰਪਾ ਕਰਕੇ ਹੋਰ ਜਾਣਕਾਰੀ ਦਿਓ।",
      rom: "Canada vich community kendar dian classan lai navi registration prakiria bare kirpa karke hor jankari dio.",
      vi: "Xin vui lòng cung cấp thêm thông tin về quy trình đăng ký mới cho lớp tại trung tâm cộng đồng ở Canada.",
      en: "Please provide more information about the new registration process for community-centre classes in Canada.",
    },
    learner_traps_vi: [
      "Đừng bỏ qua nội dung notice trước khi hỏi.",
      "Đừng claim quyền lợi pháp lý không có trong prompt.",
    ],
    learner_traps_en: [
      "Do not skip the notice content before asking.",
      "Do not claim legal rights not stated in the prompt.",
    ],
  },
  {
    id: "pa_c1_integrated_presentation_qa",
    level: "C1",
    focus: "presentation_response",
    title_pa: "ਪ੍ਰਸਤੁਤੀ ਅਤੇ ਸਵਾਲ",
    title_rom: "prastuti ate sawal",
    title_vi: "Thuyết trình và trả lời câu hỏi",
    title_en: "Presentation and question response",
    integrated_goal_vi: "Nêu argument ngắn rồi trả lời câu hỏi khó với limitation và next step.",
    integrated_goal_en: "Give a short argument and answer a difficult question with limitation and next step.",
    input_brief: {
      pa: "ਵਿਸ਼ਾ: ਸ਼ਾਮ ਦੀਆਂ ਲਾਇਬ੍ਰੇਰੀ ਸੇਵਾਵਾਂ ਵਧਾਈਆਂ ਜਾਣ ਜਾਂ ਨਹੀਂ।",
      rom: "visha: sham dian library sevavan vadhaiyan jan ja nahi.",
      vi: "Chủ đề: có nên mở rộng dịch vụ thư viện buổi tối hay không.",
      en: "Topic: whether evening library services should be expanded.",
    },
    required_moves_vi: [
      "Nêu thesis ngắn.",
      "Nêu một evidence hoặc lý do.",
      "Trả lời câu hỏi về chi phí với giới hạn dữ liệu.",
    ],
    required_moves_en: [
      "State a short thesis.",
      "State one piece of evidence or reason.",
      "Answer a cost question with data limits.",
    ],
    output_format_vi: "Opening 45 giây + Q&A response 45 giây.",
    output_format_en: "45-second opening plus 45-second Q&A response.",
    route_if_weak: "targeted_practice",
    routing_note_vi: "Nếu trả lời né tránh, luyện presentation response.",
    routing_note_en: "If the answer avoids the question, practice presentation response.",
    language_frames: [
      {
        pa: "ਮੇਰੀ ਮੁੱਖ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ...",
        rom: "meri mukh daleel ih hai ki ...",
        vi: "Luận điểm chính của tôi là...",
        en: "My main argument is that...",
      },
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
      context_vi: "Thuyết trình về dịch vụ thư viện tại Canada.",
      context_en: "Presentation about library services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸ਼ਾਮ ਦੀਆਂ ਲਾਇਬ੍ਰੇਰੀ ਸੇਵਾਵਾਂ ਕੰਮਕਾਜੀ ਪਰਿਵਾਰਾਂ ਲਈ ਪਹੁੰਚ ਵਧਾ ਸਕਦੀਆਂ ਹਨ।",
      rom: "Canada vich sham dian library sevavan kamkaji parivaran lai pahunch vadha sakdian han.",
      vi: "Ở Canada, dịch vụ thư viện buổi tối có thể tăng khả năng tiếp cận cho gia đình đi làm.",
      en: "In Canada, evening library services may increase access for working families.",
    },
    learner_traps_vi: [
      "Đừng lặp slide thay vì trả lời câu hỏi.",
      "Đừng giả vờ biết chi phí nếu prompt không cho số liệu.",
    ],
    learner_traps_en: [
      "Do not repeat slides instead of answering the question.",
      "Do not pretend to know costs if the prompt gives no figures.",
    ],
  },
  {
    id: "pa_c1_integrated_professional_update",
    level: "C1",
    focus: "public_professional_text",
    title_pa: "ਮੀਟਿੰਗ ਨੋਟ ਤੋਂ ਅਪਡੇਟ",
    title_rom: "meeting note ton update",
    title_vi: "Từ ghi chú họp đến update",
    title_en: "From meeting notes to an update",
    integrated_goal_vi: "Chuyển meeting note thành professional update có status, risk, next step.",
    integrated_goal_en: "Turn meeting notes into a professional update with status, risk, and next step.",
    input_brief: {
      pa: "ਮੀਟਿੰਗ ਵਿੱਚ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਦੱਸਿਆ ਗਿਆ, ਪਰ ਅੰਕੜਿਆਂ ਦੀ ਜਾਂਚ ਬਾਕੀ ਹੈ।",
      rom: "meeting vich pahila masoda tiar dassia gia, par ankrian di janch baki hai.",
      vi: "Trong cuộc họp, bản nháp đầu đã sẵn sàng, nhưng việc kiểm tra số liệu vẫn còn.",
      en: "In the meeting, the first draft was reported ready, but data checking remains.",
    },
    required_moves_vi: [
      "Nêu status hiện tại.",
      "Nêu risk hoặc limitation.",
      "Đưa next step/action owner nếu có.",
    ],
    required_moves_en: [
      "State current status.",
      "State risk or limitation.",
      "Give next step or action owner if available.",
    ],
    output_format_vi: "Professional update 80-120 từ.",
    output_format_en: "80-120 word professional update.",
    route_if_weak: "capstone_ready",
    routing_note_vi: "Nếu chỉ còn lỗi nhỏ, có thể vào capstone và sửa trong feedback.",
    routing_note_en: "If only minor errors remain, proceed to capstone and refine in feedback.",
    language_frames: [
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
        pa: "ਅਗਲਾ ਕਦਮ ... ਹੋਵੇਗਾ।",
        rom: "agla kadam ... hovega.",
        vi: "Bước tiếp theo sẽ là...",
        en: "The next step will be...",
      },
    ],
    canada_example: {
      context_vi: "Update dự án tại Canada.",
      context_en: "Project update in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਾਡੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਹੈ, ਪਰ ਜਨਤਕ ਸੇਵਾ ਸੰਬੰਧੀ ਅੰਕੜਿਆਂ ਦੀ ਜਾਂਚ ਹਾਲੇ ਬਾਕੀ ਹੈ।",
      rom: "Canada vich sade project lai pahila masoda tiar hai, par jantak seva sambandhi ankrian di janch hale baki hai.",
      vi: "Tại Canada, bản nháp đầu cho dự án của chúng ta đã sẵn sàng, nhưng việc kiểm tra số liệu về dịch vụ công vẫn còn.",
      en: "In Canada, the first draft for our project is ready, but checking public-service data still remains.",
    },
    learner_traps_vi: [
      "Đừng viết update như essay dài.",
      "Đừng quên next step cụ thể.",
    ],
    learner_traps_en: [
      "Do not write an update like a long essay.",
      "Do not forget the specific next step.",
    ],
  },
];
