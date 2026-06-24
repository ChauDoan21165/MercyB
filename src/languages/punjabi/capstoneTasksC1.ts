// Punjabi C1 capstone tasks for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiC1CapstoneSkill =
  | "summarize_source"
  | "present_argument"
  | "compare_evidence"
  | "cautious_claims"
  | "formal_writing"
  | "presentation_response"
  | "academic_text_handling"
  | "public_service_text_handling";

export type PunjabiC1CapstoneTaskType =
  | "summarize_source"
  | "present_argument"
  | "compare_evidence"
  | "cautious_claim"
  | "formal_writing"
  | "presentation_response"
  | "public_service_text"
  | "academic_text";

export type PunjabiC1CapstoneMode = "checkpoint" | "integrated_task" | "final_task";

export type PunjabiCapstonePhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiCapstoneTaskSource = {
  id: string;
  level: "C1";
  skill: PunjabiC1CapstoneSkill;
  mode: PunjabiC1CapstoneMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  task_goal_vi: string;
  task_goal_en: string;
  input_context: PunjabiCapstonePhrase;
  expected_output_vi: string;
  expected_output_en: string;
  success_criteria_vi: readonly string[];
  success_criteria_en: readonly string[];
  useful_frames: readonly PunjabiCapstonePhrase[];
  canada_example: PunjabiCapstonePhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export type PunjabiCapstoneTask = PunjabiCapstoneTaskSource & {
  task_type: PunjabiC1CapstoneTaskType;
  learner_goal_vi: string;
  learner_goal_en: string;
  source_prompt: PunjabiCapstonePhrase;
  response_frames: readonly PunjabiCapstonePhrase[];
  checkpoint: {
    skill_vi: string;
    skill_en: string;
    success_criteria_vi: readonly string[];
    success_criteria_en: readonly string[];
  };
  canada_scenario: PunjabiCapstonePhrase & {
    context_vi: string;
    context_en: string;
  };
};

export const capstoneTasksScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

const taskTypeBySkill: Record<PunjabiC1CapstoneSkill, PunjabiC1CapstoneTaskType> = {
  summarize_source: "summarize_source",
  present_argument: "present_argument",
  compare_evidence: "compare_evidence",
  cautious_claims: "cautious_claim",
  formal_writing: "formal_writing",
  presentation_response: "presentation_response",
  academic_text_handling: "academic_text",
  public_service_text_handling: "public_service_text",
};

const capstoneTaskSourcesC1: PunjabiCapstoneTaskSource[] = [
  {
    id: "pa_c1_capstone_summarize_source_checkpoint",
    level: "C1",
    skill: "summarize_source",
    mode: "checkpoint",
    title_pa: "ਸਰੋਤ ਦਾ ਸੰਖੇਪ ਸਾਰ",
    title_rom: "sarot da sankhep saar",
    title_vi: "Checkpoint: tóm tắt nguồn",
    title_en: "Checkpoint: source summary",
    task_goal_vi: "Tóm tắt claim, evidence, và implication của một nguồn ngắn mà không thêm ý kiến cá nhân.",
    task_goal_en: "Summarize the claim, evidence, and implication of a short source without adding personal opinion.",
    input_context: {
      pa: "ਸਰੋਤ ਕਹਿੰਦਾ ਹੈ ਕਿ ਲਚਕਦਾਰ ਦਫ਼ਤਰੀ ਸਮਾਂ ਕਰਮਚਾਰੀਆਂ ਦੀ ਉਤਪਾਦਕਤਾ ਵਧਾ ਸਕਦਾ ਹੈ।",
      rom: "sarot kehnda hai ki lachkdaar daftari sama karamcharian di utpadakta vadha sakda hai.",
      vi: "Nguồn nói rằng giờ làm linh hoạt có thể tăng năng suất nhân viên.",
      en: "The source says flexible office hours may increase employee productivity.",
    },
    expected_output_vi: "Một summary 3-4 câu, trung lập, có claim chính và bằng chứng chính.",
    expected_output_en: "A neutral 3-4 sentence summary with the main claim and key evidence.",
    success_criteria_vi: [
      "Không thêm đánh giá cá nhân.",
      "Nêu claim chính trước chi tiết.",
      "Dùng giọng thận trọng nếu nguồn chỉ nói may/có thể.",
    ],
    success_criteria_en: [
      "Does not add personal evaluation.",
      "States the main claim before details.",
      "Uses cautious tone if the source only says may/can.",
    ],
    useful_frames: [
      {
        pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "sarot da mukh daava ih hai ki ...",
        vi: "Luận điểm chính của nguồn là...",
        en: "The source's main claim is that...",
      },
      {
        pa: "ਇਸ ਦਾਅਵੇ ਲਈ ਸਰੋਤ ... ਦਾ ਸਬੂਤ ਦਿੰਦਾ ਹੈ।",
        rom: "is daave lai sarot ... da sabut dinda hai.",
        vi: "Nguồn đưa bằng chứng... cho claim này.",
        en: "The source gives evidence of ... for this claim.",
      },
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ, ਲੇਖਕ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ...",
        rom: "sankhep vich, lekhak sujhaounda hai ki ...",
        vi: "Tóm lại, tác giả gợi ý rằng...",
        en: "In summary, the writer suggests that...",
      },
    ],
    canada_example: {
      context_vi: "Tóm tắt nguồn về nơi làm việc tại Canada.",
      context_en: "Summarizing a source about workplaces in Canada.",
      pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਲਚਕਦਾਰ ਕੰਮ ਸਮਾਂ ਕੁਝ ਦਫ਼ਤਰੀ ਟੀਮਾਂ ਲਈ ਉਤਪਾਦਕਤਾ ਵਧਾ ਸਕਦਾ ਹੈ।",
      rom: "sarot sujhaounda hai ki Canada vich lachkdaar kam sama kujh daftari teaman lai utpadakta vadha sakda hai.",
      vi: "Nguồn gợi ý rằng tại Canada, giờ làm linh hoạt có thể tăng năng suất cho một số nhóm văn phòng.",
      en: "The source suggests that in Canada, flexible work hours may increase productivity for some office teams.",
    },
    learner_traps_vi: [
      "Đừng biến summary thành phản hồi cá nhân.",
      "Không dịch từng câu nếu điều đó làm mất cấu trúc claim-evidence.",
    ],
    learner_traps_en: [
      "Do not turn the summary into a personal response.",
      "Do not translate sentence by sentence if it loses claim-evidence structure.",
    ],
  },
  {
    id: "pa_c1_capstone_present_argument_final",
    level: "C1",
    skill: "present_argument",
    mode: "final_task",
    title_pa: "ਰਸਮੀ ਦਲੀਲ ਪੇਸ਼ ਕਰਨੀ",
    title_rom: "rasmi daleel pesh karni",
    title_vi: "Final task: trình bày lập luận",
    title_en: "Final task: present an argument",
    task_goal_vi: "Viết hoặc nói một lập luận có thesis, evidence, counterargument, và conclusion.",
    task_goal_en: "Write or deliver an argument with thesis, evidence, counterargument, and conclusion.",
    input_context: {
      pa: "ਵਿਸ਼ਾ: ਸ਼ਹਿਰੀ ਲਾਇਬ੍ਰੇਰੀਆਂ ਨੂੰ ਸ਼ਾਮ ਦੇ ਸਮੇਂ ਵਧਾਉਣੇ ਚਾਹੀਦੇ ਹਨ ਜਾਂ ਨਹੀਂ।",
      rom: "visha: shahiri libraryan nu sham de same vadhaune chahide han ja nahi.",
      vi: "Chủ đề: thư viện thành phố có nên mở thêm giờ buổi tối hay không.",
      en: "Topic: whether city libraries should extend evening hours.",
    },
    expected_output_vi: "Một bài/đoạn 180-220 từ hoặc bài nói 2 phút với cấu trúc rõ.",
    expected_output_en: "A 180-220 word text or two-minute talk with clear structure.",
    success_criteria_vi: [
      "Thesis rõ, không quá rộng.",
      "Ít nhất một bằng chứng được giải thích.",
      "Có phản biện được trình bày công bằng.",
      "Conclusion không thêm bằng chứng mới.",
    ],
    success_criteria_en: [
      "Clear thesis, not too broad.",
      "At least one explained piece of evidence.",
      "A fairly presented counterargument.",
      "Conclusion does not add new evidence.",
    ],
    useful_frames: [
      {
        pa: "ਮੇਰਾ ਮੁੱਖ ਤਰਕ ਇਹ ਹੈ ਕਿ ...",
        rom: "mera mukh tark ih hai ki ...",
        vi: "Luận điểm chính của tôi là...",
        en: "My main argument is that...",
      },
      {
        pa: "ਵਿਰੋਧੀ ਦ੍ਰਿਸ਼ਟੀਕੋਣ ਕਹਿ ਸਕਦਾ ਹੈ ਕਿ ..., ਪਰ ...",
        rom: "virodhi drishtikon kahi sakda hai ki ..., par ...",
        vi: "Quan điểm phản biện có thể nói rằng..., nhưng...",
        en: "An opposing view may argue that..., but...",
      },
      {
        pa: "ਸਾਰੇ ਤਰਕਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਦੇਖੀਏ ਤਾਂ ...",
        rom: "sare tarkan nu mila ke dekhiye tan ...",
        vi: "Khi xét các lập luận cùng nhau thì...",
        en: "Taken together, the arguments show that...",
      },
    ],
    canada_example: {
      context_vi: "Lập luận về thư viện công cộng ở Canada.",
      context_en: "Argument about public libraries in Canada.",
      pa: "ਮੇਰਾ ਮੁੱਖ ਤਰਕ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਸ਼ਹਿਰੀ ਲਾਇਬ੍ਰੇਰੀਆਂ ਨੂੰ ਸ਼ਾਮ ਦੇ ਸਮੇਂ ਵਧਾਉਣੇ ਚਾਹੀਦੇ ਹਨ, ਕਿਉਂਕਿ ਕੰਮਕਾਜੀ ਪਰਿਵਾਰਾਂ ਲਈ ਪਹੁੰਚ ਇਸ ਨਾਲ ਵਧਦੀ ਹੈ।",
      rom: "mera mukh tark ih hai ki Canada vich shahiri libraryan nu sham de same vadhaune chahide han, kyonki kamkaji parivaran lai pahunch is nal vadhdi hai.",
      vi: "Luận điểm chính của tôi là tại Canada, thư viện thành phố nên mở thêm giờ buổi tối vì điều này tăng khả năng tiếp cận cho gia đình đi làm.",
      en: "My main argument is that city libraries in Canada should extend evening hours because this improves access for working families.",
    },
    learner_traps_vi: [
      "Đừng chỉ liệt kê lý do; hãy giải thích mỗi lý do hỗ trợ thesis thế nào.",
      "Phản biện nên mạnh và công bằng, không phải straw man.",
    ],
    learner_traps_en: [
      "Do not only list reasons; explain how each supports the thesis.",
      "The counterargument should be strong and fair, not a straw man.",
    ],
  },
  {
    id: "pa_c1_capstone_compare_evidence_integrated",
    level: "C1",
    skill: "compare_evidence",
    mode: "integrated_task",
    title_pa: "ਦੋ ਸਬੂਤਾਂ ਦੀ ਤੁਲਨਾ",
    title_rom: "do sabutan di tulna",
    title_vi: "Integrated task: so sánh hai bằng chứng",
    title_en: "Integrated task: compare two pieces of evidence",
    task_goal_vi: "So sánh hai nguồn theo tiêu chí relevance, strength, và limitation.",
    task_goal_en: "Compare two sources by relevance, strength, and limitation.",
    input_context: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਵਿਦਿਆਰਥੀ ਸਰਵੇਖਣ ਹੈ; ਦੂਜਾ ਸਰੋਤ ਪ੍ਰਸ਼ਾਸਕੀ ਰਿਪੋਰਟ ਹੈ।",
      rom: "pahila sarot vidyarthi sarvekhan hai; duja sarot prashaski report hai.",
      vi: "Nguồn thứ nhất là khảo sát sinh viên; nguồn thứ hai là báo cáo hành chính.",
      en: "The first source is a student survey; the second source is an administrative report.",
    },
    expected_output_vi: "Một đoạn so sánh 5-6 câu nêu nguồn nào mạnh hơn cho claim nào.",
    expected_output_en: "A 5-6 sentence comparison stating which source is stronger for which claim.",
    success_criteria_vi: [
      "Nêu tiêu chí so sánh rõ.",
      "Có cả điểm mạnh và giới hạn.",
      "Không nói một nguồn luôn tốt hơn trong mọi trường hợp.",
    ],
    success_criteria_en: [
      "States a clear comparison criterion.",
      "Includes both strength and limitation.",
      "Does not say one source is always better in every context.",
    ],
    useful_frames: [
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
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਬਾਰੇ ਸਰਵੇਖਣ ਅਨੁਭਵ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਾਸਕੀ ਰਿਪੋਰਟ ਸੇਵਾ ਦੀ ਵਰਤੋਂ ਬਾਰੇ ਵਧੇਰੇ ਸਥਿਰ ਅੰਕੜੇ ਦਿੰਦੀ ਹੈ।",
      rom: "Canada vich vidyarthi sahaita bare sarvekhan anubhav dikhaounda hai, jadki prashaski report seva di varton bare vadhere sthir ankde dindi hai.",
      vi: "Về hỗ trợ sinh viên ở Canada, khảo sát cho thấy trải nghiệm, trong khi báo cáo hành chính đưa số liệu ổn định hơn về việc sử dụng dịch vụ.",
      en: "For student support in Canada, a survey shows experience, whereas an administrative report gives more stable data about service use.",
    },
    learner_traps_vi: [
      "Đừng so sánh chỉ bằng longer/shorter; cần tiêu chí học thuật.",
      "Không bỏ qua limitation của nguồn bạn thích hơn.",
    ],
    learner_traps_en: [
      "Do not compare only by longer/shorter; use an academic criterion.",
      "Do not ignore the limitation of the source you prefer.",
    ],
  },
  {
    id: "pa_c1_capstone_cautious_claims_checkpoint",
    level: "C1",
    skill: "cautious_claims",
    mode: "checkpoint",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵੇ ਬਣਾਉਣਾ",
    title_rom: "savdhan daave banauna",
    title_vi: "Checkpoint: tạo claim thận trọng",
    title_en: "Checkpoint: making cautious claims",
    task_goal_vi: "Chuyển claim quá chắc chắn thành claim C1 có điều kiện và mức độ.",
    task_goal_en: "Turn overly certain claims into C1 claims with conditions and degree.",
    input_context: {
      pa: "ਅਣਸਾਵਧਾਨ ਦਾਅਵਾ: ਇਹ ਨੀਤੀ ਹਮੇਸ਼ਾ ਸਫਲ ਹੁੰਦੀ ਹੈ।",
      rom: "ansavdhan daava: ih niti hamesha safal hundi hai.",
      vi: "Claim thiếu thận trọng: chính sách này luôn thành công.",
      en: "Uncautious claim: this policy always succeeds.",
    },
    expected_output_vi: "3 câu sửa lại bằng may, likely, based on available information, hoặc điều kiện rõ.",
    expected_output_en: "Three revised sentences using may, likely, based on available information, or clear conditions.",
    success_criteria_vi: [
      "Giảm absolutism như always, never.",
      "Nêu điều kiện hoặc phạm vi.",
      "Vẫn giữ lập trường, không trở nên mơ hồ.",
    ],
    success_criteria_en: [
      "Reduces absolutism such as always or never.",
      "States condition or scope.",
      "Keeps a position without becoming vague.",
    ],
    useful_frames: [
      {
        pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ...",
        rom: "uplabdh jankari de adhar te, ...",
        vi: "Dựa trên thông tin hiện có,...",
        en: "Based on the available information,...",
      },
      {
        pa: "ਇਹ ਰੁਝਾਨ ਸੰਭਵ ਤੌਰ ਤੇ ... ਨਾਲ ਜੁੜਿਆ ਹੈ।",
        rom: "ih rujhan sambhav taur te ... nal juria hai.",
        vi: "Xu hướng này có thể liên quan đến...",
        en: "This trend is likely connected to...",
      },
      {
        pa: "ਕੁਝ ਸਥਿਤੀਆਂ ਵਿੱਚ, ... ਲਾਭਕਾਰੀ ਹੋ ਸਕਦਾ ਹੈ।",
        rom: "kujh sthitian vich, ... labhkari ho sakda hai.",
        vi: "Trong một số tình huống,... có thể hữu ích.",
        en: "In some situations, ... may be useful.",
      },
    ],
    canada_example: {
      context_vi: "Sửa claim về chính sách dịch vụ trực tuyến ở Canada.",
      context_en: "Revising a claim about online-service policy in Canada.",
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ਕੈਨੇਡਾ ਵਿੱਚ ਆਨਲਾਈਨ ਸੇਵਾਵਾਂ ਕੁਝ ਵਸਨੀਕਾਂ ਲਈ ਪਹੁੰਚ ਸੁਧਾਰ ਸਕਦੀਆਂ ਹਨ।",
      rom: "uplabdh jankari de adhar te, Canada vich online sevavan kujh vasnikan lai pahunch sudhar sakdian han.",
      vi: "Dựa trên thông tin hiện có, tại Canada dịch vụ trực tuyến có thể cải thiện khả năng tiếp cận cho một số cư dân.",
      en: "Based on the available information, online services in Canada may improve access for some residents.",
    },
    learner_traps_vi: [
      "Hedge không phải là né tránh; nó làm claim chính xác hơn.",
      "Không dùng quá nhiều hedge đến mức câu không còn lập trường.",
    ],
    learner_traps_en: [
      "Hedging is not avoidance; it makes the claim more precise.",
      "Do not use so many hedges that the sentence has no stance.",
    ],
  },
  {
    id: "pa_c1_capstone_formal_writing_integrated",
    level: "C1",
    skill: "formal_writing",
    mode: "integrated_task",
    title_pa: "ਰਸਮੀ ਲਿਖਤ ਅਤੇ ਹੱਲ ਦੀ ਬੇਨਤੀ",
    title_rom: "rasmi likhat ate hall di benati",
    title_vi: "Integrated task: viết trang trọng và yêu cầu giải pháp",
    title_en: "Integrated task: formal writing and requested solution",
    task_goal_vi: "Viết email/trình bày vấn đề có context, evidence, impact, và requested action.",
    task_goal_en: "Write an email or statement with context, evidence, impact, and requested action.",
    input_context: {
      pa: "ਤੁਹਾਡੇ ਪ੍ਰੋਗਰਾਮ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਵੈਬਸਾਈਟ ਤਿੰਨ ਦਿਨ ਤੋਂ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।",
      rom: "tuhade program di registration website tinn din ton kam nahi kar rahi.",
      vi: "Trang đăng ký chương trình của bạn đã không hoạt động ba ngày.",
      en: "Your program registration website has not worked for three days.",
    },
    expected_output_vi: "Một email 120-160 từ, lịch sự nhưng chắc chắn.",
    expected_output_en: "A 120-160 word email, polite but firm.",
    success_criteria_vi: [
      "Có greeting và purpose rõ.",
      "Nêu bằng chứng thời gian/sự kiện.",
      "Nêu tác động thực tế.",
      "Yêu cầu hành động cụ thể.",
    ],
    success_criteria_en: [
      "Has greeting and clear purpose.",
      "States time/event evidence.",
      "States practical impact.",
      "Requests a specific action.",
    ],
    useful_frames: [
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
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਮਾਮਲੇ ਦੀ ਸਮੀਖਿਆ ਕਰਕੇ ...",
        rom: "kirpa karke is mamle di samikhia karke ...",
        vi: "Xin vui lòng xem xét vấn đề này và...",
        en: "Please review this matter and...",
      },
    ],
    canada_example: {
      context_vi: "Email về lỗi đăng ký chương trình cộng đồng tại Canada.",
      context_en: "Email about a registration issue for a community program in Canada.",
      pa: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਪ੍ਰੋਗਰਾਮ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਵੈਬਸਾਈਟ ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਤਿੰਨ ਦਿਨ ਤੋਂ ਫਾਰਮ ਜਮ੍ਹਾਂ ਨਹੀਂ ਹੋ ਰਿਹਾ।",
      rom: "main Canada vich community program di registration website bare apni chinta darj karvauna chahundi han, kyonki tinn din ton form jama nahi ho riha.",
      vi: "Tôi muốn ghi nhận quan ngại về trang đăng ký chương trình cộng đồng tại Canada vì ba ngày nay biểu mẫu không gửi được.",
      en: "I would like to register my concern about the registration website for a community program in Canada because the form has not submitted for three days.",
    },
    learner_traps_vi: [
      "Đừng dùng giọng giận dữ nếu mục tiêu là giải quyết hành chính.",
      "Yêu cầu cần cụ thể: sửa lỗi, xác nhận, hoặc gia hạn.",
    ],
    learner_traps_en: [
      "Do not use an angry tone if the goal is administrative resolution.",
      "The request should be specific: fix, confirmation, or extension.",
    ],
  },
  {
    id: "pa_c1_capstone_presentation_response_checkpoint",
    level: "C1",
    skill: "presentation_response",
    mode: "checkpoint",
    title_pa: "ਪ੍ਰਸਤੁਤੀ ਤੋਂ ਬਾਅਦ ਜਵਾਬ",
    title_rom: "prastuti ton baad jawab",
    title_vi: "Checkpoint: trả lời sau bài thuyết trình",
    title_en: "Checkpoint: response after a presentation",
    task_goal_vi: "Trả lời câu hỏi khó sau presentation bằng acknowledgement, clarification, và answer.",
    task_goal_en: "Answer a difficult post-presentation question with acknowledgement, clarification, and answer.",
    input_context: {
      pa: "ਸਵਾਲ: ਤੁਹਾਡੀ ਸਿਫ਼ਾਰਸ਼ ਦਾ ਖਰਚਾ ਕੌਣ ਭਰੇਗਾ?",
      rom: "saval: tuhadi sifarash da kharcha kaun bharega?",
      vi: "Câu hỏi: ai sẽ trả chi phí cho khuyến nghị của bạn?",
      en: "Question: who will pay the cost of your recommendation?",
    },
    expected_output_vi: "Một câu trả lời 45-60 giây, bình tĩnh, có limitation và bước tiếp theo.",
    expected_output_en: "A calm 45-60 second answer with limitation and next step.",
    success_criteria_vi: [
      "Cảm ơn hoặc thừa nhận câu hỏi.",
      "Nêu điều chưa biết nếu cần.",
      "Trả lời bằng nguyên tắc hoặc bước tiếp theo.",
    ],
    success_criteria_en: [
      "Thanks or acknowledges the question.",
      "States what is not yet known if needed.",
      "Answers with a principle or next step.",
    ],
    useful_frames: [
      {
        pa: "ਇਹ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ।",
        rom: "ih bahut mahatvapuran saval hai.",
        vi: "Đây là một câu hỏi rất quan trọng.",
        en: "This is a very important question.",
      },
      {
        pa: "ਇਸ ਵੇਲੇ ਪੂਰਾ ਖਰਚਾ ਸਪਸ਼ਟ ਨਹੀਂ, ਪਰ ...",
        rom: "is vele pura kharcha sapashat nahi, par ...",
        vi: "Hiện tại toàn bộ chi phí chưa rõ, nhưng...",
        en: "At this stage, the full cost is not clear, but...",
      },
      {
        pa: "ਅਗਲਾ ਕਦਮ ... ਦੀ ਵਿਸਥਾਰ ਨਾਲ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
        rom: "agla kadam ... di visthar nal samikhia hovegi.",
        vi: "Bước tiếp theo sẽ là xem xét chi tiết...",
        en: "The next step will be a detailed review of...",
      },
    ],
    canada_example: {
      context_vi: "Trả lời câu hỏi sau presentation về dự án cộng đồng tại Canada.",
      context_en: "Answering after a presentation about a community project in Canada.",
      pa: "ਇਹ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ; ਕੈਨੇਡਾ ਵਿੱਚ ਇਸ ਪ੍ਰਸਤਾਵ ਲਈ ਪੂਰਾ ਖਰਚਾ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ, ਪਰ ਪਹਿਲਾ ਕਦਮ ਪਾਇਲਟ ਪ੍ਰੋਗਰਾਮ ਦੀ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
      rom: "ih bahut mahatvapuran saval hai; Canada vich is prastav lai pura kharcha aje sapashat nahi, par pahila kadam pilot program di samikhia hovegi.",
      vi: "Đây là câu hỏi rất quan trọng; tại Canada, toàn bộ chi phí cho đề xuất này chưa rõ, nhưng bước đầu sẽ là xem xét chương trình thí điểm.",
      en: "This is a very important question; in Canada, the full cost of this proposal is not yet clear, but the first step will be a pilot-program review.",
    },
    learner_traps_vi: [
      "Đừng né câu hỏi bằng cách lặp lại slide.",
      "Nếu không biết số liệu, nói rõ limitation rồi đưa bước tiếp theo.",
    ],
    learner_traps_en: [
      "Do not avoid the question by repeating the slide.",
      "If you do not know the figure, state the limitation and give a next step.",
    ],
  },
  {
    id: "pa_c1_capstone_academic_text_handling_final",
    level: "C1",
    skill: "academic_text_handling",
    mode: "final_task",
    title_pa: "ਅਕਾਦਮਿਕ ਪਾਠ ਨਾਲ ਕੰਮ",
    title_rom: "academic path nal kam",
    title_vi: "Final task: xử lý văn bản học thuật",
    title_en: "Final task: academic text handling",
    task_goal_vi: "Đọc một academic excerpt rồi viết synthesis gồm summary, comparison, và cautious claim.",
    task_goal_en: "Read an academic excerpt and write a synthesis with summary, comparison, and cautious claim.",
    input_context: {
      pa: "ਵਿਸ਼ਾ: ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ ਅਤੇ ਖੋਜ-ਲੇਖ ਦੀ ਗੁਣਵੱਤਾ।",
      rom: "visha: vidyarthi sahaita kendar ate khoj-lekh di gunvatta.",
      vi: "Chủ đề: trung tâm hỗ trợ sinh viên và chất lượng bài nghiên cứu.",
      en: "Topic: student support centres and research-paper quality.",
    },
    expected_output_vi: "Một synthesis 220-260 từ với ít nhất hai nguồn giả định và limitation.",
    expected_output_en: "A 220-260 word synthesis with at least two assumed sources and a limitation.",
    success_criteria_vi: [
      "Tóm tắt nguồn không thiên vị.",
      "So sánh evidence chứ không chỉ so sánh topic.",
      "Claim cuối có hedge hợp lý.",
      "Có limitation rõ.",
    ],
    success_criteria_en: [
      "Summarizes sources neutrally.",
      "Compares evidence, not only topic.",
      "Final claim has appropriate hedging.",
      "Includes a clear limitation.",
    ],
    useful_frames: [
      {
        pa: "ਦੋਵੇਂ ਸਰੋਤ ... ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ...",
        rom: "dovein sarot ... bare chintat han, par ...",
        vi: "Cả hai nguồn đều quan tâm đến..., nhưng...",
        en: "Both sources are concerned with..., but...",
      },
      {
        pa: "ਇਹ ਸਬੂਤ ਪੂਰਾ ਨਹੀਂ, ਪਰ ਇਹ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ...",
        rom: "ih sabut pura nahi, par ih sujhaounda hai ki ...",
        vi: "Bằng chứng này chưa đầy đủ, nhưng nó gợi ý rằng...",
        en: "This evidence is not complete, but it suggests that...",
      },
      {
        pa: "ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "ikk sima ih hai ki ...",
        vi: "Một giới hạn là...",
        en: "One limitation is that...",
      },
    ],
    canada_example: {
      context_vi: "Synthesis học thuật về hỗ trợ sinh viên tại Canada.",
      context_en: "Academic synthesis about student support in Canada.",
      pa: "ਦੋਵੇਂ ਸਰੋਤ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ਪਹਿਲਾ ਸਰੋਤ ਲਿਖਣ ਕੇਂਦਰ ਤੇ ਅਤੇ ਦੂਜਾ ਮਾਰਗਦਰਸ਼ਨ ਸੇਵਾਵਾਂ ਤੇ ਜ਼ੋਰ ਦਿੰਦਾ ਹੈ।",
      rom: "dovein sarot Canada vich vidyarthi sahaita bare chintat han, par pahila sarot likhan kendar te ate duja margdarshan sevavan te zor dinda hai.",
      vi: "Cả hai nguồn đều quan tâm đến hỗ trợ sinh viên tại Canada, nhưng nguồn thứ nhất nhấn mạnh trung tâm viết và nguồn thứ hai nhấn mạnh dịch vụ cố vấn.",
      en: "Both sources are concerned with student support in Canada, but the first emphasizes writing centres and the second emphasizes advising services.",
    },
    learner_traps_vi: [
      "Đừng viết hai summaries rời rạc; cần synthesis.",
      "Không kết luận mạnh hơn evidence cho phép.",
    ],
    learner_traps_en: [
      "Do not write two separate summaries; synthesis is required.",
      "Do not conclude more strongly than the evidence allows.",
    ],
  },
  {
    id: "pa_c1_capstone_public_service_text_final",
    level: "C1",
    skill: "public_service_text_handling",
    mode: "final_task",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਪਾਠ ਨਾਲ ਕੰਮ",
    title_rom: "jantak seva path nal kam",
    title_vi: "Final task: xử lý văn bản dịch vụ công",
    title_en: "Final task: public-service text handling",
    task_goal_vi: "Đọc public-service notice rồi viết phản hồi rõ, lịch sự, và thực tế.",
    task_goal_en: "Read a public-service notice and write a clear, polite, practical response.",
    input_context: {
      pa: "ਨੋਟਿਸ: ਅਗਲੇ ਮਹੀਨੇ ਤੋਂ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀਆਂ ਕਲਾਸਾਂ ਲਈ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਹੋਵੇਗੀ।",
      rom: "notice: agle mahine ton community kendar dian classan lai navi registration prakiria hovegi.",
      vi: "Thông báo: từ tháng tới sẽ có quy trình đăng ký mới cho lớp tại trung tâm cộng đồng.",
      en: "Notice: from next month, community centre classes will use a new registration process.",
    },
    expected_output_vi: "Một phản hồi 150-180 từ: summarize notice, nêu concern, hỏi clarification hoặc đề xuất.",
    expected_output_en: "A 150-180 word response: summarize the notice, state concern, ask for clarification or propose action.",
    success_criteria_vi: [
      "Hiểu đúng notice.",
      "Dùng formal tone với request cụ thể.",
      "Có Canada-practical context nếu phù hợp.",
      "Không claim quyền lợi pháp lý chưa được nêu.",
    ],
    success_criteria_en: [
      "Understands the notice accurately.",
      "Uses formal tone with a specific request.",
      "Includes Canada-practical context where relevant.",
      "Does not claim legal rights not stated in the prompt.",
    ],
    useful_frames: [
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
        vi: "Xin vui lòng làm rõ rằng/liệu...",
        en: "Please clarify whether...",
      },
    ],
    canada_example: {
      context_vi: "Phản hồi về thông báo trung tâm cộng đồng tại Canada.",
      context_en: "Responding to a community-centre notice in Canada.",
      pa: "ਨੋਟਿਸ ਦੇ ਅਨੁਸਾਰ, ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀਆਂ ਕਲਾਸਾਂ ਲਈ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਹੋਵੇਗੀ; ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਕਰੋ ਕਿ ਪੁਰਾਣੇ ਭਾਗੀਦਾਰਾਂ ਨੂੰ ਮੁੜ ਅਰਜ਼ੀ ਦੇਣੀ ਪਵੇਗੀ ਜਾਂ ਨਹੀਂ।",
      rom: "notice de anusaar, Canada vich community kendar dian classan lai navi registration prakiria hovegi; kirpa karke sapashat karo ki purane bhagidaran nu mur arzi deni pavegi ja nahi.",
      vi: "Theo thông báo, tại Canada sẽ có quy trình đăng ký mới cho lớp tại trung tâm cộng đồng; xin vui lòng làm rõ liệu người tham gia cũ có phải nộp đơn lại hay không.",
      en: "According to the notice, community-centre classes in Canada will have a new registration process; please clarify whether previous participants must apply again.",
    },
    learner_traps_vi: [
      "Đừng phản hồi như complaint nếu prompt chỉ yêu cầu clarification.",
      "Không bỏ qua nội dung chính của notice trước khi hỏi.",
    ],
    learner_traps_en: [
      "Do not respond as a complaint if the prompt only calls for clarification.",
      "Do not skip the main content of the notice before asking.",
    ],
  },
];

export const capstoneTasksC1: PunjabiCapstoneTask[] = capstoneTaskSourcesC1.map((task) => ({
  ...task,
  task_type: taskTypeBySkill[task.skill],
  learner_goal_vi: task.task_goal_vi,
  learner_goal_en: task.task_goal_en,
  source_prompt: task.input_context,
  response_frames: task.useful_frames,
  checkpoint: {
    skill_vi: task.task_goal_vi,
    skill_en: task.task_goal_en,
    success_criteria_vi: task.success_criteria_vi,
    success_criteria_en: task.success_criteria_en,
  },
  canada_scenario: task.canada_example,
}));
