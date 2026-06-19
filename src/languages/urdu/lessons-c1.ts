// Urdu C1 lessons for Vietnamese and English learners.
//
// W2 A8 scope: advanced local Urdu curriculum only. Examples are neutral and
// language-focused; no political/religious claims, tutor work, or audio promise.

import type { UrduLesson } from "./lessons-b1";

export const lessons: UrduLesson[] = [
  {
    id: "urdu_c1_academic_presentation",
    level: "C1",
    category: "academic_presentation",
    title_vi: "Trình bày học thuật: mục tiêu, phương pháp và giới hạn",
    title_en: "Academic presentation: aim, method, and limitation",
    intro_vi:
      "Bài này luyện mở đầu một bài trình bày học thuật bằng Urdu trang trọng nhưng rõ ràng.",
    intro_en:
      "This lesson practices opening an academic presentation in formal but clear Urdu.",
    sentences: [
      {
        ur: "اس مقالے کا مقصد تعلیمی زبان کے استعمال کا جائزہ لینا ہے۔",
        romanization: "is maqale ka maqsad taleemi zaban ke istemal ka jaiza lena hai.",
        vi: "Mục đích của bài này là xem xét việc sử dụng ngôn ngữ học thuật.",
        en: "The aim of this paper is to examine the use of academic language.",
      },
      {
        ur: "یہ مطالعہ دستیاب شواہد کی حد تک محدود ہے۔",
        romanization: "yeh mutala'a dastiyab shawahid ki hadd tak mahdood hai.",
        vi: "Nghiên cứu này bị giới hạn trong phạm vi bằng chứng có sẵn.",
        en: "This study is limited to the available evidence.",
      },
      {
        ur: "میں پہلے طریقۂ کار بیان کروں گا، پھر نتائج پر بات کروں گا۔",
        romanization: "main pehle tariqa-e-kar bayan karun ga, phir nataij par baat karun ga.",
        vi: "Trước hết tôi sẽ trình bày phương pháp, sau đó nói về kết quả.",
        en: "First I will describe the method, then I will discuss the findings.",
      },
    ],
    vocabulary: [
      { ur: "مقالہ", romanization: "maqala", vi: "bài nghiên cứu / bài luận", en: "paper/essay", pos: "noun" },
      { ur: "مقصد", romanization: "maqsad", vi: "mục đích", en: "aim", pos: "noun" },
      { ur: "مطالعہ", romanization: "mutala'a", vi: "nghiên cứu", en: "study", pos: "noun" },
      { ur: "شواہد", romanization: "shawahid", vi: "bằng chứng", en: "evidence", pos: "noun" },
      { ur: "طریقۂ کار", romanization: "tariqa-e-kar", vi: "phương pháp", en: "method", pos: "noun phrase" },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Nghiên cứu này bị giới hạn trong phạm vi bằng chứng có sẵn.",
        en: "This study is limited to the available evidence.",
        ur: "یہ مطالعہ دستیاب شواہد کی حد تک محدود ہے۔",
        romanization: "yeh mutala'a dastiyab shawahid ki hadd tak mahdood hai.",
      },
    ],
    cultural_notes_vi:
      "Urdu học thuật hiệu quả không nhất thiết phải quá hoa mỹ. Câu rõ, nguồn rõ, giới hạn rõ thường tốt hơn từ vựng quá nặng.",
    cultural_notes_en:
      "Effective academic Urdu does not have to be ornate. Clear sentences, clear sources, and clear limits are often better than overly heavy vocabulary.",
    tip_advice_vi:
      "Dùng `کا مقصد... ہے` để nêu mục tiêu, và `... کی حد تک محدود ہے` để nêu giới hạn.",
    tip_advice_en:
      "Use `کا مقصد... ہے` to state an aim, and `... کی حد تک محدود ہے` to state a limitation.",
    register_notes_vi:
      "Trang trọng học thuật. Tránh biến từng câu thành Persianized quá mức nếu người học cần rõ nghĩa.",
    register_notes_en:
      "Formal academic register. Avoid making every sentence overly Persianized when clarity matters.",
  },
  {
    id: "urdu_c1_professional_correspondence",
    level: "C1",
    category: "professional_correspondence",
    title_vi: "Thư từ chuyên nghiệp: theo dõi và xin hướng dẫn",
    title_en: "Professional correspondence: follow-up and guidance",
    intro_vi:
      "Bài này luyện văn phong thư từ Urdu cho tổ chức, giáo viên, văn phòng hoặc nơi làm việc.",
    intro_en:
      "This lesson practices Urdu correspondence for institutions, teachers, offices, or workplaces.",
    sentences: [
      {
        ur: "جناب والا، گزشتہ پیغام کے سلسلے میں رہنمائی درکار ہے۔",
        romanization: "janab-e-wala, guzashtha paigham ke silsile mein rahnumai darkar hai.",
        vi: "Kính thưa ông/bà, tôi cần hướng dẫn liên quan đến tin nhắn trước.",
        en: "Dear Sir/Madam, I need guidance regarding the previous message.",
      },
      {
        ur: "اگر ممکن ہو تو براہ کرم جواب سے آگاہ فرمائیں۔",
        romanization: "agar mumkin ho to barah-e-karam jawab se aagah farmaen.",
        vi: "Nếu có thể, xin vui lòng thông báo phản hồi.",
        en: "If possible, please inform me of the response.",
      },
      {
        ur: "آپ کے وقت اور تعاون کا شکریہ۔",
        romanization: "aap ke waqt aur ta'awun ka shukriya.",
        vi: "Cảm ơn thời gian và sự hỗ trợ của quý vị.",
        en: "Thank you for your time and cooperation.",
      },
    ],
    vocabulary: [
      { ur: "رہنمائی", romanization: "rahnumai", vi: "sự hướng dẫn", en: "guidance", pos: "noun" },
      { ur: "درکار", romanization: "darkar", vi: "cần thiết", en: "required/needed", pos: "adjective" },
      { ur: "آگاہ فرمائیں", romanization: "aagah farmaen", vi: "xin thông báo", en: "please inform", pos: "formal verb phrase" },
      { ur: "تعاون", romanization: "ta'awun", vi: "sự hỗ trợ/hợp tác", en: "cooperation", pos: "noun" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "گزشتہ پیغام کے سلسلے میں ___ درکار ہے۔",
        answer: "رہنمائی",
        hint_vi: "từ nghĩa là hướng dẫn",
        hint_en: "the word meaning guidance",
      },
    ],
    cultural_notes_vi:
      "Các công thức như `جناب والا` và `آگاہ فرمائیں` tạo văn phong rất lịch sự. Dùng khi viết cho cơ quan hoặc người có vị thế cao hơn.",
    cultural_notes_en:
      "Formulas like `جناب والا` and `آگاہ فرمائیں` create a highly courteous tone. Use them for institutions or higher-status recipients.",
    tip_advice_vi:
      "`کے سلسلے میں` là cụm nối chuyên nghiệp để nói 'liên quan đến'.",
    tip_advice_en:
      "`کے سلسلے میں` is a professional connector meaning 'regarding'.",
    register_notes_vi:
      "Trang trọng. Trong email đồng nghiệp thân, có thể dùng câu nhẹ hơn.",
    register_notes_en:
      "Formal. With close colleagues, a lighter sentence may be better.",
  },
  {
    id: "urdu_c1_media_discussion_attribution",
    level: "C1",
    category: "media_discussion",
    title_vi: "Thảo luận truyền thông: quy nguồn và mức chắc chắn",
    title_en: "Media discussion: attribution and certainty",
    intro_vi:
      "Bài này luyện cách thảo luận tin tức trung lập bằng Urdu: nguồn nói gì, điều gì chưa xác minh, và kết luận nào cần thận trọng.",
    intro_en:
      "This lesson practices neutral discussion of news in Urdu: what a source says, what is unverified, and which conclusions require caution.",
    sentences: [
      {
        ur: "ذرائع کے مطابق، منصوبے کی تفصیلات ابھی واضح نہیں ہیں۔",
        romanization: "zarai ke mutabiq, mansoobe ki tafsilat abhi wazeh nahin hain.",
        vi: "Theo các nguồn tin, chi tiết của dự án hiện vẫn chưa rõ.",
        en: "According to sources, the project details are not clear yet.",
      },
      {
        ur: "اس خبر کی آزادانہ تصدیق نہیں ہو سکی۔",
        romanization: "is khabar ki azadana tasdeeq nahin ho saki.",
        vi: "Tin này chưa được xác minh độc lập.",
        en: "This report could not be independently verified.",
      },
      {
        ur: "اس لیے نتیجہ اخذ کرتے وقت احتیاط ضروری ہے۔",
        romanization: "is liye natija akhaz karte waqt ehtiyat zaruri hai.",
        vi: "Vì vậy cần thận trọng khi rút ra kết luận.",
        en: "Therefore caution is necessary when drawing a conclusion.",
      },
    ],
    vocabulary: [
      { ur: "ذرائع کے مطابق", romanization: "zarai ke mutabiq", vi: "theo các nguồn", en: "according to sources", pos: "frame" },
      { ur: "آزادانہ تصدیق", romanization: "azadana tasdeeq", vi: "xác minh độc lập", en: "independent verification", pos: "noun phrase" },
      { ur: "نتیجہ اخذ کرنا", romanization: "natija akhaz karna", vi: "rút ra kết luận", en: "to draw a conclusion", pos: "verb phrase" },
      { ur: "احتیاط", romanization: "ehtiyat", vi: "sự thận trọng", en: "caution", pos: "noun" },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Tin này chưa được xác minh độc lập.",
        en: "This report could not be independently verified.",
        ur: "اس خبر کی آزادانہ تصدیق نہیں ہو سکی۔",
        romanization: "is khabar ki azadana tasdeeq nahin ho saki.",
      },
    ],
    cultural_notes_vi:
      "Ví dụ ở đây là trung lập và hư cấu. Mục tiêu là học cách quy nguồn và nói mức chắc chắn, không phải đưa kết luận chính trị.",
    cultural_notes_en:
      "The examples here are neutral and generic. The goal is attribution and certainty level, not political conclusion.",
    tip_advice_vi:
      "Khi không chắc, dùng `کے مطابق`, `واضح نہیں`, `تصدیق نہیں ہو سکی`.",
    tip_advice_en:
      "When uncertain, use `کے مطابق`, `واضح نہیں`, and `تصدیق نہیں ہو سکی`.",
  },
  {
    id: "urdu_c1_report_findings_recommendations",
    level: "C1",
    category: "report_findings",
    title_vi: "Báo cáo: kết quả và khuyến nghị",
    title_en: "Reports: findings and recommendations",
    intro_vi:
      "Bài này luyện cách viết phần kết quả và khuyến nghị trong báo cáo Urdu chuyên nghiệp.",
    intro_en:
      "This lesson practices writing findings and recommendations in professional Urdu reports.",
    sentences: [
      {
        ur: "اہم نتائج سے ظاہر ہوتا ہے کہ عمل کو آسان بنانے کی ضرورت ہے۔",
        romanization: "aham nataij se zahir hota hai ke amal ko aasan banane ki zarurat hai.",
        vi: "Các kết quả chính cho thấy cần đơn giản hóa quy trình.",
        en: "The key findings show that the process needs to be simplified.",
      },
      {
        ur: "رپورٹ سفارش کرتی ہے کہ معلومات واضح انداز میں فراہم کی جائیں۔",
        romanization: "report sifarish karti hai ke malumat wazeh andaz mein faraham ki jaen.",
        vi: "Báo cáo khuyến nghị rằng thông tin nên được cung cấp một cách rõ ràng.",
        en: "The report recommends that information be provided clearly.",
      },
      {
        ur: "اعداد و شمار سے ظاہر ہوتا ہے کہ انتظار کا وقت کم ہوا ہے۔",
        romanization: "a'dad-o-shumar se zahir hota hai ke intezar ka waqt kam hua hai.",
        vi: "Số liệu cho thấy thời gian chờ đã giảm.",
        en: "The data show that waiting time has decreased.",
      },
    ],
    vocabulary: [
      { ur: "اہم نتائج", romanization: "aham nataij", vi: "kết quả chính", en: "key findings", pos: "noun phrase" },
      { ur: "سفارش کرنا", romanization: "sifarish karna", vi: "khuyến nghị", en: "to recommend", pos: "verb" },
      { ur: "فراہم کرنا", romanization: "faraham karna", vi: "cung cấp", en: "to provide", pos: "verb" },
      { ur: "انتظار کا وقت", romanization: "intezar ka waqt", vi: "thời gian chờ", en: "waiting time", pos: "noun phrase" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "رپورٹ ___ کرتی ہے کہ معلومات واضح انداز میں فراہم کی جائیں۔",
        answer: "سفارش",
        hint_vi: "từ nghĩa là khuyến nghị",
        hint_en: "the word meaning recommendation",
      },
    ],
    cultural_notes_vi:
      "Urdu báo cáo tốt cần rõ chủ thể và đề xuất. Đừng biến mọi câu thành bị động nếu người đọc cần biết ai làm gì.",
    cultural_notes_en:
      "Good report Urdu needs clear agency and clear recommendations. Do not make every sentence passive if the reader needs to know who does what.",
    tip_advice_vi:
      "`سے ظاہر ہوتا ہے کہ...` là khung trung lập để diễn giải số liệu.",
    tip_advice_en:
      "`سے ظاہر ہوتا ہے کہ...` is a neutral frame for interpreting data.",
  },
];

export default lessons;
