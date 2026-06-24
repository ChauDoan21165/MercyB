// Punjabi C1 formal argument pack for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiFormalArgumentCategory =
  | "thesis"
  | "evidence"
  | "limitation"
  | "counterargument"
  | "conclusion"
  | "careful_tone"
  | "public_example"
  | "community_example"
  | "academic_example";

export type PunjabiFormalArgumentPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiFormalArgumentEntry = {
  id: string;
  level: "C1";
  category: PunjabiFormalArgumentCategory;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  argument_goal_vi: string;
  argument_goal_en: string;
  register_note_vi: string;
  register_note_en: string;
  argument_frames: readonly PunjabiFormalArgumentPhrase[];
  canada_example: PunjabiFormalArgumentPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
  practice_task_vi: string;
  practice_task_en: string;
};

export const formalArgumentScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const formalArgumentC1: PunjabiFormalArgumentEntry[] = [
  {
    id: "pa_c1_arg_thesis_policy",
    level: "C1",
    category: "thesis",
    title_pa: "ਸਪਸ਼ਟ ਥੀਸਿਸ ਬਣਾਉਣਾ",
    title_rom: "spasht thesis banauna",
    title_vi: "Xây dựng luận đề rõ ràng",
    title_en: "Building a clear thesis",
    argument_goal_vi: "Nêu lập trường có điều kiện, phạm vi rõ, và hướng lập luận chính.",
    argument_goal_en: "State a qualified position, clear scope, and main line of argument.",
    register_note_vi: "Trang trọng, không tuyệt đối hóa; dùng điều kiện khi vấn đề phức tạp.",
    register_note_en: "Formal and not absolute; use qualification when the issue is complex.",
    argument_frames: [
      {
        pa: "ਇਸ ਲੇਖ ਦੀ ਮੁੱਖ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ...",
        rom: "is lekh di mukh daleel ih hai ki ...",
        vi: "Luận điểm chính của bài này là...",
        en: "The main argument of this essay is that...",
      },
      {
        pa: "ਹਾਲਾਤਾਂ ਦੇ ਅਨੁਸਾਰ, ... ਨੂੰ ਤਰਜੀਹ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ।",
        rom: "halatan de anusaar, ... nu tarjih deni chahidi hai.",
        vi: "Tùy theo hoàn cảnh, nên ưu tiên...",
        en: "Depending on the conditions, priority should be given to...",
      },
      {
        pa: "ਇਹ ਦਲੀਲ ... ਅਤੇ ... ਦੋਵਾਂ ਤੇ ਆਧਾਰਿਤ ਹੈ।",
        rom: "ih daleel ... ate ... dovan te adharit hai.",
        vi: "Luận điểm này dựa trên cả ... và ...",
        en: "This argument is based on both ... and ...",
      },
    ],
    canada_example: {
      context_vi: "Luận đề về hỗ trợ sinh viên ở Canada.",
      context_en: "Thesis about student support in Canada.",
      pa: "ਇਸ ਲੇਖ ਦੀ ਮੁੱਖ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਨੂੰ ਸਿਰਫ਼ ਆਰਥਿਕ ਮਦਦ ਨਹੀਂ, ਸਗੋਂ ਭਾਸ਼ਾਈ ਅਤੇ ਮਾਨਸਿਕ ਸਿਹਤ ਸਹਾਇਤਾ ਵੀ ਸ਼ਾਮਲ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।",
      rom: "is lekh di mukh daleel ih hai ki Canada vich vidyarthi sahaita nu sirf arthik madad nahi, sagon bhashai ate mansik sehat sahaita vi shamil karni chahidi hai.",
      vi: "Luận điểm chính là ở Canada, hỗ trợ sinh viên không chỉ nên gồm tài chính mà còn cả hỗ trợ ngôn ngữ và sức khỏe tinh thần.",
      en: "The main argument is that in Canada, student support should include not only financial help but also language and mental-health support.",
    },
    learner_traps_vi: [
      "Đừng viết thesis quá rộng như 'giáo dục là quan trọng'.",
      "Thesis C1 nên có phạm vi, điều kiện, hoặc tiêu chí.",
    ],
    learner_traps_en: [
      "Do not write a thesis as broad as 'education is important'.",
      "A C1 thesis should include scope, condition, or criteria.",
    ],
    practice_task_vi: "Viết 2 thesis có điều kiện cho một chính sách giáo dục.",
    practice_task_en: "Write two qualified thesis statements for an education policy.",
  },
  {
    id: "pa_c1_arg_evidence_data",
    level: "C1",
    category: "evidence",
    title_pa: "ਸਬੂਤ ਨਾਲ ਦਲੀਲ ਮਜ਼ਬੂਤ ਕਰਨਾ",
    title_rom: "sabut nal daleel mazbut karna",
    title_vi: "Củng cố lập luận bằng bằng chứng",
    title_en: "Strengthening an argument with evidence",
    argument_goal_vi: "Đưa bằng chứng, giải thích ý nghĩa, rồi nối lại với luận điểm.",
    argument_goal_en: "Present evidence, explain its meaning, then link it back to the claim.",
    register_note_vi: "Không chỉ thả số liệu; cần diễn giải tác dụng của nó.",
    register_note_en: "Do not drop a statistic; interpret what it does for the argument.",
    argument_frames: [
      {
        pa: "ਇਸ ਦਲੀਲ ਲਈ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸਬੂਤ ... ਹੈ।",
        rom: "is daleel lai ikk mahatvapuran sabut ... hai.",
        vi: "Một bằng chứng quan trọng cho lập luận này là...",
        en: "One important piece of evidence for this argument is...",
      },
      {
        pa: "ਇਸ ਸਬੂਤ ਤੋਂ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ...",
        rom: "is sabut ton pata lagda hai ki ...",
        vi: "Bằng chứng này cho thấy rằng...",
        en: "This evidence shows/suggests that...",
      },
      {
        pa: "ਇਸ ਕਰਕੇ ਮੁੱਖ ਦਲੀਲ ਹੋਰ ਮਜ਼ਬੂਤ ਹੁੰਦੀ ਹੈ।",
        rom: "is karke mukh daleel hor mazbut hundi hai.",
        vi: "Vì vậy luận điểm chính trở nên mạnh hơn.",
        en: "Therefore, the main argument becomes stronger.",
      },
    ],
    canada_example: {
      context_vi: "Dùng bằng chứng trong lập luận về giao thông sinh viên ở Canada.",
      context_en: "Using evidence in an argument about student transit in Canada.",
      pa: "ਇਸ ਦਲੀਲ ਲਈ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸਬੂਤ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਦੇ ਵੱਡੇ ਸ਼ਹਿਰਾਂ ਵਿੱਚ ਲੰਮਾ ਆਵਾਜਾਈ ਸਮਾਂ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਹਾਜ਼ਰੀ ਨਾਲ ਜੁੜ ਸਕਦਾ ਹੈ।",
      rom: "is daleel lai ikk mahatvapuran sabut ih hai ki Canada de vadde shehran vich lamma aavajai sama vidyarthian di hazri nal jur sakda hai.",
      vi: "Một bằng chứng quan trọng là tại các thành phố lớn ở Canada, thời gian đi lại dài có thể liên quan đến chuyên cần của sinh viên.",
      en: "One important piece of evidence is that in large Canadian cities, long commute times may be linked to student attendance.",
    },
    learner_traps_vi: [
      "Nếu bằng chứng chỉ gợi ý, đừng dùng từ 'chứng minh'.",
      "Luôn nói bằng chứng hỗ trợ phần nào của luận điểm.",
    ],
    learner_traps_en: [
      "If the evidence only suggests, do not use 'proves'.",
      "Always state which part of the argument the evidence supports.",
    ],
    practice_task_vi: "Viết đoạn 4 câu: luận điểm, bằng chứng, giải thích, nối lại.",
    practice_task_en: "Write a four-sentence paragraph: claim, evidence, explanation, link back.",
  },
  {
    id: "pa_c1_arg_limitation_scope",
    level: "C1",
    category: "limitation",
    title_pa: "ਦਲੀਲ ਦੀ ਸੀਮਾ ਮੰਨਣਾ",
    title_rom: "daleel di seema manna",
    title_vi: "Thừa nhận giới hạn của lập luận",
    title_en: "Acknowledging an argument's limitation",
    argument_goal_vi: "Nêu giới hạn mà không làm mất hoàn toàn giá trị của lập luận.",
    argument_goal_en: "State a limitation without making the whole argument lose value.",
    register_note_vi: "C1 formal argument mạnh hơn khi biết tự giới hạn phạm vi.",
    register_note_en: "A C1 formal argument is stronger when it limits its own scope.",
    argument_frames: [
      {
        pa: "ਇਸ ਦਲੀਲ ਦੀ ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is daleel di ikk seema ih hai ki ...",
        vi: "Một giới hạn của lập luận này là...",
        en: "One limitation of this argument is that...",
      },
      {
        pa: "ਇਸ ਕਰਕੇ ਨਤੀਜੇ ਨੂੰ ... ਲਈ ਸਾਵਧਾਨੀ ਨਾਲ ਵਰਤਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is karke natije nu ... lai savdhani nal vartna chahida hai.",
        vi: "Vì vậy, kết luận nên được dùng thận trọng cho...",
        en: "Therefore, the conclusion should be used cautiously for...",
      },
      {
        pa: "ਫਿਰ ਵੀ, ਇਹ ਦਲੀਲ ... ਬਾਰੇ ਲਾਭਦਾਇਕ ਰਹਿੰਦੀ ਹੈ।",
        rom: "phir vi, ih daleel ... bare labhdayak rehndi hai.",
        vi: "Tuy vậy, lập luận này vẫn hữu ích về...",
        en: "Nevertheless, this argument remains useful for...",
      },
    ],
    canada_example: {
      context_vi: "Nêu giới hạn trong lập luận về một đại học Canada.",
      context_en: "Stating a limitation in an argument about one Canadian university.",
      pa: "ਇਸ ਦਲੀਲ ਦੀ ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ਉਦਾਹਰਨ ਸਿਰਫ਼ ਇੱਕ ਕੈਨੇਡੀਅਨ ਯੂਨੀਵਰਸਿਟੀ ਤੋਂ ਆਉਂਦੀ ਹੈ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਸਾਰੇ ਸੂਬਿਆਂ ਲਈ ਸਾਵਧਾਨੀ ਨਾਲ ਵਰਤਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "is daleel di ikk seema ih hai ki udaharan sirf ikk Canadian university ton aundi hai, is lai is nu sare subian lai savdhani nal vartna chahida hai.",
      vi: "Một giới hạn là ví dụ chỉ đến từ một đại học Canada, vì vậy nên dùng thận trọng cho tất cả các tỉnh bang.",
      en: "One limitation is that the example comes from only one Canadian university, so it should be used cautiously for all provinces.",
    },
    learner_traps_vi: [
      "Không che giấu giới hạn rõ ràng trong nguồn.",
      "Sau giới hạn, hãy nói lập luận còn dùng được ở đâu.",
    ],
    learner_traps_en: [
      "Do not hide an obvious limitation in the source.",
      "After the limitation, state where the argument remains useful.",
    ],
    practice_task_vi: "Viết 3 câu thừa nhận giới hạn mẫu nghiên cứu.",
    practice_task_en: "Write three sentences acknowledging a sample limitation.",
  },
  {
    id: "pa_c1_arg_counterargument",
    level: "C1",
    category: "counterargument",
    title_pa: "ਵਿਰੋਧੀ ਦਲੀਲ ਦਾ ਜਵਾਬ",
    title_rom: "virodhi daleel da jawab",
    title_vi: "Phản hồi phản biện",
    title_en: "Responding to a counterargument",
    argument_goal_vi: "Trình bày quan điểm đối lập công bằng rồi phản hồi bằng lý do.",
    argument_goal_en: "Present the opposing view fairly and respond with reasoning.",
    register_note_vi: "Không bóp méo quan điểm đối lập; điều đó làm lập luận yếu đi.",
    register_note_en: "Do not distort the opposing view; that weakens the argument.",
    argument_frames: [
      {
        pa: "ਇੱਕ ਵਿਰੋਧੀ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ...",
        rom: "ikk virodhi daleel ih hai ki ...",
        vi: "Một phản biện là...",
        en: "One counterargument is that...",
      },
      {
        pa: "ਇਹ ਚਿੰਤਾ ਜਾਇਜ਼ ਹੈ, ਪਰ ...",
        rom: "ih chinta jaiz hai, par ...",
        vi: "Mối lo này hợp lý, nhưng...",
        en: "This concern is valid, but...",
      },
      {
        pa: "ਇਸ ਲਈ ਵਧੀਆ ਜਵਾਬ ਇਹ ਹੈ ਕਿ ...",
        rom: "is lai vadhia jawab ih hai ki ...",
        vi: "Vì vậy, phản hồi tốt hơn là...",
        en: "Therefore, the better response is that...",
      },
    ],
    canada_example: {
      context_vi: "Phản hồi phản biện về chi phí hỗ trợ sinh viên ở Canada.",
      context_en: "Responding to a counterargument about student-support costs in Canada.",
      pa: "ਇੱਕ ਵਿਰੋਧੀ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਧੀਕ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਮਹਿੰਗੀ ਹੋਵੇਗੀ; ਇਹ ਚਿੰਤਾ ਜਾਇਜ਼ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਵਿੱਚ ਛੱਡਣ ਦੀ ਦਰ ਘਟ ਸਕਦੀ ਹੈ।",
      rom: "ikk virodhi daleel ih hai ki Canada vich vadhik vidyarthi sahaita mehingi hovegi; ih chinta jaiz hai, par lambe same vich chhaddan di dar ghat sakdi hai.",
      vi: "Một phản biện là hỗ trợ sinh viên bổ sung ở Canada sẽ tốn kém; mối lo này hợp lý, nhưng về dài hạn tỷ lệ bỏ học có thể giảm.",
      en: "One counterargument is that added student support in Canada will be expensive; this concern is valid, but dropout rates may fall over time.",
    },
    learner_traps_vi: [
      "Đừng dùng phản biện yếu giả tạo; hãy chọn phản biện thật.",
      "Công nhận một phần phản biện trước khi trả lời thường tự nhiên hơn.",
    ],
    learner_traps_en: [
      "Do not use a fake weak counterargument; choose a real one.",
      "Acknowledging part of the counterargument before responding is often more natural.",
    ],
    practice_task_vi: "Viết một phản biện và một câu trả lời cân bằng.",
    practice_task_en: "Write one counterargument and one balanced response.",
  },
  {
    id: "pa_c1_arg_conclusion",
    level: "C1",
    category: "conclusion",
    title_pa: "ਮਜ਼ਬੂਤ ਨਤੀਜਾ ਲਿਖਣਾ",
    title_rom: "mazbut natija likhna",
    title_vi: "Viết kết luận mạnh",
    title_en: "Writing a strong conclusion",
    argument_goal_vi: "Kết luận bằng cách tổng hợp lập luận, không chỉ lặp lại thesis.",
    argument_goal_en: "Conclude by synthesizing the argument, not only repeating the thesis.",
    register_note_vi: "Kết luận nên nêu hàm ý hoặc bước tiếp theo.",
    register_note_en: "A conclusion should state an implication or next step.",
    argument_frames: [
      {
        pa: "ਸਾਰੇ ਪੱਖਾਂ ਨੂੰ ਵੇਖਦਿਆਂ, ...",
        rom: "sare pakkhan nu vekhdian, ...",
        vi: "Khi xét tất cả các khía cạnh,...",
        en: "Considering all sides,...",
      },
      {
        pa: "ਇਸ ਦਲੀਲ ਦਾ ਵੱਡਾ ਅਰਥ ਇਹ ਹੈ ਕਿ ...",
        rom: "is daleel da vadda arth ih hai ki ...",
        vi: "Ý nghĩa lớn hơn của lập luận này là...",
        en: "The broader implication of this argument is...",
      },
      {
        pa: "ਅਗਲਾ ਕਦਮ ... ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "agla kadam ... hona chahida hai.",
        vi: "Bước tiếp theo nên là...",
        en: "The next step should be...",
      },
    ],
    canada_example: {
      context_vi: "Kết luận bài luận về dịch vụ sinh viên ở Canada.",
      context_en: "Concluding an essay about student services in Canada.",
      pa: "ਸਾਰੇ ਪੱਖਾਂ ਨੂੰ ਵੇਖਦਿਆਂ, ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸੇਵਾਵਾਂ ਨੂੰ ਆਰਥਿਕ, ਭਾਸ਼ਾਈ ਅਤੇ ਮਾਨਸਿਕ ਸਿਹਤ ਸਹਾਇਤਾ ਨੂੰ ਇਕੱਠੇ ਸੋਚਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "sare pakkhan nu vekhdian, Canada vich vidyarthi sevavan nu arthik, bhashai ate mansik sehat sahaita nu ikatthe sochna chahida hai.",
      vi: "Khi xét mọi khía cạnh, dịch vụ sinh viên ở Canada nên xem hỗ trợ tài chính, ngôn ngữ và sức khỏe tinh thần cùng nhau.",
      en: "Considering all sides, student services in Canada should think about financial, language, and mental-health support together.",
    },
    learner_traps_vi: [
      "Đừng kết bằng một câu quá chung như 'vấn đề này rất quan trọng'.",
      "Không đưa bằng chứng hoàn toàn mới vào kết luận.",
    ],
    learner_traps_en: [
      "Do not end with a generic sentence like 'this issue is very important'.",
      "Do not introduce completely new evidence in the conclusion.",
    ],
    practice_task_vi: "Viết kết luận 3 câu: tổng hợp, hàm ý, bước tiếp theo.",
    practice_task_en: "Write a three-sentence conclusion: synthesis, implication, next step.",
  },
  {
    id: "pa_c1_arg_careful_tone",
    level: "C1",
    category: "careful_tone",
    title_pa: "ਸਾਵਧਾਨ ਅਤੇ ਸੰਤੁਲਿਤ ਲਹਿਜ਼ਾ",
    title_rom: "savdhan ate santulit lehja",
    title_vi: "Giọng văn thận trọng và cân bằng",
    title_en: "Careful and balanced tone",
    argument_goal_vi: "Giảm khẳng định quá mức và dùng ngôn ngữ học thuật có điều kiện.",
    argument_goal_en: "Reduce overstatement and use qualified academic language.",
    register_note_vi: "Dùng 'có thể', 'dựa trên', 'trong bối cảnh này' để chính xác hơn.",
    register_note_en: "Use 'may', 'based on', and 'in this context' for precision.",
    argument_frames: [
      {
        pa: "ਉਪਲਬਧ ਸਬੂਤਾਂ ਦੇ ਆਧਾਰ ਤੇ, ...",
        rom: "uplabdh sabutan de adhar te, ...",
        vi: "Dựa trên bằng chứng hiện có,...",
        en: "Based on the available evidence,...",
      },
      {
        pa: "ਇਹ ਕਹਿਣਾ ਵਧੇਰੇ ਸਾਵਧਾਨ ਹੋਵੇਗਾ ਕਿ ...",
        rom: "ih kehna vadhere savdhan hovega ki ...",
        vi: "Sẽ thận trọng hơn nếu nói rằng...",
        en: "It would be more cautious to say that...",
      },
      {
        pa: "ਇਹ ਨਤੀਜਾ ਹਰ ਸੰਦਰਭ ਵਿੱਚ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦਾ।",
        rom: "ih natija har sandarbh vich lagu nahi hunda.",
        vi: "Kết luận này không áp dụng trong mọi bối cảnh.",
        en: "This conclusion does not apply in every context.",
      },
    ],
    canada_example: {
      context_vi: "Dùng giọng thận trọng khi viết về chính sách Canada.",
      context_en: "Using careful tone when writing about Canadian policy.",
      pa: "ਉਪਲਬਧ ਸਬੂਤਾਂ ਦੇ ਆਧਾਰ ਤੇ, ਕੈਨੇਡਾ ਵਿੱਚ ਇਹ ਨੀਤੀ ਕੁਝ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਹਰ ਸੰਦਰਭ ਵਿੱਚ ਨਹੀਂ।",
      rom: "uplabdh sabutan de adhar te, Canada vich ih niti kujh vidyarthian lai labhdayak ho sakdi hai, par har sandarbh vich nahi.",
      vi: "Dựa trên bằng chứng hiện có, ở Canada chính sách này có thể hữu ích cho một số sinh viên, nhưng không phải trong mọi bối cảnh.",
      en: "Based on available evidence, this policy in Canada may be useful for some students, but not in every context.",
    },
    learner_traps_vi: [
      "Tránh 'tất cả', 'luôn luôn', 'không bao giờ' khi nguồn không chứng minh.",
      "Thận trọng không có nghĩa là yếu; nó làm lập luận chính xác hơn.",
    ],
    learner_traps_en: [
      "Avoid 'all', 'always', and 'never' when the source does not prove them.",
      "Careful tone is not weak; it makes the argument more precise.",
    ],
    practice_task_vi: "Viết lại 3 câu quá chắc chắn thành giọng C1 thận trọng.",
    practice_task_en: "Rewrite three overconfident sentences in careful C1 tone.",
  },
  {
    id: "pa_c1_arg_public_service",
    level: "C1",
    category: "public_example",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਦਲੀਲ",
    title_rom: "jantak seva daleel",
    title_vi: "Lập luận cho dịch vụ công",
    title_en: "Public-service argument",
    argument_goal_vi: "Viết lập luận rõ hành động, lợi ích công cộng, và điều kiện thực hiện.",
    argument_goal_en: "Write an argument with action, public benefit, and implementation condition.",
    register_note_vi: "Rõ ràng và thực dụng; người đọc cần biết nên làm gì.",
    register_note_en: "Clear and practical; readers need to know what should be done.",
    argument_frames: [
      {
        pa: "ਜਨਤਕ ਹਿੱਤ ਲਈ ... ਲੋੜੀਂਦਾ ਹੈ।",
        rom: "jantak hit lai ... lorinda hai.",
        vi: "Vì lợi ích công cộng, ... là cần thiết.",
        en: "For the public interest, ... is necessary.",
      },
      {
        pa: "ਇਸ ਕਦਮ ਨਾਲ ... ਵਿੱਚ ਸੁਧਾਰ ਹੋ ਸਕਦਾ ਹੈ।",
        rom: "is kadam nal ... vich sudhar ho sakda hai.",
        vi: "Bước này có thể cải thiện...",
        en: "This step may improve...",
      },
      {
        pa: "ਲਾਗੂ ਕਰਨ ਲਈ ... ਦੀ ਸਪਸ਼ਟ ਜਾਣਕਾਰੀ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ।",
        rom: "lagu karan lai ... di spasht jankari deni chahidi hai.",
        vi: "Để triển khai, nên cung cấp thông tin rõ về...",
        en: "For implementation, clear information about ... should be provided.",
      },
    ],
    canada_example: {
      context_vi: "Lập luận về thông báo dịch vụ công cho sinh viên ở Canada.",
      context_en: "Argument about a student public-service notice in Canada.",
      pa: "ਜਨਤਕ ਹਿੱਤ ਲਈ ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਸਿਹਤ ਬੀਮਾ ਬਾਰੇ ਸਪਸ਼ਟ ਅਤੇ ਬਹੁਭਾਸ਼ੀ ਜਾਣਕਾਰੀ ਦੇਣੀ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "jantak hit lai Canada vich nave vidyarthian nu sehat bima bare spasht ate bahubhashi jankari deni lorindi hai.",
      vi: "Vì lợi ích công cộng, ở Canada cần cung cấp thông tin rõ ràng và đa ngôn ngữ về bảo hiểm y tế cho sinh viên mới.",
      en: "For the public interest, new students in Canada need clear and multilingual information about health insurance.",
    },
    learner_traps_vi: [
      "Đừng chỉ nói dịch vụ 'nên tốt hơn'; nêu hành động cụ thể.",
      "Văn bản dịch vụ công cần ưu tiên rõ ràng hơn hoa mỹ.",
    ],
    learner_traps_en: [
      "Do not only say the service 'should be better'; state a specific action.",
      "Public-service writing should prioritize clarity over ornament.",
    ],
    practice_task_vi: "Viết lập luận 100 từ đề xuất cải thiện một thông báo dịch vụ.",
    practice_task_en: "Write a 100-word argument proposing an improvement to a service notice.",
  },
  {
    id: "pa_c1_arg_community",
    level: "C1",
    category: "community_example",
    title_pa: "ਸਮੁਦਾਇਕ ਦਲੀਲ",
    title_rom: "samudayik daleel",
    title_vi: "Lập luận cộng đồng",
    title_en: "Community argument",
    argument_goal_vi: "Cân bằng nhu cầu cộng đồng, nguồn lực, và trách nhiệm chung.",
    argument_goal_en: "Balance community needs, resources, and shared responsibility.",
    register_note_vi: "Tôn trọng nhiều nhóm người đọc; tránh quy kết lỗi cho một nhóm.",
    register_note_en: "Respect multiple reader groups; avoid assigning blame to one group.",
    argument_frames: [
      {
        pa: "ਸਮੁਦਾਇਕ ਪੱਧਰ ਤੇ ... ਨੂੰ ਤਰਜੀਹ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ।",
        rom: "samudayik paddar te ... nu tarjih deni chahidi hai.",
        vi: "Ở cấp cộng đồng, nên ưu tiên...",
        en: "At the community level, priority should be given to...",
      },
      {
        pa: "ਇਹ ਸਿਰਫ਼ ਵਿਅਕਤੀਗਤ ਨਹੀਂ, ਸਾਂਝੀ ਜ਼ਿੰਮੇਵਾਰੀ ਵੀ ਹੈ।",
        rom: "ih sirf viaktigat nahi, sanjhi zimmedari vi hai.",
        vi: "Đây không chỉ là trách nhiệm cá nhân mà còn là trách nhiệm chung.",
        en: "This is not only an individual responsibility but also a shared one.",
      },
      {
        pa: "ਸਰੋਤ ਘੱਟ ਹੋਣ ਦੇ ਬਾਵਜੂਦ, ... ਸੰਭਵ ਹੈ।",
        rom: "sarot ghatt hon de bawajud, ... sambhav hai.",
        vi: "Dù nguồn lực hạn chế, ... vẫn khả thi.",
        en: "Despite limited resources, ... is possible.",
      },
    ],
    canada_example: {
      context_vi: "Lập luận cộng đồng về hỗ trợ người mới đến ở Canada.",
      context_en: "Community argument about newcomer support in Canada.",
      pa: "ਸਮੁਦਾਇਕ ਪੱਧਰ ਤੇ ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਆਏ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ ਨੂੰ ਤਰਜੀਹ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ, ਕਿਉਂਕਿ ਇਹ ਸਾਂਝੀ ਭਾਗੀਦਾਰੀ ਵਧਾਉਂਦੀ ਹੈ।",
      rom: "samudayik paddar te Canada vich nave aaye vidyarthian lai bhashai sahaita nu tarjih deni chahidi hai, kyonki ih sanjhi bhagidari vadhaoundi hai.",
      vi: "Ở cấp cộng đồng tại Canada, nên ưu tiên hỗ trợ ngôn ngữ cho sinh viên mới đến vì điều này tăng sự tham gia chung.",
      en: "At the community level in Canada, language support for newly arrived students should be prioritized because it increases shared participation.",
    },
    learner_traps_vi: [
      "Không mô tả cộng đồng như một nhóm đồng nhất.",
      "Nêu nguồn lực và trách nhiệm, không chỉ nêu mong muốn.",
    ],
    learner_traps_en: [
      "Do not describe the community as one uniform group.",
      "Mention resources and responsibility, not only wishes.",
    ],
    practice_task_vi: "Viết đoạn lập luận cộng đồng gồm nhu cầu, nguồn lực, trách nhiệm.",
    practice_task_en: "Write a community argument paragraph with need, resources, and responsibility.",
  },
  {
    id: "pa_c1_arg_academic_example",
    level: "C1",
    category: "academic_example",
    title_pa: "ਅਕਾਦਮਿਕ ਦਲੀਲ ਦੀ ਰਚਨਾ",
    title_rom: "academic daleel di rachna",
    title_vi: "Cấu trúc lập luận học thuật",
    title_en: "Structuring an academic argument",
    argument_goal_vi: "Kết hợp thesis, bằng chứng, phản biện, giới hạn, và kết luận trong một đoạn.",
    argument_goal_en: "Combine thesis, evidence, counterargument, limitation, and conclusion in one paragraph.",
    register_note_vi: "Văn học thuật cần liên kết logic rõ, không chỉ chuỗi câu đúng ngữ pháp.",
    register_note_en: "Academic writing needs clear logical links, not only grammatically correct sentences.",
    argument_frames: [
      {
        pa: "ਪਹਿਲਾਂ, ...; ਦੂਜਾ, ...; ਫਿਰ ਵੀ, ...",
        rom: "pahilan, ...; duja, ...; phir vi, ...",
        vi: "Thứ nhất, ...; thứ hai, ...; tuy vậy, ...",
        en: "First, ...; second, ...; however, ...",
      },
      {
        pa: "ਇਸ ਤਰ੍ਹਾਂ, ਦਲੀਲ ਸਿਰਫ਼ ... ਨਹੀਂ, ਸਗੋਂ ... ਵੀ ਦਿਖਾਉਂਦੀ ਹੈ।",
        rom: "is tarah, daleel sirf ... nahi, sagon ... vi dikhaoundi hai.",
        vi: "Như vậy, lập luận không chỉ cho thấy ... mà còn ...",
        en: "In this way, the argument shows not only ... but also ...",
      },
      {
        pa: "ਅੰਤ ਵਿੱਚ, ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ...",
        rom: "ant vich, sabh ton mazbut sthiti ih hai ki ...",
        vi: "Cuối cùng, lập trường mạnh nhất là...",
        en: "Finally, the strongest position is that...",
      },
    ],
    canada_example: {
      context_vi: "Đoạn học thuật hoàn chỉnh về thành công sinh viên ở Canada.",
      context_en: "Complete academic argument about student success in Canada.",
      pa: "ਅੰਤ ਵਿੱਚ, ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਫ਼ਲਤਾ ਨੂੰ ਵਿਅਕਤੀਗਤ ਮਿਹਨਤ ਅਤੇ ਸੰਸਥਾਗਤ ਸਹਾਇਤਾ ਦੋਵਾਂ ਰਾਹੀਂ ਸਮਝਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "ant vich, sabh ton mazbut sthiti ih hai ki Canada vich vidyarthi safalta nu viaktigat mehnat ate sansthagat sahaita dovan rahin samajhna chahida hai.",
      vi: "Cuối cùng, lập trường mạnh nhất là ở Canada, thành công sinh viên nên được hiểu qua cả nỗ lực cá nhân và hỗ trợ từ cơ sở giáo dục.",
      en: "Finally, the strongest position is that in Canada, student success should be understood through both individual effort and institutional support.",
    },
    learner_traps_vi: [
      "Đừng gom quá nhiều ý nếu không có liên kết logic.",
      "Một đoạn học thuật nên có trật tự chức năng, không chỉ trật tự cảm hứng.",
    ],
    learner_traps_en: [
      "Do not pack in too many ideas without logical links.",
      "An academic paragraph should have functional order, not only stream-of-thought order.",
    ],
    practice_task_vi: "Viết đoạn 180 từ gồm thesis, evidence, counterargument, conclusion.",
    practice_task_en: "Write a 180-word paragraph with thesis, evidence, counterargument, and conclusion.",
  },
];
