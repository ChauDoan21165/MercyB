// Punjabi C1 critical reading pack for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiCriticalReadingCategory =
  | "identify_claim"
  | "identify_evidence"
  | "identify_limitation"
  | "identify_bias"
  | "contrast"
  | "implied_meaning"
  | "summary"
  | "response_frames";

export type PunjabiCriticalReadingTextType = "academic" | "public_service";

export type PunjabiReadingPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiCriticalReadingEntry = {
  id: string;
  level: "C1";
  category: PunjabiCriticalReadingCategory;
  text_type: PunjabiCriticalReadingTextType;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  reading_goal_vi: string;
  reading_goal_en: string;
  sample_text: PunjabiReadingPhrase;
  analysis_prompts: readonly PunjabiReadingPhrase[];
  canada_example: PunjabiReadingPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
  response_frame: PunjabiReadingPhrase;
};

export const criticalReadingScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const criticalReadingC1: PunjabiCriticalReadingEntry[] = [
  {
    id: "pa_c1_cr_claim_academic",
    level: "C1",
    category: "identify_claim",
    text_type: "academic",
    title_pa: "ਮੁੱਖ ਦਾਅਵਾ ਪਛਾਣਨਾ",
    title_rom: "mukh daava pachhanna",
    title_vi: "Xác định luận điểm chính",
    title_en: "Identifying the main claim",
    reading_goal_vi: "Tách luận điểm trung tâm khỏi bối cảnh, ví dụ, và chi tiết phụ.",
    reading_goal_en: "Separate the central claim from background, examples, and supporting details.",
    sample_text: {
      pa: "ਆਨਲਾਈਨ ਸਿੱਖਿਆ ਪਹੁੰਚ ਵਧਾ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਦੀ ਸਫ਼ਲਤਾ ਸਹਾਇਤਾ ਪ੍ਰਣਾਲੀਆਂ ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।",
      rom: "online sikhia pahunch vadha sakdi hai, par is di safalta sahaita pranalian te nirbhar kardi hai.",
      vi: "Giáo dục trực tuyến có thể mở rộng tiếp cận, nhưng thành công của nó phụ thuộc vào hệ thống hỗ trợ.",
      en: "Online education can expand access, but its success depends on support systems.",
    },
    analysis_prompts: [
      {
        pa: "ਲੇਖਕ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਕਿਹੜਾ ਹੈ?",
        rom: "lekhak da mukh daava kehra hai?",
        vi: "Luận điểm chính của tác giả là gì?",
        en: "What is the author's main claim?",
      },
      {
        pa: "ਕਿਹੜਾ ਹਿੱਸਾ ਸ਼ਰਤ ਜਾਂ ਸੀਮਾ ਦਿਖਾਉਂਦਾ ਹੈ?",
        rom: "kehda hissa sharat jaan seema dikhaounda hai?",
        vi: "Phần nào thể hiện điều kiện hoặc giới hạn?",
        en: "Which part shows a condition or limit?",
      },
    ],
    canada_example: {
      context_vi: "Đọc đoạn học thuật về học trực tuyến ở Canada.",
      context_en: "Reading an academic paragraph about online learning in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਿੰਡਾਂ ਵਿੱਚ ਆਨਲਾਈਨ ਸਿੱਖਿਆ ਪਹੁੰਚ ਵਧਾ ਸਕਦੀ ਹੈ, ਪਰ ਭਰੋਸੇਯੋਗ ਇੰਟਰਨੈੱਟ ਤੋਂ ਬਿਨਾਂ ਇਹ ਅਸਮਾਨਤਾ ਵੀ ਵਧਾ ਸਕਦੀ ਹੈ।",
      rom: "Canada de pindan vich online sikhia pahunch vadha sakdi hai, par bharoseyog internet ton bina ih asamanta vi vadha sakdi hai.",
      vi: "Ở vùng nông thôn Canada, học trực tuyến có thể mở rộng tiếp cận, nhưng nếu thiếu internet đáng tin cậy, nó cũng có thể làm tăng bất bình đẳng.",
      en: "In rural Canada, online learning can expand access, but without reliable internet it may also increase inequality.",
    },
    learner_traps_vi: [
      "Đừng nhầm câu ví dụ với luận điểm chính.",
      "Từ 'nhưng' thường báo hiệu phần giới hạn quan trọng.",
    ],
    learner_traps_en: [
      "Do not confuse an example sentence with the main claim.",
      "A 'but' clause often signals an important limitation.",
    ],
    response_frame: {
      pa: "ਮੇਰੇ ਖ਼ਿਆਲ ਵਿੱਚ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ...",
      rom: "mere khayal vich mukh daava ih hai ki ...",
      vi: "Theo tôi, luận điểm chính là...",
      en: "In my view, the main claim is that...",
    },
  },
  {
    id: "pa_c1_cr_evidence_academic",
    level: "C1",
    category: "identify_evidence",
    text_type: "academic",
    title_pa: "ਸਬੂਤ ਦੀ ਭੂਮਿਕਾ ਸਮਝਣਾ",
    title_rom: "sabut di bhumika samajhna",
    title_vi: "Hiểu vai trò của bằng chứng",
    title_en: "Understanding the role of evidence",
    reading_goal_vi: "Xác định bằng chứng hỗ trợ gì và nó mạnh/yếu ở điểm nào.",
    reading_goal_en: "Identify what the evidence supports and where it is strong or weak.",
    sample_text: {
      pa: "ਸਰਵੇਖਣ ਦੇ ਨਤੀਜੇ ਦੱਸਦੇ ਹਨ ਕਿ ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚ ਲਚਕਦਾਰ ਸਮਾਂ-ਸਾਰਣੀ ਦੀ ਮੰਗ ਵਧੀ ਹੈ।",
      rom: "sarvekhan de natije dassde han ki vidyarthian vich lachkdaar sama-sarni di mang vadhi hai.",
      vi: "Kết quả khảo sát cho thấy nhu cầu lịch học linh hoạt của sinh viên đã tăng.",
      en: "Survey results show that students' demand for flexible schedules has increased.",
    },
    analysis_prompts: [
      {
        pa: "ਇਹ ਸਬੂਤ ਕਿਹੜੇ ਦਾਅਵੇ ਨੂੰ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ?",
        rom: "ih sabut kehde daave nu samarthan dinda hai?",
        vi: "Bằng chứng này hỗ trợ luận điểm nào?",
        en: "Which claim does this evidence support?",
      },
      {
        pa: "ਕੀ ਸਰੋਤ ਅਤੇ ਨਮੂਨਾ ਸਪਸ਼ਟ ਹਨ?",
        rom: "ki sarot ate namuna spasht han?",
        vi: "Nguồn và mẫu khảo sát có rõ không?",
        en: "Are the source and sample clear?",
      },
    ],
    canada_example: {
      context_vi: "Đọc bằng chứng từ khảo sát sinh viên ở Canada.",
      context_en: "Reading evidence from a Canadian student survey.",
      pa: "ਇੱਕ ਕੈਨੇਡੀਅਨ ਕਾਲਜ ਦੇ ਸਰਵੇਖਣ ਵਿੱਚ ਬਹੁਤ ਸਾਰੇ ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਸ਼ਾਮ ਦੀਆਂ ਕਲਾਸਾਂ ਨੂੰ ਲਾਭਦਾਇਕ ਦੱਸਿਆ।",
      rom: "ikk Canadian college de sarvekhan vich bahut sare vidyarthian ne sham dian classan nu labhdayak dassia.",
      vi: "Trong khảo sát của một cao đẳng Canada, nhiều sinh viên cho rằng lớp buổi tối hữu ích.",
      en: "In a Canadian college survey, many students described evening classes as useful.",
    },
    learner_traps_vi: [
      "Bằng chứng không mạnh nếu không biết mẫu hoặc nguồn.",
      "Đừng nói 'chứng minh' khi bằng chứng chỉ 'gợi ý'.",
    ],
    learner_traps_en: [
      "Evidence is weaker when sample or source is unclear.",
      "Do not say 'proves' when the evidence only 'suggests'.",
    ],
    response_frame: {
      pa: "ਇਹ ਸਬੂਤ ਦਾਅਵੇ ਨੂੰ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ, ਪਰ ...",
      rom: "ih sabut daave nu samarthan dinda hai, par ...",
      vi: "Bằng chứng này hỗ trợ luận điểm, nhưng...",
      en: "This evidence supports the claim, but...",
    },
  },
  {
    id: "pa_c1_cr_limitation_academic",
    level: "C1",
    category: "identify_limitation",
    text_type: "academic",
    title_pa: "ਸੀਮਾ ਪਛਾਣਨਾ",
    title_rom: "seema pachhanna",
    title_vi: "Nhận diện giới hạn",
    title_en: "Identifying limitations",
    reading_goal_vi: "Tìm giới hạn về mẫu, phạm vi, phương pháp, hoặc kết luận.",
    reading_goal_en: "Find limitations in sample, scope, method, or conclusion.",
    sample_text: {
      pa: "ਇਹ ਅਧਿਐਨ ਸਿਰਫ਼ ਇੱਕ ਸੰਸਥਾ ਤੱਕ ਸੀਮਿਤ ਸੀ, ਇਸ ਲਈ ਨਤੀਜੇ ਸਭ ਥਾਵਾਂ ਲਈ ਲਾਗੂ ਨਹੀਂ ਹੋ ਸਕਦੇ।",
      rom: "ih adhian sirf ikk sanstha takk simit si, is lai natije sabh thavan lai lagu nahi ho sakde.",
      vi: "Nghiên cứu này chỉ giới hạn ở một cơ sở, vì vậy kết quả có thể không áp dụng cho mọi nơi.",
      en: "This study was limited to one institution, so the findings may not apply everywhere.",
    },
    analysis_prompts: [
      {
        pa: "ਲੇਖਕ ਨੇ ਕਿਹੜੀ ਸੀਮਾ ਮੰਨੀ ਹੈ?",
        rom: "lekhak ne kehri seema manni hai?",
        vi: "Tác giả thừa nhận giới hạn nào?",
        en: "Which limitation does the author acknowledge?",
      },
      {
        pa: "ਇਹ ਸੀਮਾ ਨਤੀਜੇ ਨੂੰ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀ ਹੈ?",
        rom: "ih seema natije nu kiven prabhavit kardi hai?",
        vi: "Giới hạn này ảnh hưởng đến kết luận thế nào?",
        en: "How does this limitation affect the conclusion?",
      },
    ],
    canada_example: {
      context_vi: "Đọc giới hạn của nghiên cứu ở một đại học Canada.",
      context_en: "Reading the limitation of a study at one Canadian university.",
      pa: "ਕਿਉਂਕਿ ਡਾਟਾ ਸਿਰਫ਼ ਇੱਕ ਕੈਨੇਡੀਅਨ ਯੂਨੀਵਰਸਿਟੀ ਤੋਂ ਇਕੱਠਾ ਕੀਤਾ ਗਿਆ, ਨਤੀਜਿਆਂ ਨੂੰ ਹੋਰ ਸੂਬਿਆਂ ਲਈ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "kyonki data sirf ikk Canadian university ton ikattha kita gia, natijian nu hor subian lai savdhani nal parhna chahida hai.",
      vi: "Vì dữ liệu chỉ được thu thập từ một đại học Canada, kết quả nên được đọc thận trọng khi áp dụng cho các tỉnh bang khác.",
      en: "Because the data was collected from only one Canadian university, the findings should be read cautiously for other provinces.",
    },
    learner_traps_vi: [
      "Giới hạn không làm bài vô giá trị; nó cho biết cách đọc kết quả.",
      "Đừng bỏ qua những từ như 'có thể', 'giới hạn', 'không áp dụng'.",
    ],
    learner_traps_en: [
      "A limitation does not make a study worthless; it tells you how to read the findings.",
      "Do not ignore words like 'may', 'limited', and 'not applicable'.",
    ],
    response_frame: {
      pa: "ਇਸ ਪਾਠ ਦੀ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ...",
      rom: "is path di ikk mahatvapuran seema ih hai ki ...",
      vi: "Một giới hạn quan trọng của văn bản này là...",
      en: "One important limitation of this text is that...",
    },
  },
  {
    id: "pa_c1_cr_bias_public",
    level: "C1",
    category: "identify_bias",
    text_type: "public_service",
    title_pa: "ਪੱਖਪਾਤ ਜਾਂ ਝੁਕਾਅ ਪਛਾਣਨਾ",
    title_rom: "pakhpaat jaan jhukao pachhanna",
    title_vi: "Nhận diện thiên lệch hoặc khuynh hướng",
    title_en: "Identifying bias or slant",
    reading_goal_vi: "Nhận ra lựa chọn từ ngữ, điều bị bỏ qua, và góc nhìn của văn bản.",
    reading_goal_en: "Notice word choice, omissions, and the text's point of view.",
    sample_text: {
      pa: "ਸਾਡੀ ਨਵੀਂ ਨੀਤੀ ਸਭ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਬੇਮਿਸਾਲ ਲਾਭ ਲਿਆਏਗੀ।",
      rom: "sadi navi niti sabh vidyarthian lai bemisal labh liaegi.",
      vi: "Chính sách mới của chúng tôi sẽ đem lại lợi ích chưa từng có cho mọi sinh viên.",
      en: "Our new policy will bring unmatched benefits to all students.",
    },
    analysis_prompts: [
      {
        pa: "ਕਿਹੜੇ ਸ਼ਬਦ ਬਹੁਤ ਪ੍ਰਚਾਰਕ ਲੱਗਦੇ ਹਨ?",
        rom: "kehde shabad bahut pracharak lagde han?",
        vi: "Những từ nào nghe mang tính quảng bá quá mức?",
        en: "Which words sound overly promotional?",
      },
      {
        pa: "ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਗੈਰਹਾਜ਼ਰ ਹੈ?",
        rom: "kehri jankari gairhazir hai?",
        vi: "Thông tin nào đang vắng mặt?",
        en: "What information is absent?",
      },
    ],
    canada_example: {
      context_vi: "Đọc thông báo dịch vụ công ở Canada với ngôn ngữ quảng bá.",
      context_en: "Reading a Canadian public-service notice with promotional language.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਇਹ ਨਵੀਂ ਸੇਵਾ ਹਰ ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੀ ਸਮੱਸਿਆ ਤੁਰੰਤ ਹੱਲ ਕਰੇਗੀ।",
      rom: "Canada vich ih navi seva har nave vidyarthi di samasya turant hall karegi.",
      vi: "Ở Canada, dịch vụ mới này sẽ giải quyết ngay mọi vấn đề của mỗi sinh viên mới.",
      en: "In Canada, this new service will immediately solve every new student's problem.",
    },
    learner_traps_vi: [
      "Từ mạnh như 'mọi', 'ngay lập tức', 'chưa từng có' cần được kiểm tra.",
      "Thiên lệch không luôn là sai; nó có thể là mục đích thuyết phục.",
    ],
    learner_traps_en: [
      "Strong words like 'all', 'immediately', and 'unmatched' need checking.",
      "Bias does not always mean false; it may reflect persuasive purpose.",
    ],
    response_frame: {
      pa: "ਇਸ ਪਾਠ ਵਿੱਚ ਝੁਕਾਅ ਇਸ ਗੱਲ ਤੋਂ ਦਿਖਦਾ ਹੈ ਕਿ ...",
      rom: "is path vich jhukao is gall ton dikhda hai ki ...",
      vi: "Khuynh hướng trong văn bản thể hiện ở chỗ...",
      en: "The slant in this text appears in the fact that...",
    },
  },
  {
    id: "pa_c1_cr_contrast_academic",
    level: "C1",
    category: "contrast",
    text_type: "academic",
    title_pa: "ਵਿਰੋਧੀ ਵਿਚਾਰਾਂ ਦੀ ਤੁਲਨਾ",
    title_rom: "virodhi vicharan di tulna",
    title_vi: "So sánh quan điểm đối lập",
    title_en: "Contrasting opposing views",
    reading_goal_vi: "Xác định hai quan điểm, tiêu chí so sánh, và điểm khác thật sự.",
    reading_goal_en: "Identify two views, the comparison criterion, and the real difference.",
    sample_text: {
      pa: "ਇੱਕ ਪੱਖ ਮੰਨਦਾ ਹੈ ਕਿ ਖਰਚਾ ਮੁੱਖ ਰੁਕਾਵਟ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਪੱਖ ਤਿਆਰੀ ਦੀ ਘਾਟ ਨੂੰ ਵਧੇਰੇ ਮਹੱਤਵ ਦਿੰਦਾ ਹੈ।",
      rom: "ikk pakh mannda hai ki kharcha mukh rukavat hai, jadki duja pakh tiari di ghat nu vadhere mahatav dinda hai.",
      vi: "Một phía cho rằng chi phí là rào cản chính, trong khi phía kia coi thiếu chuẩn bị quan trọng hơn.",
      en: "One side argues that cost is the main barrier, whereas the other gives more importance to lack of preparation.",
    },
    analysis_prompts: [
      {
        pa: "ਦੋਵੇਂ ਪੱਖ ਕਿਹੜੇ ਮੁੱਦੇ ਤੇ ਵੱਖ ਹਨ?",
        rom: "dovein pakh kehde mudde te vakh han?",
        vi: "Hai phía khác nhau ở vấn đề nào?",
        en: "On which issue do the two sides differ?",
      },
      {
        pa: "ਕੀ ਦੋਵੇਂ ਇੱਕੋ ਸਮੱਸਿਆ ਦੀ ਗੱਲ ਕਰ ਰਹੇ ਹਨ?",
        rom: "ki dovein ikko samasya di gall kar rahe han?",
        vi: "Hai phía có đang nói về cùng một vấn đề không?",
        en: "Are both sides discussing the same problem?",
      },
    ],
    canada_example: {
      context_vi: "Đọc hai quan điểm về học phí ở Canada.",
      context_en: "Reading two views about tuition in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਇੱਕ ਪੱਖ ਫੀਸ ਨੂੰ ਮੁੱਖ ਰੁਕਾਵਟ ਮੰਨਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਪੱਖ ਰਹਿਣ-ਸਹਿਣ ਦੇ ਖਰਚੇ ਨੂੰ ਵੱਡੀ ਚੁਣੌਤੀ ਮੰਨਦਾ ਹੈ।",
      rom: "Canada vich ikk pakh fees nu mukh rukavat mannda hai, jadki duja pakh rehan-sehan de kharche nu vaddi chunauti mannda hai.",
      vi: "Ở Canada, một phía xem học phí là rào cản chính, trong khi phía kia xem chi phí sinh hoạt là thách thức lớn.",
      en: "In Canada, one side sees tuition as the main barrier, whereas the other sees living costs as the larger challenge.",
    },
    learner_traps_vi: [
      "Đừng gọi hai ý là đối lập nếu chúng chỉ bổ sung cho nhau.",
      "So sánh phải dựa trên cùng một tiêu chí.",
    ],
    learner_traps_en: [
      "Do not call two ideas opposed if they only complement each other.",
      "Comparison must use the same criterion.",
    ],
    response_frame: {
      pa: "ਦੋਵੇਂ ਵਿਚਾਰਾਂ ਵਿਚਕਾਰ ਮੁੱਖ ਫ਼ਰਕ ਇਹ ਹੈ ਕਿ ...",
      rom: "dovein vicharan vichkar mukh farak ih hai ki ...",
      vi: "Khác biệt chính giữa hai quan điểm là...",
      en: "The main difference between the two views is that...",
    },
  },
  {
    id: "pa_c1_cr_implied_public",
    level: "C1",
    category: "implied_meaning",
    text_type: "public_service",
    title_pa: "ਅਪਰੋਕਸ਼ ਅਰਥ ਸਮਝਣਾ",
    title_rom: "aproaksh arth samajhna",
    title_vi: "Hiểu hàm ý",
    title_en: "Understanding implied meaning",
    reading_goal_vi: "Đọc điều văn bản ngụ ý nhưng không nói trực tiếp.",
    reading_goal_en: "Read what the text implies but does not state directly.",
    sample_text: {
      pa: "ਦੇਰੀ ਤੋਂ ਬਚਣ ਲਈ ਦਸਤਾਵੇਜ਼ ਘੱਟੋ-ਘੱਟ ਦਸ ਦਿਨ ਪਹਿਲਾਂ ਭੇਜੋ।",
      rom: "deri ton bachan lai dastavez ghatto-ghatt das din pahilan bhejo.",
      vi: "Để tránh chậm trễ, hãy gửi tài liệu ít nhất mười ngày trước.",
      en: "To avoid delay, send documents at least ten days in advance.",
    },
    analysis_prompts: [
      {
        pa: "ਇਸ ਹਦਾਇਤ ਦਾ ਅਪਰੋਕਸ਼ ਅਰਥ ਕੀ ਹੈ?",
        rom: "is hadait da aproaksh arth ki hai?",
        vi: "Hàm ý của hướng dẫn này là gì?",
        en: "What is the implied meaning of this instruction?",
      },
      {
        pa: "ਜੇ ਦਸਤਾਵੇਜ਼ ਦੇਰ ਨਾਲ ਭੇਜੇ ਜਾਣ ਤਾਂ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        rom: "je dastavez der nal bheje jaan tan ki ho sakda hai?",
        vi: "Nếu tài liệu được gửi muộn thì điều gì có thể xảy ra?",
        en: "What may happen if documents are sent late?",
      },
    ],
    canada_example: {
      context_vi: "Đọc ghi chú dịch vụ công về hồ sơ ở Canada.",
      context_en: "Reading a Canadian public-service note about documents.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅਰਜ਼ੀ ਦੀ ਸਮੀਖਿਆ ਲਈ ਦਸਤਾਵੇਜ਼ ਪਹਿਲਾਂ ਭੇਜਣਾ ਚਾਹੀਦਾ ਹੈ; ਆਖ਼ਰੀ ਦਿਨ ਭੇਜਣ ਨਾਲ ਪ੍ਰਕਿਰਿਆ ਰੁਕ ਸਕਦੀ ਹੈ।",
      rom: "Canada vich arzi di samikhia lai dastavez pahilan bhejna chahida hai; aakhri din bhejan nal prakiria ruk sakdi hai.",
      vi: "Ở Canada, nên gửi tài liệu sớm để xét hồ sơ; gửi vào ngày cuối có thể làm quy trình bị dừng.",
      en: "In Canada, documents should be sent early for application review; sending them on the last day may halt the process.",
    },
    learner_traps_vi: [
      "Hàm ý không phải tưởng tượng; nó phải dựa trên dấu hiệu trong văn bản.",
      "Các cụm như 'để tránh' thường báo hiệu hậu quả tiềm ẩn.",
    ],
    learner_traps_en: [
      "Implied meaning is not imagination; it must be based on textual clues.",
      "Phrases like 'to avoid' often signal a possible consequence.",
    ],
    response_frame: {
      pa: "ਪਾਠ ਸਿੱਧਾ ਨਹੀਂ ਕਹਿੰਦਾ, ਪਰ ਇਹ ਸੰਕੇਤ ਦਿੰਦਾ ਹੈ ਕਿ ...",
      rom: "path siddha nahi kehnda, par ih sanket dinda hai ki ...",
      vi: "Văn bản không nói trực tiếp, nhưng gợi ý rằng...",
      en: "The text does not say it directly, but it suggests that...",
    },
  },
  {
    id: "pa_c1_cr_summary_public",
    level: "C1",
    category: "summary",
    text_type: "public_service",
    title_pa: "ਸੰਖੇਪ ਸਾਰ ਬਣਾਉਣਾ",
    title_rom: "sankhep saar banauna",
    title_vi: "Tạo bản tóm tắt",
    title_en: "Creating a concise summary",
    reading_goal_vi: "Tóm tắt mục đích, hành động cần làm, thời hạn, và người liên hệ.",
    reading_goal_en: "Summarize purpose, required action, deadline, and contact point.",
    sample_text: {
      pa: "ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਬੀਮਾ ਫਾਰਮ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨਾ ਹੈ। ਮਦਦ ਲਈ ਵਿਦਿਆਰਥੀ ਸੇਵਾ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      rom: "vidyarthian nu bima form shukkarvar takk jamma karna hai. madad lai vidyarthi seva kendar nal sampark karo.",
      vi: "Sinh viên phải nộp mẫu bảo hiểm trước thứ Sáu. Để được giúp đỡ, liên hệ trung tâm dịch vụ sinh viên.",
      en: "Students must submit the insurance form by Friday. For help, contact the student service center.",
    },
    analysis_prompts: [
      {
        pa: "ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?",
        rom: "mukh kam ki hai?",
        vi: "Việc chính cần làm là gì?",
        en: "What is the main required action?",
      },
      {
        pa: "ਕਿਸ ਨਾਲ ਸੰਪਰਕ ਕਰਨਾ ਹੈ?",
        rom: "kis nal sampark karna hai?",
        vi: "Cần liên hệ với ai?",
        en: "Who should be contacted?",
      },
    ],
    canada_example: {
      context_vi: "Tóm tắt thông báo dịch vụ sinh viên ở Canada.",
      context_en: "Summarizing a student-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਸਿਹਤ ਬੀਮਾ ਫਾਰਮ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨਾ ਹੈ ਅਤੇ ਮਦਦ ਲਈ ਅੰਤਰਰਾਸ਼ਟਰੀ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰਨਾ ਹੈ।",
      rom: "Canada vich nave vidyarthian nu sehat bima form shukkarvar takk jamma karna hai ate madad lai antarrashtri kendar nal sampark karna hai.",
      vi: "Ở Canada, sinh viên mới phải nộp mẫu bảo hiểm y tế trước thứ Sáu và liên hệ trung tâm quốc tế để được hỗ trợ.",
      en: "In Canada, new students must submit the health insurance form by Friday and contact the international center for help.",
    },
    learner_traps_vi: [
      "Không đưa mọi câu vào summary; chọn việc cần làm và hạn chót.",
      "Thông báo dịch vụ công cần tóm tắt theo hành động, không theo văn phong.",
    ],
    learner_traps_en: [
      "Do not put every sentence in the summary; select action and deadline.",
      "Public-service notices should be summarized by action, not style.",
    ],
    response_frame: {
      pa: "ਸੰਖੇਪ ਵਿੱਚ, ਪਾਠ ਕਹਿੰਦਾ ਹੈ ਕਿ ...",
      rom: "sankhep vich, path kehnda hai ki ...",
      vi: "Tóm lại, văn bản nói rằng...",
      en: "In brief, the text says that...",
    },
  },
  {
    id: "pa_c1_cr_response_academic",
    level: "C1",
    category: "response_frames",
    text_type: "academic",
    title_pa: "ਅਕਾਦਮਿਕ ਜਵਾਬ ਲਿਖਣਾ",
    title_rom: "academic jawab likhna",
    title_vi: "Viết phản hồi học thuật",
    title_en: "Writing an academic response",
    reading_goal_vi: "Phản hồi bằng đồng ý một phần, giới hạn, bằng chứng, hoặc câu hỏi tiếp theo.",
    reading_goal_en: "Respond through partial agreement, limitation, evidence, or next question.",
    sample_text: {
      pa: "ਲੇਖ ਦਲੀਲ ਦਿੰਦਾ ਹੈ ਕਿ ਛੋਟੀਆਂ ਕਲਾਸਾਂ ਹਮੇਸ਼ਾਂ ਵਧੀਆ ਨਤੀਜੇ ਦਿੰਦੀਆਂ ਹਨ।",
      rom: "lekh daleel dinda hai ki chhotian classan hameshan vadhia natije dindian han.",
      vi: "Bài viết lập luận rằng lớp nhỏ luôn đem lại kết quả tốt hơn.",
      en: "The article argues that small classes always produce better outcomes.",
    },
    analysis_prompts: [
      {
        pa: "ਕੀ ਦਾਅਵਾ ਬਹੁਤ ਵੱਡਾ ਹੈ?",
        rom: "ki daava bahut vadda hai?",
        vi: "Luận điểm có quá rộng không?",
        en: "Is the claim too broad?",
      },
      {
        pa: "ਕਿਹੜਾ ਸਬੂਤ ਜਵਾਬ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰੇਗਾ?",
        rom: "kehda sabut jawab nu mazbut karega?",
        vi: "Bằng chứng nào sẽ làm phản hồi mạnh hơn?",
        en: "What evidence would strengthen the response?",
      },
    ],
    canada_example: {
      context_vi: "Phản hồi một luận điểm học thuật về lớp học ở Canada.",
      context_en: "Responding to an academic claim about classes in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਇਹ ਦਾਅਵਾ ਹਿੱਸੇ ਵਿੱਚ ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਕਲਾਸ ਦਾ ਆਕਾਰ ਇਕੱਲਾ ਕਾਰਕ ਨਹੀਂ।",
      rom: "Canada de sandarbh vich ih daava hisse vich sahi ho sakda hai, par class da akar ikalla karak nahi.",
      vi: "Trong bối cảnh Canada, luận điểm này có thể đúng một phần, nhưng sĩ số lớp không phải yếu tố duy nhất.",
      en: "In the Canadian context, this claim may be partly valid, but class size is not the only factor.",
    },
    learner_traps_vi: [
      "Không chỉ viết 'tôi đồng ý/không đồng ý'; cần lý do.",
      "Từ 'luôn luôn' thường cần được phản hồi thận trọng.",
    ],
    learner_traps_en: [
      "Do not only write 'I agree/disagree'; give a reason.",
      "The word 'always' often needs a careful response.",
    ],
    response_frame: {
      pa: "ਮੈਂ ਇਸ ਦਾਅਵੇ ਨਾਲ ਹਿੱਸੇ ਵਿੱਚ ਸਹਿਮਤ ਹਾਂ, ਪਰ ...",
      rom: "main is daave nal hisse vich sahimat han, par ...",
      vi: "Tôi đồng ý một phần với luận điểm này, nhưng...",
      en: "I partly agree with this claim, but...",
    },
  },
  {
    id: "pa_c1_cr_response_public",
    level: "C1",
    category: "response_frames",
    text_type: "public_service",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਪਾਠ ਨੂੰ ਜਵਾਬ",
    title_rom: "jantak seva path nu jawab",
    title_vi: "Phản hồi văn bản dịch vụ công",
    title_en: "Responding to a public-service text",
    reading_goal_vi: "Đặt câu hỏi làm rõ về hành động, điều kiện, thời hạn, hoặc hỗ trợ.",
    reading_goal_en: "Ask clarifying questions about action, conditions, deadline, or support.",
    sample_text: {
      pa: "ਯੋਗ ਵਿਦਿਆਰਥੀ ਆਨਲਾਈਨ ਫਾਰਮ ਭਰ ਸਕਦੇ ਹਨ। ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਬਾਅਦ ਵਿੱਚ ਦਿੱਤੀ ਜਾਵੇਗੀ।",
      rom: "yog vidyarthi online form bhar sakde han. vadere jankari baad vich ditti javegi.",
      vi: "Sinh viên đủ điều kiện có thể điền mẫu trực tuyến. Thông tin thêm sẽ được cung cấp sau.",
      en: "Eligible students may complete the online form. More information will be provided later.",
    },
    analysis_prompts: [
      {
        pa: "ਯੋਗਤਾ ਦਾ ਮਾਪਦੰਡ ਸਪਸ਼ਟ ਹੈ?",
        rom: "yogta da mapdand spasht hai?",
        vi: "Tiêu chí đủ điều kiện có rõ không?",
        en: "Is the eligibility criterion clear?",
      },
      {
        pa: "ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਹਾਲੇ ਚਾਹੀਦੀ ਹੈ?",
        rom: "kehri jankari hale chahidi hai?",
        vi: "Thông tin nào vẫn còn cần?",
        en: "What information is still needed?",
      },
    ],
    canada_example: {
      context_vi: "Phản hồi thông báo hỗ trợ tài chính ở Canada.",
      context_en: "Responding to a financial-support notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਇਸ ਸਹਾਇਤਾ ਲਈ ਯੋਗਤਾ ਦੇ ਮਾਪਦੰਡ ਸਪਸ਼ਟ ਨਹੀਂ, ਇਸ ਲਈ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਹੋਰ ਜਾਣਕਾਰੀ ਦੀ ਲੋੜ ਹੈ।",
      rom: "Canada vich is sahaita lai yogta de mapdand spasht nahi, is lai vidyarthian nu hor jankari di lor hai.",
      vi: "Ở Canada, tiêu chí đủ điều kiện cho hỗ trợ này chưa rõ, vì vậy sinh viên cần thêm thông tin.",
      en: "In Canada, the eligibility criteria for this support are unclear, so students need more information.",
    },
    learner_traps_vi: [
      "Đừng giả định điều kiện nếu thông báo chưa nói rõ.",
      "Phản hồi dịch vụ công nên hỏi rõ bước tiếp theo, không chỉ phê bình.",
    ],
    learner_traps_en: [
      "Do not assume eligibility conditions if the notice does not state them.",
      "A public-service response should ask for the next step, not only criticize.",
    ],
    response_frame: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਕਰੋ ਕਿ ...",
      rom: "kirpa karke spasht karo ki ...",
      vi: "Xin vui lòng làm rõ rằng...",
      en: "Please clarify whether...",
    },
  },
];
