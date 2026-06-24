// Punjabi C1 research presentation pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiResearchPresentationCategory =
  | "introduce_research"
  | "define_scope"
  | "cite_evidence"
  | "compare_findings"
  | "present_limitations"
  | "transition_sections"
  | "answer_questions";

export type PunjabiResearchPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiResearchPresentationMove = {
  id: string;
  level: "C1";
  category: PunjabiResearchPresentationCategory;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  purpose_vi: string;
  purpose_en: string;
  presentation_phrases: readonly PunjabiResearchPhrase[];
  canada_example: PunjabiResearchPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
  practice_prompt_vi: string;
  practice_prompt_en: string;
};

export const researchPresentationScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính cho Punjabi. Shahmukhi chỉ được nhắc để nhận biết, không phải một khóa học riêng đầy đủ.",
  en: "This course uses Gurmukhi as the primary Punjabi script. Shahmukhi is mentioned only for awareness, not as a full separate course.",
} as const;

export const researchPresentationC1: PunjabiResearchPresentationMove[] = [
  {
    id: "pa_c1_rp_introduce_topic",
    level: "C1",
    category: "introduce_research",
    title_pa: "ਖੋਜ ਵਿਸ਼ੇ ਦੀ ਪਹਿਚਾਣ",
    title_rom: "khoj vishe di pahichan",
    title_vi: "Giới thiệu đề tài nghiên cứu",
    title_en: "Introducing the research topic",
    purpose_vi: "Mở bài thuyết trình bằng chủ đề, lý do chọn đề tài, và câu hỏi nghiên cứu.",
    purpose_en: "Open a presentation with topic, rationale, and research question.",
    presentation_phrases: [
      {
        pa: "ਮੇਰੀ ਖੋਜ ਦਾ ਕੇਂਦਰੀ ਵਿਸ਼ਾ ... ਹੈ।",
        rom: "meri khoj da kendri visha ... hai.",
        vi: "Chủ đề trung tâm của nghiên cứu của tôi là...",
        en: "The central topic of my research is...",
      },
      {
        pa: "ਇਹ ਵਿਸ਼ਾ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ...",
        rom: "ih visha mahatvapuran hai kyonki ...",
        vi: "Chủ đề này quan trọng vì...",
        en: "This topic is important because...",
      },
      {
        pa: "ਮੇਰਾ ਮੁੱਖ ਖੋਜ ਸਵਾਲ ਇਹ ਹੈ ਕਿ ...",
        rom: "mera mukh khoj sawal ih hai ki ...",
        vi: "Câu hỏi nghiên cứu chính của tôi là...",
        en: "My main research question is...",
      },
    ],
    canada_example: {
      context_vi: "Mở đầu bài nói về sinh viên quốc tế ở Canada.",
      context_en: "Opening a talk about international students in Canada.",
      pa: "ਮੇਰੀ ਖੋਜ ਦਾ ਕੇਂਦਰੀ ਵਿਸ਼ਾ ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਤਰਰਾਸ਼ਟਰੀ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਅਕਾਦਮਿਕ ਸਹਾਇਤਾ ਹੈ।",
      rom: "meri khoj da kendri visha Canada vich antarrashtri vidyarthian di academic sahaita hai.",
      vi: "Chủ đề trung tâm của nghiên cứu của tôi là hỗ trợ học thuật cho sinh viên quốc tế ở Canada.",
      en: "The central topic of my research is academic support for international students in Canada.",
    },
    learner_traps_vi: [
      "Đừng mở đầu bằng quá nhiều thông tin cá nhân; ưu tiên câu hỏi nghiên cứu.",
      "Tránh chủ đề quá rộng nếu không thể trả lời trong thời lượng bài nói.",
    ],
    learner_traps_en: [
      "Do not begin with too much personal background; prioritize the research question.",
      "Avoid a topic so broad that it cannot be answered within the presentation time.",
    ],
    practice_prompt_vi: "Chuẩn bị phần mở đầu 45 giây cho một nghiên cứu về đời sống sinh viên.",
    practice_prompt_en: "Prepare a 45-second opening for research about student life.",
  },
  {
    id: "pa_c1_rp_introduce_gap",
    level: "C1",
    category: "introduce_research",
    title_pa: "ਖੋਜ ਖਾਲੀ ਥਾਂ ਦਿਖਾਉਣਾ",
    title_rom: "khoj khali than dikhauna",
    title_vi: "Nêu khoảng trống nghiên cứu",
    title_en: "Showing the research gap",
    purpose_vi: "Nói cái đã biết và cái còn chưa rõ để dẫn vào nghiên cứu của bạn.",
    purpose_en: "State what is known and what remains unclear to motivate your study.",
    presentation_phrases: [
      {
        pa: "ਪਿਛਲੀ ਖੋਜ ਨੇ ... ਬਾਰੇ ਕਾਫ਼ੀ ਚਰਚਾ ਕੀਤੀ ਹੈ।",
        rom: "pichhli khoj ne ... bare kafi charcha kiti hai.",
        vi: "Nghiên cứu trước đã thảo luận khá nhiều về...",
        en: "Previous research has discussed ... substantially.",
      },
      {
        pa: "ਫਿਰ ਵੀ, ... ਬਾਰੇ ਘੱਟ ਧਿਆਨ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
        rom: "phir vi, ... bare ghatt dhian ditta gia hai.",
        vi: "Tuy vậy, ... được chú ý ít hơn.",
        en: "However, less attention has been given to...",
      },
      {
        pa: "ਇਹ ਖਾਲੀ ਥਾਂ ਮੇਰੀ ਖੋਜ ਲਈ ਆਧਾਰ ਬਣਦੀ ਹੈ।",
        rom: "ih khali than meri khoj lai adhar bandi hai.",
        vi: "Khoảng trống này tạo nền tảng cho nghiên cứu của tôi.",
        en: "This gap forms the basis for my research.",
      },
    ],
    canada_example: {
      context_vi: "Nêu khoảng trống về dịch vụ hỗ trợ ở các trường Canada.",
      context_en: "Stating a gap about support services at Canadian institutions.",
      pa: "ਫਿਰ ਵੀ, ਛੋਟੇ ਕੈਨੇਡੀਅਨ ਕਾਲਜਾਂ ਵਿੱਚ ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ ਬਾਰੇ ਘੱਟ ਧਿਆਨ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
      rom: "phir vi, chhote Canadian collegan vich bhashai sahaita bare ghatt dhian ditta gia hai.",
      vi: "Tuy vậy, hỗ trợ ngôn ngữ tại các cao đẳng nhỏ ở Canada được chú ý ít hơn.",
      en: "However, less attention has been given to language support in smaller Canadian colleges.",
    },
    learner_traps_vi: [
      "Đừng nói 'không ai nghiên cứu' nếu bạn chưa kiểm tra tài liệu đầy đủ.",
      "Khoảng trống nên hẹp và có thể nghiên cứu, không phải chỉ là sở thích cá nhân.",
    ],
    learner_traps_en: [
      "Do not say 'nobody has researched this' unless you have checked the literature carefully.",
      "A gap should be narrow and researchable, not only a personal interest.",
    ],
    practice_prompt_vi: "Nêu một khoảng trống nghiên cứu bằng ba câu: đã biết, chưa rõ, nghiên cứu của bạn.",
    practice_prompt_en: "State a research gap in three sentences: known, unclear, your study.",
  },
  {
    id: "pa_c1_rp_define_scope",
    level: "C1",
    category: "define_scope",
    title_pa: "ਖੋਜ ਦੀ ਹੱਦ ਨਿਰਧਾਰਤ ਕਰਨਾ",
    title_rom: "khoj di hadd nirdharat karna",
    title_vi: "Xác định phạm vi nghiên cứu",
    title_en: "Defining the research scope",
    purpose_vi: "Giới hạn đối tượng, thời gian, nơi chốn, hoặc khái niệm để bài nói không lan man.",
    purpose_en: "Limit population, time, place, or concept so the talk stays focused.",
    presentation_phrases: [
      {
        pa: "ਇਸ ਪੇਸ਼ਕਾਰੀ ਵਿੱਚ ਮੈਂ ... ਤੱਕ ਸੀਮਿਤ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।",
        rom: "is peshkari vich main ... takk simit rahanga/rahangi.",
        vi: "Trong bài thuyết trình này, tôi sẽ giới hạn ở...",
        en: "In this presentation, I will limit the focus to...",
      },
      {
        pa: "ਇੱਥੇ ... ਤੋਂ ਭਾਵ ... ਹੈ।",
        rom: "itthe ... ton bhav ... hai.",
        vi: "Ở đây, ... có nghĩa là...",
        en: "Here, ... means...",
      },
      {
        pa: "ਇਸ ਖੋਜ ਵਿੱਚ ... ਸ਼ਾਮਲ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।",
        rom: "is khoj vich ... shamil nahi kita gia.",
        vi: "Trong nghiên cứu này, ... không được bao gồm.",
        en: "This research does not include...",
      },
    ],
    canada_example: {
      context_vi: "Giới hạn phạm vi bài nói về nhà ở sinh viên tại Canada.",
      context_en: "Limiting a presentation about student housing in Canada.",
      pa: "ਇਸ ਪੇਸ਼ਕਾਰੀ ਵਿੱਚ ਮੈਂ ਟੋਰਾਂਟੋ ਅਤੇ ਵੈਨਕੂਵਰ ਦੇ ਵਿਦਿਆਰਥੀ ਕਿਰਾਏ ਤੱਕ ਸੀਮਿਤ ਰਹਾਂਗਾ।",
      rom: "is peshkari vich main Toronto ate Vancouver de vidyarthi kiraye takk simit rahanga.",
      vi: "Trong bài thuyết trình này, tôi sẽ giới hạn ở tiền thuê nhà của sinh viên tại Toronto và Vancouver.",
      en: "In this presentation, I will limit the focus to student rent in Toronto and Vancouver.",
    },
    learner_traps_vi: [
      "Không mở rộng phạm vi giữa bài nếu dữ liệu không hỗ trợ.",
      "Định nghĩa thuật ngữ quan trọng trước khi dùng nhiều lần.",
    ],
    learner_traps_en: [
      "Do not expand the scope mid-talk if the data does not support it.",
      "Define key terms before using them repeatedly.",
    ],
    practice_prompt_vi: "Giới hạn một đề tài rộng bằng đối tượng, địa điểm, và thời gian.",
    practice_prompt_en: "Limit a broad topic by population, place, and time.",
  },
  {
    id: "pa_c1_rp_cite_quantitative",
    level: "C1",
    category: "cite_evidence",
    title_pa: "ਅੰਕੜਿਆਂ ਨਾਲ ਸਬੂਤ ਦੇਣਾ",
    title_rom: "ankrian nal sabut dena",
    title_vi: "Dẫn bằng chứng định lượng",
    title_en: "Citing quantitative evidence",
    purpose_vi: "Nêu số liệu, nguồn, và ý nghĩa của số liệu trong bài nói.",
    purpose_en: "State data, source, and meaning in the presentation.",
    presentation_phrases: [
      {
        pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ...",
        rom: "uplabdh ankre darsaaunde han ki ...",
        vi: "Số liệu hiện có cho thấy rằng...",
        en: "The available figures indicate that...",
      },
      {
        pa: "ਇਸ ਅੰਕੜੇ ਦੀ ਮਹੱਤਤਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is ankre di mahatta ih hai ki ...",
        vi: "Ý nghĩa của số liệu này là...",
        en: "The significance of this figure is that...",
      },
      {
        pa: "ਇਸ ਨੂੰ ਪੂਰੇ ਸੰਦਰਭ ਵਿੱਚ ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is nu pure sandarbh vich vekhna chahida hai.",
        vi: "Điều này nên được xem trong toàn bộ bối cảnh.",
        en: "This should be viewed in the broader context.",
      },
    ],
    canada_example: {
      context_vi: "Trình bày số liệu giả định về đi lại của sinh viên ở Canada.",
      context_en: "Presenting hypothetical data about student commuting in Canada.",
      pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਕੈਨੇਡਾ ਦੇ ਵੱਡੇ ਸ਼ਹਿਰਾਂ ਵਿੱਚ ਆਵਾਜਾਈ ਦਾ ਸਮਾਂ ਵਿਦਿਆਰਥੀ ਰੁਟੀਨ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦਾ ਹੈ।",
      rom: "uplabdh ankre darsaaunde han ki Canada de vadde shehran vich aavajai da sama vidyarthi routine nu prabhavit karda hai.",
      vi: "Số liệu hiện có cho thấy thời gian đi lại ở các thành phố lớn của Canada ảnh hưởng đến lịch sinh hoạt sinh viên.",
      en: "The available figures indicate that commute time in large Canadian cities affects student routines.",
    },
    learner_traps_vi: [
      "Đừng đọc số liệu mà không giải thích vì sao nó quan trọng.",
      "Nếu số liệu là giả định trong bài luyện tập, hãy nói rõ đó là ví dụ luyện tập.",
    ],
    learner_traps_en: [
      "Do not read a number without explaining why it matters.",
      "If data is hypothetical in practice, make clear that it is a practice example.",
    ],
    practice_prompt_vi: "Trình bày một số liệu và giải thích ý nghĩa của nó trong hai câu.",
    practice_prompt_en: "Present one figure and explain its meaning in two sentences.",
  },
  {
    id: "pa_c1_rp_cite_qualitative",
    level: "C1",
    category: "cite_evidence",
    title_pa: "ਗੁਣਾਤਮਕ ਸਬੂਤ ਪੇਸ਼ ਕਰਨਾ",
    title_rom: "gunatmak sabut pesh karna",
    title_vi: "Trình bày bằng chứng định tính",
    title_en: "Presenting qualitative evidence",
    purpose_vi: "Dẫn phỏng vấn, quan sát, hoặc chủ đề lặp lại mà không khái quát quá mức.",
    purpose_en: "Use interviews, observations, or recurring themes without overgeneralizing.",
    presentation_phrases: [
      {
        pa: "ਭਾਗੀਦਾਰਾਂ ਦੇ ਜਵਾਬਾਂ ਵਿੱਚ ਇੱਕ ਸਾਂਝਾ ਵਿਸ਼ਾ ... ਸੀ।",
        rom: "bhagidaran de jawaban vich ikk sanjha visha ... si.",
        vi: "Trong câu trả lời của người tham gia, một chủ đề chung là...",
        en: "In participants' responses, one shared theme was...",
      },
      {
        pa: "ਇਹ ਉਦਾਹਰਨ ਵੱਡੇ ਰੁਝਾਨ ਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।",
        rom: "ih udaharan vadde rujhan nu samajhan vich madad kardi hai.",
        vi: "Ví dụ này giúp hiểu xu hướng lớn hơn.",
        en: "This example helps explain the broader pattern.",
      },
      {
        pa: "ਇਹ ਸਬੂਤ ਪ੍ਰਤੀਨਿਧੀ ਹੈ, ਪਰ ਪੂਰੀ ਆਬਾਦੀ ਲਈ ਅੰਤਿਮ ਨਹੀਂ।",
        rom: "ih sabut pratinidhi hai, par puri abadi lai antim nahi.",
        vi: "Bằng chứng này có tính đại diện, nhưng không phải kết luận cuối cho toàn bộ dân số.",
        en: "This evidence is illustrative, but not final for the whole population.",
      },
    ],
    canada_example: {
      context_vi: "Báo cáo chủ đề từ phỏng vấn sinh viên mới ở Canada.",
      context_en: "Reporting a theme from interviews with new students in Canada.",
      pa: "ਭਾਗੀਦਾਰਾਂ ਦੇ ਜਵਾਬਾਂ ਵਿੱਚ ਇੱਕ ਸਾਂਝਾ ਵਿਸ਼ਾ ਕੈਨੇਡਾ ਵਿੱਚ ਪਹਿਲੇ ਸੈਮੇਸਟਰ ਦੀ ਇਕੱਲਤਾ ਸੀ।",
      rom: "bhagidaran de jawaban vich ikk sanjha visha Canada vich pahile semester di ikallta si.",
      vi: "Trong câu trả lời của người tham gia, một chủ đề chung là sự cô đơn trong học kỳ đầu ở Canada.",
      en: "In participants' responses, one shared theme was loneliness during the first semester in Canada.",
    },
    learner_traps_vi: [
      "Một trích dẫn không chứng minh toàn bộ xu hướng nếu không có phân tích thêm.",
      "Không nói thay người tham gia; mô tả điều họ nói một cách cẩn trọng.",
    ],
    learner_traps_en: [
      "One quotation does not prove a whole pattern without further analysis.",
      "Do not speak over participants; describe what they said carefully.",
    ],
    practice_prompt_vi: "Tóm tắt một chủ đề từ ba câu trả lời phỏng vấn giả định.",
    practice_prompt_en: "Summarize one theme from three hypothetical interview answers.",
  },
  {
    id: "pa_c1_rp_compare_findings",
    level: "C1",
    category: "compare_findings",
    title_pa: "ਨਤੀਜਿਆਂ ਦੀ ਤੁਲਨਾ",
    title_rom: "natijian di tulna",
    title_vi: "So sánh kết quả",
    title_en: "Comparing findings",
    purpose_vi: "Nói kết quả của bạn giống hoặc khác nghiên cứu trước ở điểm nào.",
    purpose_en: "Show how your findings align with or differ from previous research.",
    presentation_phrases: [
      {
        pa: "ਮੇਰੇ ਨਤੀਜੇ ਪਿਛਲੀ ਖੋਜ ਨਾਲ ਇਸ ਪੱਖੋਂ ਮਿਲਦੇ ਹਨ ਕਿ ...",
        rom: "mere natije pichhli khoj nal is pakkhon milde han ki ...",
        vi: "Kết quả của tôi giống nghiên cứu trước ở điểm...",
        en: "My findings align with previous research in that...",
      },
      {
        pa: "ਫ਼ਰਕ ਇਹ ਹੈ ਕਿ ਮੇਰੇ ਡਾਟੇ ਵਿੱਚ ... ਵੱਧ ਸਪਸ਼ਟ ਹੈ।",
        rom: "farak ih hai ki mere data vich ... vadh spasht hai.",
        vi: "Điểm khác là trong dữ liệu của tôi, ... rõ hơn.",
        en: "The difference is that in my data, ... is more visible.",
      },
      {
        pa: "ਇਹ ਤੁਲਨਾ ਦੱਸਦੀ ਹੈ ਕਿ ...",
        rom: "ih tulna dassdi hai ki ...",
        vi: "So sánh này cho thấy rằng...",
        en: "This comparison suggests that...",
      },
    ],
    canada_example: {
      context_vi: "So sánh kết quả về hỗ trợ học thuật giữa các tỉnh bang Canada.",
      context_en: "Comparing findings about academic support across Canadian provinces.",
      pa: "ਫ਼ਰਕ ਇਹ ਹੈ ਕਿ ਮੇਰੇ ਡਾਟੇ ਵਿੱਚ ਅਲਬਰਟਾ ਦੇ ਛੋਟੇ ਕੈਂਪਸਾਂ ਦੀ ਭੂਮਿਕਾ ਵੱਧ ਸਪਸ਼ਟ ਹੈ।",
      rom: "farak ih hai ki mere data vich Alberta de chhote campusan di bhumika vadh spasht hai.",
      vi: "Điểm khác là trong dữ liệu của tôi, vai trò của các cơ sở nhỏ ở Alberta rõ hơn.",
      en: "The difference is that in my data, the role of smaller Alberta campuses is more visible.",
    },
    learner_traps_vi: [
      "So sánh cần tiêu chí rõ: mẫu, địa điểm, phương pháp, hoặc thời điểm.",
      "Không xem khác biệt là lỗi ngay; nó có thể do bối cảnh hoặc phương pháp.",
    ],
    learner_traps_en: [
      "Comparison needs a clear criterion: sample, location, method, or time.",
      "Do not treat difference as error immediately; it may come from context or method.",
    ],
    practice_prompt_vi: "So sánh kết quả của bạn với một nghiên cứu trước bằng ba câu.",
    practice_prompt_en: "Compare your finding with a previous study in three sentences.",
  },
  {
    id: "pa_c1_rp_present_limitations",
    level: "C1",
    category: "present_limitations",
    title_pa: "ਸੀਮਾਵਾਂ ਪੇਸ਼ ਕਰਨਾ",
    title_rom: "simavan pesh karna",
    title_vi: "Trình bày giới hạn",
    title_en: "Presenting limitations",
    purpose_vi: "Nêu giới hạn mà vẫn giữ giá trị của nghiên cứu.",
    purpose_en: "State limitations while preserving the value of the research.",
    presentation_phrases: [
      {
        pa: "ਇਸ ਅਧਿਐਨ ਦੀ ਇੱਕ ਸੀਮਾ ... ਹੈ।",
        rom: "is adhian di ikk sima ... hai.",
        vi: "Một giới hạn của nghiên cứu này là...",
        en: "One limitation of this study is...",
      },
      {
        pa: "ਇਸ ਕਰਕੇ ਨਤੀਜਿਆਂ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is karke natijian nu savdhani nal parhna chahida hai.",
        vi: "Vì vậy, kết quả nên được hiểu một cách thận trọng.",
        en: "Therefore, the findings should be interpreted with caution.",
      },
      {
        pa: "ਫਿਰ ਵੀ, ਇਹ ਅਧਿਐਨ ... ਬਾਰੇ ਲਾਭਦਾਇਕ ਝਲਕ ਦਿੰਦਾ ਹੈ।",
        rom: "phir vi, ih adhian ... bare labhdayak jhalak dinda hai.",
        vi: "Tuy vậy, nghiên cứu này cung cấp góc nhìn hữu ích về...",
        en: "Nevertheless, this study offers useful insight into...",
      },
    ],
    canada_example: {
      context_vi: "Nêu giới hạn của khảo sát nhỏ tại một trường Canada.",
      context_en: "Stating limitations of a small survey at one Canadian institution.",
      pa: "ਇਸ ਅਧਿਐਨ ਦੀ ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ਨਮੂਨਾ ਸਿਰਫ਼ ਇੱਕ ਕੈਨੇਡੀਅਨ ਯੂਨੀਵਰਸਿਟੀ ਤੋਂ ਲਿਆ ਗਿਆ।",
      rom: "is adhian di ikk sima ih hai ki namuna sirf ikk Canadian university ton lia gia.",
      vi: "Một giới hạn của nghiên cứu này là mẫu chỉ được lấy từ một đại học Canada.",
      en: "One limitation of this study is that the sample was taken from only one Canadian university.",
    },
    learner_traps_vi: [
      "Đừng che giấu giới hạn; người nghe học thuật mong đợi phần này.",
      "Không làm nghiên cứu nghe vô giá trị; nêu giới hạn rồi nêu đóng góp.",
    ],
    learner_traps_en: [
      "Do not hide limitations; academic audiences expect them.",
      "Do not make the study sound worthless; state the limitation and then the contribution.",
    ],
    practice_prompt_vi: "Nêu một giới hạn về mẫu nghiên cứu và một đóng góp còn lại.",
    practice_prompt_en: "State one sampling limitation and one remaining contribution.",
  },
  {
    id: "pa_c1_rp_transition_sections",
    level: "C1",
    category: "transition_sections",
    title_pa: "ਭਾਗਾਂ ਵਿਚਕਾਰ ਬਦਲਾਅ",
    title_rom: "bhagan vichkar badlaa",
    title_vi: "Chuyển phần trong bài nói",
    title_en: "Transitioning between sections",
    purpose_vi: "Giúp người nghe theo dõi cấu trúc và biết bạn đang chuyển từ phần nào sang phần nào.",
    purpose_en: "Help listeners track structure and understand movement between sections.",
    presentation_phrases: [
      {
        pa: "ਹੁਣ ਜਦੋਂ ਪਿਛੋਕੜ ਸਪਸ਼ਟ ਹੋ ਗਿਆ ਹੈ, ਮੈਂ ਵਿਧੀ ਵੱਲ ਆਉਂਦਾ/ਆਉਂਦੀ ਹਾਂ।",
        rom: "hun jadon pichhokar spasht ho gia hai, main vidhi vall aunda/aundi han.",
        vi: "Bây giờ khi bối cảnh đã rõ, tôi chuyển sang phương pháp.",
        en: "Now that the background is clear, I will move to the method.",
      },
      {
        pa: "ਅਗਲਾ ਭਾਗ ਨਤੀਜਿਆਂ ਤੇ ਕੇਂਦਰਿਤ ਹੈ।",
        rom: "agla bhag natijian te kendrit hai.",
        vi: "Phần tiếp theo tập trung vào kết quả.",
        en: "The next section focuses on the findings.",
      },
      {
        pa: "ਇਸ ਤੋਂ ਬਾਅਦ ਮੈਂ ਸੀਮਾਵਾਂ ਅਤੇ ਅਗਲੇ ਕਦਮਾਂ ਬਾਰੇ ਗੱਲ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।",
        rom: "is ton baad main simavan ate agle kadman bare gall karanga/karanggi.",
        vi: "Sau đó tôi sẽ nói về giới hạn và các bước tiếp theo.",
        en: "After this, I will discuss limitations and next steps.",
      },
    ],
    canada_example: {
      context_vi: "Chuyển từ bối cảnh sang phương pháp trong bài nói về sinh viên Canada.",
      context_en: "Moving from background to method in a talk about Canadian students.",
      pa: "ਹੁਣ ਜਦੋਂ ਕੈਨੇਡਾ ਦਾ ਸੰਦਰਭ ਸਪਸ਼ਟ ਹੋ ਗਿਆ ਹੈ, ਮੈਂ ਆਪਣੀ ਇੰਟਰਵਿਊ ਵਿਧੀ ਵੱਲ ਆਉਂਦੀ ਹਾਂ।",
      rom: "hun jadon Canada da sandarbh spasht ho gia hai, main apni interview vidhi vall aundi han.",
      vi: "Bây giờ khi bối cảnh Canada đã rõ, tôi chuyển sang phương pháp phỏng vấn của mình.",
      en: "Now that the Canadian context is clear, I will move to my interview method.",
    },
    learner_traps_vi: [
      "Đừng chuyển slide im lặng; hãy báo cho người nghe biết mục đích phần mới.",
      "Tránh dùng cùng một câu chuyển cho mọi phần.",
    ],
    learner_traps_en: [
      "Do not change slides silently; tell listeners the purpose of the new section.",
      "Avoid using the same transition sentence for every section.",
    ],
    practice_prompt_vi: "Viết ba câu chuyển: bối cảnh sang phương pháp, phương pháp sang kết quả, kết quả sang kết luận.",
    practice_prompt_en: "Write three transitions: background to method, method to findings, findings to conclusion.",
  },
  {
    id: "pa_c1_rp_answer_clarifying",
    level: "C1",
    category: "answer_questions",
    title_pa: "ਸਵਾਲ ਨੂੰ ਸਪਸ਼ਟ ਕਰਕੇ ਜਵਾਬ ਦੇਣਾ",
    title_rom: "sawal nu spasht karke jawab dena",
    title_vi: "Làm rõ câu hỏi rồi trả lời",
    title_en: "Clarifying before answering",
    purpose_vi: "Xử lý câu hỏi phức tạp bằng cách xác nhận ý hỏi trước khi trả lời.",
    purpose_en: "Handle complex questions by confirming the question before answering.",
    presentation_phrases: [
      {
        pa: "ਜੇ ਮੈਂ ਤੁਹਾਡਾ ਸਵਾਲ ਠੀਕ ਸਮਝਿਆ ਹੈ, ਤੁਸੀਂ ਪੁੱਛ ਰਹੇ ਹੋ ਕਿ ...",
        rom: "je main tuhadda sawal thik samjhia hai, tusi puchh rahe ho ki ...",
        vi: "Nếu tôi hiểu đúng câu hỏi của bạn, bạn đang hỏi rằng...",
        en: "If I understood your question correctly, you are asking whether...",
      },
      {
        pa: "ਇਸ ਦਾ ਛੋਟਾ ਜਵਾਬ ... ਹੈ, ਪਰ ਵੇਰਵਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is da chhota jawab ... hai, par verva ih hai ki ...",
        vi: "Câu trả lời ngắn là..., nhưng chi tiết là...",
        en: "The short answer is..., but the detail is that...",
      },
      {
        pa: "ਇਹ ਮੇਰੇ ਅਧਿਐਨ ਦੀ ਹੱਦ ਤੋਂ ਕੁਝ ਬਾਹਰ ਹੈ, ਪਰ ...",
        rom: "ih mere adhian di hadd ton kujh bahar hai, par ...",
        vi: "Điều này hơi ngoài phạm vi nghiên cứu của tôi, nhưng...",
        en: "This is somewhat outside the scope of my study, but...",
      },
    ],
    canada_example: {
      context_vi: "Trả lời câu hỏi về việc mở rộng nghiên cứu sang các tỉnh khác ở Canada.",
      context_en: "Answering a question about extending the study to other Canadian provinces.",
      pa: "ਇਹ ਮੇਰੇ ਅਧਿਐਨ ਦੀ ਹੱਦ ਤੋਂ ਕੁਝ ਬਾਹਰ ਹੈ, ਪਰ ਹੋਰ ਕੈਨੇਡੀਅਨ ਸੂਬਿਆਂ ਨਾਲ ਤੁਲਨਾ ਅਗਲਾ ਲਾਭਦਾਇਕ ਕਦਮ ਹੋਵੇਗਾ।",
      rom: "ih mere adhian di hadd ton kujh bahar hai, par hor Canadian subian nal tulna agla labhdayak kadam hovega.",
      vi: "Điều này hơi ngoài phạm vi nghiên cứu của tôi, nhưng so sánh với các tỉnh bang khác của Canada sẽ là bước tiếp theo hữu ích.",
      en: "This is somewhat outside the scope of my study, but comparison with other Canadian provinces would be a useful next step.",
    },
    learner_traps_vi: [
      "Đừng trả lời ngay nếu bạn chưa hiểu câu hỏi; hãy diễn giải lại.",
      "Nếu ngoài phạm vi, nói rõ giới hạn rồi đưa hướng trả lời ngắn.",
    ],
    learner_traps_en: [
      "Do not answer immediately if you do not understand the question; rephrase it first.",
      "If it is out of scope, state the limit and give a short direction.",
    ],
    practice_prompt_vi: "Viết câu trả lời cho một câu hỏi khó: làm rõ, trả lời ngắn, nêu giới hạn.",
    practice_prompt_en: "Write an answer to a difficult question: clarify, answer briefly, state the limit.",
  },
  {
    id: "pa_c1_rp_answer_challenge",
    level: "C1",
    category: "answer_questions",
    title_pa: "ਆਲੋਚਨਾਤਮਕ ਸਵਾਲ ਦਾ ਜਵਾਬ",
    title_rom: "alochnatmak sawal da jawab",
    title_vi: "Trả lời câu hỏi phản biện",
    title_en: "Answering a critical question",
    purpose_vi: "Giữ giọng chuyên nghiệp khi người nghe chất vấn phương pháp hoặc kết luận.",
    purpose_en: "Maintain a professional tone when the audience challenges method or conclusion.",
    presentation_phrases: [
      {
        pa: "ਇਹ ਆਲੋਚਨਾ ਜਾਇਜ਼ ਹੈ, ਖ਼ਾਸ ਕਰਕੇ ... ਦੇ ਪੱਖੋਂ।",
        rom: "ih alochna jaiz hai, khas karke ... de pakkhon.",
        vi: "Phản biện này hợp lý, đặc biệt về mặt...",
        en: "This critique is valid, especially in terms of...",
      },
      {
        pa: "ਮੇਰੀ ਚੋਣ ਦਾ ਕਾਰਨ ਇਹ ਸੀ ਕਿ ...",
        rom: "meri chon da karan ih si ki ...",
        vi: "Lý do tôi chọn như vậy là...",
        en: "The reason for my choice was that...",
      },
      {
        pa: "ਅਗਲੀ ਖੋਜ ਇਸ ਕਮਜ਼ੋਰੀ ਨੂੰ ਹੋਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸੰਬੋਧਿਤ ਕਰ ਸਕਦੀ ਹੈ।",
        rom: "agli khoj is kamzori nu hor changi tarah sanbodhit kar sakdi hai.",
        vi: "Nghiên cứu tiếp theo có thể xử lý điểm yếu này tốt hơn.",
        en: "Future research can address this weakness more fully.",
      },
    ],
    canada_example: {
      context_vi: "Trả lời phản biện về việc chỉ khảo sát một thành phố Canada.",
      context_en: "Answering a critique about surveying only one Canadian city.",
      pa: "ਇਹ ਆਲੋਚਨਾ ਜਾਇਜ਼ ਹੈ, ਖ਼ਾਸ ਕਰਕੇ ਕੈਨੇਡਾ ਦੇ ਵੱਖ-ਵੱਖ ਸ਼ਹਿਰੀ ਸੰਦਰਭਾਂ ਦੇ ਪੱਖੋਂ।",
      rom: "ih alochna jaiz hai, khas karke Canada de vakh-vakh shehri sandarbhan de pakkhon.",
      vi: "Phản biện này hợp lý, đặc biệt xét về các bối cảnh đô thị khác nhau ở Canada.",
      en: "This critique is valid, especially in terms of Canada's different urban contexts.",
    },
    learner_traps_vi: [
      "Đừng phòng thủ cá nhân; phản hồi vào phương pháp, dữ liệu, hoặc phạm vi.",
      "Thừa nhận điểm hợp lý không làm bài nói yếu hơn nếu bạn giải thích được lựa chọn.",
    ],
    learner_traps_en: [
      "Do not become personally defensive; respond through method, data, or scope.",
      "Acknowledging a valid point does not weaken the talk if you can explain your choice.",
    ],
    practice_prompt_vi: "Trả lời một phản biện về mẫu nghiên cứu quá nhỏ bằng giọng học thuật.",
    practice_prompt_en: "Answer a critique about a small sample size in an academic tone.",
  },
];
