// src/languages/russian/lessons-c1-speaking-writing.ts
//
// C1 speaking + writing batch converted from the local Vietnamese-Russian archive:
// c1-speaking-course.md, c1-writing-course.md, advanced-writing-lab.md,
// advanced-writing-portfolio.md, advanced-collocations.md, c1-standard-audit.md.
//
// Focus: formal speech, essays, reports, argument structure, collocations, register.
// Native review of advanced register is deferred (per the source headers); these
// lessons are training-grade, not a claim of native-reviewed polish.
//
// These lessons are not wired into loadLessonsForLevel (C1 stays "unconverted" there
// for batch 1); they ship as a standalone, app-ready module guarded by their own test.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_c1_structured_self_presentation",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Tự giới thiệu có cấu trúc trong môi trường chuyên nghiệp",
    title_en: "C1: Structured self-presentation in a professional setting",
    intro_vi:
      "Ở C1, tự giới thiệu không chỉ là tên và tuổi. Khung chuẩn: mở lời lịch sự + nền tảng kinh nghiệm + tình hình hiện tại + mục tiêu chính.",
    intro_en:
      "At C1, a self-introduction is more than name and age. The frame is: a polite opening + background + current situation + main goal.",
    sentences: [
      {
        russian: "Позвольте кратко представиться.",
        romanization: "Pozvolte kratko predstavitsya.",
        en: "Allow me to introduce myself briefly.",
        vi: "Cho phép tôi giới thiệu ngắn gọn.",
        pronunciation_focus: ["позвольте là cách mở lời trang trọng", "представиться có -ться", "кратко = ngắn gọn"],
        pronunciation_focus_en: ["позвольте is a formal opener", "представиться has -ться", "кратко means briefly"],
      },
      {
        russian: "Мой опыт связан с работой в сфере логистики.",
        romanization: "Moy opyt svyazan s rabotoy v sfere logistiki.",
        en: "My experience is connected with work in logistics.",
        vi: "Kinh nghiệm của tôi liên quan đến công việc trong lĩnh vực logistics.",
        pronunciation_focus: ["опыт связан с + công cụ cách", "сфера = lĩnh vực", "логистики là sinh cách"],
        pronunciation_focus_en: ["опыт связан с + instrumental", "сфера means field", "логистики is genitive"],
      },
      {
        russian: "На данный момент я изучаю русский язык для работы.",
        romanization: "Na dannyy moment ya izuchayu russkiy yazyk dlya raboty.",
        en: "At the moment I am studying Russian for work.",
        vi: "Hiện tại tôi đang học tiếng Nga để phục vụ công việc.",
        pronunciation_focus: ["на данный момент = hiện tại", "изучаю dài, nhấn -чаю", "для + sinh cách"],
        pronunciation_focus_en: ["на данный момент means at the moment", "изучаю stresses -чаю", "для + genitive"],
      },
      {
        russian: "Моя основная цель — увереннее общаться в профессиональной среде.",
        romanization: "Moya osnovnaya tsel — uverennee obshchatsya v professionalnoy srede.",
        en: "My main goal is to communicate more confidently in a professional environment.",
        vi: "Mục tiêu chính của tôi là giao tiếp tự tin hơn trong môi trường chuyên nghiệp.",
        pronunciation_focus: ["основная цель = mục tiêu chính", "увереннее là so sánh hơn", "среде là giới cách"],
        pronunciation_focus_en: ["основная цель means main goal", "увереннее is comparative", "среде is prepositional"],
      },
    ],
    vocabulary: [
      {
        word: "позвольте представиться",
        romanization: "pozvolte predstavitsya",
        en: "allow me to introduce myself",
        vi: "cho phép tôi giới thiệu",
        pos: "phrase",
        pronunciation_vi: "pa-ZVOL-tye pryed-STA-vit-sa",
        pronunciation_en: "pa-ZVOL-tye pryed-STA-veet-sa",
      },
      {
        word: "опыт",
        romanization: "opyt",
        en: "experience",
        vi: "kinh nghiệm",
        pos: "noun",
        pronunciation_vi: "O-pưt",
        pronunciation_en: "O-pit",
      },
      {
        word: "на данный момент",
        romanization: "na dannyy moment",
        en: "at the moment",
        vi: "hiện tại",
        pos: "phrase",
        pronunciation_vi: "na DAN-nưi ma-MYENT",
        pronunciation_en: "na DAN-niy ma-MYENT",
      },
      {
        word: "основная цель",
        romanization: "osnovnaya tsel",
        en: "main goal",
        vi: "mục tiêu chính",
        pos: "noun phrase",
        pronunciation_vi: "as-nav-NA-ya TSEL",
        pronunciation_en: "as-nav-NA-ya TSEL",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Cho phép tôi giới thiệu ngắn gọn.", answer: "Позвольте кратко представиться." },
          { prompt: "Hiện tại tôi đang học tiếng Nga để phục vụ công việc.", answer: "На данный момент я изучаю русский язык для работы." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Hoàn thành khung mục tiêu.",
        instruction_en: "Complete the goal frame.",
        items: [{ prompt: "Моя основная _____ — увереннее общаться.", answer: "цель" }],
      },
    ],
    cultural_notes_vi:
      "Người phỏng vấn Nga đánh giá cấu trúc, không phải tốc độ. Một phần giới thiệu rõ bốn bước nghe trưởng thành hơn nhiều câu dài lộn xộn.",
    cultural_notes_en:
      "Russian interviewers value structure over speed. A clear four-step introduction sounds more mature than many disordered long sentences.",
    tip_advice_vi:
      "Học thuộc khung: mở lời + kinh nghiệm + hiện tại + mục tiêu. Khi hồi hộp, khung này giữ bạn không lạc.",
    tip_advice_en:
      "Memorize the frame: opener + background + present + goal. When nervous, the frame keeps you on track.",
  },
  {
    id: "russian_c1_problem_and_solution",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Trình bày vấn đề và đề xuất giải pháp",
    title_en: "C1: Presenting a problem and proposing a solution",
    intro_vi:
      "C1 cần nói nguyên nhân – hệ quả rõ ràng. Khung: vấn đề nằm ở đâu + dẫn đến điều gì + tôi đề xuất + giải pháp cho phép gì.",
    intro_en:
      "C1 needs clear cause and effect. Frame: where the problem lies + what it leads to + I propose + what the solution allows.",
    sentences: [
      {
        russian: "Проблема заключается в том, что инструкции непонятны с первого раза.",
        romanization: "Problema zaklyuchaetsya v tom, chto instruktsii neponyatny s pervogo raza.",
        en: "The problem is that the instructions are unclear the first time.",
        vi: "Vấn đề nằm ở chỗ hướng dẫn khó hiểu ngay từ lần đầu.",
        pronunciation_focus: ["заключается в том, что = nằm ở chỗ", "инструкции số nhiều", "с первого раза = ngay lần đầu"],
        pronunciation_focus_en: ["заключается в том, что means lies in the fact that", "инструкции is plural", "с первого раза means the first time"],
      },
      {
        russian: "Это приводит к ошибкам и задержкам.",
        romanization: "Eto privodit k oshibkam i zaderzhkam.",
        en: "This leads to mistakes and delays.",
        vi: "Điều này dẫn đến lỗi và chậm trễ.",
        pronunciation_focus: ["приводит к + tặng cách", "ошибкам, задержкам là số nhiều tặng cách", "это приводит к = dẫn đến"],
        pronunciation_focus_en: ["приводит к + dative", "ошибкам, задержкам are dative plural", "это приводит к means this leads to"],
      },
      {
        russian: "Я предлагаю давать инструкции письменно и показывать пример.",
        romanization: "Ya predlagayu davat instruktsii pismenno i pokazyvat primer.",
        en: "I propose giving instructions in writing and showing an example.",
        vi: "Tôi đề xuất đưa hướng dẫn bằng văn bản và làm mẫu.",
        pronunciation_focus: ["предлагаю + nguyên mẫu", "письменно = bằng văn bản", "показывать пример = làm mẫu"],
        pronunciation_focus_en: ["предлагаю + infinitive", "письменно means in writing", "показывать пример means to show an example"],
      },
      {
        russian: "Такое решение позволит снизить количество ошибок.",
        romanization: "Takoe reshenie pozvolit snizit kolichestvo oshibok.",
        en: "Such a solution will allow reducing the number of mistakes.",
        vi: "Giải pháp này sẽ cho phép giảm số lượng lỗi.",
        pronunciation_focus: ["такое решение = giải pháp như vậy", "позволит + nguyên mẫu", "снизить количество = giảm số lượng"],
        pronunciation_focus_en: ["такое решение means such a solution", "позволит + infinitive", "снизить количество means reduce the number"],
      },
    ],
    vocabulary: [
      {
        word: "проблема заключается в том, что",
        romanization: "problema zaklyuchaetsya v tom, chto",
        en: "the problem is that",
        vi: "vấn đề nằm ở chỗ",
        pos: "phrase",
        pronunciation_vi: "pra-BLYE-ma za-klyu-CHA-yet-sa f tom chto",
        pronunciation_en: "pra-BLYE-ma za-klyu-CHA-yet-sa f tom shto",
      },
      {
        word: "приводить к",
        romanization: "privodit k",
        en: "to lead to",
        vi: "dẫn đến",
        pos: "verb phrase",
        pronunciation_vi: "pri-va-DIT k",
        pronunciation_en: "pri-va-DEET k",
      },
      {
        word: "предлагать",
        romanization: "predlagat",
        en: "to propose",
        vi: "đề xuất",
        pos: "verb",
        pronunciation_vi: "pryed-la-GAT",
        pronunciation_en: "pryed-la-GAT",
      },
      {
        word: "решение",
        romanization: "reshenie",
        en: "solution / decision",
        vi: "giải pháp / quyết định",
        pos: "noun",
        pronunciation_vi: "rye-SHE-ni-ye",
        pronunciation_en: "rye-SHE-nee-yeh",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Điều này dẫn đến lỗi và chậm trễ.", answer: "Это приводит к ошибкам и задержкам." },
          { prompt: "Giải pháp này sẽ cho phép giảm số lượng lỗi.", answer: "Такое решение позволит снизить количество ошибок." },
        ],
      },
    ],
    cultural_notes_vi:
      "Trong môi trường công việc Nga, nêu vấn đề mà không có đề xuất nghe như than phiền. Luôn gắn `проблема` với `я предлагаю`.",
    cultural_notes_en:
      "In a Russian workplace, naming a problem without a proposal sounds like complaining. Always pair `проблема` with `я предлагаю`.",
    tip_advice_vi:
      "Khung bốn câu: vấn đề + hệ quả + đề xuất + lợi ích. Đây là bộ khung dùng được cho cả nói lẫn viết báo cáo.",
    tip_advice_en:
      "Four-sentence frame: problem + consequence + proposal + benefit. It works for both speaking and report writing.",
  },
  {
    id: "russian_c1_opinion_with_reasons",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Nêu quan điểm có lý lẽ và thứ tự lập luận",
    title_en: "C1: Stating an opinion with ordered reasoning",
    intro_vi:
      "C1 cần sắp xếp lý lẽ: quan điểm + thứ nhất + thứ hai + lưu ý phản biện. Đừng đổ hết ý vào một câu.",
    intro_en:
      "C1 needs ordered reasoning: stance + firstly + secondly + a caveat. Do not dump every idea into one sentence.",
    sentences: [
      {
        russian: "С моей точки зрения, этот подход эффективнее.",
        romanization: "S moey tochki zreniya, etot podkhod effektivnee.",
        en: "From my point of view, this approach is more effective.",
        vi: "Theo quan điểm của tôi, cách tiếp cận này hiệu quả hơn.",
        pronunciation_focus: ["с моей точки зрения = theo quan điểm của tôi", "подход = cách tiếp cận", "эффективнее là so sánh hơn"],
        pronunciation_focus_en: ["с моей точки зрения means from my point of view", "подход means approach", "эффективнее is comparative"],
      },
      {
        russian: "Во-первых, он экономит время.",
        romanization: "Vo-pervykh, on ekonomit vremya.",
        en: "Firstly, it saves time.",
        vi: "Thứ nhất, nó tiết kiệm thời gian.",
        pronunciation_focus: ["во-первых = thứ nhất", "экономит время là collocation", "vremya không đổi ở đối cách"],
        pronunciation_focus_en: ["во-первых means firstly", "экономит время is a collocation", "vremya stays unchanged in accusative"],
      },
      {
        russian: "Во-вторых, его легче объяснить новым сотрудникам.",
        romanization: "Vo-vtorykh, ego legche obyasnit novym sotrudnikam.",
        en: "Secondly, it is easier to explain to new staff.",
        vi: "Thứ hai, dễ giải thích cho nhân viên mới hơn.",
        pronunciation_focus: ["во-вторых = thứ hai", "легче là so sánh hơn của легко", "новым сотрудникам là tặng cách số nhiều"],
        pronunciation_focus_en: ["во-вторых means secondly", "легче is comparative of легко", "новым сотрудникам is dative plural"],
      },
      {
        russian: "Однако важно учитывать стоимость внедрения.",
        romanization: "Odnako vazhno uchityvat stoimost vnedreniya.",
        en: "However, it is important to take the cost of implementation into account.",
        vi: "Tuy nhiên, cần tính đến chi phí triển khai.",
        pronunciation_focus: ["однако = tuy nhiên (trang trọng)", "важно учитывать = cần tính đến", "стоимость внедрения là cụm danh từ"],
        pronunciation_focus_en: ["однако means however (formal)", "важно учитывать means important to consider", "стоимость внедрения is a noun phrase"],
      },
    ],
    vocabulary: [
      {
        word: "с моей точки зрения",
        romanization: "s moey tochki zreniya",
        en: "from my point of view",
        vi: "theo quan điểm của tôi",
        pos: "phrase",
        pronunciation_vi: "s ma-YEY TOCH-ki ZRYE-ni-ya",
        pronunciation_en: "s ma-YEY TOCH-kee ZRYE-nee-ya",
      },
      {
        word: "во-первых",
        romanization: "vo-pervykh",
        en: "firstly",
        vi: "thứ nhất",
        pos: "connector",
        pronunciation_vi: "va-PYER-vưkh",
        pronunciation_en: "va-PYER-vikh",
      },
      {
        word: "однако",
        romanization: "odnako",
        en: "however",
        vi: "tuy nhiên",
        pos: "connector",
        pronunciation_vi: "ad-NA-ka",
        pronunciation_en: "ad-NA-ka",
      },
      {
        word: "учитывать",
        romanization: "uchityvat",
        en: "to take into account",
        vi: "tính đến",
        pos: "verb",
        pronunciation_vi: "u-CHI-tư-vat",
        pronunciation_en: "oo-CHEE-ti-vat",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Theo quan điểm của tôi, cách tiếp cận này hiệu quả hơn.", answer: "С моей точки зрения, этот подход эффективнее." },
          { prompt: "Tuy nhiên, cần tính đến chi phí triển khai.", answer: "Однако важно учитывать стоимость внедрения." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối thứ tự.",
        instruction_en: "Fill in the ordering connector.",
        items: [{ prompt: "_____, он экономит время. (firstly)", answer: "Во-первых" }],
      },
    ],
    cultural_notes_vi:
      "`Однако` trang trọng hơn `но`. Trong tranh luận hoặc thuyết trình C1, dùng `однако` để chuyển sang phản biện nghe học thuật hơn.",
    cultural_notes_en:
      "`Однако` is more formal than `но`. In a C1 debate or presentation, use `однако` to pivot to a caveat for a more academic tone.",
    tip_advice_vi:
      "Đánh số lý lẽ bằng во-первых / во-вторых rồi đóng bằng một lưu ý. Người nghe nhớ ý rõ hơn nhiều.",
    tip_advice_en:
      "Number your reasons with во-первых / во-вторых, then close with a caveat. Listeners retain numbered points far better.",
  },
  {
    id: "russian_c1_polite_disagreement_objections",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Bất đồng lịch sự và xử lý phản biện",
    title_en: "C1: Polite disagreement and handling objections",
    intro_vi:
      "C1 cần phản đối mà không gây căng. Khung: công nhận ý đúng + nêu rủi ro + thừa nhận một phần + đề xuất phương án khác.",
    intro_en:
      "C1 needs to disagree without friction. Frame: acknowledge the valid point + raise a risk + concede partly + propose an alternative.",
    sentences: [
      {
        russian: "Я понимаю вашу позицию, но позвольте не согласиться.",
        romanization: "Ya ponimayu vashu pozitsiyu, no pozvolte ne soglasitsya.",
        en: "I understand your position, but allow me to disagree.",
        vi: "Tôi hiểu quan điểm của bạn, nhưng cho phép tôi không đồng ý.",
        pronunciation_focus: ["понимаю вашу позицию = hiểu quan điểm", "позвольте не согласиться là cụm lịch sự", "согласиться có -ться"],
        pronunciation_focus_en: ["понимаю вашу позицию means I understand your position", "позвольте не согласиться is a polite chunk", "согласиться has -ться"],
      },
      {
        russian: "Мне кажется, здесь есть риск задержки.",
        romanization: "Mne kazhetsya, zdes est risk zaderzhki.",
        en: "It seems to me there is a risk of delay here.",
        vi: "Tôi thấy ở đây có rủi ro chậm trễ.",
        pronunciation_focus: ["мне кажется = tôi thấy (mềm)", "есть риск = có rủi ro", "задержки là sinh cách"],
        pronunciation_focus_en: ["мне кажется means it seems to me", "есть риск means there is a risk", "задержки is genitive"],
      },
      {
        russian: "Это справедливое замечание, тем не менее всё зависит от организации процесса.",
        romanization: "Eto spravedlivoe zamechanie, tem ne menee vsyo zavisit ot organizatsii protsessa.",
        en: "That is a fair remark; nevertheless, everything depends on how the process is organized.",
        vi: "Đó là nhận xét hợp lý, tuy nhiên mọi thứ phụ thuộc vào cách tổ chức quy trình.",
        pronunciation_focus: ["справедливое замечание = nhận xét hợp lý", "тем не менее = tuy nhiên", "зависит от + sinh cách"],
        pronunciation_focus_en: ["справедливое замечание means a fair remark", "тем не менее means nevertheless", "зависит от + genitive"],
      },
      {
        russian: "Можно предложить другой вариант?",
        romanization: "Mozhno predlozhit drugoy variant?",
        en: "May I propose another option?",
        vi: "Tôi có thể đề xuất phương án khác không?",
        pronunciation_focus: ["можно + nguyên mẫu = có thể", "предложить = đề xuất", "другой вариант = phương án khác"],
        pronunciation_focus_en: ["можно + infinitive means may I", "предложить means to propose", "другой вариант means another option"],
      },
    ],
    vocabulary: [
      {
        word: "позвольте не согласиться",
        romanization: "pozvolte ne soglasitsya",
        en: "allow me to disagree",
        vi: "cho phép tôi không đồng ý",
        pos: "phrase",
        pronunciation_vi: "pa-ZVOL-tye nye sa-gla-SIT-sa",
        pronunciation_en: "pa-ZVOL-tye nye sa-gla-SEET-sa",
      },
      {
        word: "мне кажется",
        romanization: "mne kazhetsya",
        en: "it seems to me",
        vi: "tôi thấy / có vẻ",
        pos: "phrase",
        pronunciation_vi: "mnye KA-zhet-sa",
        pronunciation_en: "mnye KA-zhet-sa",
      },
      {
        word: "тем не менее",
        romanization: "tem ne menee",
        en: "nevertheless",
        vi: "tuy nhiên / dù vậy",
        pos: "connector",
        pronunciation_vi: "tyem nye MYE-nye-ye",
        pronunciation_en: "tyem nye MYE-nye-yeh",
      },
      {
        word: "зависеть от",
        romanization: "zaviset ot",
        en: "to depend on",
        vi: "phụ thuộc vào",
        pos: "verb phrase",
        pronunciation_vi: "za-VI-syet at",
        pronunciation_en: "za-VEE-syet at",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi hiểu quan điểm của bạn, nhưng cho phép tôi không đồng ý.", answer: "Я понимаю вашу позицию, но позвольте не согласиться." },
          { prompt: "Tôi có thể đề xuất phương án khác không?", answer: "Можно предложить другой вариант?" },
        ],
      },
    ],
    cultural_notes_vi:
      "Mẫu C1 cho phản biện: công nhận (`справедливое замечание`) rồi giới hạn (`тем не менее`). Phản đối thẳng không đệm nghe cứng trong họp Nga.",
    cultural_notes_en:
      "The C1 objection pattern is concede (`справедливое замечание`) then limit (`тем не менее`). Flat disagreement with no buffer sounds harsh in Russian meetings.",
    tip_advice_vi:
      "Đừng phản đối ngay. Một câu công nhận trước khi `тем не менее` giúp giữ quan hệ làm việc.",
    tip_advice_en:
      "Do not object immediately. One sentence of acknowledgement before `тем не менее` protects the working relationship.",
  },
  {
    id: "russian_c1_professional_apology_delay",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Xin lỗi chuyên nghiệp và giải thích chậm trễ",
    title_en: "C1: Professional apology and explaining a delay",
    intro_vi:
      "C1 nghề nghiệp cần nhận trách nhiệm mà không phòng thủ. Khung: xin lỗi + lý do trung tính + hành động sửa + biện pháp tránh lặp lại.",
    intro_en:
      "Professional C1 needs to take responsibility without being defensive. Frame: apology + neutral reason + corrective action + prevention.",
    sentences: [
      {
        russian: "Приношу извинения за ошибку в отчёте.",
        romanization: "Prinoshu izvineniya za oshibku v otchyote.",
        en: "I apologize for the mistake in the report.",
        vi: "Tôi xin lỗi vì lỗi trong báo cáo.",
        pronunciation_focus: ["приношу извинения là cụm trang trọng", "за ошибку = vì lỗi (đối cách)", "в отчёте có ё nhấn"],
        pronunciation_focus_en: ["приношу извинения is a formal chunk", "за ошибку means for the mistake (accusative)", "в отчёте has stressed ё"],
      },
      {
        russian: "Задержка произошла из-за того, что документы пришли позже.",
        romanization: "Zaderzhka proizoshla iz-za togo, chto dokumenty prishli pozzhe.",
        en: "The delay happened because the documents arrived later.",
        vi: "Sự chậm trễ xảy ra vì tài liệu đến muộn hơn.",
        pronunciation_focus: ["задержка произошла = chậm trễ xảy ra", "из-за того, что = vì lý do rằng", "позже = muộn hơn"],
        pronunciation_focus_en: ["задержка произошла means the delay happened", "из-за того, что means because of the fact that", "позже means later"],
      },
      {
        russian: "Я уже исправляю документ и отправлю новую версию сегодня.",
        romanization: "Ya uzhe ispravlyayu dokument i otpravlyu novuyu versiyu segodnya.",
        en: "I am already correcting the document and will send the new version today.",
        vi: "Tôi đang sửa tài liệu và sẽ gửi bản mới hôm nay.",
        pronunciation_focus: ["уже исправляю = đang sửa rồi", "отправлю là tương lai hoàn thành", "новую версию là đối cách"],
        pronunciation_focus_en: ["уже исправляю means already correcting", "отправлю is perfective future", "новую версию is accusative"],
      },
      {
        russian: "Чтобы избежать повторения, я буду проверять файлы заранее.",
        romanization: "Chtoby izbezhat povtoreniya, ya budu proveryat fayly zaranee.",
        en: "To avoid a repeat, I will check files in advance.",
        vi: "Để tránh lặp lại, tôi sẽ kiểm tra tệp trước.",
        pronunciation_focus: ["чтобы избежать = để tránh", "повторения là sinh cách", "буду проверять là tương lai chưa hoàn thành"],
        pronunciation_focus_en: ["чтобы избежать means to avoid", "повторения is genitive", "буду проверять is imperfective future"],
      },
    ],
    vocabulary: [
      {
        word: "приношу извинения",
        romanization: "prinoshu izvineniya",
        en: "I apologize (formal)",
        vi: "tôi xin lỗi (trang trọng)",
        pos: "phrase",
        pronunciation_vi: "pri-na-SHU iz-vi-NYE-ni-ya",
        pronunciation_en: "pri-na-SHOO iz-vi-NYE-nee-ya",
      },
      {
        word: "из-за того, что",
        romanization: "iz-za togo, chto",
        en: "because of the fact that",
        vi: "vì lý do rằng",
        pos: "phrase",
        pronunciation_vi: "iz-za ta-VO chto",
        pronunciation_en: "iz-za ta-VO shto",
      },
      {
        word: "исправлять",
        romanization: "ispravlyat",
        en: "to correct / fix",
        vi: "sửa",
        pos: "verb",
        pronunciation_vi: "is-prav-LYAT",
        pronunciation_en: "is-prav-LYAT",
      },
      {
        word: "избежать повторения",
        romanization: "izbezhat povtoreniya",
        en: "to avoid a repeat",
        vi: "tránh lặp lại",
        pos: "verb phrase",
        pronunciation_vi: "iz-bye-ZHAT pav-ta-RYE-ni-ya",
        pronunciation_en: "iz-bye-ZHAT pav-ta-RYE-nee-ya",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi xin lỗi vì lỗi trong báo cáo.", answer: "Приношу извинения за ошибку в отчёте." },
          { prompt: "Để tránh lặp lại, tôi sẽ kiểm tra tệp trước.", answer: "Чтобы избежать повторения, я буду проверять файлы заранее." },
        ],
      },
    ],
    cultural_notes_vi:
      "Xin lỗi chuyên nghiệp Nga ngắn gọn: một câu nhận trách nhiệm là đủ. Giải thích dài, biện minh nhiều nghe như đổ lỗi.",
    cultural_notes_en:
      "A Russian professional apology is brief: one sentence of responsibility is enough. Long, over-justified explanations sound like blame-shifting.",
    tip_advice_vi:
      "Bốn nhịp: xin lỗi → lý do trung tính → đang sửa → cách phòng ngừa. Tránh nói `это не моя вина`.",
    tip_advice_en:
      "Four beats: apologize → neutral reason → fixing it → prevention. Avoid saying `это не моя вина` (it's not my fault).",
  },
  {
    id: "russian_c1_repair_and_extension_frames",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Câu sửa chữa và kéo dài ý khi nói",
    title_en: "C1: Repair and extension frames while speaking",
    intro_vi:
      "Ở C1, không phải nói nhanh nhất mà giữ nhịp khi bí từ. Các câu sửa chữa giúp bạn câu giờ, làm rõ, mở rộng và tóm lại mà không đứng hình.",
    intro_en:
      "At C1, the goal is not maximum speed but keeping rhythm when stuck. Repair frames let you buy time, clarify, extend, and conclude without freezing.",
    sentences: [
      {
        russian: "Сейчас попробую сформулировать точнее.",
        romanization: "Seychas poprobuyu sformulirovat tochnee.",
        en: "Let me try to phrase it more precisely now.",
        vi: "Để tôi thử diễn đạt chính xác hơn.",
        pronunciation_focus: ["попробую là tương lai = sẽ thử", "сформулировать = diễn đạt", "точнее = chính xác hơn"],
        pronunciation_focus_en: ["попробую is future, I will try", "сформулировать means to formulate", "точнее means more precisely"],
      },
      {
        russian: "Я имею в виду не это, а другое.",
        romanization: "Ya imeyu v vidu ne eto, a drugoe.",
        en: "I do not mean this, but something else.",
        vi: "Ý tôi không phải vậy, mà là điều khác.",
        pronunciation_focus: ["иметь в виду = ý là", "не это, а другое là cấu trúc đối lập", "а = mà (đối lập)"],
        pronunciation_focus_en: ["иметь в виду means to mean", "не это, а другое is a contrast structure", "а means but/rather"],
      },
      {
        russian: "Если развить эту мысль, можно добавить пример.",
        romanization: "Esli razvit etu mysl, mozhno dobavit primer.",
        en: "If I develop this idea, I can add an example.",
        vi: "Nếu phát triển ý này, có thể thêm một ví dụ.",
        pronunciation_focus: ["если развить эту мысль = nếu phát triển ý này", "развить = phát triển", "добавить пример = thêm ví dụ"],
        pronunciation_focus_en: ["если развить эту мысль means if I develop this idea", "развить means to develop", "добавить пример means to add an example"],
      },
      {
        russian: "Если подытожить, главное — это ясная структура.",
        romanization: "Esli podytozhit, glavnoe — eto yasnaya struktura.",
        en: "To sum up, the main thing is a clear structure.",
        vi: "Nếu tóm lại, điều chính là cấu trúc rõ ràng.",
        pronunciation_focus: ["если подытожить = nếu tóm lại", "главное — это = điều chính là", "ясная структура = cấu trúc rõ"],
        pronunciation_focus_en: ["если подытожить means to sum up", "главное — это means the main thing is", "ясная структура means clear structure"],
      },
    ],
    vocabulary: [
      {
        word: "сформулировать точнее",
        romanization: "sformulirovat tochnee",
        en: "to phrase more precisely",
        vi: "diễn đạt chính xác hơn",
        pos: "verb phrase",
        pronunciation_vi: "sfar-mu-LI-ra-vat tach-NYE-ye",
        pronunciation_en: "sfar-moo-LEE-ra-vat tach-NYE-yeh",
      },
      {
        word: "иметь в виду",
        romanization: "imet v vidu",
        en: "to mean",
        vi: "có ý là",
        pos: "verb phrase",
        pronunciation_vi: "i-MYET v vi-DU",
        pronunciation_en: "ee-MYET v vee-DOO",
      },
      {
        word: "развить мысль",
        romanization: "razvit mysl",
        en: "to develop an idea",
        vi: "phát triển ý",
        pos: "verb phrase",
        pronunciation_vi: "raz-VIT mưsl",
        pronunciation_en: "raz-VEET misl",
      },
      {
        word: "подытожить",
        romanization: "podytozhit",
        en: "to sum up",
        vi: "tóm lại",
        pos: "verb",
        pronunciation_vi: "pa-dư-TO-zhit",
        pronunciation_en: "pa-di-TO-zhit",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Ý tôi không phải vậy, mà là điều khác.", answer: "Я имею в виду не это, а другое." },
          { prompt: "Nếu tóm lại, điều chính là cấu trúc rõ ràng.", answer: "Если подытожить, главное — это ясная структура." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền câu câu giờ khi đang nghĩ.",
        instruction_en: "Fill in the time-buying frame.",
        items: [{ prompt: "Сейчас попробую _____ точнее.", answer: "сформулировать" }],
      },
    ],
    cultural_notes_vi:
      "Người Nga nghe C1 không kỳ vọng bạn hoàn hảo, mà kỳ vọng bạn tự sửa được. Câu `я имею в виду...` cho thấy bạn kiểm soát ý.",
    cultural_notes_en:
      "Russian listeners at C1 do not expect perfection; they expect self-repair. `я имею в виду...` shows you control your meaning.",
    tip_advice_vi:
      "Học thuộc 4 câu này như phản xạ: câu giờ, làm rõ, mở rộng, tóm lại. Chúng cứu bạn trong mọi phần thi nói.",
    tip_advice_en:
      "Drill these four as reflexes: buy time, clarify, extend, conclude. They rescue you in any speaking exam part.",
  },
  {
    id: "russian_c1_essay_balanced_argument",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Khung bài luận cân bằng (một mặt / mặt khác)",
    title_en: "C1: Balanced essay frame (one side / the other)",
    intro_vi:
      "Bài luận C1 không nói `tốt` hay `xấu` một chiều. Khung: giới thiệu chủ đề + một mặt + mặt khác + quan điểm + kết luận như vậy.",
    intro_en:
      "A C1 essay avoids one-sided `good` or `bad`. Frame: introduce topic + one side + the other side + your view + a `thus` conclusion.",
    sentences: [
      {
        russian: "В последние годы всё чаще обсуждается вопрос о влиянии технологий.",
        romanization: "V poslednie gody vsyo chashche obsuzhdaetsya vopros o vliyanii tekhnologiy.",
        en: "In recent years, the question of the influence of technology is discussed ever more often.",
        vi: "Những năm gần đây, vấn đề ảnh hưởng của công nghệ ngày càng được thảo luận nhiều.",
        pronunciation_focus: ["всё чаще = ngày càng nhiều", "обсуждается вопрос là cụm thụ động", "о влиянии + sinh cách"],
        pronunciation_focus_en: ["всё чаще means ever more often", "обсуждается вопрос is a passive chunk", "о влиянии + genitive"],
      },
      {
        russian: "С одной стороны, технологии ускоряют работу.",
        romanization: "S odnoy storony, tekhnologii uskoryayut rabotu.",
        en: "On one hand, technology speeds up work.",
        vi: "Một mặt, công nghệ giúp công việc nhanh hơn.",
        pronunciation_focus: ["с одной стороны = một mặt", "ускоряют = tăng tốc", "работу là đối cách"],
        pronunciation_focus_en: ["с одной стороны means on one hand", "ускоряют means speed up", "работу is accusative"],
      },
      {
        russian: "С другой стороны, постоянные уведомления снижают концентрацию.",
        romanization: "S drugoy storony, postoyannye uvedomleniya snizhayut kontsentratsiyu.",
        en: "On the other hand, constant notifications reduce concentration.",
        vi: "Mặt khác, thông báo liên tục làm giảm sự tập trung.",
        pronunciation_focus: ["с другой стороны = mặt khác", "уведомления = thông báo", "снижают концентрацию là collocation"],
        pronunciation_focus_en: ["с другой стороны means on the other hand", "уведомления means notifications", "снижают концентрацию is a collocation"],
      },
      {
        russian: "Таким образом, всё зависит от культуры использования.",
        romanization: "Takim obrazom, vsyo zavisit ot kultury ispolzovaniya.",
        en: "Thus, everything depends on the culture of use.",
        vi: "Như vậy, mọi thứ phụ thuộc vào cách sử dụng.",
        pronunciation_focus: ["таким образом = như vậy (kết luận)", "зависит от + sinh cách", "культуры использования là cụm danh từ"],
        pronunciation_focus_en: ["таким образом means thus", "зависит от + genitive", "культуры использования is a noun phrase"],
      },
    ],
    vocabulary: [
      {
        word: "обсуждается вопрос о",
        romanization: "obsuzhdaetsya vopros o",
        en: "the question of ... is discussed",
        vi: "vấn đề về ... được thảo luận",
        pos: "phrase",
        pronunciation_vi: "ab-suzh-DA-yet-sa va-PROS a",
        pronunciation_en: "ab-suzh-DA-yet-sa va-PROS a",
      },
      {
        word: "с одной стороны",
        romanization: "s odnoy storony",
        en: "on one hand",
        vi: "một mặt",
        pos: "connector",
        pronunciation_vi: "s ad-NOY sta-ra-NƯ",
        pronunciation_en: "s ad-NOY sta-ra-NI",
      },
      {
        word: "с другой стороны",
        romanization: "s drugoy storony",
        en: "on the other hand",
        vi: "mặt khác",
        pos: "connector",
        pronunciation_vi: "s dru-GOY sta-ra-NƯ",
        pronunciation_en: "s droo-GOY sta-ra-NI",
      },
      {
        word: "таким образом",
        romanization: "takim obrazom",
        en: "thus / in this way",
        vi: "như vậy",
        pos: "connector",
        pronunciation_vi: "ta-KIM O-bra-zam",
        pronunciation_en: "ta-KEEM O-bra-zam",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Một mặt, công nghệ giúp công việc nhanh hơn.", answer: "С одной стороны, технологии ускоряют работу." },
          { prompt: "Như vậy, mọi thứ phụ thuộc vào cách sử dụng.", answer: "Таким образом, всё зависит от культуры использования." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cặp từ nối đối lập.",
        instruction_en: "Fill in the contrast connector.",
        items: [{ prompt: "С одной стороны... С _____ стороны...", answer: "другой" }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt hay lập luận vòng và mềm. Bài luận Nga C1 cần khung rõ: giới thiệu → một mặt → mặt khác → quan điểm → kết luận.",
    cultural_notes_en:
      "Vietnamese often argues in a soft, circular way. A C1 Russian essay needs a clear frame: intro → one side → other side → view → conclusion.",
    tip_advice_vi:
      "Tránh từ tuyệt đối (`всегда`, `никогда`). Câu `ни абсолютным благом, ни абсолютной угрозой` cho giọng cân bằng học thuật.",
    tip_advice_en:
      "Avoid absolutes (`always`, `never`). `ни абсолютным благом, ни абсолютной угрозой` (neither pure good nor pure threat) gives a balanced academic tone.",
  },
  {
    id: "russian_c1_report_structure",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Cấu trúc báo cáo (mục đích → vấn đề → nguyên nhân → khuyến nghị)",
    title_en: "C1: Report structure (purpose → problem → cause → recommendation)",
    intro_vi:
      "Báo cáo C1 phải trung tính, không cảm xúc. Khung: nêu mục đích + vấn đề chính + nguyên nhân + khuyến nghị có ích.",
    intro_en:
      "A C1 report must be neutral, not emotional. Frame: state the purpose + the main problem + the cause + a useful recommendation.",
    sentences: [
      {
        russian: "Цель данного отчёта — проанализировать причины проблемы.",
        romanization: "Tsel dannogo otchyota — proanalizirovat prichiny problemy.",
        en: "The purpose of this report is to analyze the causes of the problem.",
        vi: "Mục đích của báo cáo này là phân tích nguyên nhân của vấn đề.",
        pronunciation_focus: ["цель данного отчёта = mục đích báo cáo này", "проанализировать = phân tích", "причины проблемы là sinh cách"],
        pronunciation_focus_en: ["цель данного отчёта means the purpose of this report", "проанализировать means to analyze", "причины проблемы is genitive"],
      },
      {
        russian: "Основная трудность заключается в отсутствии единого порядка.",
        romanization: "Osnovnaya trudnost zaklyuchaetsya v otsutstvii edinogo poryadka.",
        en: "The main difficulty lies in the absence of a unified procedure.",
        vi: "Khó khăn chính nằm ở việc thiếu một quy trình thống nhất.",
        pronunciation_focus: ["основная трудность = khó khăn chính", "в отсутствии = ở việc thiếu", "единого порядка là sinh cách"],
        pronunciation_focus_en: ["основная трудность means the main difficulty", "в отсутствии means in the absence of", "единого порядка is genitive"],
      },
      {
        russian: "Анализ показывает, что проблема связана с нагрузкой на персонал.",
        romanization: "Analiz pokazyvaet, chto problema svyazana s nagruzkoy na personal.",
        en: "The analysis shows that the problem is connected with the workload on staff.",
        vi: "Phân tích cho thấy vấn đề liên quan đến áp lực công việc lên nhân sự.",
        pronunciation_focus: ["анализ показывает = phân tích cho thấy", "связана с + công cụ cách", "нагрузка на персонал = áp lực lên nhân sự"],
        pronunciation_focus_en: ["анализ показывает means the analysis shows", "связана с + instrumental", "нагрузка на персонал means workload on staff"],
      },
      {
        russian: "Рекомендуется ввести единые письменные инструкции.",
        romanization: "Rekomenduetsya vvesti edinye pismennye instruktsii.",
        en: "It is recommended to introduce unified written instructions.",
        vi: "Khuyến nghị đưa vào các hướng dẫn bằng văn bản thống nhất.",
        pronunciation_focus: ["рекомендуется là thụ động trang trọng", "ввести = đưa vào", "единые письменные инструкции = hướng dẫn thống nhất"],
        pronunciation_focus_en: ["рекомендуется is a formal passive", "ввести means to introduce", "единые письменные инструкции means unified written instructions"],
      },
    ],
    vocabulary: [
      {
        word: "цель данного отчёта",
        romanization: "tsel dannogo otchyota",
        en: "the purpose of this report",
        vi: "mục đích của báo cáo này",
        pos: "phrase",
        pronunciation_vi: "TSEL DAN-na-va at-CHYO-ta",
        pronunciation_en: "TSEL DAN-na-va at-CHYO-ta",
      },
      {
        word: "заключаться в",
        romanization: "zaklyuchatsya v",
        en: "to lie in / consist in",
        vi: "nằm ở",
        pos: "verb phrase",
        pronunciation_vi: "za-klyu-CHAT-sa v",
        pronunciation_en: "za-klyu-CHAT-sa v",
      },
      {
        word: "анализ показывает",
        romanization: "analiz pokazyvaet",
        en: "the analysis shows",
        vi: "phân tích cho thấy",
        pos: "phrase",
        pronunciation_vi: "a-NA-liz pa-KA-zư-va-yet",
        pronunciation_en: "a-NA-leez pa-KA-zi-va-yet",
      },
      {
        word: "рекомендуется",
        romanization: "rekomenduetsya",
        en: "it is recommended",
        vi: "khuyến nghị",
        pos: "verb (impersonal)",
        pronunciation_vi: "rye-ka-myen-DU-yet-sa",
        pronunciation_en: "rye-ka-myen-DOO-yet-sa",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Mục đích của báo cáo này là phân tích nguyên nhân của vấn đề.", answer: "Цель данного отчёта — проанализировать причины проблемы." },
          { prompt: "Khuyến nghị đưa vào các hướng dẫn bằng văn bản thống nhất.", answer: "Рекомендуется ввести единые письменные инструкции." },
        ],
      },
    ],
    cultural_notes_vi:
      "Đừng viết `менеджер плохой` (sếp tệ). Báo cáo Nga dùng cách trung tính: `отсутствует единый порядок передачи информации`.",
    cultural_notes_en:
      "Do not write `the manager is bad`. A Russian report uses a neutral framing: `there is no unified procedure for passing information`.",
    tip_advice_vi:
      "Dùng cấu trúc thụ động/vô nhân xưng (`рекомендуется`, `заключается в том, что`) để giữ giọng khách quan.",
    tip_advice_en:
      "Use passive/impersonal structures (`рекомендуется`, `заключается в том, что`) to keep an objective tone.",
  },
  {
    id: "russian_c1_argument_concession_rebuttal",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Bài nghị luận — lập trường, nhượng bộ, phản bác",
    title_en: "C1: Argument writing — stance, concession, rebuttal",
    intro_vi:
      "Khác bài luận cân bằng, bài nghị luận bảo vệ một lập trường. Khung: nêu lập trường sớm + lý lẽ chính + thừa nhận phía kia + giới hạn nó + kết luận.",
    intro_en:
      "Unlike a balanced essay, an argument defends one stance. Frame: state the stance early + main reason + concede the other side + limit it + conclude.",
    sentences: [
      {
        russian: "Я считаю, что обучение безопасности должно быть обязательным.",
        romanization: "Ya schitayu, chto obuchenie bezopasnosti dolzhno byt obyazatelnym.",
        en: "I believe that safety training should be mandatory.",
        vi: "Tôi cho rằng đào tạo an toàn phải là bắt buộc.",
        pronunciation_focus: ["я считаю, что = tôi cho rằng", "обучение безопасности = đào tạo an toàn", "обязательным là công cụ cách"],
        pronunciation_focus_en: ["я считаю, что means I believe that", "обучение безопасности means safety training", "обязательным is instrumental"],
      },
      {
        russian: "Главный аргумент заключается в том, что ошибки опасны.",
        romanization: "Glavnyy argument zaklyuchaetsya v tom, chto oshibki opasny.",
        en: "The main argument is that mistakes are dangerous.",
        vi: "Lập luận chính là lỗi thì nguy hiểm.",
        pronunciation_focus: ["главный аргумент = lập luận chính", "заключается в том, что = nằm ở chỗ", "опасны = nguy hiểm (ngắn)"],
        pronunciation_focus_en: ["главный аргумент means the main argument", "заключается в том, что means lies in the fact that", "опасны is a short-form adjective"],
      },
      {
        russian: "Конечно, опытные работники знают правила, однако каждое место имеет свои риски.",
        romanization: "Konechno, opytnye rabotniki znayut pravila, odnako kazhdoe mesto imeet svoi riski.",
        en: "Of course, experienced workers know the rules, but every site has its own risks.",
        vi: "Tất nhiên, công nhân giàu kinh nghiệm biết quy tắc, song mỗi nơi có rủi ro riêng.",
        pronunciation_focus: ["конечно = tất nhiên (nhượng bộ)", "однако = song/tuy nhiên", "свои риски = rủi ro riêng"],
        pronunciation_focus_en: ["конечно means of course (concession)", "однако means however", "свои риски means its own risks"],
      },
      {
        russian: "Поэтому обучение следует рассматривать как базовое условие работы.",
        romanization: "Poetomu obuchenie sleduet rassmatrivat kak bazovoe uslovie raboty.",
        en: "Therefore, training should be regarded as a basic condition of work.",
        vi: "Vì vậy, cần xem đào tạo như một điều kiện cơ bản của công việc.",
        pronunciation_focus: ["следует рассматривать как = cần xem như", "базовое условие = điều kiện cơ bản", "поэтому = vì vậy"],
        pronunciation_focus_en: ["следует рассматривать как means should be regarded as", "базовое условие means basic condition", "поэтому means therefore"],
      },
    ],
    vocabulary: [
      {
        word: "я считаю, что",
        romanization: "ya schitayu, chto",
        en: "I believe that",
        vi: "tôi cho rằng",
        pos: "phrase",
        pronunciation_vi: "ya shchi-TA-yu chto",
        pronunciation_en: "ya shchee-TA-yu shto",
      },
      {
        word: "главный аргумент",
        romanization: "glavnyy argument",
        en: "the main argument",
        vi: "lập luận chính",
        pos: "noun phrase",
        pronunciation_vi: "GLAV-nưi ar-gu-MYENT",
        pronunciation_en: "GLAV-niy ar-goo-MYENT",
      },
      {
        word: "следует рассматривать как",
        romanization: "sleduet rassmatrivat kak",
        en: "should be regarded as",
        vi: "cần được xem như",
        pos: "phrase",
        pronunciation_vi: "SLYE-du-yet ras-MA-tri-vat kak",
        pronunciation_en: "SLYE-doo-yet ras-MA-tree-vat kak",
      },
      {
        word: "условие",
        romanization: "uslovie",
        en: "condition",
        vi: "điều kiện",
        pos: "noun",
        pronunciation_vi: "us-LO-vi-ye",
        pronunciation_en: "oos-LO-vee-yeh",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi cho rằng đào tạo an toàn phải là bắt buộc.", answer: "Я считаю, что обучение безопасности должно быть обязательным." },
          { prompt: "Vì vậy, cần xem đào tạo như một điều kiện cơ bản của công việc.", answer: "Поэтому обучение следует рассматривать как базовое условие работы." },
        ],
      },
    ],
    cultural_notes_vi:
      "Lập luận C1 chín chắn thừa nhận lý lẽ phía kia (`конечно...`) rồi giới hạn (`однако...`). Bỏ qua phản biện làm bài nghe non.",
    cultural_notes_en:
      "A mature C1 argument concedes the other side (`конечно...`) then limits it (`однако...`). Ignoring counterpoints makes the essay sound immature.",
    tip_advice_vi:
      "Nêu lập trường ở câu đầu. Đừng giấu quan điểm đến cuối như văn nói tiếng Việt thường làm.",
    tip_advice_en:
      "State your stance in the first sentence. Do not hide your view until the end, as spoken Vietnamese often does.",
  },
  {
    id: "russian_c1_analysis_mechanism",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Viết phân tích — giải thích cơ chế, không chỉ kết quả",
    title_en: "C1: Analytical writing — explain the mechanism, not just the result",
    intro_vi:
      "Phân tích C1 phá một giả định đơn giản và giải thích cơ chế. Khung: không phải vì X, mà vì Y + nguyên nhân thứ hai + do đó.",
    intro_en:
      "C1 analysis breaks a simple assumption and explains the mechanism. Frame: not because of X but because of Y + a second cause + therefore.",
    sentences: [
      {
        russian: "Взрослые прекращают учёбу не из-за нехватки способностей.",
        romanization: "Vzroslye prekrashchayut uchyobu ne iz-za nekhvatki sposobnostey.",
        en: "Adults stop studying not because of a lack of ability.",
        vi: "Người lớn bỏ học không phải vì thiếu năng khiếu.",
        pronunciation_focus: ["не из-за нехватки = không phải vì thiếu", "способностей là sinh cách số nhiều", "прекращают учёбу = bỏ việc học"],
        pronunciation_focus_en: ["не из-за нехватки means not because of a lack", "способностей is genitive plural", "прекращают учёбу means stop studying"],
      },
      {
        russian: "Основная причина состоит в том, что обучение не встроено в жизнь.",
        romanization: "Osnovnaya prichina sostoit v tom, chto obuchenie ne vstroeno v zhizn.",
        en: "The main cause is that the learning is not built into daily life.",
        vi: "Nguyên nhân chính là việc học không gắn vào đời sống.",
        pronunciation_focus: ["причина состоит в том, что = nguyên nhân là", "встроено в жизнь = gắn vào đời sống", "обучение = việc học"],
        pronunciation_focus_en: ["причина состоит в том, что means the cause is that", "встроено в жизнь means built into life", "обучение means learning"],
      },
      {
        russian: "Вторая причина связана с неправильными ожиданиями.",
        romanization: "Vtoraya prichina svyazana s nepravilnymi ozhidaniyami.",
        en: "The second cause is connected with wrong expectations.",
        vi: "Nguyên nhân thứ hai liên quan đến kỳ vọng sai.",
        pronunciation_focus: ["вторая причина = nguyên nhân thứ hai", "связана с + công cụ cách", "ожиданиями kết thúc -ями"],
        pronunciation_focus_en: ["вторая причина means the second cause", "связана с + instrumental", "ожиданиями ends in -ями"],
      },
      {
        russian: "Таким образом, устойчивость важнее интенсивности.",
        romanization: "Takim obrazom, ustoychivost vazhnee intensivnosti.",
        en: "Thus, consistency matters more than intensity.",
        vi: "Như vậy, sự bền bỉ quan trọng hơn cường độ.",
        pronunciation_focus: ["устойчивость = sự bền bỉ", "важнее = quan trọng hơn", "интенсивности là sinh cách"],
        pronunciation_focus_en: ["устойчивость means consistency", "важнее means more important", "интенсивности is genitive"],
      },
    ],
    vocabulary: [
      {
        word: "причина состоит в том, что",
        romanization: "prichina sostoit v tom, chto",
        en: "the cause is that",
        vi: "nguyên nhân là",
        pos: "phrase",
        pronunciation_vi: "pri-CHI-na sas-ta-IT f tom chto",
        pronunciation_en: "pri-CHEE-na sas-ta-EET f tom shto",
      },
      {
        word: "не из-за... , а из-за...",
        romanization: "ne iz-za..., a iz-za...",
        en: "not because of..., but because of...",
        vi: "không phải vì..., mà vì...",
        pos: "structure",
        pronunciation_vi: "nye iz-za... a iz-za...",
        pronunciation_en: "nye iz-za... a iz-za...",
      },
      {
        word: "ожидания",
        romanization: "ozhidaniya",
        en: "expectations",
        vi: "kỳ vọng",
        pos: "noun (plural)",
        pronunciation_vi: "a-zhi-DA-ni-ya",
        pronunciation_en: "a-zhee-DA-nee-ya",
      },
      {
        word: "устойчивость",
        romanization: "ustoychivost",
        en: "consistency / sustainability",
        vi: "sự bền bỉ",
        pos: "noun",
        pronunciation_vi: "us-TOY-chi-vast",
        pronunciation_en: "oos-TOY-chee-vast",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Nguyên nhân chính là việc học không gắn vào đời sống.", answer: "Основная причина состоит в том, что обучение не встроено в жизнь." },
          { prompt: "Như vậy, sự bền bỉ quan trọng hơn cường độ.", answer: "Таким образом, устойчивость важнее интенсивности." },
        ],
      },
    ],
    cultural_notes_vi:
      "Phân tích tốt nâng từ vựng lên mức trừu tượng: `диагностическая функция`, `ошибка как данные`. Đây là chiều sâu mà giám khảo C1 tìm.",
    cultural_notes_en:
      "Good analysis lifts vocabulary to an abstract level: `diagnostic function`, `mistake as data`. This is the depth C1 examiners look for.",
    tip_advice_vi:
      "Mở bài phân tích bằng `не из-за..., а из-за...` để phá giả định đơn giản ngay từ đầu.",
    tip_advice_en:
      "Open an analysis with `not because of..., but because of...` to break the simple assumption right away.",
  },
  {
    id: "russian_c1_register_and_formality",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Register và mức trang trọng (ты/вы, nói giảm)",
    title_en: "C1: Register and formality (ты/вы, softening)",
    intro_vi:
      "C1 là chọn đúng mức trang trọng, không phải luôn formal. Khung: chọn вы khi xa lạ/khác vai + dùng câu mềm + tránh suồng sã ở văn bản chính thức.",
    intro_en:
      "C1 is choosing the right register, not always being formal. Frame: use вы with strangers/unequal roles + soften requests + avoid familiarity in official texts.",
    sentences: [
      {
        russian: "В официальной ситуации лучше обращаться на «вы».",
        romanization: "V ofitsialnoy situatsii luchshe obrashchatsya na «vy».",
        en: "In a formal situation it is better to address people with «вы».",
        vi: "Trong tình huống chính thức, nên xưng hô bằng «вы».",
        pronunciation_focus: ["официальная ситуация = tình huống chính thức", "обращаться на «вы» = xưng hô bằng вы", "лучше = nên/tốt hơn"],
        pronunciation_focus_en: ["официальная ситуация means a formal situation", "обращаться на «вы» means to address with вы", "лучше means better"],
      },
      {
        russian: "Не могли бы вы уточнить этот момент?",
        romanization: "Ne mogli by vy utochnit etot moment?",
        en: "Could you clarify this point?",
        vi: "Bạn có thể làm rõ điểm này không?",
        pronunciation_focus: ["не могли бы вы = câu xin lịch sự nhất", "уточнить = làm rõ", "этот момент = điểm này"],
        pronunciation_focus_en: ["не могли бы вы is the most polite request", "уточнить means to clarify", "этот момент means this point"],
      },
      {
        russian: "Формальный стиль помогает показать уважение и обозначить границы.",
        romanization: "Formalnyy stil pomogaet pokazat uvazhenie i oboznachit granitsy.",
        en: "A formal style helps to show respect and mark boundaries.",
        vi: "Văn phong trang trọng giúp thể hiện sự tôn trọng và đặt ranh giới.",
        pronunciation_focus: ["формальный стиль = văn phong trang trọng", "показать уважение là collocation", "обозначить границы = đặt ranh giới"],
        pronunciation_focus_en: ["формальный стиль means formal style", "показать уважение is a collocation", "обозначить границы means to mark boundaries"],
      },
      {
        russian: "Проблема не в формальности, а в неумении выбрать нужный уровень.",
        romanization: "Problema ne v formalnosti, a v neumenii vybrat nuzhnyy uroven.",
        en: "The problem is not formality itself but the inability to choose the right level.",
        vi: "Vấn đề không phải ở sự trang trọng, mà ở việc không biết chọn đúng mức.",
        pronunciation_focus: ["не в..., а в... = không ở..., mà ở...", "неумение выбрать = không biết chọn", "нужный уровень = mức cần thiết"],
        pronunciation_focus_en: ["не в..., а в... means not in..., but in...", "неумение выбрать means inability to choose", "нужный уровень means the right level"],
      },
    ],
    vocabulary: [
      {
        word: "обращаться на «вы»",
        romanization: "obrashchatsya na «vy»",
        en: "to address someone formally (with вы)",
        vi: "xưng hô trang trọng (bằng вы)",
        pos: "verb phrase",
        pronunciation_vi: "ab-ra-SHCHAT-sa na vư",
        pronunciation_en: "ab-ra-SHCHAT-sa na vi",
      },
      {
        word: "не могли бы вы",
        romanization: "ne mogli by vy",
        en: "could you (very polite)",
        vi: "bạn có thể... được không (rất lịch sự)",
        pos: "phrase",
        pronunciation_vi: "nye mag-LI bư vư",
        pronunciation_en: "nye mag-LEE bi vi",
      },
      {
        word: "показать уважение",
        romanization: "pokazat uvazhenie",
        en: "to show respect",
        vi: "thể hiện sự tôn trọng",
        pos: "verb phrase",
        pronunciation_vi: "pa-ka-ZAT u-va-ZHE-ni-ye",
        pronunciation_en: "pa-ka-ZAT oo-va-ZHE-nee-yeh",
      },
      {
        word: "уровень",
        romanization: "uroven",
        en: "level",
        vi: "mức / cấp độ",
        pos: "noun",
        pronunciation_vi: "U-ra-vyen",
        pronunciation_en: "OO-ra-vyen",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Bạn có thể làm rõ điểm này không?", answer: "Не могли бы вы уточнить этот момент?" },
          { prompt: "Vấn đề không phải ở sự trang trọng, mà ở việc không biết chọn đúng mức.", answer: "Проблема не в формальности, а в неумении выбрать нужный уровень." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền câu xin lịch sự nhất.",
        instruction_en: "Fill in the most polite request frame.",
        items: [{ prompt: "Не _____ бы вы уточнить этот момент?", answer: "могли" }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt có hệ xưng hô phức tạp; tiếng Nga gói gọn vào ты/вы, tone và câu mềm. Dùng `не могли бы вы` thay vì mệnh lệnh khi cần lịch sự.",
    cultural_notes_en:
      "Vietnamese has a complex pronoun system; Russian compresses it into ты/вы, tone, and softening. Use `не могли бы вы` instead of an imperative when politeness matters.",
    tip_advice_vi:
      "Trước khi viết/nói, hỏi: ai là người nhận? Chọn register theo vai và ngữ cảnh, đừng mặc định luôn trang trọng.",
    tip_advice_en:
      "Before writing or speaking, ask: who is the audience? Choose register by role and context; do not default to maximum formality.",
  },
  {
    id: "russian_c1_academic_collocations",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Cụm từ học thuật và chuyên nghiệp (collocations)",
    title_en: "C1: Academic and professional collocations",
    intro_vi:
      "C1 nghe tự nhiên nhờ học cụm, không học từ rời. Bài này gom các collocation hay dùng trong báo cáo, luận và họp.",
    intro_en:
      "C1 sounds natural through collocations, not isolated words. This lesson collects high-frequency collocations for reports, essays, and meetings.",
    sentences: [
      {
        russian: "Нужно принять решение и установить чёткие правила.",
        romanization: "Nuzhno prinyat reshenie i ustanovit chyotkie pravila.",
        en: "We need to make a decision and set clear rules.",
        vi: "Cần đưa ra quyết định và thiết lập quy tắc rõ ràng.",
        pronunciation_focus: ["принять решение = đưa ra quyết định (collocation)", "установить правила = thiết lập quy tắc", "чёткие có ё nhấn"],
        pronunciation_focus_en: ["принять решение means to make a decision (collocation)", "установить правила means to set rules", "чёткие has stressed ё"],
      },
      {
        russian: "Это оказывает влияние на качество работы.",
        romanization: "Eto okazyvaet vliyanie na kachestvo raboty.",
        en: "This has an influence on the quality of work.",
        vi: "Điều này ảnh hưởng đến chất lượng công việc.",
        pronunciation_focus: ["оказывать влияние на = ảnh hưởng đến (collocation)", "качество работы = chất lượng công việc", "на + đối cách"],
        pronunciation_focus_en: ["оказывать влияние на means to have influence on (collocation)", "качество работы means quality of work", "на + accusative"],
      },
      {
        russian: "Анализ позволяет сделать вывод о причинах.",
        romanization: "Analiz pozvolyaet sdelat vyvod o prichinakh.",
        en: "The analysis allows us to draw a conclusion about the causes.",
        vi: "Phân tích cho phép rút ra kết luận về nguyên nhân.",
        pronunciation_focus: ["сделать вывод = rút ra kết luận (collocation)", "позволяет + nguyên mẫu", "о причинах là giới cách"],
        pronunciation_focus_en: ["сделать вывод means to draw a conclusion (collocation)", "позволяет + infinitive", "о причинах is prepositional"],
      },
      {
        russian: "Этот фактор играет важную роль в адаптации.",
        romanization: "Etot faktor igraet vazhnuyu rol v adaptatsii.",
        en: "This factor plays an important role in adaptation.",
        vi: "Yếu tố này đóng vai trò quan trọng trong việc thích nghi.",
        pronunciation_focus: ["играть важную роль = đóng vai trò quan trọng (collocation)", "фактор = yếu tố", "в адаптации là giới cách"],
        pronunciation_focus_en: ["играть важную роль means to play an important role (collocation)", "фактор means factor", "в адаптации is prepositional"],
      },
    ],
    vocabulary: [
      {
        word: "принять решение",
        romanization: "prinyat reshenie",
        en: "to make a decision",
        vi: "đưa ra quyết định",
        pos: "collocation",
        pronunciation_vi: "pri-NYAT rye-SHE-ni-ye",
        pronunciation_en: "pri-NYAT rye-SHE-nee-yeh",
      },
      {
        word: "оказывать влияние на",
        romanization: "okazyvat vliyanie na",
        en: "to have influence on",
        vi: "ảnh hưởng đến",
        pos: "collocation",
        pronunciation_vi: "a-KA-zư-vat vli-YA-ni-ye na",
        pronunciation_en: "a-KA-zi-vat vlee-YA-nee-yeh na",
      },
      {
        word: "сделать вывод",
        romanization: "sdelat vyvod",
        en: "to draw a conclusion",
        vi: "rút ra kết luận",
        pos: "collocation",
        pronunciation_vi: "SDYE-lat VƯ-vad",
        pronunciation_en: "SDYE-lat VI-vad",
      },
      {
        word: "играть важную роль",
        romanization: "igrat vazhnuyu rol",
        en: "to play an important role",
        vi: "đóng vai trò quan trọng",
        pos: "collocation",
        pronunciation_vi: "i-GRAT VAZH-nu-yu ROL",
        pronunciation_en: "ee-GRAT VAZH-noo-yu ROL",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Ghép cụm tiếng Nga với nghĩa tiếng Việt.",
        instruction_en: "Match the Russian collocation with its Vietnamese meaning.",
        items: [
          { prompt: "принять решение", answer: "đưa ra quyết định" },
          { prompt: "сделать вывод", answer: "rút ra kết luận" },
          { prompt: "играть важную роль", answer: "đóng vai trò quan trọng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Điều này ảnh hưởng đến chất lượng công việc.", answer: "Это оказывает влияние на качество работы." },
        ],
      },
    ],
    cultural_notes_vi:
      "Lỗi C1 phổ biến là dịch từng từ: `делать решение` (sai) thay vì `принять решение`. Học động từ đi kèm đúng với mỗi danh từ.",
    cultural_notes_en:
      "A common C1 error is word-for-word translation: `делать решение` (wrong) instead of `принять решение`. Learn the correct verb that pairs with each noun.",
    tip_advice_vi:
      "Lưu collocation theo cặp động từ + danh từ, không lưu từ rời. Khi viết, ráp sẵn các cụm này lại.",
    tip_advice_en:
      "Store collocations as verb + noun pairs, not single words. When writing, assemble from these ready-made chunks.",
  },
];

export default lessons;
