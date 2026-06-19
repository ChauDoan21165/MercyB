// Urdu C2 lessons for Vietnamese and English learners.
//
// W2 A8 scope: advanced local Urdu curriculum only. Examples are neutral,
// academic/professional, language-focused, and make no audio promise.

import type { UrduLesson } from "./lessons-b1";

export const lessons: UrduLesson[] = [
  {
    id: "urdu_c2_formal_debate_qualification",
    level: "C2",
    category: "formal_debate",
    title_vi: "Tranh biện trang trọng: nhượng bộ và giới hạn lập luận",
    title_en: "Formal debate: concession and qualification",
    intro_vi:
      "Bài này luyện cách tranh biện ở cấp độ cao: thừa nhận điểm mạnh của phía khác, rồi giới hạn phạm vi kết luận.",
    intro_en:
      "This lesson practices high-level debate: acknowledging the other side's strength, then limiting the scope of the conclusion.",
    sentences: [
      {
        ur: "یہ دلیل بظاہر مضبوط ہے، مگر اس کا اطلاق ہر صورت پر نہیں کیا جا سکتا۔",
        romanization: "yeh daleel bazahir mazbut hai, magar is ka itlaq har surat par nahin kiya ja sakta.",
        vi: "Lập luận này có vẻ mạnh, nhưng không thể áp dụng cho mọi trường hợp.",
        en: "This argument appears strong, but it cannot be applied to every case.",
      },
      {
        ur: "میں اصولی طور پر اس نکتے سے اتفاق کرتا ہوں، تاہم عملی پہلو مختلف ہیں۔",
        romanization: "main usuli taur par is nukte se ittifaq karta hun, taham amali pehlu mukhtalif hain.",
        vi: "Về nguyên tắc tôi đồng ý với điểm này, tuy nhiên các khía cạnh thực tế thì khác.",
        en: "In principle, I agree with this point; however, the practical aspects differ.",
      },
      {
        ur: "نتیجہ اخذ کرنے سے پہلے سیاق و سباق کو بھی ملحوظ رکھنا ضروری ہے۔",
        romanization: "natija akhaz karne se pehle siyaq-o-sabaq ko bhi malhuz rakhna zaruri hai.",
        vi: "Trước khi rút kết luận, cũng cần xét đến bối cảnh.",
        en: "Before drawing a conclusion, the context must also be taken into account.",
      },
    ],
    vocabulary: [
      { ur: "بظاہر", romanization: "bazahir", vi: "bề ngoài / có vẻ", en: "apparently", pos: "adverb" },
      { ur: "اطلاق", romanization: "itlaq", vi: "sự áp dụng", en: "application", pos: "noun" },
      { ur: "اصولی طور پر", romanization: "usuli taur par", vi: "về nguyên tắc", en: "in principle", pos: "phrase" },
      { ur: "سیاق و سباق", romanization: "siyaq-o-sabaq", vi: "bối cảnh", en: "context", pos: "noun phrase" },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Về nguyên tắc tôi đồng ý với điểm này.",
        en: "In principle, I agree with this point.",
        ur: "میں اصولی طور پر اس نکتے سے اتفاق کرتا ہوں۔",
        romanization: "main usuli taur par is nukte se ittifaq karta hun.",
      },
    ],
    cultural_notes_vi:
      "Urdu tranh biện trang trọng thường đánh giá lập luận trước khi phản biện. Cách này giữ giọng chuyên nghiệp và tránh đối đầu cá nhân.",
    cultural_notes_en:
      "Formal Urdu debate often evaluates the argument before countering it. This keeps the tone professional and avoids personal confrontation.",
    tip_advice_vi:
      "Dùng `بظاہر... مگر...` để chuyển từ nhượng bộ sang giới hạn.",
    tip_advice_en:
      "Use `بظاہر... مگر...` to move from concession to qualification.",
    register_notes_vi:
      "Trang trọng, phù hợp hội thảo, lớp cao học hoặc phản biện chuyên nghiệp.",
    register_notes_en:
      "Formal, suitable for seminars, graduate-level classes, or professional critique.",
  },
  {
    id: "urdu_c2_literary_media_analysis",
    level: "C2",
    category: "literary_media_analysis",
    title_vi: "Phân tích văn học và truyền thông: giọng điệu và cấu trúc",
    title_en: "Literary and media analysis: tone and structure",
    intro_vi:
      "Bài này luyện ngôn ngữ phân tích văn bản: giọng điệu, cấu trúc, lựa chọn từ và tác dụng với người đọc.",
    intro_en:
      "This lesson practices language for textual analysis: tone, structure, word choice, and effect on the reader.",
    sentences: [
      {
        ur: "مصنف نے سادہ الفاظ کے ذریعے ایک پیچیدہ احساس پیدا کیا ہے۔",
        romanization: "musannif ne sada alfaz ke zariye ek pechida ehsas paida kiya hai.",
        vi: "Tác giả đã tạo ra một cảm giác phức tạp thông qua những từ ngữ giản dị.",
        en: "The author has created a complex feeling through simple words.",
      },
      {
        ur: "متن کا لہجہ بظاہر غیر جانبدار ہے، لیکن اندرونی تناؤ محسوس ہوتا ہے۔",
        romanization: "matn ka lehja bazahir ghair janibdar hai, lekin andruni tanaav mahsus hota hai.",
        vi: "Giọng điệu của văn bản có vẻ trung lập, nhưng có thể cảm thấy sự căng thẳng bên trong.",
        en: "The tone of the text appears neutral, but an inner tension is felt.",
      },
      {
        ur: "ابتدائی جملہ قاری کی توقعات کو آہستہ آہستہ بدل دیتا ہے۔",
        romanization: "ibtidai jumla qari ki tawaqquat ko ahista ahista badal deta hai.",
        vi: "Câu mở đầu dần dần thay đổi kỳ vọng của người đọc.",
        en: "The opening sentence gradually changes the reader's expectations.",
      },
    ],
    vocabulary: [
      { ur: "مصنف", romanization: "musannif", vi: "tác giả", en: "author", pos: "noun" },
      { ur: "متن", romanization: "matn", vi: "văn bản", en: "text", pos: "noun" },
      { ur: "لہجہ", romanization: "lehja", vi: "giọng điệu", en: "tone", pos: "noun" },
      { ur: "قاری", romanization: "qari", vi: "người đọc", en: "reader", pos: "noun" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "متن کا ___ بظاہر غیر جانبدار ہے۔",
        answer: "لہجہ",
        hint_vi: "từ nghĩa là giọng điệu",
        hint_en: "the word meaning tone",
      },
    ],
    cultural_notes_vi:
      "Ví dụ phân tích ở đây không dựa trên tác phẩm thật. Mục tiêu là khung diễn đạt trung lập cho văn học và truyền thông.",
    cultural_notes_en:
      "The analysis examples here are not tied to a real work. The goal is neutral phrasing for literature and media.",
    tip_advice_vi:
      "Kết hợp `بظاہر` với `لیکن` để nói sự khác biệt giữa bề mặt và tầng nghĩa sâu hơn.",
    tip_advice_en:
      "Combine `بظاہر` with `لیکن` to discuss the difference between surface tone and deeper meaning.",
  },
  {
    id: "urdu_c2_translation_style_choices",
    level: "C2",
    category: "translation_style",
    title_vi: "Lựa chọn phong cách dịch: sát nghĩa, tự nhiên và văn phong",
    title_en: "Translation style choices: accuracy, naturalness, and register",
    intro_vi:
      "Bài này luyện cách giải thích lựa chọn dịch thuật bằng Urdu: giữ nghĩa, điều chỉnh văn phong và tránh dịch từng chữ máy móc.",
    intro_en:
      "This lesson practices explaining translation choices in Urdu: preserving meaning, adjusting register, and avoiding mechanical word-for-word translation.",
    sentences: [
      {
        ur: "لفظی ترجمہ درست ہو سکتا ہے، لیکن ہر جگہ فطری نہیں لگتا۔",
        romanization: "lafzi tarjuma durust ho sakta hai, lekin har jagah fitri nahin lagta.",
        vi: "Bản dịch sát chữ có thể đúng, nhưng không phải lúc nào cũng nghe tự nhiên.",
        en: "A literal translation may be correct, but it does not sound natural everywhere.",
      },
      {
        ur: "اس جملے میں معنی برقرار رکھتے ہوئے لہجہ نرم کیا گیا ہے۔",
        romanization: "is jumle mein maani barqarar rakhte hue lehja narm kiya gaya hai.",
        vi: "Trong câu này, giọng điệu đã được làm mềm trong khi vẫn giữ nghĩa.",
        en: "In this sentence, the tone has been softened while preserving the meaning.",
      },
      {
        ur: "رسمی متن میں مختصر مگر واضح ترجمہ زیادہ مناسب ہے۔",
        romanization: "rasmi matn mein mukhtasar magar wazeh tarjuma zyada munasib hai.",
        vi: "Trong văn bản trang trọng, bản dịch ngắn gọn nhưng rõ ràng phù hợp hơn.",
        en: "In a formal text, a concise but clear translation is more appropriate.",
      },
    ],
    vocabulary: [
      { ur: "لفظی ترجمہ", romanization: "lafzi tarjuma", vi: "dịch sát chữ", en: "literal translation", pos: "noun phrase" },
      { ur: "فطری", romanization: "fitri", vi: "tự nhiên", en: "natural", pos: "adjective" },
      { ur: "برقرار رکھنا", romanization: "barqarar rakhna", vi: "giữ nguyên / duy trì", en: "to preserve", pos: "verb phrase" },
      { ur: "مناسب", romanization: "munasib", vi: "phù hợp", en: "appropriate", pos: "adjective" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối thuật ngữ dịch thuật với chức năng.",
        instruction_en: "Match each translation term with its function.",
        pairs: [
          { ur: "لفظی ترجمہ", meaning_vi: "dịch sát chữ", meaning_en: "literal translation" },
          { ur: "لہجہ نرم کرنا", meaning_vi: "làm giọng điệu mềm hơn", meaning_en: "soften the tone" },
          { ur: "معنی برقرار رکھنا", meaning_vi: "giữ nghĩa", meaning_en: "preserve meaning" },
        ],
      },
    ],
    cultural_notes_vi:
      "Ở cấp C2, người học cần giải thích vì sao một bản dịch phù hợp với người đọc và ngữ cảnh, không chỉ đúng từ điển.",
    cultural_notes_en:
      "At C2, learners need to explain why a translation fits the reader and context, not only why it matches a dictionary.",
    tip_advice_vi:
      "Dùng `درست ہو سکتا ہے، لیکن...` để nói một lựa chọn đúng nhưng chưa tối ưu.",
    tip_advice_en:
      "Use `درست ہو سکتا ہے، لیکن...` to describe a choice that is correct but not optimal.",
  },
  {
    id: "urdu_c2_rhetoric_subtext",
    level: "C2",
    category: "rhetoric_subtext",
    title_vi: "Tu từ và hàm ý: điều được nói và điều được gợi ra",
    title_en: "Rhetoric and subtext: what is said and what is implied",
    intro_vi:
      "Bài này luyện cách nói về hàm ý, nhấn mạnh, chiến lược tu từ và điều văn bản không nói trực tiếp.",
    intro_en:
      "This lesson practices discussing implication, emphasis, rhetorical strategy, and what the text does not state directly.",
    sentences: [
      {
        ur: "جملہ براہ راست الزام نہیں لگاتا، مگر اشارہ واضح ہے۔",
        romanization: "jumla barah-e-rast ilzam nahin lagata, magar ishara wazeh hai.",
        vi: "Câu này không trực tiếp buộc tội, nhưng hàm ý rất rõ.",
        en: "The sentence does not make a direct accusation, but the implication is clear.",
      },
      {
        ur: "تکرار کے ذریعے اہم خیال کو نمایاں کیا گیا ہے۔",
        romanization: "takrar ke zariye aham khayal ko numayan kiya gaya hai.",
        vi: "Ý chính được làm nổi bật thông qua sự lặp lại.",
        en: "The main idea is highlighted through repetition.",
      },
      {
        ur: "خاموشی بھی اس متن میں ایک معنی خیز کردار ادا کرتی ہے۔",
        romanization: "khamoshi bhi is matn mein ek maani kheiz kirdar ada karti hai.",
        vi: "Sự im lặng cũng đóng một vai trò có ý nghĩa trong văn bản này.",
        en: "Silence also plays a meaningful role in this text.",
      },
    ],
    vocabulary: [
      { ur: "براہ راست", romanization: "barah-e-rast", vi: "trực tiếp", en: "directly", pos: "adverb" },
      { ur: "اشارہ", romanization: "ishara", vi: "hàm ý / dấu hiệu", en: "implication/sign", pos: "noun" },
      { ur: "تکرار", romanization: "takrar", vi: "sự lặp lại", en: "repetition", pos: "noun" },
      { ur: "نمایاں کرنا", romanization: "numayan karna", vi: "làm nổi bật", en: "to highlight", pos: "verb phrase" },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Ý chính được làm nổi bật thông qua sự lặp lại.",
        en: "The main idea is highlighted through repetition.",
        ur: "تکرار کے ذریعے اہم خیال کو نمایاں کیا گیا ہے۔",
        romanization: "takrar ke zariye aham khayal ko numayan kiya gaya hai.",
      },
    ],
    cultural_notes_vi:
      "Phân tích hàm ý cần cẩn thận: hãy chỉ ra bằng chứng trong câu, thay vì gán động cơ cho người viết.",
    cultural_notes_en:
      "Subtext analysis requires care: point to evidence in the sentence rather than assigning motives to the writer.",
    tip_advice_vi:
      "`براہ راست... نہیں، مگر...` là khung hữu ích để nói về hàm ý.",
    tip_advice_en:
      "`براہ راست... نہیں، مگر...` is a useful frame for discussing implication.",
  },
  {
    id: "urdu_c2_register_revision",
    level: "C2",
    category: "register_revision",
    title_vi: "Chỉnh sửa văn phong: từ thân mật đến học thuật/chuyên nghiệp",
    title_en: "Register revision: from casual to academic/professional",
    intro_vi:
      "Bài này luyện chỉnh câu Urdu theo văn phong phù hợp: bớt thân mật, rõ chủ thể, và giữ giọng chuyên nghiệp.",
    intro_en:
      "This lesson practices revising Urdu sentences for register: reducing casualness, clarifying agency, and keeping a professional tone.",
    sentences: [
      {
        ur: "عام بول چال کے بجائے یہاں رسمی انداز زیادہ مناسب ہے۔",
        romanization: "aam bol chal ke bajaye yahan rasmi andaz zyada munasib hai.",
        vi: "Thay vì lời nói thường ngày, ở đây văn phong trang trọng phù hợp hơn.",
        en: "Instead of everyday speech, a formal style is more appropriate here.",
      },
      {
        ur: "نظر ثانی کے بعد جملہ مختصر، واضح اور غیر مبہم ہو گیا ہے۔",
        romanization: "nazar-e-sani ke baad jumla mukhtasar, wazeh aur ghair mubham ho gaya hai.",
        vi: "Sau khi chỉnh sửa, câu đã trở nên ngắn gọn, rõ ràng và không mơ hồ.",
        en: "After revision, the sentence has become concise, clear, and unambiguous.",
      },
      {
        ur: "اگر مخاطب نامعلوم ہو تو غیر جانبدار خطاب استعمال کیا جا سکتا ہے۔",
        romanization: "agar mukhatab namalum ho to ghair janibdar khitab istemal kiya ja sakta hai.",
        vi: "Nếu người nhận không rõ, có thể dùng cách xưng hô trung lập.",
        en: "If the addressee is unknown, a neutral form of address can be used.",
      },
    ],
    vocabulary: [
      { ur: "عام بول چال", romanization: "aam bol chal", vi: "lời nói thường ngày", en: "everyday speech", pos: "noun phrase" },
      { ur: "رسمی انداز", romanization: "rasmi andaz", vi: "văn phong trang trọng", en: "formal style", pos: "noun phrase" },
      { ur: "نظر ثانی", romanization: "nazar-e-sani", vi: "sự chỉnh sửa / xem lại", en: "revision", pos: "noun" },
      { ur: "غیر مبہم", romanization: "ghair mubham", vi: "không mơ hồ", en: "unambiguous", pos: "adjective" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "نظر ثانی کے بعد جملہ مختصر، واضح اور ___ ہو گیا ہے۔",
        answer: "غیر مبہم",
        hint_vi: "từ nghĩa là không mơ hồ",
        hint_en: "the phrase meaning unambiguous",
      },
    ],
    cultural_notes_vi:
      "Chỉnh văn phong không có nghĩa là làm câu nặng hơn. Ở bối cảnh chuyên nghiệp, rõ ràng và phù hợp quan hệ thường quan trọng hơn độ trang trọng cực cao.",
    cultural_notes_en:
      "Register revision does not mean making every sentence heavier. In professional contexts, clarity and relationship fit often matter more than maximum formality.",
    tip_advice_vi:
      "Khi chỉnh câu, kiểm tra ba điểm: người nhận là ai, mục đích là gì, và mức trang trọng nào là đủ.",
    tip_advice_en:
      "When revising a sentence, check three points: who the reader is, what the purpose is, and how much formality is enough.",
    register_notes_vi:
      "Cấp C2 yêu cầu chọn văn phong theo tình huống, không chỉ biết nhiều từ trang trọng.",
    register_notes_en:
      "C2 requires choosing register by situation, not only knowing many formal words.",
  },
];

export default lessons;
