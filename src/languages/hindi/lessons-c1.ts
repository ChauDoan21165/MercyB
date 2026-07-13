// Hindi C1 lessons — academic and professional discourse.
// Neutral examples only; content teaches language frames, not political or religious claims.

export type HindiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type HindiC1Category =
  | "academic_presentation"
  | "report_analysis"
  | "nuanced_argument"
  | "media_discourse"
  | "professional_register";

export type HindiSentence = {
  hi: string;
  romanization: string;
  vi: string;
  en: string;
  note_vi?: string;
  note_en?: string;
};

export type HindiVocabEntry = {
  cell_id?: string;
  hi: string;
  romanization: string;
  vi: string;
  en: string;
  pos?: string;
};

export type HindiLesson = {
  id: string;
  level: HindiCefrLevel;
  category: HindiC1Category;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  sentences: HindiSentence[];
  vocabulary: HindiVocabEntry[];
  cultural_notes_vi: string;
  cultural_notes_en: string;
  tip_advice_vi: string;
  tip_advice_en: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export const lessons: HindiLesson[] = [
  {
    id: "hindi_c1_academic_presentation",
    level: "C1",
    category: "academic_presentation",
    title_vi: "Thuyết trình học thuật: mục tiêu, luận điểm và giới hạn",
    title_en: "Academic presentation: aim, argument, and limits",
    intro_vi:
      "Bài này luyện khung mở đầu bài thuyết trình học thuật bằng Hindi chuẩn, tập trung vào mục tiêu, luận điểm và giới hạn dữ liệu.",
    intro_en:
      "This lesson practices opening an academic presentation in standard Hindi, focusing on aim, argument, and data limits.",
    sentences: [
      {
        hi: "इस प्रस्तुति का उद्देश्य समस्या के मुख्य पहलुओं को स्पष्ट करना है।",
        romanization: "is prastuti kaa uddeshya samasyaa ke mukhya pahluon ko spasht karnaa hai",
        vi: "Mục tiêu của bài thuyết trình này là làm rõ các khía cạnh chính của vấn đề.",
        en: "The aim of this presentation is to clarify the main aspects of the problem.",
      },
      {
        hi: "मेरा मुख्य तर्क यह है कि उपलब्ध आँकड़े अभी पर्याप्त नहीं हैं।",
        romanization: "meraa mukhya tark yah hai ki uplabdh aankde abhi paryaapt nahiin hain",
        vi: "Luận điểm chính của tôi là dữ liệu hiện có vẫn chưa đủ.",
        en: "My main argument is that the available data is not yet sufficient.",
      },
      {
        hi: "इस अध्ययन की एक सीमा यह है कि नमूना छोटा है।",
        romanization: "is adhyayan kii ek siimaa yah hai ki namuunaa chhotaa hai",
        vi: "Một giới hạn của nghiên cứu này là mẫu còn nhỏ.",
        en: "One limitation of this study is that the sample is small.",
      },
    ],
    vocabulary: [
      { cell_id: "fe8dafaa-8a35-4c67-bab5-f112919fa9a6", hi: "प्रस्तुति", romanization: "prastuti", vi: "bài thuyết trình", en: "presentation", pos: "n." },
      { cell_id: "33a77263-fa18-4e60-ba03-5db02f44da91", hi: "उद्देश्य", romanization: "uddeshya", vi: "mục tiêu", en: "aim", pos: "n." },
      { cell_id: "debc4b91-21f2-46aa-b6b8-f0538c02784e", hi: "तर्क", romanization: "tark", vi: "lập luận", en: "argument", pos: "n." },
      { cell_id: "c59bd995-ad85-4cf9-a2a5-69a67fee3f5c", hi: "सीमा", romanization: "siimaa", vi: "giới hạn", en: "limitation", pos: "n." },
    ],
    cultural_notes_vi:
      "Hindi học thuật dùng nhiều danh từ trừu tượng. Đừng cố Sanskrit hóa mọi từ; câu rõ ràng quan trọng hơn độ trang trọng.",
    cultural_notes_en:
      "Academic Hindi uses many abstract nouns. Do not Sanskritize every word; clarity matters more than formality.",
    tip_advice_vi:
      "Khung C1 an toàn: उद्देश्य + मुख्य तर्क + सीमा. Đây là bộ khung giúp bài nói nghe có cấu trúc.",
    tip_advice_en:
      "Safe C1 frame: उद्देश्य + मुख्य तर्क + सीमा. It makes a presentation sound structured.",
  },
  {
    id: "hindi_c1_report_summary_analysis",
    level: "C1",
    category: "report_analysis",
    title_vi: "Tóm tắt báo cáo và phân tích kết quả",
    title_en: "Report summary and analysis of findings",
    intro_vi:
      "Bài này luyện văn báo cáo: kết quả chính, xu hướng, tác động và khuyến nghị.",
    intro_en:
      "This lesson practices report prose: main findings, trends, impact, and recommendations.",
    sentences: [
      {
        hi: "रिपोर्ट से स्पष्ट होता है कि पिछले वर्ष भागीदारी बढ़ी है।",
        romanization: "riport se spasht hotaa hai ki pichhle varsh bhaagidaarii badhii hai",
        vi: "Báo cáo cho thấy rõ rằng mức tham gia đã tăng trong năm ngoái.",
        en: "The report shows clearly that participation increased last year.",
      },
      {
        hi: "मुख्य निष्कर्ष यह है कि प्रशिक्षण से परिणाम बेहतर हुए।",
        romanization: "mukhya nishkarsh yah hai ki prashikshan se parinaam behtar hue",
        vi: "Kết luận chính là việc đào tạo đã cải thiện kết quả.",
        en: "The main finding is that training improved the results.",
      },
      {
        hi: "इसी आधार पर नियमित समीक्षा की सिफारिश की जाती है।",
        romanization: "isii aadhaar par niyamit samiikshaa kii sifaarish kii jaatii hai",
        vi: "Trên cơ sở đó, việc rà soát định kỳ được khuyến nghị.",
        en: "On this basis, regular review is recommended.",
      },
    ],
    vocabulary: [
      { cell_id: "5b97cc33-6285-4f25-9988-daa932781bf6", hi: "निष्कर्ष", romanization: "nishkarsh", vi: "kết luận, phát hiện", en: "finding, conclusion", pos: "n." },
      { cell_id: "919460b8-a9ba-4d68-9cfc-4b024735a906", hi: "प्रशिक्षण", romanization: "prashikshan", vi: "đào tạo", en: "training", pos: "n." },
      { cell_id: "168f206f-e8fa-46b6-826e-c21acc7cad04", hi: "समीक्षा", romanization: "samiikshaa", vi: "rà soát, đánh giá", en: "review", pos: "n." },
      { cell_id: "c465fe96-b06c-4725-a166-b7a2e8877b9e", hi: "सिफारिश", romanization: "sifaarish", vi: "khuyến nghị", en: "recommendation", pos: "n." },
    ],
    cultural_notes_vi:
      "Báo cáo Hindi chính thức hay dùng thể bị động như सिफारिश की जाती है. Hãy nhận diện nó như giọng văn tổ chức.",
    cultural_notes_en:
      "Formal Hindi reports often use passive-like phrasing such as सिफारिश की जाती है. Treat it as institutional style.",
    tip_advice_vi:
      "Dùng रिपोर्ट से स्पष्ट होता है कि... để nối dữ liệu với kết luận mà không quá chủ quan.",
    tip_advice_en:
      "Use रिपोर्ट से स्पष्ट होता है कि... to connect data to a conclusion without sounding too subjective.",
  },
  {
    id: "hindi_c1_nuanced_opinion_argument",
    level: "C1",
    category: "nuanced_argument",
    title_vi: "Ý kiến sắc thái: rào đón, nhượng bộ và giới hạn",
    title_en: "Nuanced opinion: hedging, concession, and limits",
    intro_vi:
      "Bài này luyện nêu quan điểm mạnh vừa đủ: không quá chắc nịch, không quá yếu.",
    intro_en:
      "This lesson practices making a position strong enough without sounding absolute or too weak.",
    sentences: [
      {
        hi: "यह कहना उचित होगा कि नीति का प्रभाव मिश्रित रहा है।",
        romanization: "yah kahnaa uchit hogaa ki niiti kaa prabhaav mishrit rahaa hai",
        vi: "Có thể nói một cách hợp lý rằng tác động của chính sách là hỗn hợp.",
        en: "It would be reasonable to say that the policy's effect has been mixed.",
      },
      {
        hi: "फिर भी, इस तर्क की एक सीमा है।",
        romanization: "phir bhii, is tark kii ek siimaa hai",
        vi: "Dù vậy, lập luận này có một giới hạn.",
        en: "Even so, this argument has a limitation.",
      },
      {
        hi: "मुझे लगता है कि निष्कर्ष निकालने से पहले और प्रमाण चाहिए।",
        romanization: "mujhe lagtaa hai ki nishkarsh nikaalne se pahle aur pramaan chaahiye",
        vi: "Tôi nghĩ cần thêm bằng chứng trước khi rút ra kết luận.",
        en: "I think more evidence is needed before drawing a conclusion.",
      },
    ],
    vocabulary: [
      { cell_id: "1a6f7fd8-f186-4aee-9ff4-e89deb0cebb8", hi: "उचित", romanization: "uchit", vi: "phù hợp, hợp lý", en: "appropriate, reasonable", pos: "adj." },
      { cell_id: "c441b539-494c-4404-b8e3-05ef15ba5b3b", hi: "प्रभाव", romanization: "prabhaav", vi: "tác động", en: "effect", pos: "n." },
      { cell_id: "3deea74d-6027-4580-8a0a-6461afd48d68", hi: "मिश्रित", romanization: "mishrit", vi: "hỗn hợp", en: "mixed", pos: "adj." },
      { cell_id: "0c2d11e0-26ff-4177-9387-67d30c5989fa", hi: "प्रमाण", romanization: "pramaan", vi: "bằng chứng", en: "evidence", pos: "n." },
    ],
    cultural_notes_vi:
      "Ở C1, Hindi trang trọng đánh giá mức độ chắc chắn bằng cụm như उचित होगा, शायद, संभव है. Đây là kỹ năng lập luận, không phải né tránh.",
    cultural_notes_en:
      "At C1, formal Hindi calibrates certainty with phrases such as उचित होगा, शायद, and संभव है. This is argument skill, not evasion.",
    tip_advice_vi:
      "Công thức: claim mềm + giới hạn + bằng chứng cần thêm. Nó giúp phản biện không cực đoan.",
    tip_advice_en:
      "Formula: softened claim + limitation + needed evidence. It keeps argumentation from sounding extreme.",
  },
  {
    id: "hindi_c1_media_discourse_frames",
    level: "C1",
    category: "media_discourse",
    title_vi: "Khung diễn ngôn truyền thông: nguồn, xác nhận và thận trọng",
    title_en: "Media discourse frames: sources, confirmation, and caution",
    intro_vi:
      "Bài này luyện cách nói về nguồn tin, tuyên bố và mức độ xác nhận trong bản tin trung lập.",
    intro_en:
      "This lesson practices source attribution, claims, and confirmation level in neutral news language.",
    sentences: [
      {
        hi: "स्थानीय सूत्रों के अनुसार, सेवा कल से फिर शुरू होगी।",
        romanization: "sthaaniy suutro ke anusaar, sevaa kal se phir shuruu hogii",
        vi: "Theo các nguồn địa phương, dịch vụ sẽ bắt đầu lại từ ngày mai.",
        en: "According to local sources, the service will resume tomorrow.",
      },
      {
        hi: "इस दावे की स्वतंत्र पुष्टि अभी नहीं हुई है।",
        romanization: "is daave kii svatantra pushti abhi nahiin huii hai",
        vi: "Tuyên bố này hiện chưa được xác nhận độc lập.",
        en: "This claim has not yet been independently confirmed.",
      },
      {
        hi: "समाचार में शब्द-चयन पाठक की धारणा को प्रभावित कर सकता है।",
        romanization: "samaachaar men shabd-chayan paathak kii dhaarnaa ko prabhaavit kar saktaa hai",
        vi: "Cách chọn từ trong tin tức có thể ảnh hưởng đến nhận thức của độc giả.",
        en: "Word choice in news can influence the reader's perception.",
      },
    ],
    vocabulary: [
      { cell_id: "fca011cf-138c-4e39-bd6b-18f4b05e2589", hi: "सूत्र", romanization: "suutra", vi: "nguồn tin", en: "source", pos: "n." },
      { cell_id: "b38b5806-ef2e-45e7-a4d4-dd579d154003", hi: "दावा", romanization: "daavaa", vi: "tuyên bố, lời khẳng định", en: "claim", pos: "n." },
      { cell_id: "20bcb999-516c-41b9-91bf-dc3cead50134", hi: "पुष्टि", romanization: "pushti", vi: "xác nhận", en: "confirmation", pos: "n." },
      { cell_id: "060d2f32-fb82-495f-8d8a-69edad944b7d", hi: "शब्द-चयन", romanization: "shabd-chayan", vi: "cách chọn từ", en: "word choice", pos: "n." },
    ],
    cultural_notes_vi:
      "Bài này dạy cơ chế ngôn ngữ truyền thông, không đánh giá sự kiện thật. Khi ví dụ nhạy cảm, hãy dùng chủ đề trung lập.",
    cultural_notes_en:
      "This lesson teaches media language mechanics, not judgments about real events. Use neutral topics for sensitive examples.",
    tip_advice_vi:
      "Luôn tách 'nguồn nói' và 'đã được xác nhận'. सूत्रों के अनुसार không đồng nghĩa với sự thật đã kiểm chứng.",
    tip_advice_en:
      "Separate 'a source says' from 'it has been confirmed.' सूत्रों के अनुसार does not mean verified fact.",
  },
  {
    id: "hindi_c1_professional_register_switching",
    level: "C1",
    category: "professional_register",
    title_vi: "Chuyển đổi sắc thái: nói thường, công sở và hành chính",
    title_en: "Register switching: spoken, professional, and administrative Hindi",
    intro_vi:
      "Bài này luyện chọn mức trang trọng phù hợp thay vì biến mọi câu thành Hindi hành chính nặng.",
    intro_en:
      "This lesson practices choosing the right formality level instead of turning every sentence into heavy administrative Hindi.",
    sentences: [
      {
        hi: "क्या आप मुझे बता सकते हैं?",
        romanization: "kyaa aap mujhe bataa sakte hain?",
        vi: "Bạn có thể nói cho tôi biết không?",
        en: "Could you tell me?",
      },
      {
        hi: "क्या आप मुझे सूचित कर सकते हैं?",
        romanization: "kyaa aap mujhe suuchit kar sakte hain?",
        vi: "Bạn có thể thông báo cho tôi không?",
        en: "Could you inform me?",
        note_vi: "सूचित करना trang trọng hơn बताना.",
        note_en: "सूचित करना is more formal than बताना.",
      },
      {
        hi: "कृपया आवश्यक जानकारी उपलब्ध कराइए।",
        romanization: "kripyaa aavashyak jaankaarii uplabdh karaaiye",
        vi: "Vui lòng cung cấp thông tin cần thiết.",
        en: "Please provide the required information.",
      },
    ],
    vocabulary: [
      { cell_id: "09ff6954-b8c3-49c1-ab3f-619afd0c2699", hi: "बताना", romanization: "bataanaa", vi: "nói, cho biết", en: "to tell", pos: "v." },
      { cell_id: "b30f028a-2caa-4bdd-854f-47bc20daa7ba", hi: "सूचित करना", romanization: "suuchit karnaa", vi: "thông báo", en: "to inform", pos: "v." },
      { cell_id: "b7cb71df-e4da-456c-bab0-1f216b3c8af7", hi: "उपलब्ध कराना", romanization: "uplabdh karaanaa", vi: "cung cấp", en: "to provide", pos: "v." },
      { cell_id: "c0efb7eb-dddd-4a01-9637-a7527304c39a", hi: "आवश्यक", romanization: "aavashyak", vi: "cần thiết", en: "required", pos: "adj." },
    ],
    cultural_notes_vi:
      "Hindi trang trọng không phải lúc nào cũng tốt hơn. Công sở thường cần rõ ràng, lịch sự và ngắn gọn.",
    cultural_notes_en:
      "More formal Hindi is not always better. Workplace Hindi often needs to be clear, polite, and concise.",
    tip_advice_vi:
      "Hãy học theo cặp: बताना/सूचित करना, देना/उपलब्ध कराना, ज़रूरी/आवश्यक để kiểm soát register.",
    tip_advice_en:
      "Learn pairs such as बताना/सूचित करना, देना/उपलब्ध कराना, and ज़रूरी/आवश्यक to control register.",
  },
];

export default lessons;
