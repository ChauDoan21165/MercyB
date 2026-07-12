// Urdu B2 lessons for Vietnamese and English learners.
//
// W2 A8 scope: local Urdu lesson arrays only. No page/router/hub/audio/tutor
// or remote data work.

import type { UrduLesson } from "./lessons-b1";

export const lessons: UrduLesson[] = [
  {
    id: "urdu_b2_meetings_agenda",
    level: "B2",
    category: "meetings_agenda",
    title_vi: "Cuộc họp: chương trình, lượt phát biểu và quyết định",
    title_en: "Meetings: agenda, turns, and decisions",
    intro_vi:
      "Bài này luyện cách tham gia cuộc họp bằng Urdu chuyên nghiệp: nêu chương trình, thêm một điểm, đồng ý và yêu cầu làm rõ.",
    intro_en:
      "This lesson practices professional Urdu for meetings: stating the agenda, adding a point, agreeing, and asking for clarification.",
    sentences: [
      {
        ur: "آج کے ایجنڈے میں تین نکات شامل ہیں۔",
        romanization: "aaj ke agenda mein teen nukat shamil hain.",
        vi: "Trong chương trình hôm nay có ba điểm.",
        en: "There are three points on today's agenda.",
      },
      {
        ur: "میں ایک نکتہ شامل کرنا چاہتا ہوں۔",
        romanization: "main ek nukta shamil karna chahta hun.",
        vi: "Tôi muốn thêm một điểm.",
        en: "I would like to add one point.",
      },
      {
        ur: "کیا آپ اس فیصلے کی وجہ واضح کر سکتے ہیں؟",
        romanization: "kya aap is faisle ki wajah wazeh kar sakte hain?",
        vi: "Quý vị có thể làm rõ lý do của quyết định này không?",
        en: "Could you clarify the reason for this decision?",
      },
    ],
    vocabulary: [
      { cell_id: "1d2418fb-19c2-44f4-90d8-9ab7bdd2fcec", ur: "ایجنڈا", romanization: "agenda", vi: "chương trình họp", en: "agenda", pos: "noun" },
      { cell_id: "9692f9a7-7693-41e0-80be-839c66a0a564", ur: "نکتہ", romanization: "nukta", vi: "điểm / ý", en: "point", pos: "noun" },
      { cell_id: "ce6cd851-bfa9-4f12-b144-97bf1bb1b185", ur: "فیصلہ", romanization: "faisla", vi: "quyết định", en: "decision", pos: "noun" },
      { cell_id: "60c195ec-3ebc-46ec-a664-9f8b98701d54", ur: "واضح کرنا", romanization: "wazeh karna", vi: "làm rõ", en: "to clarify", pos: "verb" },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Tôi muốn thêm một điểm.",
        en: "I would like to add one point.",
        ur: "میں ایک نکتہ شامل کرنا چاہتا ہوں۔",
        romanization: "main ek nukta shamil karna chahta hun.",
      },
    ],
    cultural_notes_vi:
      "Trong cuộc họp trang trọng, `میں چاہتا ہوں` có thể chấp nhận được, nhưng thêm `اگر اجازت ہو` sẽ mềm hơn.",
    cultural_notes_en:
      "In formal meetings, `میں چاہتا ہوں` is acceptable, but adding `اگر اجازت ہو` softens it.",
    tip_advice_vi:
      "Dùng `کیا آپ... کر سکتے ہیں؟` để hỏi lịch sự thay vì yêu cầu trực tiếp.",
    tip_advice_en:
      "Use `کیا آپ... کر سکتے ہیں؟` for polite requests instead of direct demands.",
    register_notes_vi:
      "`نکتہ` là từ tốt cho họp và thảo luận; không quá nặng như văn bản pháp lý.",
    register_notes_en:
      "`نکتہ` works well in meetings and discussion; it is not overly legalistic.",
  },
  {
    id: "urdu_b2_formal_request_complaint",
    level: "B2",
    category: "formal_request_complaint",
    title_vi: "Yêu cầu và khiếu nại trang trọng",
    title_en: "Formal requests and complaints",
    intro_vi:
      "Bài này luyện câu khiếu nại và yêu cầu xử lý vấn đề một cách lịch sự, không công kích.",
    intro_en:
      "This lesson practices complaints and requests for action in a polite, non-attacking register.",
    sentences: [
      {
        ur: "درخواست ہے کہ اس مسئلے پر جلد غور کیا جائے۔",
        romanization: "darkhwast hai ke is masle par jald ghaur kiya jaye.",
        vi: "Kính đề nghị vấn đề này được xem xét sớm.",
        en: "I request that this issue be considered soon.",
      },
      {
        ur: "میں اس سروس کے بارے میں شکایت درج کرانا چاہتا ہوں۔",
        romanization: "main is service ke bare mein shikayat darj karana chahta hun.",
        vi: "Tôi muốn đăng ký khiếu nại về dịch vụ này.",
        en: "I would like to file a complaint about this service.",
      },
      {
        ur: "براہ کرم رسید کی نقل فراہم فرمائیں۔",
        romanization: "barah-e-karam raseed ki naql faraham farmaen.",
        vi: "Xin vui lòng cung cấp bản sao biên lai.",
        en: "Please provide a copy of the receipt.",
      },
    ],
    vocabulary: [
      { cell_id: "0d595845-61d3-4f48-af0b-c1da2bd82f8e", ur: "درخواست", romanization: "darkhwast", vi: "yêu cầu/đơn đề nghị", en: "request", pos: "noun" },
      { cell_id: "6a2945cf-77bb-4203-8094-3237c69e1b9a", ur: "شکایت درج کرانا", romanization: "shikayat darj karana", vi: "đăng ký khiếu nại", en: "to file a complaint", pos: "verb phrase" },
      { cell_id: "cd837f7f-57be-4393-89a1-6a5cd514a793", ur: "غور کرنا", romanization: "ghaur karna", vi: "xem xét", en: "to consider", pos: "verb" },
      { cell_id: "e912ed45-067b-469f-975c-b3d4ac6b72dc", ur: "فراہم فرمائیں", romanization: "faraham farmaen", vi: "xin cung cấp", en: "please provide", pos: "formal verb phrase" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "میں اس سروس کے بارے میں ___ درج کرانا چاہتا ہوں۔",
        answer: "شکایت",
        hint_vi: "từ nghĩa là khiếu nại",
        hint_en: "the word meaning complaint",
      },
    ],
    cultural_notes_vi:
      "Urdu trang trọng thường dùng cấu trúc bị động/khách quan như `غور کیا جائے` để giảm đối đầu.",
    cultural_notes_en:
      "Formal Urdu often uses impersonal/passive structures like `غور کیا جائے` to reduce confrontation.",
    tip_advice_vi:
      "Khung `درخواست ہے کہ...` rất hữu ích trong thư hoặc quầy dịch vụ.",
    tip_advice_en:
      "The frame `درخواست ہے کہ...` is useful in letters or service-counter situations.",
    register_notes_vi:
      "`فرمائیں` trang trọng hơn `کریں`; dùng trong yêu cầu lịch sự.",
    register_notes_en:
      "`فرمائیں` is more formal than `کریں`; use it in polite requests.",
  },
  {
    id: "urdu_b2_summary_media_comprehension",
    level: "B2",
    category: "summary_media",
    title_vi: "Tóm tắt thông tin truyền thông trung lập",
    title_en: "Summarizing neutral media information",
    intro_vi:
      "Bài này luyện đọc và tóm tắt thông tin báo chí trung lập bằng khung quy nguồn và từ nối.",
    intro_en:
      "This lesson practices reading and summarizing neutral media information with attribution frames and connectors.",
    sentences: [
      {
        ur: "رپورٹ کے مطابق، منصوبہ اگلے مہینے شروع ہو گا۔",
        romanization: "report ke mutabiq, mansooba agle mahine shuru ho ga.",
        vi: "Theo báo cáo, dự án sẽ bắt đầu vào tháng tới.",
        en: "According to the report, the project will start next month.",
      },
      {
        ur: "بیان میں کہا گیا کہ مزید معلومات بعد میں دی جائیں گی۔",
        romanization: "bayan mein kaha gaya ke mazeed malumat baad mein di jaengi.",
        vi: "Trong thông cáo nói rằng thông tin thêm sẽ được đưa ra sau.",
        en: "The statement said that more information will be provided later.",
      },
      {
        ur: "تاہم، اعداد و شمار ابھی مکمل نہیں ہیں۔",
        romanization: "taham, a'dad-o-shumar abhi mukammal nahin hain.",
        vi: "Tuy nhiên, số liệu hiện chưa đầy đủ.",
        en: "However, the figures are not complete yet.",
      },
    ],
    vocabulary: [
      { cell_id: "2318d902-a2b5-485e-aadf-c97be71183db", ur: "رپورٹ کے مطابق", romanization: "report ke mutabiq", vi: "theo báo cáo", en: "according to the report", pos: "frame" },
      { cell_id: "a686e41a-cf85-497d-a3ca-346aaa58fe6b", ur: "بیان", romanization: "bayan", vi: "thông cáo / tuyên bố", en: "statement", pos: "noun" },
      { cell_id: "87ba5a29-39dc-4176-a661-460da1e7a05d", ur: "تاہم", romanization: "taham", vi: "tuy nhiên", en: "however", pos: "connector" },
      { cell_id: "3ba2f3f0-c4d9-470f-86ee-aec2499fd695", ur: "اعداد و شمار", romanization: "a'dad-o-shumar", vi: "số liệu", en: "figures/data", pos: "noun phrase" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối khung báo chí với chức năng.",
        instruction_en: "Match each media frame with its function.",
        pairs: [
          { ur: "رپورٹ کے مطابق", meaning_vi: "quy nguồn", meaning_en: "attribution" },
          { ur: "تاہم", meaning_vi: "chuyển sang tương phản", meaning_en: "contrast" },
          { ur: "بیان میں کہا گیا", meaning_vi: "nêu nội dung thông cáo", meaning_en: "report a statement" },
        ],
      },
    ],
    cultural_notes_vi:
      "Bài này dạy ngôn ngữ tóm tắt, không kiểm chứng sự kiện. Hãy giữ `کے مطابق` khi nguồn là báo cáo hoặc thông cáo.",
    cultural_notes_en:
      "This lesson teaches summary language, not fact-checking. Keep `کے مطابق` when the source is a report or statement.",
    tip_advice_vi:
      "Không biến câu quy nguồn thành sự thật tuyệt đối. `رپورٹ کے مطابق` giúp giữ khoảng cách.",
    tip_advice_en:
      "Do not turn attributed claims into absolutes. `رپورٹ کے مطابق` keeps distance.",
  },
  {
    id: "urdu_b2_polite_disagreement",
    level: "B2",
    category: "polite_disagreement",
    title_vi: "Bất đồng lịch sự trong thảo luận",
    title_en: "Polite disagreement in discussion",
    intro_vi:
      "Bài này luyện bất đồng mà vẫn giữ thể diện: công nhận một phần, rồi nêu góc nhìn khác.",
    intro_en:
      "This lesson practices disagreeing while preserving face: acknowledge part of the point, then introduce another view.",
    sentences: [
      {
        ur: "آپ کی بات کسی حد تک درست ہے، لیکن ایک اور پہلو بھی ہے۔",
        romanization: "aap ki baat kisi hadd tak durust hai, lekin ek aur pehlu bhi hai.",
        vi: "Ý của bạn đúng ở một mức nào đó, nhưng còn một khía cạnh khác.",
        en: "Your point is correct to some extent, but there is another aspect too.",
      },
      {
        ur: "میری رائے کچھ مختلف ہے۔",
        romanization: "meri rae kuch mukhtalif hai.",
        vi: "Ý kiến của tôi hơi khác.",
        en: "My view is somewhat different.",
      },
      {
        ur: "اس پہلو پر بھی غور ہونا چاہیے۔",
        romanization: "is pehlu par bhi ghaur hona chahiye.",
        vi: "Khía cạnh này cũng nên được xem xét.",
        en: "This aspect should also be considered.",
      },
    ],
    vocabulary: [
      { cell_id: "58bab275-71bc-4e67-92f1-e6b50000b591", ur: "کسی حد تک", romanization: "kisi hadd tak", vi: "ở một mức nào đó", en: "to some extent", pos: "phrase" },
      { cell_id: "2f897255-2655-4295-9181-8a2f2e6facb2", ur: "پہلو", romanization: "pehlu", vi: "khía cạnh", en: "aspect", pos: "noun" },
      { cell_id: "1343a8fb-9016-439a-82f7-086be0157ac5", ur: "مختلف", romanization: "mukhtalif", vi: "khác", en: "different", pos: "adjective" },
      { cell_id: "f4006f1e-a75a-4274-965c-274f38d13522", ur: "غور ہونا چاہیے", romanization: "ghaur hona chahiye", vi: "nên được xem xét", en: "should be considered", pos: "phrase" },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Ý kiến của tôi hơi khác.",
        en: "My view is somewhat different.",
        ur: "میری رائے کچھ مختلف ہے۔",
        romanization: "meri rae kuch mukhtalif hai.",
      },
    ],
    cultural_notes_vi:
      "Trong thảo luận lịch sự, câu công nhận một phần như `کسی حد تک درست ہے` làm bất đồng bớt gắt.",
    cultural_notes_en:
      "In polite discussion, partial acknowledgment like `کسی حد تک درست ہے` softens disagreement.",
    tip_advice_vi:
      "Công thức tốt: công nhận một phần + `لیکن` + góc nhìn khác.",
    tip_advice_en:
      "Good formula: partial acknowledgment + `لیکن` + another perspective.",
    register_notes_vi:
      "Phù hợp họp nhóm, lớp học, thảo luận nghề nghiệp. Không mang sắc thái công kích.",
    register_notes_en:
      "Suitable for group meetings, class, and professional discussion. It is not aggressive.",
  },
  {
    id: "urdu_b2_professional_writing",
    level: "B2",
    category: "professional_writing",
    title_vi: "Viết email và thông báo chuyên nghiệp",
    title_en: "Professional emails and notices",
    intro_vi:
      "Bài này luyện mở đầu, nêu mục đích, yêu cầu hành động và kết thư bằng Urdu công việc.",
    intro_en:
      "This lesson practices openings, purpose statements, action requests, and closings in professional Urdu.",
    sentences: [
      {
        ur: "محترم جناب، آپ کی توجہ ایک اہم مسئلے کی طرف دلانا چاہتا ہوں۔",
        romanization: "muhtaram janab, aap ki tawajjuh ek aham masle ki taraf dilana chahta hun.",
        vi: "Kính thưa ông, tôi muốn hướng sự chú ý của ông đến một vấn đề quan trọng.",
        en: "Dear Sir, I would like to draw your attention to an important issue.",
      },
      {
        ur: "براہ کرم کل تک جواب ارسال فرمائیں۔",
        romanization: "barah-e-karam kal tak jawab irsal farmaen.",
        vi: "Xin vui lòng gửi phản hồi trước ngày mai.",
        en: "Please send a response by tomorrow.",
      },
      {
        ur: "خیر اندیش،",
        romanization: "khair andesh,",
        vi: "Trân trọng,",
        en: "Best regards,",
      },
    ],
    vocabulary: [
      { cell_id: "3e0e643a-9d7b-468e-aa02-1835d2a8d188", ur: "محترم", romanization: "muhtaram", vi: "kính thưa / đáng kính", en: "respected/dear", pos: "adjective" },
      { cell_id: "de63da82-6998-4c56-8203-66bed2d3693c", ur: "توجہ", romanization: "tawajjuh", vi: "sự chú ý", en: "attention", pos: "noun" },
      { cell_id: "1df87121-a44f-463e-a6df-b6e534a875c9", ur: "ارسال فرمائیں", romanization: "irsal farmaen", vi: "xin gửi", en: "please send", pos: "formal verb phrase" },
      { cell_id: "0bcd9a3a-9bae-40cb-96f8-d1f0e0f737a2", ur: "خیر اندیش", romanization: "khair andesh", vi: "trân trọng", en: "best regards", pos: "closing" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "براہ کرم کل تک جواب ___ فرمائیں۔",
        answer: "ارسال",
        hint_vi: "từ trang trọng nghĩa là gửi",
        hint_en: "formal word meaning send",
      },
    ],
    cultural_notes_vi:
      "Email Urdu trang trọng có thể nghe rất lịch sự. Chọn mức trang trọng theo quan hệ; đừng dùng công thức quá nặng cho tin nhắn ngắn.",
    cultural_notes_en:
      "Formal Urdu email can sound very courteous. Choose the level by relationship; do not use heavy formulas for a short chat message.",
    tip_advice_vi:
      "Học `آپ کی توجہ... کی طرف دلانا` như một cụm để nêu vấn đề trong email.",
    tip_advice_en:
      "Learn `آپ کی توجہ... کی طرف دلانا` as a chunk for raising an issue in email.",
    register_notes_vi:
      "`ارسال فرمائیں` trang trọng; trong nói thường có thể dùng `بھیج دیں`.",
    register_notes_en:
      "`ارسال فرمائیں` is formal; in speech, `بھیج دیں` may be enough.",
  },
];

export default lessons;
