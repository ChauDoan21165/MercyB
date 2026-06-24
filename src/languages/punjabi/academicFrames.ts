// Punjabi academic / essay frames for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid. Shahmukhi is mentioned
// only for script awareness, not taught as a separate course here. Native
// review is deferred.

export type PunjabiAcademicLevel = "B2" | "C1" | "C2";

export type PunjabiFrameCategory =
  | "introduce_topic"
  | "cite_evidence"
  | "contrast"
  | "concession"
  | "cause_effect"
  | "evaluate"
  | "define"
  | "summarize"
  | "conclude"
  | "polite_disagree";

export type PunjabiFrameExample = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiAcademicFrame = {
  id: string;
  level: PunjabiAcademicLevel;
  category: PunjabiFrameCategory;
  frame_pa: string;
  frame_rom: string;
  frame_vi: string;
  frame_en: string;
  use_case_vi: string;
  use_case_en: string;
  examples: readonly PunjabiFrameExample[];
  cautions_vi: string;
  cautions_en: string;
  practice_prompt_vi: string;
  practice_prompt_en: string;
};

const frameSeeds = [
  {
    id: "topic_focus",
    level: "B2",
    category: "introduce_topic",
    frame_pa: "ਇਸ ਲੇਖ ਵਿੱਚ ... ਦੇ ਮੁੱਖ ਪੱਖਾਂ ਦੀ ਚਰਚਾ ਕੀਤੀ ਜਾਵੇਗੀ।",
    frame_rom: "is lekh vich ... de mukh pakkhan di charcha kiti javegi.",
    frame_vi: "Trong bài này, các khía cạnh chính của ... sẽ được thảo luận.",
    frame_en: "This essay will discuss the main aspects of ...",
    use_case_vi: "Mở bài học thuật khi cần nêu phạm vi rõ.",
    use_case_en: "Academic opening when you need to state the scope clearly.",
    examples: [
      {
        pa: "ਇਸ ਲੇਖ ਵਿੱਚ ਆਨਲਾਈਨ ਸਿੱਖਿਆ ਦੇ ਮੁੱਖ ਪੱਖਾਂ ਦੀ ਚਰਚਾ ਕੀਤੀ ਜਾਵੇਗੀ।",
        rom: "is lekh vich online sikhia de mukh pakkhan di charcha kiti javegi.",
        vi: "Bài này sẽ thảo luận các khía cạnh chính của giáo dục trực tuyến.",
        en: "This essay will discuss the main aspects of online education.",
      },
    ],
    cautions_vi: "Dùng ਚਰਚਾ cho văn phong học thuật; tránh câu mở quá chung như 'đây là chủ đề hay'.",
    cautions_en: "Use ਚਰਚਾ for academic tone; avoid vague openings like 'this is an interesting topic'.",
    practice_prompt_vi: "Viết câu mở cho chủ đề sức khỏe cộng đồng.",
    practice_prompt_en: "Write an opening sentence for a public-health topic.",
  },
  {
    id: "evidence_data",
    level: "B2",
    category: "cite_evidence",
    frame_pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ...",
    frame_rom: "uplabdh ankre darsaaunde han ki ...",
    frame_vi: "Các số liệu hiện có cho thấy rằng ...",
    frame_en: "The available data indicate that ...",
    use_case_vi: "Dẫn bằng chứng định lượng một cách trung tính.",
    use_case_en: "Introduces quantitative evidence in a neutral way.",
    examples: [
      {
        pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਹਾਜ਼ਰੀ ਵਿੱਚ ਹੌਲੀ ਵਾਧਾ ਹੋਇਆ ਹੈ।",
        rom: "uplabdh ankre darsaaunde han ki hazri vich hauli vadha hoia hai.",
        vi: "Các số liệu hiện có cho thấy tỷ lệ tham dự đã tăng nhẹ.",
        en: "The available data indicate that attendance has risen slightly.",
      },
    ],
    cautions_vi: "Không dùng nếu bạn chưa có dữ liệu; hãy nêu nguồn trong bài thật.",
    cautions_en: "Do not use this without data; name the source in a real essay.",
    practice_prompt_vi: "Dùng frame để dẫn một con số từ nghiên cứu giả định.",
    practice_prompt_en: "Use the frame to introduce a number from a hypothetical study.",
  },
  {
    id: "contrast_two_views",
    level: "B2",
    category: "contrast",
    frame_pa: "ਇੱਕ ਪਾਸੇ ..., ਜਦਕਿ ਦੂਜੇ ਪਾਸੇ ...",
    frame_rom: "ikk pase ..., jadki duje pase ...",
    frame_vi: "Một mặt ..., trong khi mặt khác ...",
    frame_en: "On one hand ..., whereas on the other hand ...",
    use_case_vi: "Đối chiếu hai quan điểm hoặc hai kết quả.",
    use_case_en: "Contrasts two views or two findings.",
    examples: [
      {
        pa: "ਇੱਕ ਪਾਸੇ ਖਰਚ ਘਟਦਾ ਹੈ, ਜਦਕਿ ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦਾ ਖ਼ਤਰਾ ਵਧਦਾ ਹੈ।",
        rom: "ikk pase kharch ghatda hai, jadki duje pase gunvatta da khatra vadhda hai.",
        vi: "Một mặt chi phí giảm, mặt khác rủi ro về chất lượng tăng.",
        en: "On one hand cost falls, whereas on the other hand quality risk increases.",
      },
    ],
    cautions_vi: "Hai vế nên cân xứng; đừng đặt một vế quá dài và một vế quá ngắn.",
    cautions_en: "Keep the two sides balanced; avoid one very long side and one very short side.",
    practice_prompt_vi: "So sánh học trực tuyến và học trực tiếp bằng frame này.",
    practice_prompt_en: "Compare online and in-person learning with this frame.",
  },
  {
    id: "concede_limit",
    level: "C1",
    category: "concession",
    frame_pa: "ਭਾਵੇਂ ... ਮਹੱਤਵਪੂਰਨ ਹੈ, ਫਿਰ ਵੀ ... ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।",
    frame_rom: "bhaven ... mahatvapuran hai, phir vi ... nu nazarandaz nahi kita ja sakda.",
    frame_vi: "Mặc dù ... là quan trọng, tuy vậy không thể bỏ qua ...",
    frame_en: "Although ... is important, ... cannot be ignored.",
    use_case_vi: "Thừa nhận một điểm mạnh trước khi nêu giới hạn.",
    use_case_en: "Acknowledges a strength before presenting a limitation.",
    examples: [
      {
        pa: "ਭਾਵੇਂ ਤੇਜ਼ੀ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਫਿਰ ਵੀ ਸਹੀਪਣ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।",
        rom: "bhaven tezi mahatvapuran hai, phir vi sahiapan nu nazarandaz nahi kita ja sakda.",
        vi: "Mặc dù tốc độ quan trọng, vẫn không thể bỏ qua độ chính xác.",
        en: "Although speed is important, accuracy cannot be ignored.",
      },
    ],
    cautions_vi: "Cấu trúc này không phải phản đối thô; nó tạo lập luận cân bằng.",
    cautions_en: "This is not blunt disagreement; it creates a balanced argument.",
    practice_prompt_vi: "Thừa nhận lợi ích của công nghệ rồi nêu một giới hạn.",
    practice_prompt_en: "Acknowledge a benefit of technology and then state one limitation.",
  },
  {
    id: "cause_effect",
    level: "B2",
    category: "cause_effect",
    frame_pa: "... ਦੇ ਕਾਰਨ ... ਉੱਤੇ ਸਿੱਧਾ ਪ੍ਰਭਾਵ ਪੈਂਦਾ ਹੈ।",
    frame_rom: "... de karan ... utte siddha prabhav painda hai.",
    frame_vi: "Do ..., có tác động trực tiếp đến ...",
    frame_en: "Because of ..., there is a direct effect on ...",
    use_case_vi: "Nêu quan hệ nguyên nhân-kết quả rõ ràng.",
    use_case_en: "States a clear cause-effect relationship.",
    examples: [
      {
        pa: "ਸਰੋਤਾਂ ਦੀ ਘਾਟ ਦੇ ਕਾਰਨ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਉੱਤੇ ਸਿੱਧਾ ਪ੍ਰਭਾਵ ਪੈਂਦਾ ਹੈ।",
        rom: "sarotan di ghat de karan seva di gunvatta utte siddha prabhav painda hai.",
        vi: "Do thiếu nguồn lực, chất lượng dịch vụ bị ảnh hưởng trực tiếp.",
        en: "Because of limited resources, service quality is directly affected.",
      },
    ],
    cautions_vi: "Chỉ dùng ਸਿੱਧਾ nếu quan hệ nhân quả thật sự trực tiếp.",
    cautions_en: "Use ਸਿੱਧਾ only when the causal link is truly direct.",
    practice_prompt_vi: "Viết một câu về nguyên nhân của việc chậm tiến độ.",
    practice_prompt_en: "Write one sentence about the cause of a project delay.",
  },
  {
    id: "evaluate_strength",
    level: "C1",
    category: "evaluate",
    frame_pa: "ਇਸ ਦਲੀਲ ਦੀ ਮਜ਼ਬੂਤੀ ... ਵਿੱਚ ਹੈ, ਪਰ ਇਸ ਦੀ ਕਮਜ਼ੋਰੀ ... ਹੈ।",
    frame_rom: "is daleel di mazbuti ... vich hai, par is di kamzori ... hai.",
    frame_vi: "Điểm mạnh của lập luận này nằm ở ..., nhưng điểm yếu là ...",
    frame_en: "The strength of this argument lies in ..., but its weakness is ...",
    use_case_vi: "Đánh giá lập luận theo cả mặt mạnh và yếu.",
    use_case_en: "Evaluates an argument through both strengths and weaknesses.",
    examples: [
      {
        pa: "ਇਸ ਦਲੀਲ ਦੀ ਮਜ਼ਬੂਤੀ ਸਪਸ਼ਟ ਸਬੂਤ ਵਿੱਚ ਹੈ, ਪਰ ਇਸ ਦੀ ਕਮਜ਼ੋਰੀ ਸੀਮਿਤ ਨਮੂਨਾ ਹੈ।",
        rom: "is daleel di mazbuti spasht sabut vich hai, par is di kamzori simit namuna hai.",
        vi: "Điểm mạnh là bằng chứng rõ, nhưng điểm yếu là mẫu nghiên cứu hạn chế.",
        en: "Its strength lies in clear evidence, but its weakness is the limited sample.",
      },
    ],
    cautions_vi: "Không chỉ nói 'tốt/xấu'; nêu tiêu chí đánh giá cụ thể.",
    cautions_en: "Do not just say 'good/bad'; state a specific evaluation criterion.",
    practice_prompt_vi: "Đánh giá một lập luận về học trực tuyến.",
    practice_prompt_en: "Evaluate an argument about online learning.",
  },
  {
    id: "define_term",
    level: "B2",
    category: "define",
    frame_pa: "ਇੱਥੇ ... ਤੋਂ ਭਾਵ ... ਹੈ।",
    frame_rom: "itthe ... ton bhav ... hai.",
    frame_vi: "Ở đây, ... có nghĩa là ...",
    frame_en: "Here, ... means ...",
    use_case_vi: "Định nghĩa thuật ngữ để tránh mơ hồ.",
    use_case_en: "Defines a term to avoid ambiguity.",
    examples: [
      {
        pa: "ਇੱਥੇ ਸਮਾਨਤਾ ਤੋਂ ਭਾਵ ਮੌਕਿਆਂ ਦੀ ਬਰਾਬਰੀ ਹੈ।",
        rom: "itthe samanta ton bhav maukian di barabari hai.",
        vi: "Ở đây, bình đẳng có nghĩa là bình đẳng về cơ hội.",
        en: "Here, equality means equality of opportunity.",
      },
    ],
    cautions_vi: "Hữu ích cho khái niệm rộng; không cần định nghĩa từ quá phổ thông.",
    cautions_en: "Useful for broad concepts; unnecessary for very common terms.",
    practice_prompt_vi: "Định nghĩa 'thành công' trong một bài luận học thuật.",
    practice_prompt_en: "Define 'success' in an academic essay.",
  },
  {
    id: "summarize_findings",
    level: "B2",
    category: "summarize",
    frame_pa: "ਸੰਖੇਪ ਵਿੱਚ, ਮੁੱਖ ਨਤੀਜੇ ਇਹ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ...",
    frame_rom: "sankhep vich, mukh natije eh darsaaunde han ki ...",
    frame_vi: "Tóm lại, các kết quả chính cho thấy rằng ...",
    frame_en: "In summary, the main findings show that ...",
    use_case_vi: "Tóm tắt phần kết quả hoặc đoạn thân bài.",
    use_case_en: "Summarizes a results section or body paragraph.",
    examples: [
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ, ਮੁੱਖ ਨਤੀਜੇ ਇਹ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਯੋਜਨਾ ਅੰਸ਼ਕ ਤੌਰ ਤੇ ਸਫ਼ਲ ਰਹੀ।",
        rom: "sankhep vich, mukh natije eh darsaaunde han ki yojna anshak taur te safal rahi.",
        vi: "Tóm lại, kết quả chính cho thấy kế hoạch thành công một phần.",
        en: "In summary, the main findings show that the plan was partly successful.",
      },
    ],
    cautions_vi: "Tóm tắt không thêm bằng chứng mới; chỉ gom lại ý đã nói.",
    cautions_en: "A summary should not add new evidence; it gathers what has already been said.",
    practice_prompt_vi: "Tóm tắt ba kết quả của một khảo sát giả định.",
    practice_prompt_en: "Summarize three findings from a hypothetical survey.",
  },
  {
    id: "conclude_conditional",
    level: "C1",
    category: "conclude",
    frame_pa: "ਇਸ ਲਈ, ਜੇ ... ਪੂਰਾ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ... ਵਾਜਬ ਨਤੀਜਾ ਹੋ ਸਕਦਾ ਹੈ।",
    frame_rom: "is lai, je ... pura kita jave, tan ... vajab natija ho sakda hai.",
    frame_vi: "Vì vậy, nếu ... được đáp ứng, thì ... có thể là kết luận hợp lý.",
    frame_en: "Therefore, if ... is fulfilled, ... may be a reasonable conclusion.",
    use_case_vi: "Kết luận có điều kiện, phù hợp C1 thay vì khẳng định tuyệt đối.",
    use_case_en: "Conditional conclusion, suitable for C1 instead of an absolute claim.",
    examples: [
      {
        pa: "ਇਸ ਲਈ, ਜੇ ਫੰਡਿੰਗ ਪੂਰੀ ਕੀਤੀ ਜਾਵੇ, ਤਾਂ ਵਿਸਥਾਰ ਵਾਜਬ ਨਤੀਜਾ ਹੋ ਸਕਦਾ ਹੈ।",
        rom: "is lai, je funding puri kiti jave, tan visthar vajab natija ho sakda hai.",
        vi: "Vì vậy, nếu tài trợ được đáp ứng, mở rộng có thể là kết luận hợp lý.",
        en: "Therefore, if funding is secured, expansion may be a reasonable conclusion.",
      },
    ],
    cautions_vi: "Vế điều kiện phải thực tế; tránh kết luận quá mạnh so với bằng chứng.",
    cautions_en: "The condition must be realistic; avoid conclusions stronger than the evidence.",
    practice_prompt_vi: "Viết kết luận có điều kiện cho một đề xuất chính sách.",
    practice_prompt_en: "Write a conditional conclusion for a policy proposal.",
  },
  {
    id: "polite_disagree",
    level: "C1",
    category: "polite_disagree",
    frame_pa: "ਮੈਂ ਇਸ ਵਿਚਾਰ ਨੂੰ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ, ਪਰ ਮੇਰੀ ਆਪਤੀ ਇਹ ਹੈ ਕਿ ...",
    frame_rom: "main is vichar nu samajhda/samajhdi han, par meri aapatti eh hai ki ...",
    frame_vi: "Tôi hiểu quan điểm này, nhưng phản biện của tôi là ...",
    frame_en: "I understand this view, but my objection is that ...",
    use_case_vi: "Bất đồng lịch sự trong thảo luận học thuật hoặc chuyên nghiệp.",
    use_case_en: "Polite disagreement in academic or professional discussion.",
    examples: [
      {
        pa: "ਮੈਂ ਇਸ ਵਿਚਾਰ ਨੂੰ ਸਮਝਦਾ ਹਾਂ, ਪਰ ਮੇਰੀ ਆਪਤੀ ਇਹ ਹੈ ਕਿ ਲਾਗਤ ਨੂੰ ਘੱਟ ਅੰਕਿਆ ਗਿਆ ਹੈ।",
        rom: "main is vichar nu samajhda han, par meri aapatti eh hai ki lagat nu ghatt ankia gia hai.",
        vi: "Tôi hiểu quan điểm này, nhưng phản biện của tôi là chi phí đã bị đánh giá thấp.",
        en: "I understand this view, but my objection is that the cost has been underestimated.",
      },
    ],
    cautions_vi: "Mở bằng công nhận để giảm đối đầu; sau đó nêu phản biện cụ thể.",
    cautions_en: "Open with acknowledgment to reduce confrontation; then state a specific objection.",
    practice_prompt_vi: "Phản biện lịch sự ý kiến rằng tốc độ luôn quan trọng hơn chất lượng.",
    practice_prompt_en: "Politely challenge the idea that speed is always more important than quality.",
  },
] as const;

const variants = [
  {
    suffix: "research",
    levelShift: "B2",
    viContext: "trong đoạn nghiên cứu",
    enContext: "in a research paragraph",
    paContext: "ਖੋਜੀ ਪੈਰੇ ਵਿੱਚ",
    romContext: "khoji paire vich",
  },
  {
    suffix: "essay",
    levelShift: "C1",
    viContext: "trong bài luận",
    enContext: "in an essay",
    paContext: "ਲੇਖ ਵਿੱਚ",
    romContext: "lekh vich",
  },
  {
    suffix: "presentation",
    levelShift: "C1",
    viContext: "trong bài thuyết trình học thuật",
    enContext: "in an academic presentation",
    paContext: "ਅਕਾਦਮਿਕ ਪੇਸ਼ਕਾਰੀ ਵਿੱਚ",
    romContext: "academic peshkari vich",
  },
  {
    suffix: "advanced",
    levelShift: "C2",
    viContext: "trong phân tích nâng cao",
    enContext: "in advanced analysis",
    paContext: "ਉੱਚ ਪੱਧਰੀ ਵਿਸ਼ਲੇਸ਼ਣ ਵਿੱਚ",
    romContext: "uchch paddari vishleshan vich",
  },
] as const;

export const academicFrames: PunjabiAcademicFrame[] = frameSeeds.flatMap((seed) =>
  variants.map((variant) => ({
    ...seed,
    id: `pa_af_${seed.category}_${seed.id}_${variant.suffix}`,
    level: variant.levelShift,
    frame_pa: `${variant.paContext}, ${seed.frame_pa}`,
    frame_rom: `${variant.romContext}, ${seed.frame_rom}`,
    frame_vi: `${seed.frame_vi} (${variant.viContext}).`,
    frame_en: `${seed.frame_en} (${variant.enContext}).`,
    use_case_vi: `${seed.use_case_vi} Dùng ${variant.viContext}.`,
    use_case_en: `${seed.use_case_en} Use it ${variant.enContext}.`,
    practice_prompt_vi: `${seed.practice_prompt_vi} Hãy đặt câu ${variant.viContext}.`,
    practice_prompt_en: `${seed.practice_prompt_en} Write the sentence ${variant.enContext}.`,
  })),
);
