// Punjabi C2 discourse & nuance lessons for Vietnamese- and English-speaking
// learners. Gurmukhi is primary; romanization is a reading aid only.
//
// Scope/status: study-support material for advanced learners. Native review is
// deferred, so do not present this file as authoritative. Shahmukhi is mentioned
// only for script awareness, not taught as a full course here.

export type PunjabiCefrLevel = "C2";

export type PunjabiDiscourseFocus =
  | "nuance"
  | "register"
  | "softening"
  | "indirect_refusal"
  | "respectful_disagreement"
  | "idiom_awareness"
  | "community_context"
  | "formal_context"
  | "rhetorical_framing";

export type PunjabiRegister = "formal" | "neutral" | "colloquial" | "respectful";

export type PunjabiDiscoursePhrase = {
  gurmukhi: string;
  romanization: string;
  literal_en: string;
  meaning_vi: string;
  meaning_en: string;
  register?: PunjabiRegister;
};

export type PunjabiDiscourseExample = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
  note_vi?: string;
  note_en?: string;
};

export type PunjabiC2DiscourseLesson = {
  id: string;
  level: PunjabiCefrLevel;
  focus: PunjabiDiscourseFocus;
  title_vi: string;
  title_en: string;
  overview_vi: string;
  overview_en: string;
  phrases: PunjabiDiscoursePhrase[];
  examples: PunjabiDiscourseExample[];
  tip_vi: string;
  tip_en: string;
};

export const C2_DISCOURSE_DISCLAIMER = {
  vi: "Tài liệu hỗ trợ học Punjabi trình độ C2. Chữ Gurmukhi là hình thức chính; phiên âm chỉ để hỗ trợ đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ, không phải một khóa đầy đủ.",
  en: "C2 Punjabi study-support material. Gurmukhi is primary; romanization is only a reading aid. Native review is deferred. Shahmukhi is noted for script awareness only, not taught as a full course.",
} as const;

export const lessons: PunjabiC2DiscourseLesson[] = [
  {
    id: "pa_c2_nuance_stance",
    level: "C2",
    focus: "nuance",
    title_vi: "Sắc thái lập trường: nói chắc nhưng không áp đặt",
    title_en: "Nuanced stance: firm without sounding imposed",
    overview_vi:
      "Ở C2, vấn đề không chỉ là nói 'tôi nghĩ'. Người nói Punjabi thường đặt mức cam kết bằng các cụm như ਮੇਰੇ ਖ਼ਿਆਲ ਵਿੱਚ, ਜਿੱਥੋਂ ਤੱਕ ਮੇਰੀ ਸਮਝ ਹੈ, hoặc ਮੈਂ ਇਹ ਨਹੀਂ ਕਹਿ ਰਿਹਾ ਕਿ. Những cụm này cho biết bạn đang mở một góc nhìn, không đóng cuộc bàn luận.",
    overview_en:
      "At C2, the issue is not just saying 'I think'. Punjabi speakers grade commitment with frames like ਮੇਰੇ ਖ਼ਿਆਲ ਵਿੱਚ, ਜਿੱਥੋਂ ਤੱਕ ਮੇਰੀ ਸਮਝ ਹੈ, and ਮੈਂ ਇਹ ਨਹੀਂ ਕਹਿ ਰਿਹਾ ਕਿ. These mark a viewpoint without closing discussion.",
    phrases: [
      {
        gurmukhi: "ਮੇਰੇ ਖ਼ਿਆਲ ਵਿੱਚ",
        romanization: "mere khiaal vich",
        literal_en: "in my thought",
        meaning_vi: "Theo tôi / theo suy nghĩ của tôi; trung tính, dùng được trong thảo luận.",
        meaning_en: "In my view; neutral and usable in discussion.",
        register: "neutral",
      },
      {
        gurmukhi: "ਜਿੱਥੋਂ ਤੱਕ ਮੇਰੀ ਸਮਝ ਹੈ",
        romanization: "jitthon takk meri samajh hai",
        literal_en: "as far as my understanding goes",
        meaning_vi: "Theo mức tôi hiểu; tự hạ thấp độ tuyệt đối của nhận định.",
        meaning_en: "As far as I understand; lowers the absoluteness of the claim.",
        register: "respectful",
      },
      {
        gurmukhi: "ਮੈਂ ਇਹ ਨਹੀਂ ਕਹਿ ਰਿਹਾ ਕਿ",
        romanization: "main ih nahin kahi riha ki",
        literal_en: "I am not saying that",
        meaning_vi: "Tôi không nói rằng...; mở đường cho một nhận xét tinh tế hơn.",
        meaning_en: "I am not saying that...; prepares a more nuanced claim.",
        register: "neutral",
      },
    ],
    examples: [
      {
        gurmukhi: "ਜਿੱਥੋਂ ਤੱਕ ਮੇਰੀ ਸਮਝ ਹੈ, ਮਸਲਾ ਸਿਰਫ਼ ਪੈਸੇ ਦਾ ਨਹੀਂ ਹੈ।",
        romanization: "jitthon takk meri samajh hai, masla sirf paise da nahin hai.",
        vi: "Theo mức tôi hiểu, vấn đề không chỉ là tiền.",
        en: "As far as I understand, the issue is not only money.",
        note_vi: "ਸਿਰਫ਼...ਨਹੀਂ giúp chuyển trọng tâm mà không phủ nhận người trước quá mạnh.",
        note_en: "ਸਿਰਫ਼...ਨਹੀਂ shifts the frame without bluntly rejecting the previous speaker.",
      },
      {
        gurmukhi: "ਮੈਂ ਇਹ ਨਹੀਂ ਕਹਿ ਰਿਹਾ ਕਿ ਫ਼ੈਸਲਾ ਗਲਤ ਹੈ, ਪਰ ਸਮਾਂ ਥੋੜ੍ਹਾ ਜਲਦੀ ਹੈ।",
        romanization: "main ih nahin kahi riha ki faisla galat hai, par sama thorra jaldi hai.",
        vi: "Tôi không nói quyết định là sai, nhưng thời điểm hơi sớm.",
        en: "I am not saying the decision is wrong, but the timing is a little early.",
      },
    ],
    tip_vi:
      "Với người học Việt, đừng dịch 'I think' quá máy móc. Chọn khung lập trường theo mức chắc chắn: ਮੇਰੇ ਖ਼ਿਆਲ ਵਿੱਚ trung tính, ਜਿੱਥੋਂ ਤੱਕ... mềm hơn, ਯਕੀਨਨ mạnh hơn.",
    tip_en:
      "For English speakers, do not overuse a flat 'I think'. Pick the stance frame by certainty: ਮੇਰੇ ਖ਼ਿਆਲ ਵਿੱਚ is neutral, ਜਿੱਥੋਂ ਤੱਕ... is softer, ਯਕੀਨਨ is stronger.",
  },
  {
    id: "pa_c2_register_shift",
    level: "C2",
    focus: "register",
    title_vi: "Chuyển tầng ngữ vực: thân mật, trung tính, trang trọng",
    title_en: "Register shifting: intimate, neutral, formal",
    overview_vi:
      "Punjabi có các lựa chọn khác nhau để cùng diễn đạt một ý. C2 không phải là luôn nói trang trọng, mà là biết khi nào dùng ਗੱਲ ਕਰਨੀ, ਚਰਚਾ ਕਰਨੀ, ਜਾਂ ਵਿਚਾਰ-ਵਟਾਂਦਰਾ ਕਰਨਾ.",
    overview_en:
      "Punjabi offers multiple ways to say similar things. C2 is not always being formal; it is knowing when to use ਗੱਲ ਕਰਨੀ, ਚਰਚਾ ਕਰਨੀ, or ਵਿਚਾਰ-ਵਟਾਂਦਰਾ ਕਰਨਾ.",
    phrases: [
      {
        gurmukhi: "ਗੱਲ ਕਰਨੀ",
        romanization: "gall karni",
        literal_en: "to do talk",
        meaning_vi: "Nói chuyện / bàn chuyện; tự nhiên, rộng, không quá trang trọng.",
        meaning_en: "To talk / discuss; natural, broad, not very formal.",
        register: "colloquial",
      },
      {
        gurmukhi: "ਚਰਚਾ ਕਰਨੀ",
        romanization: "charcha karni",
        literal_en: "to conduct discussion",
        meaning_vi: "Thảo luận; phù hợp lớp học, họp, văn bản trung tính.",
        meaning_en: "To discuss; fits classrooms, meetings, and neutral writing.",
        register: "neutral",
      },
      {
        gurmukhi: "ਵਿਚਾਰ-ਵਟਾਂਦਰਾ ਕਰਨਾ",
        romanization: "vichaar-vataandara karna",
        literal_en: "to exchange thoughts",
        meaning_vi: "Trao đổi ý kiến; trang trọng, cộng đồng hoặc hành chính.",
        meaning_en: "To exchange views; formal, community or administrative contexts.",
        register: "formal",
      },
    ],
    examples: [
      {
        gurmukhi: "ਆਓ ਇਸ ਬਾਰੇ ਥੋੜ੍ਹੀ ਚਰਚਾ ਕਰੀਏ।",
        romanization: "aao is bare thorrhi charcha kariye.",
        vi: "Ta hãy thảo luận một chút về việc này.",
        en: "Let's discuss this a little.",
      },
      {
        gurmukhi: "ਕਮੇਟੀ ਨੇ ਮਾਮਲੇ ਉੱਤੇ ਵਿਚਾਰ-ਵਟਾਂਦਰਾ ਕੀਤਾ।",
        romanization: "kameti ne maamle utte vichaar-vataandara kita.",
        vi: "Ủy ban đã trao đổi ý kiến về vấn đề đó.",
        en: "The committee exchanged views on the matter.",
        note_vi: "ਵਿਚਾਰ-ਵਟਾਂਦਰਾ tạo cảm giác chính thức hơn ਗੱਲ ਕਰਨੀ.",
        note_en: "ਵਿਚਾਰ-ਵਟਾਂਦਰਾ sounds more official than ਗੱਲ ਕਰਨੀ.",
      },
    ],
    tip_vi:
      "Hãy học theo cặp ngữ vực: từ thân mật bạn đã biết và lựa chọn trang trọng tương ứng. Như vậy bạn không bị 'đóng băng' trong một phong cách.",
    tip_en:
      "Learn register pairs: the casual word you know and its formal counterpart. That prevents you from getting trapped in one style.",
  },
  {
    id: "pa_c2_softening_request",
    level: "C2",
    focus: "softening",
    title_vi: "Làm mềm yêu cầu và góp ý",
    title_en: "Softening requests and feedback",
    overview_vi:
      "C2 Punjabi dùng các hạt và cụm giảm lực như ਜ਼ਰਾ, ਸ਼ਾਇਦ, ਹੋ ਸਕੇ ਤਾਂ, và ਥੋੜ੍ਹਾ. Chúng không chỉ là 'lịch sự'; chúng thay đổi mức áp lực mà người nghe cảm thấy.",
    overview_en:
      "C2 Punjabi uses softeners such as ਜ਼ਰਾ, ਸ਼ਾਇਦ, ਹੋ ਸਕੇ ਤਾਂ, and ਥੋੜ੍ਹਾ. They are not just 'polite'; they change how much pressure the listener feels.",
    phrases: [
      {
        gurmukhi: "ਜ਼ਰਾ",
        romanization: "zara",
        literal_en: "a little",
        meaning_vi: "Làm mềm yêu cầu: 'làm ơn một chút'.",
        meaning_en: "Softens a request: 'just / please a little'.",
        register: "neutral",
      },
      {
        gurmukhi: "ਹੋ ਸਕੇ ਤਾਂ",
        romanization: "ho sake taan",
        literal_en: "if it can happen, then",
        meaning_vi: "Nếu được thì...; nhấn mạnh người nghe có quyền từ chối.",
        meaning_en: "If possible...; emphasizes the listener may decline.",
        register: "respectful",
      },
      {
        gurmukhi: "ਮੇਰੀ ਇੱਕ ਛੋਟੀ ਜਿਹੀ ਬੇਨਤੀ ਹੈ",
        romanization: "meri ikk chhoti jihi benti hai",
        literal_en: "I have one small request",
        meaning_vi: "Tôi có một đề nghị nhỏ; khung rất mềm trước yêu cầu.",
        meaning_en: "I have a small request; a very soft preface to a request.",
        register: "respectful",
      },
    ],
    examples: [
      {
        gurmukhi: "ਜ਼ਰਾ ਇਹ ਵਾਕ ਦੁਬਾਰਾ ਵੇਖ ਲਓ ਜੀ।",
        romanization: "zara ih vaak dubara vekh lao ji.",
        vi: "Anh/chị xem lại câu này một chút nhé.",
        en: "Please take another quick look at this sentence.",
        note_vi: "ਜੀ thêm sự kính trọng nhẹ; không biến câu thành quá trang trọng.",
        note_en: "ਜੀ adds light respect without making the sentence overly formal.",
      },
      {
        gurmukhi: "ਹੋ ਸਕੇ ਤਾਂ ਮੈਨੂੰ ਕੱਲ੍ਹ ਤੱਕ ਜਵਾਬ ਦੇ ਦਿਓ।",
        romanization: "ho sake taan mainu kallh takk javaab de dio.",
        vi: "Nếu được thì cho tôi câu trả lời trước ngày mai.",
        en: "If possible, please give me an answer by tomorrow.",
      },
    ],
    tip_vi:
      "Người Việt dễ dùng câu cầu khiến trực tiếp. Trong Punjabi, thêm ਜ਼ਰਾ hoặc ਹੋ ਸਕੇ ਤਾਂ thường làm câu nghe hợp tác hơn.",
    tip_en:
      "English speakers may translate requests too directly. Adding ਜ਼ਰਾ or ਹੋ ਸਕੇ ਤਾਂ often makes the request sound more collaborative.",
  },
  {
    id: "pa_c2_indirect_refusal",
    level: "C2",
    focus: "indirect_refusal",
    title_vi: "Từ chối gián tiếp mà vẫn rõ ý",
    title_en: "Indirect refusal while still being clear",
    overview_vi:
      "Từ chối thẳng bằng ਨਹੀਂ có thể cần thiết, nhưng trong bối cảnh quan hệ hoặc cộng đồng, người nói thường dùng ਔਖਾ ਹੋਵੇਗਾ, ਵੇਖਦੇ ਹਾਂ, hoặc ਇਸ ਵਾਰੀ ਮੁਸ਼ਕਲ ਹੈ. C2 là nhận ra khi nào 'để xem' thực chất là 'không'.",
    overview_en:
      "A direct ਨਹੀਂ may be necessary, but in relational or community contexts speakers often use ਔਖਾ ਹੋਵੇਗਾ, ਵੇਖਦੇ ਹਾਂ, or ਇਸ ਵਾਰੀ ਮੁਸ਼ਕਲ ਹੈ. C2 means recognizing when 'we will see' effectively means 'no'.",
    phrases: [
      {
        gurmukhi: "ਇਸ ਵਾਰੀ ਮੁਸ਼ਕਲ ਹੈ",
        romanization: "is vaari mushkal hai",
        literal_en: "this time it is difficult",
        meaning_vi: "Lần này khó; từ chối mềm, để ngỏ tương lai.",
        meaning_en: "This time is difficult; soft refusal, leaves the future open.",
        register: "neutral",
      },
      {
        gurmukhi: "ਵੇਖਦੇ ਹਾਂ",
        romanization: "vekhde haan",
        literal_en: "we will see",
        meaning_vi: "Để xem; có thể là trì hoãn, cũng có thể là từ chối gián tiếp.",
        meaning_en: "We will see; may delay, or may function as indirect refusal.",
        register: "colloquial",
      },
      {
        gurmukhi: "ਮੈਂ ਵਾਅਦਾ ਨਹੀਂ ਕਰ ਸਕਦਾ/ਸਕਦੀ",
        romanization: "main vaada nahin kar sakda/sakdi",
        literal_en: "I cannot make a promise",
        meaning_vi: "Tôi không hứa được; rõ ràng nhưng không đóng sầm cửa.",
        meaning_en: "I cannot promise; clear without slamming the door.",
        register: "neutral",
      },
    ],
    examples: [
      {
        gurmukhi: "ਤੁਹਾਡਾ ਸੱਦਾ ਬਹੁਤ ਚੰਗਾ ਹੈ, ਪਰ ਇਸ ਵਾਰੀ ਮੁਸ਼ਕਲ ਹੈ।",
        romanization: "tuhada sadda bahut changa hai, par is vaari mushkal hai.",
        vi: "Lời mời của anh/chị rất quý, nhưng lần này hơi khó.",
        en: "Your invitation is very kind, but this time is difficult.",
      },
      {
        gurmukhi: "ਮੈਂ ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗਾ, ਪਰ ਵਾਅਦਾ ਨਹੀਂ ਕਰ ਸਕਦਾ।",
        romanization: "main koshish karanga, par vaada nahin kar sakda.",
        vi: "Tôi sẽ cố, nhưng không thể hứa.",
        en: "I will try, but I cannot promise.",
        note_vi: "ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗਾ giữ thiện chí; ਵਾਅਦਾ ਨਹੀਂ ਕਰ ਸਕਦਾ đặt ranh giới.",
        note_en: "ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗਾ preserves goodwill; ਵਾਅਦਾ ਨਹੀਂ ਕਰ ਸਕਦਾ sets a boundary.",
      },
    ],
    tip_vi:
      "Khi nghe ਵੇਖਦੇ ਹਾਂ, hãy đọc thêm giọng điệu, quan hệ, và bối cảnh. Nó không tự động là 'có thể được'.",
    tip_en:
      "When you hear ਵੇਖਦੇ ਹਾਂ, read tone, relationship, and context. It is not automatically a real 'maybe'.",
  },
  {
    id: "pa_c2_respectful_disagreement",
    level: "C2",
    focus: "respectful_disagreement",
    title_vi: "Bất đồng tôn trọng: đồng ý một phần rồi xoay hướng",
    title_en: "Respectful disagreement: concede, then redirect",
    overview_vi:
      "Một bất đồng tinh tế thường bắt đầu bằng ਮੰਨਦਾ/ਮੰਨਦੀ ਹਾਂ hoặc ਤੁਹਾਡੀ ਗੱਲ ਵਿੱਚ ਵਜ਼ਨ ਹੈ rồi chuyển sang ਪਰ. Cách này giữ thể diện cho người trước và vẫn bảo vệ lập luận của bạn.",
    overview_en:
      "A tactful disagreement often starts with ਮੰਨਦਾ/ਮੰਨਦੀ ਹਾਂ or ਤੁਹਾਡੀ ਗੱਲ ਵਿੱਚ ਵਜ਼ਨ ਹੈ before moving to ਪਰ. This preserves the previous speaker's dignity while protecting your argument.",
    phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਵਿੱਚ ਵਜ਼ਨ ਹੈ",
        romanization: "tuhadi gall vich vazan hai",
        literal_en: "there is weight in your point",
        meaning_vi: "Ý của anh/chị có cơ sở; công nhận trước khi phản biện.",
        meaning_en: "Your point has weight; acknowledges before countering.",
        register: "respectful",
      },
      {
        gurmukhi: "ਮੈਂ ਇਸ ਗੱਲ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹਿਮਤ ਨਹੀਂ",
        romanization: "main is gall naal poori tarhan sahimat nahin",
        literal_en: "I do not fully agree with this point",
        meaning_vi: "Tôi không hoàn toàn đồng ý; bất đồng rõ nhưng không thô.",
        meaning_en: "I do not fully agree; clear but not blunt.",
        register: "neutral",
      },
      {
        gurmukhi: "ਫਿਰ ਵੀ ਇੱਕ ਪਾਸਾ ਹੋਰ ਵੀ ਹੈ",
        romanization: "fir vi ikk paasa hor vi hai",
        literal_en: "still, there is another side too",
        meaning_vi: "Tuy vậy còn một mặt khác; mở thêm khung phân tích.",
        meaning_en: "Still, there is another side; opens another analytical frame.",
        register: "neutral",
      },
    ],
    examples: [
      {
        gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਵਿੱਚ ਵਜ਼ਨ ਹੈ, ਪਰ ਅੰਕੜੇ ਕੁਝ ਹੋਰ ਦੱਸਦੇ ਹਨ।",
        romanization: "tuhadi gall vich vazan hai, par ankare kujh hor dassde han.",
        vi: "Ý của anh/chị có cơ sở, nhưng số liệu cho thấy điều khác.",
        en: "Your point has weight, but the data suggests something else.",
      },
      {
        gurmukhi: "ਮੈਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹਿਮਤ ਨਹੀਂ, ਕਿਉਂਕਿ ਮਸਲੇ ਦਾ ਇੱਕ ਪਾਸਾ ਹੋਰ ਵੀ ਹੈ।",
        romanization: "main poori tarhan sahimat nahin, kyonki masle da ikk paasa hor vi hai.",
        vi: "Tôi không hoàn toàn đồng ý, vì vấn đề còn một mặt khác.",
        en: "I do not fully agree, because the issue has another side as well.",
      },
    ],
    tip_vi:
      "Đừng bắt đầu bằng 'ਨਹੀਂ' nếu mục tiêu là hợp tác. Công nhận một phần trước giúp phản biện nghe nghiêm túc hơn.",
    tip_en:
      "Do not start with a bare 'ਨਹੀਂ' when the goal is collaboration. Partial acknowledgment makes the counterpoint sound more serious.",
  },
  {
    id: "pa_c2_idiom_awareness",
    level: "C2",
    focus: "idiom_awareness",
    title_vi: "Nhận biết thành ngữ mà không lạm dụng",
    title_en: "Idiom awareness without overuse",
    overview_vi:
      "Thành ngữ Punjabi tạo chiều sâu, nhưng dùng quá nhiều sẽ nghe diễn hoặc lệch bối cảnh. Ở C2, mục tiêu là hiểu lực tu từ của ਮੁੱਦੇ ਦੀ ਗੱਲ, ਗੱਲ ਨੂੰ ਘੁਮਾ ਫਿਰਾ ਕੇ, và ਦਿਲ ਦੀ ਗੱਲ.",
    overview_en:
      "Punjabi idioms add depth, but too many can sound theatrical or misplaced. At C2, the goal is to understand the rhetorical force of ਮੁੱਦੇ ਦੀ ਗੱਲ, ਗੱਲ ਨੂੰ ਘੁਮਾ ਫਿਰਾ ਕੇ, and ਦਿਲ ਦੀ ਗੱਲ.",
    phrases: [
      {
        gurmukhi: "ਮੁੱਦੇ ਦੀ ਗੱਲ",
        romanization: "mudde di gall",
        literal_en: "the matter's point",
        meaning_vi: "Điểm chính / vấn đề cốt lõi.",
        meaning_en: "The main point / core issue.",
        register: "neutral",
      },
      {
        gurmukhi: "ਗੱਲ ਨੂੰ ਘੁਮਾ ਫਿਰਾ ਕੇ ਕਹਿਣਾ",
        romanization: "gall nu ghuma fira ke kahina",
        literal_en: "to say the point by turning it around",
        meaning_vi: "Nói vòng vo / nói gián tiếp.",
        meaning_en: "To speak around the point / say indirectly.",
        register: "colloquial",
      },
      {
        gurmukhi: "ਦਿਲ ਦੀ ਗੱਲ",
        romanization: "dil di gall",
        literal_en: "the heart's word",
        meaning_vi: "Điều thật lòng; thường mang sắc thái chân thành.",
        meaning_en: "What is truly in one's heart; often sincere in tone.",
        register: "neutral",
      },
    ],
    examples: [
      {
        gurmukhi: "ਮੁੱਦੇ ਦੀ ਗੱਲ ਇਹ ਹੈ ਕਿ ਭਰੋਸਾ ਟੁੱਟ ਗਿਆ ਹੈ।",
        romanization: "mudde di gall ih hai ki bharosa tutt giya hai.",
        vi: "Điểm cốt lõi là niềm tin đã bị phá vỡ.",
        en: "The core issue is that trust has been broken.",
      },
      {
        gurmukhi: "ਉਹ ਗੱਲ ਨੂੰ ਘੁਮਾ ਫਿਰਾ ਕੇ ਕਹਿ ਰਿਹਾ ਸੀ।",
        romanization: "oh gall nu ghuma fira ke kahi riha si.",
        vi: "Anh ấy đang nói vòng vo.",
        en: "He was speaking around the point.",
        note_vi: "Cụm này có thể là mô tả trung tính hoặc lời chê nhẹ, tùy ngữ điệu.",
        note_en: "This can be neutral description or mild criticism, depending on tone.",
      },
    ],
    tip_vi:
      "Với thành ngữ, học cả bối cảnh xã hội. Một cụm đúng nghĩa nhưng sai lúc vẫn làm câu nghe không tự nhiên.",
    tip_en:
      "With idioms, learn the social setting too. A phrase can be semantically right and still sound unnatural in the wrong moment.",
  },
  {
    id: "pa_c2_community_context",
    level: "C2",
    focus: "community_context",
    title_vi: "Ngữ cảnh cộng đồng: nói trước nhóm mà giữ quan hệ",
    title_en: "Community contexts: speaking to a group while preserving ties",
    overview_vi:
      "Trong các cuộc họp gia đình, hội đồng cộng đồng, hoặc sinh hoạt tôn giáo-xã hội, lời nói thường phải cân bằng sự rõ ràng với thể diện chung. Các cụm ਸਾਂਝੀ ਰਾਏ, ਬਜ਼ੁਰਗਾਂ ਦੀ ਸਲਾਹ, và ਸਭ ਦੀ ਸਹਿਮਤੀ signal rằng quyết định không chỉ là cá nhân.",
    overview_en:
      "In family meetings, community councils, or religious-social gatherings, speech often balances clarity with shared dignity. Phrases like ਸਾਂਝੀ ਰਾਏ, ਬਜ਼ੁਰਗਾਂ ਦੀ ਸਲਾਹ, and ਸਭ ਦੀ ਸਹਿਮਤੀ signal that a decision is not only individual.",
    phrases: [
      {
        gurmukhi: "ਸਾਂਝੀ ਰਾਏ",
        romanization: "sanjhi rae",
        literal_en: "shared opinion",
        meaning_vi: "Ý kiến chung; nhấn mạnh sự đồng thuận của nhóm.",
        meaning_en: "Shared view; emphasizes group consensus.",
        register: "neutral",
      },
      {
        gurmukhi: "ਬਜ਼ੁਰਗਾਂ ਦੀ ਸਲਾਹ",
        romanization: "bazurgan di salah",
        literal_en: "elders' advice",
        meaning_vi: "Lời khuyên của người lớn tuổi; dùng thận trọng, không rập khuôn.",
        meaning_en: "Advice from elders; use carefully, without stereotyping.",
        register: "respectful",
      },
      {
        gurmukhi: "ਸਭ ਦੀ ਸਹਿਮਤੀ ਨਾਲ",
        romanization: "sabh di sahimati naal",
        literal_en: "with everyone's agreement",
        meaning_vi: "Với sự đồng thuận của mọi người.",
        meaning_en: "With everyone's agreement.",
        register: "formal",
      },
    ],
    examples: [
      {
        gurmukhi: "ਜੇ ਸਭ ਦੀ ਸਹਿਮਤੀ ਹੋਵੇ, ਅਸੀਂ ਇਹ ਫ਼ੈਸਲਾ ਅਗਲੀ ਮੀਟਿੰਗ ਵਿੱਚ ਪੱਕਾ ਕਰੀਏ।",
        romanization: "je sabh di sahimati hove, asin ih faisla agli meeting vich pakka kariye.",
        vi: "Nếu mọi người đồng thuận, ta xác nhận quyết định này ở cuộc họp sau.",
        en: "If everyone agrees, let us confirm this decision in the next meeting.",
      },
      {
        gurmukhi: "ਇਹ ਸਿਰਫ਼ ਮੇਰੀ ਰਾਏ ਨਹੀਂ; ਇਹ ਸਾਂਝੀ ਰਾਏ ਵਜੋਂ ਆਈ ਹੈ।",
        romanization: "ih sirf meri rae nahin; ih sanjhi rae vajon aai hai.",
        vi: "Đây không chỉ là ý kiến của tôi; nó xuất hiện như ý kiến chung.",
        en: "This is not only my view; it has emerged as a shared view.",
      },
    ],
    tip_vi:
      "Tránh giả định mọi cộng đồng Punjabi vận hành giống nhau. Học cụm ngôn ngữ để đọc bối cảnh, không để đóng khung con người.",
    tip_en:
      "Avoid assuming all Punjabi communities work the same way. Learn the language cues to read context, not to stereotype people.",
  },
  {
    id: "pa_c2_formal_context",
    level: "C2",
    focus: "formal_context",
    title_vi: "Bối cảnh trang trọng: thư, họp, tuyên bố",
    title_en: "Formal contexts: letters, meetings, statements",
    overview_vi:
      "Ngôn ngữ trang trọng Punjabi thường dùng ਬੇਨਤੀ, ਸੂਚਿਤ ਕਰਨਾ, ਵਿਚਾਰ ਅਧੀਨ, and ਫ਼ੈਸਲਾ ਕੀਤਾ ਗਿਆ. Đây là lớp từ giúp câu bớt cá nhân và hợp với văn bản hoặc cuộc họp chính thức.",
    overview_en:
      "Formal Punjabi often uses ਬੇਨਤੀ, ਸੂਚਿਤ ਕਰਨਾ, ਵਿਚਾਰ ਅਧੀਨ, and ਫ਼ੈਸਲਾ ਕੀਤਾ ਗਿਆ. This layer makes the sentence less personal and more suitable for documents or formal meetings.",
    phrases: [
      {
        gurmukhi: "ਬੇਨਤੀ ਹੈ ਕਿ",
        romanization: "benti hai ki",
        literal_en: "there is a request that",
        meaning_vi: "Kính đề nghị rằng...; mở yêu cầu trang trọng.",
        meaning_en: "It is requested that...; opens a formal request.",
        register: "formal",
      },
      {
        gurmukhi: "ਸੂਚਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ",
        romanization: "suchit kita janda hai",
        literal_en: "it is informed",
        meaning_vi: "Xin thông báo rằng...; văn phong hành chính.",
        meaning_en: "It is hereby informed...; administrative style.",
        register: "formal",
      },
      {
        gurmukhi: "ਵਿਚਾਰ ਅਧੀਨ ਹੈ",
        romanization: "vichaar adhin hai",
        literal_en: "is under consideration",
        meaning_vi: "Đang được xem xét; tránh hứa kết quả.",
        meaning_en: "Is under consideration; avoids promising an outcome.",
        register: "formal",
      },
    ],
    examples: [
      {
        gurmukhi: "ਤੁਹਾਨੂੰ ਸੂਚਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਕਿ ਮੀਟਿੰਗ ਸੋਮਵਾਰ ਨੂੰ ਹੋਵੇਗੀ।",
        romanization: "tuhanu suchit kita janda hai ki meeting somvaar nu hovegi.",
        vi: "Xin thông báo rằng cuộc họp sẽ diễn ra vào thứ Hai.",
        en: "You are informed that the meeting will take place on Monday.",
      },
      {
        gurmukhi: "ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਹਾਲੇ ਵਿਚਾਰ ਅਧੀਨ ਹੈ।",
        romanization: "tuhadi arzi haale vichaar adhin hai.",
        vi: "Đơn của anh/chị hiện vẫn đang được xem xét.",
        en: "Your application is still under consideration.",
      },
    ],
    tip_vi:
      "Trong văn bản trang trọng, thể bị động/khách quan như ਕੀਤਾ ਜਾਂਦਾ ਹੈ làm câu bớt cá nhân, nhưng dùng quá nhiều sẽ nghe nặng nề.",
    tip_en:
      "In formal writing, passive/objective forms like ਕੀਤਾ ਜਾਂਦਾ ਹੈ make the sentence less personal, but too much can sound heavy.",
  },
  {
    id: "pa_c2_rhetorical_framing",
    level: "C2",
    focus: "rhetorical_framing",
    title_vi: "Đóng khung tu từ: dẫn người nghe tới kết luận",
    title_en: "Rhetorical framing: guiding the listener to a conclusion",
    overview_vi:
      "Người nói C2 không chỉ liệt kê lý do; họ sắp xếp lập luận bằng ਇੱਕ ਪਾਸੇ..., ਦੂਜੇ ਪਾਸੇ..., ਮੂਲ ਸਵਾਲ ਇਹ ਹੈ ਕਿ, and ਇਸ ਕਰਕੇ. Những khung này làm người nghe thấy cấu trúc của suy nghĩ.",
    overview_en:
      "C2 speakers do not merely list reasons; they arrange argument with ਇੱਕ ਪਾਸੇ..., ਦੂਜੇ ਪਾਸੇ..., ਮੂਲ ਸਵਾਲ ਇਹ ਹੈ ਕਿ, and ਇਸ ਕਰਕੇ. These frames let the listener see the structure of the thought.",
    phrases: [
      {
        gurmukhi: "ਇੱਕ ਪਾਸੇ... ਦੂਜੇ ਪਾਸੇ...",
        romanization: "ikk paase... duje paase...",
        literal_en: "on one side... on the other side...",
        meaning_vi: "Một mặt... mặt khác...; cân bằng hai hướng lập luận.",
        meaning_en: "On one hand... on the other hand...; balances two lines of argument.",
        register: "neutral",
      },
      {
        gurmukhi: "ਮੂਲ ਸਵਾਲ ਇਹ ਹੈ ਕਿ",
        romanization: "mool sawaal ih hai ki",
        literal_en: "the root question is that",
        meaning_vi: "Câu hỏi cốt lõi là...; đưa cuộc nói chuyện về trọng tâm.",
        meaning_en: "The core question is...; brings discussion back to the center.",
        register: "formal",
      },
      {
        gurmukhi: "ਇਸ ਕਰਕੇ",
        romanization: "is karke",
        literal_en: "because of this",
        meaning_vi: "Vì vậy / do đó; nối kết luận với lý do.",
        meaning_en: "Therefore / because of this; links conclusion to reason.",
        register: "neutral",
      },
    ],
    examples: [
      {
        gurmukhi: "ਇੱਕ ਪਾਸੇ ਖ਼ਰਚਾ ਵੱਧੇਗਾ, ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਸੁਧਰੇਗੀ।",
        romanization: "ikk paase kharcha vadhega, duje paase gunvatta sudhregi.",
        vi: "Một mặt chi phí sẽ tăng, mặt khác chất lượng sẽ cải thiện.",
        en: "On one hand the cost will rise; on the other hand quality will improve.",
      },
      {
        gurmukhi: "ਮੂਲ ਸਵਾਲ ਇਹ ਹੈ ਕਿ ਅਸੀਂ ਕਿਸ ਨੂੰ ਪਹਿਲ ਦੇ ਰਹੇ ਹਾਂ।",
        romanization: "mool sawaal ih hai ki asin kis nu pahal de rahe haan.",
        vi: "Câu hỏi cốt lõi là chúng ta đang ưu tiên điều gì.",
        en: "The core question is what we are prioritizing.",
      },
    ],
    tip_vi:
      "Khi tranh luận, hãy báo cấu trúc trước khi đưa kết luận. Người nghe dễ theo hơn và ít cảm thấy bị ép.",
    tip_en:
      "When arguing, signal the structure before the conclusion. The listener can follow more easily and feels less cornered.",
  },
  {
    id: "pa_c2_humble_correction",
    level: "C2",
    focus: "softening",
    title_vi: "Sửa lời người khác mà không làm mất mặt",
    title_en: "Correcting someone without embarrassing them",
    overview_vi:
      "Sửa trực tiếp có thể cần thiết, nhưng C2 biết dùng ਸ਼ਾਇਦ, ਮੇਰਾ ਖ਼ਿਆਲ ਹੈ, and ਹੋ ਸਕਦਾ ਹੈ. Chúng tạo không gian cho người kia tự điều chỉnh thay vì bị bắt lỗi.",
    overview_en:
      "Direct correction can be necessary, but C2 speech often uses ਸ਼ਾਇਦ, ਮੇਰਾ ਖ਼ਿਆਲ ਹੈ, and ਹੋ ਸਕਦਾ ਹੈ. They give the other person room to adjust rather than feel caught out.",
    phrases: [
      {
        gurmukhi: "ਸ਼ਾਇਦ ਇੱਥੇ...",
        romanization: "shayad itthe...",
        literal_en: "perhaps here...",
        meaning_vi: "Có lẽ ở đây...; mở sửa lỗi rất mềm.",
        meaning_en: "Perhaps here...; opens a very soft correction.",
        register: "neutral",
      },
      {
        gurmukhi: "ਮੇਰਾ ਖ਼ਿਆਲ ਹੈ ਕਿ ਇਹ...",
        romanization: "mera khiaal hai ki ih...",
        literal_en: "my thought is that this...",
        meaning_vi: "Tôi nghĩ chỗ này...; nhận trách nhiệm về góc nhìn.",
        meaning_en: "I think this...; takes ownership of the viewpoint.",
        register: "neutral",
      },
      {
        gurmukhi: "ਹੋ ਸਕਦਾ ਹੈ ਕਿ ਅਸੀਂ ਇਸ ਨੂੰ ਹੋਰ ਤਰ੍ਹਾਂ ਵੇਖੀਏ",
        romanization: "ho sakda hai ki asin is nu hor tarhan vekhiye",
        literal_en: "it may be that we see it another way",
        meaning_vi: "Có thể ta nhìn theo cách khác; chuyển sửa lỗi thành cùng xem xét.",
        meaning_en: "We might look at it another way; turns correction into joint review.",
        register: "respectful",
      },
    ],
    examples: [
      {
        gurmukhi: "ਸ਼ਾਇਦ ਇੱਥੇ ਮਿਤੀ ਗਲਤ ਲਿਖੀ ਗਈ ਹੈ।",
        romanization: "shayad itthe miti galat likhi gai hai.",
        vi: "Có lẽ ngày tháng ở đây bị ghi sai.",
        en: "Perhaps the date here was written incorrectly.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਖ਼ਿਆਲ ਹੈ ਕਿ ਇਹ ਉਦਾਹਰਨ ਥੋੜ੍ਹੀ ਹੋਰ ਸਾਫ਼ ਹੋ ਸਕਦੀ ਹੈ।",
        romanization: "mera khiaal hai ki ih udaharan thorrhi hor saaf ho sakdi hai.",
        vi: "Tôi nghĩ ví dụ này có thể rõ hơn một chút.",
        en: "I think this example could be a little clearer.",
      },
    ],
    tip_vi:
      "Mẫu 'có lẽ...' trong Punjabi không nhất thiết là thiếu tự tin. Nó thường là chiến lược giữ thể diện.",
    tip_en:
      "'Perhaps...' in Punjabi does not necessarily mean uncertainty. It is often a face-saving strategy.",
  },
  {
    id: "pa_c2_script_awareness",
    level: "C2",
    focus: "nuance",
    title_vi: "Nhận biết hệ chữ: Gurmukhi chính, Shahmukhi để ý thức",
    title_en: "Script awareness: Gurmukhi primary, Shahmukhi as awareness",
    overview_vi:
      "Khóa này dùng Gurmukhi làm chính. Người học C2 nên biết rằng Punjabi cũng được viết bằng Shahmukhi trong một số cộng đồng và ngữ cảnh, nhưng bài này chỉ nhắc để nhận biết, không dạy Shahmukhi như một hệ đầy đủ.",
    overview_en:
      "This course uses Gurmukhi as primary. C2 learners should know that Punjabi is also written in Shahmukhi in some communities and contexts, but this lesson notes it only for awareness and does not teach Shahmukhi as a full system.",
    phrases: [
      {
        gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ",
        romanization: "gurmukhi lipi",
        literal_en: "Gurmukhi script",
        meaning_vi: "Chữ Gurmukhi; hệ chữ chính của tài liệu này.",
        meaning_en: "Gurmukhi script; the primary script of this material.",
        register: "neutral",
      },
      {
        gurmukhi: "ਸ਼ਾਹਮੁਖੀ ਬਾਰੇ ਜਾਣਕਾਰੀ",
        romanization: "shahmukhi bare jaankari",
        literal_en: "information about Shahmukhi",
        meaning_vi: "Thông tin nhận biết về Shahmukhi, không phải học đầy đủ.",
        meaning_en: "Awareness information about Shahmukhi, not full instruction.",
        register: "neutral",
      },
      {
        gurmukhi: "ਲਿਪੀ ਅਤੇ ਰਜਿਸਟਰ ਵੱਖ ਗੱਲਾਂ ਹਨ",
        romanization: "lipi ate register vakh gallan han",
        literal_en: "script and register are different matters",
        meaning_vi: "Hệ chữ và ngữ vực là hai chuyện khác nhau.",
        meaning_en: "Script and register are separate issues.",
        register: "formal",
      },
    ],
    examples: [
      {
        gurmukhi: "ਇੱਥੇ ਗੁਰਮੁਖੀ ਮੁੱਖ ਲਿਪੀ ਹੈ; ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਆਉਂਦੀ ਹੈ।",
        romanization: "itthe gurmukhi mukh lipi hai; shahmukhi sirf jaankari lai aundi hai.",
        vi: "Ở đây Gurmukhi là hệ chữ chính; Shahmukhi chỉ xuất hiện để nhận biết.",
        en: "Here Gurmukhi is the primary script; Shahmukhi appears only for awareness.",
      },
      {
        gurmukhi: "ਲਿਪੀ ਬਦਲਣ ਨਾਲ ਵਾਕ ਦਾ ਰਜਿਸਟਰ ਆਪਣੇ ਆਪ ਨਹੀਂ ਬਦਲਦਾ।",
        romanization: "lipi badlan naal vaak da register apne aap nahin badalda.",
        vi: "Đổi hệ chữ không tự động đổi ngữ vực của câu.",
        en: "Changing script does not automatically change the sentence's register.",
      },
    ],
    tip_vi:
      "Đừng nhầm hệ chữ với trình độ lịch sự. Gurmukhi/Shahmukhi là vấn đề chữ viết; trang trọng hay thân mật nằm ở lựa chọn từ và bối cảnh.",
    tip_en:
      "Do not confuse script with politeness level. Gurmukhi/Shahmukhi is about writing system; formal or intimate tone comes from word choice and context.",
  },
];
