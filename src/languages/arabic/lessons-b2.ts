// Arabic B2 lessons — Modern Standard Arabic first.
//
// Scope: meetings, formal complaints, professional writing, disagreement, and
// complex grammar for Vietnamese learners with English companion support.
// Dialect notes are recognition-only; canonical target text and answers are MSA.

export type ArabicCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ArabicB2Category =
  | "meetings"
  | "formal_complaint"
  | "professional_writing"
  | "disagreement"
  | "complex_grammar";

export type ArabicSentence = {
  ar: string;
  romanization: string;
  vi: string;
  en: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type ArabicVocabEntry = {
  cell_id?: string;
  ar: string;
  romanization: string;
  vi: string;
  en: string;
  pos?: string;
};

export type ArabicDialogueLine = {
  cell_id?: string;
  speaker: string;
  ar: string;
  romanization: string;
  vi: string;
  en: string;
  register?: "neutral" | "formal" | "polite" | "colloquial-note";
};

export type ArabicExercise =
  | {
      type: "fill-blank";
      question: string;
      answer: string;
      accepted_answers?: string[];
      hint_vi?: string;
      hint_en?: string;
    }
  | {
      type: "matching";
      instruction_vi: string;
      instruction_en: string;
      pairs: Array<{ ar: string; meaning_vi: string; meaning_en?: string }>;
    }
  | {
      type: "translation";
      vi: string;
      en: string;
      ar: string;
      romanization?: string;
      accepted_answers?: string[];
    };

export type ArabicB2Lesson = {
  id: string;
  level: ArabicCefrLevel;
  category: ArabicB2Category;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  sentences: ArabicSentence[];
  vocabulary: ArabicVocabEntry[];
  dialogue?: ArabicDialogueLine[];
  exercises?: ArabicExercise[];
  cultural_notes_vi: string;
  cultural_notes_en: string;
  tip_advice_vi: string;
  tip_advice_en: string;
  register_notes_vi?: string;
  register_notes_en?: string;
  dialect_notes_vi?: string;
  dialect_notes_en?: string;
};

export const lessons: ArabicB2Lesson[] = [
  {
    id: "arabic_b2_running_a_meeting",
    level: "B2",
    category: "meetings",
    title_vi: "Điều hành cuộc họp bằng tiếng Ả Rập chuẩn",
    title_en: "Running a meeting in Modern Standard Arabic",
    intro_vi:
      "Bài này luyện cách mở cuộc họp, nêu chương trình, chuyển mục, yêu cầu ý kiến và kết luận bằng MSA trang trọng nhưng không quá cổ.",
    intro_en:
      "This lesson practices opening a meeting, setting an agenda, moving between items, inviting input, and closing in formal but not archaic MSA.",
    sentences: [
      {
        ar: "أقترح أن نبدأ بمراجعة جدول الأعمال.",
        romanization: "aqtaridu an nabda'a bi-muraaja'at jadwal al-a'maal",
        vi: "Tôi đề nghị chúng ta bắt đầu bằng việc rà soát chương trình làm việc.",
        en: "I suggest that we begin by reviewing the agenda.",
        pronunciation_focus: ["أقترح: âm q rõ ở giữa", "الأعمال: giữ âm ع trong phần a'maal"],
        pronunciation_focus_en: ["أقترح has a clear q sound", "الأعمال keeps the ayn in a'maal"],
      },
      {
        ar: "هل يمكننا الانتقال إلى النقطة التالية؟",
        romanization: "hal yumkinunaa al-intiqaal ilaa an-nuqtah at-taaliyah?",
        vi: "Chúng ta có thể chuyển sang điểm tiếp theo không?",
        en: "Can we move to the next point?",
      },
      {
        ar: "أود أن أسمع رأي الفريق قبل اتخاذ القرار.",
        romanization: "awaddu an asma'a ra'y al-fariiq qabla ittikhaadh al-qaraar",
        vi: "Tôi muốn nghe ý kiến của nhóm trước khi đưa ra quyết định.",
        en: "I would like to hear the team's view before making the decision.",
      },
      {
        ar: "سنسجل التوصيات في محضر الاجتماع.",
        romanization: "sanusajjil at-tawsiyyaat fii mahdar al-ijtimaa'",
        vi: "Chúng ta sẽ ghi các khuyến nghị vào biên bản cuộc họp.",
        en: "We will record the recommendations in the meeting minutes.",
      },
      {
        ar: "إذا لم تكن هناك ملاحظات أخرى، نختم الاجتماع هنا.",
        romanization: "idhaa lam takun hunaaka mulaahazaat ukhraa, nakhtim al-ijtimaa' hunaa",
        vi: "Nếu không còn ghi chú nào khác, chúng ta kết thúc cuộc họp tại đây.",
        en: "If there are no further comments, we will close the meeting here.",
      },
    ],
    vocabulary: [
      { cell_id: "02c7bdb3-e908-465e-ae43-ef2cc196cfea", ar: "جدول الأعمال", romanization: "jadwal al-a'maal", vi: "chương trình làm việc", en: "agenda", pos: "n." },
      { cell_id: "e55611be-a7dc-4c4a-8562-6b3885711274", ar: "محضر الاجتماع", romanization: "mahdar al-ijtimaa'", vi: "biên bản cuộc họp", en: "meeting minutes", pos: "n." },
      { cell_id: "e0ca2e4f-1306-4211-ad9c-f5e5464bb9b3", ar: "توصية", romanization: "tawsiyah", vi: "khuyến nghị", en: "recommendation", pos: "n." },
      { cell_id: "c4c6e563-cbe3-49b8-a48b-67f89ffd3994", ar: "اتخاذ القرار", romanization: "ittikhaadh al-qaraar", vi: "việc đưa ra quyết định", en: "decision-making", pos: "n." },
      { cell_id: "e4de338f-9f7a-4514-8c10-8a9d70a4ad9f", ar: "النقطة التالية", romanization: "an-nuqtah at-taaliyah", vi: "điểm tiếp theo", en: "the next point", pos: "phr." },
    ],
    dialogue: [
      {
        cell_id: "943e37d6-d11d-4831-b9dd-60dcc132cbff",
        speaker: "مدير الاجتماع",
        ar: "أقترح أن نبدأ بمراجعة جدول الأعمال.",
        romanization: "aqtaridu an nabda'a bi-muraaja'at jadwal al-a'maal",
        vi: "Tôi đề nghị chúng ta bắt đầu bằng việc rà soát chương trình làm việc.",
        en: "I suggest that we begin by reviewing the agenda.",
        register: "formal",
      },
      {
        cell_id: "73e23c71-3295-4fab-911a-db373d34a639",
        speaker: "عضو الفريق",
        ar: "هل يمكن إضافة نقطة عن الميزانية؟",
        romanization: "hal yumkin idaafat nuqtah 'an al-miizaaniyyah?",
        vi: "Có thể thêm một điểm về ngân sách không?",
        en: "Can we add an item about the budget?",
        register: "polite",
      },
      {
        cell_id: "f6d3eaff-4aed-4456-ac1d-06900b1cc4b4",
        speaker: "مدير الاجتماع",
        ar: "نعم، سنناقشها قبل اتخاذ القرار النهائي.",
        romanization: "na'am, sanunaaqishuhaa qabla ittikhaadh al-qaraar an-nihaa'ii",
        vi: "Có, chúng ta sẽ thảo luận việc đó trước quyết định cuối cùng.",
        en: "Yes, we will discuss it before the final decision.",
        register: "formal",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "هل يمكننا الانتقال إلى النقطة ___؟",
        answer: "التالية",
        hint_vi: "từ nghĩa là 'tiếp theo'",
        hint_en: "the word meaning 'next'",
      },
      {
        type: "translation",
        vi: "Chúng ta sẽ ghi các khuyến nghị vào biên bản cuộc họp.",
        en: "We will record the recommendations in the meeting minutes.",
        ar: "سنسجل التوصيات في محضر الاجتماع.",
      },
    ],
    cultural_notes_vi:
      "Trong họp hành trang trọng, MSA dùng nhiều danh từ trừu tượng như مراجعة, توصيات, اتخاذ القرار. Khi nói miệng, nhiều nơi sẽ chuyển sang phương ngữ, nhưng biên bản và email thường giữ MSA.",
    cultural_notes_en:
      "Formal meetings in MSA use many abstract nouns such as مراجعة, توصيات, and اتخاذ القرار. Oral meetings may shift to dialect, but minutes and emails usually remain in MSA.",
    tip_advice_vi:
      "Công thức điều hành an toàn: đề xuất mở đầu bằng أقترح أن, chuyển mục bằng الانتقال إلى, kết bằng إذا لم تكن هناك ملاحظات أخرى.",
    tip_advice_en:
      "A safe facilitation sequence: open with أقترح أن, move items with الانتقال إلى, and close with إذا لم تكن هناك ملاحظات أخرى.",
  },
  {
    id: "arabic_b2_formal_complaint",
    level: "B2",
    category: "formal_complaint",
    title_vi: "Viết khiếu nại trang trọng",
    title_en: "Writing a formal complaint",
    intro_vi:
      "Bài này luyện cách trình bày sự việc, bằng chứng, ảnh hưởng và yêu cầu xử lý trong một thư khiếu nại MSA lịch sự nhưng rõ ràng.",
    intro_en:
      "This lesson practices presenting facts, evidence, impact, and requested action in a polite but clear MSA complaint letter.",
    sentences: [
      {
        ar: "أود أن أقدم شكوى بخصوص التأخير في تسليم الطلب.",
        romanization: "awaddu an uqaddima shakwaa bi-khusuus at-ta'khiir fii tasliim at-talab",
        vi: "Tôi muốn gửi khiếu nại về việc chậm giao đơn hàng.",
        en: "I would like to submit a complaint regarding the delay in delivering the order.",
      },
      {
        ar: "وفقًا للفاتورة، كان من المفترض أن يصل الطلب يوم الاثنين.",
        romanization: "wifqan lil-faaturah, kaana min al-muftarad an yasil at-talab yawm al-ithnayn",
        vi: "Theo hóa đơn, lẽ ra đơn hàng phải đến vào thứ Hai.",
        en: "According to the invoice, the order was supposed to arrive on Monday.",
      },
      {
        ar: "تسبب هذا التأخير في مشكلة لعملي.",
        romanization: "tasabbaba haadhaa at-ta'khiir fii mushkilah li-'amalii",
        vi: "Sự chậm trễ này đã gây ra vấn đề cho công việc của tôi.",
        en: "This delay caused a problem for my work.",
      },
      {
        ar: "أرجو معالجة الموضوع في أقرب وقت ممكن.",
        romanization: "arjuu mu'aalajat al-mawduu' fii aqrab waqt mumkin",
        vi: "Tôi mong vấn đề được xử lý trong thời gian sớm nhất có thể.",
        en: "I hope the matter will be handled as soon as possible.",
      },
      {
        ar: "أرفق نسخة من الفاتورة ورقم الطلب.",
        romanization: "urfiq nuskhat-an min al-faaturah wa-raqm at-talab",
        vi: "Tôi đính kèm bản sao hóa đơn và số đơn hàng.",
        en: "I attach a copy of the invoice and the order number.",
      },
    ],
    vocabulary: [
      { cell_id: "b30ea5f1-998b-413d-a185-849de3b3a04d", ar: "شكوى", romanization: "shakwaa", vi: "khiếu nại", en: "complaint", pos: "n." },
      { cell_id: "e480597d-da31-4aa6-9884-31d02b93ff97", ar: "تأخير", romanization: "ta'khiir", vi: "sự chậm trễ", en: "delay", pos: "n." },
      { cell_id: "939be933-34d1-4e15-9c5b-0839f4b1303f", ar: "فاتورة", romanization: "faaturah", vi: "hóa đơn", en: "invoice", pos: "n." },
      { cell_id: "b1754caf-dba2-4008-886c-9bbbeeee2e6d", ar: "معالجة الموضوع", romanization: "mu'aalajat al-mawduu'", vi: "xử lý vấn đề", en: "handling the matter", pos: "phr." },
      { cell_id: "5604e2e4-6a60-4aab-b106-55fe93126e75", ar: "أرفق", romanization: "urfiq", vi: "tôi đính kèm", en: "I attach", pos: "v." },
    ],
    dialogue: [
      {
        cell_id: "8e578416-db2b-406e-a65e-441b2b7a240d",
        speaker: "العميل",
        ar: "أود أن أقدم شكوى بخصوص التأخير في تسليم الطلب.",
        romanization: "awaddu an uqaddima shakwaa bi-khusuus at-ta'khiir fii tasliim at-talab",
        vi: "Tôi muốn gửi khiếu nại về việc chậm giao đơn hàng.",
        en: "I would like to submit a complaint regarding the delivery delay.",
        register: "formal",
      },
      {
        cell_id: "52f2db4b-940f-453d-9c4c-559f79561ffc",
        speaker: "الموظف",
        ar: "نعتذر عن ذلك. هل يمكن أن ترسلوا رقم الطلب؟",
        romanization: "na'tadhir 'an dhaalik. hal yumkin an tursiluu raqm at-talab?",
        vi: "Chúng tôi xin lỗi về việc đó. Quý vị có thể gửi số đơn hàng không?",
        en: "We apologize for that. Could you send the order number?",
        register: "polite",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm khiếu nại với nghĩa tiếng Việt.",
        instruction_en: "Match each complaint phrase with its Vietnamese meaning.",
        pairs: [
          { ar: "أقدم شكوى", meaning_vi: "gửi khiếu nại", meaning_en: "submit a complaint" },
          { ar: "وفقًا للفاتورة", meaning_vi: "theo hóa đơn", meaning_en: "according to the invoice" },
          { ar: "في أقرب وقت ممكن", meaning_vi: "sớm nhất có thể", meaning_en: "as soon as possible" },
        ],
      },
      {
        type: "fill-blank",
        question: "أرجو معالجة الموضوع في ___ وقت ممكن.",
        answer: "أقرب",
        hint_vi: "cụm nghĩa là 'sớm nhất có thể'",
        hint_en: "part of the phrase 'as soon as possible'",
      },
    ],
    cultural_notes_vi:
      "Một khiếu nại mạnh trong MSA thường không bắt đầu bằng lời trách cá nhân. Hãy tách bốn phần: sự việc, bằng chứng, ảnh hưởng, yêu cầu xử lý.",
    cultural_notes_en:
      "A strong MSA complaint usually does not begin with personal blame. Separate four parts: facts, evidence, impact, and requested action.",
    tip_advice_vi:
      "Tránh viết أنت مخطئ. Dùng cấu trúc khách quan hơn: حدث تأخير, تسبب هذا في, أرجو معالجة الموضوع.",
    tip_advice_en:
      "Avoid writing أنت مخطئ. Use more objective frames: حدث تأخير, تسبب هذا في, أرجو معالجة الموضوع.",
  },
  {
    id: "arabic_b2_professional_email_update",
    level: "B2",
    category: "professional_writing",
    title_vi: "Email công việc: cập nhật tiến độ và đề xuất bước tiếp theo",
    title_en: "Professional email: updating progress and proposing next steps",
    intro_vi:
      "Bài này luyện email công việc ngắn gọn: báo tiến độ, nêu rủi ro, đề xuất giải pháp và yêu cầu xác nhận.",
    intro_en:
      "This lesson practices concise professional emails: reporting progress, naming risks, proposing a solution, and requesting confirmation.",
    sentences: [
      {
        ar: "أكتب إليكم لإطلاعكم على آخر مستجدات المشروع.",
        romanization: "aktubu ilaykum li-itlaa'ikum 'alaa aakhir mustajaddaat al-mashruu'",
        vi: "Tôi viết để cập nhật cho quý vị về những diễn biến mới nhất của dự án.",
        en: "I am writing to update you on the latest developments in the project.",
      },
      {
        ar: "أنجز الفريق معظم المهام، لكننا نحتاج إلى يومين إضافيين.",
        romanization: "anjaza al-fariiq mu'zam al-mahaam, lakinnanaa nahtaaju ilaa yawmayn idaafiyyayn",
        vi: "Nhóm đã hoàn thành phần lớn nhiệm vụ, nhưng chúng tôi cần thêm hai ngày.",
        en: "The team has completed most tasks, but we need two additional days.",
      },
      {
        ar: "أقترح تعديل الجدول الزمني لتجنب أي تأخير لاحق.",
        romanization: "aqtaridu ta'diil al-jadwal az-zamanii li-tajannub ayy ta'khiir laahiq",
        vi: "Tôi đề xuất điều chỉnh lịch trình để tránh bất kỳ chậm trễ nào sau đó.",
        en: "I propose adjusting the timeline to avoid any later delay.",
      },
      {
        ar: "يرجى تأكيد الموافقة على هذا التعديل.",
        romanization: "yurjaa ta'kiid al-muwaafaqah 'alaa haadhaa at-ta'diil",
        vi: "Vui lòng xác nhận sự đồng ý với điều chỉnh này.",
        en: "Please confirm approval of this adjustment.",
      },
      {
        ar: "سأرسل النسخة النهائية فور الانتهاء من المراجعة.",
        romanization: "sa'ursil an-nuskhah an-nihaa'iyyah fawra al-intihaa' min al-muraaja'ah",
        vi: "Tôi sẽ gửi bản cuối cùng ngay sau khi hoàn tất rà soát.",
        en: "I will send the final version immediately after completing the review.",
      },
    ],
    vocabulary: [
      { cell_id: "f962e26e-0c2f-4ea1-b9c0-c311fa164e93", ar: "مستجدات", romanization: "mustajaddaat", vi: "cập nhật, diễn biến mới", en: "updates, developments", pos: "n.pl." },
      { cell_id: "6e67823d-c451-4774-81c0-7cbdab79cff3", ar: "الجدول الزمني", romanization: "al-jadwal az-zamanii", vi: "lịch trình", en: "timeline", pos: "n." },
      { cell_id: "1324a56c-3482-4337-8e61-e4f44e10766e", ar: "تعديل", romanization: "ta'diil", vi: "điều chỉnh", en: "adjustment", pos: "n." },
      { cell_id: "90bc04f6-b838-4a82-b887-f34f1bdd9098", ar: "الموافقة", romanization: "al-muwaafaqah", vi: "sự đồng ý/phê duyệt", en: "approval", pos: "n." },
      { cell_id: "3f96a1b4-f075-43a6-830c-db26785f51b8", ar: "فور", romanization: "fawra", vi: "ngay khi", en: "immediately upon", pos: "prep." },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Vui lòng xác nhận sự đồng ý với điều chỉnh này.",
        en: "Please confirm approval of this adjustment.",
        ar: "يرجى تأكيد الموافقة على هذا التعديل.",
      },
      {
        type: "fill-blank",
        question: "أكتب إليكم ___ على آخر مستجدات المشروع.",
        answer: "لإطلاعكم",
        accepted_answers: ["لاطلاعكم"],
        hint_vi: "cụm nghĩa là 'để cập nhật/thông báo cho quý vị'",
        hint_en: "the phrase meaning 'to inform/update you'",
      },
    ],
    cultural_notes_vi:
      "Email công việc MSA dùng يرجى để yêu cầu lịch sự, nhưng nếu lạm dụng có thể nghe như mệnh lệnh hành chính. Với đồng nghiệp thân hơn, يمكنكم hoặc هل يمكنكم mềm hơn.",
    cultural_notes_en:
      "Professional MSA emails use يرجى for polite requests, but overuse can sound administrative. With closer colleagues, يمكنكم or هل يمكنكم is softer.",
    tip_advice_vi:
      "Một email B2 tốt có bốn câu: mục đích, tình hình, đề xuất, yêu cầu xác nhận. Đừng dịch từng dòng từ tiếng Việt; dùng cụm cố định như لإطلاعكم على và يرجى تأكيد.",
    tip_advice_en:
      "A solid B2 email has four moves: purpose, status, proposal, and confirmation request. Do not translate line by line; use fixed frames such as لإطلاعكم على and يرجى تأكيد.",
    register_notes_vi:
      "فور الانتهاء من... trang trọng hơn بعد ما نخلص. Cụm thứ hai là sắc thái nói, không dùng làm đáp án MSA.",
    register_notes_en:
      "فور الانتهاء من... is more formal than بعد ما نخلص. The latter is spoken-style and not an MSA answer target.",
    dialect_notes_vi:
      "Trong nói chuyện công sở, nhiều người sẽ dùng phương ngữ cho 'khi xong'. Ghi chú này chỉ để nhận biết; đáp án của bài vẫn là MSA.",
    dialect_notes_en:
      "In workplace speech, many speakers use dialect for 'when we finish'. This is recognition-only; lesson answers remain MSA.",
  },
  {
    id: "arabic_b2_polite_disagreement",
    level: "B2",
    category: "disagreement",
    title_vi: "Bất đồng lịch sự và phản biện có chừng mực",
    title_en: "Polite disagreement and measured rebuttal",
    intro_vi:
      "Bài này luyện cách bất đồng mà không nói 'bạn sai', dùng công thức thừa nhận, giới hạn, rồi đưa quan điểm khác.",
    intro_en:
      "This lesson practices disagreeing without saying 'you are wrong', using acknowledgement, limitation, and an alternative view.",
    sentences: [
      {
        ar: "أفهم وجهة نظرك، لكنني لا أتفق تمامًا.",
        romanization: "afhamu wijhat nazarik, lakinnanii laa attafiq tamaaman",
        vi: "Tôi hiểu quan điểm của bạn, nhưng tôi không hoàn toàn đồng ý.",
        en: "I understand your point of view, but I do not fully agree.",
      },
      {
        ar: "قد يكون هذا صحيحًا في بعض الحالات، غير أن الوضع هنا مختلف.",
        romanization: "qad yakuunu haadhaa sahiihan fii ba'd al-haalaat, ghayra anna al-wad' hunaa mukhtalif",
        vi: "Điều này có thể đúng trong một số trường hợp, nhưng tình hình ở đây khác.",
        en: "This may be true in some cases, but the situation here is different.",
      },
      {
        ar: "من وجهة نظري، لا تكفي هذه البيانات لاتخاذ قرار نهائي.",
        romanization: "min wijhat nazarii, laa takfii haadhihi al-bayaanaat li-ittikhaadh qaraar nihaa'ii",
        vi: "Theo quan điểm của tôi, các dữ liệu này chưa đủ để đưa ra quyết định cuối cùng.",
        en: "In my view, this data is not enough to make a final decision.",
      },
      {
        ar: "ربما نحتاج إلى مقارنة الخيارات قبل الرفض أو القبول.",
        romanization: "rubbamaa nahtaaju ilaa muqaaranat al-khiyaaraat qabla ar-rafd aw al-qabuul",
        vi: "Có lẽ chúng ta cần so sánh các lựa chọn trước khi từ chối hoặc chấp nhận.",
        en: "Perhaps we need to compare the options before rejecting or accepting.",
      },
      {
        ar: "لا أقصد الاعتراض، بل أريد توضيح نقطة مهمة.",
        romanization: "laa aqsidu al-i'tiraad, bal uriidu tawdiih nuqtah muhimmh",
        vi: "Tôi không có ý phản đối, mà muốn làm rõ một điểm quan trọng.",
        en: "I do not mean to object; rather, I want to clarify an important point.",
      },
    ],
    vocabulary: [
      { cell_id: "0c544177-a2d2-4a2d-acb2-71582b756d42", ar: "وجهة نظر", romanization: "wijhat nazar", vi: "quan điểm", en: "point of view", pos: "n." },
      { cell_id: "1825aae8-93cc-492f-98a5-567a871c32bd", ar: "لا أتفق تمامًا", romanization: "laa attafiq tamaaman", vi: "tôi không hoàn toàn đồng ý", en: "I do not fully agree", pos: "phr." },
      { cell_id: "6affd902-58e4-4b5b-b9d3-cbc28b55066b", ar: "غير أن", romanization: "ghayra anna", vi: "tuy nhiên, nhưng", en: "however, but", pos: "conj." },
      { cell_id: "1320cbd4-a199-433c-99a5-c4a4709c33ab", ar: "الاعتراض", romanization: "al-i'tiraad", vi: "sự phản đối", en: "objection", pos: "n." },
      { cell_id: "db6421f3-3433-4fad-aebc-e5162901a835", ar: "توضيح", romanization: "tawdiih", vi: "làm rõ", en: "clarification", pos: "n." },
    ],
    dialogue: [
      {
        cell_id: "ab2740f8-fd10-44bd-9c28-1c8efb2f5929",
        speaker: "أ",
        ar: "أعتقد أن علينا إلغاء الخطة الحالية.",
        romanization: "a'taqidu anna 'alaynaa ilghaa' al-khuttah al-haaliyyah",
        vi: "Tôi nghĩ chúng ta nên hủy kế hoạch hiện tại.",
        en: "I think we should cancel the current plan.",
        register: "neutral",
      },
      {
        cell_id: "d7f3933e-e366-4c09-902d-25912990280e",
        speaker: "ب",
        ar: "أفهم وجهة نظرك، لكنني لا أتفق تمامًا.",
        romanization: "afhamu wijhat nazarik, lakinnanii laa attafiq tamaaman",
        vi: "Tôi hiểu quan điểm của bạn, nhưng tôi không hoàn toàn đồng ý.",
        en: "I understand your point of view, but I do not fully agree.",
        register: "polite",
      },
      {
        cell_id: "2933712c-58e9-4d59-88aa-7b59310c9857",
        speaker: "ب",
        ar: "ربما نحتاج إلى مقارنة الخيارات أولًا.",
        romanization: "rubbamaa nahtaaju ilaa muqaaranat al-khiyaaraat awwalan",
        vi: "Có lẽ trước tiên chúng ta cần so sánh các lựa chọn.",
        en: "Perhaps we need to compare the options first.",
        register: "polite",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "أفهم وجهة نظرك، لكنني لا ___ تمامًا.",
        answer: "أتفق",
        hint_vi: "động từ 'đồng ý'",
        hint_en: "the verb 'agree'",
      },
      {
        type: "translation",
        vi: "Điều này có thể đúng trong một số trường hợp, nhưng tình hình ở đây khác.",
        en: "This may be true in some cases, but the situation here is different.",
        ar: "قد يكون هذا صحيحًا في بعض الحالات، غير أن الوضع هنا مختلف.",
      },
    ],
    cultural_notes_vi:
      "Trong bối cảnh trang trọng, phản bác hiệu quả thường bắt đầu bằng công nhận một phần. Câu أنت مخطئ quá trực diện; hãy dùng لا أتفق تمامًا hoặc أرى الأمر بطريقة مختلفة.",
    cultural_notes_en:
      "In formal settings, effective rebuttal often starts with partial acknowledgement. أنت مخطئ is too blunt; use لا أتفق تمامًا or أرى الأمر بطريقة مختلفة.",
    tip_advice_vi:
      "Khung phản biện B2: أفهم + nhưng + giới hạn dữ liệu + đề xuất bước tiếp theo. Cách này giữ thể diện cho người nghe và vẫn bảo vệ lập luận của bạn.",
    tip_advice_en:
      "B2 rebuttal frame: أفهم + but + data limitation + next-step proposal. It preserves face while still defending your argument.",
  },
  {
    id: "arabic_b2_conditionals_and_concession",
    level: "B2",
    category: "complex_grammar",
    title_vi: "Câu điều kiện, nhượng bộ và kết nối lập luận",
    title_en: "Conditionals, concession, and argument connectors",
    intro_vi:
      "Bài này gom các cấu trúc B2 dùng để nói điều kiện, giả định, nhượng bộ và kết luận trong bài viết hoặc thảo luận trang trọng.",
    intro_en:
      "This lesson brings together B2 structures for conditions, hypotheticals, concession, and conclusions in formal writing or discussion.",
    sentences: [
      {
        ar: "إذا توفرت الموارد، فسنبدأ المرحلة الثانية الشهر القادم.",
        romanization: "idhaa tawaffarat al-mawaarid, fa-sanabda' al-marhalah ath-thaaniyah ash-shahr al-qaadim",
        vi: "Nếu có đủ nguồn lực, chúng ta sẽ bắt đầu giai đoạn hai vào tháng tới.",
        en: "If the resources are available, we will begin the second phase next month.",
      },
      {
        ar: "لو كان لدينا وقت أكثر، لدرسنا البدائل بتفصيل أكبر.",
        romanization: "law kaana ladaynaa waqt akthar, la-darasnaa al-badaa'il bi-tafsiil akbar",
        vi: "Nếu chúng ta có nhiều thời gian hơn, chúng ta đã nghiên cứu các phương án chi tiết hơn.",
        en: "If we had more time, we would have studied the alternatives in greater detail.",
      },
      {
        ar: "رغم أن الخطة مكلفة، فإن فوائدها طويلة المدى واضحة.",
        romanization: "raghma anna al-khuttah muklifah, fa-inna fawaa'idahaa tawiilat al-madaa waadihah",
        vi: "Mặc dù kế hoạch tốn kém, lợi ích dài hạn của nó rất rõ.",
        en: "Although the plan is costly, its long-term benefits are clear.",
      },
      {
        ar: "من ناحية أخرى، قد يؤدي التأجيل إلى خسائر إضافية.",
        romanization: "min naahiyah ukhraa, qad yu'addii at-ta'jiil ilaa khasaa'ir idaafiyyah",
        vi: "Mặt khác, việc trì hoãn có thể dẫn đến tổn thất thêm.",
        en: "On the other hand, postponement may lead to additional losses.",
      },
      {
        ar: "بناءً على ذلك، أوصي بالموافقة المشروطة على الاقتراح.",
        romanization: "binaa'an 'alaa dhaalik, uusii bil-muwaafaqah al-mashruutah 'alaa al-iqtiraah",
        vi: "Dựa trên điều đó, tôi khuyến nghị phê duyệt có điều kiện đề xuất này.",
        en: "Based on that, I recommend conditional approval of the proposal.",
      },
    ],
    vocabulary: [
      { cell_id: "cbbf6dd5-9158-48de-8438-2880d216b808", ar: "إذا", romanization: "idhaa", vi: "nếu, khi", en: "if, when", pos: "conj." },
      { cell_id: "19fbb6b8-00bf-4a41-82a5-2d37cb9e7f81", ar: "لو", romanization: "law", vi: "nếu giả định/trái thực tế", en: "if, hypothetically", pos: "conj." },
      { cell_id: "c330d00e-464e-4ce7-8212-7e475e8b6457", ar: "رغم أن", romanization: "raghma anna", vi: "mặc dù", en: "although", pos: "conj." },
      { cell_id: "36de8908-bc90-497d-a363-06ef05902188", ar: "من ناحية أخرى", romanization: "min naahiyah ukhraa", vi: "mặt khác", en: "on the other hand", pos: "phr." },
      { cell_id: "ca5595ef-24cd-4882-830f-71c2c8b1c375", ar: "الموافقة المشروطة", romanization: "al-muwaafaqah al-mashruutah", vi: "phê duyệt có điều kiện", en: "conditional approval", pos: "n." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cấu trúc với chức năng lập luận.",
        instruction_en: "Match each structure with its argumentative function.",
        pairs: [
          { ar: "إذا", meaning_vi: "điều kiện có thể xảy ra", meaning_en: "possible condition" },
          { ar: "لو", meaning_vi: "giả định hoặc trái thực tế", meaning_en: "hypothetical or counterfactual" },
          { ar: "رغم أن", meaning_vi: "nhượng bộ", meaning_en: "concession" },
          { ar: "بناءً على ذلك", meaning_vi: "kết luận dựa trên điều trước", meaning_en: "conclusion based on prior points" },
        ],
      },
      {
        type: "translation",
        vi: "Mặc dù kế hoạch tốn kém, lợi ích dài hạn của nó rất rõ.",
        en: "Although the plan is costly, its long-term benefits are clear.",
        ar: "رغم أن الخطة مكلفة، فإن فوائدها طويلة المدى واضحة.",
      },
    ],
    cultural_notes_vi:
      "Trong bài viết trang trọng, kết nối lập luận quan trọng hơn độ dài câu. Một câu ngắn có رغم أن hoặc بناءً على ذلك thường rõ hơn một câu dài dịch sát từ tiếng Việt hoặc tiếng Anh.",
    cultural_notes_en:
      "In formal writing, argument linkage matters more than sentence length. A short sentence with رغم أن or بناءً على ذلك is often clearer than a long sentence translated from Vietnamese or English.",
    tip_advice_vi:
      "Phân biệt إذا cho điều kiện thực tế/có thể xảy ra và لو cho giả định xa hơn. Với B2, chỉ cần dùng đúng trong khung câu, chưa cần phân tích ngữ pháp cổ điển sâu.",
    tip_advice_en:
      "Distinguish إذا for real or possible conditions from لو for more hypothetical framing. At B2, correct sentence frames matter more than deep classical grammar analysis.",
  },
];

export default lessons;
