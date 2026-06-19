// Hindi C2 lessons — rhetoric, debate, analysis, and register mastery.
// Neutral language-learning examples only; no current political or religious claims.

export type HindiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type HindiC2Category =
  | "formal_debate"
  | "literary_analysis"
  | "rhetoric_subtext"
  | "register_style";

export type HindiSentence = {
  hi: string;
  romanization: string;
  vi: string;
  en: string;
  note_vi?: string;
  note_en?: string;
};

export type HindiVocabEntry = {
  hi: string;
  romanization: string;
  vi: string;
  en: string;
  pos?: string;
};

export type HindiLesson = {
  id: string;
  level: HindiCefrLevel;
  category: HindiC2Category;
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
    id: "hindi_c2_formal_debate",
    level: "C2",
    category: "formal_debate",
    title_vi: "Tranh biện trang trọng: phản bác không nâng giọng",
    title_en: "Formal debate: rebuttal without raising your voice",
    intro_vi:
      "Bài này luyện cách tháo gỡ lập luận bằng giả định, phạm vi và bằng chứng thay vì công kích người nói.",
    intro_en:
      "This lesson practices dismantling an argument through assumptions, scope, and evidence rather than attacking the speaker.",
    sentences: [
      {
        hi: "यह तर्क इस धारणा पर आधारित है कि सभी परिस्थितियाँ समान हैं।",
        romanization: "yah tark is dhaarnaa par aadhaarit hai ki sabhii paristhitiyan samaan hain",
        vi: "Lập luận này dựa trên giả định rằng mọi hoàn cảnh đều giống nhau.",
        en: "This argument is based on the assumption that all circumstances are the same.",
      },
      {
        hi: "यदि हम इसे स्वीकार भी करें, तो निष्कर्ष अपने-आप सिद्ध नहीं होता।",
        romanization: "yadi ham ise sviikaar bhii karen, to nishkarsh apne-aap siddh nahiin hotaa",
        vi: "Ngay cả nếu chúng ta chấp nhận điều đó, kết luận cũng không tự động được chứng minh.",
        en: "Even if we accept it, the conclusion is not automatically proven.",
      },
      {
        hi: "बहस का प्रश्न यह है कि प्रमाण कितना विश्वसनीय है।",
        romanization: "bahas kaa prashn yah hai ki pramaan kitnaa vishvasaniy hai",
        vi: "Câu hỏi của cuộc tranh luận là bằng chứng đáng tin đến mức nào.",
        en: "The debate question is how reliable the evidence is.",
      },
    ],
    vocabulary: [
      { hi: "धारणा", romanization: "dhaarnaa", vi: "giả định", en: "assumption", pos: "n." },
      { hi: "सिद्ध होना", romanization: "siddh honaa", vi: "được chứng minh", en: "to be proven", pos: "v." },
      { hi: "विश्वसनीय", romanization: "vishvasaniy", vi: "đáng tin cậy", en: "reliable", pos: "adj." },
      { hi: "प्रमाण", romanization: "pramaan", vi: "bằng chứng", en: "evidence", pos: "n." },
    ],
    cultural_notes_vi:
      "Tranh biện Hindi trang trọng ưu tiên kiểm tra giả định và bằng chứng. Công kích trực tiếp làm giảm sức thuyết phục.",
    cultural_notes_en:
      "Formal Hindi debate prioritizes testing assumptions and evidence. Direct attacks weaken persuasion.",
    tip_advice_vi:
      "Công thức C2: giả định của lập luận + nhượng bộ có điều kiện + giới hạn kết luận.",
    tip_advice_en:
      "C2 formula: argument assumption + conditional concession + limit of the conclusion.",
  },
  {
    id: "hindi_c2_literary_media_analysis",
    level: "C2",
    category: "literary_analysis",
    title_vi: "Phân tích văn bản: giọng kể, hình ảnh và lập trường",
    title_en: "Text analysis: narrative voice, imagery, and stance",
    intro_vi:
      "Bài này luyện từ vựng phân tích văn bản qua ví dụ trung lập, không gán ý định tác giả khi thiếu chứng cứ.",
    intro_en:
      "This lesson practices text-analysis vocabulary through neutral examples, without assigning authorial intent without evidence.",
    sentences: [
      {
        hi: "कथावाचक सीधे निर्णय नहीं देता, बल्कि संकेतों के माध्यम से पाठक को सोचने देता है।",
        romanization: "kathaavaachak siidhe nirnay nahiin detaa, balki sanketon ke maadhyam se paathak ko sochne detaa hai",
        vi: "Người kể không phán xét trực tiếp, mà để độc giả suy nghĩ thông qua các tín hiệu.",
        en: "The narrator does not judge directly, but lets the reader think through signals.",
      },
      {
        hi: "रूपक केवल सजावट नहीं है; वह पूरे अनुच्छेद की दिशा तय करता है।",
        romanization: "ruupak keval sajaavat nahiin hai; vah puure anuchchhed kii dishaa tay kartaa hai",
        vi: "Ẩn dụ không chỉ là trang trí; nó định hướng toàn bộ đoạn văn.",
        en: "The metaphor is not mere decoration; it sets the direction of the whole paragraph.",
      },
      {
        hi: "लेख में प्रयुक्त मौन भी एक अर्थ पैदा करता है।",
        romanization: "lekh men prayukt maun bhii ek arth paidaa kartaa hai",
        vi: "Sự im lặng được dùng trong bài viết cũng tạo ra ý nghĩa.",
        en: "The silence used in the text also creates meaning.",
      },
    ],
    vocabulary: [
      { hi: "कथावाचक", romanization: "kathaavaachak", vi: "người kể", en: "narrator", pos: "n." },
      { hi: "रूपक", romanization: "ruupak", vi: "ẩn dụ", en: "metaphor", pos: "n." },
      { hi: "संकेत", romanization: "sanket", vi: "dấu hiệu, ám chỉ", en: "signal, cue", pos: "n." },
      { hi: "अनुच्छेद", romanization: "anuchchhed", vi: "đoạn văn", en: "paragraph", pos: "n." },
    ],
    cultural_notes_vi:
      "Ở phân tích văn học, tránh câu 'tác giả muốn nói' nếu không có chứng cứ. Hãy bắt đầu từ từ ngữ, cấu trúc và giọng kể.",
    cultural_notes_en:
      "In literary analysis, avoid 'the author meant' without evidence. Start from wording, structure, and narrative voice.",
    tip_advice_vi:
      "Một câu phân tích tốt nêu thiết bị ngôn ngữ và tác dụng của nó: रूपक क्या करता है?",
    tip_advice_en:
      "A good analysis sentence names the language device and its effect: रूपक क्या करता है?",
  },
  {
    id: "hindi_c2_rhetoric_irony_subtext",
    level: "C2",
    category: "rhetoric_subtext",
    title_vi: "Tu từ, mỉa mai và hàm ý",
    title_en: "Rhetoric, irony, and implication",
    intro_vi:
      "Bài này luyện nhận ra nghĩa nằm ngoài bề mặt câu: mỉa mai, hàm ý, câu hỏi tu từ và nói giảm.",
    intro_en:
      "This lesson practices recognizing meaning beyond the surface: irony, implication, rhetorical questions, and understatement.",
    sentences: [
      {
        hi: "वाक्य सतह पर प्रशंसा जैसा लगता है, लेकिन संदर्भ में व्यंग्य बन जाता है।",
        romanization: "vaakya satah par prashansaa jaisaa lagtaa hai, lekin sandarbh men vyangya ban jaataa hai",
        vi: "Câu trên bề mặt giống lời khen, nhưng trong ngữ cảnh lại thành mỉa mai.",
        en: "On the surface the sentence sounds like praise, but in context it becomes irony.",
      },
      {
        hi: "प्रश्न वास्तव में उत्तर नहीं माँगता; वह श्रोता को चुनौती देता है।",
        romanization: "prashn vaastav men uttar nahiin maangtaa; vah shrotaa ko chunautii detaa hai",
        vi: "Câu hỏi thật ra không yêu cầu câu trả lời; nó thách thức người nghe.",
        en: "The question does not really ask for an answer; it challenges the listener.",
      },
      {
        hi: "निहितार्थ समझने के लिए शब्दों से अधिक संदर्भ देखना पड़ता है।",
        romanization: "nihitaarth samajhne ke liye shabdon se adhik sandarbh dekhnaa padtaa hai",
        vi: "Để hiểu hàm ý, cần nhìn vào ngữ cảnh nhiều hơn từ ngữ.",
        en: "To understand implication, one must look beyond the words to the context.",
      },
    ],
    vocabulary: [
      { hi: "व्यंग्य", romanization: "vyangya", vi: "mỉa mai, châm biếm", en: "irony, satire", pos: "n." },
      { hi: "निहितार्थ", romanization: "nihitaarth", vi: "hàm ý", en: "implication", pos: "n." },
      { hi: "संदर्भ", romanization: "sandarbh", vi: "ngữ cảnh", en: "context", pos: "n." },
      { hi: "चुनौती", romanization: "chunautii", vi: "thách thức", en: "challenge", pos: "n." },
    ],
    cultural_notes_vi:
      "Ví dụ C2 về mỉa mai nên trung lập hoặc hư cấu. Không dùng nhóm chính trị, tôn giáo hay sắc tộc thật làm mục tiêu luyện tập.",
    cultural_notes_en:
      "C2 irony examples should be neutral or fictional. Do not use real political, religious, or ethnic groups as practice targets.",
    tip_advice_vi:
      "Khi giải thích hàm ý, hãy nói 'trong ngữ cảnh này' thay vì biến suy đoán thành sự thật.",
    tip_advice_en:
      "When explaining implication, say 'in this context' rather than turning inference into fact.",
  },
  {
    id: "hindi_c2_register_style_mastery",
    level: "C2",
    category: "register_style",
    title_vi: "Làm chủ register: nói thường, truyền thông, học thuật và hành chính",
    title_en: "Register mastery: spoken, media, academic, and administrative styles",
    intro_vi:
      "Bài này luyện viết lại cùng một ý theo nhiều register Hindi, đồng thời tránh đánh đồng 'trang trọng' với 'tốt hơn'.",
    intro_en:
      "This lesson practices rewriting the same idea across Hindi registers while avoiding the idea that 'more formal' is always better.",
    sentences: [
      {
        hi: "बोलचाल में हम कह सकते हैं: यह तरीका ठीक है।",
        romanization: "bolchaal men ham kah sakte hain: yah tariikaa thiik hai",
        vi: "Trong nói thường, ta có thể nói: cách này ổn.",
        en: "In speech, we can say: this method is fine.",
      },
      {
        hi: "पेशेवर शैली में: यह तरीका वर्तमान आवश्यकता के लिए उपयुक्त है।",
        romanization: "peshevar shailii men: yah tariikaa vartamaan aavashyaktaa ke liye upyukt hai",
        vi: "Trong phong cách chuyên nghiệp: cách này phù hợp với nhu cầu hiện tại.",
        en: "In professional style: this method is suitable for the current need.",
      },
      {
        hi: "औपचारिक शैली में: यह पद्धति वर्तमान आवश्यकता की पूर्ति करती है।",
        romanization: "aupachaarik shailii men: yah paddhati vartamaan aavashyaktaa kii puurti kartii hai",
        vi: "Trong phong cách trang trọng: phương pháp này đáp ứng nhu cầu hiện tại.",
        en: "In formal style: this method fulfills the current requirement.",
      },
    ],
    vocabulary: [
      { hi: "बोलचाल", romanization: "bolchaal", vi: "ngôn ngữ nói thường", en: "colloquial speech", pos: "n." },
      { hi: "पेशेवर", romanization: "peshevar", vi: "chuyên nghiệp", en: "professional", pos: "adj." },
      { hi: "औपचारिक", romanization: "aupachaarik", vi: "trang trọng", en: "formal", pos: "adj." },
      { hi: "पद्धति", romanization: "paddhati", vi: "phương pháp", en: "method", pos: "n." },
    ],
    cultural_notes_vi:
      "Hindi hiện đại có nhiều register cùng tồn tại: nói thường, Hindi pha English, truyền thông, học thuật và hành chính. Bài học phải giúp chọn đúng ngữ cảnh.",
    cultural_notes_en:
      "Modern Hindi has several coexisting registers: colloquial, English-mixed, media, academic, and administrative. The lesson should teach contextual choice.",
    tip_advice_vi:
      "Ở C2, kỹ năng không phải dùng từ khó nhất, mà là chọn từ đúng cho người nghe và mục đích.",
    tip_advice_en:
      "At C2, the skill is not using the hardest word; it is choosing the right word for audience and purpose.",
    register_notes_vi:
      "पद्धति trang trọng hơn तरीका. Cả hai đều đúng; ngữ cảnh quyết định.",
    register_notes_en:
      "पद्धति is more formal than तरीका. Both are correct; context decides.",
  },
];

export default lessons;
