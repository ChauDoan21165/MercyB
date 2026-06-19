// Arabic C1 lessons — Modern Standard Arabic first.
//
// Scope: academic presentation, nuanced opinion, media discussion, and
// professional register. These lessons are local content only, with no
// assumptions outside the Arabic source-content module.

import type { ArabicLesson } from "./lessons";

export const lessons: ArabicLesson[] = [
  {
    id: "ar_c1_seminar_presentation_opening",
    level: "C1",
    category: "academic_speaking",
    title_vi: "Mở đầu bài thuyết trình học thuật bằng tiếng Ả Rập chuẩn",
    title_en: "Opening an academic presentation in Modern Standard Arabic",
    intro_vi:
      "Bài này luyện cách mở đầu một bài trình bày học thuật bằng MSA: nêu chủ đề, phạm vi, bố cục, thời lượng và quy tắc hỏi đáp mà không nghe quá trang trọng kiểu nghi lễ.",
    intro_en:
      "This lesson practices opening an academic presentation in MSA: topic, scope, structure, timing, and Q&A control without sounding ceremonial.",
    vocabulary: [
      {
        ar: "محور",
        romanization: "mihwar",
        en: "axis; main section",
        vi: "trục chính; phần chính",
        pos: "noun",
      },
      {
        ar: "إطار عام",
        romanization: "itar aam",
        en: "general framework",
        vi: "khung chung",
        pos: "phrase",
      },
      {
        ar: "سأقسم العرض إلى",
        romanization: "sa-uqassim al-ard ila",
        en: "I will divide the presentation into",
        vi: "tôi sẽ chia bài trình bày thành",
        pos: "frame",
      },
      {
        ar: "أنتقل الآن إلى",
        romanization: "antaqilu al-aan ila",
        en: "I now move to",
        vi: "bây giờ tôi chuyển sang",
        pos: "frame",
      },
    ],
    sentences: [
      {
        ar: "يسعدني أن أقدم لكم عرضا موجزا عن نتائج هذه الدراسة.",
        romanization:
          "yasuduni an uqaddima lakum ardan mujazan an nataij hadhihi ad-dirasa",
        en: "I am pleased to present a concise talk on the results of this study.",
        vi: "Tôi rất vui được trình bày ngắn gọn về kết quả của nghiên cứu này.",
        pronunciation_focus: [
          "q trong uqaddima là âm sâu /q/, không đọc như k nhẹ.",
          "dراسة giữ trọng âm chính gần âm tiết ra.",
        ],
        pronunciation_focus_en: [
          "The q in uqaddima is a deep /q/, not a light k.",
          "In dirasa, keep the main stress near ra.",
        ],
      },
      {
        ar: "سأقسم العرض إلى ثلاثة محاور: الخلفية، والمنهج، والنتائج.",
        romanization:
          "sa-uqassim al-ard ila thalathati mahawir: al-khalfiyya, wal-manhaj, wan-nataij",
        en: "I will divide the presentation into three sections: background, method, and findings.",
        vi: "Tôi sẽ chia bài trình bày thành ba phần: bối cảnh, phương pháp và kết quả.",
      },
      {
        ar: "أرحب بأسئلتكم في نهاية العرض حتى نحافظ على تسلسل الأفكار.",
        romanization:
          "urahhibu bi-asilatikum fi nihayat al-ard hatta nuhafiza ala tasalsul al-afkar",
        en: "I welcome your questions at the end so that we preserve the sequence of ideas.",
        vi: "Tôi hoan nghênh câu hỏi ở cuối phần trình bày để giữ mạch ý tưởng.",
        note_vi:
          "Câu này lịch sự hơn việc nói trực tiếp 'đừng hỏi giữa chừng'.",
        note_en:
          "This is more polite than directly saying 'do not interrupt'.",
      },
    ],
    dialogue: [
      {
        speaker: "Presenter",
        ar: "في البداية، أود أن أوضح سؤال البحث وحدود المادة المدروسة.",
        romanization:
          "fi al-bidaya, awaddu an uwaddiha sual al-bahth wa-hudud al-madda al-madrusa",
        en: "To begin, I would like to clarify the research question and the limits of the material studied.",
        vi: "Trước hết, tôi muốn làm rõ câu hỏi nghiên cứu và giới hạn của tư liệu được khảo sát.",
        register: "formal",
      },
      {
        speaker: "Chair",
        ar: "هل ستتناول الجانب التطبيقي أيضا؟",
        romanization: "hal satatanawalu al-janib at-tatbiqi aydan",
        en: "Will you also address the applied aspect?",
        vi: "Bạn cũng sẽ đề cập đến khía cạnh ứng dụng chứ?",
        register: "formal",
      },
      {
        speaker: "Presenter",
        ar: "نعم، سأعود إليه في المحور الثالث بعد عرض المنهج.",
        romanization:
          "naam, sa-audu ilayhi fi al-mihwar ath-thalith bada ard al-manhaj",
        en: "Yes, I will return to it in the third section after presenting the method.",
        vi: "Vâng, tôi sẽ quay lại điểm đó ở phần thứ ba sau khi trình bày phương pháp.",
        register: "formal",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "سأقسم العرض إلى ثلاثة ____.",
        answer: "محاور",
        accepted_answers: ["محاور"],
        hint_vi: "Từ này nghĩa là các trục/phần chính của bài trình bày.",
        hint_en: "This word means the main axes or sections of a presentation.",
      },
      {
        type: "translation",
        vi: "Tôi hoan nghênh câu hỏi của quý vị ở cuối bài trình bày.",
        en: "I welcome your questions at the end of the presentation.",
        ar: "أرحب بأسئلتكم في نهاية العرض.",
        romanization: "urahhibu bi-asilatikum fi nihayat al-ard",
      },
    ],
    cultural_notes_vi:
      "Trong bối cảnh học thuật Ả Rập chuẩn, mở đầu tốt thường nêu bố cục rõ hơn là kể chuyện dài. Cách dùng 'محور' và 'إطار' giúp bài nói nghe có cấu trúc và phù hợp hội thảo.",
    cultural_notes_en:
      "In formal Arabic academic settings, a strong opening usually foregrounds structure rather than a long personal story. Words like mihwar and itar make the talk sound organized and seminar-appropriate.",
    tip_advice_vi:
      "Dùng các cụm chuyển ý cố định như 'أنتقل الآن إلى...' để kiểm soát tốc độ nói. Đừng dịch máy móc 'now I talk about' thành câu quá khẩu ngữ.",
    tip_advice_en:
      "Use fixed signposting frames such as antaqilu al-aan ila to control pacing. Avoid literal, casual equivalents of 'now I talk about'.",
    register_notes_vi:
      "MSA thuyết trình nên rõ và tiết chế. Quá nhiều từ hoa mỹ sẽ làm bài nói nặng nề.",
    register_notes_en:
      "Presentation MSA should be clear and controlled. Too many ornate expressions make the talk heavy.",
  },
  {
    id: "ar_c1_argument_concession_rebuttal",
    level: "C1",
    category: "nuanced_opinion",
    title_vi: "Nêu ý kiến có sắc thái: nhượng bộ và phản biện",
    title_en: "Nuanced opinion: concession and rebuttal",
    intro_vi:
      "Bài này luyện cách đồng ý một phần, giới hạn phạm vi và phản biện bằng MSA lịch sự. Nội dung ví dụ trung lập, tránh kết luận chính trị hoặc tôn giáo.",
    intro_en:
      "This lesson practices partial agreement, scope control, and polite rebuttal in MSA. Examples are neutral and avoid political or religious conclusions.",
    vocabulary: [
      {
        ar: "مع التسليم بـ",
        romanization: "maa at-taslim bi",
        en: "while conceding",
        vi: "dù thừa nhận",
        pos: "frame",
      },
      {
        ar: "غير أن",
        romanization: "ghayra anna",
        en: "however; yet",
        vi: "tuy nhiên",
        pos: "connector",
      },
      {
        ar: "لا يترتب على ذلك أن",
        romanization: "la yatarattabu ala dhalika anna",
        en: "it does not follow that",
        vi: "không vì thế mà suy ra rằng",
        pos: "frame",
      },
      {
        ar: "إلى حد ما",
        romanization: "ila haddin ma",
        en: "to some extent",
        vi: "ở một mức độ nào đó",
        pos: "hedge",
      },
    ],
    sentences: [
      {
        ar: "لا شك أن الاقتراح وجيه إلى حد ما، غير أنه يحتاج إلى أدلة إضافية.",
        romanization:
          "la shakka anna al-iqtirah wajih ila haddin ma, ghayra annahu yahtaju ila adilla idafiyya",
        en: "There is no doubt that the proposal is reasonable to some extent, yet it needs additional evidence.",
        vi: "Không nghi ngờ gì rằng đề xuất này có lý ở mức độ nào đó, tuy nhiên nó cần thêm bằng chứng.",
      },
      {
        ar: "مع التسليم بأهمية السرعة، لا ينبغي إهمال الدقة.",
        romanization:
          "maa at-taslim bi-ahammiyyat as-sura, la yanbaghi ihmal ad-diqqa",
        en: "While conceding the importance of speed, accuracy should not be neglected.",
        vi: "Dù thừa nhận tầm quan trọng của tốc độ, không nên bỏ qua độ chính xác.",
      },
      {
        ar: "هذا الاعتراض مهم، لكنه لا ينقض الحجة الأساسية.",
        romanization:
          "hadha al-itirad muhimm, lakinnahu la yanqudu al-hujja al-asasiyya",
        en: "This objection is important, but it does not overturn the main argument.",
        vi: "Phản biện này quan trọng, nhưng nó không bác bỏ lập luận chính.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        ar: "ألا ترى أن الحل المقترح مكلف جدا؟",
        romanization: "ala tara anna al-hall al-muqtarah muklif jiddan",
        en: "Do you not think the proposed solution is very costly?",
        vi: "Bạn không nghĩ giải pháp được đề xuất quá tốn kém sao?",
        register: "formal",
      },
      {
        speaker: "B",
        ar: "هذا صحيح إلى حد ما، لكن الكلفة وحدها لا تكفي للحكم على الجدوى.",
        romanization:
          "hadha sahih ila haddin ma, lakinna al-kulfa wahdaha la takfi lil-hukm ala al-jadwa",
        en: "That is true to some extent, but cost alone is not enough to judge feasibility.",
        vi: "Điều đó đúng ở mức độ nào đó, nhưng riêng chi phí không đủ để đánh giá tính khả thi.",
        register: "formal",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Ả Rập với chức năng tu từ.",
        instruction_en: "Match the Arabic frame with its rhetorical function.",
        pairs: [
          {
            ar: "مع التسليم بـ",
            meaning_vi: "nhượng bộ trước khi phản biện",
            meaning_en: "concede before rebutting",
          },
          {
            ar: "لا يترتب على ذلك أن",
            meaning_vi: "chặn một suy luận quá xa",
            meaning_en: "block an overextended inference",
          },
        ],
      },
      {
        type: "translation",
        vi: "Dù phản biện này quan trọng, nó không bác bỏ lập luận chính.",
        en: "Although this objection is important, it does not overturn the main argument.",
        ar: "مع أهمية هذا الاعتراض، فإنه لا ينقض الحجة الأساسية.",
        romanization:
          "maa ahammiyyat hadha al-itirad, fa-innahu la yanqudu al-hujja al-asasiyya",
      },
    ],
    cultural_notes_vi:
      "Trong văn phong MSA trang trọng, phản biện hiệu quả thường bắt đầu bằng sự công nhận một phần. Điều này không yếu đuối; nó cho thấy bạn kiểm soát phạm vi lập luận.",
    cultural_notes_en:
      "In formal MSA, effective rebuttal often begins with partial recognition. This is not weakness; it shows control over the scope of the argument.",
    tip_advice_vi:
      "Thay vì nói trực tiếp 'هذا خطأ' ở mọi tình huống, hãy dùng 'هذا لا ينفي أن...' hoặc 'غير أن...' để giữ giọng C1.",
    tip_advice_en:
      "Instead of saying hadha khata for every disagreement, use frames like hadha la yanfi anna or ghayra anna to keep a C1 register.",
    register_notes_vi:
      "Các cụm nhượng bộ làm giọng văn học thuật hơn, nhưng không nên dùng quá dày trong một đoạn ngắn.",
    register_notes_en:
      "Concession frames make the register more academic, but they should not be stacked too densely in a short paragraph.",
  },
  {
    id: "ar_c1_media_source_attribution",
    level: "C1",
    category: "media_discussion",
    title_vi: "Thảo luận tin tức: nguồn tin, mức độ chắc chắn và trung lập",
    title_en: "Media discussion: source attribution, certainty, and neutrality",
    intro_vi:
      "Bài này luyện đọc và tóm tắt tin tức bằng MSA trung lập: ai nói, mức độ chắc chắn ra sao, và phần nào chưa được kiểm chứng.",
    intro_en:
      "This lesson practices reading and summarizing news in neutral MSA: who said what, how certain it is, and what has not been verified.",
    vocabulary: [
      {
        ar: "بحسب البيان",
        romanization: "bi-hasab al-bayan",
        en: "according to the statement",
        vi: "theo thông cáo",
        pos: "frame",
      },
      {
        ar: "لم يتسن التحقق من",
        romanization: "lam yatasanna at-tahaqquq min",
        en: "it was not possible to verify",
        vi: "chưa thể xác minh",
        pos: "frame",
      },
      {
        ar: "مصادر مطلعة",
        romanization: "masadir muttalia",
        en: "informed sources",
        vi: "các nguồn thạo tin",
        pos: "noun phrase",
      },
      {
        ar: "في السياق نفسه",
        romanization: "fi as-siyaq nafsihi",
        en: "in the same context",
        vi: "trong cùng bối cảnh đó",
        pos: "connector",
      },
    ],
    sentences: [
      {
        ar: "أفاد التقرير بأن عدد المشاركين ازداد خلال العام الماضي.",
        romanization:
          "afada at-taqrir bi-anna adad al-musharikin izdada khilala al-am al-madi",
        en: "The report stated that the number of participants increased during the past year.",
        vi: "Báo cáo cho biết số người tham gia đã tăng trong năm qua.",
      },
      {
        ar: "لم يتسن التحقق من بعض الأرقام الواردة في المقال.",
        romanization:
          "lam yatasanna at-tahaqquq min bad al-arqam al-warida fi al-maqal",
        en: "It was not possible to verify some of the figures mentioned in the article.",
        vi: "Chưa thể xác minh một số con số được nêu trong bài viết.",
      },
      {
        ar: "ينبغي التمييز بين الخبر والتحليل والرأي الشخصي.",
        romanization:
          "yanbaghi at-tamyiz bayna al-khabar wat-tahlil war-ray ash-shakhsi",
        en: "One should distinguish between news, analysis, and personal opinion.",
        vi: "Cần phân biệt giữa tin tức, phân tích và ý kiến cá nhân.",
      },
    ],
    dialogue: [
      {
        speaker: "Editor",
        ar: "هل ذكرت المقالة مصدر هذه الأرقام؟",
        romanization: "hal dhakarat al-maqala masdar hadhihi al-arqam",
        en: "Did the article mention the source of these figures?",
        vi: "Bài viết có nêu nguồn của những con số này không?",
        register: "formal",
      },
      {
        speaker: "Analyst",
        ar: "ذكرت مصدرا عاما، لكنها لم تقدم رابطا إلى البيانات الأصلية.",
        romanization:
          "dhakarat masdaran amman, lakinnaha lam tuqaddim rabitan ila al-bayanat al-asliyya",
        en: "It mentioned a general source, but did not provide a link to the original data.",
        vi: "Bài viết nêu một nguồn chung, nhưng không cung cấp liên kết đến dữ liệu gốc.",
        register: "formal",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "____ التحقق من بعض الأرقام الواردة في المقال.",
        answer: "لم يتسن",
        accepted_answers: ["لم يتسن"],
        hint_vi: "Cụm này nghĩa là 'chưa thể'.",
        hint_en: "This frame means 'it was not possible to'.",
      },
      {
        type: "translation",
        vi: "Theo thông cáo, chương trình sẽ bắt đầu vào tháng tới.",
        en: "According to the statement, the program will begin next month.",
        ar: "بحسب البيان، سيبدأ البرنامج في الشهر المقبل.",
        romanization:
          "bi-hasab al-bayan, sayabda al-barnamaj fi ash-shahr al-muqbil",
      },
    ],
    cultural_notes_vi:
      "Bài học này chỉ dạy ngôn ngữ phân tích truyền thông: nguồn, xác minh, mức độ chắc chắn. Không dùng các ví dụ để kết luận đúng sai về sự kiện thực tế.",
    cultural_notes_en:
      "This lesson teaches media-analysis language only: sources, verification, and certainty. It does not use examples to decide the truth of real-world events.",
    tip_advice_vi:
      "Khi tóm tắt tin, luôn giữ chủ thể phát ngôn: 'التقرير يقول' khác với việc bạn tự khẳng định.",
    tip_advice_en:
      "When summarizing news, keep the source of the claim visible: 'the report says' is different from asserting it yourself.",
    register_notes_vi:
      "Các động từ như 'أفاد' và 'ذكر' tạo khoảng cách báo chí trung lập hơn 'قال' trong bài phân tích.",
    register_notes_en:
      "Verbs such as afada and dhakara create more neutral journalistic distance than qala in analysis.",
  },
  {
    id: "ar_c1_professional_register_shift",
    level: "C1",
    category: "professional_register",
    title_vi: "Điều chỉnh văn phong chuyên nghiệp: trung tính, lịch sự, trang trọng",
    title_en: "Professional register shift: neutral, polite, and formal",
    intro_vi:
      "Bài này luyện chuyển cùng một ý giữa văn phong trung tính, lịch sự và trang trọng trong môi trường công sở hoặc cơ quan.",
    intro_en:
      "This lesson practices shifting the same idea between neutral, polite, and formal register in workplace or institutional settings.",
    vocabulary: [
      {
        ar: "أود الاستفسار عن",
        romanization: "awaddu al-istifsar an",
        en: "I would like to inquire about",
        vi: "tôi muốn hỏi về",
        pos: "polite frame",
      },
      {
        ar: "يرجى التكرم بـ",
        romanization: "yurja at-takarrum bi",
        en: "kindly please",
        vi: "kính đề nghị",
        pos: "formal frame",
      },
      {
        ar: "في أقرب وقت ممكن",
        romanization: "fi aqrab waqt mumkin",
        en: "as soon as possible",
        vi: "trong thời gian sớm nhất có thể",
        pos: "phrase",
      },
      {
        ar: "وتفضلوا بقبول فائق الاحترام",
        romanization: "wa-tafaddalu bi-qabul faiq al-ihtiram",
        en: "please accept my highest respect",
        vi: "xin trân trọng kính chào",
        pos: "closing",
      },
    ],
    sentences: [
      {
        ar: "أود الاستفسار عن حالة الطلب الذي قدمته الأسبوع الماضي.",
        romanization:
          "awaddu al-istifsar an halat at-talab alladhi qaddamtuhu al-usbu al-madi",
        en: "I would like to inquire about the status of the request I submitted last week.",
        vi: "Tôi muốn hỏi về tình trạng của yêu cầu tôi đã nộp tuần trước.",
      },
      {
        ar: "يرجى التكرم بإرسال النسخة النهائية في أقرب وقت ممكن.",
        romanization:
          "yurja at-takarrum bi-irsal an-nuskha an-nihaiyya fi aqrab waqt mumkin",
        en: "Kindly send the final version as soon as possible.",
        vi: "Kính đề nghị gửi phiên bản cuối cùng trong thời gian sớm nhất có thể.",
      },
      {
        ar: "أقدر تعاونكم، وأتطلع إلى ردكم.",
        romanization: "uqaddiru taawunakum, wa-atatallau ila raddikum",
        en: "I appreciate your cooperation and look forward to your reply.",
        vi: "Tôi trân trọng sự hợp tác của quý vị và mong nhận được phản hồi.",
      },
    ],
    dialogue: [
      {
        speaker: "Employee",
        ar: "هل يمكن أن ترسل الملف اليوم؟",
        romanization: "hal yumkin an tursila al-malaf al-yawm",
        en: "Can you send the file today?",
        vi: "Bạn có thể gửi hồ sơ hôm nay không?",
        register: "neutral",
      },
      {
        speaker: "Manager",
        ar: "في رسالة رسمية، قل: يرجى التكرم بإرسال الملف اليوم إن أمكن.",
        romanization:
          "fi risala rasmiyya, qul: yurja at-takarrum bi-irsal al-malaf al-yawm in amkan",
        en: "In a formal message, say: Kindly send the file today if possible.",
        vi: "Trong thư trang trọng, hãy nói: Kính đề nghị gửi hồ sơ hôm nay nếu có thể.",
        register: "formal",
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Tôi muốn hỏi về tình trạng của yêu cầu.",
        en: "I would like to inquire about the status of the request.",
        ar: "أود الاستفسار عن حالة الطلب.",
        romanization: "awaddu al-istifsar an halat at-talab",
      },
      {
        type: "fill-blank",
        question: "____ بإرسال النسخة النهائية في أقرب وقت ممكن.",
        answer: "يرجى التكرم",
        accepted_answers: ["يرجى التكرم"],
        hint_vi: "Cụm mở đầu lịch sự/trang trọng cho yêu cầu.",
        hint_en: "A polite/formal opening frame for a request.",
      },
    ],
    cultural_notes_vi:
      "Trong thư MSA chuyên nghiệp, lịch sự thường được mã hóa bằng công thức cố định. Dịch từng chữ từ tiếng Việt như 'mong bạn giúp' có thể quá thân mật hoặc thiếu chuẩn văn thư.",
    cultural_notes_en:
      "In professional MSA emails, politeness is often encoded through fixed formulas. Literal translations of casual English requests may sound too direct or administratively weak.",
    tip_advice_vi:
      "Hãy học theo cặp: câu trung tính để hiểu nghĩa, câu trang trọng để dùng trong email.",
    tip_advice_en:
      "Learn in pairs: one neutral sentence for meaning, one formal sentence for email use.",
    register_notes_vi:
      "'وتفضلوا بقبول فائق الاحترام' rất trang trọng; dùng cho thư cơ quan, không phải tin nhắn nhanh.",
    register_notes_en:
      "wa-tafaddalu bi-qabul faiq al-ihtiram is highly formal; use it for institutional letters, not quick chat messages.",
  },
];

export const arabicC1Lessons = lessons;
export default lessons;
